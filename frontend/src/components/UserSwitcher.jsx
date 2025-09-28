import React from 'react';
import { AuthProvider } from './contexts/AuthContext';

const UserSwitcher = () => {
  const { currentUser, availableUsers, switchUser } = useAuth();

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border rounded-lg shadow-lg p-4">
      <h4 className="text-sm font-medium text-ol-gray-700 mb-2">
        🧪 Teste de Permissões
      </h4>
      <div className="space-y-2">
        <p className="text-xs text-ol-gray-500">Usuário atual:</p>
        <p className="text-sm font-medium text-ol-brand-600">
          {currentUser.nome} ({currentUser.access_level})
        </p>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-ol-gray-500 mb-2">Trocar para:</p>
          <div className="space-y-1">
            {availableUsers.map(user => (
              <button
                key={user.id}
                onClick={() => switchUser(user.id)}
                disabled={user.id === currentUser.id}
                className={`w-full text-left text-xs px-2 py-1 rounded transition-colors ${
                  user.id === currentUser.id
                    ? 'bg-ol-brand-100 text-ol-brand-700 cursor-not-allowed'
                    : 'hover:bg-ol-gray-100 text-ol-gray-700'
                }`}
              >
                {user.nome} ({user.access_level})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSwitcher;

