import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { config } from "@/config";

const MusicPlayerInner = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Try to auto-play immediately on mount
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.3;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      // Browser blocked autoplay — start on first interaction
      const handleFirstInteraction = () => {
        if (audioRef.current) {
          audioRef.current.volume = 0.3;
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("touchstart", handleFirstInteraction);
      };
      document.addEventListener("click", handleFirstInteraction);
      document.addEventListener("touchstart", handleFirstInteraction);
    });
  }, []);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 0.3;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={config.musicSrc} loop preload="auto" />

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3, duration: 0.6 }}
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border border-foreground/20 bg-background/80 backdrop-blur-xl flex items-center justify-center hover:bg-foreground/10 transition-all duration-300 group"
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Volume2 className="w-4 h-4 text-foreground/70" />
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <VolumeX className="w-4 h-4 text-foreground/40" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing ring when playing */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full border border-foreground/20"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.button>
    </>
  );
};

export const MusicPlayer = () => {
  if (!config.musicSrc) return null;
  return <MusicPlayerInner />;
};
