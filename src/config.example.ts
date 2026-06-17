// ─────────────────────────────────────────────────────────────────────────────
// WEDDING WEBSITE CONFIG
// Edit this file to personalise the site for your event.
// ─────────────────────────────────────────────────────────────────────────────

export const config = {
  // ── Couple ──────────────────────────────────────────────────────────────────
  partner1: "Partner One",
  partner2: "Partner Two",
  /** Short conjunction shown between names (e.g. "et", "&", "and") */
  conjunction: "et",

  // ── Dates ───────────────────────────────────────────────────────────────────
  /**
   * Ceremony start in UTC ISO format.
   * Countdown and calendar links are derived from this.
   */
  eventStartUTC: "YYYY-MM-DDTHH:MM:SSZ",
  eventEndUTC:   "YYYY-MM-DDTHH:MM:SSZ",
  /** Doors/seating open — used for the "Please be seated" note */
  seatingStartUTC: "YYYY-MM-DDTHH:MM:SSZ",

  /** Human-readable date shown in the event details card */
  eventDateDisplay: "Month DD, YYYY",
  /** Human-readable day shown as subtext */
  eventDayDisplay: "Saturday",
  /** Seating instruction copy */
  seatingCopy: "Please be seated · Ceremony begins at [TIME] [TZ]",

  /** RSVP deadline displayed in the form */
  rsvpDeadlineDisplay: "Month DD, YYYY",
  /**
   * UTC ISO date after which the RSVP form closes.
   * Set to a specific date string, or null to close on the wedding day.
   */
  rsvpClosesAtUTC: null as string | null,

  /** Shown in the countdown once the wedding date has passed */
  postWeddingHeadline: "We're Married!",
  postWeddingSubtext: "Thank you for celebrating with us",

  /** Year shown in the "Est." badge */
  establishmentYear: "YYYY",

  // ── Venue ───────────────────────────────────────────────────────────────────
  venueDisplay: "Private Location in [City], [Country]",
  venueSubtext: "Address sent upon RSVP approval",

  // ── Travel & local info ─────────────────────────────────────────────────────
  airport: {
    name: "Your City International Airport",
    iata: "XXX",
  },
  airlineBookingUrl: "https://example.com",
  airlineName: "YOUR AIRLINE",
  /** Bolt / ride-hail city name shown in the guide */
  rideshareCity: "Your City",
  /** Local transit cost range shown in the guide */
  transitCostRange: "₦X,000 – ₦Y,000",

  hotels: [
    "Hotel Name 1",
    "Hotel Name 2",
    "Hotel Name 3",
  ],

  restaurants: [
    "Restaurant Name 1",
    "Restaurant Name 2",
    "Restaurant Name 3",
  ],

  /** Max guests shown in the RSVP capacity note. Set to 0 to hide the note. */
  guestCapacity: 0,

  /** Road transport options shown in the travel guide. Set to [] to hide. */
  roadTransportLinks: [
    { label: "Transport Line 1", url: "https://example.com" },
    { label: "Transport Line 2", url: "https://example.com" },
  ],

  /** Google Maps embed src for the arrival airport / area */
  mapEmbedSrc: "",

  /** YouTube links shown in the travel guide. Add as many as you like. */
  travelVideos: [
    { label: "Video Title 1",      url: "https://youtu.be/YOUR_VIDEO_ID" },
    { label: "Sights of {city}",   url: "https://youtu.be/YOUR_VIDEO_ID" },
  ],

  // ── Gift registry ────────────────────────────────────────────────────────────
  bankAccounts: [
    { currency: "NGN (Naira)",  bank: "Your Bank Name", account: "0000000000", name: "Account Holder Name" },
    { currency: "USD (Dollar)", bank: "Your Bank Name", account: "0000000000", name: "Account Holder Name" },
  ],

  crypto: {
    btcOnchain:   "YOUR_BTC_ADDRESS",
    btcLightning: "your@lightning.address",
    /** Single EVM-compatible address used for Base, BSC, Assetchain */
    evmAddress:   "0xYOUR_EVM_ADDRESS",
    solanaAddress:"YOUR_SOLANA_ADDRESS",
    tronAddress:  "YOUR_TRON_ADDRESS",
  },

  // ── Dress code / Color of the Day ───────────────────────────────────────────
  /**
   * Each entry becomes a selectable color swatch with two outfit photos.
   * Add your own images to src/assets/ and update the paths below.
   * You can have any number of color entries.
   */
  /**
   * Optional dress code warning shown in red beneath the color swatches.
   * Set to "" or null to hide it.
   */
  colorOfDayDisclaimer: "" as string | null,

  colorOfDay: [
    {
      name: "Color Name",
      hex: "#HEXCODE",
      description: "A short description of the color",
      images: [
        { src: "/src/assets/placeholder-person-1.svg", alt: "Partner 1 in [color]" },
        { src: "/src/assets/placeholder-person-2.svg", alt: "Partner 2 in [color]" },
      ],
    },
    {
      name: "Color Name 2",
      hex: "#HEXCODE2",
      description: "A short description of the second color",
      images: [
        { src: "/src/assets/placeholder-person-1.svg", alt: "Partner 1 in [color 2]" },
        { src: "/src/assets/placeholder-person-2.svg", alt: "Partner 2 in [color 2]" },
      ],
    },
  ],

  // ── Music ────────────────────────────────────────────────────────────────────
  /** Path to the background audio file in /public. Set to "" to disable. */
  musicSrc: "/audio/background-music.mp3",

  // ── Quote ────────────────────────────────────────────────────────────────────
  /** Displayed in the event details section. Set to "" to hide. */
  quote: "Your quote goes here" as string,
  quoteAttribution: "Author / Source" as string,

  // ── SEO / Social ─────────────────────────────────────────────────────────────
  siteTitle: "P1 et P2 | Marriage Ceremony",
  siteDescription: "Join us for the marriage ceremony of Partner One and Partner Two. An intimate celebration of love.",
  twitterHandle: "@p1p2wedding",
};