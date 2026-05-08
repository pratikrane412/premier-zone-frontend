import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Activity, Goal, MousePointer2 } from "lucide-react";

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const posDetails = {
    GK: {
      title: "Guardians",
      icon: <ShieldCheck size={20} />,
      desc: "The final layer of tactical defense. Detailed clean sheet and save metrics.",
    },
    DF: {
      title: "Architects",
      icon: <Activity size={20} />,
      desc: "Tactical masterminds. Analyzing tackles, interceptions, and defensive depth.",
    },
    MF: {
      title: "Engines",
      icon: <Zap size={20} />,
      desc: "The transition management core. Playmaking efficiency and advanced passing.",
    },
    FW: {
      title: "Finishers",
      icon: <Goal size={20} />,
      desc: "The clinical edge. Goal conversion rates, xG, and strike efficiency.",
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
      <div className="min-h-screen flex items-center justify-center bg-glass-base">
        <div className="flex flex-col items-center gap-6">
          <Activity size={48} className="text-glass-accent animate-pulse" />
          <p className="text-sm font-bold text-glass-muted uppercase tracking-[4px]">Loading Framework</p>
        </div>
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
      <div className="blob w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-glass-accent/10 top-[-20%] right-[-10%]"></div>
      <div className="blob w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-glass-highlight/10 bottom-[-10%] left-[-5%]"></div>

      {/* Modern Header */}
      <header className="mb-10 md:mb-20 space-y-6 md:space-y-10 relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-glass-highlight">Tactical Framework</span>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-none tracking-tighter">
            Field <br />
            <span className="text-accent-gradient tracking-tighter">Roles.</span>
          </h1>
          <p className="text-sm md:text-lg text-glass-muted max-w-md leading-relaxed font-medium lg:border-l lg:border-white/10 lg:pl-10">
            A specialized classification of elite performance filtered by technical responsibilities on the pitch.
          </p>
        </div>
      </header>

      {/* Glass Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
        {positions.map((pos, index) => (
          <motion.div
            key={pos}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            <Link
              to={`/players?position=${pos}`}
              className="glass-card group relative block overflow-hidden group-hover:-translate-y-2 transition-all duration-500"
            >
              {/* Image Frame */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={`/positions/${pos}.png`}
                  alt={pos}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  onError={(e) => { e.target.onerror = null; e.target.src = "/logo.png"; }}
                />

                {/* Glass Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-glass-base via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700"></div>
                
                {/* Role Code Tag */}
                <div className="absolute top-0 right-0 p-4 md:p-8">
                  <span className="text-4xl md:text-6xl font-black opacity-[0.05] group-hover:text-glass-accent group-hover:opacity-20 transition-all duration-700">{pos}</span>
                </div>

                {/* Label (Bottom) */}
                <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 z-10">
                   <div className="flex items-center gap-3 md:gap-4">
                      <div className="p-2 md:p-3 bg-glass-surface backdrop-blur-md border border-glass-border rounded-xl md:rounded-2xl text-glass-highlight group-hover:bg-glass-highlight group-hover:text-white transition-all duration-500 shadow-xl">
                        {React.cloneElement(posDetails[pos]?.icon || <Activity size={20} />, { size: 16, className: "md:w-5 md:h-5" })}
                      </div>
                      <h3 className="text-xl md:text-3xl font-black tracking-tighter">{posDetails[pos]?.title || pos}</h3>
                   </div>
                </div>
              </div>

              {/* Technical Description */}
              <div className="p-6 md:p-10 space-y-6 md:space-y-8">
                <p className="text-glass-muted text-[11px] md:text-sm font-medium leading-relaxed h-10 md:h-12 overflow-hidden">
                  {posDetails[pos]?.desc}
                </p>

                <div className="pt-4 md:pt-8 border-t border-white/5 flex items-center justify-between text-glass-accent">
                  <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[2px] md:tracking-[3px]">Analytical Dataset</span>
                  <MousePointer2 size={14} className="md:w-4 md:h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
