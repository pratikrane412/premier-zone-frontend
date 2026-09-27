import React, { useState } from 'react';
import { User } from 'lucide-react';

const POSITION_COLORS = {
  GK: 'bg-amber-100 text-amber-900 border-amber-200/80',
  DF: 'bg-blue-100 text-blue-900 border-blue-200/80',
  MF: 'bg-emerald-100 text-emerald-900 border-emerald-200/80',
  FW: 'bg-rose-100 text-rose-900 border-rose-200/80',
};

function getInitials(name) {
  if (!name || name === 'Player') return 'PL';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PlayerAvatar({
  photoUrl,
  name = 'Player',
  position = 'MF',
  className = 'w-full h-full',
  imgClassName = 'w-full h-full object-cover object-top',
}) {
  const [hasError, setHasError] = useState(false);
  const [prevUrl, setPrevUrl] = useState(photoUrl);

  if (prevUrl !== photoUrl) {
    setPrevUrl(photoUrl);
    setHasError(false);
  }

  const handleError = () => {
    setHasError(true);
  };

  const isInvalid = !photoUrl || hasError || (typeof photoUrl === 'string' && photoUrl.includes('Photo-Missing'));
  const posBadgeStyle = POSITION_COLORS[position] || 'bg-purple-100 text-purple-900 border-purple-200/80';
  const initials = getInitials(name);

  return (
    <div className={`relative flex items-end justify-center overflow-hidden ${className}`}>
      {isInvalid ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 via-slate-100 to-purple-100/70 text-purple-950 p-2 select-none border border-purple-100/60">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white shadow-2xs border border-purple-100 flex items-center justify-center mb-1">
            <span className="text-xs sm:text-sm font-black tracking-tight text-purple-950 font-mono">
              {initials}
            </span>
          </div>
          <span className={`text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded-md border ${posBadgeStyle}`}>
            {position}
          </span>
        </div>
      ) : (
        <img
          src={photoUrl}
          alt={name}
          loading="lazy"
          onError={handleError}
          className={imgClassName}
        />
      )}
    </div>
  );
}
