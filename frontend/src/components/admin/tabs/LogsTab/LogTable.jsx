import React from 'react';
import { Plus, Edit, Trash2, Activity, AlertTriangle, Eye } from 'lucide-react';

const LogTable = ({ logs, onLogDetails }) => {
  const getLogIcon = (type) => {
    switch (type) {
      case 'create':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'update':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'system':
        return <Activity className="w-4 h-4 text-gray-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'create':
        return 'bg-green-100 border-green-200';
      case 'update':
        return 'bg-blue-100 border-blue-200';
      case 'delete':
        return 'bg-red-100 border-red-200';
      case 'system':
        return 'bg-gray-100 border-gray-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;

    return date.toLocaleString('pt-BR');
  };

  const EmptyState = () => (
    <div className="text-center py-16">
      <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum log encontrado</h3>
      <p className="text-gray-500">
        Não há eventos que correspondam aos filtros aplicados.
      </p>
    </div>
  );

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Timeline de Auditoria</h3>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">

      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Timeline de Auditoria</h3>
          <span className="text-sm text-gray-500">{logs.length} eventos</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <div className="flow-root">
          <ul className="space-y-4">
            {logs.map((log, index) => (
              <li key={log.id} className="relative">

                {/* Linha conectora */}
                {index < logs.length - 1 && (
                  <div className="absolute left-6 top-12 -ml-px h-full w-0.5 bg-gray-200" />
                )}

                {/* Evento */}
                <div className="relative flex items-start space-x-4">

                  {/* Ícone */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getLogColor(log.type)}`}>
                    {getLogIcon(log.type)}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                         onClick={() => onLogDetails(log)}>

                      {/* Header do evento */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">{log.action}</p>

                          {log.type === 'delete' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Crítico
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onLogDetails(log);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Detalhes */}
                      <p className="text-sm text-gray-600 mb-3">{log.details}</p>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">{log.user}</span>
                          <span>•</span>
                          <span>{log.ip}</span>
                          <span>•</span>
                          <span className="capitalize">
                            {log.type === 'create' && '🟢 Criação'}
                            {log.type === 'update' && '🔵 Atualização'}
                            {log.type === 'delete' && '🔴 Exclusão'}
                            {log.type === 'system' && '⚙️ Sistema'}
                          </span>
                        </div>
                        <span>{formatDateTime(log.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Load more se tiver muitos logs */}
        {logs.length > 50 && (
          <div className="text-center mt-8">
            <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Carregar mais eventos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogTable;
