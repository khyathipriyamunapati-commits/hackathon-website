import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BookingStatusBadge, VerifiedBadge, DemoTag } from '../../components/common/Badge';
import { StarRating } from '../../components/common/StarRating';
import { EmptyState } from '../../components/common/EmptyState';
import { ItineraryModal } from '../../components/modals/ItineraryModal';
import { Booking, BookingStatus } from '../../types';
import { 
  Check, 
  X, 
  Clock, 
  IndianRupee, 
  Calendar, 
  FileEdit, 
  MessageSquare, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  AlertCircle, 
  Play, 
  CheckCircle2, 
  Upload 
} from 'lucide-react';

export const GuideDashboard: React.FC = () => {
  const { 
    currentUser, 
    bookings, 
    guides, 
    updateBookingStatus, 
    reviews, 
    submitVerificationRequest,
    verificationRequests 
  } = useApp();

  // Find guide profile for currentUser (or default to Ramesh Sharma in demo mode)
  const guideProfile = guides.find((g) => g.id === currentUser.id) || guides[0];

  const [activeTab, setActiveTab] = useState<'requests' | 'active' | 'completed' | 'all'>('requests');
  const [selectedItineraryBooking, setSelectedItineraryBooking] = useState<Booking | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);

  // Verification request form state
  const [govIdType, setGovIdType] = useState('Aadhaar & Regional Tourism ID');
  const [idDocUrl, setIdDocUrl] = useState('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80');
  const [licenseNo, setLicenseNo] = useState('TOUR-AP-2024-912');
  const [verifNotes, setVerifNotes] = useState('Govt registered temple & heritage walk guide with APTDC certification.');

  // Guide's assigned bookings
  const guideBookings = bookings.filter((b) => b.guideId === guideProfile.id);

  const pendingRequests = guideBookings.filter((b) => b.status === 'pending');
  const activeBookings = guideBookings.filter((b) => b.status === 'accepted' || b.status === 'in_progress');
  const completedBookings = guideBookings.filter((b) => b.status === 'completed');

  // Estimated earnings calculation (estimates based on confirmed & completed bookings)
  const estimatedConfirmedEarnings = guideBookings
    .filter((b) => b.status === 'accepted' || b.status === 'in_progress' || b.status === 'completed')
    .reduce((sum, b) => sum + b.estimatedTotal, 0);

  const handleStatusUpdate = (bookingId: string, status: BookingStatus) => {
    const res = updateBookingStatus(bookingId, status);
    if (!res.success) {
      alert(res.message);
    }
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitVerificationRequest({
      governmentIdType: govIdType,
      idDocumentUrl: idDocUrl,
      licenseNumber: licenseNo,
      notes: verifNotes,
    });
    setShowVerificationModal(false);
    alert('Verification application submitted! Platform Administrators will review your credentials.');
  };

  const myVerifRequest = verificationRequests.find((v) => v.guideId === guideProfile.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Profile Strip */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={guideProfile.avatarUrl}
            alt={guideProfile.fullName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/30 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Guide Portal
              </span>
              <VerifiedBadge isVerified={guideProfile.isVerified} />
              <DemoTag />
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              {guideProfile.fullName}
            </h1>
            <p className="text-xs text-slate-500">
              {guideProfile.supportedDestinations.join(', ')} • ₹{guideProfile.pricePerDay}/day • {guideProfile.experienceYears} Years Exp
            </p>
          </div>
        </div>

        {/* Verification Status Pill or Button */}
        <div className="flex items-center gap-3">
          {guideProfile.isVerified ? (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-teal-50 text-teal-800 rounded-xl border border-teal-200 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Admin Verified Guide
            </div>
          ) : (
            <button
              onClick={() => setShowVerificationModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              <Upload className="w-4 h-4" />
              {myVerifRequest ? 'Update Verification Details' : 'Submit Verification Docs'}
            </button>
          )}

          <Link
            to={`/guides/${guideProfile.id}`}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            Public Profile View
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Pending Requests */}
        <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-1">
          <span className="text-slate-400 uppercase text-[10px] font-bold block">New Booking Requests</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-amber-600">{pendingRequests.length}</span>
            <Clock className="w-5 h-5 text-amber-500/50" />
          </div>
          <span className="text-[11px] text-slate-400">Awaiting your acceptance</span>
        </div>

        {/* Stat 2: Active / Upcoming */}
        <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-1">
          <span className="text-slate-400 uppercase text-[10px] font-bold block">Active & Upcoming Trips</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-teal-700">{activeBookings.length}</span>
            <Calendar className="w-5 h-5 text-teal-600/50" />
          </div>
          <span className="text-[11px] text-slate-400">Accepted bookings</span>
        </div>

        {/* Stat 3: Completed Trips */}
        <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-1">
          <span className="text-slate-400 uppercase text-[10px] font-bold block">Completed Journeys</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-emerald-700">{completedBookings.length}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600/50" />
          </div>
          <span className="text-[11px] text-slate-400">Eligible for tourist reviews</span>
        </div>

        {/* Stat 4: Estimated Earnings */}
        <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-1">
          <span className="text-slate-400 uppercase text-[10px] font-bold block">Estimated Booked Volume</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              ₹{estimatedConfirmedEarnings.toLocaleString('en-IN')}
            </span>
            <IndianRupee className="w-5 h-5 text-slate-400" />
          </div>
          <span className="text-[10px] text-slate-400 italic">
            * Estimated booking values, not payouts
          </span>
        </div>
      </div>

      {/* Booking Requests & Trip Management Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Pending Requests ({pendingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'active'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Upcoming & In Progress ({activeBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'completed'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed Trips ({completedBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'all'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Bookings ({guideBookings.length})
        </button>
      </div>

      {/* Bookings Display List */}
      <div className="space-y-4">
        {activeTab === 'requests' && pendingRequests.length === 0 && (
          <EmptyState
            title="No Pending Requests"
            description="You're all caught up! When tourists book your guide services, their requests will appear here for you to accept or decline."
          />
        )}

        {(activeTab === 'requests' ? pendingRequests : activeTab === 'active' ? activeBookings : activeTab === 'completed' ? completedBookings : guideBookings).map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl p-6 shadow-card hover:shadow-cardHover transition border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <BookingStatusBadge status={booking.status} />
                <span className="text-xs text-slate-400 font-mono">#{booking.id}</span>
                <span className="text-xs text-slate-400">
                  Requested on {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {booking.totalDays}-Day Tour with {booking.touristName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tourist Email: <strong>{booking.touristEmail || 'tourist@example.com'}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Planned Dates</span>
                  <span className="font-semibold text-slate-800">
                    {booking.startDate} to {booking.endDate} ({booking.totalDays} Days)
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Travelers</span>
                  <span className="font-semibold text-slate-800">{booking.travelerCount} Persons</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Guide Fee</span>
                  <span className="font-bold text-teal-700">
                    ₹{booking.estimatedTotal.toLocaleString('en-IN')} (Snapshot)
                  </span>
                </div>
              </div>

              {booking.specialRequirements && (
                <p className="text-xs text-slate-600 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200">
                  <strong>Tourist Note:</strong> {booking.specialRequirements}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
              
              {/* If Pending: Guide Accept or Reject */}
              {booking.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'accepted')}
                    className="w-full sm:w-44 py-2 px-3 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept Request
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                    className="w-full sm:w-44 py-1.5 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Decline
                  </button>
                </>
              )}

              {/* If Accepted: Itinerary Editor, Mark In Progress or Complete */}
              {booking.status === 'accepted' && (
                <>
                  <button
                    onClick={() => setSelectedItineraryBooking(booking)}
                    className="w-full sm:w-44 py-2 px-3 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <FileEdit className="w-3.5 h-3.5 text-teal-600" />
                    Edit Itinerary
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'in_progress')}
                    className="w-full sm:w-44 py-2 px-3 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-blue-600" />
                    Start Trip (In Progress)
                  </button>
                </>
              )}

              {/* If In Progress: Mark Completed */}
              {booking.status === 'in_progress' && (
                <>
                  <button
                    onClick={() => setSelectedItineraryBooking(booking)}
                    className="w-full sm:w-44 py-2 px-3 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <FileEdit className="w-3.5 h-3.5 text-teal-600" />
                    Trip Itinerary
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'completed')}
                    className="w-full sm:w-44 py-2 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Mark Trip Completed
                  </button>
                </>
              )}

              {/* If Completed: View Itinerary */}
              {booking.status === 'completed' && (
                <button
                  onClick={() => setSelectedItineraryBooking(booking)}
                  className="w-full sm:w-44 py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <FileEdit className="w-3.5 h-3.5 text-slate-500" />
                  View Final Itinerary
                </button>
              )}

              {/* Chat with Tourist */}
              <Link
                to={`/messages?conv=conv-${booking.id.replace('book-', '')}`}
                className="w-full sm:w-44 py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                Chat with Tourist
              </Link>

            </div>
          </div>
        ))}
      </div>

      {/* Itinerary Modal for Guide (canEdit=true) */}
      {selectedItineraryBooking && (
        <ItineraryModal
          booking={selectedItineraryBooking}
          isOpen={true}
          onClose={() => setSelectedItineraryBooking(null)}
          canEdit={true}
        />
      )}

      {/* Guide Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Guide Verification Application</h3>
            <p className="text-xs text-slate-500">
              Submit your government ID and tourism certification. Once reviewed by an administrator, your profile will receive the Verified Guide badge.
            </p>

            <form onSubmit={handleVerificationSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Government ID / Credential Type</label>
                <input
                  type="text"
                  required
                  value={govIdType}
                  onChange={(e) => setGovIdType(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Government Document / Badge URL</label>
                <input
                  type="text"
                  required
                  value={idDocUrl}
                  onChange={(e) => setIdDocUrl(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">License / Registration Number</label>
                <input
                  type="text"
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Background & Training Details</label>
                <textarea
                  rows={3}
                  value={verifNotes}
                  onChange={(e) => setVerifNotes(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Submit for Admin Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
