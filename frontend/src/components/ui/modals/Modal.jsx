import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../forms/Button';

/**
 * Modal padronizado do Design System
 * Suporta diferentes tamanhos e ações customizadas
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  className = ''
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-7xl'
  };

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={closeOnOverlay ? onClose : undefined}
        ></div>

        {/* Modal */}
        <div className={`
          relative bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] flex flex-col
          ${sizes[size]} ${className}
        `}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}

              <div className="flex items-center space-x-2">
                {/* Ações do header */}
                {actions.filter(action => action.position === 'header').map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'secondary'}
                    size="sm"
                    onClick={action.onClick}
                    icon={action.icon}
                    disabled={action.disabled}
                    loading={action.loading}
                  >
                    {action.label}
                  </Button>
                ))}

                {/* Botão fechar */}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>

          {/* Footer com ações */}
          {actions.filter(action => !action.position || action.position === 'footer').length > 0 && (
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 flex-shrink-0">
              {actions.filter(action => !action.position || action.position === 'footer').map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'primary'}
                  size={action.size || 'md'}
                  onClick={action.onClick}
                  icon={action.icon}
                  disabled={action.disabled}
                  loading={action.loading}
                  type={action.type}
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
