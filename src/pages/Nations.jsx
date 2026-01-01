import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Nations.css";

export default function Nations() {
  const [nations, setNations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://premier-backend.onrender.com/nations")
      .then((res) => {
        const sortedNations = res.data.sort((a, b) =>
          a.split(" ")[1].localeCompare(b.split(" ")[1])
        );
        setNations(sortedNations);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) return <div className="loader">Mapping Global Talents...</div>;

  return (
    <div className="nations-page">
      <header className="nations-header">
        <h1 className="hero-title">
          Global <span className="highlight">Talent</span>
        </h1>
        <p className="hero-subtitle">
          Explore the diverse national contributions across the Premier League from {nations.length} countries.
        </p>
      </header>

      <div className="nations-grid">
        {nations.map((nationStr, index) => {
          const nationCode = nationStr.split(" ")[1];
          return (
            <Link
              to={`/players?nation=${nationCode}`}
              key={index}
              className="nation-card"
            >
              <div className="flag-wrapper">
                <img
                  src={`/flags/${nationCode}.png`}
                  alt={nationCode}
                  className="nation-flag-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/logo.png";
                  }}
                />
              </div>
              <div className="nation-info">
                <h3>{nationCode}</h3>
                <div className="view-badge">View Players</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}