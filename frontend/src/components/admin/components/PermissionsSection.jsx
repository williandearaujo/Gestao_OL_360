import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '../../ui';
import AdminCard from './AdminCard';

const PermissionsSection = ({ permissions, onRefresh, onOpenPermissionModal }) => {
  const roles = permissions?.roles || {
    admin: { count: 2, users: [] },
    diretoria: { count: 3, users: [] },
    gerente: { count: 8, users: [] },
    colaborador: { count: 45, users: [] }
  };

  const roleLabels = {
    admin: 'Admin',
    diretoria: 'Diretoria',
    gerente: 'Gerente',
    colaborador: 'Colaborador'
  };

  const roleColors = {
    admin: 'bg-red-50 text-red-700 border-red-200',
    diretoria: 'bg-purple-50 text-purple-700 border-purple-200',
    gerente: 'bg-blue-50 text-blue-700 border-blue-200',
    colaborador: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  return (
    <AdminCard
      title="Controle de Permissões"
      description="Gerencie roles e permissões de usuários do sistema"
      icon={Shield}
      color="purple"
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {Object.entries(roles).map(([role, data]) => (
            <div
              key={role}
              className={`p-3 rounded-lg border ${roleColors[role] || 'bg-gray-50 text-gray-700 border-gray-200'}`}
            >
              <div className="font-medium">{roleLabels[role] || role}</div>
              <div className="text-sm opacity-80">{data.count} usuários</div>
            </div>
          ))}
        </div>

        {permissions?.pendingApplications > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>{permissions.pendingApplications}</strong> permissões pendentes de aplicação
            </p>
          </div>
        )}

        <Button
          variant="secondary"
          icon={Shield}
          className="w-full"
          onClick={() => onOpenPermissionModal && onOpenPermissionModal()}
        >
          Gerenciar Permissões
        </Button>
      </div>
    </AdminCard>
  );
};

export default PermissionsSection;
