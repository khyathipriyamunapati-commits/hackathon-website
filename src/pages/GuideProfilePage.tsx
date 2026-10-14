import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { VerifiedBadge, DemoTag } from '../components/common/Badge';
import { StarRating } from '../components/common/StarRating';
import { 
  MapPin, 
  Award, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  IndianRupee, 
  Languages, 
  ArrowLeft, 
  MessageSquare, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export const GuideProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getGuideById, reviews } = useApp();

  const guide = getGuideById(id || '');

  // Availability preview states
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );

  if (!guide) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Guide Profile Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The guide profile you requested could not be located.</p>
        <Link
          to="/guides"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Guides
        </Link>
      </div>
    );
  }

  // Get reviews for this guide
  const guideReviews = reviews.filter((r) => r.guideId === guide.id && !r.isModerated);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Main Grid: Left Profile + Right Booking Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Guide Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={guide.avatarUrl}
              alt={guide.fullName}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-teal-500/10 shadow-lg shrink-0"
            />

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <VerifiedBadge isVerified={guide.isVerified} />
                <DemoTag label="Demo Profile" />
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {guide.experienceYears} Years Experience
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {guide.fullName}
              </h1>

              <p className="text-sm font-semibold text-teal-700 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-4 h-4" />
                Specialist in {guide.supportedDestinations.join(', ')}
              </p>

              <p className="text-xs text-slate-600 font-medium pt-1">
                {guide.headline}
              </p>

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
                <StarRating rating={guide.rating} totalReviews={guide.reviewCount} size="md" />
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-3">
            <h2 className="text-lg font-bold text-slate-900">About {guide.fullName}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {guide.bio}
            </p>
          </div>

          {/* Languages & Specializations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-teal-600" />
                Languages Spoken
              </h3>
              <p className="text-sm font-bold text-slate-800">
                {guide.languages.join(' • ')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-teal-600" />
                Specializations
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {guide.specializations.map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-teal-50 text-teal-800 px-2.5 py-1 rounded-md font-medium border border-teal-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Services Offered */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Services Offered</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {guide.servicesOffered.map((svc) => (
                <div key={svc} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{svc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Included vs Excluded Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 space-y-3">
              <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Included in Daily Fee
              </h3>
              <ul className="space-y-2 text-xs text-emerald-800">
                {guide.includedServices.map((inc) => (
                  <li key={inc} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-slate-400" />
                Excluded (Paid Separately)
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {guide.excludedServices.map((exc) => (
                  <li key={exc} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Availability Calendar Notice */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Guide Availability Checker</h2>
                <p className="text-xs text-slate-500">Pick a planned trip date to check typical guide schedule.</p>
              </div>
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>

            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-xl font-medium focus:outline-teal-500"
              />
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Available for Booking Request
              </span>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Note: Availability is indicative until the guide formally accepts the booking request. Overlapping confirmed trips are automatically prevented.
            </p>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Verified Traveler Reviews</h2>
                <p className="text-xs text-slate-500">Only tourists with completed bookings can submit reviews.</p>
              </div>
              <StarRating rating={guide.rating} totalReviews={guide.reviewCount} size="md" />
            </div>

            {guideReviews.length > 0 ? (
              <div className="space-y-4">
                {guideReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.touristAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'}
                          alt={rev.touristName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-500"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800">{rev.touristName}</span>
                          <span className="text-[10px] text-teal-600 block">Verified Completed Booking</span>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <StarRating rating={rev.rating} size="sm" showNumber={false} />

                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{rev.writtenFeedback}"
                    </p>

                    <div className="flex gap-4 pt-1 text-[10px] text-slate-400">
                      <span>Behavior: <strong>{rev.guideBehaviorRating}/5</strong></span>
                      <span>Pricing Value: <strong>{rev.pricingSatisfactionRating}/5</strong></span>
                      <span>Itinerary: <strong>{rev.tripExperienceRating}/5</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No reviews yet for this guide profile.
              </p>
            )}
          </div>

        </div>

        {/* Right Column: Sticky Booking Card (1 Col) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-cardHover border border-slate-100 space-y-6">
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Guide Daily Fee
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-900">
                  ₹{guide.pricePerDay.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-medium text-slate-500">/ day</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1 text-amber-950">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                Transparent Pricing
              </span>
              <p className="text-[11px] leading-relaxed">
                Prices are indicative snapshots calculated by number of booked days. Availability is confirmed when the guide accepts your booking request.
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Supported Destinations</span>
                <span className="font-semibold text-slate-900">{guide.supportedDestinations.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Experience</span>
                <span className="font-semibold text-slate-900">{guide.experienceYears} Years</span>
              </div>
              <div className="flex justify-between">
                <span>Rating</span>
                <span className="font-semibold text-teal-700">{guide.rating} ★ ({guide.reviewCount} reviews)</span>
              </div>
              <div className="flex justify-between">
                <span>Direct In-App Chat</span>
                <span className="font-semibold text-emerald-600">Included</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Link
                to={`/book/${guide.id}`}
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                Book This Guide
              </Link>

              <Link
                to={`/budget?guideRate=${guide.pricePerDay}`}
                className="w-full py-2.5 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition block"
              >
                Calculate Total Trip Budget
              </Link>
            </div>

            <div className="pt-2 text-center text-[10px] text-slate-400">
              Zero platform booking fee • Secure hackathon presentation demo
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
