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
      <div className="min-h-screen flex items-center justify-center bg-heritage-base">
        <Globe size={32} className="text-heritage-accent animate-pulse" />
      </div>
    );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-40 pb-20 px-8 max-w-[1400px] mx-auto"
    >
      {/* Editorial Header */}
      <header className="mb-24 space-y-12">
        <div className="flex items-center gap-6">
          <div className="h-px w-12 bg-heritage-accent"></div>
          <span className="text-[10px] font-black uppercase tracking-[5px] text-heritage-accent">Global Index</span>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <h1 className="text-6xl md:text-8xl font-serif italic text-heritage-text leading-none">
            International <br />
            <span className="not-italic text-heritage-accent tracking-tighter">Distribution.</span>
          </h1>
          <p className="text-lg text-heritage-muted max-w-md leading-relaxed font-sans border-l border-heritage-border pl-8">
            An analytical overview of the {nations.length} nations represented 
            within the elite tiers of the Premier League.
          </p>
        </div>
      </header>

      {/* Catalog Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-12">
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
                className="group block space-y-4"
              >
                {/* Minimalist Flag Frame */}
                <div className="relative aspect-[3/2] bg-white border border-heritage-border p-6 flex items-center justify-center transition-all duration-700 group-hover:border-heritage-accent overflow-hidden">
                  <div className="absolute inset-0 bg-heritage-base opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <img
                    src={`/flags/${nationCode}.png`}
                    alt={nationCode}
                    className="w-[60%] h-auto object-contain relative z-10 filter grayscale group-hover:grayscale-0 transition-all duration-700 contrast-[1.05]"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/logo.png"; }}
                  />
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between border-t border-heritage-border pt-4 group-hover:border-heritage-accent transition-colors duration-500">
                  <span className="text-[10px] font-black text-heritage-text uppercase tracking-[3px]">{nationCode}</span>
                  <ArrowRight size={12} className="text-heritage-accent opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
