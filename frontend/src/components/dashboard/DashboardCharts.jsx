import React from 'react';
import { BarChart, BookOpen, PieChart } from 'lucide-react';
import {
  PieChart as RechartsPie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import EmptyState from '../ui/feedback/EmptyState';
import OL_COLORS from '../../config/olColors';

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
    <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
    <div style={{ height: '400px' }}>
      {children}
    </div>
  </div>
);

const DashboardCharts = ({ analytics, onPieClick }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Gráfico de Pizza - Status */}
      <ChartCard title="Distribuição por Status">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPie
            data={analytics.statusData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            dataKey="value"
            onClick={onPieClick}
          >
            {analytics.statusData?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </RechartsPie>
        </ResponsiveContainer>
      </ChartCard>

      {/* Gráfico de Barras - Equipes */}
      <ChartCard title="Certificações por Equipe">
        <EmptyState
          icon={BarChart}
          title="Em Desenvolvimento"
          subtitle="Dados de equipe em breve..."
          variant="default"
        />
      </ChartCard>
    </div>
  );
};

export default DashboardCharts;
