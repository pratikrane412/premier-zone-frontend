import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Activity, Goal, MousePointer2, ShieldAlert } from "lucide-react";

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const posDetails = {
    GK: {
      title: "Guardians",
      icon: <ShieldCheck size={20} />,
      desc: "The final layer of tactical defense. Detailed clean sheet, save percentage, and box control metrics.",
      accent: "from-amber-500 to-yellow-600",
      pillBg: "bg-amber-50 text-amber-900 border-amber-200"
    },
    DF: {
      title: "Architects",
      icon: <Activity size={20} />,
      desc: "Tactical masterminds. Analyzing tackles, interceptions, recovery runs, and defensive depth.",
      accent: "from-blue-500 to-indigo-600",
      pillBg: "bg-blue-50 text-blue-900 border-blue-200"
    },
    MF: {
      title: "Engines",
      icon: <Zap size={20} />,
      desc: "The transition management core. Playmaking efficiency, key passes, and defensive transition cover.",
      accent: "from-emerald-500 to-teal-600",
      pillBg: "bg-emerald-50 text-emerald-900 border-emerald-200"
    },
    FW: {
      title: "Finishers",
      icon: <Goal size={20} />,
      desc: "The clinical edge. Goal conversion rates, expected goals (xG), and final third efficiency.",
      accent: "from-rose-500 to-pink-600",
      pillBg: "bg-rose-50 text-rose-900 border-rose-200"
    },
  };

  useEffect(() => {
    axios
      .get("https://premier-backend.onrender.com/positions")
      .then((res) => {
        setPositions(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f5f8]">
        <div className="flex flex-col items-center gap-4">
          <Activity size={40} className="text-purple-950 animate-pulse" />
          <p className="text-xs font-black text-purple-950 uppercase tracking-[4px]">Loading Tactics...</p>
        </div>
      </div>
    );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto relative"
    >
      {/* Background Blobs */}
      <div className="blob w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-200/20 top-[-10%] right-[-5%]"></div>
      <div className="blob w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-pink-100/20 bottom-[-5%] left-[-5%]"></div>

      {/* Header Panel */}
      <header className="mb-10 md:mb-16 space-y-6 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
            Tactical Classifications
          </span>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200/60 pb-8 md:pb-12">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-none tracking-tighter text-slate-900">
            Pitch <span className="text-accent-gradient">Roles.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-md font-semibold leading-relaxed lg:border-l lg:border-slate-200 lg:pl-8">
            Filter the league's elite footballers by their primary spatial responsibilities on the pitch.
          </p>
        </div>
      </header>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
        {positions.map((pos, index) => {
          const detail = posDetails[pos] || {
            title: pos,
            icon: <ShieldAlert size={20} />,
            desc: "Tactical performance dataset.",
            accent: "from-purple-500 to-indigo-600",
            pillBg: "bg-purple-50 text-purple-900 border-purple-200"
          };

          return (
            <motion.div
              key={pos}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            >
              <Link
                to={`/players?position=${pos}`}
                className="glass-card group relative block overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] sm:aspect-[3/4] overflow-hidden bg-slate-100">
                  <img
                    src={`/positions/${pos}.png`}
                    alt={pos}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/logo.png"; }}
                  />

                  {/* Gradient overlay for light mode readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent opacity-95 group-hover:opacity-90 transition-opacity duration-300"></div>
                  
                  {/* Position abbreviation */}
                  <div className="absolute top-4 right-6 font-black text-slate-800/10 text-5xl sm:text-6xl select-none group-hover:text-purple-600/15 transition-all">
                    {pos}
                  </div>

                  {/* Position Details overlay */}
                  <div className="absolute bottom-4 left-6 z-10">
                     <div className="flex items-center gap-3">
                        <div className={`p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 shadow-md group-hover:bg-purple-950 group-hover:text-white group-hover:border-purple-950 transition-all duration-300`}>
                          {detail.icon}
                        </div>
                        <h3 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">{detail.title}</h3>
                     </div>
                  </div>
                </div>

                {/* Card footer description */}
                <div className="p-6 bg-white space-y-6">
                  <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed h-12 overflow-hidden">
                    {detail.desc}
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-purple-700">
                    <span className="text-[9px] font-black uppercase tracking-wider">Scouting Board</span>
                    <div className="flex items-center gap-1 font-bold text-xs uppercase tracking-wider group-hover:text-purple-950 transition-colors">
                      <span>Analyze</span>
                      <MousePointer2 size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
