import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Button } from '../../ui';
import AdminCard from './AdminCard';

const ReportsSection = ({ stats, onOpenReportsModal }) => {
  const reportStats = {
    activeUsers: 47,
    loginRate: 92,
    performance: 'Excelente',
    uptime: 99.9
  };

  const statCards = [
    { label: 'Usuários Ativos', value: `${reportStats.activeUsers} hoje`, color: 'blue' },
    { label: 'Login Rate', value: `${reportStats.loginRate}%`, color: 'green' },
    { label: 'Performance', value: reportStats.performance, color: 'purple' },
    { label: 'Uptime', value: `${reportStats.uptime}%`, color: 'orange' }
  ];

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-900',
      green: 'bg-green-50 text-green-900',
      purple: 'bg-purple-50 text-purple-900',
      orange: 'bg-orange-50 text-orange-900'
    };
    return colors[color] || 'bg-gray-50 text-gray-900';
  };

  return (
    <AdminCard
      title="Relatórios Administrativos"
      description="Métricas de uso, performance e atividade do sistema"
      icon={BarChart3}
      color="blue"
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {statCards.map((stat, index) => (
            <div key={index} className={`p-3 rounded-lg ${getColorClass(stat.color)}`}>
              <div className="font-medium">{stat.label}</div>
              <div className="text-sm opacity-90">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Sistema funcionando perfeitamente!</strong><br/>
            Todos os indicadores estão dentro do esperado.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={BarChart3}
          className="w-full"
          onClick={() => onOpenReportsModal && onOpenReportsModal()}
        >
          Ver Relatórios Detalhados
        </Button>
      </div>
    </AdminCard>
  );
};

export default ReportsSection;

