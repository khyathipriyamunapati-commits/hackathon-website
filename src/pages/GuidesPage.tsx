import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { VerifiedBadge, DemoTag } from '../components/common/Badge';
import { StarRating } from '../components/common/StarRating';
import { EmptyState } from '../components/common/EmptyState';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Languages, 
  Award, 
  IndianRupee, 
  Check, 
  Filter, 
  Calendar, 
  ArrowRight 
} from 'lucide-react';

export const GuidesPage: React.FC = () => {
  const { guides, destinations } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const destParam = searchParams.get('destination') || 'All';
  const [selectedDestination, setSelectedDestination] = useState<string>(destParam);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [minRating, setMinRating] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  // Sync if URL searchParams changed
  React.useEffect(() => {
    if (destParam !== selectedDestination) {
      setSelectedDestination(destParam);
    }
  }, [destParam]);

  const allLanguages = ['All', 'English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'French', 'Urdu'];

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      // Destination filter
      const matchesDest =
        selectedDestination === 'All' ||
        guide.supportedDestinations.some(
          (d) => d.toLowerCase() === selectedDestination.toLowerCase()
        );

      // Search query (name, headline, specializations)
      const matchesSearch =
        searchQuery === '' ||
        guide.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Language filter
      const matchesLang =
        selectedLanguage === 'All' || guide.languages.includes(selectedLanguage);

      // Price filter
      const matchesPrice = guide.pricePerDay <= maxPrice;

      // Rating filter
      const matchesRating = guide.rating >= minRating;

      // Verified filter
      const matchesVerified = !verifiedOnly || guide.isVerified;

      return (
        matchesDest &&
        matchesSearch &&
        matchesLang &&
        matchesPrice &&
        matchesRating &&
        matchesVerified
      );
    });
  }, [guides, selectedDestination, searchQuery, selectedLanguage, maxPrice, minRating, verifiedOnly]);

  const handleResetFilters = () => {
    setSelectedDestination('All');
    setSearchQuery('');
    setSelectedLanguage('All');
    setMaxPrice(3000);
    setMinRating(0);
    setVerifiedOnly(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
          Find Local Companions
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Verified Local Travel Guides
        </h1>
        <p className="text-sm text-slate-500">
          Connect with trusted experts who know the history, languages, hidden temples, and authentic local food of every city.
        </p>
      </div>

      {/* Filter Control Box */}
      <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Destination */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Destination
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500"
            >
              <option value="All">All Destinations</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Spoken Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500"
            >
              {allLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'All' ? 'All Languages' : lang}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500"
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>4.5 Stars & Above</option>
              <option value={4.8}>4.8 Stars & Above</option>
            </select>
          </div>

          {/* Max Daily Fee Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>Max Daily Fee</span>
              <span className="text-teal-700">₹{maxPrice.toLocaleString('en-IN')}/day</span>
            </div>
            <input
              type="range"
              min={1200}
              max={3000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-teal-600 mt-2 cursor-pointer"
            />
          </div>

        </div>

        {/* Bottom Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Keyword Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter by guide name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-teal-500"
            />
          </div>

          {/* Verified Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
            />
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Admin Verified Only
            </span>
          </label>
        </div>
      </div>

      {/* Guide Count & Clear */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>
          Found <strong>{filteredGuides.length}</strong> local {filteredGuides.length === 1 ? 'guide' : 'guides'}
        </p>

        {(selectedDestination !== 'All' || searchQuery || selectedLanguage !== 'All' || maxPrice < 3000 || minRating > 0 || verifiedOnly) && (
          <button
            onClick={handleResetFilters}
            className="text-teal-700 hover:text-teal-800 font-bold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Guides Grid */}
      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-cardHover transition border border-slate-100 flex flex-col justify-between"
            >
              <div>
                {/* Header Profile Info */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={guide.avatarUrl}
                    alt={guide.fullName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/20 shadow-md shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <VerifiedBadge isVerified={guide.isVerified} />
                      <DemoTag label="Demo Profile" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {guide.fullName}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {guide.supportedDestinations.join(', ')}
                    </p>
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-800 mb-2">
                  {guide.headline}
                </p>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                  {guide.bio}
                </p>

                {/* Rating & Exp */}
                <div className="py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs mb-3">
                  <StarRating rating={guide.rating} totalReviews={guide.reviewCount} size="sm" />
                  <span className="font-semibold text-slate-700">{guide.experienceYears} yrs experience</span>
                </div>

                {/* Specializations & Languages */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Specializations
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {guide.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-medium border border-teal-200/50"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Languages Spoken
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      {guide.languages.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing & Booking */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Rate Per Day</span>
                    <span className="text-lg font-black text-slate-900">
                      ₹{guide.pricePerDay.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Fixed Daily Rate</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/guides/${guide.id}`}
                    className="flex-1 py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`/book/${guide.id}`}
                    className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition shadow-xs"
                  >
                    Book Guide
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Guides Found"
          description="We couldn't find any guides matching your specific filter criteria. Try broadening your language, destination, or price filters."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      )}

    </div>
  );
};
