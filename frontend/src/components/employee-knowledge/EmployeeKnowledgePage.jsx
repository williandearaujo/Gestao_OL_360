import React, { useState, useEffect } from 'react';
import { employeeKnowledgeService } from '../../services/employeeKnowledgeService';
import EmployeeKnowledgeModal from './EmployeeKnowledgeModal';

const EmployeeKnowledgePage = ({ onBackToDashboard }) => {
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    employee_id: '',
    knowledge_id: '',
    status: ''
  });

  // 🎯 ESTADOS DO MODAL
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📊 Carregando dados employee-knowledge...');

      // Carregar vínculos e stats em paralelo
      const [linksData, statsData] = await Promise.all([
        employeeKnowledgeService.getAll(filters),
        employeeKnowledgeService.getStats()
      ]);

      console.log('✅ Vínculos carregados:', linksData.length);
      console.log('✅ Stats carregadas:', statsData);

      setLinks(linksData);
      setStats(statsData);
    } catch (err) {
      console.error('❌ Erro ao carregar dados:', err);
      setError('Erro ao carregar dados da API');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);

    console.log('🔍 Filtros alterados:', newFilters);
    // Recarregar dados com novos filtros
    loadData();
  };

  const clearFilters = () => {
    setFilters({ employee_id: '', knowledge_id: '', status: '' });
    loadData();
  };

  // 🎯 FUNÇÃO PARA ABRIR MODAL
  const handleAddLink = () => {
    setEditingLink(null);
    setShowModal(true);
  };

  // 🎯 FUNÇÃO PARA EDITAR VÍNCULO
  const handleEditLink = (link) => {
    setEditingLink(link);
    setShowModal(true);
  };

  // 🎯 FUNÇÃO PARA DELETAR VÍNCULO
  const handleDeleteLink = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este vínculo?')) {
      try {
        await employeeKnowledgeService.delete(id);
        console.log('✅ Vínculo removido!');
        await loadData(); // Recarregar dados
      } catch (error) {
        console.error('❌ Erro ao deletar vínculo:', error);
        alert('Erro ao deletar vínculo');
      }
    }
  };

  // 🎯 FUNÇÃO PARA FECHAR MODAL
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLink(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ol-brand-600 mx-auto mb-4"></div>
            <p className="text-ol-gray-600">Carregando vínculos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Header com botão voltar */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBackToDashboard}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-ol-brand-500">
            🔗 Vínculos Colaborador ↔ Conhecimento
          </h1>
          <p className="text-ol-gray-600 mt-1 text-sm sm:text-base">
            Gerencie certificações, cursos e formações dos colaboradores
          </p>
          <div className="text-xs text-ol-gray-500 mt-1">
            ✅ API Integrada | Total: {links.length} vínculos
          </div>
        </div>
        <button
          onClick={handleAddLink}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-ol-brand-500 text-white rounded-lg hover:bg-ol-brand-600 transition-colors text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Vincular Conhecimento</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
            </svg>
            <span className="text-red-700">{error}</span>
            <button onClick={loadData} className="ml-4 text-red-600 hover:text-red-700 underline">
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vínculos</p>
                <p className="text-2xl font-semibold text-gray-600">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Obtidos</p>
                <p className="text-2xl font-semibold text-green-600">{stats.por_status.obtidos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Obrigatórios</p>
                <p className="text-2xl font-semibold text-red-600">{stats.por_status.obrigatorios}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Desejados</p>
                <p className="text-2xl font-semibold text-blue-600">{stats.por_status.desejados}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Vínculos */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Vínculos Ativos</h3>
          <p className="text-sm text-gray-600">Certificações, cursos e formações vinculadas aos colaboradores</p>
        </div>

        {links.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-ol-gray-900 mb-2">Nenhum vínculo encontrado</h3>
            <p className="text-ol-gray-500 mb-4">
              Comece criando vínculos entre colaboradores e conhecimentos.
            </p>
            <button
              onClick={handleAddLink}
              className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600"
            >
              ➕ Criar Primeiro Vínculo
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {links.map((link) => (
              <div key={link.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {link.employee?.nome} ↔ {link.knowledge?.nome}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded ${
                        link.status === 'OBTIDO' ? 'bg-green-100 text-green-800' :
                        link.status === 'OBRIGATORIO' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {link.status}
                      </span>
                      {link.prioridade === 'ALTA' && (
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                          🔥 ALTA
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                      <span>👤 {link.employee?.cargo}</span>
                      <span>📚 {link.knowledge?.tipo}</span>
                      {link.data_alvo && <span>🎯 Meta: {new Date(link.data_alvo).toLocaleDateString('pt-BR')}</span>}
                      {link.data_obtencao && <span>✅ Obtido: {new Date(link.data_obtencao).toLocaleDateString('pt-BR')}</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditLink(link)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
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

      {/* 🎯 MODAL */}
      <EmployeeKnowledgeModal
        isOpen={showModal || !!editingLink}
        onClose={handleCloseModal}
        onSave={loadData}
        linkItem={editingLink}
      />
    </div>
  );
};

export default EmployeeKnowledgePage;
