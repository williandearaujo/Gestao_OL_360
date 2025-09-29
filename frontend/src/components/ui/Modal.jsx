import React from 'react';
import { X } from 'lucide-react';
import Button from './forms/Button.jsx';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  actions = [],
  className = ''
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
        <div className={`
          relative bg-white rounded-lg shadow-xl w-full ${sizes[size]} mx-4 
          max-h-[90vh] flex flex-col ${className}
        `}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || (action.primary ? 'primary' : 'secondary')}
                  onClick={action.onClick}
                  loading={action.loading}
                  disabled={action.disabled}
                  icon={action.icon}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
