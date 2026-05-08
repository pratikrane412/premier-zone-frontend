import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Search, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo1.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${
        scrolled
          ? "bg-glass-base/60 backdrop-blur-2xl py-3 md:py-4 border-b border-white/10"
          : "bg-transparent py-6 md:py-8 border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 md:gap-3 group"
        >
          <div className="relative p-1.5 md:p-2 bg-glass-surface rounded-lg md:rounded-xl border border-glass-border group-hover:border-glass-accent transition-all duration-500">
            <img
              src={logo}
              alt="Logo"
              className="h-6 w-auto md:h-8 object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <span className="text-lg md:text-xl font-black tracking-tighter">
            Premier<span className="text-glass-accent">Zone</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`relative text-sm font-bold transition-all duration-300 ${
                location.pathname === link.href ? "text-glass-accent" : "text-glass-muted hover:text-glass-accent"
              }`}
            >
              {link.name}
              {location.pathname === link.href && (
                <motion.div layoutId="navUnderline" className="absolute -bottom-1 left-0 w-full h-0.5 bg-glass-accent rounded-full" />
              )}
            </Link>
          ))}
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-glass-muted hover:text-glass-accent hover:border-glass-accent transition-all"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-glass-muted hover:text-glass-accent hover:border-glass-accent transition-all">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2 md:gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2.5 text-glass-text bg-white/5 rounded-xl border border-white/10"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="p-2.5 text-glass-text bg-white/5 rounded-xl border border-white/10"
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
              className="fixed inset-0 bg-glass-base/80 backdrop-blur-md z-[998]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 right-0 w-[85%] h-screen bg-glass-base border-l border-white/10 z-[999] flex flex-col p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-2xl font-black text-white">Menu</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-3 bg-white/5 rounded-xl border border-white/10 text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`flex justify-between items-center p-6 rounded-2xl border transition-all ${
                      location.pathname === link.href 
                        ? "bg-glass-accent/20 border-glass-accent text-white" 
                        : "bg-white/5 border-white/5 text-glass-muted hover:border-white/20 hover:text-white"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-2xl font-extrabold">{link.name}</span>
                    <ArrowRight size={24} />
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
