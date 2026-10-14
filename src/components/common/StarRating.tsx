import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onChange?: (val: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalReviews,
  size = 'md',
  showNumber = true,
  interactive = false,
  onChange,
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-semibold',
  };

  const currentVal = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className={`${interactive ? 'cursor-pointer transform hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
            aria-label={`${star} Star`}
          >
            <Star
              className={`${starSizes[size]} ${
                star <= currentVal
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-200 fill-slate-100'
              } transition-colors`}
            />
          </button>
        ))}
      </div>

      {showNumber && (
        <span className={`${textSizes[size]} font-bold text-slate-800`}>
          {Number(rating).toFixed(1)}
        </span>
      )}

      {totalReviews !== undefined && (
        <span className="text-xs text-slate-500">
          ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};
