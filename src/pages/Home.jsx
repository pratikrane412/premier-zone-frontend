import { motion } from "framer-motion";
import { ArrowRight, Users, Globe, Trophy, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";

export default function Home() {
  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.2, duration: 1 }
    }
  };

  const itemVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.23, 1, 0.32, 1] } }
  };

  return (
    <motion.div
      variants={containerVars}
      initial="initial"
      animate="animate"
      className="min-h-screen pt-40 pb-20 px-8 max-w-[1400px] mx-auto"
    >
      {/* Editorial Spread Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        
        {/* Left Column: Masthead & Main Content */}
        <div className="lg:col-span-7 space-y-16">
          <motion.div variants={itemVars} className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[5px] text-heritage-accent">Issue No. 24/25</span>
              <div className="h-px flex-1 bg-heritage-border"></div>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-serif italic text-heritage-text leading-[0.85] tracking-tight">
              The Art of <br />
              <span className="not-italic text-heritage-accent">The Pitch.</span>
            </h1>
            
            <p className="text-xl text-heritage-muted max-w-lg leading-relaxed font-sans">
              A curated perspective on the world's most prestigious football league. 
              Where high-fidelity data meets timeless editorial design.
            </p>
          </motion.div>

          <motion.div variants={itemVars} className="flex flex-col sm:flex-row gap-8 items-start">
            <Link to="/teams" className="btn-premium group">
              Explore Clubs
              <ArrowRight size={16} className="ml-3 group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-[3px] text-heritage-text/40">Current Status</span>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-heritage-accent animate-pulse"></div>
                <span className="text-sm font-serif italic text-heritage-text">Live Database Syncing</span>
              </div>
            </div>
          </motion.div>

          {/* Editorial Stats Row */}
          <motion.div variants={itemVars} className="grid grid-cols-2 gap-12 pt-12 border-t border-heritage-border">
            <div className="space-y-4">
              <p className="text-4xl font-serif italic text-heritage-text">500<span className="text-heritage-accent">+</span></p>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[3px] text-heritage-text">Active Professionals</p>
                <p className="text-xs text-heritage-muted">Detailed performance profiles and tactical insights.</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-4xl font-serif italic text-heritage-text">60<span className="text-heritage-accent">+</span></p>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[3px] text-heritage-text">Global Identities</p>
                <p className="text-xs text-heritage-muted">A diverse international distribution of world-class talent.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Visual Centerpiece */}
        <div className="lg:col-span-5 flex flex-col gap-12">
          <motion.div 
            variants={itemVars}
            className="relative aspect-[4/5] bg-white border border-heritage-border p-12 flex items-center justify-center group"
          >
            {/* Fine Lined Frame */}
            <div className="absolute inset-4 border border-heritage-border/40 pointer-events-none group-hover:border-heritage-accent/20 transition-colors duration-1000"></div>
            
            {/* The Logo: Pure and Elevated */}
            <img
              src={logo}
              alt="Premier League"
              className="w-full h-auto object-contain filter grayscale group-hover:grayscale-0 contrast-[1.1] transition-all duration-1000 scale-[0.8] group-hover:scale-[0.85]"
            />

            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-8 h-px bg-heritage-accent"></div>
            <div className="absolute top-0 left-0 w-px h-8 bg-heritage-accent"></div>
            <div className="absolute bottom-0 right-0 w-8 h-px bg-heritage-accent"></div>
            <div className="absolute bottom-0 right-0 w-px h-8 bg-heritage-accent"></div>
          </motion.div>

          <motion.div variants={itemVars} className="space-y-6 bg-heritage-text text-heritage-base p-10">
            <div className="flex items-center gap-4">
              <Trophy size={20} className="text-heritage-accent" />
              <h3 className="text-[10px] font-black uppercase tracking-[4px]">Tactical Focus</h3>
            </div>
            <p className="text-lg font-serif italic leading-snug">
              "Tactics without data is just an opinion. Data without tactics is just numbers."
            </p>
            <div className="h-px w-12 bg-heritage-accent"></div>
            <p className="text-[10px] uppercase tracking-[2px] opacity-40">Editor's Note — Season 24/25</p>
          </motion.div>
        </div>

      </div>

      {/* Decorative Text Wrapper */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ delay: 1.5, duration: 2 }}
        className="fixed bottom-0 left-0 w-full overflow-hidden pointer-events-none whitespace-nowrap -mb-10 z-0"
      >
        <span className="text-[20vw] font-black uppercase tracking-tighter text-heritage-text">PREMIER ZONE</span>
      </motion.div>
    </motion.div>
  );
}
