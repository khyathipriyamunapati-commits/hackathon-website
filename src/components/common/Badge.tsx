import React from 'react';
import { ShieldCheck, Sparkles, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { BookingStatus } from '../../types';

interface VerifiedBadgeProps {
  isVerified?: boolean;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ isVerified = false, className = '' }) => {
  if (!isVerified) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/80 shadow-xs ${className}`}
      title="Verified by Tourist Guide Admin"
    >
      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
      Verified Guide
    </span>
  );
};

export const DemoTag: React.FC<{ label?: string; className?: string }> = ({
  label = 'Demo Profile',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 ${className}`}
    >
      <Sparkles className="w-2.5 h-2.5 text-amber-500" />
      {label}
    </span>
  );
};

export const BookingStatusBadge: React.FC<{ status: BookingStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  switch (status) {
    case 'pending':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          Pending Guide Confirmation
        </span>
      );
    case 'accepted':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          Booking Accepted
        </span>
      );
    case 'in_progress':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          Trip In Progress
        </span>
      );
    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Trip Completed
        </span>
      );
    case 'rejected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 ${className}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Request Declined
        </span>
      );
    case 'cancelled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
          Cancelled
        </span>
      );
    default:
      return null;
  }
};
