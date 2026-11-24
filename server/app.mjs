import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import {
  notifyLeadCaptured,
  notifyPaymentConfirmed,
  notifyPaymentDropoff
} from "./notify.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TOTAL_SEATS = Number(process.env.TOTAL_SEATS || 50);
const INITIAL_ENROLLED_SEATS = Number(process.env.INITIAL_ENROLLED_SEATS || 10);
const BASE_FEE_INR = Number(process.env.COURSE_BASE_FEE_INR || 2999);
const GST_PERCENT = Number(process.env.COURSE_GST_PERCENT || 18);
const GST_INR = Math.round((BASE_FEE_INR * GST_PERCENT) / 100);
const TOTAL_INR = BASE_FEE_INR + GST_INR;
const TOTAL_PAISE = TOTAL_INR * 100;

const REG_START_ISO = process.env.VITE_REG_START_ISO || "2026-11-24T16:00:00+05:30";
const REG_END_ISO = process.env.VITE_REG_END_ISO || "2026-12-12T10:00:00+05:30";

// Storage file (uses /tmp on serverless read-only environments, server/data locally)
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isServerless ? "/tmp/fde-vims-data" : path.join(__dirname, "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const initial = {
      registrations: [],
      telemetry: {
        visitors: {},
        sectionCounts: {},
        scrollCounts: {},
        ctaClicks: {},
        eventsTotal: 0
      }
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), "utf8");
  }
}

function readStore() {
  ensureStore();
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
  } catch {
    return {
      registrations: [],
      telemetry: { visitors: {}, sectionCounts: {}, scrollCounts: {}, ctaClicks: {}, eventsTotal: 0 }
    };
  }
}

function writeStore(data) {
  ensureStore();
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
}

function normalizeIndianPhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

