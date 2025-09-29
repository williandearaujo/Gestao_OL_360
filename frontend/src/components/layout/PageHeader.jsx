import React from 'react';
import Button from '../ui/forms/Button.jsx';

const PageHeader = ({
  title,
  subtitle,
  actions = [],
  breadcrumb = [],
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1">
        {breadcrumb.length > 0 && (
          <nav className="mb-2">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              {breadcrumb.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  <span className={index === breadcrumb.length - 1 ? 'text-gray-900' : 'hover:text-gray-700'}>
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>

      {actions.length > 0 && (
        <div className="flex items-center space-x-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'primary'}
              size={action.size}
              onClick={action.onClick}
              icon={action.icon}
              loading={action.loading}
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
