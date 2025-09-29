import React, { useState, useEffect } from 'react';
import { knowledgeService } from '../../services/knowledgeService';

const API_BASE_URL = 'http://localhost:8000';

const api = {
  post: async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { data: await response.json() };
  }
};

const employeeKnowledgeService = {
  async create(data) {
    try {
      console.log('Criando vinculo:', data);

      if (!data.employee_id) throw new Error('employee_id e obrigatorio');
      if (!data.learning_item_id && !data.knowledge_id) throw new Error('learning_item_id e obrigatorio');
      if (!data.status) data.status = 'DESEJADO';

      if (data.knowledge_id && !data.learning_item_id) {
        data.learning_item_id = data.knowledge_id;
        delete data.knowledge_id;
      }

      const response = await api.post('/employee-knowledge', data);
      console.log('Vinculo criado:', response.data);

      return response.data;
    } catch (error) {
      console.error('Erro ao criar vinculo:', error);
      throw error;
    }
  }
};

const AddKnowledgeModal = ({
  isOpen,
  onClose,
  selectedEmployee,
  newKnowledge,
  setNewKnowledge,
  onAddKnowledge,
  onFileUpload
}) => {
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadKnowledge();
    }
  }, [isOpen]);

  const loadKnowledge = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Carregando conhecimentos da API...');

      const data = await knowledgeService.getAll();
      console.log('Conhecimentos carregados:', data.length);

      setKnowledge(data);
    } catch (err) {
      console.error('Erro ao carregar conhecimentos:', err);
      setError('Erro ao carregar conhecimentos da API');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKnowledge = async () => {
    if (!newKnowledge.knowledge_id) {
      alert('Selecione um conhecimento!');
      return;
    }

    try {
      setSaving(true);
      console.log('Salvando vinculo via API...');

      const vinculoData = {
        employee_id: selectedEmployee.id,
        learning_item_id: parseInt(newKnowledge.knowledge_id),
        status: newKnowledge.status,
        prioridade: newKnowledge.prioridade || 'MEDIA',
        data_alvo: newKnowledge.data_alvo || null,
        data_obtencao: newKnowledge.data_obtencao || null,
        data_expiracao: newKnowledge.data_expiracao || null,
        anexo_path: newKnowledge.anexo || null,
        observacoes: ''
      };

      await employeeKnowledgeService.create(vinculoData);

      console.log('Vinculo salvo com sucesso!');
      alert('Conhecimento vinculado com sucesso!');

      setNewKnowledge({
        knowledge_id: '',
        status: 'DESEJADO',
        data_obtencao: '',
        data_alvo: '',
        anexo: null
      });

      if (onAddKnowledge) {
        onAddKnowledge();
      }

      onClose();

    } catch (error) {
      console.error('Erro ao salvar vinculo:', error);
      alert('Erro ao salvar vinculo: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !selectedEmployee) return null;

  const selectedKnowledgeItem = knowledge.find(k => k.id === parseInt(newKnowledge.knowledge_id));

  const getLabels = () => {
    if (!selectedKnowledgeItem) return { anexo: 'Anexar Evidencia', obtido: 'Obtido' };

    switch (selectedKnowledgeItem.tipo) {
      case 'CERTIFICACAO':
        return { anexo: 'Anexar Certificado', obtido: 'Certificado Obtido' };
      case 'CURSO':
        return { anexo: 'Anexar Certificado de Conclusao', obtido: 'Curso Concluido' };
      case 'GRADUACAO':
      case 'FORMACAO':
        return { anexo: 'Anexar Diploma', obtido: 'Formacao Concluida' };
      default:
        return { anexo: 'Anexar Evidencia', obtido: 'Obtido' };
    }
  };

  const labels = getLabels();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-ol-brand-500">
              Adicionar Conhecimento - {selectedEmployee.nome}
            </h3>
            <button
              onClick={onClose}
              className="text-ol-gray-400 hover:text-ol-gray-600"
              disabled={saving}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ol-brand-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Carregando conhecimentos...</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={loadKnowledge} className="text-red-600 hover:text-red-700 underline text-sm mt-1">
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                  Conhecimento *
                </label>
                <select
                  value={newKnowledge.knowledge_id}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, knowledge_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  disabled={saving}
                >
                  <option value="">Selecione um conhecimento</option>
                  {knowledge.map(kn => (
                    <option key={kn.id} value={kn.id}>
                      [{kn.tipo}] {kn.nome} - {kn.vendor || kn.area}
                    </option>
                  ))}
                </select>
              </div>

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
                  {selectedKnowledgeItem.validade_meses && (
                    <p className="text-xs text-ol-brand-600 mt-1">
                      Validade: {selectedKnowledgeItem.validade_meses} meses
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                  Status do Vinculo *
                </label>
                <select
                  value={newKnowledge.status}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  disabled={saving}
                >
                  <option value="DESEJADO">Desejado</option>
                  <option value="OBRIGATORIO">Obrigatorio</option>
                  <option value="OBTIDO">{labels.obtido}</option>
                </select>
              </div>

              {newKnowledge.status === 'OBTIDO' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                      Data de Obtencao *
                    </label>
                    <input
                      type="date"
                      value={newKnowledge.data_obtencao}
                      onChange={(e) => setNewKnowledge(prev => ({ ...prev, data_obtencao: e.target.value }))}
                      className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                      disabled={saving}
                    />
                  </div>

                  {selectedKnowledgeItem?.validade_meses && (
                    <div>
                      <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                        Data de Expiracao
                      </label>
                      <input
                        type="date"
                        value={newKnowledge.data_expiracao}
                        onChange={(e) => setNewKnowledge(prev => ({ ...prev, data_expiracao: e.target.value }))}
                        className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                        disabled={saving}
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
                      onChange={(e) => onFileUpload && onFileUpload(e, null, true)}
                      className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-ol-brand-100 file:text-ol-brand-700 hover:file:bg-ol-brand-200"
                      disabled={saving}
                    />
                    {newKnowledge.anexo && (
                      <p className="text-xs text-green-600 mt-1">
                        Arquivo anexado
                      </p>
                    )}
                  </div>
                </>
              )}

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
                    disabled={saving}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                  Prioridade
                </label>
                <select
                  value={newKnowledge.prioridade || 'MEDIA'}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, prioridade: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  disabled={saving}
                >
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-ol-gray-600 border border-ol-gray-300 rounded-md hover:bg-ol-gray-50"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              onClick={handleAddKnowledge}
              disabled={!newKnowledge.knowledge_id || saving || loading}
              className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                'Criar Vinculo'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddKnowledgeModal;
