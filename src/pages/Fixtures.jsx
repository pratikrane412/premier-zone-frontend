import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { fixturesApi } from '../api/fixturesApi';
import MatchPredictorModal from '../components/fixtures/MatchPredictorModal';
import TeamCrest from '../components/common/TeamCrest';

export default function Fixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [gameweek, setGameweek] = useState(28);
  const [loading, setLoading] = useState(true);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [isPredictorOpen, setIsPredictorOpen] = useState(false);


  useEffect(() => {
    const fetchFixtures = async () => {
      setLoading(true);
      try {
        const data = await fixturesApi.getAll({ gameweek, limit: 15 });
        setFixtures(data || []);
      } catch (err) {
        console.error("Failed to load fixtures:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFixtures();
  }, [gameweek]);

  const handlePredict = (fix) => {
    setSelectedFixture(fix);
    setIsPredictorOpen(true);
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto relative">
      {/* Glow */}
      <div className="blob w-[350px] h-[350px] bg-purple-200/30 top-[-5%] left-[-5%]"></div>
      <div className="blob w-[350px] h-[350px] bg-pink-100/30 bottom-[-5%] right-[-5%]"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 pb-8 mb-8 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100">
            <Calendar size={14} className="text-purple-700" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-950">
              Live Matchday Hub
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            Fixtures & Live Center
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500 max-w-xl">
            Real Premier League matchdays, live results, and instant AI outcome simulations.
          </p>
        </div>

        {/* Gameweek Selector */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setGameweek((g) => Math.max(1, g - 1))}
            disabled={gameweek <= 1}
            className="p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-30 text-slate-700"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-black text-xs text-purple-950 px-2">Gameweek {gameweek}</span>
          <button
            onClick={() => setGameweek((g) => Math.min(38, g + 1))}
            disabled={gameweek >= 38}
            className="p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-30 text-slate-700"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Fixtures List */}
      <div className="relative z-10">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-12 h-12 border-3 border-purple-200 border-t-purple-900 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Retrieving Official Matchday Slate...
            </p>
          </div>
        ) : fixtures.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <p className="text-sm font-bold text-slate-500">No scheduled fixtures found for Gameweek {gameweek}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fixtures.map((fix) => (
              <div
                key={fix.id}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-purple-200 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between text-[11px] font-black text-slate-400 mb-4 pb-2 border-b border-slate-50">
                  <span className="uppercase tracking-widest">{fix.venue || 'Premier League'}</span>
                  {fix.status === 'LIVE' ? (
                    <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-600 font-extrabold text-[10px] animate-pulse">
                      LIVE
                    </span>
                  ) : fix.status === 'FINISHED' ? (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-extrabold text-[10px]">
                      FT
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-extrabold text-[10px]">
                      {new Date(fix.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>

                {/* Score / Teams Row */}
                <div className="flex items-center justify-between my-2">
                  {/* Home Team */}
                  <div className="flex items-center gap-3 flex-1">
                    <TeamCrest
                      crestUrl={fix.home_crest}
                      teamName={fix.home_team_name}
                      className="w-10 h-10 object-contain"
                    />
                    <span className="font-black text-slate-900 text-sm">{fix.home_team_name}</span>
                  </div>

                  {/* Score */}
                  <div className="px-4 text-center">
                    {fix.home_score !== null && fix.away_score !== null ? (
                      <div className="flex items-center gap-2 font-black text-xl text-slate-900">
                        <span>{fix.home_score}</span>
                        <span className="text-slate-300">-</span>
                        <span>{fix.away_score}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                        VS
                      </span>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <span className="font-black text-slate-900 text-sm text-right">{fix.away_team_name}</span>
                    <TeamCrest
                      crestUrl={fix.away_crest}
                      teamName={fix.away_team_name}
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                </div>

                {/* Card Actions: Match Center & Simulation */}
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
                  <Link
                    to={`/match/${fix.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-white bg-purple-950 hover:bg-purple-900 px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
                  >
                    <Trophy size={13} className="text-purple-300" />
                    Match Center
                  </Link>

                  <button
                    onClick={() => handlePredict(fix)}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-purple-700 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <Sparkles size={13} />
                    Simulate
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Match Predictor Modal */}
      <MatchPredictorModal
        isOpen={isPredictorOpen}
        onClose={() => setIsPredictorOpen(false)}
        fixture={selectedFixture}
      />
    </div>
  );
}


