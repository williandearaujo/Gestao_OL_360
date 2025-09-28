import React, { useState, useEffect } from 'react';

const KnowledgeModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  knowledgeItem, 
  vendors = [], 
  areas = [] 
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    vendor: '',
    area: '',
    tipo: 'CERTIFICACAO',
    link: '',
    validade_meses: '',
    nivel_formacao: 'GRADUACAO'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (knowledgeItem) {
      setFormData({
        ...knowledgeItem,
        validade_meses: knowledgeItem.validade_meses || '',
        nivel_formacao: knowledgeItem.nivel_formacao || 'GRADUACAO'
      });
    } else {
      setFormData({
        nome: '',
        codigo: '',
        vendor: '',
        area: '',
        tipo: 'CERTIFICACAO',
        link: '',
        validade_meses: '',
        nivel_formacao: 'GRADUACAO'
      });
    }
    setErrors({});
  }, [knowledgeItem, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validações básicas
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.codigo.trim()) newErrors.codigo = 'Código é obrigatório';
    if (!formData.vendor.trim()) newErrors.vendor = 'Vendor/Instituição é obrigatório';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Preparar dados para salvar
    const dataToSave = {
      ...formData,
      validade_meses: (formData.tipo === 'CERTIFICACAO' && formData.validade_meses) 
        ? parseInt(formData.validade_meses) 
        : null
    };

    onSave(dataToSave);
  };

  const handleTipoChange = (novoTipo) => {
    setFormData(prev => ({
      ...prev,
      tipo: novoTipo,
      validade_meses: novoTipo === 'CERTIFICACAO' ? prev.validade_meses : '',
      nivel_formacao: novoTipo === 'FORMACAO' ? prev.nivel_formacao : 'GRADUACAO'
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-ol-brand-500">
              {knowledgeItem ? 'Editar' : 'Adicionar'} {
                formData.tipo === 'CURSO' ? 'Curso' :
                formData.tipo === 'FORMACAO' ? 'Formação' : 'Certificação'
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
                value={formData.tipo}
                onChange={(e) => handleTipoChange(e.target.value)}
                className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
              >
                <option value="CERTIFICACAO">Certificação</option>
                <option value="CURSO">Curso</option>
                <option value="FORMACAO">Formação Acadêmica</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                  Nome {
                    formData.tipo === 'CURSO' ? 'do Curso' :
                    formData.tipo === 'FORMACAO' ? 'da Formação' : 'da Certificação'
                  } *
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
                    "Ex: Certified Information Systems Security Professional"
                  }
                />
                {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
              </div>

              {/* Código */}
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
                  placeholder={
                    formData.tipo === 'CURSO' ? "Ex: PY-CYBER-001" :
                    formData.tipo === 'FORMACAO' ? "Ex: CC-GRAD-001" :
                    "Ex: CISSP-001"
                  }
                />
                {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>}
              </div>

              {/* Vendor/Instituição */}
              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                  {
                    formData.tipo === 'CURSO' ? 'Plataforma' :
                    formData.tipo === 'FORMACAO' ? 'Instituição' : 'Vendor'
                  } *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vendor}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 ${
                    errors.vendor ? 'border-red-300' : 'border-ol-gray-300'
                  }`}
                  placeholder={
                    formData.tipo === 'CURSO' ? "Ex: Udemy, SANS" :
                    formData.tipo === 'FORMACAO' ? "Ex: Universidade Federal, USP" :
                    "Ex: ISC2, Microsoft"
                  }
                />
                {errors.vendor && <p className="text-red-500 text-xs mt-1">{errors.vendor}</p>}
              </div>

              {/* Área */}
              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Área</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  placeholder="Ex: Cibersegurança, Programação"
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Link</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  placeholder="https://..."
                />
              </div>

              {/* Nível de Formação (só para FORMACAO) */}
              {formData.tipo === 'FORMACAO' && (
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Nível da Formação *</label>
                  <select
                    required
                    value={formData.nivel_formacao}
                    onChange={(e) => setFormData(prev => ({ ...prev, nivel_formacao: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  >
                    <option value="GRADUACAO">Graduação</option>
                    <option value="TECNOLOGO">Tecnólogo</option>
                    <option value="POS_GRADUACAO">Pós-Graduação</option>
                    <option value="MESTRADO">Mestrado</option>
                    <option value="DOUTORADO">Doutorado</option>
                    <option value="MBA">MBA</option>
                  </select>
                </div>
              )}

              {/* Validade (só para CERTIFICACAO) */}
              {formData.tipo === 'CERTIFICACAO' && (
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    Validade (meses)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.validade_meses}
                    onChange={(e) => setFormData(prev => ({ ...prev, validade_meses: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="Ex: 36 (deixe vazio para certificação permanente)"
                  />
                  <p className="text-xs text-ol-gray-500 mt-1">
                    Deixe vazio para certificações permanentes
                  </p>
                </div>
              )}
            </div>

            {/* Avisos informativos */}
            {formData.tipo === 'CURSO' && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-700">
                    💡 Cursos geram certificados permanentes (não expiram)
                  </p>
                </div>
              </div>
            )}

            {formData.tipo === 'FORMACAO' && (
              <div className="bg-ol-gray-100 p-3 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-ol-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-sm text-ol-gray-700">
                    🎓 Formações acadêmicas são diplomas permanentes
                  </p>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-ol-gray-600 border border-ol-gray-300 rounded-md hover:bg-ol-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded-md ${
                  formData.tipo === 'CURSO' 
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : formData.tipo === 'FORMACAO'
                      ? 'bg-ol-gray-700 hover:bg-ol-gray-800'
                      : 'bg-ol-brand-600 hover:bg-ol-brand-700'
                }`}
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
