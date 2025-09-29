import React, { useState, useEffect } from 'react';

const KnowledgeModal = ({ isOpen, onClose, onSave, knowledgeItem, loading = false }) => {
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    vendor: '',
    area: 'Segurança da Informação',
    tipo: 'CERTIFICACAO',
    link: '',
    descricao: '',
    validade_meses: '',
    nivel_formacao: 'GRADUACAO'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (knowledgeItem) {
      setFormData({
        nome: knowledgeItem.nome || '',
        codigo: knowledgeItem.codigo || '',
        vendor: knowledgeItem.vendor || knowledgeItem.fornecedor || '',
        area: knowledgeItem.area || knowledgeItem.categoria || 'Segurança da Informação',
        tipo: knowledgeItem.tipo || 'CERTIFICACAO',
        link: knowledgeItem.link || '',
        descricao: knowledgeItem.descricao || '',
        validade_meses: knowledgeItem.validade_meses || '',
        nivel_formacao: knowledgeItem.nivel_formacao || 'GRADUACAO'
      });
    } else {
      setFormData({
        nome: '',
        codigo: '',
        vendor: '',
        area: 'Segurança da Informação',
        tipo: 'CERTIFICACAO',
        link: '',
        descricao: '',
        validade_meses: '',
        nivel_formacao: 'GRADUACAO'
      });
    }
    setErrors({});
  }, [knowledgeItem, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.vendor.trim()) {
      const label = formData.tipo === 'CERTIFICACAO' ? 'Vendor' : 'Instituição';
      newErrors.vendor = `${label} é obrigatório`;
    }

    if (formData.tipo === 'CERTIFICACAO' && !formData.codigo.trim()) {
      newErrors.codigo = 'Código é obrigatório para certificações';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let dataToSave = {
      nome: formData.nome,
      tipo: formData.tipo,
      area: formData.area || 'Outros',
      vendor: formData.vendor,
      link: formData.link || '',
      descricao: formData.descricao || ''
    };

    if (formData.tipo === 'CERTIFICACAO') {
      dataToSave.codigo = formData.codigo;
      if (formData.validade_meses) {
        dataToSave.validade_meses = parseInt(formData.validade_meses);
      }
    }

    if (formData.tipo === 'FORMACAO') {
      dataToSave.nivel_formacao = formData.nivel_formacao;
    }

    console.log('🚀 Enviando conhecimento:', dataToSave);
    onSave(dataToSave);
  };

  const getVendorLabel = () => {
    switch (formData.tipo) {
      case 'CERTIFICACAO': return 'Vendor';
      case 'CURSO': return 'Plataforma/Instituição';
      case 'FORMACAO': return 'Instituição de Ensino';
      default: return 'Vendor';
    }
  };

  const getVendorPlaceholder = () => {
    switch (formData.tipo) {
      case 'CERTIFICACAO': return 'Ex: Fortinet, (ISC)², Microsoft';
      case 'CURSO': return 'Ex: Udemy, Alura, SANS';
      case 'FORMACAO': return 'Ex: USP, UNICAMP, FGV';
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-ol-brand-500">
              {knowledgeItem ? '✏️ Editar' : '➕ Adicionar'} {
                formData.tipo === 'CURSO' ? 'Curso' :
                formData.tipo === 'FORMACAO' ? 'Formação Acadêmica' : 'Certificação'
              }
            </h3>
            <button onClick={onClose} className="text-ol-gray-400 hover:text-ol-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-ol-gray-700 mb-1">Tipo *</label>
              <select
                required
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                disabled={loading}
              >
                <option value="CERTIFICACAO">🏆 Certificação</option>
                <option value="CURSO">📚 Curso</option>
                <option value="FORMACAO">🎓 Formação Acadêmica</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className={formData.tipo === 'CERTIFICACAO' ? '' : 'md:col-span-2'}>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 ${
                    errors.nome ? 'border-red-300' : 'border-ol-gray-300'
                  }`}
                  placeholder={
                    formData.tipo === 'CURSO' ? "Ex: Python para Cibersegurança" :
                    formData.tipo === 'FORMACAO' ? "Ex: Ciência da Computação" :
                    "Ex: NSE4 - Network Security Expert"
                  }
                  disabled={loading}
                />
                {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
              </div>

              {/* Código - SÓ CERTIFICAÇÃO */}
              {formData.tipo === 'CERTIFICACAO' && (
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Código *</label>
                  <input
                    type="text"
                    required
                    value={formData.codigo}
                    onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 ${
                      errors.codigo ? 'border-red-300' : 'border-ol-gray-300'
                    }`}
                    placeholder="Ex: NSE4, CISSP, CCNA"
                    disabled={loading}
                  />
                  {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>}
                </div>
              )}

              {/* Vendor/Instituição */}
              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                  {getVendorLabel()} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vendor}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 ${
                    errors.vendor ? 'border-red-300' : 'border-ol-gray-300'
                  }`}
                  placeholder={getVendorPlaceholder()}
                  disabled={loading}
                />
                {errors.vendor && <p className="text-red-500 text-xs mt-1">{errors.vendor}</p>}
              </div>

              {/* Área */}
              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Área *</label>
                <select
                  required
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  disabled={loading}
                >
                  <option value="Segurança da Informação">🔒 Segurança da Informação</option>
                  <option value="Desenvolvimento">💻 Desenvolvimento</option>
                  <option value="Infraestrutura">🏗️ Infraestrutura</option>
                  <option value="Cloud Computing">☁️ Cloud Computing</option>
                  <option value="Gestão">📊 Gestão</option>
                  <option value="Compliance">⚖️ Compliance</option>
                  <option value="Auditoria">🔍 Auditoria</option>
                  <option value="DevOps">🔄 DevOps</option>
                  <option value="Data Science">📈 Data Science</option>
                  <option value="Outros">🔧 Outros</option>
                </select>
              </div>

              {/* Validade - SÓ CERTIFICAÇÃO */}
              {formData.tipo === 'CERTIFICACAO' && (
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    Validade (meses)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.validade_meses}
                    onChange={(e) => setFormData(prev => ({ ...prev, validade_meses: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="Ex: 36 (deixe vazio se permanente)"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">Deixe vazio para certificações permanentes</p>
                </div>
              )}

              {/* Nível Formação - SÓ FORMAÇÃO */}
              {formData.tipo === 'FORMACAO' && (
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    Nível da Formação *
                  </label>
                  <select
                    required
                    value={formData.nivel_formacao}
                    onChange={(e) => setFormData(prev => ({ ...prev, nivel_formacao: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    disabled={loading}
                  >
                    <option value="GRADUACAO">🎓 Graduação</option>
                    <option value="TECNOLOGO">🔧 Tecnólogo</option>
                    <option value="POS_GRADUACAO">📚 Pós-Graduação</option>
                    <option value="ESPECIALIZACAO">🎯 Especialização</option>
                    <option value="MBA">💼 MBA</option>
                    <option value="MESTRADO">🔬 Mestrado</option>
                    <option value="DOUTORADO">👨‍🎓 Doutorado</option>
                  </select>
                </div>
              )}

              {/* Link */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Link/URL</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  placeholder="https://..."
                  disabled={loading}
                />
              </div>

              {/* Descrição */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  placeholder="Descrição detalhada..."
                  disabled={loading}
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-ol-gray-600 border border-ol-gray-300 rounded-md hover:bg-ol-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-ol-brand-600 text-white rounded-md hover:bg-ol-brand-700"
                disabled={loading}
              >
                {knowledgeItem ? 'Salvar Alterações' : `Adicionar ${
                  formData.tipo === 'CURSO' ? 'Curso' :
                  formData.tipo === 'FORMACAO' ? 'Formação' : 'Certificação'
                }`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeModal;
