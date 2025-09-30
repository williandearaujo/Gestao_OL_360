import React from 'react';
import { Building, Users, TrendingUp, PieChart } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
};

const AreasStats = ({ areas, employees }) => {
  const totalAreas = areas?.length || 0;
  const activeAreas = areas?.filter(area => area.ativa).length || 0;
  const totalEmployees = employees?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Estatísticas das Áreas</h3>
        <p className="text-gray-600">Visão geral da estrutura organizacional</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Áreas"
          value={totalAreas}
          subtitle={`${activeAreas} ativas`}
          icon={Building}
          color="blue"
        />

        <StatCard
          title="Total de Colaboradores"
          value={totalEmployees}
          subtitle="Distribuídos nas áreas"
          icon={Users}
          color="green"
        />

        <StatCard
          title="Média por Área"
          value={totalAreas > 0 ? Math.round(totalEmployees / totalAreas) : 0}
          subtitle="Colaboradores por área"
          icon={PieChart}
          color="purple"
        />

        <StatCard
          title="Taxa de Atividade"
          value={totalAreas > 0 ? Math.round((activeAreas / totalAreas) * 100) : 0}
          subtitle="Percentual de áreas ativas"
          icon={TrendingUp}
          color="orange"
        />
      </div>
    </div>
  );
};

export default AreasStats;
