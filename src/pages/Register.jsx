import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trophy,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OAuthButtons from '../components/common/OAuthButtons';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/squad-builder');
    } catch (err) {
      setError(
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.error ||
        'Registration could not be completed. Please check your information.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 w-full flex items-center justify-center relative">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Side: Editorial Benefits Showcase (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#230028] via-[#38003c] to-[#120015] p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Geometric Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-xs">
              <Sparkles size={13} className="text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
                Official Premier League Pro Suite
              </span>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center font-black text-white text-base">
                PZ
              </div>
              <span className="text-lg font-black tracking-wider uppercase text-white">
                PREMIERZONE <span className="text-purple-300">PRO</span>
              </span>
            </div>
          </div>

          {/* Core Privileges */}
          <div className="my-8 md:my-12 relative z-10 space-y-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                Build & Share Your Tactical Legacy.
              </h2>
              <p className="text-xs text-purple-200/70 mt-2 font-medium">
                Create a manager account in seconds to unlock full persistence across all platforms.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  title: 'Unlimited Lineup Saves',
                  desc: 'Craft and store multiple formations under the £100M budget.',
                },
                {
                  title: 'Shareable Lineup URLs',
                  desc: 'Generate unique share codes to showcase lineups to the community.',
                },
                {
                  title: 'Scouting Watchlist',
                  desc: 'Track emerging stars, form momentum, and live valuation spikes.',
                },
                {
                  title: 'Match Center Sim Access',
                  desc: 'Cast live fan prediction votes and access timeline simulation scrubber.',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={12} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">{item.title}</h4>
                    <p className="text-[11px] text-purple-200/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Security / Trust Indicator */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-purple-200/60 font-semibold">
            <span>Free Forever • No Payment Needed</span>
            <span>2026/27 Campaign</span>
          </div>
        </div>

        {/* Right Side: Registration Form (7 cols) */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200/60 w-fit mb-1">
                <UserPlus size={13} />
                <span>Manager Registration</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Create Free Account
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Register to start drafting tactical lineups and running advanced scouting analytics.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 bg-rose-50 text-rose-800 text-xs font-bold rounded-2xl border border-rose-200 flex items-center gap-2.5 animate-shake">
                <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Social OAuth Sign Up */}
            <OAuthButtons
              titlePrefix="Sign Up with"
              onSuccess={() => navigate('/squad-builder')}
              onError={(err) => setError(err)}
            />

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                  Manager Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Email Address Field */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    placeholder="manager@premierzone.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Terms acknowledgement */}
              <p className="text-[11px] text-slate-400 font-medium">
                By creating an account, you agree to our Terms of Fair Play and live tactical guidelines.
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-purple-950 hover:bg-purple-900 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Your Manager Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Login */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs font-semibold text-slate-500">
                Already registered?{' '}
                <Link
                  to="/login"
                  className="font-black text-purple-950 hover:text-purple-700 underline underline-offset-4 decoration-purple-300 hover:decoration-purple-700 transition-colors"
                >
                  Sign In to Your Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
