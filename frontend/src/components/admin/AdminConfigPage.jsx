import React, { useState } from 'react';
import { Shield, BarChart3, Users, Settings, FileText, Building, Users2 } from 'lucide-react';

// ✅ HOOKS E SERVIÇOS
import { useAdminData } from './hooks/useAdminData';

// ✅ COMPONENTES GLOBAIS
import AdminLoading from './components/AdminLoading';
import AdminHeader from './components/AdminHeader';
import AdminTabs from './components/AdminTabs';

// ✅ TODAS AS 7 ABAS - SISTEMA COMPLETO
import DashboardTab from './tabs/DashboardTab';
import UsersTab from './tabs/UsersTab';
import AreasTab from './tabs/AreasTab';      // 🏢 NOVA - Gestão de áreas
import TeamsTab from './tabs/TeamsTab';      // 👥 NOVA - Gestão de equipes
import LogsTab from './tabs/LogsTab';
import SettingsTab from './tabs/SettingsTab';
import ReportsTab from './tabs/ReportsTab';

// ✅ SISTEMA ADMINISTRATIVO ENTERPRISE COMPLETO
const AdminConfigPage = ({ userRole, onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // ✅ DADOS REAIS DO BACKEND
  const {
    loading,
    systemHealth,
    realData,
    logs,
    analytics,
    refreshData,
    updateUsers,
    updateAreas,
    updateTeams,
    refreshLogs
  } = useAdminData();

  // ✅ CALCULAR BADGES DINÂMICOS
  const teamsWithoutManager = realData.teams?.filter(team => !team.gerente_padrao_id).length || 0;
  const areasWithoutTeams = realData.areas?.filter(area =>
    !realData.teams?.some(team => team.area_id === area.id)
  ).length || 0;

  // ✅ CONFIGURAÇÃO COMPLETA DAS 7 ABAS
  const tabs = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      badge: null,
      description: 'Visão geral do sistema'
    },
    {
      key: 'users',
      label: 'Usuários',
      icon: Users,
      badge: analytics.onlineUsers > 0 ? analytics.onlineUsers : null,
      description: 'Gestão de usuários e permissões'
    },
    {
      key: 'areas',
      label: 'Áreas',
      icon: Building,
      badge: areasWithoutTeams > 0 ? areasWithoutTeams : null,
      description: 'Departamentos organizacionais'
    },
    {
      key: 'teams',
      label: 'Equipes',
      icon: Users2,
      badge: teamsWithoutManager > 0 ? teamsWithoutManager : null,
      description: 'Times e hierarquia'
    },
    {
      key: 'logs',
      label: 'Auditoria',
      icon: Shield,
      badge: logs.length > 0 ? Math.min(logs.length, 99) : null,
      description: 'Logs e auditoria'
    },
    {
      key: 'settings',
      label: 'Configurações',
      icon: Settings,
      badge: !systemHealth?.online ? '!' : null,
      description: 'Configurações do sistema'
    },
    {
      key: 'reports',
      label: 'Relatórios',
      icon: FileText,
      badge: null,
      description: 'Relatórios e exportações'
    }
  ];

  if (loading) {
    return <AdminLoading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ✅ HEADER COM STATUS DO SISTEMA */}
      <AdminHeader
        onBackToDashboard={onBackToDashboard}
        systemHealth={systemHealth}
        analytics={analytics}
      />

      {/* ✅ TABS COM BADGES DINÂMICOS */}
      <AdminTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      {/* ✅ CONTENT - TODAS AS 7 ABAS FUNCIONAIS */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* 📊 DASHBOARD - MÉTRICAS REAIS */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            analytics={analytics}
            systemHealth={systemHealth}
            realData={realData}
            onTabChange={setActiveTab}
            onRefresh={refreshData}
          />
        )}

        {/* 👥 USUÁRIOS - GESTÃO COMPLETA */}
        {activeTab === 'users' && (
          <UsersTab
            users={realData.users}
            analytics={analytics}
            onUsersUpdate={updateUsers}
            onLogsUpdate={refreshLogs}
          />
        )}

        {/* 🏢 ÁREAS - GESTÃO DE DEPARTAMENTOS */}
        {activeTab === 'areas' && (
          <AreasTab
            areas={realData.areas}
            employees={realData.employees}
            onAreasUpdate={updateAreas}
            onLogsUpdate={refreshLogs}
          />
        )}

        {/* 👥 EQUIPES - GESTÃO DE TIMES */}
        {activeTab === 'teams' && (
          <TeamsTab
            teams={realData.teams}
            areas={realData.areas}
            users={realData.users}
            employees={realData.employees}
            managers={realData.managers}
            onTeamsUpdate={updateTeams}
            onLogsUpdate={refreshLogs}
          />
        )}

        {/* 🔐 LOGS/AUDITORIA - COMPLETO */}
        {activeTab === 'logs' && (
          <LogsTab
            logs={logs}
            onLogsUpdate={refreshLogs}
            systemHealth={systemHealth}
          />
        )}

        {/* ⚙️ CONFIGURAÇÕES - SISTEMA */}
        {activeTab === 'settings' && (
          <SettingsTab
            systemHealth={systemHealth}
            realData={realData}
            onRefreshHealth={refreshData}
            onLogsUpdate={refreshLogs}
          />
        )}

        {/* 📈 RELATÓRIOS - EXPORTAÇÕES */}
        {activeTab === 'reports' && (
          <ReportsTab
            analytics={analytics}
            realData={realData}
            logs={logs}
            systemHealth={systemHealth}
            onLogsUpdate={refreshLogs}
            onRefresh={refreshData}
          />
        )}
      </div>

      {/* ✅ STATUS BAR INFERIOR */}
      <div className="bg-white border-t border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Sistema OL 360 Admin</span>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${systemHealth?.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{systemHealth?.online ? 'Online' : 'Offline'}</span>
              </div>
              <span>v1.0.3</span>
            </div>

            <div className="flex items-center space-x-6">
              <span>{analytics.totalEmployees} colaboradores</span>
              <span>{analytics.totalAreas} áreas</span>
              <span>{analytics.totalTeams} equipes</span>
              <span className="font-medium text-blue-600">{tabs.find(t => t.key === activeTab)?.description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfigPage;
