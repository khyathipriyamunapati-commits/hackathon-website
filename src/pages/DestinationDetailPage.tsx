import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { VerifiedBadge, DemoTag } from '../components/common/Badge';
import { StarRating } from '../components/common/StarRating';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  IndianRupee, 
  Users, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  UtensilsCrossed, 
  Hotel, 
  Compass, 
  ArrowRight 
} from 'lucide-react';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { destinations, guides, recommendations } = useApp();

  const destination = destinations.find((d) => d.slug === slug);

  if (!destination) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Destination Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The destination you are looking for does not exist.</p>
        <Link
          to="/destinations"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Destinations
        </Link>
      </div>
    );
  }

  // Filter guides for this destination
  const destinationGuides = guides.filter((g) =>
    g.supportedDestinations.some(
      (dest) => dest.toLowerCase() === destination.name.toLowerCase()
    )
  );

  // Filter recommendations
  const destinationRecs = recommendations.filter(
    (r) => r.destinationName.toLowerCase() === destination.name.toLowerCase()
  );

  return (
    <div className="space-y-12 pb-20">
      
      {/* Hero Banner */}
      <div className="relative h-96 lg:h-[420px] overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />

        <div className="absolute top-6 left-4 sm:left-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs font-semibold backdrop-blur-md transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        </div>

        <div className="absolute bottom-8 left-4 sm:left-8 right-4 sm:right-8 max-w-5xl mx-auto text-white space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-teal-500 text-white rounded-full text-xs font-bold uppercase tracking-wider">
              {destination.category}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-300" />
              {destination.state}, India
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {destination.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
            {destination.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Quick Facts Strip */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Suggested Duration</span>
            <p className="text-base font-extrabold text-slate-900 mt-1">{destination.suggestedDuration}</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Indicative Budget</span>
            <p className="text-base font-extrabold text-teal-700 mt-1">
              ₹{destination.indicativeBudgetMin.toLocaleString('en-IN')} - ₹{destination.indicativeBudgetMax.toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Best Time to Visit</span>
            <p className="text-base font-extrabold text-slate-900 mt-1">{destination.bestTimeToVisit}</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Verified Guides</span>
            <p className="text-base font-extrabold text-teal-600 mt-1">{destinationGuides.length} Available</p>
          </div>
        </div>

        {/* Popular Attractions Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Must-See Attractions in {destination.name}</h2>
              <p className="text-xs text-slate-500">Key cultural landmarks, architectural treasures, and sacred locations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {destination.popularAttractions.map((attraction, idx) => (
              <div
                key={attraction}
                className="bg-white p-5 rounded-xl border border-slate-100 shadow-card flex items-start gap-3.5 hover:border-teal-200 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 font-extrabold text-sm flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{attraction}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Guided historical context, entry timings, and queue assistance provided by local companions.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Guides Available in this destination */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Local Companions
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Verified Guides in {destination.name}
              </h2>
              <p className="text-xs text-slate-500">
                Connect with local specialists for personalized itineraries and stress-free navigation.
              </p>
            </div>

            <Link
              to={`/budget?destination=${encodeURIComponent(destination.name)}`}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              Estimate Trip Budget for {destination.name} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {destinationGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinationGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="bg-white rounded-2xl p-6 shadow-card hover:shadow-cardHover transition border border-slate-100 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={guide.avatarUrl}
                        alt={guide.fullName}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/20 shadow-md"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <VerifiedBadge isVerified={guide.isVerified} />
                          <DemoTag />
                        </div>
                        <h3 className="font-bold text-base text-slate-900 mt-1">{guide.fullName}</h3>
                        <p className="text-xs text-slate-500">{guide.experienceYears} Years Experience</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                      {guide.bio}
                    </p>

                    <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Rating:</span>
                        <StarRating rating={guide.rating} totalReviews={guide.reviewCount} size="sm" />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Languages:</span>
                        <span className="font-semibold text-slate-800">{guide.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Guide Daily Rate</span>
                      <span className="text-lg font-black text-slate-900">
                        ₹{guide.pricePerDay.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-slate-500">/ day</span>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/guides/${guide.id}`}
                        className="flex-1 py-2 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                      >
                        Profile
                      </Link>
                      <Link
                        to={`/book/${guide.id}?destination=${encodeURIComponent(destination.name)}`}
                        className="flex-1 py-2 text-center text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition shadow-xs"
                      >
                        Book Trip
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500">
              No specific guides listed for {destination.name} yet. Browse our verified statewide guides.
            </div>
          )}
        </section>

        {/* Local Food & Accommodation recommendations */}
        {destinationRecs.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Guide Recommended Stays & Food in {destination.name}</h2>
              <p className="text-xs text-slate-500">Curated by local guides based on hygiene, family comfort, and authentic tastes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {destinationRecs.map((rec) => (
                <div key={rec.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {rec.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{rec.estimatedPrice}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{rec.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                  
                  <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-teal-600" />
                    <span>{rec.location}</span>
                  </div>

                  {rec.recommendationNotes && (
                    <div className="p-2 bg-amber-50/70 rounded-lg text-[11px] text-amber-900 border border-amber-100">
                      <strong>Guide Tip:</strong> {rec.recommendationNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
