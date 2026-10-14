import React from 'react';

export const DestinationCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse border border-slate-100">
      <div className="h-56 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-slate-200 rounded-md w-2/3" />
        <div className="h-4 bg-slate-200 rounded-md w-full" />
        <div className="h-4 bg-slate-200 rounded-md w-4/5" />
        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <div className="h-4 bg-slate-200 rounded-md w-1/3" />
          <div className="h-8 bg-slate-200 rounded-lg w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const GuideCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse border border-slate-100 p-6 flex flex-col sm:flex-row gap-5">
      <div className="w-24 h-24 rounded-full bg-slate-200 shrink-0 mx-auto sm:mx-0" />
      <div className="flex-1 space-y-3">
        <div className="h-6 bg-slate-200 rounded-md w-1/2" />
        <div className="h-4 bg-slate-200 rounded-md w-3/4" />
        <div className="h-4 bg-slate-200 rounded-md w-full" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-slate-200 rounded-full w-20" />
          <div className="h-6 bg-slate-200 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
};
