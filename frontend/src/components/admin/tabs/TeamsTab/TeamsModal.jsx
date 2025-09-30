import React, { useState, useEffect } from 'react';
import { X, Users, Save, Building, UserCheck, AlertCircle } from 'lucide-react';

const TeamsModal = ({
  isOpen,
  onClose,
  team,
  onSave,
  mode = 'create',
  areas,
  users,
  employees
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    area_id: '',
    gerente_id: '',
    descricao: '',
    ativa: true,
    membros_ids: []
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Preencher form ao editar
  useEffect(() => {
    if (team && mode === 'edit') {
      setFormData({
        nome: team.nome || '',
        area_id: team.area_id || '',
        gerente_id: team.gerente_id || '',
        descricao: team.descricao || '',
        ativa: team.ativa !== undefined ? team.ativa : true,
        membros_ids: team.membros_ids || []
      });
    } else {
      setFormData({
        nome: '',
        area_id: '',
        gerente_id: '',
        descricao: '',
        ativa: true,
        membros_ids: []
      });
    }
    setErrors({});
  }, [team, mode, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Filtrar gerentes disponíveis (usuários com role gerente ou admin)
  const availableManagers = users?.filter(user =>
    ['gerente', 'admin', 'diretoria'].includes(user.role)
  ) || [];

  // Filtrar colaboradores disponíveis para a área selecionada
  const availableEmployees = employees?.filter(emp =>
    emp.area_id === formData.area_id
  ) || [];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da equipe é obrigatório';
    }

    if (!formData.area_id) {
      newErrors.area_id = 'Área é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    try {
      const teamData = {
        ...formData,
        id: team?.id || Date.now(),
        membros_count: formData.membros_ids.length,
        created_at: team?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API
      onSave(teamData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar equipe:', error);
    } finally {
      setSaving(false);
    }
  };

  const selectedArea = areas?.find(area => area.id === formData.area_id);
  const selectedManager = availableManagers.find(user => user.id === formData.gerente_id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {mode === 'edit' ? 'Editar Equipe' : 'Nova Equipe'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'edit' ? 'Altere as informações da equipe' : 'Configure uma nova equipe organizacional'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Informações Básicas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Coluna Esquerda */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Equipe *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Ex: Equipe de Backend"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nome ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.nome && <p className="text-sm text-red-600 mt-1">{errors.nome}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building className="w-4 h-4 inline mr-1" />
                  Área/Departamento *
                </label>
                <select
                  value={formData.area_id}
                  onChange={(e) => {
                    handleInputChange('area_id', e.target.value);
                    // Limpar gerente e membros ao trocar área
                    handleInputChange('gerente_id', '');
                    handleInputChange('membros_ids', []);
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.area_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione uma área</option>
                  {areas?.filter(area => area.ativa).map(area => (
                    <option key={area.id} value={area.id}>
                      {area.nome} ({area.sigla})
                    </option>
                  ))}
                </select>
                {errors.area_id && <p className="text-sm text-red-600 mt-1">{errors.area_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <UserCheck className="w-4 h-4 inline mr-1" />
                  Gerente da Equipe
                </label>
                <select
                  value={formData.gerente_id}
                  onChange={(e) => handleInputChange('gerente_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Nenhum gerente definido</option>
                  {availableManagers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.nome} ({manager.role})
                    </option>
                  ))}
                </select>
                {availableManagers.length === 0 && (
                  <p className="text-sm text-orange-600 mt-1">
                    Nenhum gerente disponível. Cadastre usuários com role "gerente" na aba Usuários.
                  </p>
                )}
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição da Equipe
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descreva as responsabilidades e objetivos da equipe..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="ativa"
                  checked={formData.ativa}
                  onChange={(e) => handleInputChange('ativa', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="ativa" className="text-sm font-medium text-gray-700">
                  Equipe ativa
                </label>
              </div>
            </div>
          </div>

          {/* Membros da Equipe */}
          {formData.area_id && (
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">
                Membros da Equipe ({formData.membros_ids.length})
              </h4>

              {availableEmployees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {availableEmployees.map(employee => (
                    <label key={employee.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.membros_ids.includes(employee.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange('membros_ids', [...formData.membros_ids, employee.id]);
                          } else {
                            handleInputChange('membros_ids', formData.membros_ids.filter(id => id !== employee.id));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{employee.nome}</p>
                        <p className="text-sm text-gray-500">{employee.cargo}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="font-medium">Nenhum colaborador disponível</p>
                  <p className="text-sm">
                    {formData.area_id
                      ? 'Não há colaboradores cadastrados nesta área'
                      : 'Selecione uma área primeiro'
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Preview */}
          {formData.nome && (
            <div className="bg-gray-50 rounded-lg p-4 border-t">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Preview da Equipe:</h4>
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold`}
                     style={{ backgroundColor: selectedArea?.cor || '#3B82F6' }}>
                  {formData.nome.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{formData.nome}</h5>
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedArea?.nome} • {formData.membros_ids.length} membros
                  </p>
                  {selectedManager && (
                    <p className="text-sm text-gray-500">
                      Gerente: {selectedManager.nome}
                    </p>
                  )}
                  {formData.descricao && (
                    <p className="text-sm text-gray-600 mt-2">{formData.descricao}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
              saving
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : mode === 'edit' ? 'Atualizar Equipe' : 'Criar Equipe'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamsModal;
