import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Target,
  User,
  Trophy,
  Zap,
  BarChart3,
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-3"
        >
          <BarChart3 size={40} className="text-brand-primary" />
          <span className="text-[10px] font-black tracking-[4px] uppercase text-slate-400">
            Processing Stats
          </span>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation & Header */}
        <header className="mb-12 space-y-6">
          <Link
            to="/teams"
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-brand-primary transition-colors font-bold text-xs uppercase tracking-widest"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Directory
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none">
                {teamFilter
                  ? teamFilter.replace(/-/g, " ")
                  : posFilter
                    ? `${posFilter}s`
                    : nationFilter
                      ? `${nationFilter} Talent`
                      : "Premier League"}
                <span className="text-brand-primary block md:inline md:ml-4 italic">
                  Squad.
                </span>
              </h1>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <Target size={14} className="text-brand-secondary" />
                Performance metrics for the 2024/25 Season
              </p>
            </motion.div>

            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm self-start">
              <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                Results: {players.length}
              </div>
              <div className="px-4 py-2 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20">
                Page {page}
              </div>
            </div>
          </div>
        </header>

        {/* Professional Stats Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[2px] text-slate-400">
                    Player Profile
                  </th>
                  {!teamFilter && (
                    <th className="py-6 px-6 text-[10px] font-black uppercase tracking-[2px] text-slate-400 text-center">
                      Club
                    </th>
                  )}
                  <th className="py-6 px-6 text-[10px] font-black uppercase tracking-[2px] text-slate-400 text-center">
                    Nation
                  </th>
                  <th className="py-6 px-6 text-[10px] font-black uppercase tracking-[2px] text-slate-400 text-center">
                    Pos
                  </th>
                  <th className="py-6 px-6 text-[10px] font-black uppercase tracking-[2px] text-slate-400 text-center">
                    App
                  </th>
                  <th className="py-6 px-6 text-[10px] font-black uppercase tracking-[2px] text-brand-primary text-center bg-brand-primary/5">
                    Goals
                  </th>
                  <th className="py-6 px-6 text-[10px] font-black uppercase tracking-[2px] text-brand-primary text-center bg-brand-primary/5">
                    Assists
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {players.map((p, index) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.02 }}
                      key={p.player_name + index}
                      className="hover:bg-slate-50/80 transition-all group"
                    >
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                            <User size={18} />
                          </div>
                          <p className="font-extrabold text-slate-900 group-hover:text-brand-primary transition-colors">
                            {p.player_name}
                          </p>
                        </div>
                      </td>
                      {!teamFilter && (
                        <td className="py-5 px-6 text-center">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                            {p.team_name.replace(/-/g, " ")}
                          </span>
                        </td>
                      )}
                      <td className="py-5 px-6 text-center">
                        <span className="inline-block font-mono text-[11px] font-black text-slate-400 bg-white border border-slate-100 px-3 py-1 rounded-lg">
                          {p.nation?.split(" ")[1]}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className="text-[9px] font-black bg-slate-900 text-white px-2.5 py-1 rounded-md uppercase tracking-widest">
                          {p.position}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center font-bold text-slate-400">
                        {p.matches_played ?? 0}
                      </td>
                      <td className="py-5 px-6 text-center font-black text-brand-primary text-xl bg-brand-primary/[0.02]">
                        {p.goals ?? 0}
                      </td>
                      <td className="py-5 px-6 text-center font-black text-brand-primary text-xl bg-brand-primary/[0.02]">
                        {p.assists ?? 0}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Modern Pagination Controls */}
        {!teamFilter && (
          <div className="mt-16 flex justify-center items-center gap-8">
            <button
              disabled={page === 1}
              onClick={() => {
                setPage((prev) => prev - 1);
                window.scrollTo(0, 0);
              }}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-slate-200 text-slate-900 hover:border-brand-primary hover:text-brand-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200/50 active:scale-90"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[3px] mb-2">
                Current
              </span>
              <div className="w-14 h-14 flex items-center justify-center bg-brand-primary text-white rounded-2xl font-black text-xl shadow-2xl shadow-brand-primary/30">
                {page}
              </div>
            </div>

            <button
              disabled={players.length < limit}
              onClick={() => {
                setPage((prev) => prev + 1);
                window.scrollTo(0, 0);
              }}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-slate-200 text-slate-900 hover:border-brand-primary hover:text-brand-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200/50 active:scale-90"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
