import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
    </div>
  );
};

export const ProductSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-text" style={{ width: '40%' }}></div>
          <div className="skeleton-text" style={{ width: '85%', height: '24px' }}></div>
          <div className="skeleton-text" style={{ width: '60%', marginTop: 'auto' }}></div>
        </div>
      ))}
    </div>
  );
};
export default LoadingSpinner;
