import React, { useState } from 'react';
import { Shield } from 'lucide-react';

export const FALLBACK_CREST =
  'https://resources.premierleague.com/premierleague/badges/70/t3.png';

export default function TeamCrest({
  crestUrl,
  teamName = 'Premier League',
  className = 'w-6 h-6 object-contain',
}) {
  const [failed, setFailed] = useState(false);
  const [prevUrl, setPrevUrl] = useState(crestUrl);

  if (prevUrl !== crestUrl) {
    setPrevUrl(crestUrl);
    setFailed(false);
  }

  const handleError = () => {
    setFailed(true);
  };

  if (failed || !crestUrl) {
    return <Shield className="w-5 h-5 text-purple-900 flex-shrink-0" />;
  }

  return (
    <img
      src={crestUrl}
      alt={teamName}
      loading="lazy"
      onError={handleError}
      className={className}
    />
  );
}
