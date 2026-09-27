import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Search,
  ArrowRight,
  Shield,
  TrendingUp,
  Info,
  Flame,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { standingsApi } from '../api/standingsApi';
import TeamCrest from '../components/common/TeamCrest';

export default function Standings() {
  const [standings, setStandings] = useState([]);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'home' | 'away'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('position');
  const [sortAsc, setSortAsc] = useState(true);

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

  // Handle column sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      // For goals, points, GD, default to descending
      if (['points', 'goal_difference', 'goals_for', 'won', 'played'].includes(field)) {
        setSortAsc(false);
      } else {
        setSortAsc(true);
      }
    }
  };

  // Filter and sort rows
  const sortedAndFilteredStandings = useMemo(() => {
    let result = standings.filter(
      (row) =>
        row.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (row.short_name && row.short_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [standings, searchQuery, sortField, sortAsc]);

  // Quick podium metrics
  const leader = standings.length > 0 ? standings[0] : null;
  const topAttack = useMemo(() => {
    if (!standings.length) return null;
    return [...standings].sort((a, b) => b.goals_for - a.goals_for)[0];
  }, [standings]);
  const bestDefense = useMemo(() => {
    if (!standings.length) return null;
    return [...standings].filter((r) => r.played > 0).sort((a, b) => a.goals_against - b.goals_against)[0];
  }, [standings]);

  const getZoneIndicator = (zone) => {
    switch (zone) {
      case 'UCL':
        return 'bg-blue-600 text-white';
      case 'UEL':
        return 'bg-amber-600 text-white';
      case 'UECL':
        return 'bg-emerald-600 text-white';
      case 'REL':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getZoneBorder = (zone) => {
    switch (zone) {
      case 'UCL':
        return 'border-l-4 border-l-blue-600';
      case 'UEL':
        return 'border-l-4 border-l-amber-600';
      case 'UECL':
        return 'border-l-4 border-l-emerald-600';
      case 'REL':
        return 'border-l-4 border-l-rose-600';
      default:
        return 'border-l-4 border-l-transparent';
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 w-full bg-[#fafbfc]">
      {/* 1. EDITORIAL HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-6 mb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-900 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>2026/27 Season • Official Standings</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            Premier League Table
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-xl">
            Live club rankings, goal differential breakdowns, European qualification cutoff zones,
            and recent 5-match form guide.
          </p>
        </div>

        {/* Club Search Filter */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Filter clubs by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* 2. PODIUM SUMMARY CARDS */}
      {standings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* League Leader Card */}
          {leader && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-purple-50 p-2 border border-purple-100 flex items-center justify-center flex-shrink-0">
                  <TeamCrest
                    crestUrl={leader.crest_url}
                    teamName={leader.team_name}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="min-w-0 truncate">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                    1st • League Leader
                  </span>
                  <p className="text-sm font-black text-slate-900 truncate">{leader.team_name}</p>
                  <p className="text-[11px] text-slate-400 font-semibold">
                    {leader.won}W - {leader.drawn}D - {leader.lost}L
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-purple-950 font-mono">
                  {leader.points}
                </span>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Pts</span>
              </div>
            </div>
          )}

          {/* Top Scoring Attack Card */}
          {topAttack && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 p-2 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <TeamCrest
                    crestUrl={topAttack.crest_url}
                    teamName={topAttack.team_name}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="min-w-0 truncate">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Top Goalscoring Attack
                  </span>
                  <p className="text-sm font-black text-slate-900 truncate">{topAttack.team_name}</p>
                  <p className="text-[11px] text-slate-400 font-semibold">
                    Ranked #{topAttack.position} in Table
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-600 font-mono">
                  {topAttack.goals_for}
                </span>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Goals</span>
              </div>
            </div>
          )}

          {/* Best Defense Card */}
          {bestDefense && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-blue-50 p-2 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <TeamCrest
                    crestUrl={bestDefense.crest_url}
                    teamName={bestDefense.team_name}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="min-w-0 truncate">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">
                    Tightest Defense
                  </span>
                  <p className="text-sm font-black text-slate-900 truncate">
                    {bestDefense.team_name}
                  </p>
                  <p className="text-[11px] text-slate-400 font-semibold">
                    Allowed {bestDefense.goals_against} goals
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-blue-600 font-mono">
                  {bestDefense.goals_against}
                </span>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Against</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CONTROLS BAR: FILTER TABS & QUALIFICATION LEGEND */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        {/* Record Filters (Overall / Home / Away) */}
        <div className="inline-flex p-1 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
          {[
            { id: 'all', label: 'Overall Table' },
            { id: 'home', label: 'Home Form' },
            { id: 'away', label: 'Away Form' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterMode === tab.id
                  ? 'bg-purple-900 text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Qualification Status Pills */}
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Champions League (1-4)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <span>Europa League (5)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span>Relegation (18-20)</span>
          </span>
        </div>
      </div>

      {/* 4. BROADCAST STANDINGS TABLE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-purple-200 border-t-purple-900 rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Computing Official League Standings...
            </p>
          </div>
        ) : sortedAndFilteredStandings.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No clubs match your filter.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-black text-purple-700 hover:underline"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th
                    onClick={() => handleSort('position')}
                    className="py-3.5 pl-6 pr-2 text-center w-14 cursor-pointer hover:text-slate-900"
                  >
                    <div className="inline-flex items-center gap-1">
                      <span>#</span>
                      {sortField === 'position' && (
                        sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('team_name')}
                    className="py-3.5 px-4 min-w-[220px] cursor-pointer hover:text-slate-900"
                  >
                    <div className="inline-flex items-center gap-1">
                      <span>Club</span>
                      {sortField === 'team_name' && (
                        sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('played')}
                    className="py-3.5 px-3 text-center cursor-pointer hover:text-slate-900"
                    title="Matches Played"
                  >
                    <div className="inline-flex items-center justify-center gap-1">
                      <span>MP</span>
                      {sortField === 'played' && (
                        sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('won')}
                    className="py-3.5 px-3 text-center cursor-pointer hover:text-slate-900"
                    title="Wins"
                  >
                    <span>W</span>
                  </th>

                  <th
                    onClick={() => handleSort('drawn')}
                    className="py-3.5 px-3 text-center cursor-pointer hover:text-slate-900"
                    title="Draws"
                  >
                    <span>D</span>
                  </th>

                  <th
                    onClick={() => handleSort('lost')}
                    className="py-3.5 px-3 text-center cursor-pointer hover:text-slate-900"
                    title="Losses"
                  >
                    <span>L</span>
                  </th>

                  <th
                    onClick={() => handleSort('goals_for')}
                    className="py-3.5 px-3 text-center cursor-pointer hover:text-slate-900 hidden sm:table-cell"
                    title="Goals For"
                  >
                    <span>GF</span>
                  </th>

                  <th
                    onClick={() => handleSort('goals_against')}
                    className="py-3.5 px-3 text-center cursor-pointer hover:text-slate-900 hidden sm:table-cell"
                    title="Goals Against"
                  >
                    <span>GA</span>
                  </th>

                  <th
                    onClick={() => handleSort('goal_difference')}
                    className="py-3.5 px-3 text-center cursor-pointer hover:text-slate-900"
                    title="Goal Difference"
                  >
                    <div className="inline-flex items-center justify-center gap-1">
                      <span>GD</span>
                      {sortField === 'goal_difference' && (
                        sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('points')}
                    className="py-3.5 px-4 text-center font-black text-purple-950 cursor-pointer hover:text-purple-700"
                    title="Total Points"
                  >
                    <div className="inline-flex items-center justify-center gap-1">
                      <span>Pts</span>
                      {sortField === 'points' && (
                        sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </div>
                  </th>

                  <th className="py-3.5 pr-6 pl-3 text-center min-w-[140px]">Last 5</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-800">
                {sortedAndFilteredStandings.map((row) => (
                  <tr
                    key={row.team_name}
                    className={`hover:bg-slate-50 transition-colors group ${getZoneBorder(
                      row.zone
                    )}`}
                  >
                    {/* Rank Badge */}
                    <td className="py-3.5 pl-6 pr-2 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-black ${getZoneIndicator(
                          row.zone
                        )}`}
                      >
                        {row.position}
                      </span>
                    </td>

                    {/* Club Name & Crest */}
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
                          <p className="text-[10px] font-semibold text-slate-400 truncate">
                            {row.stadium || 'Premier League Stadium'}
                          </p>
                        </div>
                      </Link>
                    </td>

                    {/* Numerical Stats */}
                    <td className="py-3.5 px-3 text-center font-bold text-slate-900">
                      {row.played}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                      {row.won}
                    </td>
                    <td className="py-3.5 px-3 text-center font-medium text-slate-500">
                      {row.drawn}
                    </td>
                    <td className="py-3.5 px-3 text-center font-medium text-slate-500">
                      {row.lost}
                    </td>
                    <td className="py-3.5 px-3 text-center font-medium text-slate-600 hidden sm:table-cell">
                      {row.goals_for}
                    </td>
                    <td className="py-3.5 px-3 text-center font-medium text-slate-600 hidden sm:table-cell">
                      {row.goals_against}
                    </td>

                    {/* Goal Difference */}
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

                    {/* Total Points */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-xl bg-purple-50 text-purple-950 font-black text-xs border border-purple-200/80 font-mono">
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
                                  ? 'bg-emerald-600 shadow-2xs'
                                  : res === 'D'
                                  ? 'bg-slate-400'
                                  : 'bg-rose-600'
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

      {/* 5. EUROPEAN QUALIFICATION & RELEGATION EXPLAINER */}
      <div className="mt-8 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-purple-900" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-900">
              European Qualification & Relegation Rules
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium max-w-2xl leading-relaxed">
            The top 4 teams qualify automatically for the UEFA Champions League group stage. The 5th
            place team earns direct entry into the UEFA Europa League. The bottom 3 clubs face
            relegation to the EFL Championship.
          </p>
        </div>

        <Link
          to="/fixtures"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-2xs transition-colors flex-shrink-0"
        >
          <span>View Match Fixtures</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
