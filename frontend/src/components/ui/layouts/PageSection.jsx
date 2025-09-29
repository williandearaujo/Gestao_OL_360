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
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header da seção */}
      {title && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {headerActions && (
              <div className="flex items-center space-x-2">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo da seção */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default PageSection;
