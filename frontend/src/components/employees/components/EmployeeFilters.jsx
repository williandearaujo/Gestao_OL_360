import React from 'react';
import { Search, Filter, RotateCcw, Users } from 'lucide-react';

const EmployeeFilters = ({
  filters,
  setFilters,
  totalEmployees,
  filteredCount
}) => {
  // Opções para os filtros
  const equipesOptions = [
    'Todas as Equipes',
    'Diretoria Executiva',
    'Gerência de TI',
    'Equipe de Desenvolvimento',
    'Equipe de Segurança',
    'Equipe de QA',
    'Recursos Humanos'
  ];

  const niveisOptions = [
    { value: '', label: 'Todos os Níveis' },
    { value: 'ESTAGIARIO', label: 'Estagiário' },
    { value: 'JUNIOR', label: 'Júnior' },
    { value: 'PLENO', label: 'Pleno' },
    { value: 'SENIOR', label: 'Sênior' },
    { value: 'COORDENADOR', label: 'Coordenador' },
    { value: 'GERENTE', label: 'Gerente' },
    { value: 'DIRETOR', label: 'Diretor' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'FERIAS', label: 'Férias' },
    { value: 'LICENCA', label: 'Licença' },
    { value: 'INATIVO', label: 'Inativo' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      equipe: '',
      nivel: '',
      status: ''
    });
  };

  const hasActiveFilters = filters.search || filters.equipe || filters.nivel || filters.status;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header dos filtros */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpar</span>
          </button>
        )}
      </div>

      {/* Grid de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Busca por nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar Colaborador
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Nome, email ou CPF..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
        </div>

        {/* Filtro por Equipe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Equipe
          </label>
          <select
            value={filters.equipe}
            onChange={(e) => handleFilterChange('equipe', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
          >
            <option value="">Todas as Equipes</option>
            {equipesOptions.slice(1).map(equipe => (
              <option key={equipe} value={equipe}>
                {equipe}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Nível */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nível
          </label>
          <select
            value={filters.nivel}
            onChange={(e) => handleFilterChange('nivel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
          >
            {niveisOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>
            {filteredCount} de {totalEmployees} colaboradores
          </span>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
              Filtrado
            </span>
          )}
        </div>

        {/* Filtros ativos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1">
            {filters.search && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                Busca: "{filters.search}"
              </span>
            )}
            {filters.equipe && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                Equipe: {filters.equipe}
              </span>
            )}
            {filters.nivel && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                Nível: {niveisOptions.find(n => n.value === filters.nivel)?.label}
              </span>
            )}
            {filters.status && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                Status: {statusOptions.find(s => s.value === filters.status)?.label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeFilters;
