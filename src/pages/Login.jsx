import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogIn,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OAuthButtons from '../components/common/OAuthButtons';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/squad-builder');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Invalid username or password. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 w-full flex items-center justify-center relative">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Side: Editorial Brand & Value Showcase (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#230028] via-[#38003c] to-[#120015] p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Geometric Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          {/* Top Brand Pill */}
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

          {/* Value Highlights */}
          <div className="my-8 md:my-12 relative z-10 space-y-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                Your Tactical Command Center.
              </h2>
              <p className="text-xs text-purple-200/70 mt-2 font-medium">
                Log in to build starting XIs, benchmark stars, and unlock matchday projections.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-purple-300">
                  <Zap size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Interactive Tactical Squad Builder</h4>
                  <p className="text-[11px] text-purple-200/70">
                    Draft dream XIs with live £100M budget caps and share public links.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-emerald-300">
                  <BarChart3 size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Head-to-Head Radar Analytics</h4>
                  <p className="text-[11px] text-purple-200/70">
                    5-axis polygon charts and per-90 metrics for 660+ active Premier League stars.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-300">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Official Real-Time EPL Feeds</h4>
                  <p className="text-[11px] text-purple-200/70">
                    Live scores, gameweek schedules, and Poisson AI match probabilities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security / Trust Indicator */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-purple-200/60 font-semibold">
            <span>256-bit Encrypted Session</span>
            <span>2026/27 Season</span>
          </div>
        </div>

        {/* Right Side: Editorial Login Form (7 cols) */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200/60 w-fit mb-1">
                <LogIn size={13} />
                <span>Account Access</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Welcome Back, Manager
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Sign in to manage your saved squads, watchlists, and tactical configurations.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 bg-rose-50 text-rose-800 text-xs font-bold rounded-2xl border border-rose-200 flex items-center gap-2.5 animate-shake">
                <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Social OAuth Sign In */}
            <OAuthButtons
              titlePrefix="Sign In with"
              onSuccess={() => navigate('/squad-builder')}
              onError={(err) => setError(err)}
            />

            {/* Login Form */}
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
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                    Password
                  </label>
                  <span className="text-[11px] font-bold text-purple-700 hover:text-purple-900 cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md text-purple-950 focus:ring-purple-600 border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-600">Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-purple-950 hover:bg-purple-900 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Pro Center</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Register */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs font-semibold text-slate-500">
                New to PremierZone Pro?{' '}
                <Link
                  to="/register"
                  className="font-black text-purple-950 hover:text-purple-700 underline underline-offset-4 decoration-purple-300 hover:decoration-purple-700 transition-colors"
                >
                  Create a Free Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
