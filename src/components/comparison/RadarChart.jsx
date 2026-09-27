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
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
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
          <polygon
            points={getPolygonPoints(p1Data)}
            fill="rgba(126, 34, 206, 0.25)"
            stroke="#7e22ce"
            strokeWidth="2.5"
            className="transition-all duration-500"
          />
        )}

        {/* Player 2 Polygon (Emerald) */}
        {p2Data && (
          <polygon
            points={getPolygonPoints(p2Data)}
            fill="rgba(16, 185, 129, 0.25)"
            stroke="#10b981"
            strokeWidth="2.5"
            className="transition-all duration-500"
          />
        )}

        {/* Center pivot dot */}
        <circle cx={center} cy={center} r="3" fill="#94a3b8" />
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-700"></span>
          <span className="text-xs font-bold text-slate-700">{p1Name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-bold text-slate-700">{p2Name}</span>
        </div>
      </div>
    </div>
  );
}
