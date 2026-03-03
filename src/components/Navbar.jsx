import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Activity } from "lucide-react";
import logo from "../assets/logo1.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 1. Handle scroll to add depth when moving down the page
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Teams", href: "/teams" },
    { name: "Nations", href: "/nations" },
    { name: "Positions", href: "/positions" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 border-b ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl py-3 border-slate-200 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
          : "bg-white py-5 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-brand-secondary/20 rounded-full blur-md scale-0 group-hover:scale-150 transition-transform duration-500"></div>
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto object-contain relative z-10"
            />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            Premier<span className="text-brand-primary italic">Zone</span>
          </span>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10 items-center">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative text-[11px] font-black uppercase tracking-[2px] text-slate-400 hover:text-brand-primary transition-colors group"
            >
              {link.name}
              {/* Animated Underline */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-secondary transition-all duration-300 group-hover:w-full"></span>
            </motion.a>
          ))}

          
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-slate-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex justify-between items-center text-2xl font-black text-slate-900 group"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  <ChevronRight
                    size={20}
                    className="text-brand-secondary group-hover:translate-x-2 transition-transform"
                  />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
