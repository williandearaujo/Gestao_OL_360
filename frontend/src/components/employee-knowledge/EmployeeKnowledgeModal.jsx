import React, { useState, useEffect } from 'react';
import { employeeKnowledgeService } from '../../services/employeeKnowledgeService';
import { knowledgeService } from '../../services/knowledgeService';

const EmployeeKnowledgeModal = ({
  isOpen,
  onClose,
  onSave,
  linkItem = null, // Para editar vínculos existentes
  preSelectedEmployee = null,
  preSelectedKnowledge = null
}) => {
  // Estados do formulário
  const [formData, setFormData] = useState({
    employee_id: '',
    learning_item_id: '',
    status: 'DESEJADO',
    prioridade: 'MEDIA',
    data_alvo: '',
    data_obtencao: '',
    data_expiracao: '',
    observacoes: '',
    anexo_path: ''
  });

  // Estados para dropdowns
  const [employees, setEmployees] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Carregar dados quando modal abre
  useEffect(() => {
    if (isOpen) {
      loadDropdownData();

      // Se está editando um vínculo existente
      if (linkItem) {
        setFormData({
          employee_id: linkItem.employee_id || '',
          learning_item_id: linkItem.knowledge_id || linkItem.learning_item_id || '',
          status: linkItem.status || 'DESEJADO',
          prioridade: linkItem.prioridade || 'MEDIA',
          data_alvo: formatDateForInput(linkItem.data_alvo),
          data_obtencao: formatDateForInput(linkItem.data_obtencao),
          data_expiracao: formatDateForInput(linkItem.data_expiracao),
          observacoes: linkItem.observacoes || '',
          anexo_path: linkItem.anexo_path || ''
        });
      } else {
        // Novo vínculo
        setFormData({
          employee_id: preSelectedEmployee || '',
          learning_item_id: preSelectedKnowledge || '',
          status: 'DESEJADO',
          prioridade: 'MEDIA',
          data_alvo: '',
          data_obtencao: '',
          data_expiracao: '',
          observacoes: '',
          anexo_path: ''
        });
      }
    }
  }, [isOpen, linkItem, preSelectedEmployee, preSelectedKnowledge]);

  const loadDropdownData = async () => {
    try {
      setLoading(true);
      console.log('📊 Carregando dados para dropdowns...');

      const [employeesData, knowledgeData] = await Promise.all([
        fetch('http://localhost:8000/employees').then(r => r.json()),
        knowledgeService.getAll()
      ]);

      console.log('✅ Colaboradores carregados:', employeesData.length);
      console.log('✅ Conhecimentos carregados:', knowledgeData.length);

      setEmployees(employeesData || []);
      setKnowledge(knowledgeData || []);
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo alterado
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    // Lógica especial para mudança de status
    if (field === 'status') {
      handleStatusChange(value);
    }
  };

  const handleStatusChange = (newStatus) => {
    console.log('🔄 Status alterado para:', newStatus);

    // Limpar datas ao mudar status
    setFormData(prev => ({
      ...prev,
      status: newStatus,
      data_alvo: newStatus === 'OBTIDO' ? '' : prev.data_alvo,
      data_obtencao: newStatus !== 'OBTIDO' ? '' : prev.data_obtencao,
      data_expiracao: newStatus !== 'OBTIDO' ? '' : prev.data_expiracao,
      anexo_path: newStatus !== 'OBTIDO' ? '' : prev.anexo_path
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_id) {
      newErrors.employee_id = 'Colaborador é obrigatório';
    }
    if (!formData.learning_item_id) {
      newErrors.learning_item_id = 'Conhecimento é obrigatório';
    }
    if (!formData.status) {
      newErrors.status = 'Status é obrigatório';
    }

    // Validações específicas por status
    if (formData.status === 'DESEJADO' || formData.status === 'OBRIGATORIO') {
      if (!formData.data_alvo) {
        newErrors.data_alvo = 'Data alvo é obrigatória para este status';
      }
    }

    if (formData.status === 'OBTIDO') {
      if (!formData.data_obtencao) {
        newErrors.data_obtencao = 'Data de obtenção é obrigatória para status "Obtido"';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('❌ Formulário inválido:', errors);
      return;
    }

    try {
      setSaving(true);
      console.log('💾 Salvando vínculo:', formData);

      const dataToSave = {
        ...formData,
        // Garantir que learning_item_id seja usado no backend
        learning_item_id: formData.learning_item_id
      };

      if (linkItem) {
        // Editando vínculo existente
        await employeeKnowledgeService.update(linkItem.id, dataToSave);
        console.log('✅ Vínculo atualizado!');
      } else {
        // Criando novo vínculo
        await employeeKnowledgeService.create(dataToSave);
        console.log('✅ Vínculo criado!');
      }

      // Recarregar dados da página principal
      onSave();
      onClose();

      // Resetar formulário
      setFormData({
        employee_id: '',
        learning_item_id: '',
        status: 'DESEJADO',
        prioridade: 'MEDIA',
        data_alvo: '',
        data_obtencao: '',
        data_expiracao: '',
        observacoes: '',
        anexo_path: ''
      });

    } catch (error) {
      console.error('❌ Erro ao salvar vínculo:', error);

      // Tratar erro de duplicata
      if (error.message && error.message.includes('já existe')) {
        setErrors({ general: 'Este colaborador já possui vínculo com este conhecimento' });
      } else {
        setErrors({ general: 'Erro ao salvar vínculo. Tente novamente.' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simular upload (em produção seria para S3/servidor)
      const fileName = `cert_${formData.employee_id}_${formData.learning_item_id}_${Date.now()}.pdf`;
      console.log('📎 Arquivo selecionado:', file.name);
      handleChange('anexo_path', fileName);
    }
  };

  const getSelectedKnowledge = () => {
    return knowledge.find(k => k.id == formData.learning_item_id);
  };

  // Auto-calcular data de expiração baseada na validade
  useEffect(() => {
    if (formData.status === 'OBTIDO' && formData.data_obtencao && formData.learning_item_id) {
      const selectedKnowledge = getSelectedKnowledge();
      if (selectedKnowledge && selectedKnowledge.validade_meses) {
        const obtentionDate = new Date(formData.data_obtencao);
        obtentionDate.setMonth(obtentionDate.getMonth() + selectedKnowledge.validade_meses);
        const expirationDate = obtentionDate.toISOString().split('T')[0];

        setFormData(prev => ({
          ...prev,
          data_expiracao: expirationDate
        }));

        console.log('📅 Data de expiração calculada:', expirationDate);
      }
    }
  }, [formData.data_obtencao, formData.learning_item_id, formData.status, knowledge]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-ol-brand-500">
              {linkItem ? '✏️ Editar Vínculo' : '🔗 Novo Vínculo'} Colaborador ↔ Conhecimento
            </h3>
            <button
              onClick={onClose}
              className="text-ol-gray-400 hover:text-ol-gray-600"
              disabled={saving}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ol-brand-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Carregando dados...</p>
            </div>
          )}

          {/* Erro geral */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          {/* Formulário */}
          {!loading && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Colaborador */}
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    Colaborador *
                  </label>
                  <select
                    required
                    value={formData.employee_id}
                    onChange={(e) => handleChange('employee_id', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 ${
                      errors.employee_id ? 'border-red-300' : 'border-ol-gray-300'
                    }`}
                    disabled={saving}
                  >
                    <option value="">Selecione um colaborador</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.nome} - {emp.cargo}
                      </option>
                    ))}
                  </select>
                  {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>}
                </div>

                {/* Conhecimento */}
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    Conhecimento *
                  </label>
                  <select
                    required
                    value={formData.learning_item_id}
                    onChange={(e) => handleChange('learning_item_id', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 ${
                      errors.learning_item_id ? 'border-red-300' : 'border-ol-gray-300'
                    }`}
                    disabled={saving}
                  >
                    <option value="">Selecione um conhecimento</option>
                    {knowledge.map(know => (
                      <option key={know.id} value={know.id}>
                        {know.nome} ({know.tipo}) - {know.vendor || know.area}
                      </option>
                    ))}
                  </select>
                  {errors.learning_item_id && <p className="text-red-500 text-xs mt-1">{errors.learning_item_id}</p>}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    disabled={saving}
                  >
                    <option value="DESEJADO">💙 Desejado</option>
                    <option value="OBRIGATORIO">🔴 Obrigatório</option>
                    <option value="OBTIDO">✅ Obtido</option>
                  </select>
                </div>

                {/* Prioridade */}
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={formData.prioridade}
                    onChange={(e) => handleChange('prioridade', e.target.value)}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    disabled={saving}
                  >
                    <option value="BAIXA">🟢 Baixa</option>
                    <option value="MEDIA">🟡 Média</option>
                    <option value="ALTA">🔴 Alta</option>
                  </select>
                </div>

                {/* Data Alvo (DESEJADO/OBRIGATÓRIO) */}
                {(formData.status === 'DESEJADO' || formData.status === 'OBRIGATORIO') && (
                  <div>
                    <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                      Data Alvo *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.data_alvo}
                      onChange={(e) => handleChange('data_alvo', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 ${
                        errors.data_alvo ? 'border-red-300' : 'border-ol-gray-300'
                      }`}
                      disabled={saving}
                    />
                    {errors.data_alvo && <p className="text-red-500 text-xs mt-1">{errors.data_alvo}</p>}
                  </div>
                )}

                {/* Data de Obtenção (OBTIDO) */}
                {formData.status === 'OBTIDO' && (
                  <div>
                    <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                      Data de Obtenção *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.data_obtencao}
                      onChange={(e) => handleChange('data_obtencao', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 ${
                        errors.data_obtencao ? 'border-red-300' : 'border-ol-gray-300'
                      }`}
                      disabled={saving}
                    />
                    {errors.data_obtencao && <p className="text-red-500 text-xs mt-1">{errors.data_obtencao}</p>}
                  </div>
                )}

                {/* Data de Expiração (OBTIDO) */}
                {formData.status === 'OBTIDO' && (
                  <div>
                    <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                      Data de Expiração
                    </label>
                    <input
                      type="date"
                      value={formData.data_expiracao}
                      onChange={(e) => handleChange('data_expiracao', e.target.value)}
                      className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                      disabled={saving}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {getSelectedKnowledge()?.validade_meses ?
                        `Calculada automaticamente (${getSelectedKnowledge().validade_meses} meses)` :
                        'Deixe vazio se não expira'
                      }
                    </p>
                  </div>
                )}

                {/* Upload Certificado (OBTIDO) */}
                {formData.status === 'OBTIDO' && (
                  <div>
                    <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                      Certificado
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                      disabled={saving}
                    />
                    {formData.anexo_path && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Arquivo: {formData.anexo_path}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  rows={3}
                  value={formData.observacoes}
                  onChange={(e) => handleChange('observacoes', e.target.value)}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  placeholder="Observações adicionais..."
                  disabled={saving}
                />
              </div>

              {/* Info Card baseado no status */}
              <div className="p-4 rounded-lg border">
                {formData.status === 'DESEJADO' && (
                  <div className="bg-blue-50 border-blue-200">
                    <p className="text-sm text-blue-700">
                      💙 <strong>Desejado:</strong> Conhecimento de interesse do colaborador para desenvolvimento profissional.
                    </p>
                  </div>
                )}
                {formData.status === 'OBRIGATORIO' && (
                  <div className="bg-red-50 border-red-200">
                    <p className="text-sm text-red-700">
                      🔴 <strong>Obrigatório:</strong> Conhecimento necessário para a função, com prazo definido.
                    </p>
                  </div>
                )}
                {formData.status === 'OBTIDO' && (
                  <div className="bg-green-50 border-green-200">
                    <p className="text-sm text-green-700">
                      ✅ <strong>Obtido:</strong> Conhecimento já adquirido pelo colaborador. Anexe o certificado se disponível.
                    </p>
                  </div>
                )}
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-ol-gray-600 border border-ol-gray-300 rounded-md hover:bg-ol-gray-50"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ol-brand-600 text-white rounded-md hover:bg-ol-brand-700 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </div>
                  ) : (
                    linkItem ? 'Salvar Alterações' : 'Criar Vínculo'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeKnowledgeModal;
