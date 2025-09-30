import React, { useState, useEffect } from 'react';
import { X, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

const AddKnowledgeModal = ({
  isOpen,
  onClose,
  selectedEmployee,
  knowledgeCatalog = [],
  onAddKnowledge,
  onFileUpload
}) => {
  const [newKnowledge, setNewKnowledge] = useState({
    knowledgeid: '',
    status: 'DESEJADO',
    dataobtencao: '',
    dataalvo: '',
    dataexpiracao: '',
    prioridade: 'MEDIA',
    anexo: null,
    observacoes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ RESET FORM QUANDO MODAL ABRE
  useEffect(() => {
    if (isOpen) {
      setNewKnowledge({
        knowledgeid: '',
        status: 'DESEJADO',
        dataobtencao: '',
        dataalvo: '',
        dataexpiracao: '',
        prioridade: 'MEDIA',
        anexo: null,
        observacoes: ''
      });
      setError(null);
    }
  }, [isOpen]);

  // ✅ DEBUG
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 AddKnowledgeModal ABERTO:');
      console.log('- selectedEmployee:', selectedEmployee?.nome);
      console.log('- knowledgeCatalog length:', knowledgeCatalog?.length || 0);
      console.log('- knowledgeCatalog:', knowledgeCatalog);
    }
  }, [isOpen, selectedEmployee, knowledgeCatalog]);

  if (!isOpen || !selectedEmployee) return null;

  // ✅ ENCONTRAR CONHECIMENTO SELECIONADO
  const selectedKnowledgeItem = knowledgeCatalog.find(k => k.id === parseInt(newKnowledge.knowledgeid));

  // ✅ LABELS DINÂMICOS
  const getLabels = () => {
    if (!selectedKnowledgeItem) {
      return { anexo: 'Anexar Evidência', obtido: 'Obtido' };
    }

    switch (selectedKnowledgeItem.tipo) {
      case 'CERTIFICACAO':
        return { anexo: 'Anexar Certificado', obtido: 'Certificado Obtido' };
      case 'CURSO':
        return { anexo: 'Anexar Certificado de Conclusão', obtido: 'Curso Concluído' };
      case 'GRADUACAO':
      case 'FORMACAO':
        return { anexo: 'Anexar Diploma', obtido: 'Formação Concluída' };
      default:
        return { anexo: 'Anexar Evidência', obtido: 'Obtido' };
    }
  };

  const labels = getLabels();

  // ✅ HANDLE ADICIONAR CONHECIMENTO
  const handleAddKnowledge = async () => {
    if (!newKnowledge.knowledgeid) {
      alert('Selecione um conhecimento!');
      return;
    }

    try {
      setLoading(true);

      // Preparar dados do vínculo
      const vinculoData = {
        employee_id: selectedEmployee.id,
        learning_item_id: parseInt(newKnowledge.knowledgeid),
        status: newKnowledge.status,
        prioridade: newKnowledge.prioridade || 'MEDIA',
        data_alvo: newKnowledge.dataalvo || null,
        data_obtencao: newKnowledge.dataobtencao || null,
        data_expiracao: newKnowledge.dataexpiracao || null,
        anexo_path: newKnowledge.anexo || null,
        observacoes: newKnowledge.observacoes || ''
      };

      console.log('🚀 Salvando vínculo:', vinculoData);

      // Chamar função de callback
      if (onAddKnowledge) {
        await onAddKnowledge(vinculoData);
      }

      alert('Conhecimento vinculado com sucesso!');
      onClose();
    } catch (error) {
      console.error('❌ Erro ao salvar vínculo:', error);
      setError(`Erro ao salvar vínculo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ HANDLE FILE UPLOAD
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Arquivo muito grande! Máximo 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target.result;
        setNewKnowledge(prev => ({
          ...prev,
          anexo: fileData
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* ✅ HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-ol-brand-500">
              Adicionar Conhecimento - {selectedEmployee.nome}
            </h3>
            <button
              onClick={onClose}
              className="text-ol-gray-400 hover:text-ol-gray-600"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ✅ ERROR DISPLAY */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-700 underline text-sm mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* ✅ DEBUG INFO (DESENVOLVIMENTO) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-gray-100 border rounded-md text-xs">
              <details>
                <summary className="cursor-pointer font-semibold">🔍 Debug Info</summary>
                <div className="mt-2 space-y-1">
                  <div>Employee: {selectedEmployee?.nome} (ID: {selectedEmployee?.id})</div>
                  <div>Knowledge Catalog: {knowledgeCatalog?.length || 0} items</div>
                  <div>Selected Knowledge ID: {newKnowledge.knowledgeid}</div>
                  <div>Selected Item: {selectedKnowledgeItem ? `${selectedKnowledgeItem.nome} (${selectedKnowledgeItem.tipo})` : 'None'}</div>
                </div>
              </details>
            </div>
          )}

          {/* ✅ FORMULÁRIO */}
          <div className="space-y-4">
            {/* Seleção do Conhecimento */}
            <div>
              <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                Conhecimento
              </label>
              <select
                value={newKnowledge.knowledgeid}
                onChange={(e) => setNewKnowledge(prev => ({ ...prev, knowledgeid: e.target.value }))}
                className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                disabled={loading}
              >
                <option value="">Selecione um conhecimento</option>
                {knowledgeCatalog.map(kn => (
                  <option key={kn.id} value={kn.id}>
                    {kn.tipo} - {kn.nome} - {kn.vendor || kn.area}
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
                  {selectedKnowledgeItem.codigo} - {selectedKnowledgeItem.vendor}
                </p>
                {selectedKnowledgeItem.validademeses && (
                  <p className="text-xs text-ol-brand-600 mt-1">
                    Validade: {selectedKnowledgeItem.validademeses} meses
                  </p>
                )}
              </div>
            )}

            {/* Status do Vínculo */}
            <div>
              <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                Status do Vínculo
              </label>
              <select
                value={newKnowledge.status}
                onChange={(e) => setNewKnowledge(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                disabled={loading}
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
                    Data de Obtenção
                  </label>
                  <input
                    type="date"
                    value={newKnowledge.dataobtencao}
                    onChange={(e) => setNewKnowledge(prev => ({ ...prev, dataobtencao: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    disabled={loading}
                  />
                </div>

                {/* Data de Expiração (se o conhecimento tem validade) */}
                {selectedKnowledgeItem?.validademeses && (
                  <div>
                    <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                      Data de Expiração
                    </label>
                    <input
                      type="date"
                      value={newKnowledge.dataexpiracao}
                      onChange={(e) => setNewKnowledge(prev => ({ ...prev, dataexpiracao: e.target.value }))}
                      className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Calculado automaticamente baseado na validade de {selectedKnowledgeItem.validademeses} meses
                    </p>
                  </div>
                )}

                {/* Upload de Anexo */}
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    {labels.anexo} (PDF, JPG, PNG)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-ol-brand-100 file:text-ol-brand-700 hover:file:bg-ol-brand-200"
                    disabled={loading}
                  />
                  {newKnowledge.anexo && (
                    <p className="text-xs text-green-600 mt-1">
                      ✅ Arquivo anexado
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
                  value={newKnowledge.dataalvo}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, dataalvo: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  disabled={loading}
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
                disabled={loading}
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={newKnowledge.observacoes}
                onChange={(e) => setNewKnowledge(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                placeholder="Observações adicionais..."
                disabled={loading}
              />
            </div>
          </div>

          {/* ✅ BOTÕES */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-ol-gray-600 border border-ol-gray-300 rounded-md hover:bg-ol-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleAddKnowledge}
              disabled={!newKnowledge.knowledgeid || loading}
              className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Criar Vínculo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddKnowledgeModal;
