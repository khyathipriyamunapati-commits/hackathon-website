import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BookingStatusBadge } from '../../components/common/Badge';
import { StarRating } from '../../components/common/StarRating';
import { EmptyState } from '../../components/common/EmptyState';
import { ItineraryModal } from '../../components/modals/ItineraryModal';
import { ReviewModal } from '../../components/modals/ReviewModal';
import { Booking } from '../../types';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  IndianRupee, 
  MessageSquare, 
  Star, 
  XCircle, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  User 
} from 'lucide-react';

export const TouristDashboard: React.FC = () => {
  const { currentUser, bookings, updateBookingStatus, reviews } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'cancelled'>('all');
  const [selectedItineraryBooking, setSelectedItineraryBooking] = useState<Booking | null>(null);
  const [selectedReviewBooking, setSelectedReviewBooking] = useState<Booking | null>(null);

  // Filter bookings for current tourist
  const touristBookings = bookings.filter(
    (b) => b.touristId === currentUser.id || currentUser.role === 'admin'
  );

  const filteredBookings = touristBookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return b.status === 'pending';
    if (activeTab === 'accepted') return b.status === 'accepted' || b.status === 'in_progress';
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled' || b.status === 'rejected';
    return true;
  });

  const handleCancel = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking request?')) {
      updateBookingStatus(bookingId, 'cancelled');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Profile Strip */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
            alt={currentUser.fullName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/30 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Tourist Portal
              </span>
              <span className="text-xs text-slate-400">ID: {currentUser.id}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              Welcome back, {currentUser.fullName}!
            </h1>
            <p className="text-xs text-slate-500">{currentUser.email} • {currentUser.phone || 'Phone verified'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/guides"
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            Explore More Guides
          </Link>
          <Link
            to="/messages"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-teal-600" />
            Messages
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { key: 'all', label: `All Trips (${touristBookings.length})` },
          { key: 'pending', label: `Pending Requests (${touristBookings.filter(b => b.status === 'pending').length})` },
          { key: 'accepted', label: `Upcoming & Active (${touristBookings.filter(b => b.status === 'accepted' || b.status === 'in_progress').length})` },
          { key: 'completed', label: `Completed Trips (${touristBookings.filter(b => b.status === 'completed').length})` },
          { key: 'cancelled', label: `Cancelled (${touristBookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const hasReviewed = reviews.some((r) => r.bookingId === booking.id);

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-cardHover transition border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <BookingStatusBadge status={booking.status} />
                    <span className="text-xs text-slate-400 font-mono">#{booking.id}</span>
                    <span className="text-xs text-slate-400">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {booking.totalDays}-Day Journey in {booking.destinationName}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700 flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                      Assigned Guide: <strong>{booking.guideName}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Dates</span>
                      <span className="font-semibold text-slate-800">
                        {booking.startDate} to {booking.endDate}
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
                    <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <strong>Requirements:</strong> {booking.specialRequirements}
                    </p>
                  )}
                </div>

                {/* Action Buttons Column */}
                <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                  
                  {/* View Itinerary (Available for accepted/in_progress/completed) */}
                  <button
                    onClick={() => setSelectedItineraryBooking(booking)}
                    className="w-full sm:w-44 py-2 px-3 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    Trip Itinerary
                  </button>

                  {/* Chat */}
                  <Link
                    to={`/messages?conv=conv-${booking.id.replace('book-', '')}`}
                    className="w-full sm:w-44 py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    Chat with Guide
                  </Link>

                  {/* Review Guide (Available ONLY when booking is Completed) */}
                  {booking.status === 'completed' && (
                    <button
                      onClick={() => setSelectedReviewBooking(booking)}
                      disabled={hasReviewed}
                      className={`w-full sm:w-44 py-2 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                        hasReviewed
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {hasReviewed ? 'Review Submitted' : 'Submit Review'}
                    </button>
                  )}

                  {/* Cancel button if pending */}
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="w-full sm:w-44 py-1.5 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Trips Found in this Category"
          description="You don't have any trips matching the selected status. Browse verified guides to start planning!"
          actionText="Find Guides"
          onAction={() => (window.location.href = '/guides')}
        />
      )}

      {/* Itinerary Modal */}
      {selectedItineraryBooking && (
        <ItineraryModal
          booking={selectedItineraryBooking}
          isOpen={true}
          onClose={() => setSelectedItineraryBooking(null)}
          canEdit={false} // tourists view only
        />
      )}

      {/* Review Modal */}
      {selectedReviewBooking && (
        <ReviewModal
          booking={selectedReviewBooking}
          isOpen={true}
          onClose={() => setSelectedReviewBooking(null)}
        />
      )}

    </div>
  );
};
