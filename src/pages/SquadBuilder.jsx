import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Trophy,
  Save,
  Share2,
  Trash2,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import TacticalPitch from '../components/squad/TacticalPitch';
import PlayerSelectModal from '../components/squad/PlayerSelectModal';
import { FORMATIONS } from '../utils/formations';
import { squadsApi } from '../api/squadsApi';
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
  const [feedback, setFeedback] = useState(null);
  const [shareLink, setShareLink] = useState('');

  const slots = FORMATIONS[formation] || FORMATIONS['4-3-3'];
  const BUDGET_CAP = 100.0;

  // Calculate live squad stats
  const selectedPlayers = Object.values(lineup).filter(Boolean);
  const totalValue = selectedPlayers.reduce((sum, p) => sum + (p.market_value_eur || 0), 0);
  const remainingBudget = Math.max(0, BUDGET_CAP - totalValue);
  const totalGoals = selectedPlayers.reduce((sum, p) => sum + (p.goals || 0), 0);
  const totalAssists = selectedPlayers.reduce((sum, p) => sum + (p.assists || 0), 0);
  const avgRating = selectedPlayers.length
    ? (selectedPlayers.reduce((sum, p) => sum + (p.rating || 7.0), 0) / selectedPlayers.length).toFixed(1)
    : '0.0';

  // Handle slot tap
  const handleSlotClick = (slot) => {
    setActiveSlot(slot);
    setIsModalOpen(true);
  };

  // Assign player to slot
  const handleSelectPlayer = (player) => {
    if (!activeSlot) return;
    setLineup((prev) => ({
      ...prev,
      [activeSlot.id]: player,
    }));
    if (!captainId) setCaptainId(player.id);
    setIsModalOpen(false);
    setActiveSlot(null);
  };

  // Remove player
  const handleRemovePlayer = (slotId) => {
    setLineup((prev) => {
      const copy = { ...prev };
      delete copy[slotId];
      return copy;
    });
  };

  // Toggle captaincy
  const handleToggleCaptain = (playerId) => {
    setCaptainId(playerId);
  };

  // Clear pitch
  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear your current lineup?")) {
      setLineup({});
      setCaptainId(null);
      setFeedback(null);
    }
  };

  // Save lineup to backend
  const handleSaveSquad = async () => {
    if (selectedPlayers.length === 0) {
      setFeedback({ type: 'error', text: 'Please add players to your lineup first.' });
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
        text: `Squad saved successfully! Share code: ${res.share_code}`,
      });
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to save squad.';
      setFeedback({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto relative">
      {/* Background blobs */}
      <div className="blob w-[400px] h-[400px] bg-purple-200/30 top-[-5%] left-[-5%]"></div>
      <div className="blob w-[350px] h-[350px] bg-emerald-100/30 bottom-[-5%] right-[-5%]"></div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 pb-8 mb-8 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100">
            <Sparkles size={14} className="text-purple-700" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-950">
              Tactics & Lineup Studio
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            Tactical Squad Builder
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500 max-w-xl">
            Design your Premier League Starting XI. Manage the £100M salary cap and adhere to the maximum 3 players per club rule.
          </p>
        </div>

        {/* Formation Picker & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Formation:</span>
            <select
              value={formation}
              onChange={(e) => {
                setFormation(e.target.value);
                setLineup({});
              }}
              className="font-black text-xs text-purple-950 bg-transparent focus:outline-none cursor-pointer"
            >
              {Object.keys(FORMATIONS).map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-600 shadow-sm transition-all"
            title="Reset Lineup"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Main Grid: Pitch on Left, Squad Dashboard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left: The Football Pitch */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <TacticalPitch
            slots={slots}
            lineup={lineup}
            captainId={captainId}
            onSlotClick={handleSlotClick}
            onRemovePlayer={handleRemovePlayer}
            onToggleCaptain={handleToggleCaptain}
          />
        </div>

        {/* Right: Squad Metrics, Rules & Save Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Squad Name Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Squad Name
            </label>
            <input
              type="text"
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
              className="w-full text-base font-black text-slate-800 border-b-2 border-purple-100 focus:border-purple-600 pb-1 focus:outline-none transition-colors"
            />
          </div>

          {/* Budget & Chemistry Bar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-black text-slate-800">Budget Tracker</p>
                <p className="text-[10px] font-bold text-slate-400">Cap: £{BUDGET_CAP}.0M</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-purple-950">
                  £{totalValue.toFixed(1)}M
                </span>
                <p className="text-[9px] font-bold text-emerald-600">
                  £{remainingBudget.toFixed(1)}M Left
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${Math.min(100, (totalValue / BUDGET_CAP) * 100)}%` }}
                className={`transition-all duration-500 ${
                  totalValue > BUDGET_CAP ? 'bg-red-500' : 'bg-gradient-to-r from-purple-700 to-emerald-500'
                }`}
              />
            </div>
          </div>

          {/* Aggregate Squad Metrics */}
          <div className="grid grid-cols-4 gap-2">
            <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
              <p className="text-lg font-black text-purple-950">{selectedPlayers.length} / 11</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">Starting XI</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
              <p className="text-lg font-black text-emerald-600">{totalGoals}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">Goals</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
              <p className="text-lg font-black text-blue-600">{totalAssists}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">Assists</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
              <p className="text-lg font-black text-amber-500">★ {avgRating}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">Avg Rating</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSaveSquad}
              disabled={saving}
              className="w-full py-3.5 px-6 rounded-2xl bg-purple-950 hover:bg-purple-900 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Save size={18} />
              <span>{saving ? 'Saving Lineup...' : user ? `Save Lineup (${user.username})` : 'Save & Lock Lineup'}</span>
            </button>

            {feedback && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold border flex items-center gap-2 ${
                  feedback.type === 'error'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {feedback.type === 'error' ? <Info size={16} /> : <CheckCircle2 size={16} />}
                <span>{feedback.text}</span>
              </div>
            )}

            {shareLink && (
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between text-xs">
                <span className="truncate max-w-[280px] text-purple-900 font-semibold">{shareLink}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    alert("Share link copied to clipboard!");
                  }}
                  className="px-3 py-1 bg-purple-900 text-white rounded-lg font-bold flex items-center gap-1 hover:bg-purple-800"
                >
                  <Share2 size={12} />
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
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
