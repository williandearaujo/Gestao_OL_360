import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui';
import { LOCATIONS, ADMIN_ROLES } from '../utils/constants';

const EditManagerModal = ({ isOpen, onClose, manager, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    team: '',
    location: '',
    permissions: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (manager) {
      setFormData({
        nome: manager.nome || '',
        email: manager.email || '',
        team: manager.team || '',
        location: manager.location || LOCATIONS.SAO_PAULO,
        permissions: manager.permissions || []
      });
    }
  }, [manager]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePermissionChange = (permission, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSave(manager.id, formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar gerente:', error);
      alert('Erro ao salvar dados do gerente');
    } finally {
      setLoading(false);
    }
  };

  const availablePermissions = [
    'admin', 'reports', 'team_management', 'user_management',
    'system_config', 'strategic_planning', 'performance_tracking'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={manager ? 'Editar Gerente' : 'Novo Gerente'}
      actions={[
        {
          label: 'Cancelar',
          variant: 'secondary',
          onClick: onClose
        },
        {
          label: loading ? 'Salvando...' : 'Salvar',
          variant: 'primary',
          onClick: handleSubmit,
          disabled: loading || !formData.nome || !formData.email
        }
      ]}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500"
              placeholder="Nome completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500"
              placeholder="email@oltecnologia.com.br"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipe</label>
            <input
              type="text"
              value={formData.team}
              onChange={(e) => handleInputChange('team', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500"
              placeholder="Nome da equipe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
            <select
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500"
            >
              {Object.values(LOCATIONS).map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Permissões</label>
          <div className="grid grid-cols-2 gap-2">
            {availablePermissions.map(permission => (
              <label key={permission} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(permission)}
                  onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                  className="rounded border-gray-300 text-ol-brand-600 focus:ring-ol-brand-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {permission.replace('_', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditManagerModal;
