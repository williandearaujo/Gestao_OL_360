import React, { useState } from 'react';
import { Users2, BarChart3, List, AlertTriangle, RefreshCw } from 'lucide-react';

const TabButton = ({ active, onClick, icon: Icon, children, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors relative ${
      active 
        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{children}</span>
    {badge && (
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

const TeamsTab = ({
  teams = [],
  areas = [],
  users = [],
  employees = [],
  managers = [],
  onTeamsUpdate,
  onLogsUpdate
}) => {
  const [activeSection, setActiveSection] = useState('list');
  const [refreshing, setRefreshing] = useState(false);

  // Calcular alertas
  const teamsWithoutManager = teams.filter(team => !team.gerente_padrao_id).length;
  const teamsWithoutArea = teams.filter(team => !team.area_id).length;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Buscar teams atualizadas
      const response = await fetch('http://localhost:8000/teams');
      const updatedTeams = await response.json();

      if (Array.isArray(updatedTeams) && onTeamsUpdate) {
        onTeamsUpdate(updatedTeams);
      }
    } catch (error) {
      console.error('Erro ao recarregar equipes:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Equipes</h2>
          <p className="text-gray-600 mt-1">
            Organize equipes, defina gerentes e estruture a hierarquia organizacional
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
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {/* Alertas */}
      {teamsWithoutManager > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <div>
              <p className="font-medium text-orange-800">Atenção: Equipes sem Gerente</p>
              <p className="text-sm text-orange-700">
                {teamsWithoutManager} equipe{teamsWithoutManager > 1 ? 's' : ''} não possui{teamsWithoutManager > 1 ? 'em' : ''} gerente definido.
                Recomendamos atribuir gerentes para melhor organização.
              </p>
            </div>
          </div>
        </div>
      )}

      {teamsWithoutArea > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Equipes sem Área Definida</p>
              <p className="text-sm text-blue-700">
                {teamsWithoutArea} equipe{teamsWithoutArea > 1 ? 's' : ''} não está{teamsWithoutArea > 1 ? 'ão' : ''} vinculada{teamsWithoutArea > 1 ? 's' : ''} a nenhuma área.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex space-x-1">
        <TabButton
          active={activeSection === 'list'}
          onClick={() => setActiveSection('list')}
          icon={List}
        >
          Lista de Equipes
        </TabButton>
        <TabButton
          active={activeSection === 'stats'}
          onClick={() => setActiveSection('stats')}
          icon={BarChart3}
          badge={teamsWithoutManager > 0 ? teamsWithoutManager : null}
        >
          Estatísticas
        </TabButton>
      </div>

      {/* Content */}
      <div>
        {activeSection === 'list' && (
          <div className="space-y-6">

            {/* Teams List */}
            {teams.length === 0 ? (
              <div className="text-center py-16">
                <Users2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma equipe encontrada
                </h3>
                <p className="text-gray-500 mb-4">
                  As equipes serão carregadas do backend automaticamente
                </p>
                <button
                  onClick={handleRefresh}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Recarregar Equipes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {teams.map(team => {
                  const area = areas.find(a => a.id === team.area_id);
                  const manager = managers.find(m => m.id === team.gerente_padrao_id) ||
                                 users.find(u => u.id === team.gerente_padrao_id);

                  return (
                    <div key={team.id} className="bg-white rounded-lg border hover:shadow-md transition-all">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold"
                              style={{ backgroundColor: team.cor || area?.cor || '#3B82F6' }}
                            >
                              {team.nome.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{team.nome}</h3>
                              <p className="text-sm text-gray-500">{area?.nome || 'Sem área'}</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">
                          {team.descricao || 'Nenhuma descrição fornecida.'}
                        </p>

                        {/* Gerente */}
                        {manager ? (
                          <div className="flex items-center space-x-2 mb-3 p-2 bg-blue-50 rounded-lg">
                            <Users2 className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">
                              Gerente: {manager.nome}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 mb-3 p-2 bg-orange-50 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-900">
                              Sem gerente definido
                            </span>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>ID: {team.id}</span>
                          </div>

                          <span className={`px-2 py-1 text-xs rounded-full ${
                            team.ativo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {team.ativo ? 'Ativa' : 'Inativa'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeSection === 'stats' && (
          <div className="space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <Users2 className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Total de Equipes</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{teams.length}</p>
                <p className="text-sm text-gray-500">{teams.filter(t => t.ativo).length} ativas</p>
              </div>

              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Com Gerentes</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{teams.filter(t => t.gerente_padrao_id).length}</p>
                <p className="text-sm text-gray-500">{Math.round((teams.filter(t => t.gerente_padrao_id).length / teams.length) * 100) || 0}% cobertura</p>
              </div>

              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Com Áreas</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{teams.filter(t => t.area_id).length}</p>
                <p className="text-sm text-gray-500">{Math.round((teams.filter(t => t.area_id).length / teams.length) * 100) || 0}% vinculadas</p>
              </div>

              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Necessitam Atenção</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{teamsWithoutManager + teamsWithoutArea}</p>
                <p className="text-sm text-gray-500">Sem gerente ou área</p>
              </div>
            </div>

            {/* Distribution Chart Placeholder */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Distribuição por Área</h3>

              <div className="space-y-4">
                {areas.map(area => {
                  const teamsInArea = teams.filter(team => team.area_id === area.id).length;
                  const percentage = teams.length > 0 ? (teamsInArea / teams.length) * 100 : 0;

                  return (
                    <div key={area.id} className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3 flex-1">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: area.cor || '#3B82F6' }}
                        ></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-900">{area.nome}</span>
                            <span className="text-sm text-gray-600">{teamsInArea} equipes</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: area.cor || '#3B82F6'
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% do total</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center space-x-4">
          <Users2 className="w-12 h-12 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Sistema de Gestão de Equipes</h3>
            <p className="text-gray-600 text-sm mb-3">
              Estrutura hierárquica completa conectada com backend em tempo real
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>• {teams.length} equipes organizadas</span>
              <span>• {teams.filter(t => t.gerente_padrao_id).length} com gerentes</span>
              <span>• {areas.length} áreas estruturadas</span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Sistema conectado
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsTab;
