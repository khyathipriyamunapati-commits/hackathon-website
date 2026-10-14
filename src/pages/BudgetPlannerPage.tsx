import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Calculator, 
  IndianRupee, 
  PiggyBank, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  RotateCcw, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';

export const BudgetPlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { destinations } = useApp();

  const destQuery = searchParams.get('destination') || 'Tirupati';
  const guideRateParam = Number(searchParams.get('guideRate')) || 1800;

  // State
  const [destination, setDestination] = useState<string>(destQuery);
  const [tripDays, setTripDays] = useState<number>(2);
  const [travelers, setTravelers] = useState<number>(2);
  const [targetBudget, setTargetBudget] = useState<number>(12000);

  // Category Cost Estimates
  const [guideCostPerDay, setGuideCostPerDay] = useState<number>(guideRateParam);
  const [accommodationPerNight, setAccommodationPerNight] = useState<number>(2500);
  const [foodPerPersonPerDay, setFoodPerPersonPerDay] = useState<number>(600);
  const [transportPerDay, setTransportPerDay] = useState<number>(1200);
  const [entryFeesPerPerson, setEntryFeesPerPerson] = useState<number>(500);
  const [otherExpenses, setOtherExpenses] = useState<number>(1000);

  // Auto preset presets when destination changes
  const handleDestinationPreset = (destName: string) => {
    setDestination(destName);
    if (destName === 'Tirupati') {
      setGuideCostPerDay(1800);
      setAccommodationPerNight(2500);
      setFoodPerPersonPerDay(500);
      setTransportPerDay(1200);
      setEntryFeesPerPerson(400);
      setTargetBudget(12000);
    } else if (destName === 'Hyderabad') {
      setGuideCostPerDay(2200);
      setAccommodationPerNight(3200);
      setFoodPerPersonPerDay(800);
      setTransportPerDay(1500);
      setEntryFeesPerPerson(600);
      setTargetBudget(18000);
    } else if (destName === 'Goa') {
      setGuideCostPerDay(2500);
      setAccommodationPerNight(4000);
      setFoodPerPersonPerDay(1000);
      setTransportPerDay(1800);
      setEntryFeesPerPerson(300);
      setTargetBudget(24000);
    } else {
      setGuideCostPerDay(2000);
      setAccommodationPerNight(3000);
      setFoodPerPersonPerDay(700);
      setTransportPerDay(1400);
      setEntryFeesPerPerson(500);
      setTargetBudget(16000);
    }
  };

  // Calculations
  const totalGuideCost = guideCostPerDay * tripDays;
  const nights = Math.max(1, tripDays - 1);
  const totalAccommodation = accommodationPerNight * nights;
  const totalFood = foodPerPersonPerDay * travelers * tripDays;
  const totalTransport = transportPerDay * tripDays;
  const totalEntryFees = entryFeesPerPerson * travelers;
  const totalOther = otherExpenses;

  const calculatedTotal =
    totalGuideCost +
    totalAccommodation +
    totalFood +
    totalTransport +
    totalEntryFees +
    totalOther;

  const budgetDifference = targetBudget - calculatedTotal;
  const isUnderBudget = budgetDifference >= 0;
  const perPersonCost = Math.round(calculatedTotal / travelers);

  const categories = [
    {
      name: 'Verified Guide Charges',
      amount: totalGuideCost,
      color: 'bg-teal-500',
      textColor: 'text-teal-700',
      note: 'Snapshot fee calculated per booked day',
      includedInGuide: true,
    },
    {
      name: 'Accommodation / Stays',
      amount: totalAccommodation,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      note: `${nights} night(s) in clean city hotel`,
      includedInGuide: false,
    },
    {
      name: 'Food & Regional Delicacies',
      amount: totalFood,
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      note: `All meals for ${travelers} traveler(s)`,
      includedInGuide: false,
    },
    {
      name: 'Local Transport & Cabs',
      amount: totalTransport,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-700',
      note: 'Local AC sedan / autorickshaw fares',
      includedInGuide: false,
    },
    {
      name: 'Attraction Entry & Darshan',
      amount: totalEntryFees,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      note: 'Monument tickets & special access passes',
      includedInGuide: false,
    },
    {
      name: 'Shopping & Miscellaneous',
      amount: totalOther,
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      note: 'Souvenirs, prasad, and emergencies',
      includedInGuide: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
          Smart Travel Cost Estimator
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Interactive Trip Budget Planner
        </h1>
        <p className="text-sm text-slate-500">
          Plan transparent travel expenses in INR (₹). Compare your spending against your target budget and avoid unexpected surprises.
        </p>
      </div>

      {/* Destination presets strip */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
          Destination Preset:
        </span>
        {['Tirupati', 'Hyderabad', 'Goa', 'Jaipur', 'Kerala', 'Bengaluru'].map((d) => (
          <button
            key={d}
            onClick={() => handleDestinationPreset(d)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              destination === d
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Input Sliders & Controls (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Trip Parameters */}
          <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-5">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-600" />
              1. Trip Baseline Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trip Duration (Days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={tripDays}
                  onChange={(e) => setTripDays(Math.max(1, Number(e.target.value)))}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Number of Travelers
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={travelers}
                  onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Target Total Budget (₹)
                </label>
                <input
                  type="number"
                  step={500}
                  min={1000}
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(Number(e.target.value))}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Category-wise Breakdown Customizer */}
          <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-5">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-600" />
              2. Category Cost Estimates (Adjust as needed)
            </h2>

            <div className="space-y-4">
              {/* Guide Daily Fee */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Verified Guide Daily Fee</span>
                    <span className="text-[11px] text-teal-600 block">
                      Snapshot rate for {tripDays} day(s) = ₹{totalGuideCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">₹{guideCostPerDay}/day</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={4000}
                  step={100}
                  value={guideCostPerDay}
                  onChange={(e) => setGuideCostPerDay(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              {/* Accommodation */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Hotel / Stay Per Night</span>
                    <span className="text-[11px] text-blue-600 block">
                      Total for {nights} night(s) = ₹{totalAccommodation.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">₹{accommodationPerNight}/night</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={8000}
                  step={200}
                  value={accommodationPerNight}
                  onChange={(e) => setAccommodationPerNight(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Food */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Food & Dining Per Person / Day</span>
                    <span className="text-[11px] text-amber-600 block">
                      Total for {travelers} person(s) = ₹{totalFood.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">₹{foodPerPersonPerDay}/day/person</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={2500}
                  step={50}
                  value={foodPerPersonPerDay}
                  onChange={(e) => setFoodPerPersonPerDay(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              {/* Transport */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Local Cab / Transport Per Day</span>
                    <span className="text-[11px] text-indigo-600 block">
                      Total for {tripDays} day(s) = ₹{totalTransport.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">₹{transportPerDay}/day</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={3500}
                  step={100}
                  value={transportPerDay}
                  onChange={(e) => setTransportPerDay(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Entry Fees & Misc */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Entry & Darshan Fees (₹/Person)
                  </label>
                  <input
                    type="number"
                    step={50}
                    value={entryFeesPerPerson}
                    onChange={(e) => setEntryFeesPerPerson(Number(e.target.value))}
                    className="w-full text-xs font-semibold p-2 bg-white border border-slate-200 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Subtotal: ₹{totalEntryFees.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Shopping & Emergency Buffer (₹)
                  </label>
                  <input
                    type="number"
                    step={100}
                    value={otherExpenses}
                    onChange={(e) => setOtherExpenses(Number(e.target.value))}
                    className="w-full text-xs font-semibold p-2 bg-white border border-slate-200 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Subtotal: ₹{totalOther.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Live Summary & Gauge (1 Col) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Main Calculation Outcome Card */}
          <div className="bg-white rounded-3xl p-6 shadow-cardHover border border-slate-100 space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Budget Status
              </span>

              {isUnderBudget ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Within Budget
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Exceeds Budget
                </span>
              )}
            </div>

            {/* Big Numbers */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Calculated Trip Total
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  ₹{calculatedTotal.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-normal text-slate-400">est.</span>
              </div>
              <p className="text-xs text-slate-500">
                Approx. <strong>₹{perPersonCost.toLocaleString('en-IN')}</strong> per traveler ({travelers} travelers)
              </p>
            </div>

            {/* Target vs Actual delta */}
            <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
              isUnderBudget
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/70 border-rose-200 text-rose-900'
            }`}>
              <div className="flex justify-between font-bold">
                <span>Target Budget:</span>
                <span>₹{targetBudget.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm pt-1 border-t border-black/5">
                <span>{isUnderBudget ? 'Remaining Savings:' : 'Amount Over Budget:'}</span>
                <span>₹{Math.abs(budgetDifference).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Category Progress Bars */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Category Cost Breakdown
              </span>

              {categories.map((cat) => {
                const percent = calculatedTotal > 0 ? Math.round((cat.amount / calculatedTotal) * 100) : 0;
                return (
                  <div key={cat.name} className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-700">{cat.name}</span>
                      <span className="font-bold text-slate-900">
                        ₹{cat.amount.toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">({percent}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer & CTA */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 leading-relaxed">
                <strong>Transparent Note:</strong> All prices are realistic estimates until booked. Guide fees are fixed snapshot prices; hotels, transport, and meals require separate reservations.
              </div>

              <Link
                to={`/guides?destination=${encodeURIComponent(destination)}`}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                Find {destination} Guide
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
