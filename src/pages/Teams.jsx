import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LayoutGrid, Search } from "lucide-react";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://premier-backend.onrender.com/teams")
      .then((res) => {
        setTeams(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching teams:", err));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-heritage-base">
        <div className="flex flex-col items-center gap-4">
          <div className="w-1 h-12 bg-heritage-border relative overflow-hidden">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-heritage-accent"
            />
          </div>
          <p className="text-[10px] font-black text-heritage-text uppercase tracking-[4px]">Accessing Archives</p>
        </div>
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
      <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-heritage-border pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[4px] text-heritage-accent">Member Directory</span>
            <div className="w-8 h-px bg-heritage-accent"></div>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif italic text-heritage-text leading-none">
            The <span className="not-italic">Clubs.</span>
          </h1>
          <p className="text-lg text-heritage-muted max-w-xl leading-relaxed">
            A comprehensive visual index of the 20 prestigious organisations 
            competing in the 2024/25 campaign.
          </p>
        </div>

        <div className="flex flex-col gap-4 items-start md:items-end">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-heritage-border text-heritage-text">
            <Search size={14} className="opacity-40" />
            <input type="text" placeholder="Filter clubs..." className="bg-transparent border-none text-xs focus:outline-none w-32" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[3px] text-heritage-text/40">Total active entries: {teams.length}</span>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {teams.map((team, index) => (
          <motion.div
            key={team}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.8 }}
          >
            <Link
              to={`/players?team=${team}`}
              className="group block space-y-8"
            >
              {/* Image Frame */}
              <div className="relative aspect-square bg-white border border-heritage-border flex items-center justify-center p-12 transition-all duration-700 group-hover:border-heritage-accent overflow-hidden">
                <div className="absolute inset-0 bg-heritage-base opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img
                  src={`/teams/${team}.png`}
                  alt={team}
                  className="w-full h-auto object-contain relative z-10 filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 contrast-[1.05]"
                  onError={(e) => { e.target.onerror = null; e.target.src = "/logo.png"; }}
                />
                <span className="absolute bottom-4 left-4 text-[10px] font-black text-heritage-text opacity-10 group-hover:opacity-40 transition-opacity uppercase tracking-widest">Index {index + 1}</span>
              </div>

              {/* Typography */}
              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-heritage-text uppercase tracking-[3px] group-hover:text-heritage-accent transition-colors">
                    {team.replace(/-/g, " ")}
                  </h3>
                  <ArrowRight size={14} className="text-heritage-accent opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </div>
                <div className="h-px w-full bg-heritage-border scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700"></div>
                <p className="text-[10px] font-serif italic text-heritage-muted uppercase tracking-widest">Technical Squad Registry</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
