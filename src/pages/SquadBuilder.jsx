import React, { useState, useMemo } from 'react';
import {
  Shield,
  Save,
  Share2,
  RotateCcw,
  CheckCircle2,
  Compass,
  AlertTriangle,
  Zap,
  ExternalLink,
} from 'lucide-react';
import TacticalPitch from '../components/squad/TacticalPitch';
import PlayerSelectModal from '../components/squad/PlayerSelectModal';
import PlayerAvatar from '../components/common/PlayerAvatar';
import { FORMATIONS } from '../utils/formations';
import { squadsApi } from '../api/squadsApi';
import { playersApi } from '../api/playersApi';
import { useAuth } from '../context/AuthContext';

export default function SquadBuilder() {
  const { user } = useAuth();
  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup] = useState({});
  const [captainId, setCaptainId] = useState(null);
  const [activeSlot, setActiveSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [squadName, setSquadName] = useState('My Premier Dream XI');
  const [saving, setSaving] = useState(false);
  const [autoPicking, setAutoPicking] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [shareLink, setShareLink] = useState('');

  const slots = FORMATIONS[formation] || FORMATIONS['4-3-3'];
  const BUDGET_CAP = 100.0;

  // Selected player objects
  const selectedPlayers = Object.values(lineup).filter(Boolean);

  // Live Budget Calculations
  const totalValue = selectedPlayers.reduce((sum, p) => sum + (p.market_value_eur || 0), 0);
  const remainingBudget = Math.max(0, BUDGET_CAP - totalValue);
  const isOverBudget = totalValue > BUDGET_CAP;

  // Aggregate Squad Performance Metrics
  const totalGoals = selectedPlayers.reduce((sum, p) => sum + (p.goals || 0), 0);
  const totalAssists = selectedPlayers.reduce((sum, p) => sum + (p.assists || 0), 0);
  const avgRating = selectedPlayers.length
    ? (selectedPlayers.reduce((sum, p) => sum + (p.rating || 7.0), 0) / selectedPlayers.length).toFixed(1)
    : '0.0';

  // Club representation breakdown (enforcing max 3 per club rule)
  const clubBreakdown = useMemo(() => {
    const counts = {};
    selectedPlayers.forEach((p) => {
      if (p.team_name) {
        counts[p.team_name] = (counts[p.team_name] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [selectedPlayers]);

  // Position distribution counter
  const positionCounts = useMemo(() => {
    const counts = { GK: 0, DF: 0, MF: 0, FW: 0 };
    selectedPlayers.forEach((p) => {
      const pos = p.position?.toUpperCase();
      if (counts[pos] !== undefined) counts[pos]++;
    });
    return counts;
  }, [selectedPlayers]);

  // Find captain player object
  const captainPlayer = selectedPlayers.find((p) => p.id === captainId);

  // Handle clicking a slot on the pitch
  const handleSlotClick = (slot) => {
    setActiveSlot(slot);
    setIsModalOpen(true);
  };

  // Assign player to active slot
  const handleSelectPlayer = (player) => {
    if (!activeSlot) return;
    setLineup((prev) => ({
      ...prev,
      [activeSlot.id]: player,
    }));

    // Auto-assign first player as captain if not set
    if (!captainId) setCaptainId(player.id);
    setIsModalOpen(false);
    setActiveSlot(null);
  };

  // Remove player from slot
  const handleRemovePlayer = (slotId) => {
    setLineup((prev) => {
      const copy = { ...prev };
      const removed = copy[slotId];
      delete copy[slotId];
      if (removed && removed.id === captainId) {
        const remaining = Object.values(copy).filter(Boolean);
        setCaptainId(remaining.length > 0 ? remaining[0].id : null);
      }
      return copy;
    });
  };

  // Set / toggle captaincy
  const handleToggleCaptain = (playerId) => {
    if (playerId) setCaptainId(playerId);
  };

  // Reset entire pitch
  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear your entire Starting XI?')) {
      setLineup({});
      setCaptainId(null);
      setFeedback(null);
      setShareLink('');
    }
  };

  // Auto-Pick Best XI feature (fills all 11 slots respecting budget & club constraints)
  const handleAutoPick = async () => {
    setAutoPicking(true);
    setFeedback(null);
    try {
      const res = await playersApi.getAll({ limit: 100, ordering: '-rating' });
      const pool = res.results || [];

      const newLineup = {};
      const pickedIds = new Set();
      const clubUsage = {};
      let currentSpent = 0;

      // Fill each slot in the active formation
      for (const slot of slots) {
        const neededPos = slot.position;
        // Eligible candidates matching position, not yet picked, within budget, and under 3-club rule
        const candidate = pool.find((p) => {
          if (pickedIds.has(p.id)) return false;
          if (p.position !== neededPos) return false;
          const cost = p.market_value_eur || 5.0;
          if (currentSpent + cost > BUDGET_CAP) return false;
          const clubCount = clubUsage[p.team_name] || 0;
          if (clubCount >= 3) return false;
          return true;
        });

        if (candidate) {
          newLineup[slot.id] = candidate;
          pickedIds.add(candidate.id);
          clubUsage[candidate.team_name] = (clubUsage[candidate.team_name] || 0) + 1;
          currentSpent += candidate.market_value_eur || 5.0;
        }
      }

      setLineup(newLineup);
      const playersList = Object.values(newLineup);
      if (playersList.length > 0) {
        setCaptainId(playersList[0].id);
      }
      setFeedback({
        type: 'success',
        text: `Auto-picked ${playersList.length} top-rated players within £${currentSpent.toFixed(1)}M!`,
      });
    } catch (err) {
      console.error('Auto-pick error:', err);
      setFeedback({ type: 'error', text: 'Could not auto-fill lineup. Please pick manually.' });
    } finally {
      setAutoPicking(false);
    }
  };

  // Save lineup to backend API
  const handleSaveSquad = async () => {
    if (selectedPlayers.length === 0) {
      setFeedback({ type: 'error', text: 'Please recruit players to your Starting XI first.' });
      return;
    }
    if (selectedPlayers.length < 11) {
      setFeedback({
        type: 'error',
        text: `Your lineup only has ${selectedPlayers.length}/11 players. Please complete your Starting XI.`,
      });
      return;
    }
    if (isOverBudget) {
      setFeedback({
        type: 'error',
        text: `Squad value (£${totalValue.toFixed(1)}M) exceeds the £${BUDGET_CAP}.0M salary cap!`,
      });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const formattedLineup = Object.entries(lineup).map(([slotId, player]) => {
      const slotDef = slots.find((s) => s.id === slotId) || { x: 50, y: 50 };
      return {
        player_id: player.id,
        pitch_position: slotId,
        grid_x: slotDef.x,
        grid_y: slotDef.y,
        is_captain: player.id === captainId,
      };
    });

    try {
      const payload = {
        name: squadName,
        formation,
        budget_cap: BUDGET_CAP,
        lineup: formattedLineup,
      };
      const res = await squadsApi.create(payload);
      const url = `${window.location.origin}/squad/shared/${res.share_code}`;
      setShareLink(url);
      setFeedback({
        type: 'success',
        text: `Squad successfully locked! Public share code: ${res.share_code}`,
      });
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to save squad.';
      setFeedback({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 w-full bg-[#fafbfc]">
      {/* 1. EDITORIAL HEADER & FORMATION COMMAND BAR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-6 mb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-900 text-xs font-bold">
            <Compass size={14} className="text-purple-700" />
            <span>2026/27 Tactics Studio • Official Rules</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            Tactical Squad Builder
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-xl">
            Recruit your Premier League Starting XI within a strict £100.0M salary cap and maximum 3
            players per club. Assign your Captain for 2x points.
          </p>
        </div>

        {/* Formation Pills & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Formation Selector Pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            {Object.keys(FORMATIONS).map((f) => (
              <button
                key={f}
                onClick={() => {
                  if (f !== formation) {
                    setFormation(f);
                    setLineup({});
                    setCaptainId(null);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  formation === f
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Auto-Pick XI Button */}
          <button
            onClick={handleAutoPick}
            disabled={autoPicking}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold text-xs border border-purple-200 transition-colors shadow-2xs disabled:opacity-50"
            title="Auto-fill best available players within budget"
          >
            <Zap size={14} className="text-purple-700" />
            <span>{autoPicking ? 'Drafting...' : 'Auto-Pick XI'}</span>
          </button>

          {/* Reset Pitch Button */}
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 shadow-2xs transition-colors"
            title="Clear all players from pitch"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: PITCH (LEFT) & INTELLIGENCE CONSOLE (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 2D Tactical Football Pitch (Col span 7) */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-4">
          <TacticalPitch
            slots={slots}
            lineup={lineup}
            captainId={captainId}
            onSlotClick={handleSlotClick}
            onRemovePlayer={handleRemovePlayer}
            onToggleCaptain={handleToggleCaptain}
          />

          {/* Position Distribution & Instructions Bar */}
          <div className="w-full max-w-[620px] bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs flex items-center justify-between text-xs font-bold text-slate-600 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>GK: {positionCounts.GK}/1</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>DF: {positionCounts.DF}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>MF: {positionCounts.MF}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span>FW: {positionCounts.FW}</span>
              </span>
            </div>

            <span className="text-[11px] text-slate-400 font-semibold">
              Tap (C) to set Captain
            </span>
          </div>
        </div>

        {/* Right Column: Tactical Intelligence, Budget & Rules Console (Col span 5) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: Squad Identity & Captain Spotlight */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Squad Name
              </label>
              <input
                type="text"
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                placeholder="Name your Starting XI..."
                className="w-full text-base font-black text-slate-900 border-b-2 border-purple-100 focus:border-purple-700 pb-1 focus:outline-none transition-colors"
              />
            </div>

            {/* Captain Spotlight */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {captainPlayer ? (
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-end justify-center">
                      <PlayerAvatar
                        photoUrl={captainPlayer.photo_url}
                        name={captainPlayer.player_name}
                        position={captainPlayer.position}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center border border-amber-300">
                      C
                    </div>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                    C
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Captain (2x Points)
                  </span>
                  <p className="text-xs font-black text-slate-900">
                    {captainPlayer ? captainPlayer.player_name : 'No Captain Assigned'}
                  </p>
                  {captainPlayer && (
                    <span className="text-[10px] text-slate-500 font-semibold">{captainPlayer.team_name}</span>
                  )}
                </div>
              </div>

              {captainPlayer && (
                <span className="text-[11px] font-bold text-emerald-600 font-mono">
                  £{captainPlayer.market_value_eur}M
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Fantasy Salary Cap & Budget Meter */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-black text-slate-900">Salary Cap Tracker</p>
                <p className="text-[10px] font-bold text-slate-400">Budget Limit: £{BUDGET_CAP}.0M</p>
              </div>
              <div className="text-right">
                <span
                  className={`text-xl font-black font-mono ${
                    isOverBudget ? 'text-rose-600' : 'text-purple-950'
                  }`}
                >
                  £{totalValue.toFixed(1)}M
                </span>
                <p
                  className={`text-[10px] font-bold ${
                    isOverBudget ? 'text-rose-600 font-black' : 'text-emerald-600'
                  }`}
                >
                  {isOverBudget
                    ? `Over by £${(totalValue - BUDGET_CAP).toFixed(1)}M`
                    : `£${remainingBudget.toFixed(1)}M Remaining`}
                </p>
              </div>
            </div>

            {/* Visual Budget Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${Math.min(100, (totalValue / BUDGET_CAP) * 100)}%` }}
                className={`transition-all duration-300 ${
                  isOverBudget
                    ? 'bg-rose-600'
                    : totalValue > 90
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-purple-800 to-emerald-500'
                }`}
              />
            </div>
          </div>

          {/* Card 3: Club Chemistry Rules Engine (Max 3 / Club) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-purple-800" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Club Representation
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Max 3 / Club</span>
            </div>

            {clubBreakdown.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {clubBreakdown.map(([clubName, count]) => {
                  const isMax = count >= 3;
                  return (
                    <span
                      key={clubName}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                        isMax
                          ? 'bg-amber-50 text-amber-900 border-amber-200 font-black'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{clubName}</span>
                      <span className={isMax ? 'text-amber-800 font-mono' : 'text-slate-400 font-mono'}>
                        ({count}/3)
                      </span>
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium">
                No players added yet. Pick players across all 20 Premier League clubs.
              </p>
            )}
          </div>

          {/* Card 4: Aggregate Squad Metrics Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-center">
              <p className="text-lg font-black text-purple-950 font-mono">
                {selectedPlayers.length}/11
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Starting XI
              </p>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-center">
              <p className="text-lg font-black text-emerald-600 font-mono">{totalGoals}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Goals
              </p>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-center">
              <p className="text-lg font-black text-blue-600 font-mono">{totalAssists}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Assists
              </p>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-center">
              <p className="text-lg font-black text-amber-500 font-mono">★ {avgRating}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Avg Rating
              </p>
            </div>
          </div>

          {/* Card 5: Save & Share Controls */}
          <div className="space-y-3">
            <button
              onClick={handleSaveSquad}
              disabled={saving}
              className="w-full py-3.5 px-6 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Save size={16} />
              <span>
                {saving
                  ? 'Locking Lineup...'
                  : user
                  ? `Save & Lock Squad (${user.username})`
                  : 'Save & Lock Starting XI'}
              </span>
            </button>

            {/* Feedback Notifications */}
            {feedback && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold border flex items-center gap-2 ${
                  feedback.type === 'error'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                }`}
              >
                {feedback.type === 'error' ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Generated Shareable Link Card */}
            {shareLink && (
              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0 truncate">
                  <span className="text-[10px] font-bold text-purple-700 block uppercase">
                    Public Share URL
                  </span>
                  <span className="truncate text-slate-800 font-mono text-[11px] block">
                    {shareLink}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      alert('Shareable lineup link copied to clipboard!');
                    }}
                    className="px-3 py-1.5 bg-purple-900 text-white rounded-lg font-bold text-xs flex items-center gap-1 hover:bg-purple-950 transition-colors"
                  >
                    <Share2 size={12} />
                    Copy
                  </button>
                  <a
                    href={shareLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-purple-800 hover:bg-purple-100 rounded-lg transition-colors"
                    title="Open public shared squad view"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. PLAYER SELECT MODAL */}
      <PlayerSelectModal
        isOpen={isModalOpen}
        targetSlot={activeSlot}
        onClose={() => setIsModalOpen(false)}
        onSelectPlayer={handleSelectPlayer}
        currentLineup={lineup}
        remainingBudget={remainingBudget}
      />
    </div>
  );
}
