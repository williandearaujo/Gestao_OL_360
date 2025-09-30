import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Plus, Award, TrendingUp, Users, Link, ExternalLink, Edit, Trash2, Eye, RotateCcw, File, GraduationCap, CheckCircle, Heart, AlertCircle } from 'lucide-react';

// ✅ CORES OL CENTRALIZADAS
import OL_COLORS from '../../config/olColors';

// ✅ IMPORT DO DESIGN SYSTEM CENTRALIZADO
import {
  PageContainer,
  PageHeader,
  PageSection,
  StatCard,
  Button,
  Loading,
  EmptyState
} from '../ui';

// ✅ SERVIÇOS API
const API_BASE_URL = 'http://localhost:8000';

const api = {
  get: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { data: await response.json() };
  },
  post: async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { data: await response.json() };
  },
  put: async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { data: await response.json() };
  },
  delete: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { data: await response.json() };
  }
};

const KnowledgePage = ({ onBackToDashboard, useAPI = true }) => {
  // Estados principais
  const [data, setData] = useState({
    conhecimentos: 0,
    colaboradores: 0,
    vinculos: 0
  });
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [filters, setFilters] = useState({
    search: '',
    tipo: '',
    vendor: '',
    nivel: ''
  });

  // Estados do modal
  const [showModal, setShowModal] = useState(false);
  const [editingKnowledge, setEditingKnowledge] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo: 'CERTIFICACAO',
    vendor: '',
    nivel: 'BASICO',
    duracao_horas: '',
    validade_meses: '',
    url_oficial: '',
    observacoes: '',
    ativo: true
  });

  // ✅ CARREGAR TODOS OS DADOS
  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (useAPI) {
        // Carregar dados da API
        const [knowledgeResponse, statsResponse] = await Promise.all([
          api.get('/knowledge'),
          api.get('/knowledge/stats').catch(() => ({ data: { conhecimentos: 0, colaboradores: 0, vinculos: 0 } }))
        ]);

        setKnowledge(knowledgeResponse.data || []);
        setData(statsResponse.data || { conhecimentos: 0, colaboradores: 0, vinculos: 0 });

        console.log('🔍 DEBUG Dados carregados:', statsResponse.data);
      } else {
        // Dados mock
        const mockKnowledge = [
          {
            id: 1,
            nome: 'React Fundamentals',
            descricao: 'Curso completo de React para iniciantes',
            tipo: 'CURSO',
            vendor: 'Udemy',
            nivel: 'BASICO',
            duracao_horas: 40,
            validade_meses: null,
            url_oficial: 'https://udemy.com/react-fundamentals',
            ativo: true
          },
          {
            id: 2,
            nome: 'AWS Cloud Practitioner',
            descricao: 'Certificação básica da AWS',
            tipo: 'CERTIFICACAO',
            vendor: 'Amazon',
            nivel: 'BASICO',
            duracao_horas: 20,
            validade_meses: 36,
            url_oficial: 'https://aws.amazon.com/certification',
            ativo: true
          }
        ];

        setKnowledge(mockKnowledge);
        setData({
          conhecimentos: mockKnowledge.length,
          colaboradores: 15,
          vinculos: 8
        });
      }
    } catch (err) {
      console.error('❌ Erro ao carregar conhecimentos:', err);
      setError('Erro ao carregar dados dos conhecimentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [useAPI]);

  // ✅ FILTROS APLICADOS
  const filteredKnowledge = useMemo(() => {
    return knowledge.filter(item => {
      const matchesSearch = !filters.search ||
        item.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.descricao.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.vendor.toLowerCase().includes(filters.search.toLowerCase());

      const matchesTipo = !filters.tipo || item.tipo === filters.tipo;
      const matchesVendor = !filters.vendor || item.vendor.toLowerCase().includes(filters.vendor.toLowerCase());
      const matchesNivel = !filters.nivel || item.nivel === filters.nivel;

      return matchesSearch && matchesTipo && matchesVendor && matchesNivel;
    });
  }, [knowledge, filters]);

  // ✅ RESETAR FORMULÁRIO
  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      tipo: 'CERTIFICACAO',
      vendor: '',
      nivel: 'BASICO',
      duracao_horas: '',
      validade_meses: '',
      url_oficial: '',
      observacoes: '',
      ativo: true
    });
    setEditingKnowledge(null);
  };

  // ✅ HANDLERS DO MODAL
  const handleAddKnowledge = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditKnowledge = (item) => {
    setEditingKnowledge(item);
    setFormData({
      nome: item.nome || '',
      descricao: item.descricao || '',
      tipo: item.tipo || 'CERTIFICACAO',
      vendor: item.vendor || '',
      nivel: item.nivel || 'BASICO',
      duracao_horas: item.duracao_horas || '',
      validade_meses: item.validade_meses || '',
      url_oficial: item.url_oficial || '',
      observacoes: item.observacoes || '',
      ativo: item.ativo !== false
    });
    setShowModal(true);
  };

  const handleDeleteKnowledge = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este conhecimento?')) {
      try {
        if (useAPI) {
          await api.delete(`/knowledge/${id}`);
        } else {
          setKnowledge(prev => prev.filter(item => item.id !== id));
        }

        await loadAllData();
        alert('Conhecimento excluído com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao excluir conhecimento:', error);
        alert('Erro ao excluir conhecimento');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      const knowledgeData = {
        ...formData,
        duracao_horas: formData.duracao_horas ? parseInt(formData.duracao_horas) : null,
        validade_meses: formData.validade_meses ? parseInt(formData.validade_meses) : null
      };

      if (useAPI) {
        if (editingKnowledge) {
          await api.put(`/knowledge/${editingKnowledge.id}`, knowledgeData);
        } else {
          await api.post('/knowledge', knowledgeData);
        }
      } else {
        // Mock implementation
        if (editingKnowledge) {
          setKnowledge(prev => prev.map(item =>
            item.id === editingKnowledge.id
              ? { ...item, ...knowledgeData }
              : item
          ));
        } else {
          const newItem = {
            id: Math.max(...knowledge.map(k => k.id), 0) + 1,
            ...knowledgeData
          };
          setKnowledge(prev => [...prev, newItem]);
        }
      }

      setShowModal(false);
      resetForm();
      await loadAllData();
      alert(editingKnowledge ? 'Conhecimento atualizado com sucesso!' : 'Conhecimento criado com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao salvar conhecimento:', error);
      alert('Erro ao salvar conhecimento');
    } finally {
      setModalLoading(false);
    }
  };

  // ✅ HANDLERS DE FILTRO
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      tipo: '',
      vendor: '',
      nivel: ''
    });
  };

  // ✅ FUNÇÕES HELPER
  const getTypeIcon = (tipo) => {
    switch(tipo) {
      case 'CERTIFICACAO': return <Award className="w-4 h-4" />;
      case 'CURSO': return <BookOpen className="w-4 h-4" />;
      case 'FORMACAO': return <GraduationCap className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getTypeColor = (tipo) => {
    switch(tipo) {
      case 'CERTIFICACAO': return 'bg-yellow-100 text-yellow-800';
      case 'CURSO': return 'bg-blue-100 text-blue-800';
      case 'FORMACAO': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNivelColor = (nivel) => {
    switch(nivel) {
      case 'BASICO': return 'bg-green-100 text-green-800';
      case 'INTERMEDIARIO': return 'bg-yellow-100 text-yellow-800';
      case 'AVANCADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // ✅ AÇÕES DO HEADER COM CORES OL
  const headerActions = useMemo(() => [
    <Button
      key="new"
      variant="primary"
      icon={Plus}
      onClick={handleAddKnowledge}
      style={{
        backgroundColor: OL_COLORS.primary,
        borderColor: OL_COLORS.primary,
        color: 'white'
      }}
    >
      Novo Conhecimento
    </Button>,
    <Button
      key="refresh"
      variant="ghost"
      icon={RotateCcw}
      onClick={loadAllData}
      style={{
        color: OL_COLORS.primary,
        borderColor: OL_COLORS.light
      }}
    >
      Atualizar
    </Button>
  ], []);

  if (loading) {
    return <Loading fullScreen text="Carregando conhecimentos..." />;
  }

  return (
    <PageContainer>
      {/* Back Button */}
      {onBackToDashboard && (
        <div className="flex items-center mb-4">
          <button
            onClick={onBackToDashboard}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* ✅ HEADER COM AÇÕES */}
      <PageHeader
        title="Conhecimentos"
        subtitle="Gerencie certificações, cursos e formações da equipe"
        breadcrumbs={['Dashboard', 'Conhecimentos']}
        actions={headerActions}
      />

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
            <button
              onClick={loadAllData}
              className="ml-auto px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* ✅ ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Conhecimentos"
          value={data.conhecimentos || knowledge.length}
          subtitle="Itens cadastrados"
          icon={BookOpen}
          color="blue"
        />

        <StatCard
          title="Colaboradores Ativos"
          value={data.colaboradores || 0}
          subtitle="Com vínculos"
          icon={Users}
          color="green"
        />

        <StatCard
          title="Vínculos Ativos"
          value={data.vinculos || 0}
          subtitle="Conhecimentos vinculados"
          icon={Link}
          color="purple"
        />

        <StatCard
          title="Certificações"
          value={knowledge.filter(k => k.tipo === 'CERTIFICACAO').length}
          subtitle="Certificações disponíveis"
          icon={Award}
          color="yellow"
        />
      </div>

      {/* ✅ FILTROS EM SEÇÃO SEPARADA */}
      <PageSection title="Filtros e Busca">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              placeholder="Nome, descrição ou fornecedor..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filters.tipo}
              onChange={(e) => handleFilterChange('tipo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os Tipos</option>
              <option value="CERTIFICACAO">Certificação</option>
              <option value="CURSO">Curso</option>
              <option value="FORMACAO">Formação</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
            <select
              value={filters.nivel}
              onChange={(e) => handleFilterChange('nivel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os Níveis</option>
              <option value="BASICO">Básico</option>
              <option value="INTERMEDIARIO">Intermediário</option>
              <option value="AVANCADO">Avançado</option>
            </select>
          </div>

          <div className="flex items-end">
            {(filters.search || filters.tipo || filters.nivel) && (
              <Button
                variant="ghost"
                icon={RotateCcw}
                onClick={clearFilters}
                className="w-full"
              >
                Limpar
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{filteredKnowledge.length} conhecimentos encontrados</span>
          {(filters.search || filters.tipo || filters.nivel) && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              Filtros aplicados
            </span>
          )}
        </div>
      </PageSection>

      {/* ✅ CONHECIMENTOS EM SEÇÃO SEPARADA */}
      <PageSection title={`Conhecimentos (${filteredKnowledge.length})`}>
        {filteredKnowledge.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Nenhum conhecimento encontrado"
            description={
              (filters.search || filters.tipo || filters.nivel)
                ? 'Tente ajustar os filtros para encontrar conhecimentos.'
                : 'Comece cadastrando certificações, cursos e formações.'
            }
            actionLabel="Adicionar Primeiro Conhecimento"
            onAction={handleAddKnowledge}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredKnowledge.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${getTypeColor(item.tipo)}`}>
                      {getTypeIcon(item.tipo)}
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.tipo)}`}>
                        {item.tipo}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getNivelColor(item.nivel)}`}>
                    {item.nivel}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{item.nome}</h3>

                {item.descricao && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.descricao}</p>
                )}

                <div className="space-y-2 mb-4">
                  {item.vendor && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Fornecedor:</span>
                      <span className="ml-2">{item.vendor}</span>
                    </div>
                  )}

                  {item.duracao_horas && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Duração:</span>
                      <span className="ml-2">{item.duracao_horas}h</span>
                    </div>
                  )}

                  {item.validade_meses && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Validade:</span>
                      <span className="ml-2">{item.validade_meses} meses</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    {item.url_oficial && (
                      <a
                        href={item.url_oficial}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Site oficial"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditKnowledge(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteKnowledge(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageSection>

      {/* ✅ MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="text-xl font-bold">
                {editingKnowledge ? '✏️ Editar Conhecimento' : '➕ Novo Conhecimento'}
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                {editingKnowledge ? 'Atualize as informações' : 'Cadastre um novo item de conhecimento'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                  <select
                    required
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="CERTIFICACAO">Certificação</option>
                    <option value="CURSO">Curso</option>
                    <option value="FORMACAO">Formação</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nível *</label>
                  <select
                    required
                    value={formData.nivel}
                    onChange={(e) => setFormData({...formData, nivel: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="BASICO">Básico</option>
                    <option value="INTERMEDIARIO">Intermediário</option>
                    <option value="AVANCADO">Avançado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duração (horas)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.duracao_horas}
                    onChange={(e) => setFormData({...formData, duracao_horas: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Validade (meses)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.validade_meses}
                    onChange={(e) => setFormData({...formData, validade_meses: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Oficial</label>
                  <input
                    type="url"
                    value={formData.url_oficial}
                    onChange={(e) => setFormData({...formData, url_oficial: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    rows={3}
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    rows={2}
                    value={formData.observacoes}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.ativo}
                      onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Ativo</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={modalLoading}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {modalLoading ? 'Salvando...' : (editingKnowledge ? 'Atualizar' : 'Criar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default KnowledgePage;
