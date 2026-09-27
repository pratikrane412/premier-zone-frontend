import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Trophy,
  Scale,
  Compass,
  Calendar,
  TrendingUp,
  Target,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Shield,
  Activity,
  Zap,
  Users,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fixturesApi } from "../api/fixturesApi";
import { playersApi } from "../api/playersApi";
import { standingsApi } from "../api/standingsApi";
import PlayerAvatar from "../components/common/PlayerAvatar";
import TeamCrest from "../components/common/TeamCrest";

// 20 Official Premier League Clubs Quick Ribbon Fallback Data
const DEFAULT_CLUBS = [
  { name: "Arsenal", id: "t3" },
  { name: "Aston Villa", id: "t7" },
  { name: "Bournemouth", id: "t91" },
  { name: "Brentford", id: "t94" },
  { name: "Brighton", id: "t36" },
  { name: "Chelsea", id: "t8" },
  { name: "Crystal Palace", id: "t31" },
  { name: "Everton", id: "t11" },
  { name: "Fulham", id: "t54" },
  { name: "Ipswich Town", id: "t40" },
  { name: "Leicester City", id: "t13" },
  { name: "Liverpool", id: "t14" },
  { name: "Man City", id: "t43" },
  { name: "Man Utd", id: "t1" },
  { name: "Newcastle", id: "t4" },
  { name: "Nott'm Forest", id: "t17" },
  { name: "Southampton", id: "t20" },
  { name: "Spurs", id: "t6" },
  { name: "West Ham", id: "t21" },
  { name: "Wolves", id: "t39" },
];

