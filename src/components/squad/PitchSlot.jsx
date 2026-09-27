import React from 'react';
import { Plus, X } from 'lucide-react';
import PlayerAvatar from '../common/PlayerAvatar';

// Authentic Premier League jersey surname resolution
export function getJerseyName(fullName) {
  if (!fullName) return '';
  const SPECIAL_NAMES = {
    'David Raya Martín': 'Raya',
    'Emiliano Martínez Romero': 'E. Martínez',
    'João Pedro Junqueira de Jesus': 'João Pedro',
    'Gabriel dos Santos Magalhães': 'Gabriel',
    'Ezri Konsa Ngoyo': 'Konsa',
    'Kevin De Bruyne': 'De Bruyne',
    'Trent Alexander-Arnold': 'Alexander-Arnold',
    'Virgil van Dijk': 'van Dijk',
    'Bruno Borges Fernandes': 'B. Fernandes',
    'Bernardo Mota Veiga de Carvalho e Silva': 'B. Silva',
    'Rodrigo Hernández Cascante': 'Rodri',
  };
  if (SPECIAL_NAMES[fullName]) return SPECIAL_NAMES[fullName];
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return parts[0];
  if (parts[0].toLowerCase() === 'de' || parts[0].toLowerCase() === 'van') {
    return fullName;
  }
  return parts[parts.length - 1];
}

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
            title={isCaptain ? 'Current Captain (2x Points)' : 'Click to Make Captain'}
            className={`absolute -top-2 -left-2 z-30 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border shadow-md transition-all ${
              isCaptain
                ? 'bg-amber-400 text-slate-950 border-amber-300 scale-110 ring-2 ring-amber-400/40'
                : 'bg-slate-900/90 text-white/70 hover:text-white border-white/30 hover:scale-105'
            }`}
          >
            C
          </button>

          {/* Remove player button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove player from slot"
            className="absolute -top-2 -right-2 z-30 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 hover:scale-115 transition-all shadow-md"
          >
            <X size={11} />
          </button>

          {/* Player Photo Avatar (Official EPL Cutout from API) */}
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-white/30 to-white/10 border-2 border-white/80 shadow-xl overflow-hidden flex items-end justify-center backdrop-blur-xs group-hover:border-purple-300 group-hover:scale-105 transition-all">
            <PlayerAvatar
              photoUrl={player.photo_url}
              name={player.player_name}
              position={player.position}
            />
          </div>

          {/* Label Card */}
          <div className="mt-1 bg-slate-950/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20 text-center min-w-[75px] shadow-lg">
            <p className="text-[10px] font-black text-white truncate max-w-[90px] leading-tight">
              {getJerseyName(player.player_name)}
            </p>
            <p className="text-[9px] font-bold text-emerald-400 font-mono">
              £{player.market_value_eur || 0}M
            </p>
          </div>
        </div>
      ) : (
        /* Empty Slot */
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-dashed border-white/60 bg-black/25 hover:bg-black/45 hover:border-white transition-all flex items-center justify-center shadow-md group-hover:scale-105">
            <Plus size={18} className="text-white/90 group-hover:scale-125 transition-transform" />
          </div>
          <span className="mt-1 text-[9px] font-black uppercase tracking-wider text-white bg-black/60 px-2 py-0.5 rounded border border-white/20 backdrop-blur-xs">
            {slot.label}
          </span>
        </div>
      )}
    </div>
  );
}
