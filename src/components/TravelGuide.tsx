import { motion } from "framer-motion";
import { config } from "@/config";
import { 
  Plane, Car, Hotel, ExternalLink, ShieldCheck, 
  Youtube, UtensilsCrossed, Building, ArrowRight, 
  AlertTriangle, Camera, Compass, Palmtree, Smartphone,
  Info
} from "lucide-react";

export const TravelGuide = () => {
  return (
    <section id="travel" className="py-24 bg-white text-black dark:bg-black dark:text-white scroll-mt-20 overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* CENTERED BOLD HEADER */}
        <div className="flex flex-col items-center mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6 opacity-30"
          >
            <span className="h-px w-10 bg-black dark:bg-white" />
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span className="h-px w-10 bg-black dark:bg-white" />
          </motion.div>
          
          <h2 className="font-display text-5xl md:text-7xl tracking-tighter uppercase font-black leading-none">
            TRAVEL <span className="text-outline text-transparent">GUIDE</span>
          </h2>
          <p className="mt-6 text-[10px] tracking-[0.5em] uppercase text-black/50 dark:text-white/50 font-bold">
            Logistics & Recommendations
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* ROW 1: FLIGHTS & INTEGRATED BOLT CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* 01. ARRIVAL OPTIONS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-7 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/20 p-8 md:p-10 relative rounded-xl shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <Plane className="w-8 h-8 text-black dark:text-white" />
                  <h4 className="text-xl font-black uppercase italic tracking-tight">Arrival Options</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <h5 className="text-[11px] font-black uppercase text-black/60 dark:text-white/40 tracking-[0.2em]">Option A: Flight</h5>
                    <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed uppercase tracking-wider font-bold">
                      {config.airport.name}.
                      Carrier: <span className="bg-black text-white px-1 font-black">{config.airlineName}</span>
                    </p>
                    <a href={config.airlineBookingUrl} target="_blank" className="inline-flex items-center gap-2 text-[10px] font-black uppercase border border-black dark:border-white px-5 py-2.5 rounded-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                      Book {config.airlineName} <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="md:border-l md:border-gray-200 dark:md:border-white/10 md:pl-10 space-y-4">
                    <h5 className="text-[11px] font-black uppercase text-black/60 dark:text-white/40 tracking-[0.2em]">Option B: Road</h5>
                    <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed uppercase tracking-wider font-bold">
                      Safe interstate lines:
                    </p>
                    <div className="flex flex-col gap-3">
                      {config.roadTransportLinks.map((link) => (
                        <a key={link.url} href={link.url} target="_blank" className="text-xs font-black uppercase underline decoration-2 underline-offset-4">{link.label}</a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 02. INTEGRATED BOLT GUIDE (Setup + Behaviour) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-5 bg-gray-50 text-black dark:bg-white dark:text-black p-8 md:p-10 rounded-xl shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Smartphone className="w-6 h-6" />
                  <h4 className="text-xl font-black uppercase italic tracking-tight">Bolt in {config.rideshareCity}</h4>
                </div>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-black dark:border-black/80 pl-4">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Step 1: Setup</p>
                    <p className="text-[11px] font-medium leading-tight">Install the <span className="font-black">BOLT APP</span> and activate <span className="font-black italic underline">Ride PIN</span> in Settings.</p>
                  </div>

                  <div className="border-l-4 border-black dark:border-black/80 pl-4">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Step 2: Categories</p>
                    <div className="space-y-4 mt-2">
                      <div className="text-[11px] leading-tight">
                        <span className="font-black">CAR:</span> Drivers may renegotiate. <span className="font-bold underline italic">Politely insist on app price</span> and ensure they start the trip.
                      </div>
                      <div className="text-[11px] leading-tight">
                        <span className="font-black">KEKE:</span> Common & cheaper. They don't renegotiate, but <span className="font-bold italic">please tip them</span> if you keep them waiting.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-300 dark:border-white/10 mt-8">
                <p className="text-[9px] font-black uppercase italic opacity-70 dark:opacity-50">Note: Payment via Cash or Bank Transfer.</p>
              </div>
            </motion.div>
          </div>

          {/* ROW 2: RECOMMENDATIONS & LOCAL TRANSIT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* LOCAL TRANSIT INFO */}
            <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 p-8 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <Car className="w-6 h-6 text-black/40 dark:text-white/40" />
                  <h4 className="text-xl font-black uppercase italic text-black/90 dark:text-white/90">Local Transit</h4>
                </div>
                <p className="text-xs text-black/60 dark:text-white/60 leading-relaxed font-medium mb-6">
                  Blue & White buses and Keke are the local standard.
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/40">
                    <AlertTriangle className="w-3 h-3 text-amber-500" /> Sporadic stops / No Privacy
                  </li>
                  <li className="flex gap-3 text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/40">
                    <AlertTriangle className="w-3 h-3 text-amber-500" /> Strictly Cash payment
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                <p className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-500 italic leading-tight">
                  Outskirts: Prepare {config.transitCostRange}.
                </p>
              </div>
            </div>

            {/* FULL HOTEL LIST */}
            <div className="bg-gray-50 dark:bg-[#111] p-8 border border-gray-200 dark:border-white/10 rounded-xl">
              <Building className="w-6 h-6 mb-8 text-black/40 dark:text-white/40" />
              <h3 className="text-[9px] font-black uppercase tracking-[0.5em] mb-8 text-black/30 dark:text-white/30">Accommodation</h3>
              <ul className="grid grid-cols-1 gap-3 text-[11px] font-black uppercase tracking-widest leading-none text-black dark:text-white">
                {config.hotels.map((hotel, i) => (
                  <li key={i} className={i === config.hotels.length - 1 ? "" : ""}>
                    {hotel}
                  </li>
                ))}
              </ul>
            </div>

            {/* CUISINE & EXPLORE */}
            <div className="bg-gray-50 dark:bg-[#111] p-8 border border-gray-200 dark:border-white/10 rounded-xl">
              <UtensilsCrossed className="w-6 h-6 mb-8 text-black/40 dark:text-white/40" />
              <h3 className="text-[9px] font-black uppercase tracking-[0.5em] mb-8 text-black/30 dark:text-white/30">Cuisine & Explore</h3>
              <ul className="grid grid-cols-1 gap-3 text-[11px] font-black uppercase tracking-widest leading-none text-black dark:text-white">
                {config.restaurants.map((r, i) => (
                  <li key={i} className={i === config.restaurants.length - 3 ? "border-t border-gray-200 dark:border-white/10 pt-3 font-bold" : ""}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* ROW 3: MEDIA & MAP */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* TOURISM VIDEOS */}
            <div className="md:col-span-4 bg-white dark:bg-black text-black dark:text-white p-8 rounded-xl flex flex-col justify-between shadow-2xl">
              <div>
                <Camera className="w-6 h-6 mb-6" />
                <h3 className="text-[9px] font-black uppercase tracking-[0.5em] mb-6">Experience {config.rideshareCity}</h3>
                <div className="space-y-4">
                  {config.travelVideos.map((v) => (
                    <a key={v.url} href={v.url} target="_blank" className="flex items-center justify-between text-[10px] font-black uppercase border-b border-black/20 dark:border-white/20 pb-2 hover:opacity-70 transition-opacity">
                      {v.label.replace("{city}", config.rideshareCity)} <Youtube className="w-4 h-4 text-red-600"/>
                    </a>
                  ))}
                </div>
              </div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40 dark:opacity-50">Official Travel Guide {config.establishmentYear}</p>
            </div>

            {/* MAP EMBED */}
            <div className="md:col-span-8 h-[350px] md:h-auto relative border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-xl">
              <iframe
                src={config.mapEmbedSrc}
                title={`${config.airport.name} (${config.airport.iata})`}
                className="absolute inset-0 w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              {/* <div className="absolute bottom-4 left-4 p-4 bg-white/90 dark:bg-black/80 backdrop-blur-md border border-gray-300 dark:border-white/10 rounded-lg pointer-events-none">
                 <p className="text-[9px] uppercase font-bold text-black/50 dark:text-white/50 tracking-widest">Arrival Port</p>
                 <p className="text-sm font-black italic uppercase text-black dark:text-white">{config.airport.name} ({config.airport.iata})</p>
              </div> */}
            </div>
          </div>

        </div>
      </div>
      <style>{`
        .text-outline { -webkit-text-stroke: 1px black; -webkit-text-fill-color: transparent; }
        .dark .text-outline { -webkit-text-stroke: 1px white; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </section>
  );
};
