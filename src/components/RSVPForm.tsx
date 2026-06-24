import { useState, useRef } from "react";
import { config } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, Heart, ChevronDown, Info, Video, Users,
  EyeOff, AlertTriangle
} from "lucide-react";
import { GiftRegistry } from "./GiftRegistry";

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

// RSVP closes at the configured deadline, or always on the wedding day.
const WEDDING_DAY    = new Date(config.eventStartUTC);
const RSVP_CLOSES_AT = config.rsvpClosesAtUTC ? new Date(config.rsvpClosesAtUTC) : null;
const rsvpIsClosed   =
  new Date() > WEDDING_DAY || (RSVP_CLOSES_AT !== null && new Date() > RSVP_CLOSES_AT);

interface FormData {
  attendanceType: "physical" | "virtual";
  name: string;
  email: string;
  phone: string;
  relationship: string;
  guests: string;
  guestName: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

// ─── Validators ────────────────────────────────────────────────────────────────

const validateName = (value: string): string | null => {
  if (!value.trim()) return "Full name is required.";
  if (/\d/.test(value)) return "Name cannot contain numbers.";
  if (/[^a-zA-Z\s'\-.]/.test(value)) return "Name contains invalid characters.";
  if (value.trim().length < 2) return "Name must be at least 2 characters.";
  return null;
};

const validateEmail = (value: string): string | null => {
  if (!value.trim()) return "Email address is required.";
  // RFC-ish check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Please enter a valid email address.";
  return null;
};

const validatePhone = (value: string): string | null => {
  if (!value.trim()) return null; // optional field
  // Allow: +, digits, spaces, dashes, parentheses. Min 7 digits.
  const digitsOnly = value.replace(/\D/g, "");
  if (!/^[+\d\s\-().]+$/.test(value)) return "Phone number contains invalid characters.";
  if (digitsOnly.length < 7) return "Phone number is too short.";
  if (digitsOnly.length > 15) return "Phone number is too long.";
  return null;
};

const validateRelationship = (value: string): string | null => {
  if (!value) return "Please select your guest affiliation.";
  return null;
};

const validateGuests = (value: string): string | null => {
  if (!value) return "Please select a guest count.";
  return null;
};

const validateGuestName = (value: string): string | null => {
  if (!value.trim()) return "Partner's name is required.";
  if (/\d/.test(value)) return "Name cannot contain numbers.";
  if (value.trim().length < 2) return "Name must be at least 2 characters.";
  return null;
};

// ─── Component ─────────────────────────────────────────────────────────────────

export const RSVPForm = () => {
  const ref = useRef<HTMLElement | null>(null);
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const [formData, setFormData] = useState<FormData>({
    attendanceType: "physical",
    name: "",
    email: "",
    phone: "",
    relationship: "",
    guests: "",
    guestName: "",
    message: "",
  });

  // ── Validate a single field ──────────────────────────────────────────────────
  const validateField = (name: keyof FormData, value: string): string | null => {
    switch (name) {
      case "name":        return validateName(value);
      case "email":       return validateEmail(value);
      case "phone":       return validatePhone(value);
      case "relationship":return validateRelationship(value);
      case "guests":      return formData.attendanceType === "physical" ? validateGuests(value) : null;
      case "guestName":   return formData.guests === "2" ? validateGuestName(value) : null;
      default:            return null;
    }
  };

  // ── Validate entire form before submit ──────────────────────────────────────
  const validateAll = (): FormErrors => {
    const newErrors: FormErrors = {};

    const checks: (keyof FormData)[] = ["name", "email", "phone", "relationship"];
    if (formData.attendanceType === "physical") {
      checks.push("guests");
      if (formData.guests === "2") checks.push("guestName");
    }

    for (const field of checks) {
      const err = validateField(field, formData[field] as string);
      if (err) newErrors[field] = err;
    }

    return newErrors;
  };

  // ── Handle live change ───────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (backendError) setBackendError(null);

    setFormData(prev => ({ ...prev, [name]: value }));

    // Only re-validate if field was already touched
    if (touched[name as keyof FormData]) {
      const err = validateField(name as keyof FormData, value);
      setErrors(prev => ({ ...prev, [name]: err ?? undefined }));
    }
  };

  // ── Handle blur — mark touched & validate ───────────────────────────────────
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const err = validateField(name as keyof FormData, value);
    setErrors(prev => ({ ...prev, [name]: err ?? undefined }));
  };

  // ── Phone-specific handlers ──────────────────────────────────────────────────
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, arrows, home, end
    const allowed = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (allowed.includes(e.key)) return;
    // Allow: Ctrl/Cmd+A/C/V/X
    if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) return;
    // Allow: digits, +, (, ), -, space, /
    if (/^[\d+\-()\s/.]$/.test(e.key)) return;
    // Block everything else (letters, etc.)
    e.preventDefault();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip any letters that sneak in (e.g. via paste)
    const cleaned = e.target.value.replace(/[a-zA-Z]/g, "");
    const syntheticEvent = { ...e, target: { ...e.target, name: "phone", value: cleaned } };
    handleChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
  };

  const handleTypeChange = (type: "physical" | "virtual") => {
    setFormData(prev => ({ ...prev, attendanceType: type }));
    // Clear physical-only errors when switching to virtual
    if (type === "virtual") {
      setErrors(prev => {
        const next = { ...prev };
        delete next.guests;
        delete next.guestName;
        return next;
      });
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all relevant fields as touched
    const allFields: (keyof FormData)[] = ["name", "email", "phone", "relationship"];
    if (formData.attendanceType === "physical") {
      allFields.push("guests");
      if (formData.guests === "2") allFields.push("guestName");
    }
    setTouched(Object.fromEntries(allFields.map(f => [f, true])));

    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorEl = document.querySelector("[data-error='true']");
      firstErrorEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    setBackendError(null);

    try {
      const payload = {
        ...formData,
        guests: formData.attendanceType === "virtual" ? "1" : formData.guests,
        attendance: "Confirmed",
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.result === "error") {
        setBackendError(result.error);
      } else {
        setIsSubmitted(true);
        setTimeout(() => {
          ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
      }
    } catch {
      toast({ title: "Connection Error", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────

  /** Shared input className — red border if error */
  const inputCls = (field: keyof FormData) =>
    `w-full bg-white dark:bg-[#161616] border rounded-lg px-4 py-3.5 text-black dark:text-white focus:outline-none transition-colors ${
      errors[field]
        ? "border-red-400 dark:border-red-500 focus:ring-1 focus:ring-red-400"
        : "border-gray-300 dark:border-white/5"
    }`;

  /** Inline error message */
  const ErrorMsg = ({ field }: { field: keyof FormData }) =>
    errors[field] ? (
      <p className="text-[11px] text-red-500 mt-1" role="alert">
        {errors[field]}
      </p>
    ) : null;

  // ── Post-wedding thank you ────────────────────────────────────────────────────
  if (rsvpIsClosed) {
    return (
      <section ref={ref} id="rsvp" className="py-12 bg-white dark:bg-black transition-colors scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <span className="text-[11px] tracking-[0.5em] uppercase text-black/60 dark:text-white/60 font-medium">✦ KINDLY RESPOND ✦</span>
            <h2 className="font-display text-8xl md:text-9xl text-black dark:text-white tracking-tighter uppercase leading-none mt-2">RSVP</h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-md mx-auto border border-black/10 dark:border-white/10 rounded-2xl p-8 flex flex-col items-center gap-3 text-center bg-black/[0.02] dark:bg-white/[0.02]"
          >
            <EyeOff className="w-4 h-4 text-black/30 dark:text-white/30" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/50 dark:text-white/50 font-bold">Submissions Closed</p>
            <div className="h-px w-10 bg-black/10 dark:bg-white/10" />
            <Heart className="w-5 h-5 fill-current text-black/30 dark:text-white/30" />
            <p className="font-display text-3xl text-black dark:text-white tracking-tight">Thank You</p>
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 dark:text-white/40 font-bold">To everyone who joined · In Person & Virtually</p>
          </motion.div>
        </div>
      </section>
    );
  }

  // ── Success screen ───────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <section
        ref={ref}
        id="rsvp"
        className="py-12 bg-white dark:bg-black min-h-[60vh] flex items-center transition-colors"
      >
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-12 h-12 text-red-500 mx-auto mb-4 fill-current" />
          <h2 className="font-display text-4xl text-black dark:text-white mb-8 uppercase tracking-tight">
            Thank You — Your Seat Will Be Reserved and You'll Be Notified Soon
          </h2>
          <GiftRegistry compact />
        </div>
      </section>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <section
      ref={ref}
      id="rsvp"
      className="relative py-12 bg-white dark:bg-black overflow-visible scroll-mt-20 transition-colors"
    >
      <div className="container mx-auto px-4 relative z-10">

        {/* HEADER */}
        <div className="text-center mb-10">
          <span className="text-[11px] tracking-[0.5em] uppercase text-black/60 dark:text-white/60 font-medium">✦ KINDLY RESPOND ✦</span>
          <h2 className="font-display text-8xl md:text-9xl text-black dark:text-white mt-4 mb-2 tracking-tighter uppercase leading-none">RSVP</h2>

          <div className="text-black/60 dark:text-white/60 space-y-1 text-sm md:text-base mt-6">
            <p>Please respond by <span className="text-black dark:text-white font-medium">{config.rsvpDeadlineDisplay}</span>.</p>
            {config.guestCapacity > 0 && (
              <p>Seating is strictly limited to <span className="text-black dark:text-white font-medium">{config.guestCapacity} guests</span>.</p>
            )}
          </div>

          {formData.attendanceType === "physical" && (
            <div className="mt-8 mx-auto max-w-[460px] bg-gray-100/30 dark:bg-white/5 border border-gray-300 dark:border-white/5 rounded-xl p-5 flex items-start gap-4 text-left shadow-2xl transition-colors">
              <Info className="w-5 h-5 text-black/80 dark:text-white/80 flex-shrink-0 mt-0.5" />
              <p className="text-black dark:text-white text-[11px] md:text-xs leading-relaxed">
                <span className="font-bold">IMPORTANT:</span> As this is an intimate celebration, we kindly ask that you notify us immediately if your plans change by replying to your seat confirmation email so we may release your seat to others.
              </p>
            </div>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} noValidate className="max-w-[720px] mx-auto">
          <div className="border border-gray-300 dark:border-white/5 rounded-xl bg-gray-100 dark:bg-[#161616] p-8 md:p-12 shadow-2xl relative transition-colors">

            {/* ATTENDANCE TOGGLE */}
            <div className="flex justify-center mb-10">
              <div className="bg-gray-200/30 dark:bg-white/10 p-1 rounded-xl inline-flex border border-gray-300 dark:border-white/5 transition-colors">
                <button
                  type="button"
                  onClick={() => handleTypeChange("physical")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${formData.attendanceType === "physical" ? "bg-black text-white dark:bg-white dark:text-black" : "text-black/30 dark:text-white/30"}`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>In-Person</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("virtual")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${formData.attendanceType === "virtual" ? "bg-black text-white dark:bg-white dark:text-black" : "text-black/30 dark:text-white/30"}`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Virtual (Stream)</span>
                </button>
              </div>
            </div>

            {/* NAME & EMAIL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2" data-error={!!errors.name}>
                <label className="text-[10px] uppercase tracking-[0.2em] text-black/60 dark:text-white/40 font-bold">FULL NAME *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls("name")}
                  placeholder="Your full name"
                  aria-invalid={!!errors.name}
                />
                <ErrorMsg field="name" />
              </div>
              <div className="space-y-2" data-error={!!errors.email}>
                <label className="text-[10px] uppercase tracking-[0.2em] text-black/60 dark:text-white/40 font-bold">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls("email")}
                  placeholder="your@email.com"
                  aria-invalid={!!errors.email}
                />
                <ErrorMsg field="email" />
              </div>
            </div>

            {/* PHONE & RELATIONSHIP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2" data-error={!!errors.phone}>
                <label className="text-[10px] uppercase tracking-[0.2em] text-black/60 dark:text-white/40 font-bold">PHONE NUMBER</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onKeyDown={handlePhoneKeyDown}
                  onBlur={handleBlur}
                  className={inputCls("phone")}
                  placeholder="+254 700 000 000"
                  aria-invalid={!!errors.phone}
                />
                <ErrorMsg field="phone" />
              </div>
              <div className="space-y-2" data-error={!!errors.relationship}>
                <label className="text-[10px] uppercase tracking-[0.2em] text-black/60 dark:text-white/40 font-bold">GUEST AFFILIATION *</label>
                <div className="relative">
                  <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputCls("relationship")} appearance-none cursor-pointer`}
                    aria-invalid={!!errors.relationship}
                  >
                    <option value="" disabled>Select relation...</option>
                    <option value="Bride Family">Bride's Family</option>
                    <option value="Groom Family">Groom's Family</option>
                    <option value="Friend">Friend</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30 pointer-events-none" />
                </div>
                <ErrorMsg field="relationship" />
              </div>
            </div>

            {/* PHYSICAL ONLY SECTION */}
            <AnimatePresence>
              {formData.attendanceType === "physical" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  {/* Guest Count */}
                  <div className="mb-6">
                    <div className="space-y-2" data-error={!!errors.guests}>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-black/60 dark:text-white/40 font-bold">GUEST COUNT *</label>
                      <div className="relative">
                        <select
                          name="guests"
                          value={formData.guests}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`${inputCls("guests")} appearance-none`}
                          aria-invalid={!!errors.guests}
                        >
                          <option value="" disabled>Select...</option>
                          <option value="1">1 Guest</option>
                          <option value="2">2 Guests</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30 pointer-events-none" />
                      </div>
                      <ErrorMsg field="guests" />

                      {formData.guests === "2" && (
                        <div className="mt-4 space-y-2" data-error={!!errors.guestName}>
                          <label className="text-[10px] uppercase tracking-[0.2em] text-black/60 dark:text-white/40 font-bold">PARTNER'S NAME *</label>
                          <input
                            type="text"
                            name="guestName"
                            value={formData.guestName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={inputCls("guestName")}
                            placeholder="Enter partner's name"
                            aria-invalid={!!errors.guestName}
                          />
                          <ErrorMsg field="guestName" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MESSAGE */}
            <div className="mb-10 space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-black/60 dark:text-white/40 font-bold">MESSAGE FOR THE COUPLE</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white dark:bg-[#161616] border border-gray-300 dark:border-white/5 rounded-lg px-4 py-3.5 text-black dark:text-white resize-none focus:outline-none transition-colors"
                placeholder="Share your wishes or any special notes..."
              />
            </div>

            {/* BACKEND ERROR */}
            <AnimatePresence>
              {backendError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-5 bg-amber-100 dark:bg-amber-900 rounded-lg text-amber-800 dark:text-amber-200 text-sm"
                >
                  <AlertTriangle className="w-4 h-4 inline-block mr-2" /> {backendError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-10 py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-colors flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              Submit RSVP
            </button>

          </div>
        </form>
      </div>
    </section>
  );
};