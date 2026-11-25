import nodemailer from "nodemailer";

/**
 * Multi-Channel Instant Notification Engine for VIMS Academy FDE Cohort
 * Fires automatically on:
 *   1. New Lead Captured (before payment)
 *   2. Razorpay Payment Confirmed (sends receipt to Student + alert to Owner)
 *   3. Payment Drop-off (so Owner can follow up on WhatsApp immediately)
 */

function getTransporter() {
  const host = (process.env.SMTP_HOST || "").trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASSWORD || process.env.SMTP_PASS || "").trim();

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

function getFromAddress() {
  const user = (process.env.SMTP_USER || "").trim();
  const rawFrom = (process.env.SMTP_FROM || "").trim();
  if (rawFrom) return rawFrom;
  return user ? `VIMS Academy <${user}>` : "VIMS Academy <noreply@vimsenterprise.com>";
}

function getOwnerEmails() {
  const raw =
    (process.env.OWNER_NOTIFY_EMAIL || "").trim() ||
    (process.env.SMTP_USER || "").trim() ||
    "vims2023@gmail.com";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function sendEmail({ to, subject, html, text }) {
  const transporter = getTransporter();
  if (!transporter || !to) {
    return { sent: false, reason: "smtp_not_configured" };
  }
  try {
    const info = await transporter.sendMail({
      from: getFromAddress(),
      to,
      subject,
      text,
      html
    });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error("[FDE-NOTIFY] Email failed:", err?.message || err);
    return { sent: false, reason: err?.message || "smtp_error" };
  }
}

async function sendPhonePush({ title, message, priority = "high", clickUrl, tags = [] }) {
  const topic = (process.env.NTFY_TOPIC || "").trim();
  if (!topic) return { sent: false, reason: "ntfy_not_configured" };

  try {
    const headers = {
      Title: title,
      Priority: priority,
      Tags: tags.join(",")
    };
    if (clickUrl) headers.Click = clickUrl;

    const res = await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {
      method: "POST",
      headers,
      body: message
    });
    return { sent: res.ok, status: res.status };
  } catch (err) {
    console.error("[FDE-NOTIFY] Phone push failed:", err?.message || err);
    return { sent: false, reason: err?.message || "push_error" };
  }
}

async function sendWebhook(eventType, payload) {
  const url = (process.env.NOTIFY_WEBHOOK_URL || "").trim();
  if (!url) return { sent: false, reason: "webhook_not_configured" };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType, timestamp: new Date().toISOString(), ...payload })
    });
    return { sent: res.ok, status: res.status };
  } catch (err) {
    return { sent: false, reason: err?.message || "webhook_error" };
  }
}

function waDirectLink(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return `https://wa.me/${digits.length === 10 ? "91" + digits : digits}`;
}

