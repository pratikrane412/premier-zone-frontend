import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Users, TrendingUp } from "lucide-react";

export default function Nations() {
  const [nations, setNations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Faster stagger for large lists
  const containerVars = {
    animate: { transition: { staggerChildren: 0.03 } },
  };

  const cardVars = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-brand-accent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black tracking-[3px] text-slate-400 uppercase">
            Worldwide Data
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/30 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header Section */}
        <header className="max-w-4xl mx-auto text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-slate-100 shadow-sm"
          >
            <Globe size={16} className="text-brand-accent" />
            <span className="text-[10px] font-black uppercase tracking-[2px] text-slate-500">
              International Contributions
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900"
          >
            Global <span className="text-gradient">Talent</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Discover the diverse national identities representing{" "}
            {nations.length} countries across the world's most elite football
            league.
          </motion.p>
        </header>

        {/* Nations Grid */}
        <motion.div
          variants={containerVars}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
        >
          {nations.map((nationStr, index) => {
            const nationCode = nationStr.split(" ")[1];
            return (
              <motion.div variants={cardVars} key={index}>
                <Link
                  to={`/players?nation=${nationCode}`}
                  className="group relative bg-white border border-slate-100 p-6 rounded-[2rem] flex flex-col items-center gap-5 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-brand-accent/20 hover:-translate-y-2"
                >
                  {/* The Flag Frame */}
                  <div className="relative w-full aspect-[3/2] flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden border border-slate-50 group-hover:border-slate-200 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                    <img
                      src={`/flags/${nationCode}.png`}
                      alt={nationCode}
                      className="w-[80%] h-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/logo.png";
                      }}
                    />
                  </div>

                  {/* Nation Metadata */}
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase group-hover:text-brand-accent transition-colors">
                      {nationCode}
                    </h3>
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <TrendingUp size={10} className="text-brand-secondary" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        View Squad
                      </span>
                    </div>
                  </div>

                  {/* Subtle Background Glow */}
                  <div className="absolute -z-10 w-1/2 h-1/2 bg-brand-accent/5 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
