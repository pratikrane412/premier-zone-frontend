import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Search, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo1.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Clubs", href: "/teams" },
    { name: "Nations", href: "/nations" },
    { name: "Tactics", href: "/positions" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-slate-100"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
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
              Stats Hub
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`relative text-[14px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-purple-900 bg-purple-50"
                    : "text-slate-600 hover:text-purple-700 hover:bg-slate-50"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute bottom-0 left-3 right-3 h-[3px] bg-purple-600 rounded-full"
                  />
                )}
              </Link>
            );
          })}
          
          <div className="w-[1px] h-6 bg-slate-200 mx-2" />

          <div className="flex items-center gap-2">
            <div className="relative group/search">
              <input
                type="text"
                placeholder="Search..."
                className="w-40 focus:w-60 bg-slate-50 border border-slate-200 text-xs font-semibold px-4 py-2 pl-9 rounded-full focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400"
              />
              <Search size={14} className="absolute left-3.5 top-2.5 text-slate-400 group-focus-within/search:text-purple-600 transition-colors" />
            </div>
            
            <Link
              to="/teams"
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-950 text-white hover:bg-purple-900 text-xs font-extrabold uppercase tracking-wider rounded-full shadow-md shadow-purple-950/10 hover:shadow-purple-950/20 active:scale-95 transition-all duration-200"
            >
              <Trophy size={12} className="text-yellow-400" />
              <span>Clubs</span>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            className="p-2.5 text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
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
              className="md:hidden fixed top-0 right-0 w-[85%] max-w-[360px] h-screen bg-white border-l border-slate-100 z-[999] flex flex-col p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-900 tracking-tighter">PREMIER<span className="text-purple-600">ZONE</span></span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`flex justify-between items-center p-4 rounded-xl border transition-all duration-200 ${
                        isActive 
                          ? "bg-purple-50 border-purple-100 text-purple-900 font-extrabold" 
                          : "bg-slate-50 border-slate-100 text-slate-700 font-bold hover:bg-slate-100 hover:border-slate-200"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-lg uppercase tracking-wider">{link.name}</span>
                      <ArrowRight size={18} className={isActive ? "text-purple-600" : "text-slate-400"} />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search teams/players..."
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold px-4 py-3 pl-10 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-slate-800"
                  />
                  <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                </div>
                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50 text-center">
                  <Trophy size={24} className="text-yellow-500 mx-auto mb-2" />
                  <span className="text-xs font-black text-purple-950 uppercase tracking-widest">Premier Zone Dashboard</span>
                  <p className="text-[10px] text-purple-800 mt-1 font-semibold">24/25 Season Statistics & Tactics</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
