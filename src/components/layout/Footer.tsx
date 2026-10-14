import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Tourist Guide
              </span>
            </Link>
            
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Explore More, Worry Less. Connecting travelers with government and platform-verified local guides for authentic, safe, and personalized cultural journeys across India.
            </p>

            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 w-fit">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Admin-Verified Guides & Transparent Pricing in INR (₹)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Destinations</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/destinations?q=Tirupati" className="hover:text-teal-400 transition">Tirupati Shrines</Link></li>
              <li><Link to="/destinations?q=Hyderabad" className="hover:text-teal-400 transition">Hyderabad Heritage</Link></li>
              <li><Link to="/destinations?q=Goa" className="hover:text-teal-400 transition">Goa Coastal & Trails</Link></li>
              <li><Link to="/destinations?q=Jaipur" className="hover:text-teal-400 transition">Jaipur Royal Forts</Link></li>
              <li><Link to="/destinations?q=Kerala" className="hover:text-teal-400 transition">Kerala Backwaters</Link></li>
              <li><Link to="/destinations?q=Bengaluru" className="hover:text-teal-400 transition">Bengaluru Gardens</Link></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/guides" className="hover:text-teal-400 transition">Find Verified Guides</Link></li>
              <li><Link to="/budget" className="hover:text-teal-400 transition">Trip Budget Calculator</Link></li>
              <li><Link to="/recommendations" className="hover:text-teal-400 transition">Local Food & Stays</Link></li>
              <li><Link to="/how-it-works" className="hover:text-teal-400 transition">How It Works & Safety</Link></li>
              <li><Link to="/auth?mode=guide-signup" className="hover:text-teal-400 transition">Become a Local Guide</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Support & Help</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-teal-400" />
                <span>support@touristguide.in</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-teal-400" />
                <span>1800-TOUR-GUIDE (Demo)</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>Tirupati & Hyderabad, India</span>
              </li>
              <li className="pt-2">
                <span className="text-xs text-amber-400/90 bg-amber-950/40 border border-amber-800/50 px-2 py-1 rounded inline-block">
                  College Hackathon Edition
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Tourist Guide Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Guide Code of Conduct</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-800/40 rounded-xl text-[11px] text-slate-400 text-center border border-slate-800">
          <strong>Demo Notice:</strong> All sample itineraries, guide fees, and reviews are simulated for demonstration purposes. Verified badges are awarded only after authorized administrator approval.
        </div>
      </div>
    </footer>
  );
};
