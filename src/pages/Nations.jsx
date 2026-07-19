import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Compass, ArrowRight, Search } from "lucide-react";

export default function Nations() {
  const [nations, setNations] = useState([]);
  const [filteredNations, setFilteredNations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://premier-backend.onrender.com/nations")
      .then((res) => {
        const sortedNations = res.data.sort((a, b) => {
          const codeA = a.split(" ")[1] || "";
          const codeB = b.split(" ")[1] || "";
          return codeA.localeCompare(codeB);
        });
        setNations(sortedNations);
        setFilteredNations(sortedNations);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredNations(nations);
    } else {
      setFilteredNations(
        nations.filter((nationStr) => {
          const parts = nationStr.split(" ");
          const name = (parts[0] || "").replace(/-/g, " ").toLowerCase();
          const code = (parts[1] || "").toLowerCase();
          return name.includes(query) || code.includes(query);
        })
      );
    }
  }, [searchQuery, nations]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f5f8]">
        <Globe size={40} className="text-purple-950 animate-spin" />
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
      <header className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 pb-8 md:pb-12 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100">
            <Globe size={12} className="text-purple-700" />
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-950">Global Representation</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-none tracking-tighter text-slate-900">
            International <span className="text-accent-gradient">Origins.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-md font-semibold leading-relaxed">
            Discover the global distribution of talent represented in the 24/25 campaign.
          </p>
        </div>

        <div className="flex flex-col gap-3 items-start md:items-end w-full md:w-auto">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl group focus-within:border-purple-600 focus-within:shadow-md focus-within:shadow-purple-950/5 transition-all w-full md:w-80">
            <Search size={16} className="text-slate-400 group-focus-within:text-purple-600 transition-colors" />
            <input
              type="text"
              placeholder="Search country or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-sm font-bold focus:outline-none flex-1 text-slate-800 placeholder-slate-400"
            />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
            Nations Index: {filteredNations.length} represented
          </span>
        </div>
      </header>

      {/* Nations Grid */}
      {filteredNations.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl relative z-10">
          <Globe size={48} className="text-slate-200 mx-auto mb-4" />
          <h3 className="text-md font-black text-slate-800">No nations found</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">Try typing a different name or code.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 relative z-10">
          {filteredNations.map((nationStr, index) => {
            const parts = nationStr.split(" ");
            const rawName = parts[0] || "";
            const countryName = rawName.replace(/-/g, " ");
            const nationCode = parts[1] || "";

            return (
              <motion.div
                key={nationCode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.015, 0.2), duration: 0.4 }}
              >
                <Link
                  to={`/players?nation=${nationCode}`}
                  className="group block space-y-2"
                >
                  {/* Flag Container Card */}
                  <div className="relative aspect-[3/2] bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-center transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)] group-hover:border-purple-200 group-hover:shadow-md group-hover:shadow-purple-950/5 overflow-hidden">
                    {/* Grid-lines effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none transition-opacity duration-300"></div>

                    <img
                      src={`/flags/${nationCode}.png`}
                      alt={countryName}
                      className="w-[55%] md:w-[65%] h-auto object-contain relative z-10 transition-transform duration-350 group-hover:scale-105"
                      onError={(e) => { e.target.onerror = null; e.target.src = "/logo.png"; }}
                    />
                  </div>

                  {/* Flag Metadata */}
                  <div className="flex flex-col px-1.5 transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 group-hover:text-purple-900 truncate">
                      {countryName}
                    </span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-500 uppercase tracking-widest">
                        {nationCode}
                      </span>
                      <ArrowRight size={10} className="text-purple-700 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
