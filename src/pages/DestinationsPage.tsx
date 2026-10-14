import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/common/EmptyState';
import { 
  Search, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Users, 
  Compass, 
  Sparkles, 
  Filter, 
  ArrowRight 
} from 'lucide-react';

export const DestinationsPage: React.FC = () => {
  const { destinations } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(20000);

  // Sync state if queryParam changes
  React.useEffect(() => {
    if (queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  const categories = [
    'All',
    'Spiritual & Heritage',
    'Heritage & Food',
    'Beach & Leisure',
    'Royal & Culture',
    'Nature & Backwaters',
    'City & Modern Culture',
  ];

  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const matchesSearch =
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.popularAttractions.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || dest.category.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesBudget = dest.indicativeBudgetMin <= maxBudget;

      return matchesSearch && matchesCategory && matchesBudget;
    });
  }, [destinations, searchQuery, selectedCategory, maxBudget]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxBudget(20000);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
          Destination Discovery
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Explore Handpicked Destinations
        </h1>
        <p className="text-sm text-slate-500">
          Discover sacred temple towns, royal palaces, coastal trails, and cultural hubs with verified local guides.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by city (e.g. Tirupati, Hyderabad) or attraction..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-slate-200 rounded-xl focus:outline-teal-500 bg-slate-50/50"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-medium border border-slate-200 rounded-xl focus:outline-teal-500 bg-slate-50/50"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Slider */}
          <div className="flex flex-col justify-center px-2">
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
              <span>Max Starting Budget:</span>
              <span className="font-bold text-teal-700">₹{maxBudget.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={3000}
              max={20000}
              step={500}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Quick Filters:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Clear */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>
          Showing <strong>{filteredDestinations.length}</strong> {filteredDestinations.length === 1 ? 'destination' : 'destinations'}
        </p>

        {(searchQuery || selectedCategory !== 'All' || maxBudget < 20000) && (
          <button
            onClick={handleClearFilters}
            className="text-teal-700 hover:text-teal-800 font-bold hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-cardHover transition-all duration-300 border border-slate-100 flex flex-col justify-between"
            >
              <div>
                {/* Hero image with overlay */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-slate-800 shadow-sm">
                    {dest.category}
                  </span>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-1 text-teal-300 text-xs font-semibold mb-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {dest.state}, {dest.country}
                    </div>
                    <h2 className="text-2xl font-black">{dest.name}</h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Top Attractions */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Must-Visit Attractions
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.popularAttractions.map((att) => (
                        <span
                          key={att}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          {att}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trip specs */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Duration</span>
                      <span className="font-semibold text-slate-800">{dest.suggestedDuration}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Indicative Budget</span>
                      <span className="font-bold text-teal-700">
                        ₹{dest.indicativeBudgetMin.toLocaleString('en-IN')} - ₹{dest.indicativeBudgetMax.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Best Time: <strong>{dest.bestTimeToVisit}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center gap-2">
                <Link
                  to={`/destinations/${dest.slug}`}
                  className="flex-1 py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Explore City
                </Link>
                <Link
                  to={`/guides?destination=${encodeURIComponent(dest.name)}`}
                  className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition shadow-xs flex items-center justify-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  View Guides ({dest.guideCount})
                </Link>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Destinations Found"
          description={`We couldn't find any destinations matching "${searchQuery}". Try searching for Tirupati, Hyderabad, Goa, Jaipur, Kerala, or reset your filters.`}
          actionText="Reset All Filters"
          onAction={handleClearFilters}
        />
      )}

    </div>
  );
};
