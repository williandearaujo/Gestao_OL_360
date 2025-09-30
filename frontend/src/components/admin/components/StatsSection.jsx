import React from 'react';
import { UserCheck, Users, Building, AlertTriangle } from 'lucide-react';
import { StatCard } from '../../ui';

const StatsSection = ({ stats, onStatClick }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Gerentes Pendentes"
        value={stats.managersInDB - stats.managersWithUsers}
        subtitle="Aguardando vinculação"
        icon={UserCheck}
        color="orange"
        clickable={true}
        onClick={() => onStatClick && onStatClick('pending-managers')}
      />

      <StatCard
        title="Usuários Sem Role"
        value={stats.usersWithoutRole}
        subtitle="Precisam de permissões"
        icon={Users}
        color="blue"
        clickable={true}
        onClick={() => onStatClick && onStatClick('users-without-role')}
      />

      <StatCard
        title="Times Configurados"
        value={stats.teamsConfigured}
        subtitle="Estrutura organizacional"
        icon={Building}
        color="green"
      />

      <StatCard
        title="Pendências Totais"
        value={stats.pendingPermissions}
        subtitle="Ações administrativas"
        icon={AlertTriangle}
        color="red"
        clickable={true}
        onClick={() => onStatClick && onStatClick('all-pending')}
      />
    </div>
  );
};

export default StatsSection;
