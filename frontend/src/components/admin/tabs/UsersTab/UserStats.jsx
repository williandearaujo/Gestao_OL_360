import React from 'react';
import { Users, UserCheck, Shield, UserX } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    gray: 'bg-gray-100 text-gray-600'
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg border shadow-sm transition-all ${
        onClick ? 'hover:shadow-md cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

const UserStats = ({ analytics, users, onFilterChange }) => {
  const offlineUsers = users.filter(u => u.status === 'offline').length;

  const handleStatClick = (filterType, filterValue) => {
    if (onFilterChange) {
      onFilterChange(prev => ({ ...prev, [filterType]: filterValue }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Total de Usuários"
        value={analytics.totalUsers}
        subtitle="Cadastrados no sistema"
        icon={Users}
        color="blue"
        onClick={() => handleStatClick('status', '')}
      />

      <StatCard
        title="Online Agora"
        value={analytics.onlineUsers}
        subtitle="Usuários ativos"
        icon={UserCheck}
        color="green"
        onClick={() => handleStatClick('status', 'online')}
      />

      <StatCard
        title="Administradores"
        value={analytics.adminUsers}
        subtitle="Com acesso total"
        icon={Shield}
        color="purple"
        onClick={() => handleStatClick('role', 'admin')}
      />

      <StatCard
        title="Offline"
        value={offlineUsers}
        subtitle="Usuários inativos"
        icon={UserX}
        color="gray"
        onClick={() => handleStatClick('status', 'offline')}
      />
    </div>
  );
};

export default UserStats;
