import React from 'react';

const TabButton = ({ id, label, activeTab, setActiveTab, count, alert }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors relative ${
      activeTab === id
        ? 'bg-ol-brand-500 text-white'
        : 'text-ol-brand-600 hover:bg-ol-brand-100'
    }`}
  >
    {label} {count !== undefined && `(${count})`}
    {alert && (
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
    )}
  </button>
);

export default TabButton;
