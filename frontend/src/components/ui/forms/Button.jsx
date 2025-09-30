import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  ...props
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 shadow-sm',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 shadow-sm',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-sm',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
    link: 'text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline'
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-md transition-all
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading && <LoadingSpinner />}

      {Icon && iconPosition === 'left' && !loading && (
        <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />
      )}

      {children}

      {Icon && iconPosition === 'right' && !loading && (
        <Icon className={`w-4 h-4 ${children ? 'ml-2' : ''}`} />
      )}
    </button>
  );
};

export default Button;
