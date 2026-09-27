import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Sparkles, User, Shield } from 'lucide-react';
import { squadsApi } from '../api/squadsApi';
import TacticalPitch from '../components/squad/TacticalPitch';
import { FORMATIONS } from '../utils/formations';

export default function SharedSquad() {
  const { shareCode } = useParams();
  const [squad, setSquad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSquad = async () => {
      try {
        const data = await squadsApi.getShared(shareCode);
        setSquad(data);
      } catch {
        setError("This squad could not be found or the link has expired.");
      } finally {
        setLoading(false);
      }
    };
    fetchSquad();
  }, [shareCode]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-purple-200 border-t-purple-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !squad) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-black text-slate-800">Squad Not Found</h2>
        <p className="text-xs text-slate-500">{error}</p>
        <Link to="/squad-builder" className="inline-block px-5 py-2.5 bg-purple-950 text-white rounded-xl font-bold text-xs">
          Build Your Own Squad
        </Link>
      </div>
    );
  }

  const formationSlots = FORMATIONS[squad.formation] || FORMATIONS['4-3-3'];
  const lineupMap = {};
  squad.lineup?.forEach((item) => {
    if (item.player_details) {
      lineupMap[item.pitch_position] = {
        ...item.player_details,
        id: item.player_details.id,
      };
    }
  });

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto relative">
      <div className="border-b border-slate-200/60 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link to="/squad-builder" className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 mb-2">
            <ArrowLeft size={14} /> Back to Squad Builder
          </Link>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900">{squad.name}</h1>
          <p className="text-xs font-semibold text-slate-500">
            Tactical Formation: <span className="font-extrabold text-purple-900">{squad.formation}</span> • Built by <span className="font-bold text-slate-800">{squad.user_name || 'Premier Scout'}</span>
          </p>
        </div>

        <div className="flex gap-4">
          <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            <p className="text-lg font-black text-purple-950">£{squad.calculated_value}M</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Total Value</p>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            <p className="text-lg font-black text-emerald-600">{squad.total_goals}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Goals</p>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            <p className="text-lg font-black text-amber-500">★ {squad.avg_rating}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Avg Rating</p>
          </div>
        </div>
      </div>

      <div className="max-w-[620px] mx-auto">
        <TacticalPitch
          slots={formationSlots}
          lineup={lineupMap}
          onSlotClick={() => {}}
          onRemovePlayer={() => {}}
          onToggleCaptain={() => {}}
        />
      </div>
    </div>
  );
}
