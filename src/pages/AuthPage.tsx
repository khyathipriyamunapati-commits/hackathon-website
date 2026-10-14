import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { UserRole } from '../types';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  AlertCircle 
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');

  const { loginUser, switchRole } = useApp();
  const hasSupabase = isSupabaseConfigured();

  const [isSignUp, setIsSignUp] = useState<boolean>(modeParam === 'guide-signup' || modeParam === 'signup');
  const [role, setRole] = useState<UserRole>(modeParam === 'guide-signup' ? 'guide' : 'tourist');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (hasSupabase && supabase) {
      try {
        if (isSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                role,
              },
            },
          });
          if (error) throw error;
          loginUser(email, role, fullName);
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          loginUser(email, role, fullName || email.split('@')[0]);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Authentication error occurred.');
        setIsLoading(false);
        return;
      }
    } else {
      // Demo Mode login
      loginUser(email || 'demo@touristguide.in', role, fullName || 'Travel Explorer');
    }

    setIsLoading(false);
    if (role === 'guide') {
      navigate('/dashboard/guide');
    } else if (role === 'admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/tourist');
    }
  };

  const handleQuickDemoLogin = (targetRole: UserRole) => {
    switchRole(targetRole);
    if (targetRole === 'guide') {
      navigate('/dashboard/guide');
    } else if (targetRole === 'admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/tourist');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      
      {/* Brand logo & title */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-teal-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isSignUp ? 'Create an Account' : 'Welcome to Tourist Guide'}
        </h1>
        <p className="text-xs text-slate-500">
          Sign in or create your profile to book trips, manage itineraries, and communicate.
        </p>
      </div>

      {/* 1-Click Demo Login Shortcuts Banner */}
      <div className="bg-gradient-to-br from-teal-50 to-amber-50/50 p-5 rounded-3xl border border-teal-100/80 shadow-xs space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Quick Hackathon Presentation Presets
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Switch into any verified role instantly for seamless demonstration:
        </p>

        <div className="grid grid-cols-1 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('tourist')}
            className="w-full py-2 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition flex items-center justify-between shadow-2xs"
          >
            <span className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-teal-600" />
              Sign In as Tourist (Ananya Sharma)
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('guide')}
            className="w-full py-2 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition flex items-center justify-between shadow-2xs"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Sign In as Guide (Ramesh Sharma)
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('admin')}
            className="w-full py-2 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition flex items-center justify-between shadow-2xs"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              Sign In as Administrator
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Auth Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
        
        {/* Role Toggle */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('tourist')}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                role === 'tourist'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tourist / Traveler
            </button>
            <button
              type="button"
              onClick={() => setRole('guide')}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                role === 'guide'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Local Guide
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-medium border border-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignUp && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma or Ananya"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:outline-teal-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:outline-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:outline-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : isSignUp ? `Register as ${role}` : `Sign In as ${role}`}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          {isSignUp ? (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="font-bold text-teal-700 hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="font-bold text-teal-700 hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>

      </div>

    </div>
  );
};
