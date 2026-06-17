import { motion, useScroll, useTransform } from "framer-motion";
import { Countdown } from "./Countdown";
import { ParticleField } from "./ParticleField";
import { useRef } from "react";
import { config } from "@/config";

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      ref={ref}
      className="relative min-h-[70vh] md:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-8 md:pt-28 md:pb-16"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <ParticleField />

      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <motion.div
          style={{ y }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-foreground/5 to-transparent blur-[100px]"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-foreground/5 to-transparent blur-[120px]"
        />
      </div>

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-4 flex flex-col items-center justify-center h-full"
      >
        <motion.div 
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4 opacity-60">
             <span className="h-px w-8 bg-foreground/40" />
             <span className="text-[10px] tracking-[0.4em] uppercase text-foreground">Est. {config.establishmentYear}</span>
             <span className="h-px w-8 bg-foreground/40" />
          </div>
           <p className="text-xs md:text-sm tracking-[0.2em] uppercase text-muted-foreground font-light leading-relaxed">
             <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="inline-block">With Consent From Both Families,</motion.span>
             <br />
             <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="inline-block">We joyfully invite you to celebrate the union of our children</motion.span>
           </p>
        </motion.div>

        <motion.div 
          style={{ y: textY }}
          className="relative w-full flex flex-col items-center justify-center py-4 md:py-8"
        >
          <motion.h1
            initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[5rem] md:text-[8rem] lg:text-[11rem] leading-[0.8] tracking-tight text-foreground mix-blend-difference relative z-10"
          >
            {config.partner1}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="font-serif italic text-3xl md:text-6xl lg:text-7xl text-muted-foreground/50 my-2 md:my-4 relative z-0"
          >
            {config.conjunction}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[4rem] md:text-[8rem] lg:text-[11rem] leading-none tracking-tight text-foreground mix-blend-difference relative z-10"
          >
            {config.partner2}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-10 md:mt-12 text-xs md:text-sm tracking-[0.3em] uppercase text-muted-foreground/80 font-light"
          >
            An intimate celebration of love
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 md:mt-16 flex flex-col items-center gap-6 md:gap-8 w-full"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-foreground/5 blur-3xl rounded-full scale-150" />
            <Countdown />
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};