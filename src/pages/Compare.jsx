import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Trophy, ArrowRight, Sparkles, Scale, CheckCircle2 } from 'lucide-react';
import RadarChart from '../components/comparison/RadarChart';
import PlayerAvatar from '../components/common/PlayerAvatar';
import { playersApi } from '../api/playersApi';

export default function Compare() {
  const [playerList, setPlayerList] = useState([]);
  const [p1Id, setP1Id] = useState('');
  const [p2Id, setP2Id] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load top players for quick dropdown selection
    const loadInitialPlayers = async () => {
      try {
        const res = await playersApi.getAll({ limit: 100, ordering: '-goals' });
        const list = res.results || [];
        setPlayerList(list);
        if (list.length >= 2) {
          setP1Id(list[0].id);
          setP2Id(list[1].id);
        }
      } catch (err) {
        console.error("Failed to load initial players for comparison:", err);
      }
    };
    loadInitialPlayers();
  }, []);

  useEffect(() => {
    if (p1Id && p2Id && p1Id !== p2Id) {
      const fetchComparison = async () => {
        setLoading(true);
        try {
          const data = await playersApi.compare(p1Id, p2Id);
          setComparison(data);
        } catch (err) {
          console.error("Comparison fetch failed:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchComparison();
    }
  }, [p1Id, p2Id]);

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto relative">
      {/* Background blobs */}
      <div className="blob w-[350px] h-[350px] bg-purple-200/30 top-[-5%] left-[-5%]"></div>
      <div className="blob w-[350px] h-[350px] bg-emerald-100/30 bottom-[-5%] right-[-5%]"></div>

      {/* Header */}
      <div className="border-b border-slate-200/60 pb-8 mb-8 relative z-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100">
          <Scale size={14} className="text-purple-700" />
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-950">
            Scouting Intelligence
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
          Head-to-Head Comparison
        </h1>
        <p className="text-xs md:text-sm font-semibold text-slate-500 max-w-xl">
          Compare Premier League stars side-by-side using scouting radar charts, per-90 metrics, and league-wide percentile rankings.
        </p>
      </div>

      {/* Player Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 relative z-10">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-purple-700 flex-shrink-0"></span>
          <select
            value={p1Id}
            onChange={(e) => setP1Id(e.target.value)}
            className="w-full bg-transparent font-black text-sm text-slate-800 focus:outline-none cursor-pointer"
          >
            {playerList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.player_name} ({p.team_name} • {p.position})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0"></span>
          <select
            value={p2Id}
            onChange={(e) => setP2Id(e.target.value)}
            className="w-full bg-transparent font-black text-sm text-slate-800 focus:outline-none cursor-pointer"
          >
            {playerList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.player_name} ({p.team_name} • {p.position})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Body */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-12 h-12 border-3 border-purple-200 border-t-purple-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Analyzing Scouting Profiles...
          </p>
        </div>
      ) : comparison ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Radar Chart Visual (Grid 5) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-6">
              Attribute Radar Analysis
            </h3>
            <RadarChart
              p1Data={comparison.player1.radar}
              p2Data={comparison.player2.radar}
              p1Name={comparison.player1.name}
              p2Name={comparison.player2.name}
            />

            {/* Overall Rating Badges */}
            <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-6 border-t border-slate-100">
              <div className="text-center p-3 bg-purple-50 rounded-2xl border border-purple-100">
                <p className="text-2xl font-black text-purple-950">
                  {comparison.player1.radar?.overall_rating || '7.5'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Scout Rating</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-2xl font-black text-emerald-950">
                  {comparison.player2.radar?.overall_rating || '7.5'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Scout Rating</p>
              </div>
            </div>
          </div>

          {/* Metric Comparison Table (Grid 7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              {/* Player 1 Card Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex items-end justify-center flex-shrink-0">
                  <PlayerAvatar
                    photoUrl={comparison.player1.photo_url}
                    name={comparison.player1.name}
                  />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">{comparison.player1.name}</p>
                  <p className="text-[10px] font-bold text-slate-400">{comparison.player1.team}</p>
                </div>
              </div>

              <span className="text-xs font-black text-slate-300">VS</span>

              {/* Player 2 Card Header */}
              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="text-sm font-black text-slate-800">{comparison.player2.name}</p>
                  <p className="text-[10px] font-bold text-slate-400">{comparison.player2.team}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex items-end justify-center flex-shrink-0">
                  <PlayerAvatar
                    photoUrl={comparison.player2.photo_url}
                    name={comparison.player2.name}
                  />
                </div>
              </div>

            </div>

            {/* Metrics List */}
            <div className="divide-y divide-slate-100">
              {comparison.metrics?.map((m) => (
                <div key={m.key} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  {/* P1 Value */}
                  <div className="w-24">
                    <span
                      className={`text-sm font-black ${
                        m.winner === 'player1' ? 'text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg' : 'text-slate-600'
                      }`}
                    >
                      {m.p1}
                    </span>
                  </div>

                  {/* Metric Label */}
                  <div className="text-center flex-1">
                    <span className="text-xs font-extrabold text-slate-700">{m.label}</span>
                  </div>

                  {/* P2 Value */}
                  <div className="w-24 text-right">
                    <span
                      className={`text-sm font-black ${
                        m.winner === 'player2' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg' : 'text-slate-600'
                      }`}
                    >
                      {m.p2}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
