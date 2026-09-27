import React, { useState, useEffect } from 'react';
import { Search, X, AlertCircle, Check } from 'lucide-react';
import PlayerAvatar from '../common/PlayerAvatar';
import { playersApi } from '../../api/playersApi';

export default function PlayerSelectModal({
  isOpen,
  onClose,
  targetSlot,
  onSelectPlayer,
  currentLineup,
  remainingBudget,
}) {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPos, setSelectedPos] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && targetSlot) {
      setSelectedPos(targetSlot.position || 'MF');
    }
  }, [isOpen, targetSlot]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchEligiblePlayers = async () => {
      setLoading(true);
      try {
        const res = await playersApi.getAll({
          position: selectedPos,
          search: search.trim(),
          limit: 40,
        });
        setPlayers(res.results || []);
      } catch (err) {
        console.error("Failed to load players for selection:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchEligiblePlayers, 200);
    return () => clearTimeout(debounceTimer);
  }, [isOpen, selectedPos, search]);

  if (!isOpen) return null;

  // Calculate club counts in current lineup
  const clubCounts = {};
  Object.values(currentLineup).forEach((p) => {
    if (p) {
      clubCounts[p.team_name] = (clubCounts[p.team_name] || 0) + 1;
    }
  });

  // Check if player is already picked in lineup
  const isPlayerAlreadyPicked = (playerId) => {
    return Object.values(currentLineup).some((p) => p && p.id === playerId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Select {targetSlot?.label || "Player"}
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Remaining Budget: <span className="font-extrabold text-emerald-600">£{remainingBudget.toFixed(1)}M</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Position Tabs & Search */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 space-y-3">
          <div className="flex gap-2">
            {['GK', 'DF', 'MF', 'FW'].map((pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPos(pos)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  selectedPos === pos
                    ? 'bg-purple-950 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by player name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600"
            />
          </div>
        </div>

        {/* Player List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-slate-50">
          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Scanning Premier League Roster...
            </div>
          ) : players.length === 0 ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400">
              No players found matching criteria.
            </div>
          ) : (
            players.map((p) => {
              const alreadyPicked = isPlayerAlreadyPicked(p.id);
              const exceedsBudget = p.market_value_eur > remainingBudget;
              const exceedsClubLimit = (clubCounts[p.team_name] || 0) >= 3;
              const disabled = alreadyPicked || exceedsBudget || exceedsClubLimit;

              return (
                <div
                  key={p.id}
                  onClick={() => !disabled && onSelectPlayer(p)}
                  className={`pt-2 flex items-center justify-between p-2.5 rounded-2xl transition-all ${
                    disabled
                      ? 'opacity-40 cursor-not-allowed bg-slate-50'
                      : 'hover:bg-purple-50/60 cursor-pointer border border-transparent hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Official Cutout Photo from API */}
                    <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 flex items-end justify-center">
                      <PlayerAvatar
                        photoUrl={p.photo_url}
                        name={p.player_name}
                        position={p.position}
                      />
                    </div>
                    <div>

                      <p className="text-xs font-black text-slate-800">{p.player_name}</p>
                      <p className="text-[10px] font-bold text-slate-400">
                        {p.team_name} • {p.position} • {p.goals} G • {p.assists} A
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs font-black text-purple-900">£{p.market_value_eur}M</p>
                      <p className="text-[9px] font-bold text-amber-600">★ {p.rating}</p>
                    </div>
                    {alreadyPicked ? (
                      <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        Selected
                      </span>
                    ) : exceedsClubLimit ? (
                      <span className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-1 rounded">
                        Club Max (3)
                      </span>
                    ) : exceedsBudget ? (
                      <span className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-1 rounded">
                        Over Budget
                      </span>
                    ) : (
                      <button className="px-3 py-1 bg-purple-950 text-white rounded-lg text-xs font-bold hover:bg-purple-800 transition-colors">
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
