import React from 'react';

/**
 * Seção padronizada das páginas
 * Container branco com sombras e bordas arredondadas
 */
const PageSection = ({
  title,
  children,
  className = '',
  headerActions = null
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Header da seção */}
      {(title || headerActions) && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {title && (
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            )}
            {headerActions && (
              <div className="flex items-center space-x-2">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  );
};

export default PageSection;
