import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Trophy,
  Compass,
  Sparkles,
  TrendingUp,
  Calendar,
  Scale,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fixturesApi } from "../api/fixturesApi";
import { playersApi } from "../api/playersApi";
import { standingsApi } from "../api/standingsApi";
import PlayerAvatar from "../components/common/PlayerAvatar";
import TeamCrest from "../components/common/TeamCrest";

export default function Home() {
  const [fixtures, setFixtures] = useState([]);
  const [leaderboards, setLeaderboards] = useState(null);
  const [topStandings, setTopStandings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fixturesRes, leaderboardsRes, standingsRes] = await Promise.all([
          fixturesApi.getAll({ limit: 4 }),
          playersApi.getLeaderboards(),
          standingsApi.getStandings('all'),
        ]);
        setFixtures(fixturesRes || []);
        setLeaderboards(leaderboardsRes);
        setTopStandings((standingsRes || []).slice(0, 4));
      } catch (err) {
        console.error("Home feed fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.12, duration: 0.7 },
    },
  };

  const itemVars = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } },
  };

  const topScorers = leaderboards?.top_scorers || [];

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

      {/* Live Fixtures Ticker from Live API */}
      <motion.div variants={itemVars} className="mb-10 w-full overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              Live Matchday Slate
            </span>
          </div>
          <Link
            to="/fixtures"
            className="text-[10px] font-bold text-purple-700 hover:text-purple-900 uppercase tracking-widest flex items-center gap-1"
          >
            <Calendar size={12} />
            View All Fixtures →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fixtures.map((f, i) => (
            <Link
              key={f.id || i}
              to={`/match/${f.id}`}
              title="Click to view full FotMob Match Center"
              className="bg-white border border-slate-100 rounded-2xl p-3 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-purple-300 hover:shadow-md active:scale-[0.99] transition-all duration-300 group/card block"
            >


              <div className="flex items-center justify-between text-[11px] font-black text-slate-400 mb-2">
                <span className="uppercase tracking-widest text-[9px] truncate max-w-[100px]">
                  {f.venue || 'Premier League'}
                </span>
                {f.status === "LIVE" ? (
                  <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-extrabold text-[9px] animate-pulse">
                    LIVE
                  </span>
                ) : f.status === "FINISHED" ? (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-extrabold text-[9px]">
                    FT
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-extrabold text-[9px]">
                    {new Date(f.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between my-1">
                <div className="flex flex-col gap-1.5 flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <TeamCrest
                      crestUrl={f.home_crest}
                      teamName={f.home_team_name}
                      className="w-4 h-4 object-contain"
                    />
                    <span className="font-extrabold text-slate-800 text-xs truncate">
                      {f.home_team_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TeamCrest
                      crestUrl={f.away_crest}
                      teamName={f.away_team_name}
                      className="w-4 h-4 object-contain"
                    />
                    <span className="font-extrabold text-slate-800 text-xs truncate">
                      {f.away_team_name}
                    </span>
                  </div>

                </div>

                {f.home_score !== null && f.away_score !== null ? (
                  <div className="flex flex-col text-right font-black text-slate-800 text-xs gap-1.5">
                    <span>{f.home_score}</span>
                    <span>{f.away_score}</span>
                  </div>
                ) : (
                  <div className="text-right text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                    VS
                  </div>
                )}
              </div>
            </Link>
          ))}

        </div>
      </motion.div>

      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Content (Grid span 7) */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8">
          <motion.div variants={itemVars} className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-950">
                Official Live Premier League Data
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-black leading-[0.95] tracking-tighter text-slate-900">
              Scout the <br />
              <span className="text-accent-gradient">Premier League.</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
              Live performance metrics, tactical squad builder with salary caps,
              head-to-head radar comparisons, and statistical match prediction models.
            </p>
          </motion.div>

          {/* Call to Actions */}
          <motion.div
            variants={itemVars}
            className="flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start"
          >
            <Link to="/squad-builder" className="btn-glass group w-full sm:w-auto">
              Build Dream XI
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/compare" className="btn-glass-outline w-full sm:w-auto flex items-center gap-2">
              <Scale size={16} />
              Compare Players
            </Link>
          </motion.div>

          {/* Quick Metrics Cards */}
          <motion.div variants={itemVars} className="grid grid-cols-3 gap-4 pt-2">
            {[
              { label: "Active Players", val: "660+" },
              { label: "Premier Clubs", val: "20" },
              { label: "Live Matchdays", val: "38 GWs" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:border-purple-200 transition-all duration-300"
              >
                <p className="text-xl sm:text-2xl font-black text-purple-950">{stat.val}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Content: Live Leaders & Tactics Widget (Grid span 5) */}
        <motion.div variants={itemVars} className="lg:col-span-5 space-y-6">
          {/* Live Top Scorers Widget with Official API Photos */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_8px_30px_rgba(55,0,60,0.02)] relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Golden Boot Leaders
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-500" />
                Official EPL Live
              </span>
            </div>

            <div className="space-y-3">
              {topScorers.slice(0, 4).map((scorer, i) => (
                <div
                  key={scorer.id || i}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-purple-50/50 transition-colors border border-transparent hover:border-purple-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-purple-950 text-white font-black text-[10px] flex items-center justify-center">
                      {i + 1}
                    </span>
                    {/* Official Cutout Photo from API */}
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-end justify-center border border-slate-200 flex-shrink-0">
                      <PlayerAvatar
                        photoUrl={scorer.photo_url}
                        name={scorer.player_name}
                        position={scorer.position}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-black text-slate-800">{scorer.player_name}</p>
                      <p className="text-[10px] font-bold text-slate-400">{scorer.team_name}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                    {scorer.goals} Goals
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Scouting Database
              </span>
              <Link
                to="/players"
                className="text-xs font-black text-purple-700 hover:text-purple-900 flex items-center gap-1"
              >
                <span>Full Player Roster</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Live Standings Snapshot Widget */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_8px_30px_rgba(55,0,60,0.02)] relative overflow-hidden group">

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-purple-700" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  UCL Qualification Spots
                </span>
              </div>
              <Link
                to="/standings"
                className="text-xs font-black text-purple-700 hover:text-purple-950 flex items-center gap-1"
              >
                <span>Full Table</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="divide-y divide-slate-50">
              {topStandings.map((team, idx) => (
                <div
                  key={team.team_name || idx}
                  className="flex items-center justify-between py-2 hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">
                      {team.position}
                    </span>
                    <TeamCrest
                      crestUrl={team.crest_url}
                      teamName={team.team_name}
                      className="w-5 h-5 object-contain"
                    />
                    <span className="text-xs font-black text-slate-800 truncate max-w-[130px]">
                      {team.team_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[11px] font-bold text-slate-400">{team.played} MP</span>
                    <span className="font-black text-purple-950 px-2 py-0.5 rounded bg-purple-50">
                      {team.points} Pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tactics Pitch Mini Teaser */}
          <div className="bg-gradient-to-br from-purple-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
                  Manager Mode
                </span>
                <h3 className="text-lg font-black text-white leading-tight">11-a-side Tactics Board</h3>
                <p className="text-[11px] text-slate-300 font-semibold max-w-[220px]">
                  Pick your Starting XI under £100M budget with formation strategies.
                </p>
              </div>
              <Link
                to="/squad-builder"
                className="w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-purple-950 border border-white/15 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 group"
              >
                <Compass size={20} className="group-hover:rotate-45 transition-transform duration-500" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}


