import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, BookOpen, TrendingUp, Plus, Filter, RotateCcw, Edit, Trash2, AlertCircle, Link as LinkIcon, Eye } from 'lucide-react';

// ✅ IMPORT DO MODAL CORRETO
import EmployeeKnowledgeModal from './EmployeeKnowledgeModal';

// ✅ IMPORT DO DESIGN SYSTEM CENTRALIZADO
import {
  PageContainer,
  PageHeader,
  PageSection,
  StatCard,
  Button,
  Loading,
  EmptyState,
  StatusBadge
} from '../ui';

// API Services
const API_BASE_URL = 'http://localhost:8000';

const api = {
  get: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { data: await response.json() };
  }
};

const EmployeeKnowledgePage = ({ onBackToDashboard }) => {
  // Estados principais
  const [data, setData] = useState({
    links: [],
    employees: [],
    knowledge: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [filters, setFilters] = useState({
    employee_id: '',
    learning_item_id: '',
    status: ''
  });

  // Estados do modal
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  // ✅ FUNÇÃO PARA ADICIONAR VÍNCULO
  const handleAddLink = () => {
    console.log('🔍 ABRINDO MODAL PARA NOVO VÍNCULO');
    setEditingLink(null);
    setShowModal(true);
  };

  // ✅ FUNÇÃO PARA EDITAR VÍNCULO
  const handleEditLink = (link) => {
    console.log('🔍 ABRINDO MODAL PARA EDITAR:', link);
    setEditingLink(link);
    setShowModal(true);
  };

  // ✅ FUNÇÃO PARA FECHAR MODAL
  const handleCloseModal = () => {
    console.log('🔍 FECHANDO MODAL');
    setShowModal(false);
    setEditingLink(null);
  };

  // ✅ FUNÇÃO PARA SALVAR E RECARREGAR
  const handleSaveLink = async () => {
    console.log('🔍 VÍNCULO SALVO - RECARREGANDO DADOS');
    await loadData();
    handleCloseModal();
  };

  // ✅ FUNÇÃO PARA DELETAR VÍNCULO
  const handleDeleteLink = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este vínculo?')) {
      try {
        // Implementar API delete aqui
        console.log('Deletando vínculo:', id);

        // Por enquanto, remove da lista local
        setData(prevData => ({
          ...prevData,
          links: prevData.links.filter(link => link.id !== id)
        }));

        alert('Vínculo removido com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao deletar vínculo:', error);
        alert('Erro ao deletar vínculo');
      }
    }
  };

  // ✅ CARREGAR DADOS DA API
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Iniciando carregamento de dados...');

      // Carregar dados em paralelo
      const [employeesResponse, knowledgeResponse, linksResponse] = await Promise.all([
        api.get('/employees'),
        api.get('/knowledge'),
        api.get('/employee-knowledge')
      ]);

      console.log('✅ Colaboradores carregados:', employeesResponse.data.length);
      console.log('✅ Conhecimentos carregados:', knowledgeResponse.data.length);
      console.log('✅ Vínculos carregados:', linksResponse.data.length);

      setData({
        employees: employeesResponse.data,
        knowledge: knowledgeResponse.data,
        links: linksResponse.data
      });

      console.log('✅ Todos os dados carregados com sucesso!');

    } catch (err) {
      console.error('❌ Erro ao carregar dados:', err);
      setError('Erro ao carregar dados da API');

      // Mock data para desenvolvimento
      setData({
        links: [
          {
            id: 1,
            employee_id: 1,
            learning_item_id: 1,
            status: 'OBTIDO',
            data_obtencao: '2024-01-15'
          },
          {
            id: 2,
            employee_id: 2,
            learning_item_id: 2,
            status: 'DESEJADO',
            data_alvo: '2024-03-15'
          }
        ],
        employees: [
          {
            id: 1,
            nome: 'João Silva',
            cargo: 'Desenvolvedor',
            area: 'TI'
          },
          {
            id: 2,
            nome: 'Maria Santos',
            cargo: 'Analista',
            area: 'TI'
          }
        ],
        knowledge: [
          {
            id: 1,
            nome: 'React Básico',
            tipo: 'CURSO',
            vendor: 'Udemy'
          },
          {
            id: 2,
            nome: 'AWS Cloud',
            tipo: 'CERTIFICACAO',
            vendor: 'Amazon'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ✅ FILTROS APLICADOS
  const filteredLinks = useMemo(() => {
    return data.links.filter(link => {
      const matchesEmployee = !filters.employee_id || link.employee_id.toString() === filters.employee_id;
      const matchesKnowledge = !filters.learning_item_id || link.learning_item_id.toString() === filters.learning_item_id;
      const matchesStatus = !filters.status || link.status === filters.status;

      return matchesEmployee && matchesKnowledge && matchesStatus;
    });
  }, [data.links, filters]);

  // ✅ ESTATÍSTICAS CALCULADAS
  const stats = useMemo(() => {
    const total = data.links.length;
    const obtidos = data.links.filter(link => link.status === 'OBTIDO').length;
    const obrigatorios = data.links.filter(link => link.status === 'OBRIGATORIO').length;
    const desejados = data.links.filter(link => link.status === 'DESEJADO').length;

    return { total, obtidos, obrigatorios, desejados };
  }, [data.links]);

  // ✅ FUNÇÕES DE FILTRO
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      employee_id: '',
      learning_item_id: '',
      status: ''
    });
  };

  // ✅ FUNÇÕES PARA ENCONTRAR DADOS
  const findEmployee = (id) => {
    return data.employees.find(emp => emp.id === parseInt(id)) || { nome: 'Não encontrado', cargo: '-' };
  };

  const findKnowledge = (id) => {
    return data.knowledge.find(k => k.id === parseInt(id)) || { nome: 'Não encontrado', tipo: '-' };
  };

  // ✅ AÇÕES DO HEADER
  const headerActions = useMemo(() => [
    <Button
      key="add"
      variant="primary"
      icon={Plus}
      onClick={handleAddLink}
    >
      Novo Vínculo
    </Button>,
    <Button
      key="refresh"
      variant="ghost"
      icon={RotateCcw}
      onClick={loadData}
    >
      Atualizar
    </Button>
  ], []);

  if (loading) {
    return <Loading fullScreen text="Carregando vínculos..." />;
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

      {/* Header */}
      <PageHeader
        title="Vínculos de Conhecimento"
        subtitle="Gerencie certificações, cursos e formações dos colaboradores"
        breadcrumbs={['Dashboard', 'Colaboradores', 'Vínculos']}
        actions={headerActions}
      />

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
            <button
              onClick={loadData}
              className="ml-auto px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* ✅ ESTATÍSTICAS COMO STATCARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Vínculos"
          value={stats.total}
          subtitle="Conhecimentos vinculados"
          icon={LinkIcon}
          color="blue"
        />

        <StatCard
          title="Conhecimentos Obtidos"
          value={stats.obtidos}
          subtitle="Certificações conquistadas"
          icon={TrendingUp}
          color="green"
        />

        <StatCard
          title="Obrigatórios"
          value={stats.obrigatorios}
          subtitle="Certificações obrigatórias"
          icon={AlertCircle}
          color="red"
        />

        <StatCard
          title="Desejados"
          value={stats.desejados}
          subtitle="Certificações desejadas"
          icon={BookOpen}
          color="purple"
        />
      </div>

      {/* ✅ AÇÃO NOVO VÍNCULO EM CARD */}
      <div className="grid grid-cols-1 gap-6">
        <div
          className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
          onClick={handleAddLink}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Vincular Conhecimento</h3>
              <p className="text-sm text-gray-500">Conectar colaboradores com certificações, cursos e formações</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FILTROS EM SEÇÃO SEPARADA */}
      <PageSection title="Filtros">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Colaborador</label>
            <select
              value={filters.employee_id}
              onChange={(e) => handleFilterChange('employee_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os Colaboradores</option>
              {data.employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.nome} - {emp.cargo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conhecimento</label>
            <select
              value={filters.learning_item_id}
              onChange={(e) => handleFilterChange('learning_item_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os Conhecimentos</option>
              {data.knowledge.map(k => (
                <option key={k.id} value={k.id}>
                  {k.nome} - {k.tipo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os Status</option>
              <option value="OBTIDO">Obtidos</option>
              <option value="DESEJADO">Desejados</option>
              <option value="OBRIGATORIO">Obrigatórios</option>
            </select>
          </div>

          <div className="flex items-end">
            {(filters.employee_id || filters.learning_item_id || filters.status) && (
              <Button
                variant="ghost"
                icon={RotateCcw}
                onClick={clearFilters}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{filteredLinks.length} vínculos encontrados</span>
          {(filters.employee_id || filters.learning_item_id || filters.status) && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              Filtros aplicados
            </span>
          )}
        </div>
      </PageSection>

      {/* ✅ VÍNCULOS EM SEÇÃO SEPARADA */}
      <PageSection title={`Vínculos (${filteredLinks.length})`}>
        {filteredLinks.length === 0 ? (
          <EmptyState
            icon={LinkIcon}
            title="Nenhum vínculo encontrado"
            description={
              (filters.employee_id || filters.learning_item_id || filters.status)
                ? 'Tente ajustar os filtros para encontrar vínculos.'
                : 'Comece criando vínculos entre colaboradores e conhecimentos.'
            }
            actionLabel="Criar Primeiro Vínculo"
            onAction={handleAddLink}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredLinks.map((link) => {
              const employee = findEmployee(link.employee_id);
              const knowledge = findKnowledge(link.learning_item_id);

              return (
                <div key={link.id} className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {employee.nome} ↔ {knowledge.nome}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{employee.cargo}</span>
                        <span>•</span>
                        <span>{knowledge.tipo}</span>
                        <StatusBadge status={link.status} />
                      </div>

                      {(link.data_alvo || link.data_obtencao) && (
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          {link.data_alvo && (
                            <span>🎯 Meta: {new Date(link.data_alvo).toLocaleDateString('pt-BR')}</span>
                          )}
                          {link.data_obtencao && (
                            <span>✅ Obtido: {new Date(link.data_obtencao).toLocaleDateString('pt-BR')}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLink(link)}
                        icon={Edit}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                        icon={Trash2}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageSection>

      {/* ✅ MODAL CORRETO */}
      <EmployeeKnowledgeModal
        isOpen={showModal}
        onClose={handleCloseModal}
        editingLink={editingLink}
        employees={data.employees}
        knowledge={data.knowledge}
        onSave={handleSaveLink}
      />
    </PageContainer>
  );
};

export default EmployeeKnowledgePage;
