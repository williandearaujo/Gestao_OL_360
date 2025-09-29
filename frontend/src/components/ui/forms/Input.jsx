import React, { forwardRef } from 'react';

/**
 * Input padronizado do Design System
 * Suporta label, erro, ícones e diferentes estados
 */
const Input = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const hasError = !!error;

  return (
    <div className={`${containerClassName}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Ícone à esquerda */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`w-5 h-5 ${hasError ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm transition-colors
            focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${hasError 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-ol-brand-500 focus:border-ol-brand-500'
            }
            ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Ícone à direita */}
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon className={`w-5 h-5 ${hasError ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
        )}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Texto de ajuda */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
