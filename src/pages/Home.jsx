import { motion } from "framer-motion";
import { ArrowRight, Users, Globe, Trophy, Compass, Star, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";

export default function Home() {
  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.15, duration: 0.8 }
    }
  };

  const itemVars = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } }
  };

  // Mock fixtures for authentic football look
  const fixtures = [
    { home: "ARS", away: "CHE", homeScore: 2, awayScore: 1, time: "FT", status: "completed" },
    { home: "MCI", away: "LIV", homeScore: 3, awayScore: 3, time: "84'", status: "live" },
    { home: "MUN", away: "TOT", homeScore: 0, awayScore: 1, time: "FT", status: "completed" },
    { home: "NEW", away: "AVL", homeScore: 0, awayScore: 0, time: "21:00", status: "upcoming" },
  ];

  // Mock stat leaders for visual interest
  const topScorers = [
    { name: "Erling Haaland", club: "Man City", stat: "27 Goals", pos: "1" },
    { name: "Cole Palmer", club: "Chelsea", stat: "22 Goals", pos: "2" },
    { name: "Mohamed Salah", club: "Liverpool", stat: "19 Goals", pos: "3" },
  ];

  return (
    <motion.div
      variants={containerVars}
      initial="initial"
      animate="animate"
      className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto relative"
    >
      {/* Background blobs in light purple/pink tints */}
      <div className="blob w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-200/40 top-[5%] right-[-5%]"></div>
      <div className="blob w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-pink-100/40 bottom-[5%] left-[-5%]"></div>

      {/* Live Fixtures Ticker */}
      <motion.div variants={itemVars} className="mb-10 w-full overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">Matchday Ticker</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Calendar size={12} />
            July 19, 2026
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fixtures.map((f, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-3 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-purple-200 transition-all duration-300">
              <div className="flex items-center justify-between text-[11px] font-black text-slate-400 mb-2">
                <span className="uppercase tracking-widest">Premier League</span>
                {f.status === "live" ? (
                  <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-extrabold text-[9px] animate-pulse">LIVE {f.time}</span>
                ) : f.status === "completed" ? (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-extrabold text-[9px]">FT</span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-extrabold text-[9px]">{f.time}</span>
                )}
              </div>
              <div className="flex items-center justify-between my-1">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800 text-sm">{f.home}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800 text-sm">{f.away}</span>
                  </div>
                </div>
                {f.status !== "upcoming" ? (
                  <div className="flex flex-col text-right font-black text-slate-800 text-sm gap-1">
                    <span>{f.homeScore}</span>
                    <span>{f.awayScore}</span>
                  </div>
                ) : (
                  <div className="text-right text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1.5 rounded-lg border border-purple-100">
                    VS
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Content (Grid span 7) */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8">
          <motion.div variants={itemVars} className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-950">24/25 Season Live Analytics</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.95] tracking-tighter text-slate-900">
              Explore the <br />
              <span className="text-accent-gradient">Premier League.</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
              Get detailed performance analytics, club squads, player positions, 
              and tactical frameworks wrapped in a premium sports-scouting interface.
            </p>
          </motion.div>

          <motion.div variants={itemVars} className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
            <Link to="/teams" className="btn-glass group w-full sm:w-auto">
              Explore Clubs
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/players" className="btn-glass-outline w-full sm:w-auto">
              View All Players
            </Link>
          </motion.div>

          {/* Quick Metrics Cards */}
          <motion.div variants={itemVars} className="grid grid-cols-3 gap-4 pt-4">
            {[
              { label: "Squad Members", val: "500+" },
              { label: "Active Clubs", val: "20" },
              { label: "Global Nations", val: "60+" }
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:border-purple-200 transition-all duration-300">
                <p className="text-xl sm:text-2xl font-black text-purple-950">{stat.val}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Content: Premium Widgets (Grid span 5) */}
        <motion.div variants={itemVars} className="lg:col-span-5 space-y-6">
          
          {/* Main Visual: Big Club Crest / Logo Banner */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_8px_30px_rgba(55,0,60,0.02)] relative overflow-hidden group">
            {/* Field lines aesthetic overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">Stats Leaders</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <TrendingUp size={12} className="text-green-500" />
                EPL Live
              </span>
            </div>

            <div className="space-y-3">
              {topScorers.map((scorer, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-purple-50/50 transition-colors border border-transparent hover:border-purple-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-950 text-white font-black text-xs flex items-center justify-center">
                      {scorer.pos}
                    </span>
                    <div>
                      <p className="text-xs font-black text-slate-800">{scorer.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">{scorer.club}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                    {scorer.stat}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interactive Dashboard</span>
              <Link to="/players" className="text-xs font-black text-purple-700 hover:text-purple-900 flex items-center gap-1">
                <span>View Full Standings</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Tactical Pitch Board Mini Card */}
          <div className="bg-gradient-to-br from-purple-950 to-slate-900 p-6 rounded-3xl text-white shadow-[0_8px_30px_rgba(55,0,60,0.1)] relative overflow-hidden group">
            {/* Pitch Layout Graphics */}
            <div className="absolute inset-0 opacity-[0.06] border border-white m-3 rounded-2xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/20 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 pointer-events-none" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Tactics Module</span>
                <h3 className="text-lg font-black text-white leading-tight">Field Formations</h3>
                <p className="text-[11px] text-slate-300 font-semibold max-w-[200px]">Filter players by specific squad roles and build your tactical lineup.</p>
              </div>
              <Link
                to="/positions"
                className="w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-purple-950 border border-white/15 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 group"
              >
                <Compass size={20} className="group-hover:rotate-45 transition-transform duration-500" />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Decorative Bold Typography Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="fixed bottom-0 left-0 w-full overflow-hidden pointer-events-none whitespace-nowrap -mb-16 z-[-1]"
      >
        <span className="text-[20vw] font-black uppercase tracking-tighter text-purple-950/20 select-none">PREMIER ZONE</span>
      </motion.div>
    </motion.div>
  );
}
