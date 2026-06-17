import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { EventDetails } from "@/components/EventDetails";
import { ColorOfDay } from "@/components/ColorOfDay";
import { GiftRegistry } from "@/components/GiftRegistry";
import { RSVPForm } from "@/components/RSVPForm";
import { TravelGuide } from "@/components/TravelGuide"; 
import { Footer } from "@/components/Footer";
import { MusicPlayer } from "@/components/MusicPlayer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.substring(1);
    const sectionMap: Record<string, string> = {
      "rsvp": "rsvp",
      "gifts": "gifts",
      "details": "details",
      "travel": "travel" 
    };

    const targetId = sectionMap[path] || path;

    if (targetId) {
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-500">
      <ThemeToggle />
      <Navigation />
      <MusicPlayer />
      <main>
        <Hero />
        <EventDetails />
        <GiftRegistry />
        <RSVPForm />
        <ColorOfDay />
        <TravelGuide />
      </main>
      <Footer />
    </div>
  );
};

export default Index;