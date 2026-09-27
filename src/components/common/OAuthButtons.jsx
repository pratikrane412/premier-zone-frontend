import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Official Google Multicolored Icon
export function GoogleIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function OAuthButtons({ onSuccess, onError, titlePrefix = "Sign In with" }) {
  const { oauthLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Dynamically load Google Identity Services client script
  useEffect(() => {
    if (!googleClientId) return;

    // Check if already injected
    if (document.getElementById('google-gsi-script')) return;

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [googleClientId]);

  // Handle Google Click using official Google OAuth2 TokenClient Popup
  const handleGoogleClick = () => {
    if (!googleClientId) {
      if (onError) onError('Google Client ID is not configured. Please verify your environment settings.');
      return;
    }

    if (window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              if (tokenResponse.error !== 'popup_closed_by_user') {
                if (onError) onError(tokenResponse.error_description || 'Google sign-in was cancelled or failed.');
              }
              return;
            }
            if (tokenResponse.access_token) {
              setLoading(true);
              try {
                // Fetch verified profile from Google UserInfo endpoint
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const profile = await res.json();
                await oauthLogin({
                  provider: 'google',
                  token: tokenResponse.access_token,
                  email: profile.email,
                  name: profile.name,
                  provider_id: profile.sub,
                });
                if (onSuccess) onSuccess('google');
              } catch (err) {
                if (onError) onError(err.response?.data?.error || 'Google authentication failed.');
              } finally {
                setLoading(false);
              }
            }
          },
        });
        tokenClient.requestAccessToken({ prompt: 'select_account' });
      } catch (err) {
        if (onError) onError('Failed to open Google Sign-In popup. Please allow popups for this site.');
      }
    } else {
      if (onError) onError('Google Sign-In is initializing. Please click again in a few seconds.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Full-Width Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 font-black text-xs sm:text-sm flex items-center justify-center gap-3 shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-[0.99] disabled:opacity-50 group cursor-pointer"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-purple-900 border-t-transparent rounded-full animate-spin" />
        ) : (
          <GoogleIcon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
        )}
        <span>{titlePrefix} Google</span>
      </button>

      {/* Modern Hairline Divider */}
      <div className="relative flex items-center justify-center pt-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
          Or Continue with Manager ID
        </span>
      </div>
    </div>
  );
}
