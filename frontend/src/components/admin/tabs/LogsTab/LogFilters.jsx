import React from 'react';
import { Search, Filter, Calendar, Download, Trash2 } from 'lucide-react';

const LogFilters = ({
  filters,
  onFiltersChange,
  logs,
  users,
  onExport,
  onClearLogs,
  filteredLogs
}) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      user: '',
      type: '',
      dateStart: '',
      dateEnd: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Obter lista única de usuários dos logs
  const logUsers = [...new Set(logs.map(log => log.user))].sort();

  return (
    <div className="bg-white rounded-lg border shadow-sm">

      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Filtros de Auditoria</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onExport}
              className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
            <button
              onClick={onClearLogs}
              className="flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">

          {/* Busca */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar ação ou detalhes..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Usuário */}
          <select
            value={filters.user}
            onChange={(e) => handleFilterChange('user', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os Usuários</option>
            {logUsers.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>

          {/* Tipo de Ação */}
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os Tipos</option>
            <option value="create">🟢 Criação</option>
            <option value="update">🔵 Atualização</option>
            <option value="delete">🔴 Exclusão</option>
            <option value="system">⚙️ Sistema</option>
          </select>

          {/* Data Início */}
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filters.dateStart}
              onChange={(e) => handleFilterChange('dateStart', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Data início"
            />
          </div>

          {/* Data Fim */}
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filters.dateEnd}
              onChange={(e) => handleFilterChange('dateEnd', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Data fim"
            />
          </div>
        </div>

        {/* Filtros Rápidos */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700">Filtros rápidos:</span>

          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              handleFilterChange('dateStart', today);
              handleFilterChange('dateEnd', today);
            }}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
          >
            Hoje
          </button>

          <button
            onClick={() => {
              const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              handleFilterChange('dateStart', yesterday);
              handleFilterChange('dateEnd', yesterday);
            }}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
          >
            Ontem
          </button>

          <button
            onClick={() => {
              const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              handleFilterChange('dateStart', weekAgo);
              handleFilterChange('dateEnd', '');
            }}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
          >
            Última semana
          </button>

          <button
            onClick={() => handleFilterChange('type', 'delete')}
            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
          >
            Só exclusões
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-3 h-3 mr-1 inline" />
              Limpar filtros
            </button>
          )}
        </div>

        {/* Resultados */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{filteredLogs.length}</span> eventos encontrados
              {logs.length !== filteredLogs.length && (
                <span className="text-gray-500"> de {logs.length} total</span>
              )}
            </p>

            {hasActiveFilters && (
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Filtros ativos
                </span>

                <div className="flex space-x-1">
                  {filters.search && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      "{filters.search}"
                    </span>
                  )}
                  {filters.user && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {filters.user}
                    </span>
                  )}
                  {filters.type && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      Tipo: {filters.type}
                    </span>
                  )}
                  {(filters.dateStart || filters.dateEnd) && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {filters.dateStart && filters.dateEnd ?
                        `${filters.dateStart} até ${filters.dateEnd}` :
                        filters.dateStart ? `A partir de ${filters.dateStart}` :
                        `Até ${filters.dateEnd}`
                      }
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogFilters;
