import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Positions.css';

export default function Positions() {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);

    const posFullNames = {
        "GK": "Goalkeepers",
        "DF": "Defenders",
        "MF": "Midfielders",
        "FW": "Forwards"
    };

    useEffect(() => {
        axios.get("https://premier-backend.onrender.com/positions")
            .then(res => {
                setPositions(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) return <div className="loader">Defining the Pitch...</div>;

    return (
        <div className="positions-page">
            <header className="positions-header">
                <h1 className="hero-title">Browse by <span className="highlight">Position</span></h1>
                <p className="hero-subtitle">
                    Analyze performance metrics specifically filtered by tactical roles on the field.
                </p>
            </header>

            <div className="positions-grid">
                {positions.map((pos, index) => (
                    <Link to={`/players?position=${pos}`} key={index} className="pos-card">
                        <div className="pos-image-wrapper">
                            <img 
                                src={`/positions/${pos}.png`} 
                                alt={pos} 
                                className="pos-main-img" 
                                onError={(e) => { e.target.onerror = null; e.target.src="/logo.png"}}
                            />
                            <div className="pos-overlay"></div>
                        </div>
                        <div className="pos-content">
                            <span className="pos-tag">{pos}</span>
                            <h3>{posFullNames[pos] || pos}</h3>
                            <p>Discover the league's most impactful {posFullNames[pos]?.toLowerCase()}.</p>
                            <span className="explore-link">View Statistics →</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}