import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowRight, LayoutGrid } from "lucide-react";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Animation variants for the staggered grid
  const containerVars = {
    animate: { transition: { staggerChildren: 0.05 } },
  };

  const cardVars = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-brand-primary rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
            Fetching Clubs
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.header
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-8"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-primary text-white">
              <Shield size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Official Directory
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900">
              League <span className="text-brand-primary italic">Clubs</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-xl font-medium">
              Browse the elite 20 clubs of the 2024/25 season. Access detailed
              squad analytics and tactical profiles.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <LayoutGrid className="text-brand-primary" size={20} />
            <span className="text-sm font-black text-slate-900">
              {teams.length} Clubs Active
            </span>
          </div>
        </motion.header>

        {/* Staggered Grid */}
        <motion.div
          variants={containerVars}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {teams.map((team, index) => (
            <motion.div variants={cardVars} key={index}>
              <Link
                to={`/players?team=${team}`}
                className="group relative flex flex-col items-center justify-between p-8 h-80 bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(61,25,91,0.12)] hover:border-brand-primary/10 hover:-translate-y-2 overflow-hidden"
              >
                {/* Subtle Background Number */}
                <span className="absolute -bottom-4 -right-2 text-9xl font-black text-slate-50 group-hover:text-slate-100 transition-colors pointer-events-none select-none">
                  {index + 1}
                </span>

                {/* Logo Container */}
                <div className="relative z-10 w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 bg-brand-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 blur-xl"></div>
                  <img
                    src={`/teams/${team}.png`}
                    alt={`${team} logo`}
                    className="max-h-full max-w-full object-contain relative z-10 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/logo.png";
                    }}
                  />
                </div>

                {/* Team Label */}
                <div className="relative z-10 text-center space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-[2px] group-hover:text-brand-primary transition-colors">
                    {team.replace(/-/g, " ")}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-brand-primary font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Stats <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
