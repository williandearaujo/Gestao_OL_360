import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import KnowledgeBadge from './KnowledgeBadge';

const EmployeeKnowledgeModal = ({
  isOpen,
  onClose,
  onSave,
  employee,
  knowledgeItem,
  existingLink,
  onRemove
}) => {
  const [formData, setFormData] = useState({
    vinculo: 'DESEJADO',
    data_alvo: '',
    data_obtencao: '',
    data_expiracao: '',
    prioridade: 'MEDIA',
    anexo_path: '',
    observacoes: ''
  });

  useEffect(() => {
    if (existingLink) {
      setFormData({
        vinculo: existingLink.vinculo || 'DESEJADO',
        data_alvo: existingLink.data_alvo ? existingLink.data_alvo.split('T')[0] : '',
        data_obtencao: existingLink.data_obtencao ? existingLink.data_obtencao.split('T')[0] : '',
        data_expiracao: existingLink.data_expiracao ? existingLink.data_expiracao.split('T')[0] : '',
        prioridade: existingLink.prioridade || 'MEDIA',
        anexo_path: existingLink.anexo_path || '',
        observacoes: existingLink.observacoes || ''
      });
    } else {
      setFormData({
        vinculo: 'DESEJADO',
        data_alvo: '',
        data_obtencao: '',
        data_expiracao: '',
        prioridade: 'MEDIA',
        anexo_path: '',
        observacoes: ''
      });
    }
  }, [existingLink, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      employee_id: employee.id,
      learning_item_id: knowledgeItem.id,
      ...formData,
      data_alvo: formData.data_alvo || null,
      data_obtencao: formData.data_obtencao || null,
      data_expiracao: formData.data_expiracao || null
    };
    onSave(payload);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Em um cenário real, aqui faria upload para servidor/S3
      const fileName = `conhecimento_${employee.id}_${knowledgeItem.id}_${Date.now()}.pdf`;
      handleChange('anexo_path', fileName);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${knowledgeItem?.nome} - ${employee?.nome}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header com info */}
        <div className="bg-ol-brand-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-ol-brand-900">{knowledgeItem?.nome}</h4>
              <p className="text-sm text-ol-brand-700">
                {knowledgeItem?.codigo} • {knowledgeItem?.vendor}
              </p>
            </div>
            <div>
              <p className="font-medium text-ol-brand-900">{employee?.nome}</p>
              <p className="text-sm text-ol-brand-700">
                {employee?.cargo} • {employee?.equipe}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo de Vínculo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Vínculo *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['DESEJADO', 'OBRIGATORIO', 'OBTIDO'].map(tipo => (
                <label key={tipo} className="flex items-center">
                  <input
                    type="radio"
                    name="vinculo"
                    value={tipo}
                    checked={formData.vinculo === tipo}
                    onChange={(e) => handleChange('vinculo', e.target.value)}
                    className="mr-2 text-ol-brand-600"
                  />
                  <KnowledgeBadge status={tipo} />
                </label>
              ))}
            </div>
          </div>
          {(formData.vinculo === 'DESEJADO' || formData.vinculo === 'OBRIGATORIO') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Alvo *
              </label>
              <input
                type="date"
                required
                value={formData.data_alvo}
                onChange={(e) => handleChange('data_alvo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
              />
            </div>
          )}
          {formData.vinculo === 'OBTIDO' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Obtenção *
              </label>
              <input
                type="date"
                required
                value={formData.data_obtencao}
                onChange={(e) => handleChange('data_obtencao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
              />
            </div>
          )}
          {formData.vinculo === 'OBTIDO' && knowledgeItem?.validade_meses && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Expiração
              </label>
              <input
                type="date"
                value={formData.data_expiracao}
                onChange={(e) => handleChange('data_expiracao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Validade: {knowledgeItem.validade_meses} meses
              </p>
            </div>
          )}
          {/* Prioridade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridade
            </label>
            <select
              value={formData.prioridade}
              onChange={(e) => handleChange('prioridade', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            >
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>
          {/* Upload de Anexo (para OBTIDO) */}
          {formData.vinculo === 'OBTIDO' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anexar Certificado
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
              />
              {formData.anexo_path && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Arquivo: {formData.anexo_path}
                </p>
              )}
            </div>
          )}
          {/* Observações */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
              placeholder="Observações adicionais..."
            />
          </div>
        </div>
        {/* Botões */}
        <div className="flex justify-between pt-4">
          <div>
            {existingLink && onRemove && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja remover este vínculo?')) {
                    onRemove();
                    onClose();
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
              >
                Remover Vínculo
              </button>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-ol-brand-600 border border-transparent rounded-md hover:bg-ol-brand-700"
            >
              {existingLink ? "Salvar" : "Criar Vínculo"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeKnowledgeModal;
