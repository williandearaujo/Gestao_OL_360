import React, { useState, useEffect } from 'react';
import { X, Building, Save, Palette } from 'lucide-react';

const AreasModal = ({ isOpen, onClose, area, onSave, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    nome: '',
    sigla: '',
    descricao: '',
    cor: '#3B82F6',
    ativa: true
  });

  const [saving, setSaving] = useState(false);

  const predefinedColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
  ];

  useEffect(() => {
    if (area && mode === 'edit') {
      setFormData({
        nome: area.nome || '',
        sigla: area.sigla || '',
        descricao: area.descricao || '',
        cor: area.cor || '#3B82F6',
        ativa: area.ativa !== undefined ? area.ativa : true
      });
    } else {
      setFormData({
        nome: '',
        sigla: '',
        descricao: '',
        cor: '#3B82F6',
        ativa: true
      });
    }
  }, [area, mode, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.sigla.trim()) return;

    setSaving(true);

    try {
      const areaData = {
        ...formData,
        id: area?.id || Date.now(),
        created_at: area?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(areaData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar área:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {mode === 'edit' ? 'Editar Área' : 'Nova Área'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Área *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Ex: Tecnologia da Informação"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sigla *
              </label>
              <input
                type="text"
                value={formData.sigla}
                onChange={(e) => handleInputChange('sigla', e.target.value.toUpperCase())}
                placeholder="Ex: TI"
                maxLength={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              placeholder="Descreva as responsabilidades da área..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Palette className="w-4 h-4 inline mr-2" />
              Cor da Área
            </label>
            <div className="flex flex-wrap gap-3">
              {predefinedColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange('cor', color)}
                  className={`w-10 h-10 rounded-lg border-2 ${
                    formData.cor === color ? 'border-gray-400 ring-2 ring-blue-500' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
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
              Área ativa
            </label>
          </div>
        </form>

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
            {saving ? 'Salvando...' : mode === 'edit' ? 'Atualizar' : 'Criar Área'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreasModal;
