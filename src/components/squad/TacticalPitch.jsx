import React from 'react';
import PitchSlot from './PitchSlot';

export default function TacticalPitch({
  slots,
  lineup,
  onSlotClick,
  onRemovePlayer,
  onToggleCaptain,
  captainId,
}) {
  return (
    <div className="relative w-full max-w-[620px] aspect-[3/4] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900/10 select-none">
      {/* Grass Field Background with modern striping */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#156e3b] via-[#1b8247] to-[#125e32]">
        {/* Striped grass lawn effect */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.15) 40px, rgba(0,0,0,0.15) 80px)',
          }}
        />
      </div>

      {/* Regulation Pitch Markings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-white/40 fill-none" strokeWidth="2">
        {/* Outer boundary padding */}
        <rect x="20" y="20" width="calc(100% - 40px)" height="calc(100% - 40px)" rx="12" />

        {/* Halfway line */}
        <line x1="20" y1="50%" x2="calc(100% - 20px)" y2="50%" />

        {/* Center circle & spot */}
        <circle cx="50%" cy="50%" r="55" />
        <circle cx="50%" cy="50%" r="3" className="fill-white/60" />

        {/* Top Penalty Box (Opponent) */}
        <rect x="22%" y="20" width="56%" height="18%" />
        <rect x="36%" y="20" width="28%" height="7%" />
        <circle cx="50%" cy="13%" r="3" className="fill-white/60" />

        {/* Bottom Penalty Box (Our Goal) */}
        <rect x="22%" y="calc(82% - 20px)" width="56%" height="18%" />
        <rect x="36%" y="calc(93% - 20px)" width="28%" height="7%" />
        <circle cx="50%" cy="87%" r="3" className="fill-white/60" />
      </svg>

      {/* Pitch Slots */}
      <div className="absolute inset-0">
        {slots.map((slot) => {
          const player = lineup[slot.id];
          return (
            <PitchSlot
              key={slot.id}
              slot={slot}
              player={player}
              isCaptain={player && player.id === captainId}
              onClick={() => onSlotClick(slot)}
              onRemove={() => onRemovePlayer(slot.id)}
              onToggleCaptain={() => onToggleCaptain(player?.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
