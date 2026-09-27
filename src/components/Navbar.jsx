import { useState, useEffect } from "react";
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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { name: "Home", href: "/" },
    { name: "Table", href: "/standings" },
    { name: "Fixtures", href: "/fixtures" },
    { name: "Squad Builder", href: "/squad-builder", badge: "Pro" },
    { name: "Compare", href: "/compare" },
    { name: "Players", href: "/players" },
    { name: "Clubs", href: "/teams" },
  ];


  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-slate-100"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative p-2 bg-purple-50 rounded-xl border border-purple-100/50 group-hover:border-purple-200 transition-all duration-300">
            <img
              src={logo}
              alt="Premier Zone"
              className="h-8 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-slate-900 leading-none group-hover:text-purple-950 transition-colors">
              PREMIER<span className="text-purple-600">ZONE</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
              Live Analytics Pro
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-6 items-center">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`relative text-[13px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "text-purple-900 bg-purple-50"
                    : "text-slate-600 hover:text-purple-700 hover:bg-slate-50"
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-emerald-500 text-white rounded-md shadow-xs">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute bottom-0 left-3 right-3 h-[3px] bg-purple-600 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Controls & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Live Sync Trigger Button */}
          <button
            onClick={handleSyncData}
            disabled={syncing}
            title="Sync Live Data from Official Premier League API"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-black transition-colors border border-purple-100"
          >
            <RefreshCw size={13} className={syncing ? "animate-spin text-purple-600" : ""} />
            <span>{syncing ? "Syncing..." : "Sync Live EPL"}</span>
          </button>

          <div className="w-[1px] h-6 bg-slate-200 mx-1" />

          {/* User Auth Info */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
                <User size={14} className="text-purple-700" />
                <span className="text-xs font-black text-slate-800">{user?.username}</span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-950 hover:bg-purple-900 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95"
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            className="p-2.5 text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[998]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 w-[85%] max-w-[360px] h-screen bg-white border-l border-slate-100 z-[999] flex flex-col p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-black text-slate-900 tracking-tighter">
                  PREMIER<span className="text-purple-600">ZONE</span>
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`flex justify-between items-center p-3.5 rounded-2xl border transition-all ${
                        isActive
                          ? "bg-purple-50 border-purple-100 text-purple-900 font-extrabold"
                          : "bg-slate-50 border-slate-100 text-slate-700 font-bold hover:bg-slate-100"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-sm uppercase tracking-wider">{link.name}</span>
                      <ArrowRight size={16} className={isActive ? "text-purple-600" : "text-slate-400"} />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100 space-y-3">
                <button
                  onClick={handleSyncData}
                  disabled={syncing}
                  className="w-full py-2.5 bg-purple-50 text-purple-900 rounded-xl text-xs font-black flex items-center justify-center gap-2 border border-purple-100"
                >
                  <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
                  <span>Sync Live Premier League Data</span>
                </button>

                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full py-2.5 bg-red-50 text-red-700 rounded-xl text-xs font-black flex items-center justify-center gap-2"
                  >
                    <LogOut size={14} />
                    <span>Sign Out ({user?.username})</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 bg-purple-950 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2"
                  >
                    <LogIn size={14} />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
