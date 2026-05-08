import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Compass, ArrowRight } from "lucide-react";

export default function Nations() {
  const [nations, setNations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://premier-backend.onrender.com/nations")
      .then((res) => {
        const sortedNations = res.data.sort((a, b) =>
          a.split(" ")[1].localeCompare(b.split(" ")[1]),
        );
        setNations(sortedNations);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-glass-base">
        <Globe size={48} className="text-glass-accent animate-spin shadow-[0_0_30px_#8b5cf6]" />
      </div>
    );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto relative"
    >
      {/* Background Blobs */}
      <div className="blob w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-glass-accent/10 top-[-10%] right-[-10%]"></div>
      <div className="blob w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-glass-highlight/10 bottom-[-10%] left-[-10%]"></div>

      {/* Modern Header */}
      <header className="mb-10 md:mb-20 space-y-6 md:space-y-10 relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-glass-accent">Global Index</span>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-none tracking-tighter">
            International <br />
            <span className="text-accent-gradient tracking-tighter">Distribution.</span>
          </h1>
          <p className="text-sm md:text-lg text-glass-muted max-w-md leading-relaxed font-medium border-l border-white/10 pl-4 md:pl-8">
            An analytical overview of the {nations.length} nations represented across the elite tiers of the Premier League.
          </p>
        </div>
      </header>

      {/* Glass Catalog Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 relative z-10">
        {nations.map((nationStr, index) => {
          const nationCode = nationStr.split(" ")[1];
          return (
            <motion.div
              key={nationCode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02, duration: 0.5 }}
            >
              <Link
                to={`/players?nation=${nationCode}`}
                className="group block space-y-2 md:space-y-4"
              >
                {/* Modern Glass Frame */}
                <div className="relative aspect-[3/2] bg-glass-surface backdrop-blur-md border border-glass-border rounded-xl md:rounded-2xl p-4 md:p-6 flex items-center justify-center transition-all duration-500 group-hover:bg-glass-accent/10 group-hover:border-glass-accent group-hover:shadow-2xl group-hover:shadow-glass-accent/10 overflow-hidden">
                  <img
                    src={`/flags/${nationCode}.png`}
                    alt={nationCode}
                    className="w-[60%] md:w-[70%] h-auto object-contain relative z-10 transition-all duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/logo.png"; }}
                  />
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between px-2 md:px-3 transition-colors duration-500">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest group-hover:text-glass-highlight">{nationCode}</span>
                  <ArrowRight size={12} className="text-glass-accent opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
