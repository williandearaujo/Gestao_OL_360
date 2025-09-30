import React from 'react';
import { StatusBadge, Button } from '../../ui';
import { UserPlus, Eye, Edit } from 'lucide-react';

const ManagerCard = ({ manager, onLink, onEdit, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'linked': return 'warning';  
      case 'pending_user': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Ativo';
      case 'linked': return 'Vinculado';
      case 'pending_user': return 'Pendente';
      default: return 'Indefinido';
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-ol-brand-100 rounded-full flex items-center justify-center">
            <span className="text-ol-brand-600 font-medium text-sm">
              {manager.nome.split(' ').map(n => n[0]).join('').substr(0, 2)}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{manager.nome}</h4>
            <p className="text-sm text-gray-600">{manager.email}</p>
          </div>
        </div>
        
        <StatusBadge status={getStatusText(manager.status)} variant={getStatusColor(manager.status)} />
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Equipe:</span>
          <span className="font-medium text-gray-900">{manager.team}</span>
        </div>
        <div className="flex justify-between">
          <span>Local:</span>
          <span className="font-medium text-gray-900">{manager.location}</span>
        </div>
        <div className="flex justify-between">
          <span>Permissões:</span>
          <span className="font-medium text-gray-900">{manager.permissions?.length || 0}</span>
        </div>
      </div>
      
      <div className="flex space-x-2 mt-4">
        {manager.status === 'pending_user' ? (
          <Button 
            variant="primary" 
            size="sm" 
            icon={UserPlus}
            onClick={() => onLink(manager)}
            className="flex-1"
            disabled={true}
          >
            Aguardando Cadastro
          </Button>
        ) : (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              icon={Eye}
              onClick={() => onViewDetails(manager)}
            >
              Detalhes
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              icon={Edit}
              onClick={() => onEdit(manager)}
            >
              Editar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerCard;
