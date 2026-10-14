import React, { useState } from 'react';
import { Itinerary, ItineraryItem, Booking } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  Utensils, 
  Hotel, 
  Car, 
  IndianRupee, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Save, 
  FileEdit,
  CheckCircle2
} from 'lucide-react';

interface ItineraryModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  canEdit?: boolean;
}

export const ItineraryModal: React.FC<ItineraryModalProps> = ({
  booking,
  isOpen,
  onClose,
  canEdit = false,
}) => {
  const { getItineraryByBookingId, saveItinerary } = useApp();
  const existingItinerary = getItineraryByBookingId(booking.id);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(
    existingItinerary?.title || `${booking.totalDays}-Day Personalized Tour in ${booking.destinationName}`
  );
  const [notes, setNotes] = useState(
    existingItinerary?.notes || `Tailored for ${booking.touristName} (${booking.travelerCount} travelers)`
  );
  const [emergencyInfo, setEmergencyInfo] = useState(
    existingItinerary?.emergencyInfo || 'Police Helpline: 100 | Tourist Helpline: 1363 | Medical: 108'
  );
  const [items, setItems] = useState<ItineraryItem[]>(
    existingItinerary?.items || [
      {
        id: `item-${Date.now()}-1`,
        dayNumber: 1,
        date: booking.startDate,
        attractionName: 'Morning Heritage Walk & Welcome',
        description: 'Meet at hotel lobby, briefing of day plan, visit prime heritage landmarks and sacred sites.',
        visitingTime: '09:00 AM - 12:30 PM',
        travelTime: '20 mins',
        foodRecommendation: 'Traditional regional breakfast and filter coffee',
        accommodationSuggestion: 'Comfort city hotel',
        transportation: 'AC Sedan / Auto',
        estimatedExpense: 500,
      },
    ]
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const nextDay = items.length + 1;
    const newItem: ItineraryItem = {
      id: `item-${Date.now()}-${nextDay}`,
      dayNumber: nextDay,
      date: booking.startDate,
      attractionName: `Day ${nextDay} Sightseeing & Local Experiences`,
      description: 'Explore artisan workshops, scenic nature viewpoints, and local market walk.',
      visitingTime: '10:00 AM - 04:30 PM',
      travelTime: '30 mins',
      foodRecommendation: 'Specialty regional dining',
      accommodationSuggestion: 'Hotel / Resort',
      transportation: 'Dedicated transport',
      estimatedExpense: 800,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (index: number, field: keyof ItineraryItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSave = () => {
    saveItinerary(booking.id, {
      title,
      notes,
      emergencyInfo,
      items,
    });
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Trip Itinerary
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Booking #{booking.id.slice(-6)}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {isEditing ? 'Editing Day-wise Itinerary' : title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition"
              >
                <FileEdit className="w-3.5 h-3.5" />
                Edit Plan
              </button>
            )}

            {isEditing && (
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition"
              >
                <Save className="w-3.5 h-3.5" />
                Save Itinerary
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success toast */}
        {saveSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-emerald-800 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Itinerary successfully saved! The tourist can now view the latest version.
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Metadata bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600">
            <div>
              <span className="font-semibold text-slate-900 block">Destination & Dates:</span>
              <span>{booking.destinationName} ({booking.startDate} to {booking.endDate})</span>
            </div>
            <div>
              <span className="font-semibold text-slate-900 block">Travelers & Guide:</span>
              <span>{booking.travelerCount} Persons • Guide {booking.guideName}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-900 block">Estimated Guide Fee:</span>
              <span className="font-bold text-teal-700">₹{booking.estimatedTotal.toLocaleString('en-IN')} (Snapshot)</span>
            </div>
          </div>

          {/* Edit Fields (if editing) */}
          {isEditing && (
            <div className="space-y-4 bg-teal-50/40 p-4 rounded-xl border border-teal-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Itinerary Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Guide Notes / Pacing Advice</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Emergency & Medical Information</label>
                <input
                  type="text"
                  value={emergencyInfo}
                  onChange={(e) => setEmergencyInfo(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-teal-500"
                />
              </div>
            </div>
          )}

          {/* Notes & Emergency box in View Mode */}
          {!isEditing && (
            <div className="space-y-3">
              {notes && (
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900">
                  <span className="font-bold block mb-1">Guide’s Trip Advice & Notes:</span>
                  {notes}
                </div>
              )}

              {emergencyInfo && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-start gap-2.5 text-xs text-rose-900">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Local Emergency & Contact Info:</span>
                    <span>{emergencyInfo}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Day by Day items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Day-by-Day Schedule</h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Day
                </button>
              )}
            </div>

            {items.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs relative transition hover:border-teal-300"
              >
                {/* Day Header */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-teal-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                      D{item.dayNumber}
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.attractionName}
                        onChange={(e) => handleItemChange(index, 'attractionName', e.target.value)}
                        placeholder="Attraction / Highlight Name"
                        className="text-sm font-bold text-slate-800 px-2 py-1 border border-slate-200 rounded w-full sm:w-80"
                      />
                    ) : (
                      <h4 className="text-sm font-bold text-slate-900">{item.attractionName}</h4>
                    )}
                  </div>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove Day"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Description */}
                <div className="py-3 text-xs text-slate-600">
                  {isEditing ? (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Activities & Narrative</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded"
                      />
                    </div>
                  ) : (
                    <p className="leading-relaxed">{item.description}</p>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
                  {/* Time */}
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block text-[11px]">Visiting Time</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.visitingTime}
                          onChange={(e) => handleItemChange(index, 'visitingTime', e.target.value)}
                          className="w-full text-xs p-1 border border-slate-200 rounded mt-0.5"
                        />
                      ) : (
                        <span className="text-slate-600">{item.visitingTime}</span>
                      )}
                    </div>
                  </div>

                  {/* Food */}
                  <div className="flex items-start gap-2">
                    <Utensils className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block text-[11px]">Food Suggestion</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.foodRecommendation || ''}
                          onChange={(e) => handleItemChange(index, 'foodRecommendation', e.target.value)}
                          className="w-full text-xs p-1 border border-slate-200 rounded mt-0.5"
                        />
                      ) : (
                        <span className="text-slate-600">{item.foodRecommendation || 'Local dining'}</span>
                      )}
                    </div>
                  </div>

                  {/* Transport */}
                  <div className="flex items-start gap-2">
                    <Car className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block text-[11px]">Transportation</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.transportation || ''}
                          onChange={(e) => handleItemChange(index, 'transportation', e.target.value)}
                          className="w-full text-xs p-1 border border-slate-200 rounded mt-0.5"
                        />
                      ) : (
                        <span className="text-slate-600">{item.transportation || 'Included/Walk'}</span>
                      )}
                    </div>
                  </div>

                  {/* Expense */}
                  <div className="flex items-start gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block text-[11px]">Est. Extra Expense</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.estimatedExpense || 0}
                          onChange={(e) => handleItemChange(index, 'estimatedExpense', Number(e.target.value))}
                          className="w-full text-xs p-1 border border-slate-200 rounded mt-0.5"
                        />
                      ) : (
                        <span className="text-slate-600 font-medium">₹{item.estimatedExpense || 0}</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Total Days: <strong>{items.length}</strong>
          </span>

          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition"
              >
                Save Changes
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
