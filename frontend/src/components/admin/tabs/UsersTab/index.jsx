import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import UserStats from './UserStats';
import UserFilters from './UserFilters';
import UserTable from './UserTable';
import UserModal from '../../modals/UserModal';
import UserDetailsModal from '../../modals/UserDetailsModal';
import { auditSystem } from '../../services/auditSystem';

const UsersTab = ({
  users,
  analytics,
  onUsersUpdate,
  onLogsUpdate
}) => {
  const [userModal, setUserModal] = useState({ isOpen: false, user: null });
  const [userDetailsModal, setUserDetailsModal] = useState({ isOpen: false, user: null });
  const [filters, setFilters] = useState({ search: '', role: '', status: '' });

  const handleUserSave = useCallback((userData) => {
    let updatedUsers;

    if (userData.id) {
      // Editar usuário
      updatedUsers = users.map(u => u.id === userData.id ? { ...u, ...userData } : u);
      auditSystem.log('Editou usuário', `${userData.nome} - ${userData.role}`, 'Willian Araújo');
    } else {
      // Criar usuário
      const newUser = {
        ...userData,
        id: Date.now(),
        status: 'offline',
        lastAccess: new Date(),
        permissions: userData.role === 'admin' ? ['all'] : ['dashboard']
      };
      updatedUsers = [...users, newUser];
      auditSystem.log('Criou usuário', `${userData.nome} - ${userData.role}`, 'Willian Araújo');
    }

    onUsersUpdate(updatedUsers);
    onLogsUpdate();
    setUserModal({ isOpen: false, user: null });
  }, [users, onUsersUpdate, onLogsUpdate]);

  const handleUserDelete = useCallback((userId) => {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      const user = users.find(u => u.id === userId);
      const updatedUsers = users.filter(u => u.id !== userId);

      onUsersUpdate(updatedUsers);
      auditSystem.log('Deletou usuário', `${user?.nome} - ${user?.role}`, 'Willian Araújo');
      onLogsUpdate();
    }
  }, [users, onUsersUpdate, onLogsUpdate]);

  const openUserModal = useCallback((user = null) => {
    setUserModal({ isOpen: true, user });
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h2>
          <p className="text-gray-600 mt-1">Gerencie usuários e permissões do sistema</p>
        </div>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => openUserModal()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </button>
      </div>

      {/* Stats */}
      <UserStats
        analytics={analytics}
        users={users}
        onFilterChange={setFilters}
      />

      {/* Filtros */}
      <UserFilters
        filters={filters}
        onFiltersChange={setFilters}
        users={users}
        onUserCreate={() => openUserModal()}
      />

      {/* Tabela */}
      <UserTable
        users={users}
        filters={filters}
        onUserEdit={openUserModal}
        onUserView={(user) => setUserDetailsModal({ isOpen: true, user })}
        onUserDelete={handleUserDelete}
        onUserCreate={() => openUserModal()}
      />

      {/* Modals */}
      <UserModal
        isOpen={userModal.isOpen}
        onClose={() => setUserModal({ isOpen: false, user: null })}
        user={userModal.user}
        onSave={handleUserSave}
      />

      <UserDetailsModal
        isOpen={userDetailsModal.isOpen}
        onClose={() => setUserDetailsModal({ isOpen: false, user: null })}
        user={userDetailsModal.user}
      />
    </div>
  );
};

export default UsersTab;
