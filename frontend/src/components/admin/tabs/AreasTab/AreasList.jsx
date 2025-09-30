import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Users,
  MoreVertical,
  Building
} from 'lucide-react';

const AreaCard = ({ area, employees, onEdit, onDelete }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const employeeCount = employees?.filter(emp => emp.area_id === area.id).length || 0;

  return (
    <div className="bg-white rounded-lg border hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold"
              style={{ backgroundColor: area.cor || '#3B82F6' }}
            >
              {area.sigla}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{area.nome}</h3>
              <p className="text-sm text-gray-500">{area.sigla}</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-10">
                <button
                  onClick={() => {
                    onEdit(area);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(area);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          {area.descricao || 'Nenhuma descrição fornecida.'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">{employeeCount} colaboradores</span>
          </div>

          <span className={`px-2 py-1 text-xs rounded-full ${
            area.ativa 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {area.ativa ? 'Ativa' : 'Inativa'}
          </span>
        </div>
      </div>
    </div>
  );
};

const AreasList = ({
  areas,
  employees,
  onAddArea,
  onEditArea,
  onDeleteArea
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAreas = areas?.filter(area =>
    area.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.sigla.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Áreas Cadastradas</h3>
          <p className="text-gray-600">{filteredAreas.length} de {areas?.length || 0} áreas</p>
        </div>

        <button
          onClick={onAddArea}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Área
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar por nome ou sigla..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredAreas.length === 0 ? (
        <div className="text-center py-16">
          <Building className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {areas?.length === 0 ? 'Nenhuma área cadastrada' : 'Nenhuma área encontrada'}
          </h3>
          <p className="text-gray-500 mb-4">
            {areas?.length === 0
              ? 'Comece criando a primeira área da empresa'
              : 'Tente ajustar os filtros de busca'
            }
          </p>
          {areas?.length === 0 && (
            <button
              onClick={onAddArea}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Criar Primeira Área
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAreas.map(area => (
            <AreaCard
              key={area.id}
              area={area}
              employees={employees}
              onEdit={onEditArea}
              onDelete={onDeleteArea}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AreasList;
