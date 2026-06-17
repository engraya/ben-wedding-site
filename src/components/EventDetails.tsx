import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Wine,
  ChevronDown,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { config } from "@/config";

const formatEventTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
};

export const EventDetails = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const details = [
    {
      icon: Calendar,
      label: "Date",
      value: config.eventDateDisplay,
      subtext: config.eventDayDisplay,
    },
    {
      icon: Clock,
      label: "Time",
      value: formatEventTime(config.seatingStartUTC),
      subtext: config.seatingCopy,
    },
    {
      icon: MapPin,
      label: "Venue",
      value: config.venueDisplay,
      subtext: config.venueSubtext,
    },
    {
      icon: Wine,
      label: "Reception",
      value: "Mocktails & Dinner",
      subtext: "To Follow Immediately",
    },
  ];

  const eventTitle = `Wedding of ${config.partner1} & ${config.partner2}`;
  const startTime = config.eventStartUTC.replace(/[-:]/g, "").replace(".000", "").replace("Z", "Z");
  const endTime = config.eventEndUTC.replace(/[-:]/g, "").replace(".000", "").replace("Z", "Z");
  const description = "Join us as we celebrate our love. Seating is strictly limited.";
  const location = "TBD - Address provided upon RSVP";

  const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventTitle)}&startdt=${startTime}&enddt=${endTime}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

  return (
    <section
      ref={ref}
      id="details"
      className="relative py-8 md:py-10 overflow-hidden scroll-mt-20 md:scroll-mt-28"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] border border-foreground/5 rounded-full opacity-20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] border border-foreground/5 rounded-full opacity-20"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-6 md:mb-8"
        >
          <motion.span className="inline-block text-xs tracking-[0.4em] uppercase text-muted-foreground mb-2">
            ✦ The Details ✦
          </motion.span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-8xl mb-3 epic-text tracking-tight">
            When & Where
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="h-px w-24 mx-auto bg-foreground/20"
          />
        </motion.div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
          {details.map((detail, index) => (
            <motion.div
              key={detail.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="group h-full"
            >
              <div className="h-full p-4 md:p-6 text-center relative overflow-hidden border border-white/10 rounded-xl bg-white/5 backdrop-blur-md shadow-xl transition-colors duration-500 hover:bg-white/10">
                <motion.div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative inline-flex items-center justify-center w-12 h-12 mb-4 border border-foreground/20 rounded-full">
                  <detail.icon className="w-4 h-4 text-foreground/70" />
                </div>

                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/80 mb-1 font-medium">
                  {detail.label}
                </p>

                <p className="font-display text-lg md:text-xl mb-0.5 text-foreground font-light">
                  {detail.value}
                </p>

                <p className="text-sm text-muted-foreground/60">
                  {detail.subtext}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ADD TO CALENDAR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="flex justify-center mb-12"
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 px-7 py-3 bg-white/[0.03] border border-white/10 rounded-full hover:bg-white/10 transition-all group outline-none">
              <Calendar className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/80">
                Add to Calendar
              </span>
              <ChevronDown className="w-3 h-3 text-white/20" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="center"
              className="bg-[#0a0a0a] border border-white/10 text-white min-w-[220px] p-2 rounded-xl shadow-2xl backdrop-blur-xl"
            >
              <DropdownMenuItem className="focus:bg-white/5 rounded-lg transition-colors cursor-pointer">
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full text-[10px] uppercase font-bold tracking-widest p-2"
                >
                  Google Calendar <ExternalLink className="w-3 h-3 text-white/20" />
                </a>
              </DropdownMenuItem>

              <DropdownMenuItem className="focus:bg-white/5 rounded-lg transition-colors cursor-pointer">
                <a
                  href={outlookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full text-[10px] uppercase font-bold tracking-widest p-2"
                >
                  Outlook / Office 365 <ExternalLink className="w-3 h-3 text-white/20" />
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* QUOTE SECTION */}
        {config.quote && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center relative max-w-4xl mx-auto px-6"
          >
            <blockquote className="font-display text-2xl md:text-4xl italic text-foreground/90 leading-relaxed">
              "{config.quote}"
            </blockquote>
            {config.quoteAttribution && (
              <p className="mt-4 text-xs tracking-[0.3em] uppercase text-muted-foreground">
                — {config.quoteAttribution}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};
