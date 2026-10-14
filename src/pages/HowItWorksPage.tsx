import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Calendar, 
  FileText, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Clock, 
  Award, 
  IndianRupee 
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Platform Principles & User Guide
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          How Tourist Guide Works
        </h1>
        <p className="text-base text-slate-500 leading-relaxed">
          A full-stack, secure companion platform designed to transform travel in India into an authentic, respectful, and organized cultural immersion.
        </p>
      </div>

      {/* Complete Hackathon Presentation Flow Showcase */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-white/10 px-3 py-1 rounded-full">
            Hackathon Live Evaluation Path
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
            13-Step Interactive Demo Walkthrough
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            You can verify every requirement live on this platform from end to end:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-teal-300 font-bold block">1. Open Homepage</span>
            <p className="text-slate-300">Explore hero banner "Explore More, Worry Less" and global search bar.</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-teal-300 font-bold block">2. Search "Tirupati"</span>
            <p className="text-slate-300">View popular attractions (Sri Venkateswara, Chandragiri Fort, Silathoranam).</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-teal-300 font-bold block">3. Compare Guides</span>
            <p className="text-slate-300">Filter by languages (Telugu/Hindi), ratings, experience, and daily INR rates.</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-teal-300 font-bold block">4. Open Guide Profile</span>
            <p className="text-slate-300">Review Ramesh Sharma’s verified badge, biography, and included/excluded services.</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-teal-300 font-bold block">5. Request 2-Day Booking</span>
            <p className="text-slate-300">Submit date range, elder care requirements, and review snapshot price.</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-teal-300 font-bold block">6. Guide Accepts Request</span>
            <p className="text-slate-300">Switch to Guide role via the top Demo banner and click "Accept Request".</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-teal-300 font-bold block">7. Guide Creates Itinerary</span>
            <p className="text-slate-300">Customize day-wise attractions, visiting hours, food stops, and emergency info.</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-teal-300 font-bold block">8. Tourist Views Itinerary</span>
            <p className="text-slate-300">Switch back to Tourist (Ananya) to see the newly saved customized plan.</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-teal-300 font-bold block">9. Calculate Trip Budget</span>
            <p className="text-slate-300">Use the interactive Budget Planner to compare against target spending.</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-teal-300 font-bold block">10. Exchange In-App Messages</span>
            <p className="text-slate-300">Send notes regarding wheelchair accessibility and pickup timings in real-time.</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-teal-300 font-bold block">11. Guide Marks Trip Completed</span>
            <p className="text-slate-300">Move trip status from In Progress to Completed in Guide Dashboard.</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-teal-300 font-bold block">12. Tourist Submits Review</span>
            <p className="text-slate-300">Submit 5-star rating, behavior evaluation, and celebrate with confetti!</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-teal-300 font-bold block">13. Auto-Updated Guide Rating</span>
            <p className="text-slate-300">The guide's average rating & review count dynamically update across the app!</p>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition shadow-md"
          >
            Start the Demo Journey Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Safety & Integrity Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-card border border-slate-100 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Guide Verification Policy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No guide is permitted to display the <strong>Verified Guide</strong> badge without submitting valid government identification and regional tourism accreditations to the Platform Administrator. Sample profiles created in demo mode are explicitly tagged with <span className="text-amber-700 bg-amber-50 px-1 rounded font-semibold">Demo Profile</span> to maintain absolute integrity.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-card border border-slate-100 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <IndianRupee className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Price Snapshot & Overlap Prevention</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            When a booking is confirmed, the guide's agreed daily rate is stored as an immutable snapshot to ensure historical bookings never change if guide rates are updated. Database constraints prevent any guide from being double-booked on overlapping dates once accepted.
          </p>
        </div>
      </div>

    </div>
  );
};
