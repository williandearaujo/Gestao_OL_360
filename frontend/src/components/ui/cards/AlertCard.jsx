import React from 'react';
import { AlertTriangle, Award } from 'lucide-react';

/**
 * Card de alertas e notificações
 * Usado principalmente no Dashboard
 */
const AlertCard = ({
  alerts = [],
  onAlertClick,
  title = "Alertas e Notificações",
  className = ''
}) => {
  return (
    <div className={`bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Lista de alertas */}
      <div className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all ${
                alert.priority === 'high' ? 'bg-red-50 border-red-400 hover:bg-red-100' :
                alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-400 hover:bg-yellow-100' :
                'bg-blue-50 border-blue-400 hover:bg-blue-100'
              }`}
              onClick={() => onAlertClick && onAlertClick(alert)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                </div>
                <div className="text-xs text-gray-500">{alert.date}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <div className="text-gray-400 mb-2">
              <Award className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-sm text-gray-500">Nenhum alerta no momento</p>
            <p className="text-xs text-gray-400">Sistema funcionando perfeitamente!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertCard;
