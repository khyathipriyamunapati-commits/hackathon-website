import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, RotateCcw, ShieldCheck, UserCheck, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

export const DemoBanner: React.FC = () => {
  const { isDemoMode, currentUser, switchRole, resetDemoData } = useApp();

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-teal-600 text-white text-xs py-2 px-4 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full font-semibold backdrop-blur-sm border border-white/30 text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            Demo Mode – Sample Data
          </span>
          <span className="hidden md:inline text-amber-100">
            Fictional profiles & demo records for hackathon presentation.
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/80 font-medium mr-1 hidden sm:inline">Active Role:</span>
          
          <button
            onClick={() => handleRoleChange('tourist')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
              currentUser.role === 'tourist'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title="Switch to Tourist view (Ananya)"
          >
            <UserCheck className="w-3 h-3" />
            Tourist (Ananya)
          </button>

          <button
            onClick={() => handleRoleChange('guide')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
              currentUser.role === 'guide'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title="Switch to Guide view (Ramesh Sharma)"
          >
            <ShieldCheck className="w-3 h-3" />
            Guide (Ramesh)
          </button>

          <button
            onClick={() => handleRoleChange('admin')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
              currentUser.role === 'admin'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title="Switch to Admin view"
          >
            <CheckCircle2 className="w-3 h-3" />
            Admin
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all demo bookings, itineraries, and reviews back to default state?')) {
                resetDemoData();
              }
            }}
            className="ml-2 px-2.5 py-1 bg-black/25 hover:bg-black/40 text-amber-200 hover:text-white rounded-md font-medium transition flex items-center gap-1 border border-white/20"
            title="Reset demo data to initial presentation state"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Demo
          </button>
        </div>
      </div>
    </div>
  );
};
