import React, { useState } from 'react';
import { Modal } from '../../ui';
import { ADMIN_ROLES } from '../utils/constants';

const PermissionModal = ({ isOpen, onClose, permissions, onSave }) => {
  const [selectedRole, setSelectedRole] = useState('admin');

  const roles = permissions?.roles || {
    admin: { count: 2, users: ['Admin 1', 'Admin 2'] },
    diretoria: { count: 3, users: ['Diretor 1', 'Diretor 2'] },
    gerente: { count: 8, users: ['Gerente 1', 'Gerente 2'] },
    colaborador: { count: 45, users: [] }
  };

  const roleLabels = {
    admin: 'Administrador',
    diretoria: 'Diretoria',
    gerente: 'Gerente',
    colaborador: 'Colaborador'
  };

  const rolePermissions = {
    admin: ['Acesso total', 'Gestão de usuários', 'Configurações do sistema', 'Relatórios completos'],
    diretoria: ['Relatórios estratégicos', 'Gestão de equipes', 'Planejamento', 'Métricas executivas'],
    gerente: ['Gestão da equipe', 'Relatórios da equipe', 'Performance tracking', 'Aprovações'],
    colaborador: ['Acesso básico', 'Perfil pessoal', 'Visualização limitada', 'Funcionalidades essenciais']
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gerenciar Permissões por Role"
      actions={[
        {
          label: 'Fechar',
          variant: 'secondary',
          onClick: onClose
        }
      ]}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecionar Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500"
          >
            {Object.keys(roles).map(role => (
              <option key={role} value={role}>
                {roleLabels[role]} ({roles[role].count} usuários)
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">
            Permissões do {roleLabels[selectedRole]}
          </h4>
          <ul className="space-y-1">
            {rolePermissions[selectedRole]?.map((permission, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {permission}
              </li>
            ))}
          </ul>
        </div>

        {roles[selectedRole]?.users?.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Usuários com esta Role
            </h4>
            <div className="max-h-32 overflow-y-auto">
              {roles[selectedRole].users.map((user, index) => (
                <div key={index} className="text-sm text-gray-700 py-1 border-b border-gray-200 last:border-0">
                  {user}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Informação:</strong> As permissões são aplicadas automaticamente quando
            um usuário é vinculado a uma role. Mudanças nas permissões afetam todos os usuários da role.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default PermissionModal;
