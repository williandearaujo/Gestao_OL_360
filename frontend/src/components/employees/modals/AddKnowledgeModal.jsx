import React from 'react';
import { knowledgeCatalog } from '../../knowledge/mockKnowledgeData';

const AddKnowledgeModal = ({ 
  isOpen, 
  onClose, 
  selectedEmployee, 
  newKnowledge, 
  setNewKnowledge,
  onAddKnowledge,
  onFileUpload 
}) => {
  if (!isOpen || !selectedEmployee) return null;

  // Encontra o conhecimento selecionado para mostrar detalhes
  const selectedKnowledgeItem = knowledgeCatalog.find(k => k.id === parseInt(newKnowledge.knowledge_id));

  // Define labels dinâmicos baseado no tipo de conhecimento
  const getLabels = () => {
    if (!selectedKnowledgeItem) return { anexo: 'Anexar Evidência', obtido: 'Obtido' };
    
    switch (selectedKnowledgeItem.tipo) {
      case 'CERTIFICACAO':
        return { anexo: 'Anexar Certificado', obtido: 'Certificado Obtido' };
      case 'CURSO':
        return { anexo: 'Anexar Certificado de Conclusão', obtido: 'Curso Concluído' };
      case 'GRADUACAO':
        return { anexo: 'Anexar Diploma', obtido: 'Graduação Concluída' };
      default:
        return { anexo: 'Anexar Evidência', obtido: 'Obtido' };
    }
  };

  const labels = getLabels();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-ol-brand-500">
              Adicionar Conhecimento - {selectedEmployee.nome}
            </h3>
            <button
              onClick={onClose}
              className="text-ol-gray-400 hover:text-ol-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Seleção do Conhecimento */}
            <div>
              <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                Conhecimento *
              </label>
              <select
                value={newKnowledge.knowledge_id}
                onChange={(e) => setNewKnowledge(prev => ({ ...prev, knowledge_id: e.target.value }))}
                className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
              >
                <option value="">Selecione um conhecimento</option>
                {knowledgeCatalog.map(kn => (
                  <option key={kn.id} value={kn.id}>
                    [{kn.tipo}] {kn.nome} - {kn.vendor}
                  </option>
                ))}
              </select>
            </div>

            {/* Detalhes do conhecimento selecionado */}
            {selectedKnowledgeItem && (
              <div className="p-3 bg-ol-brand-50 rounded-lg border border-ol-brand-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs bg-ol-brand-100 text-ol-brand-700 px-2 py-1 rounded">
                    {selectedKnowledgeItem.tipo}
                  </span>
                  {selectedKnowledgeItem.area && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {selectedKnowledgeItem.area}
                    </span>
                  )}
                </div>
                <p className="text-sm text-ol-brand-700">
                  <strong>{selectedKnowledgeItem.nome}</strong>
                </p>
                <p className="text-xs text-ol-brand-600">
                  {selectedKnowledgeItem.codigo} • {selectedKnowledgeItem.vendor}
                </p>
                {selectedKnowledgeItem.validade_meses && (
                  <p className="text-xs text-ol-brand-600 mt-1">
                    Validade: {selectedKnowledgeItem.validade_meses} meses
                  </p>
                )}
              </div>
            )}

            {/* Status/Vínculo */}
            <div>
              <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                Status do Vínculo *
              </label>
              <select
                value={newKnowledge.status}
                onChange={(e) => setNewKnowledge(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
              >
                <option value="DESEJADO">Desejado</option>
                <option value="OBRIGATORIO">Obrigatório</option>
                <option value="OBTIDO">{labels.obtido}</option>
              </select>
            </div>

            {/* Campos condicionais para OBTIDO */}
            {newKnowledge.status === 'OBTIDO' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    Data de Obtenção *
                  </label>
                  <input
                    type="date"
                    value={newKnowledge.data_obtencao}
                    onChange={(e) => setNewKnowledge(prev => ({ ...prev, data_obtencao: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                {/* Data de Expiração (se o conhecimento tem validade) */}
                {selectedKnowledgeItem?.validade_meses && (
                  <div>
                    <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                      Data de Expiração
                    </label>
                    <input
                      type="date"
                      value={newKnowledge.data_expiracao}
                      onChange={(e) => setNewKnowledge(prev => ({ ...prev, data_expiracao: e.target.value }))}
                      className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Calculado automaticamente baseado na validade de {selectedKnowledgeItem.validade_meses} meses
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    {labels.anexo} (PDF, JPG, PNG)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => onFileUpload(e, null, true)}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-ol-brand-100 file:text-ol-brand-700 hover:file:bg-ol-brand-200"
                  />
                  {newKnowledge.anexo && (
                    <p className="text-xs text-green-600 mt-1">
                      ✅ {selectedKnowledgeItem?.tipo === 'CERTIFICACAO' ? 'Certificado' : 
                          selectedKnowledgeItem?.tipo === 'CURSO' ? 'Certificado' : 
                          selectedKnowledgeItem?.tipo === 'GRADUACAO' ? 'Diploma' : 'Arquivo'} anexado
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Campos condicionais para DESEJADO ou OBRIGATÓRIO */}
            {(newKnowledge.status === 'DESEJADO' || newKnowledge.status === 'OBRIGATORIO') && (
              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                  Data Alvo
                </label>
                <input
                  type="date"
                  value={newKnowledge.data_alvo}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, data_alvo: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                />
              </div>
            )}

            {/* Prioridade */}
            <div>
              <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                Prioridade
              </label>
              <select
                value={newKnowledge.prioridade || 'MEDIA'}
                onChange={(e) => setNewKnowledge(prev => ({ ...prev, prioridade: e.target.value }))}
                className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-ol-gray-600 border border-ol-gray-300 rounded-md hover:bg-ol-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={onAddKnowledge}
              disabled={!newKnowledge.knowledge_id}
              className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Adicionar Vínculo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddKnowledgeModal;
