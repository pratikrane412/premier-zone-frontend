import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Activity,
  ArrowRight,
  TrendingUp,
  Clock,
  Shield,
} from 'lucide-react';
import { fixturesApi } from '../api/fixturesApi';
import MatchPredictorModal from '../components/fixtures/MatchPredictorModal';
import TeamCrest from '../components/common/TeamCrest';

export default function Fixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [gameweek, setGameweek] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'FINISHED' | 'LIVE' | 'UPCOMING'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [isPredictorOpen, setIsPredictorOpen] = useState(false);
  const gwScrollRef = useRef(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      setLoading(true);
      try {
        const data = await fixturesApi.getAll({ gameweek, limit: 20 });
        setFixtures(data || []);
      } catch (err) {
        console.error('Failed to load fixtures:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFixtures();
  }, [gameweek]);

  // Center active gameweek pill in horizontal scroll
  useEffect(() => {
    if (gwScrollRef.current) {
      const activeBtn = gwScrollRef.current.querySelector(`[data-gw="${gameweek}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [gameweek]);

  const handlePredict = (fix) => {
    setSelectedFixture(fix);
    setIsPredictorOpen(true);
  };

  // Filter fixtures by status and search
  const filteredFixtures = useMemo(() => {
    return fixtures.filter((fix) => {
      // Status filter
      if (statusFilter === 'FINISHED' && fix.status !== 'FINISHED') return false;
      if (statusFilter === 'LIVE' && fix.status !== 'LIVE') return false;
      if (statusFilter === 'UPCOMING' && (fix.status === 'FINISHED' || fix.status === 'LIVE')) return false;

      // Club search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const homeMatch = fix.home_team_name?.toLowerCase().includes(q);
        const awayMatch = fix.away_team_name?.toLowerCase().includes(q);
        const venueMatch = fix.venue?.toLowerCase().includes(q);
        if (!homeMatch && !awayMatch && !venueMatch) return false;
      }

      return true;
    });
  }, [fixtures, statusFilter, searchQuery]);

  // Group filtered fixtures by Match Date
  const groupedFixtures = useMemo(() => {
    const groups = {};
    filteredFixtures.forEach((fix) => {
      const dateObj = new Date(fix.match_date);
      const dateKey = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : 'Scheduled Matchday';

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(fix);
    });
    return groups;
  }, [filteredFixtures]);

  // Gameweek aggregate statistics
  const gwStats = useMemo(() => {
    let totalGoals = 0;
    let finishedCount = 0;
    let liveCount = 0;
    let upcomingCount = 0;
    let highestScoringMatch = null;
    let maxGoalsInMatch = -1;

    fixtures.forEach((f) => {
      if (f.status === 'FINISHED') finishedCount++;
      else if (f.status === 'LIVE') liveCount++;
      else upcomingCount++;

      if (f.home_score !== null && f.away_score !== null) {
        const matchGoals = f.home_score + f.away_score;
        totalGoals += matchGoals;
        if (matchGoals > maxGoalsInMatch) {
          maxGoalsInMatch = matchGoals;
          highestScoringMatch = f;
        }
      }
    });

    return {
      totalGoals,
      finishedCount,
      liveCount,
      upcomingCount,
      highestScoringMatch,
    };
  }, [fixtures]);

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 w-full bg-[#fafbfc]">
      {/* 1. EDITORIAL HEADER & QUICK SEARCH */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-6 mb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-900 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>2026/27 Fixtures & Results • Gameweek {gameweek}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            Premier League Matches
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-xl">
            Live broadcast match centers, 2D tactical lineups, expected goals (xG), and AI match outcome simulations.
          </p>
        </div>

        {/* Club Search Filter */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search club or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* 2. GAMEWEEK CAROUSEL SELECTOR (GW 1 through GW 38) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs mb-6">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setGameweek((g) => Math.max(1, g - 1))}
            disabled={gameweek <= 1}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none text-slate-700 transition-colors flex-shrink-0"
            title="Previous Gameweek"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Horizontal Scrolling Gameweek Pills */}
          <div
            ref={gwScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth"
          >
            {Array.from({ length: 38 }, (_, i) => i + 1).map((gw) => {
              const isActive = gw === gameweek;
              return (
                <button
                  key={gw}
                  data-gw={gw}
                  onClick={() => setGameweek(gw)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-purple-900 text-white font-black shadow-xs scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  GW {gw}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setGameweek((g) => Math.min(38, g + 1))}
            disabled={gameweek >= 38}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none text-slate-700 transition-colors flex-shrink-0"
            title="Next Gameweek"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 3. GAMEWEEK METRICS SUMMARY BAR */}
      {fixtures.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Matches</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{fixtures.length} Fixtures</p>
            <span className="text-[11px] font-semibold text-slate-500">
              {gwStats.finishedCount} FT • {gwStats.upcomingCount} To Play
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Goals Scored</p>
            <p className="text-xl font-black text-emerald-600 mt-0.5">{gwStats.totalGoals} Goals</p>
            <span className="text-[11px] font-semibold text-slate-500">
              {gwStats.finishedCount > 0
                ? `${(gwStats.totalGoals / gwStats.finishedCount).toFixed(1)} avg / match`
                : 'Awaiting kickoff'}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Live Momentum</p>
            <p className="text-xl font-black text-purple-950 mt-0.5">
              {gwStats.liveCount > 0 ? `${gwStats.liveCount} Live Matches` : 'Gameweek Complete'}
            </p>
            <span className="text-[11px] font-semibold text-slate-500">
              {gwStats.liveCount > 0 ? 'Tracking real-time' : 'All match stats finalized'}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs truncate">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Highest Scoring</p>
            {gwStats.highestScoringMatch ? (
              <>
                <p className="text-sm font-black text-slate-900 mt-1 truncate">
                  {gwStats.highestScoringMatch.home_team_name} {gwStats.highestScoringMatch.home_score} -{' '}
                  {gwStats.highestScoringMatch.away_score} {gwStats.highestScoringMatch.away_team_name}
                </p>
                <span className="text-[10px] font-bold text-purple-700">
                  {gwStats.highestScoringMatch.home_score + gwStats.highestScoringMatch.away_score} Total Goals
                </span>
              </>
            ) : (
              <p className="text-sm font-bold text-slate-400 mt-1">Pending fixtures</p>
            )}
          </div>
        </div>
      )}

      {/* 4. STATUS FILTER PILLS */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="inline-flex p-1 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
          {[
            { id: 'ALL', label: `All (${fixtures.length})` },
            { id: 'FINISHED', label: `Full Time (${gwStats.finishedCount})` },
            { id: 'LIVE', label: `Live (${gwStats.liveCount})` },
            { id: 'UPCOMING', label: `Upcoming (${gwStats.upcomingCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === tab.id
                  ? 'bg-purple-900 text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Showing {filteredFixtures.length} matches for Gameweek {gameweek}
        </span>
      </div>

      {/* 5. FIXTURES LIST GROUPED BY DATE */}
      <div>
        {loading ? (
          <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80">
            <div className="w-10 h-10 border-3 border-purple-200 border-t-purple-900 rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Retrieving Official Matchday Slate...
            </p>
          </div>
        ) : filteredFixtures.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-2xs space-y-2">
            <p className="text-sm font-bold text-slate-700">
              No matches found matching your filters for Gameweek {gameweek}.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-black text-purple-700 hover:underline"
              >
                Clear search filter
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedFixtures).map(([dateLabel, matchList]) => (
              <div key={dateLabel} className="space-y-3">
                {/* Date Section Header */}
                <div className="flex items-center gap-2 px-1">
                  <Calendar size={14} className="text-purple-800" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    {dateLabel}
                  </h3>
                  <div className="h-[1px] flex-1 bg-slate-200/80 ml-2" />
                </div>

                {/* Match Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {matchList.map((fix) => {
                    const isFinished = fix.status === 'FINISHED';
                    const isLive = fix.status === 'LIVE';
                    const homeWon = isFinished && fix.home_score > fix.away_score;
                    const awayWon = isFinished && fix.away_score > fix.home_score;

                    return (
                      <div
                        key={fix.id}
                        className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-purple-300 hover:shadow-xs transition-all p-5 flex flex-col justify-between group"
                      >
                        {/* Card Header Meta */}
                        <div className="flex items-center justify-between text-xs font-bold pb-3 border-b border-slate-100">
                          <span className="text-slate-500 font-semibold truncate max-w-[200px]">
                            📍 {fix.venue || 'Premier League Stadium'}
                          </span>

                          <div className="flex items-center gap-2">
                            {/* xG pill if available */}
                            {fix.home_xg !== null && fix.away_xg !== null && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                xG {fix.home_xg.toFixed(1)} - {fix.away_xg.toFixed(1)}
                              </span>
                            )}

                            {isLive ? (
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 font-black rounded-md text-[10px] animate-pulse">
                                LIVE
                              </span>
                            ) : isFinished ? (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-black rounded-md text-[10px]">
                                FT
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-purple-50 text-purple-900 font-black rounded-md text-[10px] font-mono">
                                {new Date(fix.match_date).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Teams & Scoreboard Showdown */}
                        <div className="py-4 grid grid-cols-12 items-center gap-2">
                          {/* Home Club */}
                          <div className="col-span-5 flex items-center gap-3 min-w-0">
                            <TeamCrest
                              crestUrl={fix.home_crest}
                              teamName={fix.home_team_name}
                              className="w-9 h-9 object-contain flex-shrink-0"
                            />
                            <div className="min-w-0 truncate">
                              <p
                                className={`text-sm truncate ${
                                  homeWon ? 'font-black text-slate-900' : 'font-bold text-slate-800'
                                }`}
                              >
                                {fix.home_team_name}
                              </p>
                              <span className="text-[10px] font-semibold text-slate-400">Home</span>
                            </div>
                          </div>

                          {/* Center Scoreboard */}
                          <div className="col-span-2 text-center">
                            {fix.home_score !== null && fix.away_score !== null ? (
                              <div className="flex items-center justify-center gap-1.5 font-black text-2xl font-mono text-slate-900">
                                <span className={homeWon ? 'text-purple-950 font-black' : ''}>
                                  {fix.home_score}
                                </span>
                                <span className="text-slate-300">-</span>
                                <span className={awayWon ? 'text-purple-950 font-black' : ''}>
                                  {fix.away_score}
                                </span>
                              </div>
                            ) : (
                              <div className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black">
                                VS
                              </div>
                            )}
                          </div>

                          {/* Away Club */}
                          <div className="col-span-5 flex items-center justify-end gap-3 min-w-0 text-right">
                            <div className="min-w-0 truncate">
                              <p
                                className={`text-sm truncate ${
                                  awayWon ? 'font-black text-slate-900' : 'font-bold text-slate-800'
                                }`}
                              >
                                {fix.away_team_name}
                              </p>
                              <span className="text-[10px] font-semibold text-slate-400">Away</span>
                            </div>
                            <TeamCrest
                              crestUrl={fix.away_crest}
                              teamName={fix.away_team_name}
                              className="w-9 h-9 object-contain flex-shrink-0"
                            />
                          </div>
                        </div>

                        {/* Card Actions: PremierZone Match Center & Simulator */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                          <Link
                            to={`/match/${fix.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-black text-white bg-purple-900 hover:bg-purple-950 px-4 py-2 rounded-xl transition-colors shadow-2xs"
                          >
                            <Trophy size={13} className="text-purple-300" />
                            <span>Match Center</span>
                            <ArrowRight size={12} />
                          </Link>

                          <button
                            onClick={() => handlePredict(fix)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl border border-purple-200/80 transition-colors"
                          >
                            <Sparkles size={13} className="text-purple-700" />
                            <span>AI Predictor</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Match Predictor Modal */}
      <MatchPredictorModal
        isOpen={isPredictorOpen}
        onClose={() => setIsPredictorOpen(false)}
        fixture={selectedFixture}
      />
    </div>
  );
}
