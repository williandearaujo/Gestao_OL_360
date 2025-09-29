import React, { useState, useEffect } from 'react';
import { knowledgeService } from '../../services/knowledgeService';
import KnowledgeStats from './KnowledgeStats';
import KnowledgeFilters from './KnowledgeFilters';
import KnowledgeModal from './KnowledgeModal';

const KnowledgePage = ({ onBackToDashboard }) => {
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', tipo: '', area: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadKnowledge();
  }, []);

  const loadKnowledge = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await knowledgeService.getAll();
      setKnowledge(data);
    } catch (err) {
      console.error('Erro ao carregar conhecimentos:', err);
      setError('Erro ao carregar catálogo da API');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKnowledge = async (knowledgeData) => {
    try {
      await knowledgeService.create(knowledgeData);
      await loadKnowledge();
      setShowAddModal(false);
      alert('✅ Conhecimento adicionado ao catálogo!');
    } catch (err) {
      console.error('Erro ao adicionar conhecimento:', err);
      alert('❌ Erro ao adicionar conhecimento');
    }
  };

  const handleEditKnowledge = async (knowledgeData) => {
    try {
      await knowledgeService.update(editingItem.id, knowledgeData);
      await loadKnowledge();
      setEditingItem(null);
      alert('✅ Conhecimento atualizado!');
    } catch (err) {
      console.error('Erro ao atualizar conhecimento:', err);
      alert('❌ Erro ao atualizar conhecimento');
    }
  };

  const handleDeleteKnowledge = async (id) => {
    if (window.confirm('Tem certeza? Isso removerá todos os vínculos com funcionários.')) {
      try {
        await knowledgeService.delete(id);
        await loadKnowledge();
        alert('✅ Conhecimento removido do catálogo!');
      } catch (err) {
        console.error('Erro ao deletar conhecimento:', err);
        alert('❌ Erro ao deletar conhecimento');
      }
    }
  };

  const filteredKnowledge = knowledge.filter(item => {
    return (
      (!filters.search || item.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
       (item.codigo && item.codigo.toLowerCase().includes(filters.search.toLowerCase()))) &&
      (!filters.tipo || item.tipo === filters.tipo) &&
      (!filters.area || item.area === filters.area)
    );
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ol-brand-600 mx-auto mb-4"></div>
            <p className="text-ol-gray-600">Carregando catálogo de conhecimentos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-ol-brand-500">📚 Catálogo de Conhecimentos</h1>
          <p className="text-ol-gray-600 mt-1 text-sm sm:text-base">
            Pool de certificações, cursos e formações para vincular aos colaboradores
          </p>
          <div className="text-xs text-ol-gray-500 mt-1">
            ✅ API Integrada | Total: {knowledge.length} conhecimentos | Filtrados: {filteredKnowledge.length}
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-ol-brand-500 text-white rounded-lg hover:bg-ol-brand-600 transition-colors text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Adicionar ao Catálogo</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
            </svg>
            <span className="text-red-700">{error}</span>
            <button onClick={loadKnowledge} className="ml-4 text-red-600 hover:text-red-700 underline">
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <KnowledgeStats knowledge={knowledge} />

      {/* Filtros */}
      <KnowledgeFilters
        filters={filters}
        onFilterChange={(field, value) => setFilters({...filters, [field]: value})}
        clearFilters={() => setFilters({ search: '', tipo: '', area: '' })}
      />

      {/* Lista Inline (temporário) */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Catálogo de Conhecimentos</h3>
          <p className="text-sm text-gray-600">Conhecimentos disponíveis para vincular aos colaboradores</p>
        </div>

        {filteredKnowledge.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-ol-gray-900 mb-2">
              {knowledge.length === 0 ? 'Catálogo vazio' : 'Nenhum conhecimento encontrado'}
            </h3>
            <p className="text-ol-gray-500 mb-4">
              {knowledge.length === 0
                ? 'Comece adicionando certificações, cursos ou formações ao catálogo.'
                : 'Tente ajustar os filtros para encontrar conhecimentos.'}
            </p>
            {knowledge.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600"
              >
                ➕ Adicionar Primeiro Conhecimento
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredKnowledge.map((item) => (
              <div key={item.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">{item.nome}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${
                        item.tipo === 'CERTIFICACAO' ? 'bg-blue-100 text-blue-800' :
                        item.tipo === 'CURSO' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {item.tipo}
                      </span>
                      {item.codigo && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {item.codigo}
                        </span>
                      )}
                      {item.validade_meses && (
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                          ⏰ {item.validade_meses}m
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                      {item.vendor && <span>📍 {item.vendor}</span>}
                      <span>🏷️ {item.area}</span>
                      {item.nivel_formacao && <span>🎓 {item.nivel_formacao}</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600"
                        title="Abrir link"
                      >
                        🔗
                      </a>
                    )}
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteKnowledge(item.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <KnowledgeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddKnowledge}
        knowledgeItem={null}
      />

      <KnowledgeModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleEditKnowledge}
        knowledgeItem={editingItem}
      />
    </div>
  );
};

export default KnowledgePage;
