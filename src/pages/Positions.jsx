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
      <div className="min-h-screen flex items-center justify-center bg-heritage-base">
        <div className="w-12 h-px bg-heritage-border animate-pulse" />
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
      <header className="mb-32 space-y-12 text-center lg:text-left">
        <div className="flex items-center gap-6 justify-center lg:justify-start">
          <span className="text-[10px] font-black uppercase tracking-[5px] text-heritage-accent">Tactical Framework</span>
          <div className="h-px w-12 bg-heritage-accent"></div>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <h1 className="text-7xl md:text-9xl font-serif italic text-heritage-text leading-none tracking-tight">
            Field <br />
            <span className="not-italic text-heritage-accent tracking-tighter">Roles.</span>
          </h1>
          <p className="text-lg text-heritage-muted max-w-md leading-relaxed font-sans lg:border-l lg:border-heritage-border lg:pl-10">
            A technical categorization of professional performance 
            filtered by elite tactical responsibilities.
          </p>
        </div>
      </header>

      {/* Structured Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {positions.map((pos, index) => (
          <motion.div
            key={pos}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            <Link
              to={`/players?position=${pos}`}
              className="premium-card group relative block overflow-hidden"
            >
              {/* Image Frame: Grayscale and Minimal */}
              <div className="relative aspect-[3/4] overflow-hidden bg-heritage-base">
                <img
                  src={`/positions/${pos}.png`}
                  alt={pos}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 filter grayscale contrast-[1.05] group-hover:grayscale-0"
                  onError={(e) => { e.target.onerror = null; e.target.src = "/logo.png"; }}
                />

                {/* Soft Editorial Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-heritage-text via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700"></div>
                
                {/* Role Code Tag */}
                <div className="absolute top-0 right-0 p-8">
                  <span className="text-4xl font-serif italic text-white opacity-20 group-hover:text-heritage-accent group-hover:opacity-100 transition-all duration-700">{pos}</span>
                </div>

                {/* Label (Bottom) */}
                <div className="absolute bottom-8 left-8 text-white z-10 space-y-2">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-heritage-accent/20 backdrop-blur-md border border-heritage-accent/20 text-heritage-accent">
                        {posDetails[pos]?.icon}
                      </div>
                      <h3 className="text-3xl font-serif italic tracking-tight">{posDetails[pos]?.title || pos}</h3>
                   </div>
                </div>
              </div>

              {/* Technical Description */}
              <div className="p-8 space-y-8">
                <p className="text-heritage-muted text-[13px] leading-relaxed h-12 overflow-hidden font-sans">
                  {posDetails[pos]?.desc}
                </p>

                <div className="pt-6 border-t border-heritage-border flex items-center justify-between text-heritage-accent">
                  <span className="text-[10px] font-black uppercase tracking-[3px]">Analytical Dataset</span>
                  <MousePointer2 size={14} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
