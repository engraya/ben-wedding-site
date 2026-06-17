import { motion, useInView } from "framer-motion";
import { Heart } from "lucide-react";
import { useRef } from "react";
import { config } from "@/config";

export const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="py-6 border-t border-white/5 overflow-hidden bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1.5 }}
        className="relative w-full flex whitespace-nowrap overflow-hidden"
      >
        {/* Container for the scrolling content - We duplicate it to ensure seamless looping */}
        <motion.div
          className="flex items-center gap-12 md:gap-24"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30, // Adjust speed here (higher = slower)
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Content Block (Repeated multiple times to fill width) */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 md:gap-24 opacity-50">
              <span className="font-display text-4xl md:text-6xl text-foreground">
                {config.partner1} {config.conjunction} {config.partner2}
              </span>

              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="text-xs tracking-[0.2em] uppercase">Est. {config.establishmentYear}</span>
              </div>

              <span className="font-display text-4xl md:text-6xl text-foreground/50">
                Together
              </span>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="w-4 h-4 fill-current" />
              </div>

              <span className="font-display text-4xl md:text-6xl text-foreground/50">
                Forever
              </span>
            </div>
          ))}
        </motion.div>
        
        {/* Gradient Fade Edges for smoother look */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
      </motion.div>
    </footer>
  );
};