export default function Home() {
  const [fixtures, setFixtures] = useState([]);
  const [leaderboards, setLeaderboards] = useState(null);
  const [standings, setStandings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState("scorers");
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchAllHomeData = async () => {
      try {
        const [fixturesRes, leaderboardsRes, standingsRes, teamsRes] = await Promise.allSettled([
          fixturesApi.getAll({ limit: 10 }),
          playersApi.getLeaderboards(),
          standingsApi.getStandings("all"),
          playersApi.getTeams(true),
        ]);

        if (fixturesRes.status === "fulfilled" && fixturesRes.value) {
          setFixtures(fixturesRes.value);
        }
        if (leaderboardsRes.status === "fulfilled" && leaderboardsRes.value) {
          setLeaderboards(leaderboardsRes.value);
        }
        if (standingsRes.status === "fulfilled" && standingsRes.value) {
          setStandings(standingsRes.value);
        }
        if (teamsRes.status === "fulfilled" && Array.isArray(teamsRes.value)) {
          setTeams(teamsRes.value);
        }
      } catch (err) {
        console.error("Home data fetch error:", err);
      }
    };

    fetchAllHomeData();
  }, []);

  const scrollRibbon = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Top marquee fixture (live or highest profile upcoming match)
  const marqueeFixture = fixtures.length > 0 ? fixtures[0] : null;

  // Active leaderboard list based on tab
  const getActiveLeaderboardList = () => {
    if (!leaderboards) return [];
    switch (activeLeaderboardTab) {
      case "assists":
        return leaderboards.top_assists || [];
      case "form":
        return leaderboards.top_form || [];
      case "valued":
        return leaderboards.top_valued || [];
      case "scorers":
      default:
        return leaderboards.top_scorers || [];
    }
  };

  const currentLeaders = getActiveLeaderboardList().slice(0, 5);
  const topStandings = (standings || []).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pt-24 pb-20">
      {/* 1. MATCHDAY BROADCAST TICKER (Horizontal Responsive Bar) */}
      <section className="border-b border-slate-200 bg-white">
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Matchday Slate
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-[11px] font-semibold text-slate-500">
                Live Scores & AI Match Center
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={() => scrollRibbon("left")}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollRibbon("right")}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <Link
                to="/fixtures"
                className="text-[11px] font-bold text-purple-700 hover:text-purple-950 flex items-center gap-1 group"
              >
                <span>Full Schedule</span>
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Scrolling Fixture Cards */}
          <div
            ref={scrollRef}
            className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1"
          >
            {fixtures.length > 0 ? (
              fixtures.map((fixture) => {
                const isLive = fixture.status === "LIVE";
                const isFinished = fixture.status === "FINISHED";

                return (
                  <Link
                    key={fixture.id}
                    to={`/match/${fixture.id}`}
                    title={`${fixture.home_team_name} vs ${fixture.away_team_name} - Open Match Center`}
                    className="flex-shrink-0 w-[240px] bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-purple-300 rounded-xl p-2.5 transition-all shadow-2xs hover:shadow-sm group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1.5 pb-1 border-b border-slate-200/50">
                      <span className="text-slate-500 truncate max-w-[140px]">
                        {fixture.venue || `Gameweek ${fixture.gameweek}`}
                      </span>
                      {isLive ? (
                        <span className="px-1.5 py-0.2 bg-red-100 text-red-600 font-black rounded text-[9px] animate-pulse">
                          LIVE
                        </span>
                      ) : isFinished ? (
                        <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 font-black rounded text-[9px]">
                          FT
                        </span>
                      ) : (
                        <span className="text-purple-800 font-bold text-[10px]">
                          {new Date(fixture.match_date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>

                    {/* Home Team */}
                    <div className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-2 truncate">
                        <TeamCrest
                          crestUrl={fixture.home_crest}
                          teamName={fixture.home_team_name}
                          className="w-4 h-4 object-contain flex-shrink-0"
                        />
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {fixture.home_team_name}
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-900 ml-2">
                        {fixture.home_score !== null ? fixture.home_score : "-"}
                      </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-2 truncate">
                        <TeamCrest
                          crestUrl={fixture.away_crest}
                          teamName={fixture.away_team_name}
                          className="w-4 h-4 object-contain flex-shrink-0"
                        />
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {fixture.away_team_name}
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-900 ml-2">
                        {fixture.away_score !== null ? fixture.away_score : "-"}
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="py-2 text-xs text-slate-400">Loading live match schedule...</div>
            )}
          </div>
        </div>
      </section>

      {/* 2. OFFICIAL 20 CLUBS RIBBON */}
      <section className="bg-slate-100/60 border-b border-slate-200/80 py-2.5 overflow-x-auto no-scrollbar">
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 flex items-center justify-between gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex-shrink-0">
            Clubs
          </span>
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
            {(teams.length > 0 ? teams : DEFAULT_CLUBS).map((club, idx) => {
              const crestUrl =
                club.crest_url ||
                `https://resources.premierleague.com/premierleague/badges/70/${club.id || "t3"}.png`;
              const clubName = club.name || club.team_name || "Club";

              return (
                <Link
                  key={club.id || idx}
                  to="/teams"
                  title={clubName}
                  className="flex-shrink-0 group relative p-1 hover:bg-white rounded-lg transition-all"
                >
                  <img
                    src={crestUrl}
                    alt={clubName}
                    className="w-6 h-6 object-contain transition-transform duration-200 group-hover:scale-115"
                    loading="lazy"
                  />
                </Link>
              );
            })}
          </div>
          <Link
            to="/teams"
            className="text-[10px] font-bold text-purple-700 hover:text-purple-950 flex-shrink-0 uppercase tracking-wider"
          >
            All 20 →
          </Link>
        </div>
      </section>

      {/* 3. MAIN EDITORIAL HERO SECTION */}
      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Mission & Strategic Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-900 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-purple-700 animate-ping" />
              <span>Official Live Premier League Intelligence</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.05]">
                Precision Scouting & Matchday Tactics.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl">
                The modern analytics command center for English football. Build tactical starting
                XIs within a £100M fantasy salary cap, compare players with 5-axis radar models, and
                track live match momentum with official Premier League data.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/squad-builder"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-black text-sm uppercase tracking-wider shadow-sm hover:shadow transition-all active:scale-[0.98]"
              >
                <Compass size={18} />
                <span>Build Starting XI</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500 text-white rounded font-mono">
                  PRO
                </span>
              </Link>

              <Link
                to="/compare"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-2xs hover:shadow-xs transition-all active:scale-[0.98]"
              >
                <Scale size={18} className="text-purple-700" />
                <span>Radar Comparison</span>
              </Link>

              <Link
                to="/standings"
                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple-800 hover:text-purple-950 px-3 py-2"
              >
                <span>Full League Table</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Verified Statistics Strip */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 max-w-lg">
              <div>
                <p className="text-2xl font-black text-slate-900">20</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Official Clubs
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">660+</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Scouted Players
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600">380</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Matches & xG
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Marquee Matchday Spotlight Card */}
          <div className="lg:col-span-5">
            {marqueeFixture ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.06)] overflow-hidden">
                {/* Card Header */}
                <div className="bg-[#38003c] text-white px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Featured Match of the Week
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-purple-200">
                    Gameweek {marqueeFixture.gameweek}
                  </span>
                </div>

                {/* Matchup Showdown */}
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    {/* Home Club */}
                    <div className="flex-1 text-center space-y-2">
                      <div className="w-16 h-16 mx-auto flex items-center justify-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
                        <TeamCrest
                          crestUrl={marqueeFixture.home_crest}
                          teamName={marqueeFixture.home_team_name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <p className="font-black text-sm text-slate-900 truncate">
                        {marqueeFixture.home_team_name}
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        Home
                      </span>
                    </div>

                    {/* Score / Center Divider */}
                    <div className="flex flex-col items-center justify-center px-2">
                      {marqueeFixture.home_score !== null && marqueeFixture.away_score !== null ? (
                        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200">
                          <span className="text-2xl font-black text-slate-900">
                            {marqueeFixture.home_score}
                          </span>
                          <span className="text-slate-400 font-bold">-</span>
                          <span className="text-2xl font-black text-slate-900">
                            {marqueeFixture.away_score}
                          </span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-900 font-black text-xs flex items-center justify-center border border-purple-200">
                          VS
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">
                        {marqueeFixture.status === "FINISHED"
                          ? "Full Time"
                          : marqueeFixture.status === "LIVE"
                          ? "In Progress"
                          : "Upcoming"}
                      </span>
                    </div>

                    {/* Away Club */}
                    <div className="flex-1 text-center space-y-2">
                      <div className="w-16 h-16 mx-auto flex items-center justify-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
                        <TeamCrest
                          crestUrl={marqueeFixture.away_crest}
                          teamName={marqueeFixture.away_team_name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <p className="font-black text-sm text-slate-900 truncate">
                        {marqueeFixture.away_team_name}
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        Away
                      </span>
                    </div>
                  </div>

                  {/* Stadium & Meta */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600 truncate">
                      📍 {marqueeFixture.venue || "Premier League Ground"}
                    </span>
                    <span className="font-bold text-purple-950 font-mono text-[11px]">
                      {new Date(marqueeFixture.match_date).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* AI Win Probability Simulation Preview */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                      <span>Simulated Probability</span>
                      <span className="text-purple-700">Poisson Model</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div style={{ width: "48%" }} className="bg-purple-800" title="Home: 48%" />
                      <div style={{ width: "26%" }} className="bg-slate-300" title="Draw: 26%" />
                      <div style={{ width: "26%" }} className="bg-emerald-500" title="Away: 26%" />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>{marqueeFixture.home_team_name} 48%</span>
                      <span>Draw 26%</span>
                      <span>{marqueeFixture.away_team_name} 26%</span>
                    </div>
                  </div>

                  {/* Action Link to Full-Page Match Center */}
                  <Link
                    to={`/match/${marqueeFixture.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-50 hover:bg-purple-100/80 text-purple-950 font-black text-xs uppercase tracking-wider border border-purple-200 transition-colors"
                  >
                    <span>Open Live Match Center</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="h-[380px] bg-white rounded-3xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                Loading spotlight fixture...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. DUAL SCOUTING HUBS: LEADERBOARD RACE & STANDINGS SNAPSHOT */}
      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Player Performance Race Hub (Col span 7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Trophy size={20} className="text-amber-500" />
                  <span>Scouting Performance Leaders</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official live player metrics verified from Premier League API
                </p>
              </div>

              {/* Leaderboard Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: "scorers", label: "Goals" },
                  { id: "assists", label: "Assists" },
                  { id: "form", label: "Form" },
                  { id: "valued", label: "Value" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveLeaderboardTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeLeaderboardTab === tab.id
                        ? "bg-white text-purple-950 font-black shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Leaderboard Rows */}
            <div className="divide-y divide-slate-100">
              {currentLeaders.length > 0 ? (
                currentLeaders.map((player, idx) => (
                  <div
                    key={player.id || idx}
                    className="py-3 flex items-center justify-between gap-4 group hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                          idx === 0
                            ? "bg-amber-400 text-amber-950"
                            : idx === 1
                            ? "bg-slate-200 text-slate-800"
                            : idx === 2
                            ? "bg-amber-700/20 text-amber-900"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {idx + 1}
                      </span>

                      {/* Player Avatar */}
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                        <PlayerAvatar
                          photoUrl={player.photo_url}
                          name={player.player_name}
                          position={player.position}
                        />
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black text-slate-900 truncate">
                            {player.player_name}
                          </p>
                          <span className="text-[9px] font-bold uppercase px-1 py-0.2 bg-slate-100 text-slate-600 rounded">
                            {player.position}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">{player.team_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-black text-purple-950">
                          {activeLeaderboardTab === "scorers"
                            ? `${player.goals || 0} Goals`
                            : activeLeaderboardTab === "assists"
                            ? `${player.assists || 0} Assists`
                            : activeLeaderboardTab === "form"
                            ? `${player.form || "0.0"} Form`
                            : `£${(player.market_value_eur || 0).toFixed(1)}M`}
                        </span>
                      </div>

                      <Link
                        to={`/compare?p1=${player.id}`}
                        title={`Compare ${player.player_name}`}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-purple-700 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                      >
                        <Scale size={14} />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">Loading leaders...</div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Scouting 660+ active Premier League profiles</span>
              <Link
                to="/players"
                className="font-bold text-purple-700 hover:text-purple-950 flex items-center gap-1"
              >
                <span>Browse All Players</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right: Live Standings Snapshot (Col span 5) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Shield size={20} className="text-purple-700" />
                  <span>League Standings</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Top 5 European qualification snapshot</p>
              </div>

              <Link
                to="/standings"
                className="text-xs font-black text-purple-700 hover:text-purple-950 uppercase tracking-wider flex items-center gap-1"
              >
                <span>Full Table</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            {/* Standings Mini Table */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-[10px] font-black uppercase text-slate-400 px-2 pb-1">
                <span className="col-span-1">#</span>
                <span className="col-span-7">Club</span>
                <span className="col-span-2 text-center">MP</span>
                <span className="col-span-2 text-right">Pts</span>
              </div>

              <div className="divide-y divide-slate-100">
                {topStandings.length > 0 ? (
                  topStandings.map((club, idx) => (
                    <div
                      key={club.team_name || idx}
                      className="grid grid-cols-12 items-center py-2.5 px-2 hover:bg-slate-50 rounded-xl transition-colors text-xs"
                    >
                      <div className="col-span-1">
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] text-white ${
                            idx < 4 ? "bg-blue-600" : "bg-amber-600"
                          }`}
                        >
                          {club.position || idx + 1}
                        </span>
                      </div>

                      <div className="col-span-7 flex items-center gap-2 truncate">
                        <TeamCrest
                          crestUrl={club.crest_url}
                          teamName={club.team_name}
                          className="w-5 h-5 object-contain flex-shrink-0"
                        />
                        <span className="font-bold text-slate-900 truncate">{club.team_name}</span>
                      </div>

                      <div className="col-span-2 text-center text-slate-500 font-medium">
                        {club.played || 0}
                      </div>

                      <div className="col-span-2 text-right font-black text-purple-950 font-mono text-sm">
                        {club.points || 0}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">Loading standings...</div>
                )}
              </div>
            </div>

            {/* European Zone Legend */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Champions League (1-4)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span>Europa League (5)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TACTICAL SQUAD BUILDER & RADAR PROMO DUAL GRID */}
      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tactical Pitch Spotlight */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 flex flex-col justify-between space-y-6 group hover:border-purple-300 transition-all">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-900 text-xs font-black uppercase tracking-wider border border-purple-100">
                <Compass size={14} />
                <span>Tactical Dugout</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                11-a-side Pitch Builder
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Recruit your starting XI across 4-3-3, 4-2-3-1, 3-5-2, and 4-4-2 formations. Enforce
                a strict £100.0M fantasy salary cap and maximum 3 players per club, then generate a
                shareable URL.
              </p>
            </div>

            {/* Tactical Pitch Graphic Teaser */}
            <div className="bg-gradient-to-b from-[#1b5e20] to-[#2e7d32] rounded-2xl p-4 text-white relative overflow-hidden border border-emerald-900/40">
              {/* Pitch markings */}
              <div className="absolute inset-0 border border-white/20 m-2 rounded-xl pointer-events-none" />
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/20 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">
                    Active Formation
                  </p>
                  <p className="text-lg font-black">4-3-3 Attacking</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">
                    Salary Cap
                  </p>
                  <p className="text-lg font-black font-mono">£100.0M Cap</p>
                </div>
              </div>
            </div>

            <Link
              to="/squad-builder"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              <span>Launch Squad Builder</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Radar Comparison Spotlight */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 flex flex-col justify-between space-y-6 group hover:border-purple-300 transition-all">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-900 text-xs font-black uppercase tracking-wider border border-purple-100">
                <Scale size={14} />
                <span>Head-to-Head</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                5-Axis Spider Radar Scouting
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Pit any two Premier League players head-to-head. Analyze normalized percentiles across
                Shooting, Creation, Work Rate, Discipline, and Efficiency with automated winning
                metrics.
              </p>
            </div>

            {/* Radar Preview Graphic Teaser */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Player A</span>
                <p className="text-sm font-black text-purple-950">Bukayo Saka</p>
                <span className="text-[10px] font-bold text-purple-700">Arsenal • RW</span>
              </div>

              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center font-black text-xs border border-purple-200">
                VS
              </div>

              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Player B</span>
                <p className="text-sm font-black text-slate-900">Cole Palmer</p>
                <span className="text-[10px] font-bold text-emerald-700">Chelsea • RW</span>
              </div>
            </div>

            <Link
              to="/compare"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs uppercase tracking-wider border border-slate-300 transition-colors shadow-2xs"
            >
              <span>Launch Radar Comparison</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
