import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Users,
  MoreVertical,
  Building,
  Eye,
  UserCheck,
  Filter
} from 'lucide-react';

const TeamCard = ({ team, area, manager, employees, onEdit, onDelete, onView }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const teamMembers = employees?.filter(emp => team.membros_ids?.includes(emp.id)) || [];
  const actualMemberCount = teamMembers.length;

  return (
    <div className="bg-white rounded-lg border hover:shadow-md transition-all">
      <div className="p-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold"
              style={{ backgroundColor: area?.cor || '#3B82F6' }}
            >
              {team.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{team.nome}</h3>
              <p className="text-sm text-gray-500">{area?.nome}</p>
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
                    onView(team);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Visualizar</span>
                </button>
                <button
                  onClick={() => {
                    onEdit(team);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(team);
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

        {/* Descrição */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {team.descricao || 'Nenhuma descrição fornecida.'}
        </p>

        {/* Gerente */}
        {manager ? (
          <div className="flex items-center space-x-2 mb-3 p-2 bg-blue-50 rounded-lg">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Gerente: {manager.nome}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 mb-3 p-2 bg-orange-50 rounded-lg">
            <UserCheck className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">
              Sem gerente definido
            </span>
          </div>
        )}

        {/* Membros Preview */}
        {actualMemberCount > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Membros ({actualMemberCount})
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {teamMembers.slice(0, 3).map(member => (
                <span
                  key={member.id}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {member.nome.split(' ')[0]}
                </span>
              ))}
              {actualMemberCount > 3 && (
                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                  +{actualMemberCount - 3} mais
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{actualMemberCount} membros</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              team.ativa 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {team.ativa ? 'Ativa' : 'Inativa'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamsList = ({
  teams,
  areas,
  users,
  employees,
  onAddTeam,
  onEditTeam,
  onDeleteTeam,
  onViewTeam
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtrar equipes
  const filteredTeams = teams?.filter(team => {
    const matchesSearch = team.nome.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea = areaFilter === 'all' || team.area_id === areaFilter;

    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && team.ativa) ||
                         (statusFilter === 'inactive' && !team.ativa) ||
                         (statusFilter === 'with_manager' && team.gerente_id) ||
                         (statusFilter === 'without_manager' && !team.gerente_id);

    return matchesSearch && matchesArea && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Equipes Cadastradas</h3>
          <p className="text-gray-600">{filteredTeams.length} de {teams?.length || 0} equipes</p>
        </div>

        <button
          onClick={onAddTeam}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Equipe
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar equipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas as áreas</option>
            {areas?.map(area => (
              <option key={area.id} value={area.id}>
                {area.nome}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os status</option>
            <option value="active">Apenas ativas</option>
            <option value="inactive">Apenas inativas</option>
            <option value="with_manager">Com gerente</option>
            <option value="without_manager">Sem gerente</option>
          </select>
        </div>
      </div>

      {/* Lista de Equipes */}
      {filteredTeams.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {teams?.length === 0 ? 'Nenhuma equipe cadastrada' : 'Nenhuma equipe encontrada'}
          </h3>
          <p className="text-gray-500 mb-4">
            {teams?.length === 0
              ? 'Comece criando a primeira equipe da organização'
              : 'Tente ajustar os filtros de busca'
            }
          </p>
          {teams?.length === 0 && (
            <button
              onClick={onAddTeam}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Criar Primeira Equipe
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTeams.map(team => {
            const area = areas?.find(a => a.id === team.area_id);
            const manager = users?.find(u => u.id === team.gerente_id);

            return (
              <TeamCard
                key={team.id}
                team={team}
                area={area}
                manager={manager}
                employees={employees}
                onEdit={onEditTeam}
                onDelete={onDeleteTeam}
                onView={onViewTeam}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamsList;
