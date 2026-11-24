# VIMS Academy · Forward Deployment Engineer (FDE) Tamil Cohort (`fde.vimsenterprise.com`)

Standalone full-stack conversion landing page, Razorpay checkout, live 50-seat cohort allocator, and Meta Pixel ("Pixel Method") funnel tracking engine built for **VIMS Academy (Powered by VIMS Enterprise)**.

Zero files in `embskills.vimsenterprise.com` were modified.

---

## 1. Key Features Built

- **Single Clear Offer**: `₹2,999 + 18% GST` (`₹3,539` total payable with transparent GST breakdown).
- **Live 50-Seat Dynamic Counter**: Starts at `10 / 50` enrolled (`40` remaining). Every verified registration automatically increments `10 -> 11 -> 12...` across the page in real time.
- **Registration Window Countdown**: Live countdown timer configured from **24 Nov 2026, 4:00 PM IST** to **1 Dec 2026 (Next Tuesday), 4:00 PM IST** (`VITE_REG_START_ISO` & `VITE_REG_END_ISO`).
- **Full-Funnel Meta Pixel ("Pixel Method") + Visitor Journey Telemetry**:
  1. `PageView` + UTM / `fbclid` capture
  2. `ViewContent` (`value: 2999`, `currency: "INR"`)
  3. `FDE_SectionView` (`overview`, `why-fde`, `award`, `curriculum`, `mentors`, `reviews`, `pricing`, `faq`)
  4. `FDE_Scroll_25`, `FDE_Scroll_50`, `FDE_Scroll_75`, `FDE_Scroll_100`
  5. `FDE_RegisterClick` (records exact CTA button placement)
  6. `Lead` (saved to backend & fired before payment opens so zero leads are lost on UPI drop-off)
  7. `InitiateCheckout` (`value: 3539`, `currency: "INR"`)
  8. `Purchase` + `CompleteRegistration` (fired ONLY after signature-verified Razorpay payment, deduplicated via `eventID`)
  9. `FDE_PaymentDropoff` + 1-click Retry Recovery UI
- **Award-Winning Credibility**: Features the real **TN Digital Summit 2026 · Social Eagle Award** photograph (`VIMS Enterprise`), Program Hosts **Guruprasath** & **Gowthamraj Mahadevan**, and Supporting Mentor **Vimal Raj**.

---

## 2. Local Development & Preview

```bash
cd fde-landing
npm install
npm run build
npm run preview
```

Open `http://127.0.0.1:4174` (or `npm run dev` for hot-reload on `http://127.0.0.1:4173`).
To inspect live Meta Pixel events & visitor scroll/lead analytics, click **Pixel & Funnel Tracker** in the footer or open `?inspector=1`.

---

## 3. Deploying to `fde.vimsenterprise.com` (Vercel)

1. Deploy `fde-landing` as a **new separate Vercel project** (so `embskills.vimsenterprise.com` remains 100% untouched):
   ```bash
   cd fde-landing
   npx vercel --prod
   ```
2. In **Vercel Project -> Settings -> Domains**, add:
   - `fde.vimsenterprise.com`
3. In your DNS manager for `vimsenterprise.com`, add a `CNAME` record:
   - **Name**: `fde`
   - **Target**: `cname.vercel-dns.com`
4. In **Vercel Project -> Settings -> Environment Variables**, set:
   - `RAZORPAY_KEY_ID` = your live Razorpay Key ID
   - `RAZORPAY_KEY_SECRET` = your live Razorpay Key Secret
   - `VITE_META_PIXEL_IDS` = `4439327462948047,1395642289095466` (or your dedicated FDE Pixel ID)
   - `ADMIN_TOKEN` = strong secret password for `/api/fde/admin/summary`

---

## 4. Design Intent Log

- **Palette (`#FAFBFD`, `#080D1A`, `#E8451A`, `#10B981`)**: Matches `embskills.vimsenterprise.com` precision engineering visual system for immediate institutional trust.
- **Typography (`Noto Sans Tamil` + `Space Grotesk` + `JetBrains Mono`)**: Ensures clean Tamil vowel rendering (`line-height: 1.65`) paired with crisp technical headings and live pipeline telemetry.
- **Hero Architecture Console**: Demonstrates real FDE production pipelines (Automotive RAG, Enterprise Agent, Document API) instead of generic AI stock portraits or cartoon graphics.
- **Varied Section Rhythm**: Asymmetric 7:5 hero -> Dark 3-column contrast bridge -> Split editorial award showcase -> Interactive 2-pane 8-week sprint explorer -> 3-column mentor profiles -> Single focused cohort card.
