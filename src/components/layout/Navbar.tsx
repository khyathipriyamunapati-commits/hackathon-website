import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  MapPin, 
  Users, 
  Calculator, 
  UtensilsCrossed, 
  HelpCircle, 
  MessageSquare, 
  LayoutDashboard, 
  Menu, 
  X, 
  LogOut, 
  ShieldCheck, 
  User, 
  ChevronDown 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logoutUser, conversations } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const getDashboardPath = () => {
    switch (currentUser.role) {
      case 'guide':
        return '/dashboard/guide';
      case 'admin':
        return '/dashboard/admin';
      case 'tourist':
      default:
        return '/dashboard/tourist';
    }
  };

  const getDashboardLabel = () => {
    switch (currentUser.role) {
      case 'guide':
        return 'Guide Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      case 'tourist':
      default:
        return 'My Bookings';
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Find Guides', path: '/guides' },
    { name: 'Budget Planner', path: '/budget' },
    { name: 'Food & Stays', path: '/recommendations' },
    { name: 'How It Works', path: '/how-it-works' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-blue-950 to-teal-800 bg-clip-text text-transparent">
                Tourist Guide
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-teal-600 -mt-1">
                Travel Companion
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-teal-700 bg-teal-50/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & User Menu */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Messages link */}
            <Link
              to="/messages"
              className="relative p-2 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition"
              title="Chat with your guide"
            >
              <MessageSquare className="w-5 h-5" />
              {conversations.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </Link>

            {/* Dashboard shortcut button */}
            <Link
              to={getDashboardPath()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {getDashboardLabel()}
            </Link>

            {/* User Profile Pill / Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full border border-slate-200 hover:border-teal-300 hover:bg-slate-50 transition"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-500"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                    {currentUser.fullName.charAt(0)}
                  </div>
                )}
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.fullName}
                  </p>
                  <p className="text-[10px] text-teal-600 capitalize font-medium">
                    {currentUser.role}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-cardHover border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{currentUser.fullName}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                      {currentUser.role} Account
                    </span>
                  </div>

                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    {getDashboardLabel()}
                  </Link>

                  <Link
                    to="/messages"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    Messages
                  </Link>

                  <div className="border-t border-slate-100 my-1"></div>

                  <Link
                    to="/auth"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Switch or Log In
                  </Link>

                  <button
                    onClick={() => logoutUser()}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Reset to Tourist
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <Link
              to="/messages"
              className="p-2 text-slate-600 hover:text-teal-700 rounded-lg"
            >
              <MessageSquare className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'}
              alt={currentUser.fullName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500"
            />
            <div>
              <p className="text-sm font-bold text-slate-800">{currentUser.fullName}</p>
              <p className="text-xs text-teal-600 font-medium capitalize">{currentUser.role} Account</p>
            </div>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                isActive(link.path)
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="border-t border-slate-100 pt-3 space-y-2">
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700"
            >
              <LayoutDashboard className="w-4 h-4" />
              {getDashboardLabel()}
            </Link>

            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <User className="w-4 h-4" />
              Login / Switch Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
