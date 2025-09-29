import React from 'react';
import { Eye } from 'lucide-react';

/**
 * Card para gráficos e visualizações
 * Usado principalmente no Dashboard
 */
const ChartCard = ({
  title,
  children,
  height = 300,
  onTitleClick,
  className = '',
  actions = []
}) => {
  return (
    <div className={`bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {/* Header do card */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-lg font-semibold text-gray-900 ${
            onTitleClick ? 'cursor-pointer hover:text-ol-brand-600' : ''
          }`}
          onClick={onTitleClick}
        >
          {title}
        </h3>

        <div className="flex items-center space-x-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="text-gray-400 hover:text-ol-brand-600 cursor-pointer p-1 rounded-md hover:bg-gray-100 transition-colors"
              title={action.title}
            >
              {action.icon}
            </button>
          ))}

          {onTitleClick && (
            <Eye className="w-4 h-4 text-gray-400 hover:text-ol-brand-600 cursor-pointer" />
          )}
        </div>
      </div>

      {/* Conteúdo do gráfico */}
      <div style={{ height }}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
