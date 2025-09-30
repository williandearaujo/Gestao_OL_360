import React from 'react';
import { Building } from 'lucide-react';
import { Button } from '../../ui';
import AdminCard from './AdminCard';

const TeamsSection = ({ teams, onRefresh, onOpenTeamModal }) => {
  const teamsList = teams || [
    { nome: 'Diretoria', membros: 3, status: 'active' },
    { nome: 'Infraestrutura', membros: 12, status: 'active' },
    { nome: 'Desenvolvimento', membros: 18, status: 'pending_manager' },
    { nome: 'Comercial', membros: 8, status: 'active' },
    { nome: 'Suporte', membros: 15, status: 'active' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-green-600';
      case 'pending_manager': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return '✅';
      case 'pending_manager': return '⏳';
      default: return '❓';
    }
  };

  return (
    <AdminCard
      title="Gestão de Times"
      description="Configure equipes, hierarquias e distribuição geográfica"
      icon={Building}
      color="green"
      stats={{
        main: teamsList.filter(t => t.status === 'active').length,
        sub: `de ${teamsList.length} times`
      }}
    >
      <div className="space-y-3">
        <div className="max-h-64 overflow-y-auto">
          <div className="grid grid-cols-1 gap-2 text-sm">
            {teamsList.map((team, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getStatusIcon(team.status)}</span>
                  <span className="text-gray-900 font-medium">{team.nome}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">{team.membros} membros</span>
                  <span className={`text-xs ${getStatusColor(team.status)}`}>
                    {team.status === 'active' ? 'Ativo' :
                     team.status === 'pending_manager' ? 'Sem gerente' : 'Indefinido'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="secondary"
          icon={Building}
          className="w-full"
          onClick={() => onOpenTeamModal && onOpenTeamModal()}
        >
          Gerenciar Times
        </Button>
      </div>
    </AdminCard>
  );
};

export default TeamsSection;
