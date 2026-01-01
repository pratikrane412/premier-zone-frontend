import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Teams.css";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching from your FastAPI endpoint
    axios
      .get("https://premier-backend.onrender.com/teams")
      .then((res) => {
        setTeams(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching teams:", err));
  }, []);

  if (loading) return <div className="loader">Loading Clubs...</div>;

  return (
    <div className="teams-page">
      <header className="teams-header">
        <h1 className="hero-title">
          Premier League <span className="highlight">Clubs</span>
        </h1>
        <p className="hero-subtitle">
          Select a team to view their full squad statistics and performance.
        </p>
      </header>

      <div className="teams-grid">
        {teams.map((team, index) => (
          <Link to={`/players?team=${team}`} key={index} className="team-card">
            <div className="team-logo-container">
              {/* Assumes logos are in public folder as Team-Name.png */}
              <img
                src={`/teams/${team}.png`} 
                alt={`${team} logo`}
                className="team-card-logo"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "/logo.png"; 
                }}
              />
            </div>
            <div className="team-card-info">
              <h3>{team.replace(/-/g, " ")}</h3>
              <span className="view-link">View Stats →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
