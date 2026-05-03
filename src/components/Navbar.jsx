import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo1.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-700 ${
        scrolled
          ? "bg-heritage-base/90 backdrop-blur-md py-3 border-b border-heritage-border"
          : "bg-transparent py-6 border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
        {/* Logo / Masthead */}
        <Link
          to="/"
          className="flex items-center gap-4 group"
        >
          <img
            src={logo}
            alt="Logo"
            className="h-8 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="h-6 w-px bg-heritage-border hidden sm:block"></div>
          <span className="text-lg font-black tracking-[-1px] text-heritage-text uppercase">
            Premier<span className="text-heritage-accent italic font-serif lowercase">Zone</span>
          </span>
        </Link>

        {/* Desktop Editorial Navigation */}
        <div className="hidden md:flex gap-12 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`relative text-[11px] font-black uppercase tracking-[3px] transition-all duration-500 group ${
                location.pathname === link.href ? "text-heritage-accent" : "text-heritage-text/40 hover:text-heritage-text"
              }`}
            >
              {link.name}
              {/* Fine Underline */}
              <span className={`absolute -bottom-1 left-0 h-px bg-heritage-accent transition-all duration-700 ${
                location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
          ))}
          
          <button className="p-2 text-heritage-text/40 hover:text-heritage-accent transition-colors">
            <Search size={18} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-heritage-text"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Editorial Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-0 top-0 left-0 w-full h-screen bg-heritage-base z-[999] flex flex-col p-12 justify-center"
          >
            <div className="space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[4px] text-heritage-accent">Menu</p>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="flex justify-between items-end border-b border-heritage-border pb-4 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-5xl font-serif italic text-heritage-text group-hover:text-heritage-accent transition-colors">
                      {link.name}
                    </span>
                    <ArrowRight size={24} className="text-heritage-accent opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                  </Link>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 p-4 text-heritage-text"
            >
              <X size={32} strokeWidth={1} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
