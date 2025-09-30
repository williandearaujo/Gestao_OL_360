import React from 'react';
import { Settings } from 'lucide-react';
import { Button, StatusBadge } from '../../ui';
import AdminCard from './AdminCard';

const SystemSection = ({ config, onRefresh, onOpenSystemModal }) => {
  const systemConfig = config || {
    integrations: { active: 3, total: 5 },
    backup: { status: 'active' },
    audit: { enabled: true },
    notifications: { email: true }
  };

  return (
    <AdminCard
      title="Configurações Gerais"
      description="Parâmetros do sistema, integrações e logs de auditoria"
      icon={Settings}
      color="gray"
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Integrações Ativas</span>
            <StatusBadge
              status={`${systemConfig.integrations?.active || 0} de ${systemConfig.integrations?.total || 0}`}
              variant="success"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Backup Automático</span>
            <StatusBadge
              status={systemConfig.backup?.status === 'active' ? 'Ativo' : 'Inativo'}
              variant={systemConfig.backup?.status === 'active' ? 'success' : 'error'}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Logs de Auditoria</span>
            <StatusBadge
              status={systemConfig.audit?.enabled ? 'Habilitado' : 'Desabilitado'}
              variant={systemConfig.audit?.enabled ? 'success' : 'warning'}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Notificações Email</span>
            <StatusBadge
              status={systemConfig.notifications?.email ? 'Configurado' : 'Desconfigurado'}
              variant={systemConfig.notifications?.email ? 'success' : 'warning'}
            />
          </div>
        </div>

        <Button
          variant="secondary"
          icon={Settings}
          className="w-full"
          onClick={() => onOpenSystemModal && onOpenSystemModal()}
        >
          Configurar Sistema
        </Button>
      </div>
    </AdminCard>
  );
};

export default SystemSection;

