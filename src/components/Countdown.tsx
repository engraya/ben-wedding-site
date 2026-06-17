import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { config } from "@/config";

const WEDDING_DATE = new Date(config.eventStartUTC);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ThankYou = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col items-center gap-4 text-center"
  >
    <motion.div
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <Heart className="w-8 h-8 fill-current text-foreground/60" />
    </motion.div>
    <p className="font-display text-3xl md:text-5xl lg:text-6xl tracking-tight text-foreground">
      {config.postWeddingHeadline}
    </p>
    <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-muted-foreground/70 font-light">
      {config.postWeddingSubtext}
    </p>
  </motion.div>
);

export const Countdown = () => {
  const isPast = +WEDDING_DATE - +new Date() <= 0;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [married, setMarried] = useState(isPast);

  useEffect(() => {
    if (isPast) return;

    const calculateTimeLeft = () => {
      const difference = +WEDDING_DATE - +new Date();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return null;
    };

    setTimeLeft(calculateTimeLeft() ?? { days: 0, hours: 0, minutes: 0, seconds: 0 });

    const timer = setInterval(() => {
      const result = calculateTimeLeft();
      if (result) {
        setTimeLeft(result);
      } else {
        setMarried(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPast]);

  if (married) return <ThankYou />;

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className="flex items-center justify-center gap-3 md:gap-6 lg:gap-10">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 + index * 0.1, type: "spring" }}
          className="relative text-center group"
        >
          <motion.div
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
            className="absolute inset-0 bg-foreground/5 blur-2xl rounded-full scale-150"
          />

          <div className="relative glass-card p-4 md:p-6 lg:p-8 min-w-[70px] md:min-w-[100px] lg:min-w-[130px] border border-white/10 rounded-xl bg-white/5 backdrop-blur-md shadow-xl">
            <div className="relative overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={unit.value}
                  initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                  className="block font-display text-4xl md:text-6xl lg:text-7xl font-light epic-text text-foreground"
                >
                  {unit.value.toString().padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>

            <span className="block mt-3 text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-muted-foreground/70 font-medium">
              {unit.label}
            </span>

            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-foreground/30" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-foreground/30" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-foreground/30" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-foreground/30" />
          </div>

          {index < timeUnits.length - 1 && (
            <div className="absolute -right-2 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2 opacity-50">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-1 rounded-full bg-current"
              />
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="w-1 h-1 rounded-full bg-current"
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
