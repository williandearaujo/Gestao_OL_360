import React, { useState } from 'react';
import {
  Users,
  Building,
  Users2,
  BookOpen,
  TrendingUp,
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  return (
    <div
      className={`bg-white rounded-lg border p-6 hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
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

const DashboardTab = ({
  analytics,
  systemHealth,
  realData,
  onTabChange,
  onRefresh
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  // Calcular métricas adicionais
  const activeEmployees = realData.employees?.filter(emp => emp.status === 'ATIVO').length || 0;
  const activeAreas = realData.areas?.filter(area => area.ativa).length || 0;
  const teamsWithoutManager = realData.teams?.filter(team => !team.gerente_padrao_id).length || 0;
  const completionRate = analytics.completionRate || 0;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Executivo</h2>
          <p className="text-gray-600 mt-1">
            Visão geral do sistema em tempo real
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
            refreshing
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Atualizando...' : 'Atualizar Dados'}
        </button>
      </div>

      {/* System Health Alert */}
      {!systemHealth?.online && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Sistema Offline</p>
              <p className="text-sm text-red-700">
                Não foi possível conectar com o backend. Verifique a conexão.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Colaboradores"
          value={analytics.totalEmployees || 0}
          subtitle={`${activeEmployees} ativos`}
          icon={Users}
          color="blue"
          trend={5}
          onClick={() => onTabChange('users')}
        />

        <MetricCard
          title="Áreas"
          value={analytics.totalAreas || 0}
          subtitle={`${activeAreas} ativas`}
          icon={Building}
          color="green"
          trend={12}
          onClick={() => onTabChange('areas')}
        />

        <MetricCard
          title="Equipes"
          value={analytics.totalTeams || 0}
          subtitle={teamsWithoutManager > 0 ? `${teamsWithoutManager} sem gerente` : 'Todas com gerente'}
          icon={Users2}
          color="purple"
          onClick={() => onTabChange('teams')}
        />

        <MetricCard
          title="Conhecimentos"
          value={analytics.totalKnowledge || 0}
          subtitle={`${completionRate}% conclusão`}
          icon={BookOpen}
          color="orange"
          trend={8}
        />
      </div>

      {/* Métricas Secundárias */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* System Status */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Status do Sistema
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Backend</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${systemHealth?.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                  {systemHealth?.online ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Banco de Dados</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${systemHealth?.database === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                  {systemHealth?.database === 'connected' ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tempo de Resposta</span>
              <span className="text-sm font-medium text-gray-900">
                {systemHealth?.responseTime || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Versão</span>
              <span className="text-sm font-medium text-gray-900">
                {systemHealth?.version || '1.0.3'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Ações Rápidas</h3>

          <div className="space-y-3">
            <button
              onClick={() => onTabChange('areas')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Gerenciar Áreas</p>
                  <p className="text-sm text-gray-500">Departamentos e estrutura</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => onTabChange('teams')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Users2 className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Gerenciar Equipes</p>
                  <p className="text-sm text-gray-500">Times e hierarquia</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => onTabChange('logs')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Ver Auditoria</p>
                  <p className="text-sm text-gray-500">Logs e atividades</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Atividade Recente</h3>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Sistema Iniciado</p>
                <p className="text-xs text-gray-500">Conexão com backend estabelecida</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Dados Carregados</p>
                <p className="text-xs text-gray-500">{analytics.totalEmployees} colaboradores encontrados</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Estrutura Organizacional</p>
                <p className="text-xs text-gray-500">{analytics.totalAreas} áreas e {analytics.totalTeams} equipes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Organizational Health */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Saúde Organizacional</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxa de Cobertura</span>
              <span className="font-bold text-2xl text-gray-900">{completionRate}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>Colaboradores ativos: {activeEmployees}</span>
              <span>Estrutura completa: {activeAreas} áreas</span>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Informações do Sistema</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total de Registros:</span>
              <span className="font-medium">{
                (analytics.totalEmployees || 0) +
                (analytics.totalAreas || 0) +
                (analytics.totalTeams || 0) +
                (analytics.totalKnowledge || 0)
              }</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Última Atualização:</span>
              <span className="font-medium">{new Date().toLocaleTimeString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${systemHealth?.online ? 'text-green-600' : 'text-red-600'}`}>
                {systemHealth?.online ? 'Sistema Operacional' : 'Sistema Offline'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Arquitetura:</span>
              <span className="font-medium">Enterprise Modular</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
