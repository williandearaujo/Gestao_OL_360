import React from 'react';
import { TrendingUp, ExternalLink } from 'lucide-react';

/**
 * Card de estatísticas elegante
 * Usado nas 4 páginas para mostrar métricas importantes
 */
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend = null,
  onClick,
  clickable = false,
  className = ''
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    red: "bg-red-50 text-red-600 border-red-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200"
  };

  return (
    <div
      className={`
        bg-white p-6 rounded-lg border shadow-sm transition-all
        ${clickable 
          ? 'hover:shadow-lg hover:scale-105 cursor-pointer hover:border-ol-brand-300' 
          : 'hover:shadow-md'
        }
        ${className}
      `}
      onClick={onClick}
      role={clickable ? 'button' : 'presentation'}
      tabIndex={clickable ? 0 : -1}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>

          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}

          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend > 0 ? '+' : ''}{trend}% vs período anterior
            </div>
          )}

          {clickable && (
            <div className="flex items-center mt-2 text-xs text-ol-brand-600">
              <ExternalLink className="w-3 h-3 mr-1" />
              Clique para filtrar
            </div>
          )}
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
