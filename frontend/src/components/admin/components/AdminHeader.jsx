import React from 'react';
import { Shield } from 'lucide-react';

const AdminHeader = ({ onBackToDashboard, systemHealth }) => (
  <div className="bg-white border-b">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Voltar
            </button>
          )}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Sistema de gestão executiva</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${systemHealth?.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-gray-600">
              {systemHealth?.online ? 'Sistema Online' : 'Sistema Offline'}
            </span>
            {systemHealth?.responseTime && (
              <span className="text-gray-400">({systemHealth.responseTime}ms)</span>
            )}
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">WA</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AdminHeader;