function computeCohortStatus(store) {
  const paidRegistrations = store.registrations.filter((r) => r.status === "paid");
  const enrolledSeats = Math.min(TOTAL_SEATS, INITIAL_ENROLLED_SEATS + paidRegistrations.length);
  const remainingSeats = Math.max(0, TOTAL_SEATS - enrolledSeats);
  const hasRazorpayKeys = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

  // Anonymized recent joiners (first name + city/role) for authentic live social proof
  const recentConfirmed = paidRegistrations
    .slice(-3)
    .reverse()
    .map((r) => ({
      firstName: String(r.name || "").trim().split(/\s+/)[0] || "Student",
      city: r.city || "Tamil Nadu",
      seatNumber: r.seatNumber,
      paidAt: r.paidAt
    }));

  return {
    totalSeats: TOTAL_SEATS,
    seedSeats: INITIAL_ENROLLED_SEATS,
    confirmedNewCount: paidRegistrations.length,
    enrolledSeats,
    remainingSeats,
    isSoldOut: remainingSeats <= 0,
    pricing: {
      baseInr: BASE_FEE_INR,
      gstPercent: GST_PERCENT,
      gstInr: GST_INR,
      totalInr: TOTAL_INR,
      totalPaise: TOTAL_PAISE,
      currency: "INR"
    },
    window: {
      startIso: REG_START_ISO,
      endIso: REG_END_ISO,
      serverNowIso: new Date().toISOString()
    },
    paymentMode: hasRazorpayKeys ? "razorpay_live" : "sandbox_ready",
    recentConfirmed
  };
}

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "256kb" }));

  // 1. Live Cohort Status (Seats + Countdown Window + Pricing)
  app.get("/api/fde/cohort-status", (_req, res) => {
    const store = readStore();
    res.json(computeCohortStatus(store));
  });

  // 2. Visitor Funnel Telemetry (Scroll depth, section views, CTA clicks, UTMs)
  app.post("/api/fde/telemetry", (req, res) => {
    const { visitorId, event, section, scrollDepth, ctaSource, utm } = req.body || {};
    if (!visitorId || !event) {
      return res.status(200).json({ ok: true });
    }
    const store = readStore();
    const t = store.telemetry;
    t.eventsTotal = (t.eventsTotal || 0) + 1;

    if (!t.visitors[visitorId]) {
      t.visitors[visitorId] = {
        firstSeenAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        utm: utm || {},
        sections: [],
        maxScroll: 0,
        clickedRegister: false
      };
    }
    const v = t.visitors[visitorId];
    v.lastSeenAt = new Date().toISOString();

    if (section && !v.sections.includes(section)) {
      v.sections.push(section);
      t.sectionCounts[section] = (t.sectionCounts[section] || 0) + 1;
    }
    if (typeof scrollDepth === "number" && scrollDepth > (v.maxScroll || 0)) {
      v.maxScroll = scrollDepth;
      const key = `${scrollDepth}%`;
      t.scrollCounts[key] = (t.scrollCounts[key] || 0) + 1;
    }
    if (event === "cta_click" && ctaSource) {
      v.clickedRegister = true;
      t.ctaClicks[ctaSource] = (t.ctaClicks[ctaSource] || 0) + 1;
    }

    writeStore(store);
    return res.json({ ok: true });
  });

  // 3. Step 1 Lead Capture (Saves lead immediately before payment so zero leads are lost!)
  app.post("/api/fde/register", (req, res) => {
    const {
      name,
      phone,
      email,
      profile,
      city,
      experience,
      utm,
      visitorId,
      fde_hp_trap
    } = req.body || {};

    // Honeypot anti-bot trap
    if (fde_hp_trap) {
      return res.status(400).json({ error: "Invalid submission." });
    }

    const cleanName = String(name || "").trim();
    const cleanPhone = normalizeIndianPhone(phone);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanCity = String(city || "").trim().slice(0, 60);

    const fields = {};
    if (cleanName.length < 2 || cleanName.length > 80) {
      fields.name = "Please enter your full name (2 to 80 characters).";
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      fields.phone = "Please enter a valid 10-digit Indian mobile number.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail) || cleanEmail.length > 160) {
      fields.email = "Please enter a valid email address (joining link & GST invoice go here).";
    }

    if (Object.keys(fields).length > 0) {
      return res.status(400).json({
        error: "Please check the highlighted fields below.",
        fields
      });
    }

    const store = readStore();
    const cohort = computeCohortStatus(store);
    if (cohort.isSoldOut) {
      return res.status(409).json({
        error: "All 50 cohort seats have been filled."
      });
    }

    const registrationId = `FDE-${Date.now().toString(36).toUpperCase()}-${crypto
      .randomBytes(2)
      .toString("hex")
      .toUpperCase()}`;
    const leadEventId = `lead_${registrationId}`;

    const record = {
      id: registrationId,
      name: cleanName,
      phone: `+91${cleanPhone}`,
      email: cleanEmail,
      profile: String(profile || "student").slice(0, 40),
      city: cleanCity || "Tamil Nadu",
      experience: String(experience || "0").slice(0, 20),
      status: "lead_captured",
      baseInr: BASE_FEE_INR,
      gstInr: GST_INR,
      totalInr: TOTAL_INR,
      utm: utm || {},
      visitorId: visitorId || null,
      leadEventId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.registrations.push(record);
    writeStore(store);

    // Fire asynchronous owner email + mobile push alert immediately on every new lead
    void notifyLeadCaptured(record);

    return res.json({
      registrationId,
      leadEventId,
      pricing: cohort.pricing
    });
  });

  // 4. Create Razorpay Order (Live Razorpay API when keys present, Sandbox test order locally)
  app.post("/api/fde/razorpay/create-order", async (req, res) => {
    const { registrationId } = req.body || {};
    if (!registrationId) {
      return res.status(400).json({ error: "Registration ID missing." });
    }

    const store = readStore();
    const reg = store.registrations.find((r) => r.id === registrationId);
    if (!reg) {
      return res.status(404).json({ error: "Registration record not found." });
    }

    const cohort = computeCohortStatus(store);
    if (cohort.isSoldOut && reg.status !== "paid") {
      return res.status(409).json({ error: "All 50 cohort seats have been filled." });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret) {
      try {
        const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            Authorization: `Basic ${authHeader}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: TOTAL_PAISE,
            currency: "INR",
            receipt: registrationId,
            notes: {
              program: "VIMS_FDE_TAMIL_8W",
              registration_id: registrationId,
              student_name: reg.name,
              student_phone: reg.phone,
              base_fee_inr: String(BASE_FEE_INR),
              gst_inr: String(GST_INR)
            }
          })
        });

        if (!rzpRes.ok) {
          const errText = await rzpRes.text();
          return res.status(502).json({
            error: "Unable to create Razorpay order right now. Please try again.",
            details: errText.slice(0, 200)
          });
        }

        const order = await rzpRes.json();
        reg.razorpayOrderId = order.id;
        reg.status = reg.status === "paid" ? "paid" : "checkout_initiated";
        reg.updatedAt = new Date().toISOString();
        writeStore(store);

        return res.json({
          mode: "razorpay",
          keyId,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          checkoutEventId: `ic_${registrationId}`
        });
      } catch (err) {
        return res.status(502).json({
          error: "Payment gateway connection timed out. Please retry in a moment."
        });
      }
    }

    // Local / Staging Sandbox Mode (when live Razorpay keys are not yet in .env)
    const sandboxOrderId = `order_sandbox_${crypto.randomBytes(6).toString("hex")}`;
    reg.razorpayOrderId = sandboxOrderId;
    reg.status = reg.status === "paid" ? "paid" : "checkout_initiated";
    reg.updatedAt = new Date().toISOString();
    writeStore(store);

    return res.json({
      mode: "sandbox",
      orderId: sandboxOrderId,
      amount: TOTAL_PAISE,
      currency: "INR",
      checkoutEventId: `ic_${registrationId}`
    });
  });

  // 5. Verify Payment & Increment Live Cohort Seat Count (10 -> 11 -> 12...)
  app.post("/api/fde/razorpay/verify", (req, res) => {
    const {
      registrationId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      sandbox_method
    } = req.body || {};

    const store = readStore();
    const reg = store.registrations.find((r) => r.id === registrationId);
    if (!reg) {
      return res.status(404).json({ error: "Registration record not found." });
    }

    // Idempotent check: if already paid, return existing seat without incrementing twice
    if (reg.status === "paid") {
      const cohort = computeCohortStatus(store);
      return res.json({
        success: true,
        alreadyVerified: true,
        registrationId: reg.id,
        paymentId: reg.paymentId,
        seatNumber: reg.seatNumber,
        enrolledSeats: cohort.enrolledSeats,
        remainingSeats: cohort.remainingSeats,
        purchaseEventId: reg.purchaseEventId,
        amountInr: TOTAL_INR,
        baseInr: BASE_FEE_INR,
        gstInr: GST_INR
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (keySecret) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: "Incomplete payment verification fields." });
      }
      const expectedSig = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      if (expectedSig !== razorpay_signature) {
        return res.status(400).json({ error: "Payment signature verification failed." });
      }
    }

    const currentPaidCount = store.registrations.filter((r) => r.status === "paid").length;
    const assignedSeatNumber = Math.min(TOTAL_SEATS, INITIAL_ENROLLED_SEATS + currentPaidCount + 1);
    const paymentId =
      razorpay_payment_id || `pay_sandbox_${crypto.randomBytes(5).toString("hex")}`;
    const purchaseEventId = `pur_${reg.id}`;

    reg.status = "paid";
    reg.paymentId = paymentId;
    reg.paymentMethod = sandbox_method || "razorpay";
    reg.seatNumber = assignedSeatNumber;
    reg.purchaseEventId = purchaseEventId;
    reg.paidAt = new Date().toISOString();
    reg.updatedAt = new Date().toISOString();

    writeStore(store);
    const updatedCohort = computeCohortStatus(store);

    // Fire instant receipt email to student + payment alert email & mobile push to owner
    void notifyPaymentConfirmed(reg, updatedCohort);

    return res.json({
      success: true,
      alreadyVerified: false,
      registrationId: reg.id,
      paymentId,
      seatNumber: assignedSeatNumber,
      enrolledSeats: updatedCohort.enrolledSeats,
      remainingSeats: updatedCohort.remainingSeats,
      purchaseEventId,
      amountInr: TOTAL_INR,
      baseInr: BASE_FEE_INR,
      gstInr: GST_INR
    });
  });

  // 6. Track Payment Abandonment / Drop-off for Remarketing & Follow-up
  app.post("/api/fde/payment-dropoff", (req, res) => {
    const { registrationId, reason } = req.body || {};
    const store = readStore();
    const reg = store.registrations.find((r) => r.id === registrationId);
    if (reg && reg.status !== "paid") {
      reg.status = "payment_abandoned";
      reg.dropoffReason = String(reason || "modal_dismissed").slice(0, 80);
      reg.updatedAt = new Date().toISOString();
      writeStore(store);
      void notifyPaymentDropoff(reg, reg.dropoffReason);
    }
    return res.json({ ok: true });
  });

  // 7. Owner Funnel & Lead Summary (Shows how far visitors go + who registered/paid)
  app.get("/api/fde/admin/summary", (req, res) => {
    const expectedToken = process.env.ADMIN_TOKEN || "vims-fde-2026";
    const provided = req.headers["x-admin-token"] || req.query.token;
    if (provided !== expectedToken) {
      return res.status(401).json({ error: "Unauthorized admin token." });
    }

    const store = readStore();
    const cohort = computeCohortStatus(store);
    const visitorsList = Object.values(store.telemetry.visitors || {});
    const regs = [...store.registrations].reverse();
    const paidRegs = regs.filter((r) => r.status === "paid");
    const totalRevenueInr = paidRegs.reduce((sum, r) => sum + Number(r.totalInr || TOTAL_INR), 0);

    const funnel = {
      uniqueVisitors: visitorsList.length,
      sectionReach: store.telemetry.sectionCounts || {},
      scrollReach: store.telemetry.scrollCounts || {},
      ctaClicksByPlacement: store.telemetry.ctaClicks || {},
      leadsCaptured: regs.length,
      checkoutInitiated: regs.filter(
        (r) => r.status === "checkout_initiated" || r.status === "payment_abandoned" || r.status === "paid"
      ).length,
      paymentAbandoned: regs.filter((r) => r.status === "payment_abandoned").length,
      paidEnrollments: paidRegs.length,
      totalRevenueInr
    };

    const channels = {
      razorpayLive: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      smtpReady: Boolean(
        process.env.SMTP_HOST &&
          process.env.SMTP_USER &&
          (process.env.SMTP_PASSWORD || process.env.SMTP_PASS)
      ),
      pushTopic: (process.env.NTFY_TOPIC || "").trim() || null
    };

    return res.json({
      cohort,
      funnel,
      channels,
      registrations: regs
    });
  });

  return app;
}
