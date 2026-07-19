import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  User,
  ArrowRight,
  Search,
  SlidersHorizontal,
  TrendingUp,
  UserCheck
} from "lucide-react";
import logo from "../assets/logo1.png";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
        setFilteredPlayers(res.data);
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

  // Client-side local filtering for player name
  useEffect(() => {
    const queryStr = searchTerm.toLowerCase().trim();
    if (!queryStr) {
      setFilteredPlayers(players);
    } else {
      setFilteredPlayers(
        players.filter((p) => p.player_name.toLowerCase().includes(queryStr))
      );
    }
  }, [searchTerm, players]);

  // Position color mapping for a premium football scouting vibe
  const getPositionStyles = (pos) => {
    const position = pos?.toUpperCase();
    if (position === "GK") return "bg-amber-100 text-amber-900 border border-amber-200";
    if (position === "DF") return "bg-blue-100 text-blue-900 border border-blue-200";
    if (position === "MF") return "bg-emerald-100 text-emerald-900 border border-emerald-200";
    if (position === "FW") return "bg-rose-100 text-rose-900 border border-rose-200";
    return "bg-slate-100 text-slate-900 border border-slate-200";
  };

  // Helper to construct interactive page numbers for paginator
  const getPageNumbers = () => {
    const nums = [];
    const hasNext = players.length === limit;
    
    if (page === 1) {
      nums.push(1);
      if (hasNext) nums.push(2);
      if (hasNext) nums.push(3);
    } else if (page === 2) {
      nums.push(1);
      nums.push(2);
      if (hasNext) nums.push(3);
    } else if (page === 3) {
      nums.push(1);
      nums.push(2);
      nums.push(3);
      if (hasNext) nums.push(4);
    } else {
      nums.push(1);
      nums.push("...");
      nums.push(page - 1);
      nums.push(page);
      if (hasNext) nums.push(page + 1);
    }
    return nums;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f5f8]">
        <div className="w-48 h-1.5 bg-slate-200 rounded-full relative overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-purple-950 shadow-[0_0_15px_#37003c]"
          />
        </div>
      </div>
    );

  const titleHeader = teamFilter
    ? teamFilter.replace(/-/g, " ")
    : posFilter
      ? `${posFilter}s`
      : nationFilter
        ? `${nationFilter}`
        : "League";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:px-6 lg:px-8 max-w-[1400px] mx-auto relative"
    >
      {/* Background Blobs */}
      <div className="blob w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-200/20 top-[-5%] right-[-5%]"></div>
      <div className="blob w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-pink-100/20 bottom-[-5%] left-[-5%]"></div>

      {/* Header controls */}
      <header className="mb-10 md:mb-14 space-y-6 relative z-10">
        <Link
          to="/teams"
          className="group inline-flex items-center gap-2 text-slate-500 hover:text-purple-950 transition-colors font-extrabold text-xs uppercase tracking-wider bg-white px-4 py-2 rounded-xl border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-slate-500" />
          <span>Clubs Directory</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200/60 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                Squad Analytics
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-none tracking-tighter text-slate-900">
              {titleHeader} <span className="text-accent-gradient">Roster.</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-xl font-semibold">
              Live statistics and tactical metrics for the current campaign.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 self-start lg:self-auto w-full lg:w-auto">
            {/* Quick search input */}
            <div className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl group focus-within:border-purple-600 focus-within:shadow-md focus-within:shadow-purple-950/5 transition-all w-full sm:w-64">
              <Search size={14} className="text-slate-400 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none text-xs font-bold focus:outline-none flex-1 text-slate-800 placeholder-slate-400"
              />
            </div>
            
            <div className="flex items-center gap-4 bg-white border border-slate-200 px-5 py-2 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-slate-800">
              <div className="text-center pr-4 border-r border-slate-100">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Sequence</p>
                <p className="text-sm font-black text-purple-950">{page}</p>
              </div>
              <div className="text-center">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Shown</p>
                <p className="text-sm font-black text-purple-950">{filteredPlayers.length}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Roster Table */}
      <div className="bg-white border border-slate-100 overflow-hidden relative z-10 rounded-3xl shadow-[0_4px_25px_rgba(55,0,60,0.02)]">
        <div className="overflow-x-auto">
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-20 bg-white">
              <UserCheck size={48} className="text-slate-200 mx-auto mb-4" />
              <h3 className="text-md font-black text-slate-800">No players found</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Try searching a different name.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/60">
                  <th className="py-5 px-6 md:px-8 text-xs font-black uppercase tracking-wider text-slate-600">Athlete</th>
                  {!teamFilter && (
                    <th className="hidden sm:table-cell py-5 px-4 text-xs font-black uppercase tracking-wider text-slate-600 text-center">
                      Club
                    </th>
                  )}
                  <th className="hidden md:table-cell py-5 px-4 text-xs font-black uppercase tracking-wider text-slate-600 text-center">
                    Origin
                  </th>
                  <th className="py-5 px-4 text-xs font-black uppercase tracking-wider text-slate-600 text-center">
                    Role
                  </th>
                  <th className="hidden sm:table-cell py-5 px-4 text-xs font-black uppercase tracking-wider text-slate-600 text-center">
                    Apps
                  </th>
                  <th className="py-5 px-4 text-xs font-black uppercase tracking-wider text-purple-900 text-center bg-purple-50/50">
                    Goals
                  </th>
                  <th className="py-5 px-4 text-xs font-black uppercase tracking-wider text-purple-900 text-center bg-purple-50/50">
                    Assists
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {filteredPlayers.map((p, index) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: Math.min(index * 0.005, 0.1) }}
                      key={p.player_name + index}
                      className="hover:bg-slate-50/70 transition-all group"
                    >
                      {/* Name Details */}
                      <td className="py-4 px-6 md:px-8">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 group-hover:bg-purple-950 group-hover:text-white transition-all duration-300 flex items-center justify-center border border-purple-100 group-hover:border-purple-950 shadow-sm">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 group-hover:text-purple-950 transition-colors leading-tight">
                              {p.player_name}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              Premier League Pro
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Club Name */}
                      {!teamFilter && (
                        <td className="hidden sm:table-cell py-4 px-4 text-center">
                          <span className="text-xs font-extrabold text-slate-700 hover:text-purple-600 transition-colors">
                            {p.team_name.replace(/-/g, " ")}
                          </span>
                        </td>
                      )}

                      {/* Origin Flag */}
                      <td className="hidden md:table-cell py-4 px-4 text-center">
                        {p.nation ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-slate-50 border border-slate-200 text-slate-600">
                            <img
                              src={`/flags/${p.nation.split(" ")[1]}.png`}
                              alt={p.nation}
                              className="w-4 h-3 object-cover rounded-[1px]"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <span>{p.nation.split(" ")[1]}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">-</span>
                        )}
                      </td>

                      {/* Position Badges */}
                      <td className="py-4 px-4 text-center">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${getPositionStyles(p.position)}`}>
                          {p.position}
                        </span>
                      </td>

                      {/* Apps */}
                      <td className="hidden sm:table-cell py-4 px-4 text-center font-extrabold text-slate-500 text-sm">
                        {p.matches_played ?? 0}
                      </td>

                      {/* Goals */}
                      <td className="py-4 px-4 text-center font-black text-purple-950 text-base bg-purple-50/10">
                        {p.goals ?? 0}
                      </td>

                      {/* Assists */}
                      <td className="py-4 px-4 text-center font-black text-purple-950 text-base bg-purple-50/10">
                        {p.assists ?? 0}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Roster Pagination */}
      {!teamFilter && (
        <div className="mt-12 flex flex-col items-center gap-3 sm:gap-4 relative z-10">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest text-center px-4">
            Showing <span className="font-black text-purple-950">{(page - 1) * limit + 1}</span> – <span className="font-black text-purple-950">{(page - 1) * limit + players.length}</span> of elite athletes
          </p>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {/* First Page Button */}
            <button
              disabled={page === 1}
              onClick={() => { setPage(1); window.scrollTo(0, 0); }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-purple-950 hover:text-white hover:border-purple-950 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all duration-200 shadow-sm"
              title="First Page"
            >
              <ChevronsLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Prev Button */}
            <button
              disabled={page === 1}
              onClick={() => { setPage((prev) => prev - 1); window.scrollTo(0, 0); }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-purple-950 hover:text-white hover:border-purple-950 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all duration-200 shadow-sm"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((num, i) => {
              if (num === "...") {
                return (
                  <span key={i} className="px-1.5 sm:px-2 text-slate-400 font-bold text-xs sm:text-sm select-none">
                    ...
                  </span>
                );
              }
              const isActive = num === page;
              return (
                <button
                  key={i}
                  onClick={() => { setPage(num); window.scrollTo(0, 0); }}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase transition-all duration-200 shadow-sm ${
                    isActive
                      ? "bg-purple-950 text-white border border-purple-950 shadow-md shadow-purple-950/20"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-purple-950 hover:text-white hover:border-purple-950"
                  }`}
                >
                  {num}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              disabled={players.length < limit}
              onClick={() => { setPage((prev) => prev + 1); window.scrollTo(0, 0); }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-purple-950 hover:text-white hover:border-purple-950 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all duration-200 shadow-sm"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
