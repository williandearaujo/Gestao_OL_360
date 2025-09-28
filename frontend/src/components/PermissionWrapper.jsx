import React from 'react';
import { AuthProvider } from './contexts/AuthContext';

const PermissionWrapper = ({ 
  children, 
  permission, 
  employee = null,
  fallback = null,
  hide = false 
}) => {
  const { permissions } = useAuth();
  
  // Verifica se tem permissão
  const hasPermission = typeof permission === 'function' 
    ? permission(employee) 
    : permissions[permission] 
      ? (employee ? permissions[permission](employee) : permissions[permission]())
      : false;

  if (!hasPermission) {
    if (hide) return null; // Esconde completamente
    return fallback || (
      <div className="text-xs text-ol-gray-400 italic">
        Sem permissão para visualizar
      </div>
    );
  }

  return children;
};

export default PermissionWrapper;

