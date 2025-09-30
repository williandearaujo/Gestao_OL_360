import React from 'react';

const ExecutiveCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'blue',
  onClick,
  status 
}) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <div 
      className={`bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
            {status && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                status === 'online' ? 'bg-green-100 text-green-800' :
                status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                status === 'error' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {status.toUpperCase()}
              </div>
            )}
          </div>
          
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              <span className="font-medium">
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              <span className="ml-1">vs mês anterior</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveCard;
