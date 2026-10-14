import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { VerifiedBadge, DemoTag } from '../components/common/Badge';
import { StarRating } from '../components/common/StarRating';
import { 
  Search, 
  MapPin, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Compass, 
  HeartHandshake, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  Clock, 
  IndianRupee 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { destinations, guides, reviews } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/destinations?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/destinations');
    }
  };

  // Top destinations & top verified guides
  const popularDestinations = destinations.slice(0, 6);
  const featuredGuides = guides.filter(g => g.isVerified).slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden hero-gradient text-white pt-16 pb-24 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Your Personal Travel Companion Across India
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Explore More, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-300 via-teal-100 to-amber-200 bg-clip-text text-transparent">
              Worry Less
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover destinations with trusted local guides who take care of your journey — from sacred temples to hidden culinary gems.
          </p>

          {/* Integrated Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto bg-white rounded-2xl p-2.5 sm:p-3 shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-white/20 text-slate-800"
          >
            <div className="flex-1 flex items-center gap-3 px-3 w-full border-b md:border-b-0 md:border-r border-slate-100 py-2">
              <MapPin className="w-5 h-5 text-teal-600 shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Where to?</label>
                <input
                  type="text"
                  placeholder="e.g. Tirupati, Hyderabad, Goa, Jaipur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-800 focus:outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex-1 flex items-center gap-3 px-3 w-full py-2">
              <Compass className="w-5 h-5 text-teal-600 shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience Type</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-800 focus:outline-none bg-transparent cursor-pointer"
                >
                  <option value="">All Experiences</option>
                  <option value="Spiritual & Heritage">Spiritual & Temples</option>
                  <option value="Heritage & Food">Historic Forts & Food</option>
                  <option value="Beach & Leisure">Beaches & Coastal</option>
                  <option value="Royal & Culture">Royal Palaces & Culture</option>
                  <option value="Nature & Backwaters">Nature & Backwaters</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-7 py-3.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>

          {/* Quick CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/destinations"
              className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-md hover:bg-slate-100 transition flex items-center gap-2"
            >
              Explore Destinations
              <ArrowRight className="w-4 h-4 text-teal-600" />
            </Link>
            
            <Link
              to="/guides"
              className="px-6 py-3 rounded-xl bg-teal-800/60 hover:bg-teal-800/90 text-white border border-teal-500/40 font-bold text-sm backdrop-blur-md transition flex items-center gap-2"
            >
              Find a Guide
              <Users className="w-4 h-4 text-teal-300" />
            </Link>
          </div>

          {/* Quick highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 text-center max-w-4xl mx-auto border-t border-white/10 text-xs">
            <div>
              <span className="block text-2xl font-extrabold text-teal-300">100%</span>
              <span className="text-slate-300">Admin Verified Guides</span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-teal-300">₹0</span>
              <span className="text-slate-300">Hidden Booking Fees</span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-teal-300">6+</span>
              <span className="text-slate-300">Iconic Destinations</span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-teal-300">4.9 ★</span>
              <span className="text-slate-300">Average Guide Rating</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. POPULAR DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Curated Escapes
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Popular Destinations
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Explore timeless temple corridors in Tirupati, royal gates of Hyderabad, golden dunes, and tranquil Kerala backwaters.
            </p>
          </div>

          <Link
            to="/destinations"
            className="text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 group"
          >
            View all 6 destinations
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-cardHover transition-all duration-300 border border-slate-100 flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-800 shadow-sm">
                  {dest.category}
                </span>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1 text-teal-300 text-xs font-semibold mb-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {dest.state}, India
                  </div>
                  <h3 className="text-2xl font-black">{dest.name}</h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>

                {/* Popular attractions pill */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Top Attractions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dest.popularAttractions.slice(0, 3).map((att) => (
                      <span
                        key={att}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {att}
                      </span>
                    ))}
                    {dest.popularAttractions.length > 3 && (
                      <span className="text-[11px] bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded-md">
                        +{dest.popularAttractions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Duration & Budget */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                    <span className="font-semibold text-slate-800">{dest.suggestedDuration}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Budget</span>
                    <span className="font-bold text-teal-700">₹{dest.indicativeBudgetMin.toLocaleString('en-IN')} - ₹{dest.indicativeBudgetMax.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link
                    to={`/destinations/${dest.slug}`}
                    className="flex-1 py-2 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/guides?destination=${encodeURIComponent(dest.name)}`}
                    className="flex-1 py-2 text-center text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition shadow-xs"
                  >
                    Find Guides ({dest.guideCount})
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED LOCAL GUIDES */}
      <section className="bg-slate-100/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Verified Experts
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                Featured Local Guides
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Every guide is vetted for background, local heritage mastery, safety, and traveler satisfaction.
              </p>
            </div>

            <Link
              to="/guides"
              className="text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 group"
            >
              Browse all guides
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-2xl p-5 shadow-card hover:shadow-cardHover transition-all border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative mb-4">
                    <img
                      src={guide.avatarUrl}
                      alt={guide.fullName}
                      className="w-20 h-20 rounded-2xl object-cover ring-2 ring-teal-500/20 shadow-md mx-auto"
                    />
                    <div className="flex flex-col items-center gap-1 mt-3">
                      <VerifiedBadge isVerified={guide.isVerified} />
                      <DemoTag label="Demo Profile" />
                    </div>
                  </div>

                  {/* Name & Headline */}
                  <div className="text-center space-y-1">
                    <h3 className="font-bold text-base text-slate-900">{guide.fullName}</h3>
                    <p className="text-xs font-semibold text-teal-700 flex items-center justify-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {guide.supportedDestinations.join(', ')}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {guide.headline}
                    </p>
                  </div>

                  {/* Rating & Exp */}
                  <div className="flex items-center justify-center gap-4 py-3 my-3 border-y border-slate-100 text-xs">
                    <StarRating rating={guide.rating} totalReviews={guide.reviewCount} size="sm" />
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-700">{guide.experienceYears} yrs exp</span>
                  </div>

                  {/* Languages */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Languages</span>
                    <p className="text-xs text-slate-600 font-medium">
                      {guide.languages.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Daily Fee</span>
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{guide.pricePerDay.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-slate-500">/ day</span>
                    </span>
                  </div>

                  <Link
                    to={`/guides/${guide.id}`}
                    className="block w-full py-2.5 text-center text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition shadow-xs"
                  >
                    View Profile & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            How Tourist Guide Works
          </h2>
          <p className="text-sm text-slate-500">
            From search to safe return — transparent, personal, and tailored to your travel rhythm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card text-center space-y-3 relative">
            <div className="w-12 h-12 mx-auto rounded-xl bg-teal-100 text-teal-700 font-extrabold text-lg flex items-center justify-center shadow-xs">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900">Search Destination</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore Tirupati, Hyderabad, Goa, or Jaipur with attractions, estimated budgets, and travel durations.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card text-center space-y-3 relative">
            <div className="w-12 h-12 mx-auto rounded-xl bg-teal-100 text-teal-700 font-extrabold text-lg flex items-center justify-center shadow-xs">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900">Choose Verified Guide</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compare ratings, languages, years of experience, daily rates in INR, and verified government credentials.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card text-center space-y-3 relative">
            <div className="w-12 h-12 mx-auto rounded-xl bg-teal-100 text-teal-700 font-extrabold text-lg flex items-center justify-center shadow-xs">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900">Personalized Itinerary</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your guide accepts the booking and creates a day-wise plan with meal stops, elder pacing, and temple darshan guidance.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card text-center space-y-3 relative">
            <div className="w-12 h-12 mx-auto rounded-xl bg-teal-100 text-teal-700 font-extrabold text-lg flex items-center justify-center shadow-xs">
              4
            </div>
            <h3 className="font-bold text-base text-slate-900">Complete & Review</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enjoy your worry-free journey, chat in real-time, mark the trip complete, and post authentic star reviews.
            </p>
          </div>
        </div>
      </section>

      {/* 5. TRAVEL BENEFITS & SAFETY COMMITMENT */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Safety & Integrity Standard
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why Travelers Trust Our Local Companion Network
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              We eliminate predatory tourist traps, unvetted drivers, and confusing queue protocols. When you book a verified guide on Tourist Guide, you are guided by a community-reviewed cultural ambassador.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Document-Verified Guides</h4>
                  <p className="text-xs text-slate-300">Government identity and regional tourism accreditation reviewed by administrators before verification badges are granted.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Senior Citizen & Family Attentive</h4>
                  <p className="text-xs text-slate-300">Guides specially trained to accommodate wheelchair logistics, elderly pacing, and dietary needs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Transparent INR (₹) Snapshots</h4>
                  <p className="text-xs text-slate-300">No price gouging. Guide fees are fixed snapshot estimates calculated per booked day.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition shadow-md"
              >
                Learn More About Our Safety Rules
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Visual Showcase card */}
          <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-300" />
              Verified Guide Guarantee
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our guides sign an ethical code of conduct forbidding forced shopping stops or unauthorized commission schemes.
            </p>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300 pb-2 border-b border-white/10">
                <span>Direct In-App Messaging</span>
                <span className="text-teal-400 font-bold">Enabled</span>
              </div>
              <div className="flex justify-between text-slate-300 pb-2 border-b border-white/10">
                <span>Anti-Overlap Booking Check</span>
                <span className="text-teal-400 font-bold">Active</span>
              </div>
              <div className="flex justify-between text-slate-300 pb-2 border-b border-white/10">
                <span>Post-Trip Verified Reviews</span>
                <span className="text-teal-400 font-bold">100% Verified</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Emergency Support Liaison</span>
                <span className="text-teal-400 font-bold">Included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS (EXPLICITLY LABELED DEMO CONTENT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <DemoTag label="Fictional Demo Testimonials" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            What Travelers Experience
          </h2>
          <p className="text-xs text-slate-500">
            Real stories from travelers who explored with verified local companions (Sample demonstration records).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between"
            >
              <div className="space-y-3">
                <StarRating rating={rev.rating} size="sm" showNumber={false} />
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.writtenFeedback}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={rev.touristAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'}
                    alt={rev.touristName}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-teal-500"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{rev.touristName}</h4>
                    <span className="text-[10px] text-teal-600 font-medium">Verified Tourist</span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400">
                  {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-blue-800 rounded-3xl p-10 sm:p-14 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Discover India with a Verified Local Guide?
            </h2>
            <p className="text-sm text-teal-100">
              Start with Tirupati, Hyderabad, Goa, or Jaipur. Request a booking in 2 minutes and explore without worry.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/guides"
                className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-md hover:bg-slate-100 transition"
              >
                Find a Guide Now
              </Link>
              <Link
                to="/budget"
                className="px-6 py-3 rounded-xl bg-teal-900/60 hover:bg-teal-900/90 text-white border border-teal-300/40 font-bold text-sm transition"
              >
                Plan Trip Budget
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
