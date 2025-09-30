import React from 'react';
import { Users, BookOpen, Clock, Edit, Settings } from 'lucide-react';
import OL_COLORS from '../../config/olColors';
import EmptyState from '../ui/EmptyState';

const Avatar = ({ name, size = 'lg' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className={`${sizes[size]} bg-[${OL_COLORS.bg}] rounded-full flex items-center justify-center border-2 border-[${OL_COLORS.light}]`}>
      <span className={`text-[${OL_COLORS.primary}] font-semibold`}>
        {getInitials(name)}
      </span>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    OBTIDO: 'bg-green-100 text-green-800 border-green-200',
    DESEJADO: `bg-[${OL_COLORS.bg}] text-[${OL_COLORS.primary}] border-[${OL_COLORS.light}]`,
    OBRIGATORIO: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
      {status}
    </span>
  );
};

export const ExpiringModal = () => (
  <EmptyState
    icon={Clock}
    title="Tudo em dia!"
    subtitle="Nenhuma certificação vencendo nos próximos 30 dias"
    variant="success"
  />
);

export const EmployeesWithoutLinksModal = ({ employees, setCurrentPage, closeModal }) => (
  <div className="space-y-6">
    {employees.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(employee => (
          <div key={employee.id} className={`bg-[${OL_COLORS.bg}] border border-[${OL_COLORS.light}] p-6 rounded-xl hover:shadow-md transition-all`}>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar name={employee.nome} />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{employee.nome}</p>
                <p className="text-sm text-gray-600">{employee.cargo}</p>
                <p className={`text-sm text-[${OL_COLORS.primary}]`}>{employee.equipe}</p>
              </div>
            </div>
            <button
              className={`
                w-full flex items-center justify-center px-4 py-2 
                bg-[${OL_COLORS.primary}] text-white rounded-lg 
                hover:bg-[${OL_COLORS.hover}] transition-colors font-medium
              `}
              onClick={() => {
                closeModal();
                setCurrentPage && setCurrentPage('employees');
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Colaborador
            </button>
          </div>
        ))}
      </div>
    ) : (
      <EmptyState
        icon={Users}
        title="Excelente!"
        subtitle="Todos colaboradores têm ao menos uma certificação"
        variant="success"
      />
    )}
  </div>
);

export const OrphanedKnowledgeModal = ({ knowledge, setCurrentPage, closeModal }) => (
  <div className="space-y-6">
    {knowledge.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {knowledge.map(item => (
          <div key={item.id} className="bg-gray-50 border border-gray-200 p-6 rounded-xl hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-2">{item.nome}</p>
                <div className="flex items-center space-x-3 mb-2">
                  <StatusBadge status={item.tipo} />
                  {item.vendor && (
                    <span className="text-sm text-gray-500">{item.vendor}</span>
                  )}
                </div>
                {item.area && (
                  <p className="text-sm text-gray-500">{item.area}</p>
                )}
              </div>
              <button
                className={`
                  flex items-center px-4 py-2 
                  bg-[${OL_COLORS.primary}] text-white rounded-lg 
                  hover:bg-[${OL_COLORS.hover}] transition-colors font-medium
                `}
                onClick={() => {
                  closeModal();
                  setCurrentPage && setCurrentPage('knowledge');
                }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Gerenciar
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <EmptyState
        icon={BookOpen}
        title="Perfeito!"
        subtitle="Todos conhecimentos têm vínculos ativos"
        variant="success"
      />
    )}
  </div>
);

export const PieDetailsModal = ({ statusData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusData.map((item, index) => (
        <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4"
            style={{ backgroundColor: item.color }}
          />
          <h4 className="text-2xl font-bold text-gray-900 mb-1">{item.value}</h4>
          <p className="text-gray-600">{item.name}</p>
        </div>
      ))}
    </div>
  </div>
);
