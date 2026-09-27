import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, ArrowRight, Search, Sparkles } from "lucide-react";
import client from "../api/client";

// ISO 3166-1 alpha-2 mapping for common Premier League nationality codes
const NATION_TO_ALPHA2 = {
  ENG: "gb-eng",
  SCO: "gb-sct",
  WAL: "gb-wls",
  NIR: "gb-nir",
  FRA: "fr",
  ESP: "es",
  BRA: "br",
  ARG: "ar",
  GER: "de",
  NED: "nl",
  POR: "pt",
  BEL: "be",
  ITA: "it",
  NOR: "no",
  SWE: "se",
  DEN: "dk",
  JPN: "jp",
  KOR: "kr",
  USA: "us",
  MEX: "mx",
  COL: "co",
  URU: "uy",
  NGA: "ng",
  SEN: "sn",
  GHA: "gh",
  CIV: "ci",
  EGY: "eg",
  MAR: "ma",
  CMR: "cm",
  ALG: "dz",
  JAM: "jm",
  IRL: "ie",
  CRO: "hr",
  SRB: "rs",
  SUI: "ch",
  AUT: "at",
  POL: "pl",
  CZE: "cz",
  UKR: "ua",
  TUR: "tr",
  GRE: "gr",
};

export default function Nations() {
  const [nations, setNations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get("/nations")
      .then((res) => {
        const sorted = (res.data || []).sort((a, b) => a.localeCompare(b));
        setNations(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load nations:", err);
        setLoading(false);
      });
  }, []);

  const query = searchQuery.toLowerCase().trim();
  const filteredNations = query
    ? nations.filter((n) => n.toLowerCase().includes(query))
    : nations;

  const getFlagUrl = (nationStr) => {
    // If format is like "England ENG" or just "England"
    const parts = nationStr.split(" ");
    const code = (parts[1] || parts[0]).toUpperCase();
    const alpha2 = NATION_TO_ALPHA2[code] || (code.length === 2 ? code.toLowerCase() : null);
    if (alpha2) {
      return `https://flagcdn.com/w160/${alpha2}.png`;
    }
    return null;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f5f8]">
        <div className="flex flex-col items-center gap-3">
          <Globe size={40} className="text-purple-950 animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Mapping Global Origins...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto relative">
      {/* Background Blobs */}
      <div className="blob w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-200/20 top-[-10%] right-[-5%]"></div>
      <div className="blob w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-pink-100/20 bottom-[-5%] left-[-5%]"></div>

      {/* Header Panel */}
      <header className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 pb-8 md:pb-12 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100">
            <Globe size={12} className="text-purple-700" />
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-950">
              International Origins
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-none tracking-tighter text-slate-900">
            Global <span className="text-accent-gradient">Talent.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-md font-semibold leading-relaxed">
            Discover the international distribution of players across the Premier League.
          </p>
        </div>

        <div className="flex flex-col gap-3 items-start md:items-end w-full md:w-auto">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl group focus-within:border-purple-600 shadow-sm transition-all w-full md:w-80">
            <Search size={16} className="text-slate-400 group-focus-within:text-purple-600 transition-colors" />
            <input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs font-bold focus:outline-none flex-1 text-slate-800 placeholder-slate-400"
            />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
            {filteredNations.length} Nations Represented
          </span>
        </div>
      </header>

      {/* Nations Grid */}
      {filteredNations.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl relative z-10">
          <Globe size={48} className="text-slate-200 mx-auto mb-4" />
          <h3 className="text-md font-black text-slate-800">No nations found</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">Try typing a different country name.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5 relative z-10">
          {filteredNations.map((nationStr, index) => {
            const flagUrl = getFlagUrl(nationStr);
            const displayName = nationStr.replace(/-/g, " ");

            return (
              <motion.div
                key={nationStr}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.015, 0.2), duration: 0.4 }}
              >
                <Link
                  to={`/players?nation=${encodeURIComponent(nationStr)}`}
                  className="group block bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-purple-200 hover:shadow-md transition-all duration-300"
                >
                  {/* Flag Container */}
                  <div className="aspect-[3/2] rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center overflow-hidden mb-3 group-hover:scale-105 transition-transform duration-300">
                    {flagUrl ? (
                      <img
                        src={flagUrl}
                        alt={displayName}
                        className="max-w-full max-h-full object-contain rounded drop-shadow-xs"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-900 font-black text-xs flex items-center justify-center">
                        {displayName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 group-hover:text-purple-900 truncate">
                      {displayName}
                    </span>
                    <ArrowRight size={12} className="text-purple-600 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
