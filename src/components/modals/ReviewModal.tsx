import React, { useState } from 'react';
import { Booking } from '../../types';
import { useApp } from '../../context/AppContext';
import { StarRating } from '../common/StarRating';
import { X, Sparkles, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { submitReview, canUserReviewBooking } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [guideBehavior, setGuideBehavior] = useState<number>(5);
  const [pricingSatisfaction, setPricingSatisfaction] = useState<number>(5);
  const [tripExperience, setTripExperience] = useState<number>(5);
  const [writtenFeedback, setWrittenFeedback] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const eligibility = canUserReviewBooking(booking.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (writtenFeedback.trim().length < 5) {
      setErrorMessage('Please provide written feedback of at least 5 characters.');
      return;
    }

    setIsSubmitting(true);

    const result = submitReview({
      bookingId: booking.id,
      guideId: booking.guideId,
      rating,
      writtenFeedback: writtenFeedback.trim(),
      guideBehaviorRating: guideBehavior,
      pricingSatisfactionRating: pricingSatisfaction,
      tripExperienceRating: tripExperience,
    });

    setIsSubmitting(false);

    if (result.success) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-blue-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Verified Trip Review
          </span>

          <h3 className="text-xl font-bold">Review Your Guide</h3>
          <p className="text-xs text-teal-100 mt-1">
            Trip to {booking.destinationName} with Guide <strong>{booking.guideName}</strong>
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {!eligibility.eligible ? (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3 text-amber-800 text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Cannot Submit Review</p>
                <p className="text-xs mt-1">{eligibility.reason}</p>
                <button
                  onClick={onClose}
                  className="mt-3 text-xs font-bold text-amber-900 bg-amber-200/80 px-3 py-1.5 rounded-lg hover:bg-amber-300"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium border border-rose-200">
                  {errorMessage}
                </div>
              )}

              {/* Overall Rating */}
              <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Overall Trip Rating
                </label>
                <div className="flex justify-center">
                  <StarRating
                    rating={rating}
                    size="lg"
                    showNumber={true}
                    interactive={true}
                    onChange={(val) => setRating(val)}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Click to select 1 to 5 stars</p>
              </div>

              {/* Breakdown Sub-Ratings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="block font-semibold text-slate-700 mb-1">Guide Behavior</span>
                  <StarRating
                    rating={guideBehavior}
                    size="sm"
                    showNumber={false}
                    interactive={true}
                    onChange={(val) => setGuideBehavior(val)}
                  />
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="block font-semibold text-slate-700 mb-1">Pricing Value</span>
                  <StarRating
                    rating={pricingSatisfaction}
                    size="sm"
                    showNumber={false}
                    interactive={true}
                    onChange={(val) => setPricingSatisfaction(val)}
                  />
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="block font-semibold text-slate-700 mb-1">Overall Itinerary</span>
                  <StarRating
                    rating={tripExperience}
                    size="sm"
                    showNumber={false}
                    interactive={true}
                    onChange={(val) => setTripExperience(val)}
                  />
                </div>
              </div>

              {/* Written Feedback */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Detailed Review & Experience
                </label>
                <textarea
                  required
                  rows={4}
                  value={writtenFeedback}
                  onChange={(e) => setWrittenFeedback(e.target.value)}
                  placeholder="Share details about the guide's punctuality, knowledge of historic temples/monuments, care, and memorable moments..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-teal-500 focus:ring-1 focus:ring-teal-500"
                />
                <span className="text-[10px] text-slate-400">
                  Minimum 5 characters. Authenticated as completed booking tourist.
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Submitting...' : 'Post Verified Review'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
