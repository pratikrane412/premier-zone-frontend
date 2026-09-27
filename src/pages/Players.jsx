import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Scale,
  Sparkles,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { playersApi } from "../api/playersApi";
import PlayerAvatar from "../components/common/PlayerAvatar";
import TeamCrest from "../components/common/TeamCrest";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPos, setSelectedPos] = useState("");
  const [ordering, setOrdering] = useState("-goals");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 24;

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const teamFilter = query.get("team") || "";

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const offset = (page - 1) * limit;
        const res = await playersApi.getAll({
          search: searchTerm.trim(),
          position: selectedPos,
          team: teamFilter,
          ordering: ordering,
          limit,
          offset,
        });
        setPlayers(res.results || []);
        setTotalCount(res.total || 0);
      } catch (err) {
        console.error("Error fetching players:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchPlayers, 200);
    return () => clearTimeout(debounce);
  }, [searchTerm, selectedPos, teamFilter, ordering, page]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  const getPositionStyles = (pos) => {
    const p = pos?.toUpperCase();
    if (p === "GK") return "bg-amber-50 text-amber-900 border-amber-200";
    if (p === "DF") return "bg-blue-50 text-blue-900 border-blue-200";
    if (p === "MF") return "bg-emerald-50 text-emerald-900 border-emerald-200";
    if (p === "FW") return "bg-rose-50 text-rose-900 border-rose-200";
    return "bg-slate-50 text-slate-900 border-slate-200";
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto relative">
      {/* Background blobs */}
      <div className="blob w-[350px] h-[350px] bg-purple-200/30 top-[-5%] left-[-5%]"></div>
      <div className="blob w-[300px] h-[300px] bg-pink-100/30 bottom-[-5%] right-[-5%]"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 pb-8 mb-8 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100">
            <Sparkles size={14} className="text-purple-700" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-950">
              Scouting Database ({totalCount} Active Stars)
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            {teamFilter ? `${teamFilter} Squad` : "Premier League Players"}
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500 max-w-xl">
            Complete database of Premier League athletes with official photos, performance metrics, and valuations.
          </p>
        </div>

        {/* Quick Compare CTA */}
        <Link
          to="/compare"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-950 text-white font-extrabold text-xs shadow-md hover:bg-purple-900 transition-colors"
        >
          <Scale size={16} />
          Head-to-Head Compare
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-8 relative z-10 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search player name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 transition-colors"
          />
        </div>

        {/* Position Filter Buttons */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["", "GK", "DF", "MF", "FW"].map((pos) => (
            <button
              key={pos}
              onClick={() => {
                setSelectedPos(pos);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedPos === pos
                  ? "bg-purple-950 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {pos || "All Roles"}
            </button>
          ))}
        </div>

        {/* Ordering Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <ArrowUpDown size={14} className="text-slate-400" />
          <select
            value={ordering}
            onChange={(e) => {
              setOrdering(e.target.value);
              setPage(1);
            }}
            className="text-xs font-black text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="-goals">Most Goals</option>
            <option value="-assists">Most Assists</option>
            <option value="-rating">Highest Rated</option>
            <option value="-market_value_eur">Highest Market Value</option>
            <option value="-form">Best Form</option>
            <option value="player_name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Players Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-12 h-12 border-3 border-purple-200 border-t-purple-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Scanning Official Database...
          </p>
        </div>
      ) : players.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-slate-100 p-8">
          <p className="text-sm font-bold text-slate-500">No players match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 relative z-10">
          {players.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-purple-200 hover:shadow-lg transition-all p-5 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Row: Club & Position */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 min-w-0 pr-2">
                  <TeamCrest
                    crestUrl={p.team_crest}
                    teamName={p.team_name}
                    className="w-4 h-4 object-contain flex-shrink-0"
                  />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 truncate max-w-[120px]">
                    {p.team_name}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border flex-shrink-0 ${getPositionStyles(
                    p.position
                  )}`}
                >
                  {p.position}
                </span>
              </div>

              {/* Player Image & Name */}
              <div className="flex items-center gap-4 my-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-purple-50 to-slate-100 border border-slate-200 overflow-hidden flex items-end justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <PlayerAvatar
                    photoUrl={p.photo_url}
                    name={p.player_name}
                    position={p.position}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-900 text-sm truncate leading-snug group-hover:text-purple-950 transition-colors">
                    {p.player_name}
                  </h3>
                  <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
                    £{p.market_value_eur}M
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-slate-400">
                    <span className="text-amber-500 font-black">★ {p.rating}</span>
                    <span>•</span>
                    <span>Form: {p.form || 0.0}</span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-50 text-center">
                <div className="bg-slate-50 rounded-xl py-1.5">
                  <span className="text-xs font-black text-slate-800">{p.goals}</span>
                  <span className="block text-[8px] font-bold uppercase text-slate-400">Goals</span>
                </div>
                <div className="bg-slate-50 rounded-xl py-1.5">
                  <span className="text-xs font-black text-slate-800">{p.assists}</span>
                  <span className="block text-[8px] font-bold uppercase text-slate-400">Assists</span>
                </div>
                <div className="bg-slate-50 rounded-xl py-1.5">
                  <span className="text-xs font-black text-slate-800">{p.minutes_played || 0}</span>
                  <span className="block text-[8px] font-bold uppercase text-slate-400">Mins</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => navigate(`/compare?player1=${p.id}`)}
                  className="flex-1 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-[10px] font-extrabold flex items-center justify-center gap-1 transition-colors"
                >
                  <Scale size={12} />
                  Compare
                </button>
                <Link
                  to="/squad-builder"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-purple-950 text-white text-[10px] font-extrabold transition-colors"
                >
                  Draft
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-12 flex items-center justify-center gap-3 relative z-10">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="p-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 shadow-sm text-slate-700"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-xs font-black text-purple-950 px-3">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="p-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 shadow-sm text-slate-700"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
