import React from 'react';
import { Compass, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Compass,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 px-6 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 ${className}`}>
      <div className="w-14 h-14 mx-auto rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-4 shadow-xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
