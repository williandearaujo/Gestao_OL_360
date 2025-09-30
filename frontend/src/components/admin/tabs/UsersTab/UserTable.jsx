import React from 'react';
import { Eye, Edit, Trash2, Plus, Users } from 'lucide-react';
import { getRoleColor, filterUsers } from '../../services/userUtils';

const UserTable = ({
  users,
  filters,
  onUserEdit,
  onUserView,
  onUserDelete,
  onUserCreate
}) => {
  const filteredUsers = filterUsers(users, filters);

  const formatLastAccess = (lastAccess) => {
    if (!lastAccess) return 'Nunca';

    const minutesAgo = Math.floor((new Date() - new Date(lastAccess)) / 60000);
    if (minutesAgo === 0) return 'Agora';
    if (minutesAgo < 60) return `${minutesAgo}m atrás`;

    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo}h atrás`;

    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo}d atrás`;
  };

  const EmptyState = () => (
    <div className="text-center py-16">
      <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {filters.search || filters.role || filters.status
          ? 'Nenhum usuário encontrado'
          : 'Nenhum usuário cadastrado'
        }
      </h3>
      <p className="text-gray-500 mb-6">
        {filters.search || filters.role || filters.status
          ? 'Tente ajustar os filtros para encontrar usuários.'
          : 'Comece criando o primeiro usuário do sistema.'
        }
      </p>
      <button
        className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        onClick={onUserCreate}
      >
        <Plus className="w-4 h-4 mr-2" />
        {filters.search || filters.role || filters.status
          ? 'Criar Novo Usuário'
          : 'Criar Primeiro Usuário'
        }
      </button>
    </div>
  );

  if (filteredUsers.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Usuários</h3>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">

      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Usuários</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''}
            </span>
            <button
              className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              onClick={onUserCreate}
            >
              <Plus className="w-4 h-4 mr-1" />
              Novo
            </button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Função
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Área/Equipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Acesso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">

                {/* Usuário */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-medium text-sm">
                        {user.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{user.nome}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      {user.cargo && (
                        <p className="text-xs text-gray-400 truncate">{user.cargo}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Função */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {user.role === 'admin' && '🔧 '}
                    {user.role === 'diretoria' && '💼 '}
                    {user.role === 'gerente' && '👔 '}
                    {user.role === 'colaborador' && '👤 '}
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>

                {/* Área/Equipe */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <p className="text-gray-900">{user.area || 'Não informado'}</p>
                    {user.equipe && (
                      <p className="text-gray-500">{user.equipe}</p>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      user.status === 'online' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {user.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </td>

                {/* Último Acesso */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatLastAccess(user.lastAccess)}
                </td>

                {/* Ações */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      onClick={() => onUserView(user)}
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => onUserEdit(user)}
                      title="Editar usuário"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {user.id !== 1 && ( // Não deletar admin principal
                      <button
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        onClick={() => onUserDelete(user.id)}
                        title="Deletar usuário"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer com informações adicionais */}
      {filteredUsers.length > 10 && (
        <div className="px-6 py-3 bg-gray-50 border-t">
          <p className="text-sm text-gray-600 text-center">
            Mostrando {filteredUsers.length} usuários
            {users.length !== filteredUsers.length && ` de ${users.length} total`}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
