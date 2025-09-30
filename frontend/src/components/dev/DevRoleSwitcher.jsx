import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const DevRoleSwitcher = () => {
  const { user, switchRole, isAdmin, isDev } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Só mostrar para admin ou em desenvolvimento
  if (!user || (user.username !== 'admin' && !isDev)) {
    return null;
  }

  const roles = [
    {
      id: 'superadmin',
      name: 'Super Admin',
      description: 'Todas as permissões',
      color: 'bg-red-600',
      permissions: {
        employees: { read: true, write: true, delete: true },
        teams: { read: true, write: true, delete: true },
        managers: { read: true, write: true, delete: true },
        knowledge: { read: true, write: true, delete: true },
        areas: { read: true, write: true, delete: true },
        admin: { read: true, write: true, delete: true }
      },
      is_admin: true
    },
    {
      id: 'admin',
      name: 'Administrador',
      description: 'Permissões administrativas',
      color: 'bg-orange-600',
      permissions: {
        employees: { read: true, write: true, delete: false },
        teams: { read: true, write: true, delete: false },
        managers: { read: true, write: true, delete: false },
        knowledge: { read: true, write: true, delete: false },
        areas: { read: true, write: true, delete: false }
      },
      is_admin: true
    },
    {
      id: 'manager',
      name: 'Gerente',
      description: 'Visualizar e editar equipe',
      color: 'bg-blue-600',
      permissions: {
        employees: { read: true, write: true, delete: false },
        teams: { read: true, write: false, delete: false },
        knowledge: { read: true, write: false, delete: false }
      },
      is_admin: false
    },
    {
      id: 'user',
      name: 'Usuário',
      description: 'Apenas visualização',
      color: 'bg-gray-600',
      permissions: {
        employees: { read: true, write: false, delete: false },
        knowledge: { read: true, write: false, delete: false }
      },
      is_admin: false
    }
  ];

  const currentRole = roles.find(role =>
    JSON.stringify(role.permissions) === JSON.stringify(user?.permissions || {})
  ) || { id: 'custom', name: 'Personalizado', color: 'bg-yellow-600' };

  const handleRoleChange = (role) => {
    if (switchRole) {
      switchRole(role);
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${currentRole.color} text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 min-w-[120px] justify-center`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs font-medium">{currentRole.name}</span>
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">
                🔧 Dev Role Switcher
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Trocar permissões para teste
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleChange(role)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                    currentRole.id === role.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-block w-3 h-3 rounded-full ${role.color}`}></span>
                        <span className="text-sm font-medium text-gray-900">{role.name}</span>
                        {role.is_admin && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                    </div>

                    {currentRole.id === role.id && (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Usuário: {user?.username}
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevRoleSwitcher;
