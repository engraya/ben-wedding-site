# Wedding Website

A production-ready wedding website built with React 18, TypeScript, and Tailwind CSS. Everything your guests need in one place — live countdown, event details, RSVP (backed by Google Sheets), travel guide, dress code, and a gift registry supporting bank transfer and crypto.

**Originally built for [Irene & Olayinka's wedding](https://omoniyi.co). Forking takes ~15 minutes.**

---

## Features

| Section | Details |
|---|---|
| **Hero + Countdown** | Live ticker to the wedding date. Transitions to a "We're Married!" screen once the date passes |
| **Event Details** | Date, time, venue card. "Add to Calendar" dropdown for Google Calendar and Outlook |
| **RSVP** | Full form with validation — physical or virtual attendance, partner name, dietary, media consent. Backed by Google Sheets. Auto-closes on your deadline |
| **Gift Registry** | Bank transfer (NGN + USD) with masked account reveal. Crypto: BTC on-chain, Lightning, EVM (Base / BSC / Assetchain), Solana, Tron |
| **Travel Guide** | Flights, ride-hailing tips, hotel list, restaurants, local transit, and a Google Maps embed |
| **Color of Day** | Dress code section with swatchable colour options and outfit reference photos |
| **Music Player** | Autoplay-aware background music player, fixed bottom-right |
| **Dark / Light mode** | Defaults to dark, toggleable |

---

## Stack

- **React** 18.3 + **TypeScript** 5.8
- **Vite** 5.4 (dev server on port 3000)
- **Tailwind CSS** 3.4 with custom fonts (Playfair Display, Inter) and CSS variable theming
- **Framer Motion** 12 — animations and scroll reveals
- **shadcn/ui** + **Radix UI** — accessible component primitives
- **React Hook Form** 7 + **Zod** 3 — form state and validation
- **next-themes** — dark/light mode
- **qrcode.react** — QR codes in the gift registry
- **TanStack React Query** 5 — configured for any future API needs

---

## Prerequisites

- **Node.js** v18+ — [install via nvm](https://github.com/nvm-sh/nvm#installing-and-updating) — or **[Bun](https://bun.sh/)** (faster)
- A **Google account** for the RSVP backend

---

## Getting started

```bash
# 1. Clone
git clone https://github.com/UfiairENE/our-wedding-site-template.git
cd our-wedding-site-template

# 2. Install dependencies
npm install       # or: bun install

# 3. Create your personal config files
cp src/config.example.ts src/config.ts
cp .env.example .env

# 4. Edit src/config.ts and .env with your details (see Configuration below)

# 5. Add your background music
cp your-song.mp3 public/audio/background-music.mp3

# 6. Start the dev server
npm run dev       # or: bun run dev
# → http://localhost:3000
```

---

## Configuration

All personalisation lives in two files. **Both are gitignored** — your data never touches the repository.

### `src/config.ts`

Copy from `src/config.example.ts` and fill in every field. The comments in the file explain each one. Below is a complete filled example:

```ts
export const config = {
  // ── Couple ──────────────────────────────────────────────────────────────────
  partner1: "Ada",
  partner2: "Emeka",
  conjunction: "et",        // displayed between names — "et", "&", "and", etc.

  // ── Dates (all in UTC) ──────────────────────────────────────────────────────
  // Nigeria is WAT = UTC+1. So 1:00 PM WAT → "12:00:00Z"
  // Converter: https://www.timeanddate.com/worldclock/converter.html
  eventStartUTC:   "2026-11-14T12:00:00Z",   // ceremony start
  eventEndUTC:     "2026-11-14T20:00:00Z",   // event end
  seatingStartUTC: "2026-11-14T11:30:00Z",   // doors open

  // Human-readable strings rendered on the page
  eventDateDisplay:    "November 14, 2026",
  eventDayDisplay:     "Saturday",
  seatingCopy:         "Please be seated · Ceremony begins at 1PM WAT",
  rsvpDeadlineDisplay: "October 31, 2026",

  // RSVP form close date. Set null to close automatically on eventStartUTC.
  rsvpClosesAtUTC: "2026-10-31T23:59:59Z",

  // Shown in the countdown after the wedding date passes
  postWeddingHeadline: "We're Married!",
  postWeddingSubtext:  "Thank you for celebrating with us",

  establishmentYear: "2026",

  // ── Venue ───────────────────────────────────────────────────────────────────
  venueDisplay: "Private Location in Lagos, Nigeria",
  venueSubtext: "Address sent upon RSVP approval",

  // ── Travel ──────────────────────────────────────────────────────────────────
  airport: {
    name: "Murtala Muhammed International Airport",
    iata: "LOS",
  },
  airlineBookingUrl: "https://www.arikair.com/",
  airlineName:       "ARIK AIR",
  rideshareCity:     "Lagos",
  transitCostRange:  "₦5,000 – ₦12,000",

  hotels: [
    "Eko Hotel & Suites",
    "Federal Palace Hotel",
    "Radisson Blu Anchorage",
  ],
  restaurants: [
    "Nok by Alara",
    "Nkoyo",
    "Bungalow Beach Bar",
  ],

  // Google Maps embed URL — see tip below
  mapEmbedSrc: "https://www.google.com/maps/embed?pb=...",

  // YouTube travel videos. Use {city} in a label to auto-insert rideshareCity.
  travelVideos: [
    { label: "Interesting Places", url: "https://youtu.be/..." },
    { label: "Sights of {city}",   url: "https://youtu.be/..." },
  ],

  // ── Gift registry ────────────────────────────────────────────────────────────
  bankAccounts: [
    { currency: "NGN (Naira)",  bank: "Moniepoint MFB", account: "0123456789", name: "Ada Okafor" },
    { currency: "USD (Dollar)", bank: "Providus Bank",   account: "9876543210", name: "Ada Okafor" },
  ],

  crypto: {
    btcOnchain:    "bc1q...",
    btcLightning:  "you@walletofsatoshi.com",
    evmAddress:    "0x...",         // reused for Base, BSC, and Assetchain
    solanaAddress: "...",
    tronAddress:   "T...",
  },

  // ── Dress code ───────────────────────────────────────────────────────────────
  // Optional warning shown in red under the colour swatches. Set "" to hide.
  colorOfDayDisclaimer: "Please dress in one of the colours below.",

  colorOfDay: [
    {
      name: "Dusty Rose",
      hex: "#C4849A",
      description: "A sophisticated mauve pink",
      images: [
        { src: "/src/assets/bride-pink.png", alt: "Bride in dusty rose" },
        { src: "/src/assets/groom-pink.png", alt: "Groom in dusty rose" },
      ],
    },
  ],

  // ── Music ───────────────────────────────────────────────────────────────────
  // Path to audio file in /public. Set "" to disable the player entirely.
  musicSrc: "/audio/background-music.mp3",

  // ── Quote ───────────────────────────────────────────────────────────────────
  // Displayed below the event details cards. Set "" to hide.
  quote: "Though one may be overpowered, two can defend themselves.",
  quoteAttribution: "Ecclesiastes 4:12",

  // ── SEO ──────────────────────────────────────────────────────────────────────
  siteTitle:       "Ada et Emeka | Marriage Ceremony",
  siteDescription: "Join us for our marriage ceremony. An intimate celebration of love.",
  twitterHandle:   "@yourhandle",
};
```

> **Getting the Google Maps embed URL**
> Google Maps → search your venue or airport → **Share** → **Embed a map** → copy only the `src="…"` value from the `<iframe>` snippet.

---

### `.env`

```bash
VITE_GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
```

See [RSVP backend setup](#rsvp-backend-setup) below for how to generate this URL.

---

## RSVP backend setup

The form POSTs a JSON body to a Google Apps Script web app which appends a row to a Google Sheet. Takes about 10 minutes to set up.

### Step 1 — Create the spreadsheet

1. Open [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Rename the default sheet tab to `RSVPs`
3. Paste these headers into row 1, one per column:

```
Timestamp  Name  Email  Phone  Attendance  Relationship  Guests  GuestName  Dietary  MediaConsent  Message
```

### Step 2 — Add the Apps Script

1. In the spreadsheet: **Extensions → Apps Script**
2. Delete all existing code and paste the following:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("RSVPs");

  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name,
    data.email,
    data.phone        || "",
    data.attendanceType,
    data.relationship,
    data.guests       || "1",
    data.guestName    || "",
    data.dietary      || "",
    data.mediaConsent || "",
    data.message      || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Save** (Ctrl+S / Cmd+S). Name the project anything you like.

### Step 3 — Deploy as a web app

1. **Deploy → New deployment**
2. Click the ⚙️ gear next to "Select type" → **Web app**
3. Set **Execute as:** `Me`
4. Set **Who has access:** `Anyone`
5. Click **Deploy** — authorize when prompted
6. Copy the **Web app URL** and paste it into `.env` as `VITE_GOOGLE_SCRIPT_URL`

> **Important:** if you ever edit the script, you must **Deploy → New deployment** again (not "Manage deployments → Edit"). The URL does not change.

---

## Adding your music

Drop any MP3 into the public folder and point `musicSrc` in `config.ts` at it:

```bash
cp your-song.mp3 public/audio/your-song.mp3
```

```ts
musicSrc: "/audio/your-song.mp3",
```

The player attempts autoplay at 30% volume on page load. If the browser blocks it (common on mobile), playback starts on the first user interaction. Set `musicSrc: ""` to disable the player entirely.

---

## Adding your photos

The **Color of Day** section displays outfit reference photos. Add your images to `src/assets/` and update the `colorOfDay` array in `config.ts`:

```ts
colorOfDay: [
  {
    name: "Dusty Rose",
    hex: "#C4849A",
    description: "A sophisticated mauve pink",
    images: [
      { src: "/src/assets/bride-pink.png", alt: "Bride in dusty rose" },
      { src: "/src/assets/groom-pink.png", alt: "Groom in dusty rose" },
    ],
  },
],
```

Placeholder SVGs (`placeholder-person-1.svg`, `placeholder-person-2.svg`) are included in `src/assets/` so the section renders out of the box before you add your own photos.

---

## Deployment

`vercel.json` is already configured with correct SPA rewrites, cache headers, and security headers.

### Vercel (recommended)

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Under **Environment Variables**, add:
   - Key: `VITE_GOOGLE_SCRIPT_URL`
   - Value: your Google Apps Script URL
4. Click **Deploy**

Every push to `main` redeploys automatically.

### Netlify

1. Push to GitHub, connect at [netlify.com](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Site settings → **Environment variables** → add `VITE_GOOGLE_SCRIPT_URL`

### Manual / other hosts

```bash
npm run build     # outputs to dist/
```

Upload the `dist/` folder to any static host (Cloudflare Pages, GitHub Pages, S3, etc.). Configure the host to serve `index.html` for all routes (SPA fallback).

---

---

## Project structure

```
.
├── public/
│   ├── audio/
│   │   └── background-music.mp3   # Replace with your song
│   └── favicon.ico
├── src/
│   ├── assets/                    # Dress code photos + placeholders
│   ├── components/
│   │   ├── ColorOfDay.tsx         # Dress code section
│   │   ├── Countdown.tsx          # Hero countdown + post-wedding screen
│   │   ├── EventDetails.tsx       # Date / time / venue + Add to Calendar
│   │   ├── Footer.tsx             # Scrolling marquee footer
│   │   ├── GiftRegistry.tsx       # Bank + crypto gift options
│   │   ├── Hero.tsx               # Full-screen opening section
│   │   ├── MusicPlayer.tsx        # audio player
│   │   ├── Navigation.tsx         # top nav (Gifts, RSVP links)
│   │   ├── RSVPForm.tsx           # Full RSVP form + closed/success states
│   │   ├── TravelGuide.tsx        # Flights, hotels, map
│   │   └── ui/                    # shadcn/ui primitives
│   ├── config.example.ts          # ← Committed template. Copy → config.ts
│   ├── config.ts                  # ← Your data. Gitignored.
│   └── pages/
│       └── Index.tsx              # Page composition and scroll routing
├── .env.example                   # ← Committed. Copy → .env
├── .env                           # ← Your Google Script URL. Gitignored.
├── vercel.json                    # Deployment config (rewrites + security headers)
└── tailwind.config.ts             # Custom fonts, colours, animations
```

---

## URL routing

The app uses React Router with hash-free URLs. Deep links scroll to the relevant section:

| URL | Scrolls to |
|---|---|
| `/` | Top of page |
| `/rsvp` | RSVP form |
| `/gifts` | Gift registry |
| `/details` | Event details |
| `/travel` | Travel guide |

These are handled client-side in `src/pages/Index.tsx`. The rewrite rules in `vercel.json` ensure they all serve `index.html`.

---

## Inspiration

Built for [omoniyi.co](https://omoniyi.co) — the live wedding site this repo was extracted from.

---

## License

MIT. Free to use, modify, and deploy. A credit or a star is appreciated but not required.
