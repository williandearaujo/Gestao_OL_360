import React from 'react';

const AdminModal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className={`relative bg-white rounded-lg ${sizeClasses[size]} w-full p-6 max-h-[90vh] overflow-y-auto`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl p-1 hover:bg-gray-100 rounded"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
