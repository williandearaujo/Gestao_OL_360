import React from 'react';

const KnowledgeBadge = ({ tipo, status, size = "sm" }) => {
  const getBadgeClass = () => {
    const baseClasses = `inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
      size === 'xs' ? 'px-1.5 py-0.5 text-xs' :
      size === 'sm' ? 'px-2 py-1 text-xs' :
      'px-3 py-2 text-sm'
    }`;

    switch (tipo) {
      case 'CERTIFICACAO':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'CURSO':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'FORMACAO':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusClass = () => {
    const baseClasses = `inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
      size === 'xs' ? 'px-1.5 py-0.5 text-xs' :
      size === 'sm' ? 'px-2 py-1 text-xs' :
      'px-3 py-2 text-sm'
    }`;

    switch (status) {
      case 'OBTIDO':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'OBRIGATORIO':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'DESEJADO':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (status) {
    return <span className={getStatusClass()}>{status}</span>;
  }

  return <span className={getBadgeClass()}>{tipo}</span>;
};

export default KnowledgeBadge;
