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
      <div className="min-h-screen flex items-center justify-center bg-heritage-base">
        <div className="w-12 h-px bg-heritage-border relative overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-heritage-accent"
          />
        </div>
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
      <header className="mb-20 space-y-12">
        <Link
          to="/teams"
          className="group inline-flex items-center gap-3 text-heritage-text/40 hover:text-heritage-accent transition-colors font-black text-[10px] uppercase tracking-[4px]"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-heritage-border pb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[5px] text-heritage-accent">Technical Roster</span>
              <div className="h-px w-8 bg-heritage-accent"></div>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif italic text-heritage-text leading-none">
              {teamFilter
                ? teamFilter.replace(/-/g, " ")
                : posFilter
                  ? `${posFilter}s`
                  : nationFilter
                    ? `${nationFilter}`
                    : "League"}
              <span className="not-italic text-heritage-accent block md:inline md:ml-6 tracking-tighter">
                Squad.
              </span>
            </h1>
            <p className="text-lg text-heritage-muted max-w-xl leading-relaxed">
              Detailed performance metrics and tactical profiles for the 2024/25 campaign.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 border border-heritage-border shadow-sm self-start">
            <div className="flex flex-col gap-1 pr-6 border-r border-heritage-border">
              <span className="text-[9px] font-black text-heritage-text/40 uppercase tracking-widest text-center">Page</span>
              <span className="text-xl font-serif italic text-heritage-text text-center">{page}</span>
            </div>
            <div className="pl-2">
              <span className="text-[10px] font-black text-heritage-accent uppercase tracking-[2px]">Entries: {players.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Editorial Table */}
      <div className="bg-white border border-heritage-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-heritage-base border-b border-heritage-border">
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[4px] text-heritage-text/60">Professional Profile</th>
                {!teamFilter && <th className="py-8 px-6 text-[10px] font-black uppercase tracking-[4px] text-heritage-text/60 text-center">Organisation</th>}
                <th className="py-8 px-6 text-[10px] font-black uppercase tracking-[4px] text-heritage-text/60 text-center">Origin</th>
                <th className="py-8 px-6 text-[10px] font-black uppercase tracking-[4px] text-heritage-text/60 text-center">Pos</th>
                <th className="py-8 px-6 text-[10px] font-black uppercase tracking-[4px] text-heritage-text/60 text-center">App</th>
                <th className="py-8 px-6 text-[10px] font-black uppercase tracking-[4px] text-heritage-accent text-center bg-heritage-accent/5">Gls</th>
                <th className="py-8 px-6 text-[10px] font-black uppercase tracking-[4px] text-heritage-accent text-center bg-heritage-accent/5">Ast</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-heritage-border">
              <AnimatePresence mode="popLayout">
                {players.map((p, index) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.01 }}
                    key={p.player_name + index}
                    className="hover:bg-heritage-base/50 transition-all group"
                  >
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-6">
                        <div className="w-10 h-10 border border-heritage-border flex items-center justify-center text-heritage-text/20 group-hover:text-heritage-accent group-hover:border-heritage-accent transition-all duration-500">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-serif italic text-xl text-heritage-text group-hover:text-heritage-accent transition-colors">{p.player_name}</p>
                          <p className="text-[9px] font-black text-heritage-text/40 uppercase tracking-[2px]">Premier League Pro</p>
                        </div>
                      </div>
                    </td>
                    {!teamFilter && (
                      <td className="py-6 px-6 text-center">
                        <span className="text-[10px] font-black text-heritage-muted uppercase tracking-tighter">
                          {p.team_name.replace(/-/g, " ")}
                        </span>
                      </td>
                    )}
                    <td className="py-6 px-6 text-center">
                      <span className="inline-block font-sans text-[11px] font-medium text-heritage-text/60 px-3 py-1 border border-heritage-border group-hover:border-heritage-accent/40 transition-colors">
                        {p.nation?.split(" ")[1]}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <span className="text-[10px] font-black bg-heritage-text text-white px-2.5 py-1 uppercase tracking-widest">
                        {p.position}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-center font-serif italic text-heritage-text/60">
                      {p.matches_played ?? 0}
                    </td>
                    <td className="py-6 px-6 text-center font-serif italic text-heritage-accent text-2xl bg-heritage-accent/[0.02]">
                      {p.goals ?? 0}
                    </td>
                    <td className="py-6 px-6 text-center font-serif italic text-heritage-accent text-2xl bg-heritage-accent/[0.02]">
                      {p.assists ?? 0}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Editorial Pagination */}
      {!teamFilter && (
        <div className="mt-20 flex justify-center items-center gap-12">
          <button
            disabled={page === 1}
            onClick={() => { setPage(prev => prev - 1); window.scrollTo(0, 0); }}
            className="w-16 h-16 border border-heritage-border flex items-center justify-center text-heritage-text hover:border-heritage-accent hover:text-heritage-accent disabled:opacity-20 transition-all duration-500"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-heritage-accent uppercase tracking-[4px] mb-2">Issue Tier</span>
            <div className="text-3xl font-serif italic text-heritage-text">
              {page}
            </div>
          </div>

          <button
            disabled={players.length < limit}
            onClick={() => { setPage(prev => prev + 1); window.scrollTo(0, 0); }}
            className="w-16 h-16 border border-heritage-border flex items-center justify-center text-heritage-text hover:border-heritage-accent hover:text-heritage-accent disabled:opacity-20 transition-all duration-500"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </motion.div>
  );
}
