import React from 'react';

const KnowledgeFilters = ({
  filters,
  onFilterChange,
  vendors,
  areas,
  clearFilters
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-ol-brand-600 hover:text-ol-brand-700 font-medium"
        >
          Limpar Filtros
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Busca por nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar Conhecimento
          </label>
          <input
            type="text"
            placeholder="Nome ou código..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
          />
        </div>
        {/* Vendor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vendor
          </label>
          <select
            value={filters.vendor}
            onChange={(e) => onFilterChange('vendor', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
          >
            <option value="">Todos os Vendors</option>
            {vendors.map(vendor => (
              <option key={vendor} value={vendor}>{vendor}</option>
            ))}
          </select>
        </div>
        {/* Área */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Área
          </label>
          <select
            value={filters.area}
            onChange={(e) => onFilterChange('area', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
          >
            <option value="">Todas as Áreas</option>
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={filters.tipo}
            onChange={(e) => onFilterChange('tipo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
          >
            <option value="">Todos os Tipos</option>
            <option value="CERTIFICACAO">Certificação</option>
            <option value="CURSO">Curso</option>
            <option value="GRADUACAO">Graduação</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeFilters;
