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
      <div className="min-h-screen flex items-center justify-center bg-glass-base">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 border-4 border-glass-accent/20 border-t-glass-accent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-glass-highlight uppercase tracking-[4px] animate-pulse">Initializing Data</p>
        </div>
      </div>
    );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 md:pt-28 lg:pt-32 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto relative"
    >
      {/* Background Blobs */}
      <div className="blob w-[250px] md:w-[600px] h-[250px] md:h-[600px] bg-glass-accent/10 top-[-10%] left-[-5%]"></div>
      <div className="blob w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-glass-highlight/10 bottom-[-5%] right-[-2%]"></div>

      {/* Modern Header */}
      <header className="mb-10 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 border-b border-white/10 pb-8 md:pb-12 relative z-10">
        <div className="space-y-3 md:space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-glass-highlight">Premier League Clubs</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter">
            The <span className="text-accent-gradient">Elite.</span>
          </h1>
          <p className="text-sm md:text-lg text-glass-muted max-w-xl leading-relaxed font-medium">
            Explore the prestigious organizations competing in the 2024/25 campaign.
          </p>
        </div>

        <div className="flex flex-col gap-4 items-start md:items-end w-full md:w-auto">
          <div className="flex items-center gap-3 px-4 md:px-5 py-2.5 md:py-3 bg-glass-surface border border-glass-border backdrop-blur-md rounded-2xl group focus-within:border-glass-accent transition-all w-full md:w-auto">
            <Search size={16} className="text-glass-muted group-focus-within:text-glass-accent transition-colors" />
            <input type="text" placeholder="Filter clubs..." className="bg-transparent border-none text-xs md:text-sm font-bold focus:outline-none flex-1 md:w-48" />
          </div>
          <span className="text-[9px] md:text-xs font-bold text-glass-muted uppercase tracking-widest">Active Members: {teams.length}</span>
        </div>
      </header>

      {/* Glass Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
        {teams.map((team, index) => (
          <motion.div
            key={team}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.8 }}
          >
            <Link
              to={`/players?team=${team}`}
              className="group block"
            >
              <div className="glass-card p-6 md:p-10 aspect-square flex flex-col items-center justify-center relative overflow-hidden group-hover:-translate-y-2 transition-all duration-500">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent opacity-0 group-hover:opacity-[0.03] transition-opacity"></div>
                
                <div className="absolute top-4 md:top-6 right-6 md:right-8 text-4xl md:text-6xl font-black opacity-[0.03] group-hover:text-glass-accent group-hover:opacity-10 transition-all">{index + 1}</div>
                
                <img
                  src={`/teams/${team}.png`}
                  alt={team}
                  className="w-24 h-24 md:w-40 md:h-40 object-contain relative z-10 transition-all duration-700 group-hover:scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  onError={(e) => { e.target.onerror = null; e.target.src = "/logo.png"; }}
                />

                <div className="mt-6 md:mt-10 text-center relative z-10">
                  <h3 className="text-[10px] md:text-sm font-black uppercase tracking-[2px] md:tracking-[3px] group-hover:text-glass-highlight transition-colors">
                    {team.replace(/-/g, " ")}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-2 md:mt-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <span className="text-[8px] md:text-[10px] font-bold text-glass-accent uppercase tracking-widest">Technical Roster</span>
                    <ArrowRight size={10} className="md:w-3 md:h-3 text-glass-accent" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
