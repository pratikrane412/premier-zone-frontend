import React, { useState } from 'react';
import { User } from 'lucide-react';

export const FALLBACK_PLAYER_PHOTO =
  'https://resources.premierleague.com/premierleague/photos/players/250x250/Photo-Missing.png';

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

  const currentSrc = !photoUrl || hasError ? FALLBACK_PLAYER_PHOTO : photoUrl;

  return (
    <div className={`relative flex items-end justify-center overflow-hidden ${className}`}>
      {hasError && !photoUrl ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-100/50 to-slate-200 text-purple-900">
          <User className="w-1/2 h-1/2 opacity-40 mb-1" />
          <span className="text-[9px] font-black tracking-wider uppercase opacity-60">{position}</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={name}
          loading="lazy"
          onError={handleError}
          className={imgClassName}
        />
      )}
    </div>
  );
}
