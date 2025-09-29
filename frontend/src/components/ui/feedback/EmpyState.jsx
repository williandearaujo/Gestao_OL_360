import React from 'react';
import Button from '../forms/Button';

/**
 * Estado vazio padronizado
 * Usado quando não há dados para mostrar
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  actionVariant = 'primary',
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <Icon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
      )}

      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      )}

      {description && (
        <p className="text-gray-500 mb-4 max-w-sm mx-auto">{description}</p>
      )}

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant={actionVariant}
          icon={actionIcon}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
