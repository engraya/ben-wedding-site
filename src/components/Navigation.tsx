import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { config } from "@/config";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      return newTheme;
    });
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 2 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
        isScrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border/50 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="wedding-container flex items-center justify-between">
        {/* Logo */}
        <motion.a href="#" whileHover={{ scale: 1.05 }} className="font-display text-xl md:text-2xl relative group">
          <span className="relative z-10">.{config.partner1[0]}{config.partner2[0]}</span>
          <motion.span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-500" />
        </motion.a>

        {/* Nav buttons + Theme Toggle */}
        <div className="flex items-center gap-4 md:gap-10 relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection("gifts")}
            className="text-xs tracking-[0.2em] uppercase hover:text-muted-foreground transition-colors relative group"
          >
            Gifts
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection("rsvp")}
            className="text-xs tracking-[0.2em] uppercase hover:text-muted-foreground transition-colors relative group"
          >
            RSVP
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};
