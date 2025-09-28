import React, { useState } from 'react';
import KnowledgeGrid from './KnowledgeGrid';
import KnowledgeFilters from './KnowledgeFilters';
import KnowledgeStats from './KnowledgeStats';
import KnowledgeModal from './KnowledgeModal';
import { knowledgeCatalog, vendors, areas } from './mockKnowledgeData';

function KnowledgePage({ employees, employeeKnowledge, setEmployeeKnowledge, onBackToDashboard }) {
  const [catalog, setCatalog] = useState(knowledgeCatalog);
  const [filters, setFilters] = useState({ search: "", vendor: "", area: "", tipo: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const filtered = catalog.filter(k =>
    (!filters.search || k.nome.toLowerCase().includes(filters.search.toLowerCase())) &&
    (!filters.vendor || k.vendor === filters.vendor) &&
    (!filters.area || k.area === filters.area) &&
    (!filters.tipo || k.tipo === filters.tipo)
  );

  const handleEdit = (item) => {
    setItemToEdit(item);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setItemToEdit(null);
    setModalOpen(true);
  };

  const handleSave = (item) => {
    setCatalog(prev => {
      if (item.id && prev.find(k => k.id === item.id)) {
        return prev.map(k => k.id === item.id ? item : k);
      } else {
        const newId = Math.max(0, ...prev.map(k => k.id || 0)) + 1;
        return [...prev, { ...item, id: newId }];
      }
    });
    setModalOpen(false);
    setItemToEdit(null);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Tem certeza que deseja remover este item do catálogo? Todos os vínculos com colaboradores serão removidos também.')) {
      setCatalog(prev => prev.filter(k => k.id !== itemId));
      // Remove vínculos relacionados
      if (setEmployeeKnowledge) {
        setEmployeeKnowledge(prev => prev.filter(link => link.learning_item_id !== itemId));
      }
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Header com botões */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-ol-brand-500">Catálogo de Conhecimentos</h1>
          <p className="text-ol-gray-600 mt-1 text-sm sm:text-base">
            Gestão completa de certificações, cursos, graduações e treinamentos
          </p>
          <div className="text-xs text-ol-gray-500 mt-1">
            Total no catálogo: {catalog.length} itens • Filtrados: {filtered.length}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="flex items-center justify-center space-x-2 px-4 py-2 text-ol-gray-600 border border-ol-gray-300 rounded-lg hover:bg-ol-gray-50 transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Voltar ao Dashboard</span>
            </button>
          )}
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-ol-brand-500 text-white rounded-lg hover:bg-ol-brand-600 transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Adicionar Conhecimento</span>
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <KnowledgeStats 
        knowledge={catalog} 
        employeeKnowledge={employeeKnowledge} 
        employees={employees} 
      />

      {/* Filtros */}
      <KnowledgeFilters 
        filters={filters} 
        onFilterChange={(field, value) => setFilters({ ...filters, [field]: value })} 
        vendors={vendors} 
        areas={areas} 
        clearFilters={() => setFilters({ search: "", vendor: "", area: "", tipo: "" })} 
        totalItems={catalog.length}
        filteredCount={filtered.length}
      />

      {/* Grid de conhecimentos */}
      <KnowledgeGrid 
        knowledge={filtered}
        onEditKnowledge={handleEdit}
        onDeleteKnowledge={handleDelete}
        employees={employees}
        employeeKnowledge={employeeKnowledge}
      />

      {/* Estados vazios... */}
      {filtered.length === 0 && catalog.length > 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <svg className="w-16 h-16 mx-auto text-ol-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="text-lg font-medium text-ol-gray-900 mb-2">Nenhum conhecimento encontrado</h3>
          <p className="text-ol-gray-500 mb-4">Tente ajustar os filtros para encontrar o que procura.</p>
          <button
            onClick={() => setFilters({ search: "", vendor: "", area: "", tipo: "" })}
            className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600"
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {catalog.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <svg className="w-16 h-16 mx-auto text-ol-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-medium text-ol-gray-900 mb-2">Catálogo vazio</h3>
          <p className="text-ol-gray-500 mb-4">Comece adicionando certificações, cursos ou outras formações ao catálogo.</p>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600"
          >
            Adicionar Primeiro Item
          </button>
        </div>
      )}

      {/* Modal para adicionar/editar */}
      <KnowledgeModal 
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setItemToEdit(null);
        }}
        onSave={handleSave}
        knowledgeItem={itemToEdit}
        vendors={vendors}
        areas={areas}
      />
    </div>
  );
}

export default KnowledgePage;
