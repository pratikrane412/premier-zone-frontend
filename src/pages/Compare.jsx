import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  Search,
  ArrowLeftRight,
  Sparkles,
  Trophy,
  X,
  Check,
  ChevronRight,
  Flame,
  Award,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react';
import RadarChart from '../components/comparison/RadarChart';
import PlayerAvatar from '../components/common/PlayerAvatar';
import TeamCrest from '../components/common/TeamCrest';
import { playersApi } from '../api/playersApi';

const MARQUEE_SHOWDOWNS = [
  { label: 'Haaland vs Salah', p1Search: 'Haaland', p2Search: 'Salah', tag: 'Golden Boot Titans' },
  { label: 'Palmer vs Saka', p1Search: 'Palmer', p2Search: 'Saka', tag: 'Creative Prodigies' },
  { label: 'Saliba vs Van Dijk', p1Search: 'Saliba', p2Search: 'van Dijk', tag: 'Center-Back Masters' },
  { label: 'Raya vs Alisson', p1Search: 'Raya', p2Search: 'Alisson', tag: 'Golden Glove Duel' },
  { label: 'Rice vs Rodri', p1Search: 'Rice', p2Search: 'Rodri', tag: 'Midfield Anchors' },
  { label: 'Foden vs Son', p1Search: 'Foden', p2Search: 'Son', tag: 'Attack Architects' },
];

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [playerList, setPlayerList] = useState([]);
  const [p1Id, setP1Id] = useState('');
  const [p2Id, setP2Id] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Player Selection Modal State
  const [activeModalSlot, setActiveModalSlot] = useState(null); // 'player1' | 'player2' | null
  const [modalSearch, setModalSearch] = useState('');
  const [modalClub, setModalClub] = useState('ALL');
  const [modalPosition, setModalPosition] = useState('ALL');
  const [modalPlayers, setModalPlayers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Load initial players list & resolve URL query params
  useEffect(() => {
    const init = async () => {
      setInitialLoading(true);
      try {
        const res = await playersApi.getAll({ limit: 120, ordering: '-goals' });
        const list = res.results || [];
        setPlayerList(list);

        const urlP1 = searchParams.get('player1');
        const urlP2 = searchParams.get('player2');

        if (urlP1 && urlP2) {
          setP1Id(urlP1);
          setP2Id(urlP2);
        } else if (urlP1 && list.length > 0) {
          setP1Id(urlP1);
          const fallbackP2 = list.find((p) => String(p.id) !== String(urlP1));
          if (fallbackP2) setP2Id(fallbackP2.id);
        } else if (list.length >= 2) {
          setP1Id(list[0].id);
          setP2Id(list[1].id);
        }
      } catch (err) {
        console.error('Failed to load initial players for comparison:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, []);

  // Fetch comparison whenever p1Id or p2Id change
  useEffect(() => {
    if (p1Id && p2Id && String(p1Id) !== String(p2Id)) {
      setSearchParams({ player1: p1Id, player2: p2Id }, { replace: true });
      const fetchComparison = async () => {
        setLoading(true);
        try {
          const data = await playersApi.compare(p1Id, p2Id);
          setComparison(data);
        } catch (err) {
          console.error('Comparison fetch failed:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchComparison();
    }
  }, [p1Id, p2Id]);

  // Load players inside the Search Modal
  useEffect(() => {
    if (!activeModalSlot) return;

    const fetchModalPlayers = async () => {
      setModalLoading(true);
      try {
        const res = await playersApi.getAll({
          search: modalSearch.trim(),
          team: modalClub === 'ALL' ? '' : modalClub,
          position: modalPosition === 'ALL' ? '' : modalPosition,
          limit: 60,
          ordering: '-rating',
        });
        setModalPlayers(res.results || []);
      } catch (err) {
        console.error('Modal search failed:', err);
      } finally {
        setModalLoading(false);
      }
    };

    const timer = setTimeout(fetchModalPlayers, 180);
    return () => clearTimeout(timer);
  }, [activeModalSlot, modalSearch, modalClub, modalPosition]);

  // Handle swapping sides
  const handleSwap = () => {
    const temp = p1Id;
    setP1Id(p2Id);
    setP2Id(temp);
  };

  // Handle quick showdown selection
  const handleSelectShowdown = async (showdown) => {
    try {
      const [res1, res2] = await Promise.all([
        playersApi.getAll({ search: showdown.p1Search, limit: 3 }),
        playersApi.getAll({ search: showdown.p2Search, limit: 3 }),
      ]);
      const p1 = res1.results?.[0];
      const p2 = res2.results?.[0];

      if (p1 && p2 && p1.id !== p2.id) {
        setP1Id(p1.id);
        setP2Id(p2.id);
      }
    } catch (err) {
      console.error('Error applying marquee showdown:', err);
    }
  };

  // Pick player from modal
  const handleSelectPlayerFromModal = (player) => {
    if (activeModalSlot === 'player1') {
      if (String(player.id) === String(p2Id)) {
        handleSwap();
      } else {
        setP1Id(player.id);
      }
    } else if (activeModalSlot === 'player2') {
      if (String(player.id) === String(p1Id)) {
        handleSwap();
      } else {
        setP2Id(player.id);
      }
    }
    setActiveModalSlot(null);
  };

  // Calculate winner score tally
  const tally = useMemo(() => {
    if (!comparison?.metrics) return { p1Wins: 0, p2Wins: 0, ties: 0 };
    let p1Wins = 0;
    let p2Wins = 0;
    let ties = 0;
    comparison.metrics.forEach((m) => {
      if (m.winner === 'player1') p1Wins++;
      else if (m.winner === 'player2') p2Wins++;
      else ties++;
    });
    return { p1Wins, p2Wins, ties };
  }, [comparison]);

  // Extract unique clubs for modal dropdown
  const uniqueClubs = useMemo(() => {
    const clubs = new Set();
    playerList.forEach((p) => {
      if (p.team_name) clubs.add(p.team_name);
    });
    return Array.from(clubs).sort();
  }, [playerList]);

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 w-full relative">
      {/* Editorial Header */}
      <div className="border-b border-slate-200/80 pb-6 mb-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 shadow-xs">
            <Scale size={13} className="text-purple-700" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-950">
              Scouting Intelligence Lab
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            Head-to-Head Comparison
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500 max-w-2xl">
            Contrast Premier League athletes side-by-side using high-precision radar charts, per-90 distributions, and league-wide percentile rankings.
          </p>
        </div>

        {/* Quick Return to Directory */}
        <Link
          to="/players"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 text-xs font-black text-slate-700 hover:text-purple-950 shadow-xs transition-colors self-start md:self-auto"
        >
          <span>Browse All Players</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Marquee Rivalry Showdowns Strip */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Flame size={14} className="text-rose-600" />
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
            Featured Premier League Rivalries
          </span>
        </div>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {MARQUEE_SHOWDOWNS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleSelectShowdown(item)}
              className="flex-shrink-0 px-3.5 py-2 rounded-2xl bg-white hover:bg-purple-50/70 border border-slate-200/90 hover:border-purple-300 text-left transition-all duration-200 shadow-xs hover:shadow-sm group"
            >
              <div className="text-[11px] font-black text-slate-900 group-hover:text-purple-950 flex items-center gap-1.5">
                <span>{item.label}</span>
                <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md group-hover:bg-purple-100">
                  {item.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Player Selection Cards & VS Centerpiece */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-8 relative z-10">
        {/* Player 1 Card (Purple) */}
        <div className="md:col-span-5 bg-white rounded-3xl p-5 border-2 border-purple-200/80 shadow-sm relative overflow-hidden flex items-center justify-between gap-4">
          <div className="absolute top-0 left-0 w-2 h-full bg-purple-700" />
          <div className="flex items-center gap-4 pl-2 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-50 border border-purple-200 overflow-hidden flex items-end justify-center flex-shrink-0 shadow-inner">
              <PlayerAvatar
                photoUrl={comparison?.player1?.photo_url}
                name={comparison?.player1?.name || 'Player 1'}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200">
                  {comparison?.player1?.position || 'POS'}
                </span>
                <span className="text-[10px] font-bold text-slate-400 truncate">
                  {comparison?.player1?.team}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 truncate leading-snug">
                {comparison?.player1?.name || 'Select Player 1'}
              </h3>
              <p className="text-xs font-black text-purple-900 mt-0.5">
                ★ {comparison?.player1?.radar?.overall_rating || '7.5'} Rating
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModalSlot('player1');
              setModalSearch('');
            }}
            className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-black text-xs flex items-center gap-1.5 transition-colors flex-shrink-0 border border-purple-200"
          >
            <Search size={13} />
            <span>Change</span>
          </button>
        </div>

        {/* Center Swap & VS Badge */}
        <div className="md:col-span-2 flex flex-col items-center justify-center gap-2">
          <button
            onClick={handleSwap}
            title="Swap Player Sides"
            className="w-11 h-11 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 shadow-sm flex items-center justify-center text-slate-700 hover:text-purple-950 transition-all duration-200 group active:scale-95"
          >
            <ArrowLeftRight size={18} className="group-hover:rotate-180 transition-transform duration-300" />
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            VS
          </span>
        </div>

        {/* Player 2 Card (Emerald) */}
        <div className="md:col-span-5 bg-white rounded-3xl p-5 border-2 border-emerald-200/80 shadow-sm relative overflow-hidden flex items-center justify-between gap-4">
          <div className="absolute top-0 right-0 w-2 h-full bg-emerald-600" />
          <div className="flex items-center gap-4 pr-2 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 border border-emerald-200 overflow-hidden flex items-end justify-center flex-shrink-0 shadow-inner">
              <PlayerAvatar
                photoUrl={comparison?.player2?.photo_url}
                name={comparison?.player2?.name || 'Player 2'}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200">
                  {comparison?.player2?.position || 'POS'}
                </span>
                <span className="text-[10px] font-bold text-slate-400 truncate">
                  {comparison?.player2?.team}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 truncate leading-snug">
                {comparison?.player2?.name || 'Select Player 2'}
              </h3>
              <p className="text-xs font-black text-emerald-800 mt-0.5">
                ★ {comparison?.player2?.radar?.overall_rating || '7.5'} Rating
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModalSlot('player2');
              setModalSearch('');
            }}
            className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-black text-xs flex items-center gap-1.5 transition-colors flex-shrink-0 border border-emerald-200"
          >
            <Search size={13} />
            <span>Change</span>
          </button>
        </div>
      </div>

      {/* Main Scouting Visualizations */}
      {loading ? (
        <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <div className="w-12 h-12 border-3 border-purple-200 border-t-purple-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Synthesizing Head-to-Head Scouting Matrices...
          </p>
        </div>
      ) : comparison ? (
        <div className="space-y-8 relative z-10">
          {/* Winner Tally & Editorial Verdict Strip */}
          <div className="bg-gradient-to-r from-purple-50 via-white to-emerald-50 rounded-3xl p-5 md:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-white border border-purple-200 text-purple-950 flex items-center justify-center shadow-xs flex-shrink-0">
                <Trophy size={22} className="text-amber-500" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Scouting Edge Breakdown
                </span>
                <p className="text-sm md:text-base font-extrabold text-slate-900">
                  {tally.p1Wins > tally.p2Wins ? (
                    <span>
                      <strong className="text-purple-900">{comparison.player1.name}</strong> leads in{' '}
                      <strong>{tally.p1Wins}</strong> statistical categories ({tally.p2Wins} for {comparison.player2.name})
                    </span>
                  ) : tally.p2Wins > tally.p1Wins ? (
                    <span>
                      <strong className="text-emerald-700">{comparison.player2.name}</strong> leads in{' '}
                      <strong>{tally.p2Wins}</strong> statistical categories ({tally.p1Wins} for {comparison.player1.name})
                    </span>
                  ) : (
                    <span>Deadlock: Both players lead in <strong>{tally.p1Wins}</strong> categories each</span>
                  )}
                </p>
              </div>
            </div>

            {/* Scoreboard Badges */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-purple-700 text-white font-black text-sm shadow-xs flex items-center gap-2">
                <span>{comparison.player1.name.split(' ').pop()}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">{tally.p1Wins}</span>
              </div>
              <span className="text-xs font-black text-slate-400">VS</span>
              <div className="px-4 py-2 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-xs flex items-center gap-2">
                <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">{tally.p2Wins}</span>
                <span>{comparison.player2.name.split(' ').pop()}</span>
              </div>
            </div>
          </div>

          {/* Grid Layout: Radar Chart & Attribute Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Attribute Radar Card (Left 5 Cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-purple-700" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    5-Axis Attribute Radar
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400">Normalized Scale 0–100</span>
              </div>

              {/* The SVG Radar */}
              <div className="my-2">
                <RadarChart
                  p1Data={comparison.player1.radar}
                  p2Data={comparison.player2.radar}
                  p1Name={comparison.player1.name}
                  p2Name={comparison.player2.name}
                />
              </div>

              {/* Radar Breakdown Metrics Table */}
              <div className="w-full mt-6 space-y-2 border-t border-slate-100 pt-5">
                {[
                  { key: 'shooting', label: 'Shooting & Finishing' },
                  { key: 'creation', label: 'Chance Creation & xA' },
                  { key: 'participation', label: 'Match Participation' },
                  { key: 'discipline', label: 'Discipline & Clean Play' },
                  { key: 'efficiency', label: 'Goal Conversion Efficiency' },
                ].map((cat) => {
                  const val1 = comparison.player1.radar?.[cat.key] || 50;
                  const val2 = comparison.player2.radar?.[cat.key] || 50;
                  const leader = val1 > val2 ? 'p1' : val2 > val1 ? 'p2' : 'tie';

                  return (
                    <div
                      key={cat.key}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 text-xs font-bold"
                    >
                      <span className={`w-12 text-left font-black ${leader === 'p1' ? 'text-purple-700' : 'text-slate-600'}`}>
                        {val1}
                      </span>
                      <span className="text-slate-600 text-center flex-1 text-[11px] font-semibold">
                        {cat.label}
                      </span>
                      <span className={`w-12 text-right font-black ${leader === 'p2' ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {val2}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Overall Ratings Footer */}
              <div className="grid grid-cols-2 gap-3 w-full mt-5 pt-4 border-t border-slate-100">
                <div className="text-center p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
                  <p className="text-2xl font-black text-purple-950">
                    {comparison.player1.radar?.overall_rating || '7.5'}
                  </p>
                  <p className="text-[10px] font-bold text-purple-800 uppercase mt-0.5 tracking-wider">
                    {comparison.player1.name.split(' ').pop()} Scout Index
                  </p>
                </div>
                <div className="text-center p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100">
                  <p className="text-2xl font-black text-emerald-950">
                    {comparison.player2.radar?.overall_rating || '7.5'}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-800 uppercase mt-0.5 tracking-wider">
                    {comparison.player2.name.split(' ').pop()} Scout Index
                  </p>
                </div>
              </div>
            </div>

            {/* Metric-by-Metric Head-to-Head Bars (Right 7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                {/* Player 1 Mini Heading */}
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-700" />
                  <span className="text-xs font-black text-slate-800">
                    {comparison.player1.name}
                  </span>
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Official Statistics
                </span>

                {/* Player 2 Mini Heading */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-800">
                    {comparison.player2.name}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                </div>
              </div>

              {/* Metrics Rows with Comparative Proportion Bars */}
              <div className="divide-y divide-slate-100 p-4 space-y-4">
                {comparison.metrics?.map((m) => {
                  const maxVal = Math.max(m.p1, m.p2, 0.1);
                  const p1Pct = Math.min(100, Math.round((m.p1 / maxVal) * 100));
                  const p2Pct = Math.min(100, Math.round((m.p2 / maxVal) * 100));

                  return (
                    <div key={m.key} className="pt-3 first:pt-0">
                      {/* Metric Numbers & Label */}
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="w-24 flex items-center gap-1.5">
                          <span
                            className={`text-sm font-black ${
                              m.winner === 'player1'
                                ? 'text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200'
                                : 'text-slate-600'
                            }`}
                          >
                            {m.p1}
                          </span>
                          {m.winner === 'player1' && (
                            <span className="text-[9px] font-extrabold text-purple-700 uppercase">
                              EDGE
                            </span>
                          )}
                        </div>

                        <div className="text-center flex-1">
                          <span className="text-xs font-extrabold text-slate-700">
                            {m.label}
                          </span>
                        </div>

                        <div className="w-24 flex items-center justify-end gap-1.5">
                          {m.winner === 'player2' && (
                            <span className="text-[9px] font-extrabold text-emerald-700 uppercase">
                              EDGE
                            </span>
                          )}
                          <span
                            className={`text-sm font-black ${
                              m.winner === 'player2'
                                ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200'
                                : 'text-slate-600'
                            }`}
                          >
                            {m.p2}
                          </span>
                        </div>
                      </div>

                      {/* Dual Horizontal Progress Bars */}
                      <div className="grid grid-cols-2 gap-1 h-2 rounded-full overflow-hidden bg-slate-100">
                        {/* Player 1 Bar (Fills from Right to Left) */}
                        <div className="flex justify-end">
                          <div
                            className={`h-full rounded-l-full transition-all duration-500 ${
                              m.winner === 'player1' ? 'bg-purple-700' : 'bg-purple-300'
                            }`}
                            style={{ width: `${p1Pct}%` }}
                          />
                        </div>

                        {/* Player 2 Bar (Fills from Left to Right) */}
                        <div className="flex justify-start">
                          <div
                            className={`h-full rounded-r-full transition-all duration-500 ${
                              m.winner === 'player2' ? 'bg-emerald-600' : 'bg-emerald-300'
                            }`}
                            style={{ width: `${p2Pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* League Percentile Rankings (If Available) */}
              {comparison.player1?.percentiles && comparison.player2?.percentiles && (
                <div className="border-t border-slate-200/80 p-5 bg-slate-50/40">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={14} className="text-purple-700" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Premier League Percentile Distribution
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {[
                      { key: 'goals', label: 'Goals Percentile' },
                      { key: 'assists', label: 'Assists Percentile' },
                      { key: 'goals_per_90', label: 'Goals/90 Percentile' },
                      { key: 'rating', label: 'Overall Rating Percentile' },
                    ].map((p) => {
                      const p1Rank = comparison.player1.percentiles[p.key] || 50;
                      const p2Rank = comparison.player2.percentiles[p.key] || 50;

                      return (
                        <div key={p.key} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-purple-900 font-black">{p1Rank}th</span>
                            <span className="text-slate-500 font-semibold">{p.label}</span>
                            <span className="text-emerald-700 font-black">{p2Rank}th</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 h-1.5 rounded-full overflow-hidden bg-slate-200">
                            <div className="flex justify-end">
                              <div
                                className="h-full bg-purple-600 rounded-l-full transition-all duration-500"
                                style={{ width: `${p1Rank}%` }}
                              />
                            </div>
                            <div className="flex justify-start">
                              <div
                                className="h-full bg-emerald-500 rounded-r-full transition-all duration-500"
                                style={{ width: `${p2Rank}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Interactive Player Selector Modal */}
      <AnimatePresence>
        {activeModalSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalSlot(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Select {activeModalSlot === 'player1' ? 'Player 1' : 'Player 2'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    Search and pick any active Premier League athlete
                  </p>
                </div>
                <button
                  onClick={() => setActiveModalSlot(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Filters */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search player name (e.g. Haaland, Saka, Palmer)..."
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    autoFocus
                    className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 transition-colors shadow-xs"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Position Filters */}
                  <div className="flex gap-1">
                    {['ALL', 'GK', 'DF', 'MF', 'FW'].map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setModalPosition(pos)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-colors ${
                          modalPosition === pos
                            ? 'bg-purple-950 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>

                  {/* Club Filter */}
                  <select
                    value={modalClub}
                    onChange={(e) => setModalClub(e.target.value)}
                    className="text-[10px] font-black text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-xl focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All 20 Clubs</option>
                    {uniqueClubs.map((club) => (
                      <option key={club} value={club}>
                        {club}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Player Results List */}
              <div className="overflow-y-auto p-4 divide-y divide-slate-100 flex-1">
                {modalLoading ? (
                  <div className="py-12 text-center text-xs font-bold text-slate-400">
                    Scanning players...
                  </div>
                ) : modalPlayers.length === 0 ? (
                  <div className="py-12 text-center text-xs font-bold text-slate-400">
                    No players found matching your criteria.
                  </div>
                ) : (
                  modalPlayers.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => handleSelectPlayerFromModal(player)}
                      className="w-full p-3 rounded-2xl hover:bg-purple-50/60 transition-colors flex items-center justify-between text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-end justify-center flex-shrink-0">
                          <PlayerAvatar photoUrl={player.photo_url} name={player.player_name} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate group-hover:text-purple-950">
                            {player.player_name}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-0.5">
                            <span className="font-black text-purple-900">{player.position}</span>
                            <span>•</span>
                            <span>{player.team_name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <p className="text-xs font-black text-slate-800">£{player.market_value_eur}M</p>
                          <p className="text-[10px] font-bold text-amber-500">★ {player.rating}</p>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-purple-950 group-hover:text-white flex items-center justify-center transition-colors">
                          <Check size={13} />
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
