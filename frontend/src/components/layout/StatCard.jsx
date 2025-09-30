import React from 'react';
import { TrendingUp, ExternalLink } from 'lucide-react';
import OL_COLORS from '../../config/olColors';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'red',
  trend = null,
  onClick,
  clickable = false,
  className = ''
}) => {
  const colorClasses = {
    red: `bg-[${OL_COLORS.bg}] text-[${OL_COLORS.primary}] border-[${OL_COLORS.light}]`,
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200'
  };

  return (
    <div
      className={`
        bg-white p-8 rounded-xl border shadow-lg transition-all duration-200
        ${clickable 
          ? `hover:shadow-xl hover:scale-[1.02] cursor-pointer hover:border-[${OL_COLORS.primary}] hover:bg-[${OL_COLORS.bg}]` 
          : 'hover:shadow-md'
        }
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-2">{title}</p>
          <p className={`text-3xl font-bold text-[${OL_COLORS.black}] mb-1`}>{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-3 text-sm font-medium ${
              trend > 0 ? 'text-green-600' : trend < 0 ? `text-[${OL_COLORS.primary}]` : 'text-gray-500'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend > 0 ? '+' : ''}{trend}% vs período anterior
            </div>
          )}
          {clickable && (
            <div className={`flex items-center mt-3 text-xs text-[${OL_COLORS.primary}] font-medium`}>
              <ExternalLink className="w-3 h-3 mr-1" />
              Clique para ver detalhes
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorClasses[color]} border-2`}>
            <Icon className="w-7 h-7" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
