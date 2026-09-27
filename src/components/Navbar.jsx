import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Search,
  Trophy,
  Scale,
  Compass,
  Calendar,
  RefreshCw,
  User,
  LogOut,
  LogIn,
  Shield,
  Activity,
  Sparkles,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo1.png";
import { useAuth } from "../context/AuthContext";
import { playersApi } from "../api/playersApi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleSyncData = async () => {
    setSyncing(true);
    try {
      const res = await playersApi.syncLiveEpl();
      alert(`Live EPL Data Synced! Updated: ${res.players_updated} players, ${res.fixtures_updated} fixtures.`);
      window.location.reload();
    } catch {
      alert("Failed to sync live data. Please check backend connection.");
    } finally {
      setSyncing(false);
    }
  };

  const navLinks = [
    { name: "Matches", href: "/fixtures", icon: Calendar },
    { name: "Table", href: "/standings", icon: Trophy },
    { name: "Squad Builder", href: "/squad-builder", icon: Compass, badge: "Pro" },
    { name: "Compare", href: "/compare", icon: Scale },
    { name: "Players", href: "/players", icon: User },
    { name: "Clubs", href: "/teams", icon: Shield },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
            : "bg-white border-b border-slate-100"
        }`}
      >
        {/* Top Ticker Micro-Bar (Editorial broadcast context) */}
        <div className="bg-[#38003c] text-white text-[11px] font-semibold py-1.5 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] tracking-wide border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE 2026/27
              </span>
              <span className="hidden sm:inline text-purple-200/90 font-medium">
                Official Premier League Analytics & Tactical Command Center
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <button
                onClick={handleSyncData}
                disabled={syncing}
                title="Sync Live Data with Official EPL API"
                className="inline-flex items-center gap-1 text-purple-200 hover:text-white transition-colors"
              >
                <RefreshCw size={11} className={syncing ? "animate-spin text-emerald-400" : ""} />
                <span>{syncing ? "Syncing..." : "Sync EPL"}</span>
              </button>
              <span className="text-purple-300/40">|</span>
              <Link to="/fixtures" className="text-purple-200 hover:text-white transition-colors font-medium">
                Gameweek Hub
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center p-1.5 group-hover:border-purple-200 transition-colors">
              <img
                src={logo}
                alt="Premier Zone Logo"
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900 leading-none group-hover:text-purple-950 transition-colors">
                  PREMIER<span className="text-purple-700">ZONE</span>
                </span>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-purple-100 text-purple-900 rounded font-mono">
                  PRO
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
                Tactics & Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`relative px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? "text-purple-950 bg-purple-50/80 font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-emerald-500 text-white rounded-md tracking-wider">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-purple-700 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Tools & Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Player Search Button */}
            <Link
              to="/players"
              title="Search 660+ Premier League Players"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 text-xs font-medium bg-slate-50/50 hover:bg-white transition-all shadow-2xs"
            >
              <Search size={14} className="text-slate-400" />
              <span>Search players...</span>
              <kbd className="text-[10px] font-mono bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded border border-slate-200">
                /
              </kbd>
            </Link>

            <div className="w-[1px] h-6 bg-slate-200" />

            {/* Authentication States */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/squad-builder"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100/70 border border-purple-200/70 text-purple-950 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-purple-800 text-white text-[10px] font-black flex items-center justify-center">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-xs font-bold truncate max-w-[100px]">{user?.username}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-purple-950 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-black uppercase tracking-wider bg-purple-900 hover:bg-purple-950 text-white px-3.5 py-2 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/players"
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              title="Search"
            >
              <Search size={18} />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white z-50 shadow-2xl flex flex-col p-6 lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 p-1 border border-purple-100">
                    <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-slate-900 text-sm tracking-tight">
                    PREMIER<span className="text-purple-700">ZONE</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="py-6 space-y-1.5 flex-1 overflow-y-auto">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-purple-50 text-purple-950 font-black"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={isActive ? "text-purple-700" : "text-slate-400"} />
                        <span>{link.name}</span>
                      </div>
                      {link.badge && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-emerald-500 text-white rounded">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Footer & Auth */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-purple-800 text-white text-[10px] font-black flex items-center justify-center">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.username}</p>
                        <p className="text-[10px] text-slate-400">{user?.email || "Scout Member"}</p>
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      className="py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="py-2.5 text-center text-xs font-black uppercase tracking-wider text-white bg-purple-900 rounded-xl hover:bg-purple-950 transition-colors"
                    >
                      Join Free
                    </Link>
                  </div>
                )}

                <button
                  onClick={handleSyncData}
                  disabled={syncing}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-slate-500 hover:text-purple-700 transition-colors"
                >
                  <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
                  <span>{syncing ? "Syncing..." : "Sync Live EPL Data"}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
