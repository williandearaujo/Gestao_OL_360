import React, { useState } from 'react';

const AddKnowledgeCatalogModal = ({ 
  isOpen, 
  onClose, 
  onAddKnowledge 
}) => {
  const [newKnowledge, setNewKnowledge] = useState({
    nome: '',
    codigo: '',
    vendor: '',
    tipo: 'CERTIFICACAO',
    area: 'Segurança da Informação',
    nivel: 'INTERMEDIARIO',
    modalidade: 'ONLINE',
    validade_meses: '',
    preco: '',
    url: '',
    descricao: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddKnowledge(newKnowledge);
    setNewKnowledge({
      nome: '', codigo: '', vendor: '', tipo: 'CERTIFICACAO', area: 'Segurança da Informação',
      nivel: 'INTERMEDIARIO', modalidade: 'ONLINE', validade_meses: '', preco: '', url: '', descricao: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-ol-brand-500">Adicionar ao Catálogo de Conhecimentos</h3>
            <button onClick={onClose} className="text-ol-gray-400 hover:text-ol-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={newKnowledge.nome}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  placeholder="Ex: CISSP - Certified Information Systems Security Professional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Código</label>
                <input
                  type="text"
                  value={newKnowledge.codigo}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, codigo: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  placeholder="Ex: CISSP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Vendor/Instituição *</label>
                <input
                  type="text"
                  required
                  value={newKnowledge.vendor}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, vendor: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  placeholder="Ex: (ISC)², Microsoft, AWS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Tipo *</label>
                <select
                  required
                  value={newKnowledge.tipo}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, tipo: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                >
                  <option value="CERTIFICACAO">Certificação</option>
                  <option value="CURSO">Curso</option>
                  <option value="GRADUACAO">Graduação</option>
                  <option value="ESPECIALIZACAO">Especialização</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="TREINAMENTO">Treinamento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Área *</label>
                <select
                  required
                  value={newKnowledge.area}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                >
                  <option value="Segurança da Informação">Segurança da Informação</option>
                  <option value="Desenvolvimento">Desenvolvimento</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                  <option value="Gestão">Gestão</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Auditoria">Auditoria</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Nível</label>
                <select
                  value={newKnowledge.nivel}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, nivel: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                >
                  <option value="BASICO">Básico</option>
                  <option value="INTERMEDIARIO">Intermediário</option>
                  <option value="AVANCADO">Avançado</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Modalidade</label>
                <select
                  value={newKnowledge.modalidade}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, modalidade: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                >
                  <option value="ONLINE">Online</option>
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="HIBRIDO">Híbrido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Validade (meses)</label>
                <input
                  type="number"
                  value={newKnowledge.validade_meses}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, validade_meses: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  placeholder="Ex: 36"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newKnowledge.preco}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, preco: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  placeholder="Ex: 1500.00"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">URL/Link</label>
                <input
                  type="url"
                  value={newKnowledge.url}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  placeholder="https://..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-ol-gray-700 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={newKnowledge.descricao}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, descricao: e.target.value }))}
                  className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  placeholder="Descrição detalhada do conhecimento..."
                />
              </div>
            </div>

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
                className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600"
              >
                Adicionar ao Catálogo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddKnowledgeCatalogModal;
