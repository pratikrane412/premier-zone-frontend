import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../styles/Players.css";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 50;

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const teamFilter = query.get("team");
  const posFilter = query.get("position");
  const nationFilter = query.get("nation"); // 1. Added Nation filter extraction

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const offset = (page - 1) * limit;

        let url = `https://premier-backend.onrender.com/players?limit=${limit}&offset=${offset}`;

        if (teamFilter) {
          url = `https://premier-backend.onrender.com/teams/search?team_name=${teamFilter}`;
        } else if (posFilter) {
          url = `https://premier-backend.onrender.com/players/position/${posFilter}?limit=${limit}&offset=${offset}`;
        } else if (nationFilter) {
          // FIX: Added limit and offset here to stop the lag
          url = `https://premier-backend.onrender.com/nations/search?nation=${nationFilter}&limit=${limit}&offset=${offset}`;
        }

        const res = await axios.get(url);
        setPlayers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, [teamFilter, posFilter, nationFilter, page]);

  // Reset to page 1 if user changes any filters
  useEffect(() => {
    setPage(1);
  }, [teamFilter, posFilter, nationFilter]); // 4. Reset on nation change

  if (loading) return <div className="loader">Updating Pitch Stats...</div>;

  return (
    <div className="players-page">
      <header className="players-header">
        <h1 className="hero-title">
          {/* 5. Dynamic Title Update */}
          {teamFilter
            ? teamFilter.replace(/-/g, " ")
            : posFilter
            ? `${posFilter}s`
            : nationFilter
            ? `Players from ${nationFilter}`
            : "Premier League"}
          <span className="highlight"> Players</span>
        </h1>
        <p className="hero-subtitle">
          Page {page} • Displaying {players.length} results
        </p>
      </header>

      <div className="stats-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Team</th>
              <th>Nation</th>
              <th>Pos</th>
              <th className="highlight-th">Gls</th>
              <th className="highlight-th">Ast</th>
              <th>MP</th>
            </tr>
          </thead>
          <tbody>
            {players.length > 0 ? (
              players.map((p, index) => (
                <tr key={index}>
                  <td className="player-name-cell">{p.player_name}</td>
                  <td>{p.team_name}</td>
                  <td>{p.nation?.split(" ")[1]}</td>
                  <td>
                    <span className="pos-badge">{p.position}</span>
                  </td>
                  <td className="stat-important">{p.goals ?? 0}</td>
                  <td className="stat-important">{p.assists ?? 0}</td>
                  <td>{p.matches_played ?? 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "30px" }}
                >
                  No players found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls - Hide for Team and Nation views (usually smaller lists) */}
      {!teamFilter && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => {
              setPage((prev) => prev - 1);
              window.scrollTo(0, 0);
            }}
            className="pager-btn"
          >
            ← Previous
          </button>

          <span className="page-number">Page {page}</span>

          <button
            disabled={players.length < limit}
            onClick={() => {
              setPage((prev) => prev + 1);
              window.scrollTo(0, 0);
            }}
            className="pager-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
