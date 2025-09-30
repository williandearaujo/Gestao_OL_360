import React from 'react';

const TabButton = ({ active, onClick, children, icon: Icon, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
      active 
        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    {Icon && <Icon className="w-5 h-5" />}
    <span>{children}</span>
    {badge && (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

const AdminTabs = ({ activeTab, onTabChange, tabs }) => (
  <div className="bg-white border-b">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex space-x-1 overflow-x-auto">
        {tabs.map(tab => (
          <TabButton
            key={tab.key}
            active={activeTab === tab.key}
            onClick={() => onTabChange(tab.key)}
            icon={tab.icon}
            badge={tab.badge}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>
    </div>
  </div>
);

export default AdminTabs;
