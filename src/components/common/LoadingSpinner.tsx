import React from 'react';
import Spinner from '../ui/Spinner';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size={48} />
    </div>
  );
};

export default LoadingSpinner;