import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecommendationCategory, Recommendation } from '../types';
import { 
  UtensilsCrossed, 
  Hotel, 
  Car, 
  MapPin, 
  IndianRupee, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const { recommendations, destinations, currentUser, addRecommendation } = useApp();

  const [selectedDestination, setSelectedDestination] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Rec Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<RecommendationCategory>('restaurant');
  const [newDest, setNewDest] = useState('Tirupati');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPrice, setNewPrice] = useState('₹300 - ₹500 per person');
  const [newDietary, setNewDietary] = useState<'veg' | 'non_veg' | 'both'>('veg');
  const [newNotes, setNewNotes] = useState('');

  const categories = [
    { label: 'All Recommendations', value: 'All' },
    { label: 'Budget Hotels', value: 'hotel_budget' },
    { label: 'Mid-Range Hotels', value: 'hotel_midrange' },
    { label: 'Restaurants', value: 'restaurant' },
    { label: 'Local Food & Sweets', value: 'local_food' },
    { label: 'Transport Providers', value: 'transport' },
  ];

  const filteredRecs = recommendations.filter((rec) => {
    const matchesDest =
      selectedDestination === 'All' ||
      rec.destinationName.toLowerCase() === selectedDestination.toLowerCase();
    const matchesCat =
      selectedCategory === 'All' || rec.category === selectedCategory;
    return matchesDest && matchesCat;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDesc.trim()) return;

    addRecommendation({
      destinationName: newDest,
      name: newName.trim(),
      category: newCategory,
      description: newDesc.trim(),
      location: newLocation.trim() || 'Central City',
      estimatedPrice: newPrice.trim(),
      dietaryType: newCategory === 'restaurant' || newCategory === 'local_food' ? newDietary : undefined,
      recommendationNotes: newNotes.trim() || 'Recommended based on local hygiene and authentic hospitality.',
      guideId: currentUser.role === 'guide' ? currentUser.id : undefined,
      guideName: currentUser.role === 'guide' ? currentUser.fullName : 'Verified Guide Advisory',
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewDesc('');
    setNewLocation('');
    setNewNotes('');
  };

  const getCategoryIcon = (cat: RecommendationCategory) => {
    switch (cat) {
      case 'hotel_budget':
      case 'hotel_midrange':
        return <Hotel className="w-4 h-4 text-blue-600" />;
      case 'restaurant':
      case 'local_food':
        return <UtensilsCrossed className="w-4 h-4 text-orange-500" />;
      case 'transport':
        return <Car className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-teal-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            Guide-Curated Advisory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Local Food, Stays & Transport
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Vetted recommendations from local guides. Authentic flavors, elder-friendly rooms, and fair-rate cab operators.
          </p>
        </div>

        {/* Guides can add new recommendations */}
        {currentUser.role === 'guide' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            Add Recommendation
          </button>
        )}
      </div>

      {/* Transparent Disclaimer Box */}
      <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Informational Advice Notice:</p>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            All listings are curated recommendations provided by guides for traveler comfort. No accommodation, restaurant seating, or cab booking has been pre-reserved without a direct third-party reservation.
          </p>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="bg-white p-4 rounded-2xl shadow-card border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        
        {/* Destination Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">City:</span>
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500"
          >
            <option value="All">All Cities</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat.value
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecs.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-2xl p-6 shadow-card hover:shadow-cardHover transition border border-slate-100 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                  {getCategoryIcon(rec.category)}
                  {rec.category.replace('_', ' ')}
                </span>

                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  {rec.estimatedPrice}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 leading-snug">{rec.name}</h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {rec.description}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{rec.location} • <strong>{rec.destinationName}</strong></span>
              </div>

              {rec.dietaryType && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                    rec.dietaryType === 'veg' ? 'bg-emerald-500' : 'bg-red-500'
                  }`} />
                  <span className="text-[11px] font-semibold text-slate-700 uppercase">
                    {rec.dietaryType === 'veg' ? 'Pure Vegetarian' : rec.dietaryType === 'non_veg' ? 'Non-Vegetarian' : 'Veg & Non-Veg'}
                  </span>
                </div>
              )}

              {rec.recommendationNotes && (
                <div className="p-3 bg-teal-50/60 rounded-xl text-xs text-teal-900 border border-teal-100">
                  <span className="font-bold block text-[11px] mb-0.5">Guide Recommendation Tip:</span>
                  <p className="text-[11px] leading-relaxed">{rec.recommendationNotes}</p>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Recommended by:</span>
              <span className="font-bold text-slate-700">{rec.guideName || 'Verified Guide Advisory'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Guide to Add Recommendation */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Recommendation</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Place / Provider Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Hotel Mayura or Grand Ridge"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as RecommendationCategory)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="local_food">Local Food / Sweets</option>
                    <option value="hotel_budget">Budget Hotel</option>
                    <option value="hotel_midrange">Mid-Range Hotel</option>
                    <option value="transport">Transport Provider</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <select
                    value={newDest}
                    onChange={(e) => setNewDest(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location / Landmark</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Near Alipiri Gate / Old City"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Indicative Price</label>
                <input
                  type="text"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="e.g. ₹250 per person or ₹3,000 / night"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe the atmosphere, specialties, hygiene..."
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Insider Guide Tip</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Visit before 8 AM to avoid long lines"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg"
                >
                  Save Recommendation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
