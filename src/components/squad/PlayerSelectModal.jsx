import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, AlertCircle, Check, Filter, ArrowUpDown } from 'lucide-react';
import PlayerAvatar from '../common/PlayerAvatar';
import TeamCrest from '../common/TeamCrest';
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
  const [selectedClub, setSelectedClub] = useState('ALL');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'price-desc' | 'price-asc' | 'goals'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && targetSlot) {
      setSelectedPos(targetSlot.position || 'MF');
      setSearch('');
      setSelectedClub('ALL');
    }
  }, [isOpen, targetSlot]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchEligiblePlayers = async () => {
      setLoading(true);
      try {
        const ordering =
          sortBy === 'price-desc'
            ? '-market_value_eur'
            : sortBy === 'price-asc'
            ? 'market_value_eur'
            : sortBy === 'goals'
            ? '-goals'
            : '-rating';

        const res = await playersApi.getAll({
          position: selectedPos === 'ALL' ? '' : selectedPos,
          search: search.trim(),
          team: selectedClub === 'ALL' ? '' : selectedClub,
          ordering,
          limit: 60,
        });
        setPlayers(res.results || []);
      } catch (err) {
        console.error('Failed to load players for selection:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchEligiblePlayers, 200);
    return () => clearTimeout(debounceTimer);
  }, [isOpen, selectedPos, search, selectedClub, sortBy]);

  // Calculate club representation in the current squad
  const clubCounts = useMemo(() => {
    const counts = {};
    Object.values(currentLineup).forEach((p) => {
      if (p && p.team_name) {
        counts[p.team_name] = (counts[p.team_name] || 0) + 1;
      }
    });
    return counts;
  }, [currentLineup]);

  if (!isOpen) return null;

  // Extract unique clubs from loaded players for quick dropdown filter
  const availableClubs = Array.from(
    new Set(players.map((p) => p.team_name).filter(Boolean))
  ).sort();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                {targetSlot?.label || 'Slot'}
              </span>
              <h3 className="text-base font-black text-slate-900">
                Select {targetSlot?.position || 'Player'}
              </h3>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Available Budget:{' '}
              <span className="font-extrabold text-emerald-600 font-mono">
                £{remainingBudget.toFixed(1)}M
              </span>{' '}
              • Maximum 3 players per club
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-white border-b border-slate-100 space-y-3">
          {/* Position Pills */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {['ALL', 'GK', 'DF', 'MF', 'FW'].map((pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPos(pos)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedPos === pos
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {pos === 'ALL' ? 'All Roles' : pos}
              </button>
            ))}
          </div>

          {/* Search, Club Filter, & Sort Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            {/* Search Input (span 6) */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search player name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 transition-colors"
              />
            </div>

            {/* Club Filter (span 3) */}
            <div className="sm:col-span-3">
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="w-full py-2 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 cursor-pointer"
              >
                <option value="ALL">All Clubs</option>
                {availableClubs.map((club) => (
                  <option key={club} value={club}>
                    {club}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown (span 3) */}
            <div className="sm:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 cursor-pointer"
              >
                <option value="rating">Top Rated</option>
                <option value="price-desc">Highest Price</option>
                <option value="price-asc">Lowest Price</option>
                <option value="goals">Most Goals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Players List Grid */}
        <div className="p-4 flex-1 overflow-y-auto divide-y divide-slate-100">
          {loading ? (
            <div className="py-20 text-center space-y-2">
              <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-900 rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider animate-pulse">
                Finding Eligible Scouts...
              </p>
            </div>
          ) : players.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">No players found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedClub('ALL');
                }}
                className="text-xs font-black text-purple-700 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            players.map((p) => {
              const isAlreadyPicked = Object.values(currentLineup).some(
                (item) => item && item.id === p.id
              );
              const playerCost = p.market_value_eur || 0;
              const isOverBudget = playerCost > remainingBudget;
              const currentClubCount = clubCounts[p.team_name] || 0;
              const isClubLimitReached = currentClubCount >= 3;
              const isBlocked = isAlreadyPicked || isOverBudget || isClubLimitReached;

              return (
                <div
                  key={p.id}
                  className={`py-3 px-2 flex items-center justify-between gap-3 rounded-xl transition-colors ${
                    isBlocked ? 'opacity-50 bg-slate-50/50' : 'hover:bg-purple-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Official Cutout Avatar */}
                    <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                      <PlayerAvatar
                        photoUrl={p.photo_url}
                        name={p.player_name}
                        position={p.position}
                      />
                    </div>

                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-slate-900 truncate">
                          {p.player_name}
                        </p>
                        <span className="text-[9px] font-bold uppercase px-1 py-0.2 rounded bg-slate-100 text-slate-600">
                          {p.position}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 truncate">
                        {p.team_name}
                        {currentClubCount > 0 && (
                          <span className="text-purple-700 font-bold ml-1">
                            ({currentClubCount}/3 in XI)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Player Stats & Selection Action */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-600 font-mono block">
                        £{playerCost.toFixed(1)}M
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {p.goals || 0}G • {p.assists || 0}A
                      </span>
                    </div>

                    {isAlreadyPicked ? (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                        In Starting XI
                      </span>
                    ) : isClubLimitReached ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
                        Max 3/Club
                      </span>
                    ) : isOverBudget ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg">
                        Over Budget
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectPlayer(p)}
                        className="px-3.5 py-1.5 rounded-lg bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-2xs transition-all active:scale-95"
                      >
                        Select
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
