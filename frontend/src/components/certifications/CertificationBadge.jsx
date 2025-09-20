import React from 'react';
import Badge from '../common/Badge';

const CertificationBadge = ({ status, expirationDate, priority, count }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'OBTIDO':
        const isExpiringSoon = expirationDate && new Date(expirationDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        return (
          <Badge variant={isExpiringSoon ? "warning" : "success"} size="sm">
            {isExpiringSoon ? "Expira em 30d" : "Obtido"}
            {count && ` (${count})`}
          </Badge>
        );
      case 'OBRIGATORIO':
        return (
          <Badge variant="danger" size="sm">
            Obrigatório{count && ` (${count})`}
          </Badge>
        );
      case 'DESEJADO':
        return (
          <Badge variant="info" size="sm">
            Desejado{count && ` (${count})`}
          </Badge>
        );
      default:
        return (
          <Badge variant="default" size="sm">
            N/A
          </Badge>
        );
    }
  };

  const getPriorityBadge = () => {
    if (!priority || priority === 'BAIXA') return null;
    
    return (
      <Badge 
        variant={priority === 'ALTA' ? 'danger' : priority === 'MEDIA' ? 'warning' : 'info'} 
        size="xs"
        className="ml-1"
      >
        {priority}
      </Badge>
    );
  };

  return (
    <div className="flex items-center space-x-1">
      {getStatusBadge()}
      {getPriorityBadge()}
    </div>
  );
};

export default CertificationBadge;
