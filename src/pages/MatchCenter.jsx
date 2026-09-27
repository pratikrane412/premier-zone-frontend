import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  BarChart2,
  Users,
  Trophy,
  TrendingUp,
  Sparkles,
  Play,
  Pause,
  Filter,
  Share2,
  Check,
  Shield,
  Activity,
  Calendar,
} from 'lucide-react';
import { fixturesApi } from '../api/fixturesApi';
import TeamCrest from '../components/common/TeamCrest';
import PlayerAvatar from '../components/common/PlayerAvatar';

export default function MatchCenter() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('lineups'); // 'lineups' | 'stats' | 'commentary' | 'h2h' | 'poll'
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'goal' | 'card' | 'shot' | 'sub'
  const [userVote, setUserVote] = useState(null);
  const [voting, setVoting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Lineup pitch filter: 'both' | 'home' | 'away'
  const [lineupTeamView, setLineupTeamView] = useState('both');

  // Live Match Simulation controls
  const [simulating, setSimulating] = useState(false);
  const [simMinute, setSimMinute] = useState(90);
  const simTimerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCenter = async () => {
      setLoading(true);
      try {
        const data = await fixturesApi.getMatchCenter(id);
        setMatchData(data);
        setSimMinute(data.status === 'FINISHED' ? 94 : 65);
      } catch (err) {
        console.error('Failed to load match center:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCenter();

    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [id]);

  // Live simulation tick effect
  useEffect(() => {
    if (simulating) {
      simTimerRef.current = setInterval(() => {
        setSimMinute((prev) => {
          if (prev >= 94) {
            setSimulating(false);
            clearInterval(simTimerRef.current);
            return 94;
          }
          return prev + 1;
        });
      }, 700);
    } else {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    }
    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [simulating]);

  const handleVote = async (choice) => {
    if (userVote || voting) return;
    setVoting(true);
    try {
      const updatedPoll = await fixturesApi.vote(id, choice);
      setUserVote(choice);
      setMatchData((prev) => ({
        ...prev,
        fan_poll: updatedPoll,
      }));
    } catch (err) {
      console.error('Failed to record vote:', err);
    } finally {
      setVoting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getEventBadge = (type) => {
    switch (type) {
      case 'goal':
        return { icon: '⚽', color: 'bg-emerald-600 text-white', label: 'GOAL' };
      case 'card_yellow':
        return { icon: '🟨', color: 'bg-amber-400 text-slate-950', label: 'YELLOW CARD' };
      case 'card_red':
        return { icon: '🟥', color: 'bg-rose-600 text-white', label: 'RED CARD' };
      case 'substitution':
        return { icon: '🔄', color: 'bg-blue-600 text-white', label: 'SUB' };
      case 'save':
        return { icon: '🧤', color: 'bg-purple-950 text-white', label: 'SAVE' };
      case 'woodwork':
        return { icon: '💥', color: 'bg-purple-700 text-white', label: 'WOODWORK' };
      case 'corner':
        return { icon: '🚩', color: 'bg-slate-700 text-white', label: 'CORNER' };
      case 'var':
        return { icon: '🖥️', color: 'bg-purple-900 text-white', label: 'VAR' };
      case 'foul':
        return { icon: '⚠️', color: 'bg-amber-600 text-white', label: 'FOUL' };
      default:
        return { icon: '⏱️', color: 'bg-slate-600 text-white', label: 'MOMENT' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] text-slate-900 pt-32 pb-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-3 border-purple-200 border-t-purple-950 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
          Connecting to Premier League Match Center...
        </p>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="min-h-screen bg-[#fafbfc] text-slate-900 pt-32 pb-20 px-4 text-center">
        <h2 className="text-2xl font-black mb-3">Fixture Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The requested Premier League match could not be loaded.</p>
        <button
          onClick={() => navigate('/fixtures')}
          className="px-6 py-2.5 rounded-2xl bg-purple-950 text-white font-black text-xs hover:bg-purple-900 shadow-sm"
        >
          Return to Fixtures
        </button>
      </div>
    );
  }

  // Filter events based on active simulation minute and selected category
  const filteredTimeline = (matchData.timeline || [])
    .filter((evt) => evt.minute <= simMinute)
    .filter((evt) => {
      if (filterCategory === 'all') return true;
      if (filterCategory === 'goal') return evt.type === 'goal';
      if (filterCategory === 'card') return evt.type.includes('card');
      if (filterCategory === 'sub') return evt.type === 'substitution';
      if (filterCategory === 'shot') return ['save', 'woodwork', 'chance', 'attack'].includes(evt.type);
      return true;
    });

  // Calculate live score up to current simulation minute
  const homeGoalsSoFar = (matchData.timeline || []).filter(
    (e) => e.type === 'goal' && e.team === 'home' && e.minute <= simMinute
  ).length;

  const awayGoalsSoFar = (matchData.timeline || []).filter(
    (e) => e.type === 'goal' && e.team === 'away' && e.minute <= simMinute
  ).length;

  const goalEvents = (matchData.timeline || []).filter((e) => e.type === 'goal');
  const homeScorers = goalEvents.filter((e) => e.team === 'home').map((e) => `${e.player_name} ${e.minute}'`);
  const awayScorers = goalEvents.filter((e) => e.team === 'away').map((e) => `${e.player_name} ${e.minute}'`);

  // Active lineup squad selection
  const homeStarters = (matchData.lineups?.home?.starting_xi || []).map((p) => ({ ...p, isHome: true }));
  const awayStarters = (matchData.lineups?.away?.starting_xi || []).map((p) => ({ ...p, isHome: false }));

  const displayPlayers =
    lineupTeamView === 'home'
      ? homeStarters
      : lineupTeamView === 'away'
      ? awayStarters
      : [...homeStarters, ...awayStarters];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pt-20 md:pt-24 pb-24 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 w-full relative">
      <div className="w-full space-y-6 relative z-10">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={() => navigate('/fixtures')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-2xs text-xs font-black transition-colors"
          >
            <ArrowLeft size={16} />
            <span>All Fixtures</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors shadow-2xs"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Share2 size={13} />}
              <span>{copied ? 'Link Copied!' : 'Share Match'}</span>
            </button>

            <Link
              to="/standings"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-xs font-bold text-white transition-colors shadow-2xs"
            >
              <Trophy size={13} className="text-purple-300" />
              <span>Full Table</span>
            </Link>
          </div>
        </div>

        {/* Clean Light-Mode Broadcast Scoreboard Hero (Full Width) */}
        <div className="w-full rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden p-6 md:p-8">
          <div className="flex flex-col items-center">
            {/* Status & Subheader Context */}
            <div className="flex items-center gap-3 mb-6 text-xs font-bold text-slate-500 flex-wrap justify-center">
              {simulating || matchData.status === 'LIVE' ? (
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-600 text-white font-black text-xs uppercase tracking-wider animate-pulse shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  LIVE {simMinute}'
                </span>
              ) : matchData.status === 'FINISHED' ? (
                <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs uppercase tracking-wider border border-emerald-200">
                  Full Time (FT)
                </span>
              ) : (
                <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-900 font-black text-xs uppercase tracking-wider border border-purple-200">
                  Scheduled
                </span>
              )}
              <span>• Gameweek {matchData.gameweek}</span>
              <span>• {matchData.venue}</span>
              {matchData.referee && <span className="hidden sm:inline">• Ref: {matchData.referee}</span>}
              {matchData.attendance && (
                <span className="hidden md:inline">• Att: {matchData.attendance?.toLocaleString()}</span>
              )}
            </div>

            {/* Main Scoreboard Showdown */}
            <div className="w-full grid grid-cols-12 items-center gap-4 py-2">
              {/* Home Team (span 5) */}
              <div className="col-span-5 flex flex-col sm:flex-row items-center sm:justify-end gap-4 text-center sm:text-right">
                <div>
                  <h2 className="font-black text-xl sm:text-3xl text-slate-900 tracking-tight">
                    {matchData.home_team.name}
                  </h2>
                  <Link
                    to={`/players?team=${encodeURIComponent(matchData.home_team.name)}`}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-950"
                  >
                    View Club Roster →
                  </Link>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-2 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs flex-shrink-0">
                  <TeamCrest
                    crestUrl={matchData.home_team.crest_url}
                    teamName={matchData.home_team.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                  />
                </div>
              </div>

              {/* Center Score & xG (span 2) */}
              <div className="col-span-2 text-center flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 sm:gap-4 font-black text-4xl sm:text-6xl font-mono tracking-tight text-slate-900">
                  <span>{simulating ? homeGoalsSoFar : matchData.home_team.score}</span>
                  <span className="text-slate-300 font-light">-</span>
                  <span>{simulating ? awayGoalsSoFar : matchData.away_team.score}</span>
                </div>

                <div className="mt-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
                  xG: {matchData.stats.xg[0]} — {matchData.stats.xg[1]}
                </div>
              </div>

              {/* Away Team (span 5) */}
              <div className="col-span-5 flex flex-col sm:flex-row-reverse items-center sm:justify-end gap-4 text-center sm:text-left">
                <div>
                  <h2 className="font-black text-xl sm:text-3xl text-slate-900 tracking-tight">
                    {matchData.away_team.name}
                  </h2>
                  <Link
                    to={`/players?team=${encodeURIComponent(matchData.away_team.name)}`}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-950"
                  >
                    View Club Roster →
                  </Link>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-2 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs flex-shrink-0">
                  <TeamCrest
                    crestUrl={matchData.away_team.crest_url}
                    teamName={matchData.away_team.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Goalscorers Ticker Bar */}
            {(homeScorers.length > 0 || awayScorers.length > 0) && (
              <div className="mt-6 pt-4 border-t border-slate-100 w-full flex justify-between text-xs font-semibold text-slate-600 px-4">
                <div className="text-left space-y-1">
                  {homeScorers.map((s, i) => (
                    <p key={i} className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-black">⚽</span> {s}
                    </p>
                  ))}
                </div>
                <div className="text-right space-y-1">
                  {awayScorers.map((s, i) => (
                    <p key={i} className="flex items-center justify-end gap-1.5">
                      {s} <span className="text-emerald-600 font-black">⚽</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Live Simulation Scrubber */}
            <div className="mt-6 w-full max-w-3xl bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (simulating) {
                      setSimulating(false);
                    } else {
                      if (simMinute >= 94) setSimMinute(1);
                      setSimulating(true);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs ${
                    simulating
                      ? 'bg-amber-400 text-slate-950 animate-pulse'
                      : 'bg-purple-900 hover:bg-purple-950 text-white'
                  }`}
                >
                  {simulating ? <Pause size={13} /> : <Play size={13} />}
                  <span>{simulating ? `Pause (${simMinute}')` : 'Simulate Match Timeline'}</span>
                </button>

                <button
                  onClick={() => {
                    setSimulating(false);
                    setSimMinute(94);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors border border-slate-200 shadow-2xs"
                >
                  90' FT
                </button>
              </div>

              {/* Scrubber slider */}
              <div className="flex items-center gap-3 w-full sm:w-72">
                <span className="text-[10px] font-mono font-bold text-slate-400">1'</span>
                <input
                  type="range"
                  min="1"
                  max="94"
                  value={simMinute}
                  onChange={(e) => {
                    setSimulating(false);
                    setSimMinute(Number(e.target.value));
                  }}
                  className="w-full accent-purple-900 cursor-pointer"
                />
                <span className="text-xs font-black font-mono text-purple-950 min-w-[28px]">
                  {simMinute}'
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (White/Light Mode) */}
        <div className="w-full flex bg-slate-100 rounded-2xl p-1.5 border border-slate-200/80 gap-1 overflow-x-auto scrollbar-none shadow-2xs">
          {[
            { id: 'lineups', label: '2D Pitch Lineups', icon: Users },
            { id: 'stats', label: 'Match Stats', icon: BarChart2 },
            { id: 'commentary', label: 'Match Moments', icon: Clock },
            { id: 'h2h', label: 'H2H Encounters', icon: Trophy },
            { id: 'poll', label: 'Fan Prediction', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-white text-purple-950 shadow-xs border border-slate-200/90 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-bold'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-purple-700' : 'text-slate-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: 2D PITCH TACTICAL LINEUPS (HORIZONTAL ONLY) */}
        {activeTab === 'lineups' && (
          <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-6 shadow-xs">
            {/* View Controls: Team Filter Pills */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <span className="text-[11px] font-black uppercase text-slate-400 mr-1">View:</span>
                <button
                  onClick={() => setLineupTeamView('both')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                    lineupTeamView === 'both'
                      ? 'bg-purple-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  Both Teams (22 Players)
                </button>
                <button
                  onClick={() => setLineupTeamView('home')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    lineupTeamView === 'home'
                      ? 'bg-purple-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <TeamCrest
                    crestUrl={matchData.home_team.crest_url}
                    teamName={matchData.home_team.name}
                    className="w-4 h-4 object-contain"
                  />
                  <span>{matchData.home_team.name} (4-3-3)</span>
                </button>
                <button
                  onClick={() => setLineupTeamView('away')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    lineupTeamView === 'away'
                      ? 'bg-purple-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <TeamCrest
                    crestUrl={matchData.away_team.crest_url}
                    teamName={matchData.away_team.name}
                    className="w-4 h-4 object-contain"
                  />
                  <span>{matchData.away_team.name} (4-3-3)</span>
                </button>
              </div>

              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Horizontal Tactical Pitch
              </span>
            </div>

            {/* Mobile swipe helper */}
            <div className="sm:hidden text-center pb-1">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                ← Swipe horizontally to explore pitch →
              </span>
            </div>

            {/* Tactical 2D Horizontal Grass Pitch (Full Width with mobile horizontal scroll) */}
            <div className="w-full overflow-x-auto pb-2 scrollbar-none rounded-3xl">
              <div className="min-w-[640px] lg:min-w-0 relative w-full aspect-[16/10] sm:aspect-[18/10] max-h-[580px] rounded-3xl border-4 border-slate-200 shadow-xl overflow-hidden p-4 select-none bg-[repeating-linear-gradient(90deg,#1e7b25_0px,#1e7b25_48px,#24872c_48px,#24872c_96px)]">
              {/* Pitch Markings (Horizontal) */}
              <div className="absolute inset-4 border-2 border-white/50 rounded-2xl pointer-events-none" />
              <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-white/50 -translate-x-1/2 pointer-events-none" />
              <div className="absolute left-1/2 top-1/2 w-28 h-28 sm:w-36 sm:h-36 border-2 border-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="absolute left-1/2 top-1/2 w-2.5 h-2.5 bg-white/70 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              {/* Left Penalty Area (Home) */}
              <div className="absolute left-4 top-[20%] bottom-[20%] w-[16%] border-r-2 border-y-2 border-white/50 pointer-events-none" />
              <div className="absolute left-4 top-[35%] bottom-[35%] w-[6%] border-r-2 border-y-2 border-white/50 pointer-events-none" />
              <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-14 h-14 border-r-2 border-white/50 rounded-full pointer-events-none -translate-x-1/2" />

              {/* Right Penalty Area (Away) */}
              <div className="absolute right-4 top-[20%] bottom-[20%] w-[16%] border-l-2 border-y-2 border-white/50 pointer-events-none" />
              <div className="absolute right-4 top-[35%] bottom-[35%] w-[6%] border-l-2 border-y-2 border-white/50 pointer-events-none" />
              <div className="absolute right-[20%] top-1/2 -translate-y-1/2 w-14 h-14 border-l-2 border-white/50 rounded-full pointer-events-none translate-x-1/2" />

              {/* Render Players on Pitch */}
              {displayPlayers.map((player) => {
                const posX =
                  lineupTeamView === 'both' ? player.x : player.single_x ?? player.x;
                const posY =
                  lineupTeamView === 'both' ? player.y : player.single_y ?? player.y;

                return (
                  <div
                    key={`${player.isHome ? 'home' : 'away'}-${player.id}-${player.tactical_role}`}
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10 transition-transform hover:z-30 hover:scale-110"
                  >
                    <div className="relative">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-white shadow-xl overflow-hidden flex items-end justify-center ${
                          player.isHome ? 'bg-purple-950' : 'bg-emerald-900'
                        }`}
                      >
                        <PlayerAvatar
                          photoUrl={player.photo_url}
                          name={player.name}
                          position={player.position}
                        />
                      </div>
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-white text-[9px] font-black text-white flex items-center justify-center shadow-xs ${
                          player.isHome ? 'bg-purple-900' : 'bg-emerald-800'
                        }`}
                      >
                        {player.jersey_number}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      {lineupTeamView !== 'both' && (
                        <span className="text-[9px] font-black uppercase text-purple-950 bg-white/95 px-1 py-0.2 rounded border border-slate-200/90 shadow-xs">
                          {player.tactical_role}
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded-md bg-white/95 text-slate-900 font-black text-[10px] tracking-tight shadow truncate max-w-[85px] border border-slate-200/80">
                        {player.short_name}
                      </span>
                    </div>

                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 -mt-0.5 shadow-xs border border-amber-300">
                      ★ {player.rating}
                    </span>
                  </div>
                );
              })}
              </div>
            </div>

            {/* Substitutes Bench List (Light Mode Full Width) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-black uppercase text-purple-950 flex items-center gap-2">
                  <Users size={16} className="text-purple-700" /> {matchData.home_team.name} Substitutes
                </h4>
                <div className="space-y-2">
                  {matchData.lineups.home.bench.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
                    >
                      <span className="text-slate-800 font-bold">
                        {b.jersey_number} • {b.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-black uppercase px-2 py-0.5 bg-slate-50 rounded border border-slate-200">
                        {b.position}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-black uppercase text-emerald-900 flex items-center gap-2">
                  <Users size={16} className="text-emerald-700" /> {matchData.away_team.name} Substitutes
                </h4>
                <div className="space-y-2">
                  {matchData.lineups.away.bench.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
                    >
                      <span className="text-slate-800 font-bold">
                        {b.jersey_number} • {b.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-black uppercase px-2 py-0.5 bg-slate-50 rounded border border-slate-200">
                        {b.position}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MATCH STATS (Full Width) */}
        {activeTab === 'stats' && (
          <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200/80 font-black">
              <div className="flex items-center gap-3">
                <TeamCrest
                  crestUrl={matchData.home_team.crest_url}
                  teamName={matchData.home_team.name}
                  className="w-6 h-6 object-contain"
                />
                <span className="text-purple-950 text-sm font-black">{matchData.home_team.name}</span>
              </div>
              <span className="text-slate-400 uppercase tracking-widest text-[11px] font-bold">
                Comparative Match Statistics
              </span>
              <div className="flex items-center gap-3">
                <span className="text-emerald-800 text-sm font-black">{matchData.away_team.name}</span>
                <TeamCrest
                  crestUrl={matchData.away_team.crest_url}
                  teamName={matchData.away_team.name}
                  className="w-6 h-6 object-contain"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Ball Possession', h: `${matchData.stats.possession[0]}%`, a: `${matchData.stats.possession[1]}%`, hVal: matchData.stats.possession[0], aVal: matchData.stats.possession[1] },
                { label: 'Expected Goals (xG)', h: matchData.stats.xg[0], a: matchData.stats.xg[1], hVal: matchData.stats.xg[0], aVal: matchData.stats.xg[1] },
                { label: 'Total Shots', h: matchData.stats.total_shots[0], a: matchData.stats.total_shots[1], hVal: matchData.stats.total_shots[0], aVal: matchData.stats.total_shots[1] },
                { label: 'Shots on Target', h: matchData.stats.shots_on_target[0], a: matchData.stats.shots_on_target[1], hVal: matchData.stats.shots_on_target[0], aVal: matchData.stats.shots_on_target[1] },
                { label: 'Shots off Target', h: matchData.stats.shots_off_target[0], a: matchData.stats.shots_off_target[1], hVal: matchData.stats.shots_off_target[0], aVal: matchData.stats.shots_off_target[1] },
                { label: 'Blocked Shots', h: matchData.stats.blocked_shots[0], a: matchData.stats.blocked_shots[1], hVal: matchData.stats.blocked_shots[0], aVal: matchData.stats.blocked_shots[1] },
                { label: 'Big Chances Created', h: matchData.stats.big_chances[0], a: matchData.stats.big_chances[1], hVal: matchData.stats.big_chances[0], aVal: matchData.stats.big_chances[1] },
                { label: 'Goalkeeper Saves', h: matchData.stats.goalkeeper_saves[0], a: matchData.stats.goalkeeper_saves[1], hVal: matchData.stats.goalkeeper_saves[0], aVal: matchData.stats.goalkeeper_saves[1] },
                { label: 'Corner Kicks', h: matchData.stats.corners[0], a: matchData.stats.corners[1], hVal: matchData.stats.corners[0], aVal: matchData.stats.corners[1] },
                { label: 'Fouls Committed', h: matchData.stats.fouls[0], a: matchData.stats.fouls[1], hVal: matchData.stats.fouls[0], aVal: matchData.stats.fouls[1] },
                { label: 'Yellow Cards', h: matchData.stats.yellow_cards[0], a: matchData.stats.yellow_cards[1], hVal: matchData.stats.yellow_cards[0], aVal: matchData.stats.yellow_cards[1] },
                { label: 'Offsides', h: matchData.stats.offsides[0], a: matchData.stats.offsides[1], hVal: matchData.stats.offsides[0], aVal: matchData.stats.offsides[1] },
                { label: 'Total Passes', h: matchData.stats.total_passes[0], a: matchData.stats.total_passes[1], hVal: matchData.stats.total_passes[0], aVal: matchData.stats.total_passes[1] },
                { label: 'Pass Accuracy', h: `${matchData.stats.pass_accuracy[0]}%`, a: `${matchData.stats.pass_accuracy[1]}%`, hVal: matchData.stats.pass_accuracy[0], aVal: matchData.stats.pass_accuracy[1] },
              ].map((row, idx) => {
                const total = (Number(row.hVal) || 1) + (Number(row.aVal) || 1);
                const hPct = Math.round(((Number(row.hVal) || 0) / total) * 100);

                return (
                  <div key={idx} className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-black">
                      <span className="text-slate-900 text-sm font-mono">{row.h}</span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold">
                        {row.label}
                      </span>
                      <span className="text-slate-900 text-sm font-mono">{row.a}</span>
                    </div>
                    {/* Dual Progress Bar */}
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        style={{ width: `${hPct}%` }}
                        className="bg-purple-900 transition-all duration-500"
                      />
                      <div
                        style={{ width: `${100 - hPct}%` }}
                        className="bg-emerald-600 transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MATCH MOMENTS & TIMELINE */}
        {activeTab === 'commentary' && (
          <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-6 shadow-xs">
            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-[11px] font-black uppercase text-slate-400 mr-2 flex items-center gap-1">
                  <Filter size={12} /> Filter:
                </span>
                {[
                  { id: 'all', label: `All Moments (${filteredTimeline.length})` },
                  { id: 'goal', label: 'Goals ⚽' },
                  { id: 'card', label: 'Cards 🟨' },
                  { id: 'shot', label: 'Shots & Saves 🧤' },
                  { id: 'sub', label: 'Subs 🔄' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterCategory(f.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                      filterCategory === f.id
                        ? 'bg-purple-900 text-white shadow-xs font-black'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 font-bold'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <span className="text-xs font-bold text-slate-500">
                Showing events up to minute <span className="text-purple-950 font-black">{simMinute}'</span>
              </span>
            </div>

            {/* Vertical Timeline Feed (Full Width) */}
            <div className="space-y-4 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 max-w-4xl mx-auto">
              {filteredTimeline.map((evt, idx) => {
                const badge = getEventBadge(evt.type);
                const isHome = evt.team === 'home';

                return (
                  <div key={idx} className="relative flex items-start gap-4 pl-12 group">
                    {/* Minute Circle Badge */}
                    <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border-2 border-purple-900 flex items-center justify-center font-black text-xs text-purple-950 shadow-xs z-10 group-hover:scale-110 transition-transform">
                      {evt.minute}'
                    </div>

                    {/* Event Description Card */}
                    <div
                      className={`flex-1 p-4 rounded-2xl border transition-all ${
                        isHome
                          ? 'bg-purple-50/40 border-purple-100/90'
                          : 'bg-emerald-50/30 border-emerald-100/90'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${badge.color}`}
                          >
                            {badge.icon} {badge.label}
                          </span>
                          <span className="text-xs font-black text-slate-900">{evt.player_name}</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">
                          {isHome ? matchData.home_team.name : matchData.away_team.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{evt.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: H2H HISTORY */}
        {activeTab === 'h2h' && (
          <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-6 shadow-xs">
            <h3 className="text-base font-black text-slate-900">Recent Head-to-Head Encounters</h3>
            {matchData.h2h.length === 0 ? (
              <p className="text-xs text-slate-500 font-semibold p-6 bg-slate-50 rounded-2xl border border-slate-100">
                First Premier League meeting between these clubs this season.
              </p>
            ) : (
              <div className="space-y-3">
                {matchData.h2h.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm"
                  >
                    <span className="text-xs font-bold text-slate-400 w-28">{h.date}</span>
                    <span className="font-black text-slate-900 flex-1 text-right pr-4">
                      {h.home_team}
                    </span>
                    <span className="px-3.5 py-1 rounded-xl bg-purple-900 text-white font-black text-xs shadow-xs font-mono">
                      {h.home_score} - {h.away_score}
                    </span>
                    <span className="font-black text-slate-900 flex-1 text-left pl-4">
                      {h.away_team}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FAN PREDICTION POLL */}
        {activeTab === 'poll' && (
          <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 md:p-10 shadow-xs">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200/80 space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-700" />
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    Fan Match Prediction Poll
                  </h4>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {matchData.fan_poll.total_votes} Fan Votes Registered
                </span>
              </div>

              {/* Vote Buttons */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'home', label: matchData.home_team.name, pct: matchData.fan_poll.home_pct },
                  { id: 'draw', label: 'Draw', pct: matchData.fan_poll.draw_pct },
                  { id: 'away', label: matchData.away_team.name, pct: matchData.fan_poll.away_pct },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    disabled={voting || !!userVote}
                    onClick={() => handleVote(btn.id)}
                    className={`p-5 rounded-2xl border text-center transition-all ${
                      userVote === btn.id
                        ? 'bg-purple-900 text-white border-purple-900 shadow-md scale-105'
                        : 'bg-white hover:bg-purple-50/50 border-slate-200 text-slate-800 shadow-2xs'
                    }`}
                  >
                    <p className="text-xs font-black truncate">{btn.label}</p>
                    <p className="text-2xl font-black mt-2 font-mono text-purple-950">
                      {btn.pct}%
                    </p>
                  </button>
                ))}
              </div>

              {/* Animated Result Progress Bar */}
              <div className="h-3.5 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${matchData.fan_poll.home_pct}%` }}
                  className="bg-purple-900 transition-all duration-500"
                />
                <div
                  style={{ width: `${matchData.fan_poll.draw_pct}%` }}
                  className="bg-slate-400 transition-all duration-500"
                />
                <div
                  style={{ width: `${matchData.fan_poll.away_pct}%` }}
                  className="bg-emerald-600 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
