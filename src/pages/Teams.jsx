import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, Trophy, Shield } from "lucide-react";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://premier-backend.onrender.com/teams")
      .then((res) => {
        setTeams(res.data);
        setFilteredTeams(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching teams:", err));
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredTeams(teams);
    } else {
      setFilteredTeams(
        teams.filter((team) =>
          team.replace(/-/g, " ").toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, teams]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f5f8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-[4px] border-purple-100 border-t-purple-950 rounded-full animate-spin"></div>
          <p className="text-xs font-black text-purple-950 uppercase tracking-[4px] animate-pulse">Accessing Roster...</p>
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
      {/* Soft light background blobs */}
      <div className="blob w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-200/20 top-[-5%] left-[-5%]"></div>
      <div className="blob w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-pink-100/20 bottom-[-5%] right-[-5%]"></div>

      {/* Header Panel */}
      <header className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 pb-8 md:pb-12 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100">
            <Trophy size={12} className="text-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-950">24/25 Competitors</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-none tracking-tighter text-slate-900">
            The <span className="text-accent-gradient">Clubs.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl font-semibold leading-relaxed">
            Discover the organizations competing at the absolute pinnacle of English football.
          </p>
        </div>

        <div className="flex flex-col gap-3 items-start md:items-end w-full md:w-auto">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl group focus-within:border-purple-600 focus-within:shadow-md focus-within:shadow-purple-950/5 transition-all w-full md:w-80">
            <Search size={16} className="text-slate-400 group-focus-within:text-purple-600 transition-colors" />
            <input
              type="text"
              placeholder="Search club name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-sm font-bold focus:outline-none flex-1 text-slate-800 placeholder-slate-400"
            />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
            Active Members: {filteredTeams.length} of {teams.length}
          </span>
        </div>
      </header>

      {/* Clubs Grid */}
      {filteredTeams.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl relative z-10">
          <Shield size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-black text-slate-800">No clubs found</h3>
          <p className="text-sm text-slate-400 font-semibold mt-1">Try adjusting your search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {filteredTeams.map((team, index) => {
            const formattedName = team.replace(/-/g, " ");
            return (
              <motion.div
                key={team}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.5 }}
              >
                <Link
                  to={`/players?team=${team}`}
                  className="group block"
                >
                  <div className="glass-card p-6 aspect-square flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Corner index number */}
                    <div className="absolute top-4 right-5 text-4xl font-black text-slate-100 group-hover:text-purple-100 transition-colors pointer-events-none">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    
                    {/* Club Crest image */}
                    <div className="w-28 h-28 md:w-32 md:h-32 flex items-center justify-center relative z-10 mb-4 bg-slate-50/50 p-3 rounded-full border border-slate-100/50 group-hover:bg-white group-hover:border-purple-100 transition-all duration-300">
                      <img
                        src={`/teams/${team}.png`}
                        alt={formattedName}
                        className="w-20 h-20 md:w-24 md:h-24 object-contain transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                      />
                    </div>

                    <div className="text-center relative z-10 w-full px-2">
                      <h3 className="text-xs font-black uppercase tracking-[2px] text-slate-800 group-hover:text-purple-900 transition-colors truncate">
                        {formattedName}
                      </h3>
                      
                      <div className="flex items-center justify-center gap-1.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1.5 group-hover:translate-y-0">
                        <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Squad Roster
                        </span>
                        <ArrowRight size={10} className="text-purple-700" />
                      </div>
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
