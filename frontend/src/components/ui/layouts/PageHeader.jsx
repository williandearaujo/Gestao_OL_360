import React from 'react';

/**
 * Header padronizado das páginas
 * Inclui título, subtítulo e data de atualização
 */
const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions = []
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="flex mb-2" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                    {item.href ? (
                      <a href={item.href} className="hover:text-gray-700">{item.label}</a>
                    ) : (
                      <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>{item.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

          {/* Subtítulo */}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex items-center space-x-3">
            {actions.map((action, index) => (
              <React.Fragment key={index}>
                {action}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
