import React from 'react';
import OL_COLORS from '../../../config/olColors';

const EmptyState = ({
  icon: Icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  variant = 'default'
}) => {
  const variants = {
    default: {
      bg: 'bg-gray-100',
      iconColor: 'text-gray-400',
      titleColor: 'text-gray-700',
      buttonBg: 'bg-gray-600',
      buttonHover: 'hover:bg-gray-700'
    },
    success: {
      bg: 'bg-green-100',
      iconColor: 'text-green-600',
      titleColor: 'text-green-800',
      buttonBg: 'bg-green-600',
      buttonHover: 'hover:bg-green-700'
    },
    primary: {
      bg: `bg-[${OL_COLORS.bg}]`,
      iconColor: `text-[${OL_COLORS.primary}]`,
      titleColor: `text-[${OL_COLORS.primary}]`,
      buttonBg: `bg-[${OL_COLORS.primary}]`,
      buttonHover: `hover:bg-[${OL_COLORS.hover}]`
    },
    ol: {
      bg: `bg-[${OL_COLORS.bg}]`,
      iconColor: `text-[${OL_COLORS.primary}]`,
      titleColor: `text-[${OL_COLORS.primary}]`,
      buttonBg: `bg-[${OL_COLORS.primary}]`,
      buttonHover: `hover:bg-[${OL_COLORS.hover}]`
    }
  };

  const config = variants[variant];

  return (
    <div className="text-center py-12">
      <div className={`w-20 h-20 ${config.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
        <Icon className={`w-10 h-10 ${config.iconColor}`} />
      </div>
      <h4 className={`text-lg font-semibold ${config.titleColor} mb-2`}>{title}</h4>
      <p className="text-gray-600 mb-6">{subtitle}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`px-6 py-3 ${config.buttonBg} text-white rounded-lg ${config.buttonHover} transition-colors font-medium`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
