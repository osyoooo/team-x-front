import React from 'react';

const StarRating = ({ rating = 0, maxRating = 5, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3', // 11px に相当 (Figmaスペック)
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const starSize = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className="flex gap-0.5">
      {[...Array(maxRating)].map((_, index) => (
        <svg
          key={index}
          className={`${starSize} ${
            index < rating ? 'text-gray-600' : 'text-gray-300'
          } fill-current`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;