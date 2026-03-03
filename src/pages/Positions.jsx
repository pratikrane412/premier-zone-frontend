import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Activity, Goal, MousePointer2 } from "lucide-react";

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map tactical roles to professional titles and icons
  const posDetails = {
    GK: {
      title: "Goalkeepers",
      icon: <ShieldCheck size={24} />,
      desc: "The last line of defense. Analyze clean sheets and save percentages.",
    },
    DF: {
      title: "Defenders",
      icon: <Activity size={24} />,
      desc: "Tactical masterminds. Track tackles, interceptions, and defensive depth.",
    },
    MF: {
      title: "Midfielders",
      icon: <Zap size={24} />,
      desc: "The engine room. Explore playmaking efficiency and transition stats.",
    },
    FW: {
      title: "Forwards",
      icon: <Goal size={24} />,
      desc: "The finishers. Deep dive into goals, xG, and clinical strike rates.",
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-brand-accent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/30 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="max-w-4xl mx-auto text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary text-white"
          >
            <span className="text-[10px] font-black uppercase tracking-[3px]">
              Tactical Breakdown
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900"
          >
            Field <span className="text-gradient italic">Roles.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Analyze performance metrics specifically filtered by the tactical
            responsibilities of each position.
          </motion.p>
        </header>

        {/* Staggered 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {positions.map((pos, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Link
                to={`/players?position=${pos}`}
                className="group relative block bg-white border border-slate-100 rounded-[3rem] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_rgba(61,25,91,0.15)] hover:-translate-y-3 hover:border-brand-primary/10"
              >
                {/* Image Area with Modern Overlay */}
                <div className="relative w-full h-80 overflow-hidden bg-slate-100">
                  <img
                    src={`/positions/${pos}.png`}
                    alt={pos}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/logo.png";
                    }}
                  />

                  {/* Gradient Dark Overlay for text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>

                  {/* Position Code Floating Tag */}
                  <div className="absolute top-8 left-8 flex flex-col items-center justify-center w-14 h-14 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white">
                    <span className="text-xs font-black text-brand-primary tracking-tighter">
                      {pos}
                    </span>
                  </div>

                  {/* Tactical Label (Bottom of image) */}
                  <div className="absolute bottom-8 left-8 text-white z-10">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="p-2 bg-brand-secondary/20 rounded-lg text-brand-secondary backdrop-blur-md">
                        {posDetails[pos]?.icon}
                      </span>
                      <h3 className="text-2xl font-black tracking-tight leading-none uppercase italic">
                        {posDetails[pos]?.title || pos}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Content Section (Bottom) */}
                <div className="p-10 space-y-6">
                  <p className="text-slate-500 text-sm font-medium leading-relaxed h-12 overflow-hidden">
                    {posDetails[pos]?.desc ||
                      "Explore the statistics and metrics for this field role."}
                  </p>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-brand-primary">
                    <span className="text-[10px] font-black uppercase tracking-[2px]">
                      View Statistics
                    </span>
                    <MousePointer2
                      size={16}
                      className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Animated background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
