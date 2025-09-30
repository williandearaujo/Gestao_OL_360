import React from 'react';

const AdminCard = ({
  title,
  description,
  icon: Icon,
  color = "blue",
  children,
  onClick,
  stats = null,
  className = ""
}) => {
  const colorClasses = {
    blue: "border-blue-200 hover:border-blue-300",
    green: "border-green-200 hover:border-green-300",
    purple: "border-purple-200 hover:border-purple-300",
    orange: "border-orange-200 hover:border-orange-300",
    red: "border-red-200 hover:border-red-300",
    gray: "border-gray-200 hover:border-gray-300"
  };

  const iconColorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    gray: "bg-gray-50 text-gray-600"
  };

  return (
    <div
      className={`
        bg-white p-6 rounded-lg border shadow-sm transition-all hover:shadow-md
        ${colorClasses[color]}
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>

        {stats && (
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{stats.main}</div>
            {stats.sub && (
              <div className="text-xs text-gray-500">{stats.sub}</div>
            )}
          </div>
        )}
      </div>

      {children}
    </div>
  );
};

export default AdminCard;
