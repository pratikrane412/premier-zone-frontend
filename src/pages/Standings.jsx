import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Search, ArrowRight, Shield, TrendingUp, Info, Sparkles } from 'lucide-react';
import { standingsApi } from '../api/standingsApi';
import TeamCrest from '../components/common/TeamCrest';

export default function Standings() {
  const [standings, setStandings] = useState([]);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'home' | 'away'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTable = async () => {
      setLoading(true);
      try {
        const data = await standingsApi.getStandings(filterMode);
        setStandings(data || []);
      } catch (err) {
        console.error('Failed to load standings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTable();
  }, [filterMode]);

  const filteredStandings = standings.filter((row) =>
    row.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.short_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getZoneIndicator = (zone) => {
    switch (zone) {
      case 'UCL':
        return 'bg-blue-600 text-white';
      case 'UEL':
        return 'bg-orange-500 text-white';
      case 'UECL':
        return 'bg-emerald-600 text-white';
      case 'REL':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getZoneBorder = (zone) => {
    switch (zone) {
      case 'UCL':
        return 'border-l-4 border-l-blue-600';
      case 'UEL':
        return 'border-l-4 border-l-orange-500';
      case 'UECL':
        return 'border-l-4 border-l-emerald-600';
      case 'REL':
        return 'border-l-4 border-l-rose-600';
      default:
        return 'border-l-4 border-l-transparent';
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto relative">
      {/* Background ambient blobs */}
      <div className="blob w-[360px] h-[360px] bg-purple-200/30 top-[-5%] left-[-5%]"></div>
      <div className="blob w-[320px] h-[320px] bg-indigo-100/30 bottom-[-5%] right-[-5%]"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 pb-8 mb-8 relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100">
            <Trophy size={14} className="text-purple-700" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-950">
              Official 2025/26 Standings • 20 Member Clubs
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            Premier League Table
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500 max-w-xl">
            Live league rankings, goal differentials, European qualification spots, and form guide.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search club..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Filter Mode Tabs (Overall / Home / Away) */}
      <div className="flex items-center justify-between gap-4 mb-6 relative z-10 flex-wrap">
        <div className="inline-flex p-1 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          {[
            { id: 'all', label: 'Overall Standings' },
            { id: 'home', label: 'Home Record' },
            { id: 'away', label: 'Away Record' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                filterMode === tab.id
                  ? 'bg-purple-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> UCL Top 4
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> UEL 5th
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Relegation
          </span>
        </div>
      </div>

      {/* Standings Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden relative z-10">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-12 h-12 border-3 border-purple-200 border-t-purple-900 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Computing Official League Table...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 pl-6 pr-2 text-center w-12">#</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Club</th>
                  <th className="py-3.5 px-3 text-center">MP</th>
                  <th className="py-3.5 px-3 text-center">W</th>
                  <th className="py-3.5 px-3 text-center">D</th>
                  <th className="py-3.5 px-3 text-center">L</th>
                  <th className="py-3.5 px-3 text-center hidden sm:table-cell">GF</th>
                  <th className="py-3.5 px-3 text-center hidden sm:table-cell">GA</th>
                  <th className="py-3.5 px-3 text-center">GD</th>
                  <th className="py-3.5 px-4 text-center font-black text-purple-950">Pts</th>
                  <th className="py-3.5 pr-6 pl-3 text-center min-w-[130px]">Last 5</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filteredStandings.map((row) => (
                  <tr
                    key={row.team_name}
                    className={`hover:bg-purple-50/40 transition-colors group ${getZoneBorder(
                      row.zone
                    )}`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 pl-6 pr-2 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-black ${getZoneIndicator(
                          row.zone
                        )}`}
                      >
                        {row.position}
                      </span>
                    </td>

                    {/* Club */}
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/players?team=${encodeURIComponent(row.team_name)}`}
                        className="flex items-center gap-3 group-hover:text-purple-950 transition-colors"
                      >
                        <TeamCrest
                          crestUrl={row.crest_url}
                          teamName={row.team_name}
                          className="w-6 h-6 object-contain flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 truncate group-hover:text-purple-900 transition-colors">
                            {row.team_name}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 truncate">
                            {row.stadium || 'Premier League'}
                          </p>
                        </div>
                      </Link>
                    </td>

                    {/* Stats */}
                    <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                      {row.played}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                      {row.won}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-500">
                      {row.drawn}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-500">
                      {row.lost}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-600 hidden sm:table-cell">
                      {row.goals_for}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-600 hidden sm:table-cell">
                      {row.goals_against}
                    </td>
                    <td
                      className={`py-3.5 px-3 text-center font-black ${
                        row.goal_difference > 0
                          ? 'text-emerald-600'
                          : row.goal_difference < 0
                          ? 'text-rose-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference}
                    </td>

                    {/* Points */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-xl bg-purple-50 text-purple-950 font-black text-xs border border-purple-100/80">
                        {row.points}
                      </span>
                    </td>

                    {/* Last 5 Form Badges */}
                    <td className="py-3.5 pr-6 pl-3">
                      <div className="flex items-center justify-center gap-1">
                        {row.form.length === 0 ? (
                          <span className="text-[10px] text-slate-400 font-bold">-</span>
                        ) : (
                          row.form.map((res, i) => (
                            <span
                              key={i}
                              title={res === 'W' ? 'Win' : res === 'D' ? 'Draw' : 'Loss'}
                              className={`w-5 h-5 rounded-md text-[9px] font-black flex items-center justify-center text-white ${
                                res === 'W'
                                  ? 'bg-emerald-500 shadow-xs'
                                  : res === 'D'
                                  ? 'bg-slate-400'
                                  : 'bg-rose-500'
                              }`}
                            >
                              {res}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend & Explanations */}
      <div className="mt-8 p-6 bg-white rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-purple-900" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              European Qualification & Relegation Rules
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold max-w-2xl leading-relaxed">
            The top 4 teams qualify automatically for the UEFA Champions League group stage. The 5th
            place team earns entry into the UEFA Europa League, and the 6th enters the UEFA Conference
            League. The bottom 3 clubs face relegation to the EFL Championship.
          </p>
        </div>

        <Link
          to="/fixtures"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-950 text-white font-extrabold text-xs shadow-md hover:bg-purple-900 transition-colors flex-shrink-0"
        >
          <span>View All Fixtures</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
