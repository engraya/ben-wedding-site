// ─────────────────────────────────────────────────────────────────────────────
// WEDDING WEBSITE CONFIG
// Edit this file to personalise the site for your event.
// ─────────────────────────────────────────────────────────────────────────────

export const config = {
  // ── Couple ──────────────────────────────────────────────────────────────────
  partner1: "Mfonobong",
  partner2: "Benjamin",
  /** Short conjunction shown between names (e.g. "et", "&", "and") */
  conjunction: "&",

  // ── Dates ───────────────────────────────────────────────────────────────────
  /**
   * Ceremony start in UTC ISO format.
   * Countdown and calendar links are derived from this.
   */
  eventStartUTC: "2026-08-29T09:30:00Z",
  eventEndUTC:   "2026-08-29T17:00:00Z",

  /** RSVP deadline displayed in the form */
  rsvpDeadlineDisplay: "August 24, 2026",
  /**
   * UTC ISO date after which the RSVP form closes.
   * Set to a specific date string, or null to close on the wedding day.
   */
  rsvpClosesAtUTC: null as string | null,

  /** Shown in the countdown once the wedding date has passed */
  postWeddingHeadline: "We're Married!",
  postWeddingSubtext: "Thank you for celebrating with us",

  /** Year shown in the "Est." badge */
  establishmentYear: "2026",

  // ── Ceremonies ──────────────────────────────────────────────────────────────
  /**
   * Each entry renders its own section in the Event Details block, with a grid
   * of cards (Date, Time, Venue, and an optional Reception). Add as many as you
   * like. `timeUTC` is used to display the ceremony time in the viewer's locale.
   */
  ceremonies: [
    {
      title: "Traditional Ceremony",
      dateDisplay: "August 26th, 2026",
      dayDisplay: "Wednesday",
      timeUTC: "2026-08-26T13:00:00Z", // 2:00 PM WAT (GMT+1)
      timeCopy: "Please be seated on time, ceremony begins immediately at 2PM WAT",
      venue: "Elder Dr. Gabriel Sam Akpan’s Family Compound",
      venueSubtext: "Mkpu, Itu Mbonuso, Ini LGA, Akwa Ibom State",
      reception: null as { value: string; subtext: string } | null,
    },
    {
      title: "Church Wedding",
      dateDisplay: "August 29th, 2026",
      dayDisplay: "Saturday",
      timeUTC: "2026-08-29T09:30:00Z", // 10:30 AM WAT (GMT+1)
      timeCopy: "Please be seated on time.",
      venue: "The Apostolic Church, Akparika District",
      venueSubtext: "23 Abasi Edem Street, Calabar, CRS",
      reception: { value: "Event45, State Housing Estate, Calabar", subtext: "To Follow Immediately" } as { value: string; subtext: string } | null,
    },
  ],

  // ── Travel & local info ─────────────────────────────────────────────────────
  airport: {
    name: "Margaret Ekpo Int'l Airport",
    iata: "CBQ",
  },
  airlineBookingUrl: "https://www.flyvaluejet.com/",
  airlineName: "Value jet",
  /** Bolt / ride-hail city name shown in the guide */
  rideshareCity: "calabar",
  /** Local transit cost range shown in the guide */
  transitCostRange: "₦7,000 – ₦10,000",

  hotels: [
    "DW Hotel",
    "Hogis luxury suites",
    "transcorp hotels",
    "monty suites",
  ],

  restaurants: [
    "Marina Resort",
    "Slave History Museum",
    "National Museum Calabar",
    "Cross River National Park",
    "Drill Ranch",
    "Mary Slessor's House",
    "Tinapa Business and Leisure Resort",
    "Calabar International Convention Centre",
  ],

  /** Max guests shown in the RSVP capacity note. Set to 0 to hide the note. */
  guestCapacity: 0,

  /** Road transport options shown in the travel guide. Set to [] to hide. */
  roadTransportLinks: [
    { label: "GIGM.com", url: "https://gigm.com/" },
    { label: "GUO Transport", url: "https://guotransport.com/" },
  ],

  /** Google Maps embed src for the arrival airport / area */
  mapEmbedSrc: "https://maps.google.com/maps?q=Margaret%20Ekpo%20International%20Airport%2C%20Calabar&z=12&output=embed",

  /** YouTube links shown in the travel guide. Add as many as you like. */
  travelVideos: [
    { label: "Discover Cross River state",      url: "https://youtu.be/iK5ZZguSvkw?si=hyiBplQefP3qpG1Q" },
    { label: "Sights of Calabar",   url: "https://www.youtube.com/watch?v=_8VCl_ZGWpY" },
  ],

  // ── Gift registry ────────────────────────────────────────────────────────────
  bankAccounts: [
    { currency: "NGN (Naira)",  bank: "Opay MFB", account: "8161790418", name: "Benjamin Frank" },
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
   * Each entry becomes a color swatch card showing the color name and hex code.
   * Add as many color entries as you like.
   */
  /**
   * Optional dress code warning shown in red beneath the color swatches.
   * Set to "" or null to hide it.
   */
  colorOfDayDisclaimer: "" as string | null,

  colorOfDay: [
    { name: "Purple", hex: "#5B2C6F" },
    { name: "Plum",   hex: "#6E1D4B" },
    { name: "Lilac",  hex: "#C5B4E3" },
    { name: "Pink",   hex: "#F4A8C1" },
    { name: "Blush",  hex: "#FFD6E0" },
  ],

  // ── Music ────────────────────────────────────────────────────────────────────
  /** Path to the background audio file in /public. Set to "" to disable. */
  musicSrc: "/audio/background-music.mp3",

  // ── Quote ────────────────────────────────────────────────────────────────────
  /** Displayed in the event details section. Set to "" to hide. */
  quote: "Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken." as string,
  quoteAttribution: " Ecclesiastes 4:12" as string,

  // ── SEO / Social ─────────────────────────────────────────────────────────────
  siteTitle: "Mfonobong & Benjamin | Marriage Ceremony",
  siteDescription: "Join us for the marriage ceremony of Mfonobong & Benjamin. An intimate celebration of love.",
  twitterHandle: "",
};