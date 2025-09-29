import React from 'react';
import { getInitials, getStatusColor, getNivelColor } from '../utils/employeeUtils';
import { calcularAlertasFerias } from '../utils/vacationCalculations';

const EmployeeCard = ({ 
  employee, 
  onViewDetails,
  onEdit,
  onDelete,
  onManageLinks  // ✅ NOVA PROP
}) => {
  const alertasFerias = calcularAlertasFerias(employee);

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
      {/* Avatar e Info Principal */}
      <div className="p-4 sm:p-6 pb-3 sm:pb-4 flex-1">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            {/* Avatar */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ol-brand-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              {employee.avatar ? (
                <img src={employee.avatar} alt={employee.nome} className="w-full h-full object-cover" />
              ) : (
                <span className="text-ol-brand-600 font-medium text-sm sm:text-base">
                  {getInitials(employee.nome)}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-ol-gray-900 mb-1 break-words leading-tight">
                {employee.nome}
              </h3>
              <p className="text-xs sm:text-sm text-ol-gray-600 mb-2 break-words">
                {employee.cargo} • {employee.equipe}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(employee.status)}`}>
                  {employee.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${getNivelColor(employee.nivel)}`}>
                  {employee.nivel}
                </span>
              </div>
            </div>
          </div>

          {/* Ações principais */}
          <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
            <button
              onClick={() => onViewDetails(employee)}
              title="Ver perfil completo"
              className="text-ol-brand-600 hover:text-ol-brand-700 hover:bg-ol-brand-100 transition-colors p-1 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={() => onEdit(employee)}
              title="Editar dados"
              className="text-ol-brand-600 hover:text-ol-brand-700 hover:bg-ol-brand-100 transition-colors p-1 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contato */}
        <div className="text-xs text-ol-gray-500 space-y-1">
          <p className="break-words">{employee.email}</p>
          <p>{employee.telefone}</p>
          <p>CPF: {employee.cpf}</p>
        </div>

        {/* Alertas de férias no card */}
        {(alertasFerias.vencimento_1?.alerta_2_meses || alertasFerias.vencimento_1?.vencido) && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
            <div className="flex items-center text-red-700">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
                {alertasFerias.vencimento_1?.vencido ? 'Férias VENCIDAS!' : 'Férias vencendo!'}
              </span>
            </div>
            {alertasFerias.vencimento_1?.alerta_2_meses && (
              <p>Vencimento: {alertasFerias.vencimento_1.dias_restantes} dias</p>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-ol-gray-100"></div>

      {/* Ações com PDI, 1x1 e Day Off */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(employee)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              employee.pdi.status === 'EM_DIA' ? 'bg-ol-brand-100 text-ol-brand-700' :
              employee.pdi.status === 'ATRASADO' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}
            title="Gestão de PDI"
          >
            PDI {employee.pdi.status === 'EM_DIA' ? '✓' :
                 employee.pdi.status === 'ATRASADO' ? '!' : '?'}
          </button>

          <button
            onClick={() => onViewDetails(employee)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              employee.reunioes_1x1.status === 'EM_DIA' ? 'bg-ol-brand-100 text-ol-brand-700' :
              employee.reunioes_1x1.status === 'ATRASADO' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}
            title="Reuniões 1x1"
          >
            1x1 {employee.reunioes_1x1.status === 'EM_DIA' ? '✓' :
                 employee.reunioes_1x1.status === 'ATRASADO' ? '!' : '?'}
          </button>

          {/* Day Off */}
          <button
            onClick={() => onViewDetails(employee)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              employee.dayoff.usado_ano_atual ? 'bg-ol-brand-100 text-ol-brand-700' :
              new Date().getMonth() + 1 === employee.dayoff.mes_aniversario ? 'bg-yellow-100 text-yellow-700' :
              'bg-ol-gray-100 text-ol-gray-700'
            }`}
            title="Day Off - Mês do Aniversário"
          >
            Day Off {employee.dayoff.usado_ano_atual ? '✓' :
                    new Date().getMonth() + 1 === employee.dayoff.mes_aniversario ? '📅' : '-'}
          </button>

          {/* ✅ NOVO BOTÃO - GERENCIAR VÍNCULOS */}
          {onManageLinks && (
            <button
              onClick={() => onManageLinks(employee)}
              title="Gerenciar vínculos de conhecimento"
              className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded transition-colors hover:bg-yellow-200"
            >
              🔗 Vínculos
            </button>
          )}

          {/* Botão excluir - só aparece se não tiver vínculos */}
          {!onManageLinks && (
            <button
              onClick={() => onDelete(employee.id)}
              title="Remover colaborador"
              className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded transition-colors hover:bg-red-200"
            >
              Excluir
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-ol-gray-100"></div>

      {/* Footer */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center text-xs text-ol-gray-500">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Desde {new Date(employee.data_admissao).toLocaleDateString('pt-BR')}</span>
        </div>

        {/* Badge de vínculos (placeholder - será implementado depois) */}
        <span className="text-xs bg-ol-brand-100 text-ol-brand-700 px-2 py-1 rounded">
          Vínculos: Em breve
        </span>
      </div>
    </div>
  );
};

export default EmployeeCard;
