import React, { useState } from 'react';
import { Modal } from '../../ui';

const ManagerLinkModal = ({ isOpen, onClose, manager, users = [], onLink }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedUserId) {
      alert('Por favor, selecione um usuário para vincular.');
      return;
    }

    try {
      setLoading(true);
      await onLink(manager.id, selectedUserId);
      onClose();
    } catch (error) {
      console.error('Erro ao vincular usuário:', error);
      alert('Erro ao vincular usuário');
    } finally {
      setLoading(false);
    }
  };

  const mockUsers = users.length > 0 ? users : [
    { id: 1, nome: 'João Santos', email: 'joao.santos@oltecnologia.com.br' },
    { id: 2, nome: 'Maria Silva', email: 'maria.silva@oltecnologia.com.br' },
    { id: 3, nome: 'Pedro Costa', email: 'pedro.costa@oltecnologia.com.br' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vincular Usuário ao Gerente"
      actions={[
        {
          label: 'Cancelar',
          variant: 'secondary',
          onClick: onClose
        },
        {
          label: loading ? 'Vinculando...' : 'Vincular',
          variant: 'primary',
          onClick: handleSubmit,
          disabled: loading || !selectedUserId
        }
      ]}
    >
      {manager && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Gerente Selecionado</h4>
            <div className="space-y-1 text-sm">
              <div><strong>Nome:</strong> {manager.nome}</div>
              <div><strong>Email:</strong> {manager.email}</div>
              <div><strong>Equipe:</strong> {manager.team}</div>
              <div><strong>Status:</strong> {manager.status}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Usuário para Vincular
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500"
            >
              <option value="">Selecione um usuário...</option>
              {mockUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.nome} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Atenção:</strong> Após a vinculação, o usuário receberá automaticamente
              as permissões de gerente e poderá acessar funcionalidades administrativas.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ManagerLinkModal;
