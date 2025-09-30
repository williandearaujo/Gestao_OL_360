import React, { useState } from 'react';
import { UserCheck, Search, Plus } from 'lucide-react';
import { Button } from '../../ui';
import AdminCard from './AdminCard';
import ManagerCard from '../cards/ManagerCard';

const ManagersSection = ({ managers, onRefresh, onEditManager, onLinkManager, onAddManager }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredManagers = managers.filter(manager => {
    const matchesSearch = manager.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manager.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || manager.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleLinkManager = (manager) => {
    if (manager.status === 'pending_user') {
      alert('Este gerente ainda não se cadastrou na plataforma. Aguarde o cadastro.');
      return;
    }
    onLinkManager && onLinkManager(manager);
  };

  const handleEditManager = (manager) => {
    onEditManager && onEditManager(manager);
  };

  const handleViewManagerDetails = (manager) => {
    // Implementar modal de detalhes futuramente
    console.log('Ver detalhes de:', manager.nome);
  };

  return (
    <AdminCard
      title="Gestão de Gerentes"
      description="Vincule usuários a cargos de gerência e aplique permissões"
      icon={UserCheck}
      color="blue"
      stats={{
        main: `${managers.filter(m => m.status === 'active').length}/${managers.length}`,
        sub: 'Ativos'
      }}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar gerente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="linked">Vinculados</option>
            <option value="pending_user">Pendentes</option>
          </select>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-3">
          {filteredManagers.length > 0 ? (
            filteredManagers.map(manager => (
              <ManagerCard
                key={manager.id}
                manager={manager}
                onLink={handleLinkManager}
                onEdit={handleEditManager}
                onViewDetails={handleViewManagerDetails}
              />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <UserCheck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Nenhum gerente encontrado</p>
            </div>
          )}
        </div>

        <Button
          variant="primary"
          icon={Plus}
          className="w-full"
          onClick={() => onAddManager && onAddManager()}
        >
          Adicionar Gerente
        </Button>
      </div>
    </AdminCard>
  );
};

export default ManagersSection;
