import React from 'react';

/**
 * Componente de Loading padronizado
 * Suporta fullscreen e diferentes tamanhos
 */
const Loading = ({
  fullScreen = false,
  text = 'Carregando...',
  size = 'md',
  className = ''
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const LoadingSpinner = () => (
    <div className="text-center">
      <div className={`animate-spin rounded-full border-b-2 border-ol-brand-600 mx-auto mb-4 ${sizes[size]}`}></div>
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <LoadingSpinner />
    </div>
  );
};

export default Loading;
