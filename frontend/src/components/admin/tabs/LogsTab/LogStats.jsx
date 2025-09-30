import React from 'react';
import { Activity, Clock, Users, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color, onClick, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg border shadow-sm transition-all ${
        onClick ? 'hover:shadow-md cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
            {trend && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                trend > 0 ? 'bg-green-100 text-green-800' : 
                trend < 0 ? 'bg-red-100 text-red-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {trend > 0 ? '+' : ''}{trend}%
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

const LogStats = ({ logs, onFilterChange }) => {
  // Calcular estatísticas dos logs
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentLogs = logs.filter(log => new Date(log.timestamp) > last24h);
  const weeklyLogs = logs.filter(log => new Date(log.timestamp) > last7d);

  const uniqueUsers = [...new Set(logs.map(log => log.user))].length;

  const criticalActions = logs.filter(log =>
    log.type === 'delete' ||
    log.action.toLowerCase().includes('deletou') ||
    log.action.toLowerCase().includes('removeu')
  ).length;

  const handleStatClick = (filterType, filterValue) => {
    if (onFilterChange) {
      onFilterChange(prev => ({ ...prev, [filterType]: filterValue }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Total de Logs"
        value={logs.length}
        subtitle="Eventos registrados"
        icon={Activity}
        color="blue"
        onClick={() => handleStatClick('type', '')}
        trend={weeklyLogs.length > 0 ? Math.round(((recentLogs.length / weeklyLogs.length) * 100) - 100) : 0}
      />

      <StatCard
        title="Últimas 24h"
        value={recentLogs.length}
        subtitle="Atividades recentes"
        icon={Clock}
        color="green"
        onClick={() => {
          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          handleStatClick('dateStart', yesterday);
        }}
      />

      <StatCard
        title="Usuários Ativos"
        value={uniqueUsers}
        subtitle="Diferentes usuários"
        icon={Users}
        color="orange"
        onClick={() => handleStatClick('user', '')}
      />

      <StatCard
        title="Ações Críticas"
        value={criticalActions}
        subtitle="Exclusões e remoções"
        icon={AlertTriangle}
        color={criticalActions > 0 ? "red" : "green"}
        onClick={() => handleStatClick('type', 'delete')}
      />
    </div>
  );
};

export default LogStats;
