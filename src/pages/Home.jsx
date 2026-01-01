import "../styles/Home.css";
import logo from "../assets/logo.png"; 

export default function Home() {
    return (
        <section className="hero-section">
            <div className="hero-container">
                <div className="hero-left">
                    <div className="badge">Season 2024/25 Statistics</div>
                    <h1 className="hero-title">
                        Master the <span className="highlight">Pitch</span> with Real-Time Stats
                    </h1>
                    <p className="hero-subtitle">
                        Deep dive into Premier League player performance, team dynamics, and national contributions. 
                    </p>
                    <div className="hero-actions">
                        <button className="hero-btn primary">Explore Players</button>
                        <a href="/teams"><button className="hero-btn secondary">View Teams</button></a>
                    </div>
                </div>

                <div className="hero-right">
                    <div className="logo-glow-container">
                        <img className="hero-logo" src={logo} alt="Premier League Logo" />
                    </div>
                </div>
            </div>
        </section>
    );
}