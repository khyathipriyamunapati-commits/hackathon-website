import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { VerifiedBadge, DemoTag } from '../components/common/Badge';
import { 
  Calendar, 
  Users, 
  MapPin, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  Clock 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BookGuidePage: React.FC = () => {
  const { guideId } = useParams<{ guideId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getGuideById, destinations, createBooking, currentUser } = useApp();

  const guide = getGuideById(guideId || '');
  const destinationQuery = searchParams.get('destination') || (guide?.supportedDestinations[0] || 'Tirupati');

  // Form State
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

  const [destinationName, setDestinationName] = useState(destinationQuery);
  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(dayAfter);
  const [travelerCount, setTravelerCount] = useState<number>(2);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    guide?.servicesOffered.slice(0, 3) || ['Temple tour & history', 'Local transport coordination']
  );
  const [specialRequirements, setSpecialRequirements] = useState<string>(
    'Traveling with family. Prefer gentle pacing and assistance with temple guidelines.'
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!guide) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Guide Not Found</h2>
        <Link to="/guides" className="text-teal-600 font-bold underline mt-4 inline-block">
          Return to Guides List
        </Link>
      </div>
    );
  }

  // Calculate days & estimated price
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const totalDays = isNaN(diffTime) ? 1 : Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
  const estimatedGuideFee = totalDays * guide.pricePerDay;

  const handleServiceToggle = (svc: string) => {
    if (selectedServices.includes(svc)) {
      setSelectedServices(selectedServices.filter((s) => s !== svc));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (new Date(endDate) < new Date(startDate)) {
      setErrorMessage('End date cannot be earlier than start date.');
      return;
    }

    if (travelerCount < 1) {
      setErrorMessage('Please specify at least 1 traveler.');
      return;
    }

    setIsSubmitting(true);

    const result = createBooking({
      guideId: guide.id,
      guideName: guide.fullName,
      destinationName,
      startDate,
      endDate,
      travelerCount,
      selectedServices,
      specialRequirements,
      dailyRateSnapshot: guide.pricePerDay,
    });

    setIsSubmitting(false);

    if (result.success && result.booking) {
      setBookingSuccess(result.booking);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Guide Profile
        </button>
      </div>

      {/* Booking Success Confirmation Card */}
      {bookingSuccess ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-teal-100 text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8 text-teal-600" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Request Sent Successfully
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Trip Request Submitted to {guide.fullName}!
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Your booking request has been forwarded to <strong>{guide.fullName}</strong>. You can chat with your guide directly and review the itinerary once accepted.
            </p>
          </div>

          {/* Details summary */}
          <div className="max-w-lg mx-auto bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Booking Reference:</span>
              <span className="font-mono font-bold text-slate-900">#{bookingSuccess.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Destination:</span>
              <span className="font-bold text-slate-900">{bookingSuccess.destinationName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Dates & Duration:</span>
              <span className="font-bold text-slate-900">
                {bookingSuccess.startDate} to {bookingSuccess.endDate} ({bookingSuccess.totalDays} Days)
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Travelers:</span>
              <span className="font-bold text-slate-900">{bookingSuccess.travelerCount} Persons</span>
            </div>
            <div className="flex justify-between text-sm pt-1">
              <span className="font-bold text-slate-700">Estimated Guide Fee:</span>
              <span className="font-extrabold text-teal-700">
                ₹{bookingSuccess.estimatedTotal.toLocaleString('en-IN')} (Snapshot)
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/dashboard/tourist"
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
            >
              Go to Tourist Dashboard
            </Link>

            <Link
              to="/messages"
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-teal-600" />
              Chat with Guide
            </Link>

            <Link
              to="/budget"
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Open Budget Planner
            </Link>
          </div>
        </div>
      ) : (
        /* Booking Request Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Booking Form (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Booking Request
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Book {guide.fullName}
              </h1>
              <p className="text-xs text-slate-500">
                Fill in your trip dates and preferences. No immediate payment is charged; pricing is snapshot-calculated.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-xs font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
              
              {/* Destination selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trip Destination
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={destinationName}
                    onChange={(e) => setDestinationName(e.target.value)}
                    className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500"
                  >
                    {guide.supportedDestinations.map((d) => (
                      <option key={d} value={d}>
                        {d} (Supported by {guide.fullName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates & Travelers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Travelers
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={travelerCount}
                    onChange={(e) => setTravelerCount(Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500"
                  />
                </div>
              </div>

              {/* Services Offered Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Desired Services
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {guide.servicesOffered.map((svc) => {
                    const isChecked = selectedServices.includes(svc);
                    return (
                      <label
                        key={svc}
                        onClick={() => handleServiceToggle(svc)}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer select-none transition ${
                          isChecked
                            ? 'bg-teal-50/70 border-teal-300 text-teal-900 font-semibold'
                            : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by container
                          className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 mt-0.5"
                        />
                        <span>{svc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Requirements & Preferences
                </label>
                <textarea
                  rows={3}
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder="e.g. Traveling with elderly parents, need wheelchair routes, pure vegetarian food preferences, languages..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  {isSubmitting ? 'Submitting Request...' : `Confirm & Request ${totalDays}-Day Booking`}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  No payment charged now. Status will show as Pending until the guide accepts.
                </p>
              </div>

            </form>

          </div>

          {/* Right Column: Guide Info & Estimated Price Breakdown (1 Col) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Guide Card */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={guide.avatarUrl}
                  alt={guide.fullName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-500/20"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <VerifiedBadge isVerified={guide.isVerified} />
                    <DemoTag />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-0.5">{guide.fullName}</h3>
                  <p className="text-[11px] text-slate-500">{guide.experienceYears} Years Exp • {guide.rating} ★</p>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 block">Languages:</span>
                <span>{guide.languages.join(', ')}</span>
              </div>
            </div>

            {/* Price Breakdown Card */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Estimated Price Breakdown
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Daily Guide Rate:</span>
                  <span className="font-semibold text-slate-800">₹{guide.pricePerDay.toLocaleString('en-IN')} / day</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of Days:</span>
                  <span className="font-semibold text-slate-800">{totalDays} {totalDays === 1 ? 'Day' : 'Days'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Travelers:</span>
                  <span className="font-semibold text-slate-800">{travelerCount} Persons</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Platform Booking Fee:</span>
                  <span className="font-bold">₹0 (Free Hackathon Demo)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Estimated Guide Fee</span>
                  <span className="text-[10px] text-slate-400">Snapshot price locked upon request</span>
                </div>
                <span className="text-2xl font-black text-teal-700">
                  ₹{estimatedGuideFee.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-[11px] text-teal-900 space-y-1">
                <span className="font-bold block">Included in fee:</span>
                <p>Full daytime guided companionship, language translation, historical commentary, and itinerary planning.</p>
              </div>

              <p className="text-[10px] text-slate-400 italic">
                * Note: Monument entry tickets, cab fuel, and personal food are paid separately by the tourist.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
