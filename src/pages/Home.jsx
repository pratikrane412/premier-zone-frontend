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
      className="min-h-screen pt-24 md:pt-28 lg:pt-32 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto relative"
    >
      {/* Dynamic Background Blobs */}
      <div className="blob w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-glass-accent/20 top-[-5%] right-[-5%]"></div>
      <div className="blob w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-glass-highlight/20 bottom-[-5%] left-[-5%] animation-delay-2000"></div>
      
      {/* Glass Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
        
        {/* Left Content */}
        <div className="space-y-6 md:space-y-10">
          <motion.div variants={itemVars} className="space-y-4 md:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-glass-highlight animate-pulse shadow-[0_0_10px_#38bdf8]"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-glass-highlight">24/25 Season Live</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter">
              <span className="text-glass-text">The New Era of</span> <br />
              <span className="text-accent-gradient">Football Data.</span>
            </h1>
            
            <p className="text-base md:text-xl text-glass-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Dive into the world's most competitive league with high-fidelity analytics 
              wrapped in a premium, immersive interface.
            </p>
          </motion.div>

          <motion.div variants={itemVars} className="flex flex-wrap gap-4 md:gap-6 items-center justify-center lg:justify-start">
            <Link to="/teams" className="btn-glass group w-full sm:w-auto">
              Explore Clubs
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/players" className="btn-glass-outline w-full sm:w-auto">
              View Players
            </Link>
          </motion.div>

          {/* Glass Stats Grid */}
          <motion.div variants={itemVars} className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-10">
            {[
              { label: "Elite Pros", val: "500+" },
              { label: "Global Clubs", val: "20" },
              { label: "Nations", val: "60+" }
            ].map((stat, i) => (
              <div key={i} className="p-4 md:p-6 glass-card !rounded-2xl border-white/5 hover:border-white/20 text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-black">{stat.val}</p>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-glass-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Content: Glass Visual */}
        <motion.div variants={itemVars} className="relative group mt-8 lg:mt-0">
          {/* Glowing Aura */}
          <div className="absolute inset-0 bg-glass-accent/20 rounded-[3rem] blur-3xl group-hover:blur-[5rem] transition-all duration-700 opacity-50"></div>
          
          <div className="relative aspect-square glass-card p-8 md:p-12 flex items-center justify-center overflow-hidden">
            {/* Inner Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            
            <motion.img
              src={logo}
              alt="Premier League"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-[70%] md:w-[75%] h-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] dark:drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            />

            {/* Floating Glass Accents */}
            <div className="absolute top-6 md:top-10 left-6 md:left-10 p-3 md:p-4 bg-glass-surface backdrop-blur-md rounded-2xl border border-glass-border text-glass-highlight animate-bounce shadow-lg">
              <Trophy size={20} className="md:w-7 md:h-7" />
            </div>
            <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 p-3 md:p-4 bg-glass-surface backdrop-blur-md rounded-2xl border border-glass-border text-glass-accent animate-pulse shadow-lg">
              <Compass size={20} className="md:w-7 md:h-7" />
            </div>
          </div>
        </motion.div>

      </div>

      {/* Background Typography */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ delay: 1, duration: 2 }}
        className="fixed bottom-0 left-0 w-full overflow-hidden pointer-events-none whitespace-nowrap -mb-12 z-[-1]"
      >
        <span className="text-[22vw] font-black uppercase tracking-tighter opacity-10">PREMIER ZONE</span>
      </motion.div>
    </motion.div>
  );
}
