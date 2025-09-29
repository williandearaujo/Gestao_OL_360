import React from 'react';

/**
 * Badge de status padronizado
 * Cores automáticas baseadas no status
 */
const StatusBadge = ({
  status,
  variant = 'auto',
  size = 'md',
  className = ''
}) => {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  const getVariant = (status) => {
    if (variant !== 'auto') return variant;

    const statusLower = status?.toLowerCase();
    if (['ativo', 'obtido', 'aprovado', 'completo', 'success'].includes(statusLower)) return 'success';
    if (['pendente', 'em_andamento', 'desejado', 'warning'].includes(statusLower)) return 'warning';
    if (['inativo', 'cancelado', 'rejeitado', 'obrigatorio', 'error'].includes(statusLower)) return 'error';
    if (['info', 'informacao'].includes(statusLower)) return 'info';
    return 'default';
  };

  const variants = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const finalVariant = getVariant(status);

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${variants[finalVariant]} ${sizes[size]} ${className}
      `}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
