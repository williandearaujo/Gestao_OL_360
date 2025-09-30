import React from 'react';

// ✅ VERSÃO LIMPA SEM INTERFERIR COM STICKY
const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
