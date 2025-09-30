import React from 'react';
import { X, Plus, Edit, Trash2, Activity, AlertTriangle, User, Globe, Clock } from 'lucide-react';

const LogDetailsModal = ({ isOpen, onClose, log }) => {
  if (!isOpen || !log) return null;

  const getLogIcon = (type) => {
    switch (type) {
      case 'create':
        return <Plus className="w-8 h-8 text-green-600" />;
      case 'update':
        return <Edit className="w-8 h-8 text-blue-600" />;
      case 'delete':
        return <Trash2 className="w-8 h-8 text-red-600" />;
      case 'system':
        return <Activity className="w-8 h-8 text-gray-600" />;
      default:
        return <Activity className="w-8 h-8 text-gray-600" />;
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'system':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLogTypeLabel = (type) => {
    switch (type) {
      case 'create':
        return '🟢 Criação';
      case 'update':
        return '🔵 Atualização';
      case 'delete':
        return '🔴 Exclusão';
      case 'system':
        return '⚙️ Sistema';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getLogColor(log.type).replace('text-', 'bg-').replace('-800', '-200')}`}>
                {getLogIcon(log.type)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Detalhes do Evento</h3>
                <p className="text-sm text-gray-500">ID: #{log.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Status do evento */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLogColor(log.type)}`}>
                {getLogTypeLabel(log.type)}
              </span>

              {log.type === 'delete' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Ação Crítica
                </span>
              )}
            </div>
          </div>

          {/* Informações principais */}
          <div className="space-y-6">

            {/* Ação */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{log.action}</h4>
              <p className="text-gray-700">{log.details}</p>
            </div>

            {/* Detalhes técnicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Informações do usuário */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informações do Usuário
                </h5>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Usuário:</span>
                    <p className="font-medium text-gray-900">{log.user}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">IP de Origem:</span>
                    <p className="font-medium text-gray-900 font-mono text-sm">{log.ip}</p>
                  </div>
                </div>
              </div>

              {/* Informações temporais */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Informações Temporais
                </h5>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Data e Hora:</span>
                    <p className="font-medium text-gray-900">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Tempo decorrido:</span>
                    <p className="font-medium text-gray-900">
                      {Math.floor((new Date() - new Date(log.timestamp)) / 60000)} minutos atrás
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contexto adicional */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Contexto da Ação</h5>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tipo de Evento:</span>
                    <p className="font-medium">{getLogTypeLabel(log.type)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Criticidade:</span>
                    <p className={`font-medium ${
                      log.type === 'delete' ? 'text-red-600' :
                      log.type === 'create' ? 'text-green-600' :
                      log.type === 'update' ? 'text-blue-600' :
                      'text-gray-600'
                    }`}>
                      {log.type === 'delete' ? 'Alta' :
                       log.type === 'create' ? 'Baixa' :
                       log.type === 'update' ? 'Média' :
                       'Baixa'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações relacionadas */}
            {log.type === 'delete' && (
              <div className="border-l-4 border-red-400 bg-red-50 p-4">
                <div className="flex">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-red-800">Ação Irreversível</h5>
                    <p className="text-red-700 text-sm mt-1">
                      Esta ação resultou na exclusão permanente de dados do sistema.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-6 border-t mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogDetailsModal;
