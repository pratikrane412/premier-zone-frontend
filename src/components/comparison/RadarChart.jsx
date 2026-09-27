import React from 'react';

export default function RadarChart({ p1Data, p2Data, p1Name = "Player 1", p2Name = "Player 2" }) {
  const size = 320;
  const center = size / 2;
  const radius = 110;

  const categories = [
    { key: "shooting", label: "Shooting" },
    { key: "creation", label: "Creation" },
    { key: "participation", label: "Work Rate" },
    { key: "discipline", label: "Discipline" },
    { key: "efficiency", label: "Efficiency" },
  ];

  const numAxes = categories.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Calculate coordinates for points
  const getCoordinates = (value, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const distance = (value / 100) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points string
  const getPolygonPoints = (data) => {
    if (!data) return "";
    return categories
      .map((cat, i) => {
        const val = data[cat.key] || 50;
        const { x, y } = getCoordinates(val, i);
        return `${x},${y}`;
      })
      .join(" ");
  };

  // Concentric background grid polygons (levels 20, 40, 60, 80, 100)
  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <div className="flex flex-col items-center w-full max-w-[340px] mx-auto">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-auto max-w-[320px] aspect-square overflow-visible"
      >
        {/* Background Grid Web */}
        {gridLevels.map((lvl) => {
          const points = categories
            .map((_, i) => {
              const { x, y } = getCoordinates(lvl, i);
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <polygon
              key={lvl}
              points={points}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray={lvl === 100 ? "0" : "3 3"}
            />
          );
        })}

        {/* Axis lines */}
        {categories.map((cat, i) => {
          const { x, y } = getCoordinates(100, i);
          const labelDist = radius + 22;
          const labelAngle = i * angleStep - Math.PI / 2;
          const lx = center + labelDist * Math.cos(labelAngle);
          const ly = center + labelDist * Math.sin(labelAngle);

          return (
            <g key={cat.key}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[11px] font-black fill-slate-600 uppercase tracking-wider"
              >
                {cat.label}
              </text>
            </g>
          );
        })}

        {/* Player 1 Polygon (Purple) */}
        {p1Data && (
          <g>
            <polygon
              points={getPolygonPoints(p1Data)}
              fill="rgba(126, 34, 206, 0.22)"
              stroke="#6b21a8"
              strokeWidth="2.5"
              className="transition-all duration-500"
            />
            {categories.map((cat, i) => {
              const val = p1Data[cat.key] || 50;
              const { x, y } = getCoordinates(val, i);
              return (
                <circle
                  key={`p1-dot-${cat.key}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#6b21a8"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-500 drop-shadow"
                />
              );
            })}
          </g>
        )}

        {/* Player 2 Polygon (Emerald) */}
        {p2Data && (
          <g>
            <polygon
              points={getPolygonPoints(p2Data)}
              fill="rgba(16, 185, 129, 0.22)"
              stroke="#059669"
              strokeWidth="2.5"
              className="transition-all duration-500"
            />
            {categories.map((cat, i) => {
              const val = p2Data[cat.key] || 50;
              const { x, y } = getCoordinates(val, i);
              return (
                <circle
                  key={`p2-dot-${cat.key}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#059669"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-500 drop-shadow"
                />
              );
            })}
          </g>
        )}

        {/* Center pivot dot */}
        <circle cx={center} cy={center} r="3.5" fill="#94a3b8" />
      </svg>

      {/* Legend & Summary */}
      <div className="flex items-center gap-6 mt-6 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/60 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-700 shadow-sm"></span>
          <span className="text-xs font-black text-slate-800">{p1Name}</span>
        </div>
        <span className="text-slate-300 font-bold text-xs">•</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600 shadow-sm"></span>
          <span className="text-xs font-black text-slate-800">{p2Name}</span>
        </div>
      </div>
    </div>
  );
}
