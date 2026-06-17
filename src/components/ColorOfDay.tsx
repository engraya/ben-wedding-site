import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Palette } from "lucide-react";
import { config } from "@/config";

const colors = config.colorOfDay;

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
          className="flex justify-center gap-6 md:gap-10 mb-12"
        >
          {colors.map((color, index) => (
            <motion.button
              key={color.name}
              onClick={() => setActiveColor(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-500 ${
                activeColor === index
                  ? "bg-white/10 backdrop-blur-md border border-white/20"
                  : "hover:bg-white/5"
              }`}
            >
              {/* Color circle */}
              <div
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-500 ${
                  activeColor === index
                    ? `ring-2 ring-offset-4 ring-offset-background ${
                        color.hex === "#FFFFFF"
                          ? "ring-gray-400"
                          : "ring-[#C4849A]"
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
                {color.hex === "#FFFFFF" && (
                  <div className="absolute inset-0 rounded-full border border-foreground/20" />
                )}
                <motion.div
                  initial={false}
                  animate={{ scale: activeColor === index ? 1 : 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Palette className="w-6 h-6 text-foreground/70" />
                </motion.div>
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

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            {colors[activeColor].images.map((image, index) => (
              <motion.div
                key={`${activeColor}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-20 mix-blend-overlay z-10 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${colors[activeColor].hex}40, transparent)`,
                    }}
                  />

                  {/* Image */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="eager"
                    className="w-full aspect-[3/4] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Decorative corners */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-white/30 rounded-tl-lg" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-white/30 rounded-tr-lg" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-white/30 rounded-bl-lg" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-white/30 rounded-br-lg" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Color description */}
          <motion.p
            key={activeColor}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-8 text-muted-foreground italic font-serif text-lg"
          >
            "{colors[activeColor].description}"
          </motion.p>
        </motion.div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-8 px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
            {colors.map((color, index) => (
              <div key={color.name} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-xs tracking-widest uppercase text-muted-foreground">or</span>
                )}
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: color.hex,
                    ...(color.hex === "#FFFFFF"
                      ? { border: "1px solid rgba(0,0,0,0.2)" }
                      : {}),
                  }}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
