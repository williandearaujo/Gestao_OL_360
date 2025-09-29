import React from 'react';

const LoadingSpinner = ({
  size = 'md',
  className = '',
  text = 'Carregando...'
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className={`
        ${sizes[size]} 
        border-4 border-gray-200 border-t-ol-brand-600 
        rounded-full animate-spin
      `}></div>
      {text && (
        <p className="mt-4 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
