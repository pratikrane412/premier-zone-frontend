import React, { useState, useEffect } from 'react';
import { X, Sparkles, TrendingUp, Trophy } from 'lucide-react';
import PlayerAvatar from '../common/PlayerAvatar';
import TeamCrest from '../common/TeamCrest';
import { fixturesApi } from '../../api/fixturesApi';

export default function MatchPredictorModal({ isOpen, onClose, fixture }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && fixture) {
      const getSim = async () => {
        setLoading(true);
        try {
          const res = await fixturesApi.predict(fixture.home_team_name, fixture.away_team_name);
          setPrediction(res);
        } catch (err) {
          console.error("Match prediction failed:", err);
        } finally {
          setLoading(false);
        }
      };
      getSim();
    }
  }, [isOpen, fixture]);

  if (!isOpen || !fixture) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Glow */}
        <div className="blob w-[250px] h-[250px] bg-purple-200/40 top-[-10%] right-[-10%]"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors z-20"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">AI Match Predictor</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Statistical Outcome Simulator
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-purple-200 border-t-purple-900 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-500 animate-pulse uppercase tracking-wider">
              Simulating 10,000 Tactical Scenarios...
            </p>
          </div>
        ) : prediction ? (
          <div className="space-y-6 relative z-10">
            {/* Projected Score Board */}
            <div className="bg-gradient-to-br from-purple-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div className="flex flex-col items-center gap-2 flex-1">
                <TeamCrest
                  crestUrl={fixture.home_crest}
                  teamName={prediction.home_team}
                  className="w-12 h-12 object-contain"
                />
                <span className="text-xs font-black text-center">{prediction.home_team}</span>
              </div>

              <div className="text-center px-4">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-400 block mb-1">
                  Projected Score
                </span>
                <span className="text-3xl font-black tracking-tight">{prediction.projected_score}</span>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <TeamCrest
                  crestUrl={fixture.away_crest}
                  teamName={prediction.away_team}
                  className="w-12 h-12 object-contain"
                />
                <span className="text-xs font-black text-center">{prediction.away_team}</span>
              </div>

            </div>

            {/* Probability Distribution Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black text-slate-700">
                <span>{prediction.home_team} ({prediction.probabilities.home_win}%)</span>
                <span>Draw ({prediction.probabilities.draw}%)</span>
                <span>{prediction.away_team} ({prediction.probabilities.away_win}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${prediction.probabilities.home_win}%` }}
                  className="bg-purple-700 transition-all duration-500"
                />
                <div
                  style={{ width: `${prediction.probabilities.draw}%` }}
                  className="bg-slate-400 transition-all duration-500"
                />
                <div
                  style={{ width: `${prediction.probabilities.away_win}%` }}
                  className="bg-emerald-500 transition-all duration-500"
                />
              </div>
            </div>

            {/* Key Talisman Matchup */}
            {prediction.key_matchup && (
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-900 mb-3 flex items-center gap-1.5">
                  <TrendingUp size={12} />
                  Key Players to Watch
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-purple-100">
                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                      <PlayerAvatar
                        photoUrl={prediction.key_matchup.home_talisman.photo_url}
                        name={prediction.key_matchup.home_talisman.name}
                      />
                    </div>
                    <div>
                      <p className="font-black text-slate-800">{prediction.key_matchup.home_talisman.name}</p>
                      <p className="text-[10px] text-slate-400">{prediction.key_matchup.home_talisman.goals} Goals</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-purple-100">
                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                      <PlayerAvatar
                        photoUrl={prediction.key_matchup.away_talisman.photo_url}
                        name={prediction.key_matchup.away_talisman.name}
                      />
                    </div>
                    <div>
                      <p className="font-black text-slate-800">{prediction.key_matchup.away_talisman.name}</p>
                      <p className="text-[10px] text-slate-400">{prediction.key_matchup.away_talisman.goals} Goals</p>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
