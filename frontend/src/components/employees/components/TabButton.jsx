import React from 'react';

const TabButton = ({ id, label, activeTab, setActiveTab, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && setActiveTab(id)}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200 ${
        activeTab === id
          ? 'border-red-600 text-red-600 bg-red-50'
          : disabled
          ? 'border-transparent text-gray-400 cursor-not-allowed'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
      {disabled && (
        <span className="ml-1 text-xs text-gray-400">(Em breve)</span>
      )}
    </button>
  );
};

export default TabButton;
