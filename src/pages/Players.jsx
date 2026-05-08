import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  User,
  ArrowRight,
  Filter
} from "lucide-react";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 50;

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const teamFilter = query.get("team");
  const posFilter = query.get("position");
  const nationFilter = query.get("nation");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const offset = (page - 1) * limit;
        let url = `https://premier-backend.onrender.com/players?limit=${limit}&offset=${offset}`;

        if (teamFilter)
          url = `https://premier-backend.onrender.com/teams/search?team_name=${teamFilter}`;
        else if (posFilter)
          url = `https://premier-backend.onrender.com/players/position/${posFilter}?limit=${limit}&offset=${offset}`;
        else if (nationFilter)
          url = `https://premier-backend.onrender.com/nations/search?nation=${nationFilter}&limit=${limit}&offset=${offset}`;

        const res = await axios.get(url);
        setPlayers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, [teamFilter, posFilter, nationFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [teamFilter, posFilter, nationFilter]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-glass-base">
        <div className="w-20 h-2 bg-white/10 rounded-full relative overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-glass-accent shadow-[0_0_15px_#8b5cf6]"
          />
        </div>
      </div>
    );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 md:pt-28 lg:pt-32 pb-20 px-4 md:px-6 lg:px-8 max-w-[1400px] mx-auto relative"
    >
      {/* Background Blobs */}
      <div className="blob w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-glass-accent/10 top-[-10%] right-[-5%]"></div>
      <div className="blob w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-glass-highlight/10 bottom-[-5%] left-[-10%]"></div>

      {/* Modern Header */}
      <header className="mb-10 md:mb-16 space-y-6 md:space-y-10 relative z-10">
        <Link
          to="/teams"
          className="group inline-flex items-center gap-2 text-glass-muted hover:text-white transition-colors font-bold text-[9px] md:text-xs uppercase tracking-[2px] md:tracking-[3px] bg-white/5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-white/5 hover:border-white/10"
        >
          <ChevronLeft size={14} className="md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Clubs
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12 border-b border-white/10 pb-8 md:pb-12">
          <div className="space-y-3 md:space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-glass-accent">Professional Squad List</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter">
              {teamFilter
                ? teamFilter.replace(/-/g, " ")
                : posFilter
                  ? `${posFilter}s`
                  : nationFilter
                    ? `${nationFilter}`
                    : "League"}
              <span className="text-accent-gradient block sm:inline sm:ml-4">
                Squad.
              </span>
            </h1>
            <p className="text-sm md:text-lg text-glass-muted max-w-xl leading-relaxed font-medium">
              Real-time analytics and tactical deep-dives for the 24/25 campaign.
            </p>
          </div>

          <div className="flex items-center gap-4 md:gap-6 bg-glass-surface backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-glass-border shadow-2xl self-start">
            <div className="text-center px-4 md:px-6 border-r border-glass-border">
              <p className="text-[8px] md:text-[10px] font-bold text-glass-muted uppercase tracking-widest mb-1">Index</p>
              <p className="text-xl md:text-3xl font-black">{page}</p>
            </div>
            <div className="text-center px-4 md:px-6">
              <p className="text-[8px] md:text-[10px] font-bold text-glass-highlight uppercase tracking-widest mb-1">Total</p>
              <p className="text-xl md:text-3xl font-black">{players.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Glass Table Container */}
      <div className="glass-card overflow-hidden relative z-10 !rounded-2xl md:!rounded-[2rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-glass-surface border-b border-glass-border">
                <th className="py-4 md:py-8 px-4 md:px-10 text-[9px] md:text-xs font-bold uppercase tracking-widest text-glass-muted">Athlete</th>
                {!teamFilter && <th className="hidden sm:table-cell py-4 md:py-8 px-4 md:px-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-glass-muted text-center">Organisation</th>}
                <th className="hidden md:table-cell py-4 md:py-8 px-4 md:px-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-glass-muted text-center">Origin</th>
                <th className="py-4 md:py-8 px-4 md:px-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-glass-muted text-center">Position</th>
                <th className="hidden sm:table-cell py-4 md:py-8 px-4 md:px-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-glass-muted text-center">App</th>
                <th className="py-4 md:py-8 px-4 md:px-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-glass-accent text-center bg-glass-accent/5">Gls</th>
                <th className="py-4 md:py-8 px-4 md:px-6 text-[9px] md:text-xs font-bold uppercase tracking-widest text-glass-accent text-center bg-glass-accent/5">Ast</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              <AnimatePresence mode="popLayout">
                {players.map((p, index) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.01 }}
                    key={p.player_name + index}
                    className="hover:bg-glass-surface transition-all group"
                  >
                    <td className="py-4 md:py-6 px-4 md:px-10">
                      <div className="flex items-center gap-3 md:gap-6">
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-glass-surface flex items-center justify-center text-glass-muted group-hover:bg-glass-accent group-hover:text-white transition-all duration-500 border border-glass-border group-hover:border-glass-accent/50 shadow-lg">
                          <User size={16} className="md:w-6 md:h-6" />
                        </div>
                        <div>
                          <p className="text-sm md:text-lg font-bold group-hover:text-glass-accent transition-colors truncate max-w-[120px] md:max-w-none">{p.player_name}</p>
                          <p className="text-[8px] md:text-[10px] font-bold text-glass-muted uppercase tracking-wider">Premier Athlete</p>
                        </div>
                      </div>
                    </td>
                    {!teamFilter && (
                      <td className="hidden sm:table-cell py-4 md:py-6 px-4 md:px-6 text-center">
                        <span className="text-[10px] md:text-xs font-bold">
                          {p.team_name.replace(/-/g, " ")}
                        </span>
                      </td>
                    )}
                    <td className="hidden md:table-cell py-4 md:py-6 px-4 md:px-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[11px] font-bold bg-glass-surface border border-glass-border text-glass-muted group-hover:border-glass-highlight/50 group-hover:text-glass-highlight transition-all">
                        {p.nation?.split(" ")[1]}
                      </span>
                    </td>
                    <td className="py-4 md:py-6 px-4 md:px-6 text-center">
                      <span className="text-[8px] md:text-[10px] font-black bg-glass-text text-glass-base px-2 py-1 md:px-4 md:py-1.5 rounded-lg md:rounded-xl uppercase tracking-widest border border-glass-border">
                        {p.position}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell py-4 md:py-6 px-4 md:px-6 text-center font-bold text-glass-muted text-xs md:text-base">
                      {p.matches_played ?? 0}
                    </td>
                    <td className="py-4 md:py-6 px-4 md:px-6 text-center font-black text-glass-accent text-lg md:text-2xl bg-glass-accent/[0.03]">
                      {p.goals ?? 0}
                    </td>
                    <td className="py-4 md:py-6 px-4 md:px-6 text-center font-black text-glass-accent text-lg md:text-2xl bg-glass-accent/[0.03]">
                      {p.assists ?? 0}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Pagination */}
      {!teamFilter && (
        <div className="mt-12 md:mt-20 flex justify-center items-center gap-6 md:gap-10 relative z-10">
          <button
            disabled={page === 1}
            onClick={() => { setPage(prev => prev - 1); window.scrollTo(0, 0); }}
            className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] bg-glass-surface border border-glass-border flex items-center justify-center hover:bg-glass-accent hover:text-white hover:border-glass-accent disabled:opacity-10 transition-all duration-300 shadow-xl"
          >
            <ChevronLeft size={20} className="md:w-7 md:h-7" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[8px] md:text-[10px] font-bold text-glass-accent uppercase tracking-widest mb-1 md:mb-2">Sequence</span>
            <div className="text-2xl md:text-4xl font-black">
              {page}
            </div>
          </div>

          <button
            disabled={players.length < limit}
            onClick={() => { setPage(prev => prev + 1); window.scrollTo(0, 0); }}
            className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] bg-glass-surface border border-glass-border flex items-center justify-center hover:bg-glass-accent hover:text-white hover:border-glass-accent disabled:opacity-10 transition-all duration-300 shadow-xl"
          >
            <ChevronRight size={20} className="md:w-7 md:h-7" />
          </button>
        </div>
      )}
    </motion.div>

  );
}
