import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Activity, Goal, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import client from "../api/client";

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const posDetails = {
    GK: {
      title: "Guardians",
      icon: <ShieldCheck size={24} />,
      desc: "The final layer of tactical defense. Clean sheets, save percentages, and box command metrics.",
      accent: "from-amber-500 to-yellow-600",
      pillBg: "bg-amber-50 text-amber-900 border-amber-200",
      bgGradient: "from-amber-950 via-amber-900 to-slate-950",
      role: "Goalkeepers",
    },
    DF: {
      title: "Architects",
      icon: <Activity size={24} />,
      desc: "Tactical masterminds. Analyzing tackles, interceptions, recovery runs, and high-line depth.",
      accent: "from-blue-500 to-indigo-600",
      pillBg: "bg-blue-50 text-blue-900 border-blue-200",
      bgGradient: "from-blue-950 via-slate-900 to-slate-950",
      role: "Defenders",
    },
    MF: {
      title: "Engines",
      icon: <Zap size={24} />,
      desc: "The transition management core. Playmaking efficiency, key passes, and defensive transition cover.",
      accent: "from-emerald-500 to-teal-600",
      pillBg: "bg-emerald-50 text-emerald-900 border-emerald-200",
      bgGradient: "from-emerald-950 via-slate-900 to-slate-950",
      role: "Midfielders",
    },
    FW: {
      title: "Finishers",
      icon: <Goal size={24} />,
      desc: "The clinical edge. Goal conversion rates, expected goals (xG), and final third efficiency.",
      accent: "from-rose-500 to-pink-600",
      pillBg: "bg-rose-50 text-rose-900 border-rose-200",
      bgGradient: "from-rose-950 via-purple-950 to-slate-950",
      role: "Forwards",
    },
  };

  useEffect(() => {
    client
      .get("/positions")
      .then((res) => {
        setPositions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Positions load error:", err);
        setPositions(["GK", "DF", "MF", "FW"]);
        setLoading(false);
      });
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
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 w-full relative">

      {/* Header Panel */}
      <header className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 pb-8 md:pb-12 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100">
            <Sparkles size={14} className="text-purple-700" />
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-950">Tactical Frameworks</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-none tracking-tighter text-slate-900">
            Squad <span className="text-accent-gradient">Roles.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-md font-semibold leading-relaxed">
            Filter the league by tactical designations and deep role specializations.
          </p>
        </div>

        <Link
          to="/squad-builder"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-950 text-white text-xs font-black uppercase tracking-wider shadow-md hover:bg-purple-900 transition-colors"
        >
          Open Squad Builder →
        </Link>
      </header>

      {/* Position Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {positions.map((pos, index) => {
          const detail = posDetails[pos] || {
            title: pos,
            icon: <Activity size={24} />,
            desc: "Tactical performance role across Premier League fixtures.",
            accent: "from-purple-500 to-indigo-600",
            pillBg: "bg-purple-50 text-purple-900 border-purple-200",
            bgGradient: "from-purple-950 to-slate-950",
            role: pos,
          };

          return (
            <motion.div
              key={pos}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <Link
                to={`/players?position=${pos}`}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full"
              >
                <div>
                  {/* Tactical Graphic Hero */}
                  <div className={`w-full aspect-[4/3] rounded-2xl bg-gradient-to-br ${detail.bgGradient} p-6 flex flex-col justify-between text-white relative overflow-hidden shadow-lg group-hover:scale-[1.02] transition-transform duration-300`}>
                    {/* Pitch lines background graphic */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                    <div className="absolute -bottom-8 -right-8 text-8xl font-black opacity-10 select-none">
                      {pos}
                    </div>

                    <div className="flex justify-between items-start relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                        {detail.role}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                        {detail.icon}
                      </div>
                    </div>

                    <div className="relative z-10">
                      <span className="text-3xl font-black tracking-tight block">{pos}</span>
                      <span className="text-xs font-bold text-white/80">{detail.title}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                      {detail.desc}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 group-hover:text-purple-700">
                    Explore Roster
                  </span>
                  <div className="w-8 h-8 rounded-full bg-purple-50 group-hover:bg-purple-950 text-purple-950 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
