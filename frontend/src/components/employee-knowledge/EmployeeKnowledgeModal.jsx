import React, { useState, useEffect } from 'react';
import { X, Save, Users, BookOpen, Calendar, AlertCircle, Upload, FileText } from 'lucide-react';

const EmployeeKnowledgeModal = ({
  isOpen,
  onClose,
  editingLink,
  employees = [],
  knowledge = [],
  onSave,
  preSelectedEmployee = null
}) => {
  // Estados do formulário
  const [formData, setFormData] = useState({
    employee_id: '',
    learning_item_id: '',
    status: 'DESEJADO',
    data_alvo: '',
    data_obtencao: '',
    prioridade: 'MEDIA',
    observacoes: '',
    anexo: null // ✅ NOVO CAMPO PARA ANEXO
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ PREENCHER FORM
  useEffect(() => {
    console.log('🔍 EmployeeKnowledgeModal - useEffect executado');
    console.log('🔍 editingLink:', editingLink);
    console.log('🔍 preSelectedEmployee:', preSelectedEmployee);

    if (editingLink) {
      console.log('🔍 Editando vínculo:', editingLink);
      setFormData({
        employee_id: editingLink.employee_id || '',
        learning_item_id: editingLink.learning_item_id || '',
        status: editingLink.status || 'DESEJADO',
        data_alvo: editingLink.data_alvo ? editingLink.data_alvo.split('T')[0] : '',
        data_obtencao: editingLink.data_obtencao ? editingLink.data_obtencao.split('T')[0] : '',
        prioridade: editingLink.prioridade || 'MEDIA',
        observacoes: editingLink.observacoes || '',
        anexo: editingLink.anexo || null
      });
    } else if (preSelectedEmployee) {
      console.log('🔍 Novo vínculo para colaborador:', preSelectedEmployee.nome);
      setFormData({
        employee_id: preSelectedEmployee.id.toString(),
        learning_item_id: '',
        status: 'DESEJADO',
        data_alvo: '',
        data_obtencao: '',
        prioridade: 'MEDIA',
        observacoes: '',
        anexo: null
      });
    } else {
      console.log('🔍 Novo vínculo - sem pré-seleção');
      setFormData({
        employee_id: '',
        learning_item_id: '',
        status: 'DESEJADO',
        data_alvo: '',
        data_obtencao: '',
        prioridade: 'MEDIA',
        observacoes: '',
        anexo: null
      });
    }
    setErrors({});
  }, [editingLink, preSelectedEmployee, isOpen]);

  if (!isOpen) return null;

  // ✅ VALIDAÇÃO
  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_id) {
      newErrors.employee_id = 'Selecione um colaborador';
    }

    if (!formData.learning_item_id) {
      newErrors.learning_item_id = 'Selecione um conhecimento';
    }

    // ✅ VALIDAÇÃO PARA STATUS OBTIDO
    if (formData.status === 'OBTIDO' && !formData.data_obtencao) {
      newErrors.data_obtencao = 'Data de obtenção é obrigatória quando o status é "Obtido"';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🔍 Submetendo formulário:', formData);

    if (!validateForm()) {
      console.log('❌ Formulário inválido:', errors);
      return;
    }

    try {
      setLoading(true);

      const API_BASE_URL = 'http://localhost:8000';
      const url = editingLink
        ? `${API_BASE_URL}/employee-knowledge/${editingLink.id}`
        : `${API_BASE_URL}/employee-knowledge`;

      const method = editingLink ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Vínculo salvo:', result);

      alert(editingLink ? 'Vínculo atualizado com sucesso!' : 'Vínculo criado com sucesso!');

      if (onSave) {
        onSave();
      }

    } catch (error) {
      console.error('❌ Erro ao salvar vínculo:', error);
      alert('Erro ao salvar vínculo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MUDANÇAS NO FORM
  const handleChange = (field, value) => {
    console.log('🔍 Mudança no campo:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // ✅ UPLOAD DE ARQUIVO
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('📎 Arquivo selecionado:', file.name);
      setFormData(prev => ({
        ...prev,
        anexo: file
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* ✅ HEADER */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">
                {editingLink ? '✏️ Editar Vínculo' : '🔗 Novo Vínculo'}
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                {preSelectedEmployee
                  ? `Conectar ${preSelectedEmployee.nome} com conhecimentos`
                  : 'Conectar colaboradores com conhecimentos'
                }
              </p>
            </div>
            <button
              onClick={() => {
                console.log('🔍 Fechando modal');
                onClose();
              }}
              className="text-white hover:bg-blue-700 p-2 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ✅ FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colaborador */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 mr-1" />
                Colaborador *
                {preSelectedEmployee && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    Pré-selecionado
                  </span>
                )}
              </label>
              <select
                value={formData.employee_id}
                onChange={(e) => handleChange('employee_id', e.target.value)}
                disabled={!!preSelectedEmployee}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.employee_id ? 'border-red-500' : 'border-gray-300'
                } ${preSelectedEmployee ? 'bg-blue-50 text-blue-900' : ''}`}
              >
                <option value="">Selecione um colaborador</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nome} - {emp.cargo}
                  </option>
                ))}
              </select>
              {errors.employee_id && (
                <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>
              )}
            </div>

            {/* Conhecimento */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 mr-1" />
                Conhecimento *
              </label>
              <select
                value={formData.learning_item_id}
                onChange={(e) => handleChange('learning_item_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.learning_item_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione um conhecimento</option>
                {knowledge.map(k => (
                  <option key={k.id} value={k.id}>
                    {k.nome} - {k.tipo}
                  </option>
                ))}
              </select>
              {errors.learning_item_id && (
                <p className="text-red-500 text-xs mt-1">{errors.learning_item_id}</p>
              )}
            </div>
          </div>

          {/* ✅ GRID DINÂMICO BASEADO NO STATUS */}
          <div className={`grid grid-cols-1 ${formData.status === 'OBTIDO' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DESEJADO">🎯 Desejado</option>
                <option value="OBRIGATORIO">🚨 Obrigatório</option>
                <option value="OBTIDO">✅ Obtido</option>
              </select>
            </div>

            {/* ✅ PRIORIDADE - SÓ MOSTRA SE NÃO FOR OBTIDO */}
            {formData.status !== 'OBTIDO' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                <select
                  value={formData.prioridade}
                  onChange={(e) => handleChange('prioridade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BAIXA">🟢 Baixa</option>
                  <option value="MEDIA">🟡 Média</option>
                  <option value="ALTA">🔴 Alta</option>
                </select>
              </div>
            )}

            {/* Data Alvo - sempre mostra */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                Data Alvo
              </label>
              <input
                type="date"
                value={formData.data_alvo}
                onChange={(e) => handleChange('data_alvo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ✅ SEÇÃO OBTIDO - SÓ MOSTRA SE STATUS FOR OBTIDO */}
          {formData.status === 'OBTIDO' && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                ✅ Conhecimento Obtido - Documentação
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data de Obtenção */}
                <div>
                  <label className="flex items-center text-sm font-medium text-green-700 mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    Data de Obtenção *
                  </label>
                  <input
                    type="date"
                    value={formData.data_obtencao}
                    onChange={(e) => handleChange('data_obtencao', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.data_obtencao ? 'border-red-500' : 'border-green-300'
                    }`}
                  />
                  {errors.data_obtencao && (
                    <p className="text-red-500 text-xs mt-1">{errors.data_obtencao}</p>
                  )}
                </div>

                {/* ✅ CAMPO ANEXO - SÓ APARECE QUANDO OBTIDO */}
                <div>
                  <label className="flex items-center text-sm font-medium text-green-700 mb-2">
                    <FileText className="w-4 h-4 mr-1" />
                    Anexar Certificado/Comprovante
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                    />
                    <div className="mt-1 text-xs text-green-600">
                      Formatos aceitos: PDF, JPG, PNG, DOC, DOCX (máx. 10MB)
                    </div>
                  </div>

                  {formData.anexo && (
                    <div className="mt-2 p-2 bg-green-100 rounded flex items-center text-sm text-green-800">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>📎 {formData.anexo.name || 'Arquivo anexado'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              placeholder="Observações adicionais sobre este vínculo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* ✅ BOTÕES */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Salvando...' : (editingLink ? 'Atualizar' : 'Criar Vínculo')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeKnowledgeModal;
