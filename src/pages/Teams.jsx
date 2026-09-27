import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Search,
  Trophy,
  Shield,
  MapPin,
  Users,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  LayoutGrid,
  List,
  Building2,
  TrendingUp,
} from 'lucide-react';
import TeamCrest from '../components/common/TeamCrest';
import { playersApi } from '../api/playersApi';
import { standingsApi } from '../api/standingsApi';

const REGION_MAP = {
  Arsenal: 'London',
  Chelsea: 'London',
  Spurs: 'London',
  'Crystal Palace': 'London',
  Fulham: 'London',
  Brentford: 'London',
  'Man City': 'North West',
  'Man Utd': 'North West',
  Liverpool: 'North West',
  Everton: 'North West',
  'Aston Villa': 'Midlands',
  "Nott'm Forest": 'Midlands',
  'Coventry City': 'Midlands',
  Brighton: 'South Coast',
  Bournemouth: 'South Coast',
  Newcastle: 'North East',
  Sunderland: 'North East',
  'Hull City': 'Yorkshire',
  Leeds: 'Yorkshire',
  'Ipswich Town': 'East',
};

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [standingsMap, setStandingsMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [sortBy, setSortBy] = useState('rank'); // 'rank' | 'alpha' | 'founded' | 'squad'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [loading, setLoading] = useState(true);

  // Quick Spotlight Modal
  const [selectedClubModal, setSelectedClubModal] = useState(null);

  useEffect(() => {
    const loadClubData = async () => {
      setLoading(true);
      try {
        const [teamsData, standingsData] = await Promise.allSettled([
          playersApi.getTeams(true),
          standingsApi.getStandings('all'),
        ]);

        const rawTeams = teamsData.status === 'fulfilled' && Array.isArray(teamsData.value)
          ? teamsData.value
          : [];

        // Build standings lookup by team name
        const sMap = {};
        if (standingsData.status === 'fulfilled' && Array.isArray(standingsData.value)) {
          standingsData.value.forEach((item) => {
            if (item.team_name) {
              sMap[item.team_name.toLowerCase()] = item;
            }
          });
        }
        setStandingsMap(sMap);

        const formatted = rawTeams.map((item) => {
          if (typeof item === 'string') {
            const standing = sMap[item.toLowerCase()] || {};
            return {
              id: item,
              name: item,
              code: item.substring(0, 3).toUpperCase(),
              stadium: `${item.replace(/-/g, ' ')} Stadium`,
              city: 'England',
              founded: 1900,
              primary_color: '#38003c',
              player_count: 28,
              standing,
            };
          }
          const standing = sMap[(item.name || '').toLowerCase()] || {};
          return {
            ...item,
            standing,
          };
        });

        setTeams(formatted);
      } catch (err) {
        console.error('Error fetching teams & standings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadClubData();
  }, []);

  // Filter & Sort Logic
  const filteredAndSortedTeams = useMemo(() => {
    let result = teams.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = t.name.toLowerCase().includes(q) || t.name.replace(/-/g, ' ').toLowerCase().includes(q);
      const stadiumMatch = t.stadium ? t.stadium.toLowerCase().includes(q) : false;
      const cityMatch = t.city ? t.city.toLowerCase().includes(q) : false;
      const codeMatch = t.code ? t.code.toLowerCase().includes(q) : false;

      const matchesSearch = !q || nameMatch || stadiumMatch || cityMatch || codeMatch;

      const clubRegion = REGION_MAP[t.name] || 'Other';
      const matchesRegion = selectedRegion === 'ALL' || clubRegion === selectedRegion;

      return matchesSearch && matchesRegion;
    });

    result.sort((a, b) => {
      if (sortBy === 'rank') {
        const rankA = a.standing?.position || 99;
        const rankB = b.standing?.position || 99;
        return rankA - rankB;
      }
      if (sortBy === 'alpha') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'founded') {
        return (a.founded || 1900) - (b.founded || 1900);
      }
      if (sortBy === 'squad') {
        return (b.player_count || 0) - (a.player_count || 0);
      }
      return 0;
    });

    return result;
  }, [teams, searchQuery, selectedRegion, sortBy]);

  // League Leader & Summary Figures
  const summary = useMemo(() => {
    if (!teams.length) return null;
    const sortedByRank = [...teams].sort((a, b) => (a.standing?.position || 99) - (b.standing?.position || 99));
    const leader = sortedByRank[0];
    const totalSquadCount = teams.reduce((acc, t) => acc + (t.player_count || 28), 0);
    return {
      leader,
      totalClubs: teams.length,
      totalPlayers: totalSquadCount,
    };
  }, [teams]);

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 w-full relative">
      {/* Editorial Header */}
      <div className="mb-8 border-b border-slate-200/80 pb-6 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 shadow-xs">
            <Trophy size={13} className="text-purple-700" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-950">
              The 20 Member Clubs • 2026/27 Campaign
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            Premier League Clubs & Grounds
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500 max-w-2xl">
            Official club identities, historic stadiums, full squad rosters, and live table records across all 20 top-flight institutions.
          </p>
        </div>

        {/* Quick Nav Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/standings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 text-slate-800 hover:text-purple-950 font-black text-xs shadow-xs transition-colors"
          >
            <Trophy size={14} className="text-amber-500" />
            <span>Full Standings Table</span>
          </Link>
          <Link
            to="/players"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-950 text-white font-black text-xs shadow-sm hover:bg-purple-900 transition-colors"
          >
            <Users size={14} className="text-purple-300" />
            <span>All 660+ Players</span>
          </Link>
        </div>
      </div>

      {/* Editorial Key Metrics Ribbon */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8 relative z-10">
          {/* Card 1: League Leader */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 p-2 flex items-center justify-center flex-shrink-0">
              {summary.leader && (
                <TeamCrest
                  crestUrl={summary.leader.crest_url}
                  teamName={summary.leader.name}
                  className="w-8 h-8 object-contain"
                />
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 block">
                Current #1 Leader
              </span>
              <p className="text-sm font-black text-slate-900 truncate">
                {summary.leader?.name}
              </p>
              <p className="text-[11px] font-bold text-slate-400">
                {summary.leader?.standing?.points || 0} Pts • GD {summary.leader?.standing?.goal_difference > 0 ? `+${summary.leader?.standing?.goal_difference}` : summary.leader?.standing?.goal_difference || 0}
              </p>
            </div>
          </div>

          {/* Card 2: 20 Member Clubs */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Competition Pool
              </span>
              <p className="text-sm font-black text-slate-900">
                20 Elite Clubs
              </p>
              <p className="text-[11px] font-bold text-slate-400">
                Top Flight Division
              </p>
            </div>
          </div>

          {/* Card 3: Registered Athletes */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Users size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Squad Registrations
              </span>
              <p className="text-sm font-black text-slate-900">
                {summary.totalPlayers} Stars
              </p>
              <p className="text-[11px] font-bold text-slate-400">
                Official Roster Pool
              </p>
            </div>
          </div>

          {/* Card 4: Iconic Grounds */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Iconic Venues
              </span>
              <p className="text-sm font-black text-slate-900">
                20 Historic Grounds
              </p>
              <p className="text-[11px] font-bold text-slate-400">
                6 In London Region
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search, Region Tabs & Sorting Controls */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs mb-8 relative z-10 flex flex-col lg:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by club, stadium, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Region Filter Tabs */}
        <div className="flex gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Regions' },
            { id: 'London', label: 'London (6)' },
            { id: 'North West', label: 'North West (4)' },
            { id: 'Midlands', label: 'Midlands (3)' },
            { id: 'South Coast', label: 'South Coast (2)' },
            { id: 'North East', label: 'North East (2)' },
          ].map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex-shrink-0 ${
                selectedRegion === reg.id
                  ? 'bg-purple-950 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown & View Mode Switcher */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-black text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="rank">Sort by: Table Position</option>
            <option value="alpha">Sort by: Club Name (A–Z)</option>
            <option value="founded">Sort by: Oldest Founded</option>
            <option value="squad">Sort by: Largest Squad</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-purple-950' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-xs text-purple-950' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Clubs Body */}
      {loading ? (
        <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <div className="w-12 h-12 border-3 border-purple-200 border-t-purple-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Loading Premier League Clubs & Grounds...
          </p>
        </div>
      ) : filteredAndSortedTeams.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <p className="text-sm font-bold text-slate-500">No clubs match your active search filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('ALL');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-purple-950 text-white font-black text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          {filteredAndSortedTeams.map((team) => {
            const standing = team.standing || {};
            const pos = standing.position;
            const isUCL = pos && pos <= 4;
            const isRelegation = pos && pos >= 18;

            return (
              <div
                key={team.id || team.name}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-purple-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Club Color Accent Bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: team.primary_color || '#38003c' }}
                />

                <div className="p-6">
                  {/* Badge & Meta Pill Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                      {pos ? (
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg border ${
                            isUCL
                              ? 'bg-blue-50 text-blue-900 border-blue-200'
                              : isRelegation
                              ? 'bg-rose-50 text-rose-900 border-rose-200'
                              : 'bg-slate-50 text-slate-800 border-slate-200'
                          }`}
                        >
                          #{pos} • {standing.points || 0} PTS
                        </span>
                      ) : (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                          {team.code || 'PL'}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-bold text-slate-400">
                      Est. {team.founded || 1900}
                    </span>
                  </div>

                  {/* Club Crest Centerpiece */}
                  <div className="w-20 h-20 mx-auto my-3 p-1 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TeamCrest
                      crestUrl={team.crest_url}
                      teamName={team.name}
                      className="max-w-full max-h-full object-contain drop-shadow"
                    />
                  </div>

                  {/* Club Name & Stadium */}
                  <div className="text-center space-y-1 mb-5">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-purple-950 transition-colors">
                      {team.name.replace(/-/g, ' ')}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1">
                      <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{team.stadium || 'Premier Ground'}</span>
                    </p>
                  </div>

                  {/* Club Stats Strip */}
                  <div className="grid grid-cols-3 gap-1.5 py-2.5 px-3 bg-slate-50/80 rounded-2xl border border-slate-100 text-center text-[10px] font-black">
                    <div>
                      <span className="block text-slate-400 uppercase text-[8px] font-bold">Squad</span>
                      <span className="text-slate-800">{team.player_count || 28}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 uppercase text-[8px] font-bold">Record</span>
                      <span className="text-slate-800">
                        {standing.won || 0}W-{standing.drawn || 0}D
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-400 uppercase text-[8px] font-bold">Goal Diff</span>
                      <span className={`${(standing.goal_difference || 0) > 0 ? 'text-emerald-700' : (standing.goal_difference || 0) < 0 ? 'text-rose-700' : 'text-slate-600'}`}>
                        {(standing.goal_difference || 0) > 0 ? `+${standing.goal_difference}` : standing.goal_difference || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedClubModal(team)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Club Info</span>
                  </button>

                  <Link
                    to={`/players?team=${encodeURIComponent(team.name)}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-purple-950 hover:bg-purple-900 text-white text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>View Roster</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* COMPACT LIST VIEW */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden relative z-10">
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 grid grid-cols-12 text-[10px] font-black uppercase tracking-wider text-slate-500">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4">Club & Ground</div>
            <div className="col-span-2 hidden md:block">Region</div>
            <div className="col-span-2 text-center">Record (W-D-L)</div>
            <div className="col-span-1 text-center">Pts</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredAndSortedTeams.map((team) => {
              const standing = team.standing || {};
              const pos = standing.position || '-';
              return (
                <div
                  key={team.id || team.name}
                  className="p-4 grid grid-cols-12 items-center hover:bg-purple-50/40 transition-colors"
                >
                  <div className="col-span-1 text-center font-black text-sm text-slate-800">
                    {pos}
                  </div>

                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                      <TeamCrest
                        crestUrl={team.crest_url}
                        teamName={team.name}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-sm text-slate-900 truncate">
                        {team.name.replace(/-/g, ' ')}
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-400 truncate flex items-center gap-1">
                        <MapPin size={10} />
                        {team.stadium}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 hidden md:block text-xs font-bold text-slate-600">
                    {REGION_MAP[team.name] || team.city || 'England'}
                  </div>

                  <div className="col-span-2 text-center text-xs font-black text-slate-700">
                    {standing.won || 0}W - {standing.drawn || 0}D - {standing.lost || 0}L
                  </div>

                  <div className="col-span-1 text-center font-black text-sm text-purple-950">
                    {standing.points || 0}
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedClubModal(team)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors"
                    >
                      Info
                    </button>
                    <Link
                      to={`/players?team=${encodeURIComponent(team.name)}`}
                      className="px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-white text-[11px] font-black transition-colors"
                    >
                      Squad
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Club Spotlight Slide-Over / Modal */}
      <AnimatePresence>
        {selectedClubModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClubModal(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10"
            >
              {/* Modal Color Stripe */}
              <div
                className="h-3 w-full"
                style={{ backgroundColor: selectedClubModal.primary_color || '#38003c' }}
              />

              <div className="p-6">
                {/* Header with Close */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 p-1.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-inner">
                      <TeamCrest
                        crestUrl={selectedClubModal.crest_url}
                        teamName={selectedClubModal.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {selectedClubModal.name.replace(/-/g, ' ')}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">
                        {selectedClubModal.code || 'PL'} • Est. {selectedClubModal.founded || 1900}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedClubModal(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Ground Information Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Home Ground:</span>
                    <span className="font-black text-slate-900">{selectedClubModal.stadium}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Location / City:</span>
                    <span className="font-black text-slate-900">{selectedClubModal.city || 'England'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Squad Pool:</span>
                    <span className="font-black text-slate-900">{selectedClubModal.player_count || 28} Registered Players</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Primary Color:</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300"
                        style={{ backgroundColor: selectedClubModal.primary_color || '#38003c' }}
                      />
                      <span className="font-mono text-[11px] font-bold text-slate-600">
                        {selectedClubModal.primary_color || '#38003c'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Table Performance Snapshot */}
                {selectedClubModal.standing && (
                  <div className="grid grid-cols-4 gap-2 mb-6 text-center">
                    <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                      <p className="text-lg font-black text-purple-950">
                        #{selectedClubModal.standing.position || '-'}
                      </p>
                      <p className="text-[9px] font-bold text-purple-800 uppercase">League Rank</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p className="text-lg font-black text-emerald-950">
                        {selectedClubModal.standing.points || 0}
                      </p>
                      <p className="text-[9px] font-bold text-emerald-800 uppercase">Points</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-lg font-black text-blue-950">
                        {selectedClubModal.standing.won || 0}
                      </p>
                      <p className="text-[9px] font-bold text-blue-800 uppercase">Wins</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                      <p className="text-lg font-black text-amber-950">
                        {(selectedClubModal.standing.goal_difference || 0) > 0 ? `+${selectedClubModal.standing.goal_difference}` : selectedClubModal.standing.goal_difference || 0}
                      </p>
                      <p className="text-[9px] font-bold text-amber-800 uppercase">Goal Diff</p>
                    </div>
                  </div>
                )}

                {/* Action Links */}
                <div className="space-y-2">
                  <Link
                    to={`/players?team=${encodeURIComponent(selectedClubModal.name)}`}
                    onClick={() => setSelectedClubModal(null)}
                    className="w-full py-3 rounded-2xl bg-purple-950 hover:bg-purple-900 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Explore Full {selectedClubModal.name} Roster</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/standings"
                    onClick={() => setSelectedClubModal(null)}
                    className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Standings Placement</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
