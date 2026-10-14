import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VerifiedBadge, DemoTag } from '../../components/common/Badge';
import { StarRating } from '../../components/common/StarRating';
import { Destination } from '../../types';
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileCheck, 
  Sparkles, 
  AlertTriangle, 
  Plus, 
  Compass, 
  Eye, 
  Layers 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    guides, 
    destinations, 
    bookings, 
    reviews, 
    verificationRequests, 
    approveVerification, 
    rejectVerification, 
    addDestination, 
    isDemoMode 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'verification' | 'destinations' | 'reviews' | 'bookings'>('verification');

  // Destination Creation State
  const [showAddDestModal, setShowAddDestModal] = useState<boolean>(false);
  const [destName, setDestName] = useState('');
  const [destState, setDestState] = useState('');
  const [destCategory, setDestCategory] = useState('Heritage & Culture');
  const [destDescription, setDestDescription] = useState('');
  const [destHeroImage, setDestHeroImage] = useState('https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80');
  const [destDuration, setDestDuration] = useState('2 - 3 Days');
  const [destBudgetMin, setDestBudgetMin] = useState<number>(4000);
  const [destBudgetMax, setDestBudgetMax] = useState<number>(10000);
  const [destBestTime, setDestBestTime] = useState('October to March');
  const [destAttractions, setDestAttractions] = useState('Central Fort, Palace Grounds, Sacred Temple');

  // Stats
  const totalTouristsCount = 18; // demo count
  const totalGuidesCount = guides.length;
  const verifiedGuidesCount = guides.filter((g) => g.isVerified).length;
  const pendingVerifications = verificationRequests.filter((v) => v.status === 'pending');

  const handleApprove = (reqId: string) => {
    approveVerification(reqId, 'Credentials verified and approved by Administrator.');
    alert('Guide verification approved! Guide has received the Verified Guide badge.');
  };

  const handleReject = (reqId: string) => {
    const reason = prompt('Please enter the reason for rejection:', 'Incomplete government document scan.');
    if (reason) {
      rejectVerification(reqId, reason);
    }
  };

  const handleAddDestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destName.trim()) return;

    addDestination({
      name: destName.trim(),
      slug: destName.toLowerCase().replace(/\s+/g, '-'),
      state: destState.trim() || 'India',
      country: 'India',
      description: destDescription.trim(),
      heroImage: destHeroImage.trim(),
      category: destCategory,
      popularAttractions: destAttractions.split(',').map((s) => s.trim()).filter(Boolean),
      suggestedDuration: destDuration,
      indicativeBudgetMin: destBudgetMin,
      indicativeBudgetMax: destBudgetMax,
      bestTimeToVisit: destBestTime,
      guideCount: 1,
    });

    setShowAddDestModal(false);
    alert(`Destination "${destName}" added successfully to the catalog!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-800">
              Platform Admin Console
            </span>
            <DemoTag label="Sample Data Console" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            System Administration & Verification
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Enforce database policies, authenticate guide credentials, moderate traveler reviews, and manage destination catalogs.
          </p>
        </div>

        <button
          onClick={() => setShowAddDestModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          Add Destination
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-1">
          <span className="text-slate-400 uppercase text-[10px] font-bold block">Registered Guides</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{totalGuidesCount}</span>
            <Users className="w-5 h-5 text-slate-400" />
          </div>
          <span className="text-[11px] text-teal-700 font-semibold">{verifiedGuidesCount} Verified Guides</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-1">
          <span className="text-slate-400 uppercase text-[10px] font-bold block">Pending Verifications</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-amber-600">{pendingVerifications.length}</span>
            <ShieldCheck className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[11px] text-slate-400">Requires credential review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-1">
          <span className="text-slate-400 uppercase text-[10px] font-bold block">Total Bookings</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{bookings.length}</span>
            <FileCheck className="w-5 h-5 text-slate-400" />
          </div>
          <span className="text-[11px] text-slate-400">
            {bookings.filter(b => b.status === 'completed').length} Completed trips
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-1">
          <span className="text-slate-400 uppercase text-[10px] font-bold block">Active Destinations</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{destinations.length}</span>
            <MapPin className="w-5 h-5 text-slate-400" />
          </div>
          <span className="text-[11px] text-slate-400">Across 5 States</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'verification'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Guide Verification Queue ({pendingVerifications.length})
        </button>

        <button
          onClick={() => setActiveTab('destinations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'destinations'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Destinations ({destinations.length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <StarRating rating={5} size="sm" showNumber={false} />
          Review Moderation ({reviews.length})
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'bookings'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          All Bookings Monitor ({bookings.length})
        </button>
      </div>

      {/* Tab 1: Guide Verification Queue */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          {verificationRequests.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 text-xs text-slate-500">
              No verification applications in queue.
            </div>
          ) : (
            verificationRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                      req.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : req.status === 'rejected'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">#{req.id}</span>
                    <span className="text-xs text-slate-400">
                      Submitted on {new Date(req.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    Applicant: {req.guideName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Email: <strong>{req.guideEmail}</strong> • ID Type: <strong>{req.governmentIdType}</strong>
                  </p>

                  {req.licenseNumber && (
                    <p className="text-xs text-slate-700">
                      License / Registration: <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">{req.licenseNumber}</span>
                    </p>
                  )}

                  {req.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <strong>Application Notes:</strong> {req.notes}
                    </p>
                  )}

                  {req.adminNotes && (
                    <p className="text-xs text-teal-800 bg-teal-50 p-2 rounded-lg border border-teal-200">
                      <strong>Admin Remark:</strong> {req.adminNotes}
                    </p>
                  )}
                </div>

                {/* Approve / Reject Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve & Verify
                      </button>

                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition border border-rose-200"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      Decision Recorded
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Destination Management */}
      {activeTab === 'destinations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <div key={dest.id} className="bg-white rounded-2xl overflow-hidden shadow-card border border-slate-100">
                <img src={dest.heroImage} alt={dest.name} className="h-40 w-full object-cover" />
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-slate-900">{dest.name}</h3>
                    <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
                      {dest.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{dest.description}</p>
                  <div className="pt-2 flex justify-between text-xs text-slate-600 border-t border-slate-100">
                    <span>{dest.suggestedDuration}</span>
                    <span className="font-bold text-teal-700">₹{dest.indicativeBudgetMin} - ₹{dest.indicativeBudgetMax}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Reviews Queue */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Review by {rev.touristName} for Guide ID {rev.guideId}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Booking #{rev.bookingId} • {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <StarRating rating={rev.rating} size="sm" />
              </div>
              <p className="text-xs text-slate-600 italic">"{rev.writtenFeedback}"</p>
              <div className="flex gap-4 text-[10px] text-slate-400 pt-1">
                <span>Behavior: {rev.guideBehaviorRating}/5</span>
                <span>Pricing: {rev.pricingSatisfactionRating}/5</span>
                <span>Experience: {rev.tripExperienceRating}/5</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Bookings Monitor */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white p-4 rounded-xl shadow-xs border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-slate-400 block">#{b.id}</span>
                <span className="font-bold text-slate-900">{b.destinationName} ({b.totalDays} Days)</span>
                <p className="text-slate-500">Tourist: {b.touristName} • Guide: {b.guideName}</p>
              </div>
              <div className="text-right space-y-1">
                <span className="font-bold text-teal-700 block">₹{b.estimatedTotal}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Destination Modal */}
      {showAddDestModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Destination to Catalog</h3>
            
            <form onSubmit={handleAddDestSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Varanasi or Hampi"
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Uttar Pradesh"
                    value={destState}
                    onChange={(e) => setDestState(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={destCategory}
                    onChange={(e) => setDestCategory(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Spiritual & Heritage">Spiritual & Heritage</option>
                    <option value="Heritage & Food">Heritage & Food</option>
                    <option value="Beach & Leisure">Beach & Leisure</option>
                    <option value="Royal & Culture">Royal & Culture</option>
                    <option value="Nature & Backwaters">Nature & Backwaters</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hero Image URL</label>
                <input
                  type="text"
                  value={destHeroImage}
                  onChange={(e) => setDestHeroImage(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={destDescription}
                  onChange={(e) => setDestDescription(e.target.value)}
                  placeholder="Historic significance, landmarks, and highlights..."
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Popular Attractions (comma separated)</label>
                <input
                  type="text"
                  value={destAttractions}
                  onChange={(e) => setDestAttractions(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Suggested Duration</label>
                  <input
                    type="text"
                    value={destDuration}
                    onChange={(e) => setDestDuration(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Best Time to Visit</label>
                  <input
                    type="text"
                    value={destBestTime}
                    onChange={(e) => setDestBestTime(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddDestModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
