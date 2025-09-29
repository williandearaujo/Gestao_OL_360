import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Select padronizado do Design System
 * Suporta label, erro e diferentes estados
 */
const Select = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  options = [],
  placeholder = 'Selecione uma opção',
  className = '',
  containerClassName = '',
  children,
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

      {/* Select Container */}
      <div className="relative">
        <select
          ref={ref}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm transition-colors
            focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            pr-10 appearance-none
            ${hasError 
              ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-ol-brand-500 focus:border-ol-brand-500'
            }
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {/* Opções do array */}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}

          {/* Children (opções customizadas) */}
          {children}
        </select>

        {/* Ícone dropdown */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className={`w-5 h-5 ${hasError ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
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

Select.displayName = 'Select';

export default Select;
