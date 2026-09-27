import React from 'react';
import { Plus, X, Shield, Star } from 'lucide-react';
import PlayerAvatar from '../common/PlayerAvatar';

export default function PitchSlot({
  slot,
  player,
  onClick,
  onRemove,
  onToggleCaptain,
  isCaptain,
}) {
  return (
    <div
      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-20"
      onClick={onClick}
    >
      {player ? (
        <div className="relative flex flex-col items-center">
          {/* Captaincy indicator badge */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCaptain();
            }}
            title="Set as Captain"
            className={`absolute -top-2 -left-2 z-30 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border shadow-md transition-all ${
              isCaptain
                ? 'bg-amber-400 text-slate-900 border-amber-300 scale-110'
                : 'bg-slate-800/80 text-white/60 hover:text-white border-white/20'
            }`}
          >
            C
          </button>

          {/* Remove button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove player"
            className="absolute -top-2 -right-2 z-30 w-5 h-5 rounded-full bg-red-600/90 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-md"
          >
            <X size={10} />
          </button>

          {/* Player Photo Avatar (Official EPL Cutout from API) */}
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-white/25 to-white/5 border-2 border-white/60 shadow-xl overflow-hidden flex items-end justify-center backdrop-blur-sm group-hover:border-purple-300 group-hover:scale-105 transition-all">
            <PlayerAvatar
              photoUrl={player.photo_url}
              name={player.player_name}
              position={player.position}
            />
          </div>


          {/* Label Card */}
          <div className="mt-1 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/15 text-center min-w-[70px] shadow-lg">
            <p className="text-[10px] font-black text-white truncate max-w-[85px]">
              {player.player_name.split(' ').pop()}
            </p>
            <p className="text-[8px] font-bold text-emerald-400">
              £{player.market_value_eur}M
            </p>
          </div>
        </div>
      ) : (
        /* Empty Slot */
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-dashed border-white/50 bg-black/20 hover:bg-black/40 hover:border-white transition-all flex items-center justify-center shadow-md">
            <Plus size={18} className="text-white/80 group-hover:scale-125 transition-transform" />
          </div>
          <span className="mt-1 text-[9px] font-black uppercase tracking-wider text-white/90 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
            {slot.label}
          </span>
        </div>
      )}
    </div>
  );
}
