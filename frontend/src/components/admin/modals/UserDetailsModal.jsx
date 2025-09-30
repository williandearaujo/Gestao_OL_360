import React from 'react';
import { X } from 'lucide-react';
import { getRoleColor, getPermissions } from '../services/userUtils';

const UserDetailsModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Detalhes do Usuário</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Informações Básicas */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">
                    {user.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{user.nome}</h4>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className={`text-xs ${user.status === 'online' ? 'text-green-600' : 'text-gray-600'}`}>
                        {user.status === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Profissionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Informações Profissionais</h5>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Cargo:</span>
                    <p className="font-medium">{user.cargo || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Área:</span>
                    <p className="font-medium">{user.area || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Equipe:</span>
                    <p className="font-medium">{user.equipe || 'Não informado'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Informações do Sistema</h5>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">ID:</span>
                    <p className="font-medium">#{user.id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Último Acesso:</span>
                    <p className="font-medium">
                      {user.lastAccess ? new Date(user.lastAccess).toLocaleString('pt-BR') : 'Nunca'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissões */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Permissões</h5>
              <div className="flex flex-wrap gap-2">
                {getPermissions(user.role).map((permission, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>

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

export default UserDetailsModal;
