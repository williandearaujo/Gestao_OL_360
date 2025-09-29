import React from 'react';

const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`flex-1 space-y-6 p-6 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