export async function notifyLeadCaptured(reg) {
  const ownerEmails = getOwnerEmails().join(",");
  const waUrl = waDirectLink(reg.phone);
  const utmSummary = reg.utm?.utm_campaign || reg.utm?.utm_source || "Direct / Organic";

  const text = [
    `NEW FDE LEAD CAPTURED`,
    `Name: ${reg.name}`,
    `Phone: ${reg.phone}`,
    `Email: ${reg.email}`,
    `Profile: ${reg.profile}`,
    `City: ${reg.city}`,
    `Ad Source: ${utmSummary}`,
    `WhatsApp: ${waUrl}`,
    `Registration ID: ${reg.id}`
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;background:#FAF6F0;border:1px solid #E8DFD3;border-radius:12px;">
      <div style="font-size:12px;letter-spacing:1.2px;color:#6A244C;font-weight:bold;text-transform:uppercase;">VIMS Academy · FDE Lead Alert</div>
      <h2 style="margin:6px 0 14px;color:#22191D;">New Student Lead Received</h2>
      <table style="width:100%;border-collapse:collapse;background:#FFFFFF;border-radius:8px;overflow:hidden;">
        <tr><td style="padding:10px 14px;color:#63555B;border-bottom:1px solid #F1EAE0;">Name</td><td style="padding:10px 14px;font-weight:bold;color:#22191D;border-bottom:1px solid #F1EAE0;">${reg.name}</td></tr>
        <tr><td style="padding:10px 14px;color:#63555B;border-bottom:1px solid #F1EAE0;">Mobile / WhatsApp</td><td style="padding:10px 14px;font-weight:bold;color:#22191D;border-bottom:1px solid #F1EAE0;">${reg.phone}</td></tr>
        <tr><td style="padding:10px 14px;color:#63555B;border-bottom:1px solid #F1EAE0;">Email</td><td style="padding:10px 14px;color:#22191D;border-bottom:1px solid #F1EAE0;">${reg.email}</td></tr>
        <tr><td style="padding:10px 14px;color:#63555B;border-bottom:1px solid #F1EAE0;">Background</td><td style="padding:10px 14px;color:#22191D;border-bottom:1px solid #F1EAE0;">${reg.profile} (${reg.city})</td></tr>
        <tr><td style="padding:10px 14px;color:#63555B;">Ad Campaign</td><td style="padding:10px 14px;color:#22191D;">${utmSummary}</td></tr>
      </table>
      <div style="margin-top:16px;">
        <a href="${waUrl}" style="display:inline-block;background:#1A6B54;color:#FFFFFF;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:bold;font-size:13px;">Message on WhatsApp</a>
        <a href="https://fde.vimsenterprise.com/admin" style="display:inline-block;margin-left:8px;background:#6A244C;color:#FFFFFF;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:bold;font-size:13px;">Open Leads Dashboard</a>
      </div>
    </div>
  `;

  const [emailRes, pushRes, hookRes] = await Promise.all([
    sendEmail({
      to: ownerEmails,
      subject: `🔔 New FDE Lead: ${reg.name} (${reg.phone})`,
      text,
      html
    }),
    sendPhonePush({
      title: `New FDE Lead: ${reg.name}`,
      message: `${reg.phone} · ${reg.profile} (${reg.city})\nSource: ${utmSummary}\nTap to open WhatsApp`,
      priority: "high",
      clickUrl: waUrl,
      tags: ["bell", "mortar_board"]
    }),
    sendWebhook("lead_captured", { registration: reg })
  ]);

  return { email: emailRes, push: pushRes, webhook: hookRes };
}

export async function notifyPaymentConfirmed(reg, cohort) {
  const ownerEmails = getOwnerEmails().join(",");
  const waUrl = waDirectLink(reg.phone);

  const ownerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;background:#FAF6F0;border:1px solid #D4AF6A;border-radius:12px;">
      <div style="font-size:12px;letter-spacing:1.2px;color:#1A6B54;font-weight:bold;text-transform:uppercase;">PAYMENT CONFIRMED · RAZORPAY LIVE</div>
      <h2 style="margin:6px 0 14px;color:#22191D;">₹${reg.totalInr.toLocaleString("en-IN")} Received (Seat #${reg.seatNumber} / ${cohort.totalSeats})</h2>
      <table style="width:100%;border-collapse:collapse;background:#FFFFFF;border-radius:8px;overflow:hidden;">
        <tr><td style="padding:10px 14px;color:#63555B;border-bottom:1px solid #F1EAE0;">Student Name</td><td style="padding:10px 14px;font-weight:bold;color:#22191D;border-bottom:1px solid #F1EAE0;">${reg.name}</td></tr>
        <tr><td style="padding:10px 14px;color:#63555B;border-bottom:1px solid #F1EAE0;">Mobile / WhatsApp</td><td style="padding:10px 14px;font-weight:bold;color:#22191D;border-bottom:1px solid #F1EAE0;">${reg.phone}</td></tr>
        <tr><td style="padding:10px 14px;color:#63555B;border-bottom:1px solid #F1EAE0;">Email</td><td style="padding:10px 14px;color:#22191D;border-bottom:1px solid #F1EAE0;">${reg.email}</td></tr>
        <tr><td style="padding:10px 14px;color:#63555B;border-bottom:1px solid #F1EAE0;">Payment ID</td><td style="padding:10px 14px;font-family:monospace;color:#22191D;border-bottom:1px solid #F1EAE0;">${reg.paymentId}</td></tr>
        <tr><td style="padding:10px 14px;color:#63555B;">Live Cohort Count</td><td style="padding:10px 14px;font-weight:bold;color:#6A244C;">${cohort.enrolledSeats} / ${cohort.totalSeats} Booked (${cohort.remainingSeats} left)</td></tr>
      </table>
      <div style="margin-top:16px;">
        <a href="${waUrl}" style="display:inline-block;background:#1A6B54;color:#FFFFFF;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:bold;font-size:13px;">Welcome Student on WhatsApp</a>
        <a href="https://fde.vimsenterprise.com/admin" style="display:inline-block;margin-left:8px;background:#6A244C;color:#FFFFFF;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:bold;font-size:13px;">Open Leads Dashboard</a>
      </div>
    </div>
  `;

  const studentHtml = `
    <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;padding:24px;background:#FAF6F0;border:1px solid #E5D9C8;border-radius:14px;">
      <div style="font-size:12px;letter-spacing:1.5px;color:#6A244C;font-weight:bold;text-transform:uppercase;">VIMS ACADEMY · POWERED BY VIMS ENTERPRISE</div>
      <h1 style="margin:8px 0 12px;color:#22191D;font-size:24px;">Your Seat (#${reg.seatNumber} of ${cohort.totalSeats}) Is Confirmed!</h1>
      <p style="color:#4A3B41;font-size:14px;line-height:1.6;">
        Dear <strong>${reg.name}</strong>,<br/>
        Thank you for enrolling in the <strong>Forward Deployment Engineer (FDE) Live Program</strong>. Your payment has been verified and your seat is officially locked.
      </p>
      <div style="background:#FFFFFF;border:1px solid #E8DFD3;border-radius:10px;padding:16px;margin:18px 0;">
        <div style="font-size:12px;font-weight:bold;color:#6A244C;text-transform:uppercase;margin-bottom:8px;">Program &amp; Payment Summary</div>
        <p style="margin:4px 0;font-size:13px;color:#22191D;"><strong>Start Date:</strong> Saturday, 12th December 2026 · 10:00 AM IST</p>
        <p style="margin:4px 0;font-size:13px;color:#22191D;"><strong>Medium:</strong> 3-Day Live Online Workshop in Tamil</p>
        <p style="margin:4px 0;font-size:13px;color:#22191D;"><strong>Assigned Seat:</strong> #${reg.seatNumber} / ${cohort.totalSeats}</p>
        <p style="margin:4px 0;font-size:13px;color:#22191D;"><strong>Registration ID:</strong> ${reg.id}</p>
        <p style="margin:4px 0;font-size:13px;color:#22191D;"><strong>Razorpay Payment ID:</strong> ${reg.paymentId}</p>
        <p style="margin:8px 0 0;font-size:14px;color:#1A6B54;"><strong>Total Paid:</strong> ₹${reg.totalInr.toLocaleString("en-IN")} (₹${reg.baseInr.toLocaleString("en-IN")} + 18% GST ₹${reg.gstInr})</p>
      </div>
      <p style="color:#63555B;font-size:13px;line-height:1.6;">
        Our team will share your Live Class Joining Link and Cohort WhatsApp Group invite before the session begins on 12th December 2026.
      </p>
      <p style="margin-top:18px;font-size:12px;color:#85757C;">Warm regards,<br/><strong>VIMS Academy · VIMS Enterprise</strong></p>
    </div>
  `;

  const [ownerEmailRes, studentEmailRes, pushRes, hookRes] = await Promise.all([
    sendEmail({
      to: ownerEmails,
      subject: `💰 PAID ₹${reg.totalInr}: ${reg.name} locked Seat #${reg.seatNumber}/${cohort.totalSeats}`,
      text: `Payment confirmed for ${reg.name} (${reg.phone}) - ₹${reg.totalInr} - Payment ID: ${reg.paymentId} - Seat #${reg.seatNumber}/${cohort.totalSeats}`,
      html: ownerHtml
    }),
    sendEmail({
      to: reg.email,
      subject: `Seat Confirmed (#${reg.seatNumber}): Forward Deployment Engineer (FDE) Batch · VIMS Academy`,
      text: `Hi ${reg.name}, your seat #${reg.seatNumber} for the VIMS Academy FDE Live Program starting 12th December 2026 is confirmed. Payment Ref: ${reg.paymentId}. Total Paid: ₹${reg.totalInr}.`,
      html: studentHtml
    }),
    sendPhonePush({
      title: `PAID ₹${reg.totalInr} (Seat #${reg.seatNumber}/${cohort.totalSeats})`,
      message: `${reg.name} (${reg.phone})\nPayment ID: ${reg.paymentId}\nRemaining seats: ${cohort.remainingSeats}`,
      priority: "urgent",
      clickUrl: waUrl,
      tags: ["moneybag", "white_check_mark"]
    }),
    sendWebhook("payment_confirmed", { registration: reg, cohort })
  ]);

  return {
    ownerEmail: ownerEmailRes,
    studentEmail: studentEmailRes,
    push: pushRes,
    webhook: hookRes
  };
}

export async function notifyPaymentDropoff(reg, reason) {
  const waUrl = waDirectLink(reg.phone);
  return sendPhonePush({
    title: `Payment Drop-off: ${reg.name}`,
    message: `${reg.phone} closed checkout (${reason}). Tap to follow up on WhatsApp.`,
    priority: "default",
    clickUrl: waUrl,
    tags: ["warning"]
  });
}
