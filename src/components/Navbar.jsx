import { useState } from "react";
import "./../styles/Navbar.css";
import logo from "../assets/logo.png";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo">
                    <img src={logo} alt="Logo" />
                    <span>Premier<span className="gold-text">Zone</span></span>
                </div>

                {/* Mobile Toggle Button */}
                <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span className={isMenuOpen ? "bar open" : "bar"}></span>
                    <span className={isMenuOpen ? "bar open" : "bar"}></span>
                    <span className={isMenuOpen ? "bar open" : "bar"}></span>
                </button>

                <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
                    <a href="/" onClick={() => setIsMenuOpen(false)}>Home</a>
                    <a href="/teams" onClick={() => setIsMenuOpen(false)}>Teams</a>
                    <a href="/nations" onClick={() => setIsMenuOpen(false)}>Nations</a>
                    <a href="/positions" onClick={() => setIsMenuOpen(false)}>Positions</a>
                </div>
            </div>
        </nav>
    );
}