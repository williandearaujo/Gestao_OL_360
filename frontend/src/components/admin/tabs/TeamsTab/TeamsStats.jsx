import React from 'react';
import { Users, TrendingUp, Target, Award, Building, UserCheck } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
          }`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
};

const TeamsStats = ({ teams, employees, users, areas }) => {
  // Calcular estatísticas das equipes
  const totalTeams = teams?.length || 0;
  const activeTeams = teams?.filter(team => team.ativa).length || 0;
  const totalMembers = employees?.length || 0;

  // Equipes com gerentes
  const teamsWithManagers = teams?.filter(team => team.gerente_id).length || 0;
  const managersCount = new Set(teams?.map(team => team.gerente_id).filter(Boolean)).size;

  // Distribuição por área
  const teamsByArea = areas?.map(area => ({
    ...area,
    teamsCount: teams?.filter(team => team.area_id === area.id).length || 0,
    membersCount: teams?.filter(team => team.area_id === area.id)
                       .reduce((acc, team) => acc + (team.membros_count || 0), 0)
  })) || [];

  // Maior equipe
  const largestTeam = teams?.reduce((max, team) =>
    (team.membros_count || 0) > (max?.membros_count || 0) ? team : max,
    { membros_count: 0 }
  );

  // Média de membros por equipe
  const avgMembersPerTeam = totalTeams > 0 ? Math.round(totalMembers / totalTeams) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Estatísticas das Equipes</h3>
        <p className="text-gray-600">Análise da estrutura organizacional e hierarquia</p>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Equipes"
          value={totalTeams}
          subtitle={`${activeTeams} ativas`}
          icon={Users}
          color="blue"
          trend={8}
        />

        <StatCard
          title="Total de Membros"
          value={totalMembers}
          subtitle="Em todas as equipes"
          icon={UserCheck}
          color="green"
          trend={15}
        />

        <StatCard
          title="Gerentes Ativos"
          value={managersCount}
          subtitle={`${teamsWithManagers} equipes com gerente`}
          icon={Award}
          color="purple"
        />

        <StatCard
          title="Maior Equipe"
          value={largestTeam?.membros_count || 0}
          subtitle={largestTeam?.nome || 'N/A'}
          icon={Target}
          color="orange"
        />
      </div>

      {/* Estatísticas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Distribuição por Área */}
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Equipes por Área
          </h4>

          <div className="space-y-4">
            {teamsByArea.map(area => (
              <div key={area.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: area.cor || '#3B82F6' }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{area.nome}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{area.teamsCount} equipes</span>
                  <span>{area.membersCount} membros</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance das Equipes */}
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Performance das Equipes</h4>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Média de membros por equipe</span>
              <span className="font-medium text-gray-900">{avgMembersPerTeam}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taxa de cobertura de gerentes</span>
              <span className="font-medium text-gray-900">
                {totalTeams > 0 ? Math.round((teamsWithManagers / totalTeams) * 100) : 0}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Equipes ativas</span>
              <span className="font-medium text-gray-900">
                {totalTeams > 0 ? Math.round((activeTeams / totalTeams) * 100) : 0}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Áreas com equipes</span>
              <span className="font-medium text-gray-900">
                {teamsByArea.filter(area => area.teamsCount > 0).length} de {areas?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Equipes */}
      <div className="bg-white rounded-lg border p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Maiores Equipes</h4>

        <div className="space-y-3">
          {teams
            ?.sort((a, b) => (b.membros_count || 0) - (a.membros_count || 0))
            .slice(0, 5)
            .map((team, index) => {
              const area = areas?.find(a => a.id === team.area_id);
              const manager = users?.find(u => u.id === team.gerente_id);

              return (
                <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-medium">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{team.nome}</p>
                      <p className="text-sm text-gray-500">
                        {area?.nome} • Gerente: {manager?.nome || 'Não definido'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{team.membros_count || 0} membros</p>
                    <p className={`text-sm ${team.ativa ? 'text-green-600' : 'text-gray-500'}`}>
                      {team.ativa ? 'Ativa' : 'Inativa'}
                    </p>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>

      {/* Alertas */}
      {teams?.filter(team => !team.gerente_id).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ Equipes sem Gerente</h4>
          <div className="flex flex-wrap gap-2">
            {teams
              .filter(team => !team.gerente_id)
              .map(team => (
                <span key={team.id} className="px-2 py-1 bg-yellow-100 text-yellow-700 text-sm rounded">
                  {team.nome}
                </span>
              ))
            }
          </div>
          <p className="text-sm text-yellow-700 mt-2">
            Recomendamos atribuir gerentes para todas as equipes para melhor organização.
          </p>
        </div>
      )}

      {teamsByArea.filter(area => area.teamsCount === 0).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">💡 Áreas sem Equipes</h4>
          <div className="flex flex-wrap gap-2">
            {teamsByArea
              .filter(area => area.teamsCount === 0)
              .map(area => (
                <span key={area.id} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                  {area.nome}
                </span>
              ))
            }
          </div>
          <p className="text-sm text-blue-700 mt-2">
            Considere criar equipes para estas áreas para melhor estruturação organizacional.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamsStats;
