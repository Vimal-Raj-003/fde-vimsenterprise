/**
 * Full-Funnel Meta Pixel ("Pixel Method") + Visitor Journey Telemetry Engine
 *
 * Tracks the complete ad-click to payment funnel:
 * 1. PageView (automatic on entry with UTM + fbclid capture)
 * 2. ViewContent (Course offer loaded with INR value)
 * 3. FDE_SectionView & FDE_ScrollDepth (25%, 50%, 75%, 100% + exact sections viewed)
 * 4. FDE_RegisterClick (records exact CTA button clicked)
 * 5. Lead (fires immediately when student submits Name + Phone + Email in Step 1)
 * 6. InitiateCheckout (fires when Razorpay order opens for Rs. 2,999 + GST)
 * 7. Purchase & CompleteRegistration (fires ONLY after signature-verified payment, deduplicated by eventID)
 * 8. FDE_PaymentDropoff (fires if checkout modal is closed without completing payment)
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    __fdePixelLog?: Array<{
      timestamp: string;
      type: "standard" | "custom";
      event: string;
      params?: Record<string, unknown>;
      eventId?: string;
    }>;
  }
}

export interface UtmAttribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  referrer?: string;
  landing_url?: string;
}

const DEFAULT_PIXEL_IDS = ["4439327462948047", "1395642289095466"];
const VISITOR_KEY = "vims_fde_visitor_id";
const UTM_KEY = "vims_fde_utm";

let initialized = false;
const firedSections = new Set<string>();
const firedScrollThresholds = new Set<number>();

export function getPixelIds(): string[] {
  const raw = import.meta.env.VITE_META_PIXEL_IDS as string | undefined;
  if (raw && raw.trim().length > 0) {
    return raw
      .split(",")
      .map((id) => id.trim())
      .filter((id) => /^\d{8,20}$/.test(id));
  }
  return DEFAULT_PIXEL_IDS;
}

export function getVisitorId(): string {
  try {
    let existing = localStorage.getItem(VISITOR_KEY);
    if (!existing) {
      existing = `vis_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(VISITOR_KEY, existing);
    }
    return existing;
  } catch {
    return `vis_mem_${Math.random().toString(36).slice(2, 9)}`;
  }
}

export function captureUtmAttribution(): UtmAttribution {
  try {
    const params = new URLSearchParams(window.location.search);
    const current: UtmAttribution = {};
    const keys: Array<keyof UtmAttribution> = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid"
    ];
    let hasQueryAttribution = false;
    for (const k of keys) {
      const val = params.get(k);
      if (val) {
        current[k] = val;
        hasQueryAttribution = true;
      }
    }

    const storedRaw = sessionStorage.getItem(UTM_KEY);
    if (!hasQueryAttribution && storedRaw) {
      return JSON.parse(storedRaw) as UtmAttribution;
    }

    const merged: UtmAttribution = {
      ...(storedRaw ? (JSON.parse(storedRaw) as UtmAttribution) : {}),
      ...current,
      referrer: document.referrer || "direct",
      landing_url: window.location.href
    };
    sessionStorage.setItem(UTM_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return {};
  }
}

function recordLocalPixelLog(
  type: "standard" | "custom",
  event: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  if (!window.__fdePixelLog) {
    window.__fdePixelLog = [];
  }
  window.__fdePixelLog.push({
    timestamp: new Date().toISOString(),
    type,
    event,
    params,
    eventId
  });
}

async function sendTelemetry(payload: Record<string, unknown>) {
  try {
    await fetch("/api/fde/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId: getVisitorId(),
        utm: captureUtmAttribution(),
        ...payload
      }),
      keepalive: true
    });
  } catch {
    // Non-blocking telemetry
  }
}

export function initMetaPixels(basePriceInr = 2999) {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  captureUtmAttribution();
  const pixelIds = getPixelIds();

  // Inject official Meta fbevents.js snippet safely
  if (!window.fbq) {
    const n: (...args: unknown[]) => void = function (...args: unknown[]) {
      // @ts-expect-error Meta queue convention
      if (n.callMethod) {
        // @ts-expect-error Meta queue convention
        n.callMethod(...args);
      } else {
        // @ts-expect-error Meta queue convention
        n.queue.push(args);
      }
    };
    if (!window._fbq) window._fbq = n;
    // @ts-expect-error Meta queue convention
    n.push = n;
    // @ts-expect-error Meta queue convention
    n.loaded = true;
    // @ts-expect-error Meta queue convention
    n.version = "2.0";
    // @ts-expect-error Meta queue convention
    n.queue = [];
    window.fbq = n;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  for (const id of pixelIds) {
    window.fbq?.("init", id);
  }

  // 1. PageView
  window.fbq?.("track", "PageView");
  recordLocalPixelLog("standard", "PageView");

  // 2. ViewContent (Course landing page viewed)
  const viewParams = {
    content_name: "Forward Deployment Engineer (FDE) - 8 Week Tamil Cohort",
    content_category: "AI Engineering Course",
    content_ids: ["vims-fde-tamil-8w"],
    content_type: "product",
    value: basePriceInr,
    currency: "INR"
  };
  window.fbq?.("track", "ViewContent", viewParams);
  recordLocalPixelLog("standard", "ViewContent", viewParams);
  void sendTelemetry({ event: "page_view", section: "hero" });
}

export function trackSectionReached(sectionId: string) {
  if (firedSections.has(sectionId)) return;
  firedSections.add(sectionId);

  const params = {
    section: sectionId,
    program: "VIMS_FDE_TAMIL"
  };
  window.fbq?.("trackCustom", "FDE_SectionView", params);
  recordLocalPixelLog("custom", "FDE_SectionView", params);
  void sendTelemetry({ event: "section_view", section: sectionId });
}

export function trackScrollMilestone(percent: 25 | 50 | 75 | 100) {
  if (firedScrollThresholds.has(percent)) return;
  firedScrollThresholds.add(percent);

  const params = {
    scroll_percent: percent,
    program: "VIMS_FDE_TAMIL"
  };
  window.fbq?.("trackCustom", `FDE_Scroll_${percent}`, params);
  recordLocalPixelLog("custom", `FDE_Scroll_${percent}`, params);
  void sendTelemetry({ event: "scroll_depth", scrollDepth: percent });
}

export function trackRegisterCtaClick(placement: string, remainingSeats: number) {
  const params = {
    placement,
    remaining_seats: remainingSeats,
    value: 2999,
    currency: "INR"
  };
  window.fbq?.("trackCustom", "FDE_RegisterClick", params);
  recordLocalPixelLog("custom", "FDE_RegisterClick", params);
  void sendTelemetry({ event: "cta_click", ctaSource: placement });
}

export function trackLeadSubmitted(eventId: string, profile: string) {
  const params = {
    content_name: "Forward Deployment Engineer (FDE) Lead",
    content_category: profile,
    value: 2999,
    currency: "INR"
  };
  window.fbq?.("track", "Lead", params, { eventID: eventId });
  recordLocalPixelLog("standard", "Lead", params, eventId);
}

export function trackInitiateCheckout(eventId: string, totalInr: number) {
  const params = {
    content_name: "Forward Deployment Engineer (FDE) Seat Enrollment",
    content_ids: ["vims-fde-tamil-8w"],
    num_items: 1,
    value: totalInr,
    currency: "INR"
  };
  window.fbq?.("track", "InitiateCheckout", params, { eventID: eventId });
  recordLocalPixelLog("standard", "InitiateCheckout", params, eventId);
}

export function trackVerifiedPurchase(
  eventId: string,
  totalInr: number,
  paymentId: string,
  seatNumber: number
) {
  const purchaseParams = {
    content_name: "Forward Deployment Engineer (FDE) - 8 Week Tamil Cohort",
    content_ids: ["vims-fde-tamil-8w"],
    content_type: "product",
    value: totalInr,
    currency: "INR",
    transaction_id: paymentId,
    seat_number: seatNumber
  };
  window.fbq?.("track", "Purchase", purchaseParams, { eventID: eventId });
  recordLocalPixelLog("standard", "Purchase", purchaseParams, eventId);

  const regEventId = `cr_${eventId}`;
  window.fbq?.(
    "track",
    "CompleteRegistration",
    {
      content_name: "FDE Cohort Seat Confirmed",
      status: "confirmed",
      value: totalInr,
      currency: "INR"
    },
    { eventID: regEventId }
  );
  recordLocalPixelLog("standard", "CompleteRegistration", { seat_number: seatNumber }, regEventId);
}

export function trackPaymentDropoff(reason: string) {
  const params = { reason, program: "VIMS_FDE_TAMIL" };
  window.fbq?.("trackCustom", "FDE_PaymentDropoff", params);
  recordLocalPixelLog("custom", "FDE_PaymentDropoff", params);
}
