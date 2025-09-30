import React from 'react';

/**
 * Container principal das páginas
 * Aplica fundo cinza, espaçamentos e altura mínima
 */
const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
