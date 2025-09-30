import React from 'react';
import {
  PieChart as RechartsPie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChartCard } from '../../ui';

const ChartsSection = ({ analytics, onPieClick, data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <ChartCard title="Distribuição por Status (clique nas fatias)">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPie
            data={analytics.statusData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            dataKey="value"
            onClick={(entry, index) => onPieClick(data, index)}
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

      <ChartCard title="Certificações por Equipe">
        <ResponsiveContainer width="100%" height="100%">
          {analytics.teamData && analytics.teamData.length > 0 ? (
            <BarChart data={analytics.teamData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="obtained" fill="#22c55e" name="Obtidas" />
              <Bar dataKey="certifications" fill="#e5e7eb" name="Total" />
            </BarChart>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Em Desenvolvimento</h4>
              <p className="text-gray-500">Dados de equipe em breve...</p>
            </div>
          )}
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default ChartsSection;
