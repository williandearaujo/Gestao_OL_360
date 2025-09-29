import React from 'react';

/**
 * Container principal das páginas
 * Aplica fundo cinza, espaçamentos e altura mínima
 */
const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`flex-1 space-y-6 p-6 bg-gray-50 min-h-screen ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
