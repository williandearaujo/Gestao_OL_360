import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { filterUsers } from '../../services/userUtils';

const UserFilters = ({
  filters,
  onFiltersChange,
  users,
  onUserCreate
}) => {
  const filteredUsers = filterUsers(users, filters);

  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    onFiltersChange({ search: '', role: '', status: '' });
  };

  const hasActiveFilters = filters.search || filters.role || filters.status;

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

        {/* Busca */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou cargo..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filtro por Role */}
        <select
          value={filters.role}
          onChange={(e) => handleFilterChange('role', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todas as Funções</option>
          <option value="admin">🔧 Administrador</option>
          <option value="diretoria">💼 Diretoria</option>
          <option value="gerente">👔 Gerente</option>
          <option value="colaborador">👤 Colaborador</option>
        </select>

        {/* Filtro por Status */}
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os Status</option>
          <option value="online">🟢 Online</option>
          <option value="offline">⚫ Offline</option>
        </select>

        {/* Ações */}
        <div className="flex space-x-2">
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`flex-1 flex items-center justify-center px-3 py-2 border rounded-lg transition-colors ${
              hasActiveFilters 
                ? 'border-gray-300 hover:bg-gray-50 text-gray-700' 
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Limpar
          </button>

          <button
            onClick={onUserCreate}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{filteredUsers.length}</span> usuários encontrados
            {users.length !== filteredUsers.length && (
              <span className="text-gray-500"> de {users.length} total</span>
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
                    Busca: "{filters.search}"
                  </span>
                )}
                {filters.role && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    Função: {filters.role}
                  </span>
                )}
                {filters.status && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    Status: {filters.status}
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
  );
};

export default UserFilters;
