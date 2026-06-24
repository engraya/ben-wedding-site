import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Palette } from "lucide-react";
import { config } from "@/config";

const colors = config.colorOfDay;

/** Relative luminance of a hex color (0 = black, 1 = white). */
const luminance = (hex: string) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

/** Returns true when a color is light enough to need dark foreground content. */
const isLight = (hex: string) => luminance(hex) > 0.6;

export const ColorOfDay = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeColor, setActiveColor] = useState(0);

  return (
    <section
      ref={ref}
      id="dress-code"
      className="relative py-16 md:py-24 overflow-hidden scroll-mt-20"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] border border-[#C4849A]/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] border border-foreground/5 rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.span className="inline-block text-xs tracking-[0.4em] uppercase text-muted-foreground mb-3">
            ✦ Dress Code ✦
          </motion.span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-8xl mb-4 epic-text tracking-tight">
            Color of the Day
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="h-px w-24 mx-auto bg-foreground/20"
          />
          <p className="mt-6 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            We invite you to join us dressed in either of these elegant colors
          </p>

          {/* Disclaimer */}
          {config.colorOfDayDisclaimer && (
            <p className="mt-4 text-sm md:text-base text-red-400 max-w-lg mx-auto italic">
              {config.colorOfDayDisclaimer}
            </p>
          )}
        </motion.div>

        {/* Color Swatches */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12"
        >
          {colors.map((color, index) => (
            <motion.button
              key={color.name}
              onClick={() => setActiveColor(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative flex flex-col items-center gap-4 px-6 py-7 rounded-2xl backdrop-blur-md transition-all duration-500 ${
                activeColor === index
                  ? "bg-white/10 border border-white/20"
                  : "bg-white/5 border border-white/10 hover:bg-white/[0.07]"
              }`}
            >
              {/* Color circle */}
              <div
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-500 ${
                  activeColor === index
                    ? `ring-2 ring-offset-4 ring-offset-background ${
                        isLight(color.hex) ? "ring-gray-400" : "ring-[#C4849A]"
                      }`
                    : ""
                }`}
                style={{
                  backgroundColor: color.hex,
                  boxShadow:
                    activeColor === index
                      ? `0 0 30px ${color.hex}40`
                      : "none",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Palette
                    className="w-6 h-6"
                    style={{
                      color: isLight(color.hex)
                        ? "rgba(0,0,0,0.55)"
                        : "rgba(255,255,255,0.8)",
                    }}
                  />
                </div>
              </div>

              {/* Color info */}
              <div className="text-center">
                <p className="font-display text-lg md:text-xl">{color.name}</p>
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground/60">
                  {color.hex}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
