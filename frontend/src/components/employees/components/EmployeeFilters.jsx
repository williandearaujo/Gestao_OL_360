import React from 'react';

const EmployeeFilters = ({ filters, setFilters, totalEmployees, filteredCount }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 mb-4 sm:mb-6 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Buscar por nome, email, cargo..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
        />
        
        <select
          value={filters.equipe}
          onChange={(e) => setFilters(prev => ({ ...prev, equipe: e.target.value }))}
          className="px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
        >
          <option value="">Todas as Equipes</option>
          <option value="Red Team">Red Team</option>
          <option value="Blue Team">Blue Team</option>
          <option value="SOC Team">SOC Team</option>
          <option value="Compliance Team">Compliance Team</option>
        </select>

        <select
          value={filters.nivel}
          onChange={(e) => setFilters(prev => ({ ...prev, nivel: e.target.value }))}
          className="px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
        >
          <option value="">Todos os Níveis</option>
          <option value="ESTAGIARIO">Estagiário</option>
          <option value="JUNIOR">Júnior</option>
          <option value="PLENO">Pleno</option>
          <option value="SENIOR">Sênior</option>
          <option value="COORDENADOR">Coordenador</option>
          <option value="GERENTE">Gerente</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
        >
          <option value="">Todos os Status</option>
          <option value="ATIVO">Ativo</option>
          <option value="FERIAS">Férias</option>
          <option value="LICENCA">Licença</option>
          <option value="INATIVO">Inativo</option>
        </select>

        <button
          onClick={() => setFilters({ search: '', equipe: '', nivel: '', status: '' })}
          className="px-3 py-2 bg-ol-gray-200 text-ol-gray-700 rounded-md hover:bg-ol-gray-300 transition-colors text-sm sm:text-base"
        >
          Limpar Filtros
        </button>
      </div>
      
      <div className="mt-3 text-xs text-ol-gray-500">
        {filteredCount === totalEmployees 
          ? `${totalEmployees} colaboradores no total`
          : `${filteredCount} de ${totalEmployees} colaboradores`
        }
      </div>
    </div>
  );
};

export default EmployeeFilters;
