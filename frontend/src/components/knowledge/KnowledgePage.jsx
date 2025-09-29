import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Plus, Award, TrendingUp, Users, Link, ExternalLink, Edit, Trash2, Eye, RotateCcw } from 'lucide-react';

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
    return { success: true };
  }
};

const knowledgeService = {
  async getAll() {
    try {
      const response = await api.get('/knowledge');
      return response.data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar conhecimentos:', error);
      return [];
    }
  },
  async create(data) {
    try {
      const response = await api.post('/knowledge', data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar conhecimento:', error);
      throw error;
    }
  },
  async update(id, data) {
    try {
      const response = await api.put(`/knowledge/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar conhecimento:', error);
      throw error;
    }
  },
  async delete(id) {
    try {
      await api.delete(`/knowledge/${id}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar conhecimento:', error);
      throw error;
    }
  }
};

const employeeService = {
  async getAll() {
    try {
      const response = await api.get('/employees');
      return response.data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar colaboradores:', error);
      return [];
    }
  }
};

const employeeKnowledgeService = {
  async getAll() {
    try {
      const response = await api.get('/employee-knowledge');
      return response.data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar vínculos:', error);
      return [];
    }
  }
};

const KnowledgePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('TODOS');
  const [filterArea, setFilterArea] = useState('TODAS');
  const [filterVendor, setFilterVendor] = useState('TODOS');

  // Estados da API
  const [knowledge, setKnowledge] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeLinks, setEmployeeLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados do modal
  const [showModal, setShowModal] = useState(false);
  const [editingKnowledge, setEditingKnowledge] = useState(null);
  const [showAnalystsModal, setShowAnalystsModal] = useState(false);
  const [selectedAnalysts, setSelectedAnalysts] = useState([]);
  const [selectedCertStatus, setSelectedCertStatus] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState('OBTIDO');

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'CERTIFICACAO',
    codigo: '',
    vendor: '',
    area: '',
    link: '',
    validademeses: ''
  });

  // ✅ CARREGAR DADOS DA API
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [knowledgeData, employeesData, linksData] = await Promise.all([
        knowledgeService.getAll(),
        employeeService.getAll(),
        employeeKnowledgeService.getAll()
      ]);

      setKnowledge(knowledgeData);
      setEmployees(employeesData);
      setEmployeeLinks(linksData);
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FILTROS DINÂMICOS
  const uniqueAreas = [...new Set(knowledge.map(item => item.area).filter(Boolean))];
  const uniqueVendors = [...new Set(knowledge.map(item => item.vendor).filter(Boolean))];

  const filteredAreas = useMemo(() => {
    if (filterType === 'TODOS') return uniqueAreas;
    return [...new Set(
      knowledge
        .filter(k => k.tipo === filterType)
        .map(k => k.area)
        .filter(Boolean)
    )];
  }, [knowledge, filterType, uniqueAreas]);

  const filteredVendors = useMemo(() => {
    if (filterType === 'TODOS') return uniqueVendors;
    return [...new Set(
      knowledge
        .filter(k => k.tipo === filterType)
        .map(k => k.vendor)
        .filter(Boolean)
    )];
  }, [knowledge, filterType, uniqueVendors]);

  const handleFilterByType = (tipo) => {
    setFilterType(tipo);
    setFilterArea('TODAS');
    setFilterVendor('TODOS');
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterType('TODOS');
    setFilterArea('TODAS');
    setFilterVendor('TODOS');
  };

  useEffect(() => {
    if (filterType !== 'TODOS') {
      const validAreas = filteredAreas;
      const validVendors = filteredVendors;

      if (filterArea !== 'TODAS' && !validAreas.includes(filterArea)) {
        setFilterArea('TODAS');
      }

      if (filterVendor !== 'TODOS' && !validVendors.includes(filterVendor)) {
        setFilterVendor('TODOS');
      }
    }
  }, [filterType, filteredAreas, filteredVendors, filterArea, filterVendor]);

  // Todas as funções originais
  const showAllAnalysts = (knowledgeId) => {
    const knowledgeLinks = employeeLinks.filter(link => link.knowledge_id === knowledgeId);
    const analystsByStatus = { OBTIDO: [], DESEJADO: [], OBRIGATORIO: [] };

    knowledgeLinks.forEach(link => {
      const employee = employees.find(emp => emp.id === link.employee_id);
      if (employee) {
        const status = link.status || 'DESEJADO';
        if (analystsByStatus[status]) {
          analystsByStatus[status].push({ ...employee, linkData: link });
        }
      }
    });

    const knowledgeItem = knowledge.find(k => k.id === knowledgeId);
    setSelectedAnalysts(analystsByStatus);
    setSelectedCertStatus(`${knowledgeItem?.nome || 'Conhecimento'} - Todos os Status`);
    setActiveStatusTab('OBTIDO');
    setShowAnalystsModal(true);
  };

  const showAnalystsByStatus = (knowledgeId, status) => {
    const knowledgeLinks = employeeLinks.filter(link =>
      link.knowledge_id === knowledgeId && link.status === status
    );

    const analysts = knowledgeLinks.map(link => {
      const employee = employees.find(emp => emp.id === link.employee_id);
      return employee ? { ...employee, linkData: link } : null;
    }).filter(Boolean);

    const knowledgeItem = knowledge.find(k => k.id === knowledgeId);
    setSelectedAnalysts(analysts);
    setSelectedCertStatus(`${knowledgeItem?.nome || 'Conhecimento'} - ${status}`);
    setShowAnalystsModal(true);
  };

  const showGlobalAnalystsByStatus = (status) => {
    const statusLinks = employeeLinks.filter(link => link.status === status);
    const analysts = statusLinks.map(link => {
      const employee = employees.find(emp => emp.id === link.employee_id);
      const knowledgeItem = knowledge.find(k => k.id === link.knowledge_id);
      return employee ? {
        ...employee,
        linkData: link,
        knowledgeName: knowledgeItem?.nome
      } : null;
    }).filter(Boolean);

    setSelectedAnalysts(analysts);
    setSelectedCertStatus(`Colaboradores com Status: ${status}`);
    setShowAnalystsModal(true);
  };

  const filteredKnowledge = useMemo(() => {
    return knowledge.filter(item => {
      const matchesSearch = item.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'TODOS' || item.tipo === filterType;
      const matchesArea = filterArea === 'TODAS' || item.area === filterArea;
      const matchesVendor = filterVendor === 'TODOS' || item.vendor === filterVendor;

      return matchesSearch && matchesType && matchesArea && matchesVendor;
    });
  }, [knowledge, searchTerm, filterType, filterArea, filterVendor]);

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: 'CERTIFICACAO',
      codigo: '',
      vendor: '',
      area: '',
      link: '',
      validademeses: ''
    });
    setEditingKnowledge(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        validade_meses: formData.validademeses ? parseInt(formData.validademeses) : null
      };
      delete submitData.validademeses;

      if (editingKnowledge) {
        await knowledgeService.update(editingKnowledge.id, submitData);
      } else {
        await knowledgeService.create(submitData);
      }

      await loadAllData();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar conhecimento:', error);
      alert('Erro ao salvar conhecimento');
    }
  };

  const handleEditKnowledge = (item) => {
    setEditingKnowledge(item);
    setFormData({
      nome: item.nome || '',
      tipo: item.tipo || 'CERTIFICACAO',
      codigo: item.codigo || '',
      vendor: item.vendor || '',
      area: item.area || '',
      link: item.link || '',
      validademeses: item.validade_meses || ''
    });
    setShowModal(true);
  };

  const handleDeleteKnowledge = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este conhecimento?')) {
      try {
        await knowledgeService.delete(id);
        await loadAllData();
      } catch (error) {
        console.error('Erro ao deletar conhecimento:', error);
        alert('Erro ao deletar conhecimento');
      }
    }
  };

  const getTypeColor = (tipo) => {
    const colors = {
      'CERTIFICACAO': 'bg-green-100 text-green-800',
      'CURSO': 'bg-blue-100 text-blue-800',
      'FORMACAO': 'bg-purple-100 text-purple-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (tipo) => {
    const icons = {
      'CERTIFICACAO': '🏆',
      'CURSO': '📚',
      'FORMACAO': '🎓'
    };
    return icons[tipo] || '📄';
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Estatísticas
  const stats = {
    totalCertifications: knowledge.filter(k => k.tipo === 'CERTIFICACAO').length,
    totalCourses: knowledge.filter(k => k.tipo === 'CURSO').length,
    totalFormations: knowledge.filter(k => k.tipo === 'FORMACAO').length,
    totalAnalysts: employees.length,
    obtidos: employeeLinks.filter(link => link.status === 'OBTIDO').length,
    desejados: employeeLinks.filter(link => link.status === 'DESEJADO').length,
    obrigatorios: employeeLinks.filter(link => link.status === 'OBRIGATORIO').length
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Conhecimentos"
        subtitle="Gerencie certificações, cursos e formações da equipe"
      />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Certificações"
          value={stats.totalCertifications}
          subtitle="Certificações cadastradas"
          icon={Award}
          color="green"
          onClick={() => handleFilterByType('CERTIFICACAO')}
          clickable={true}
        />

        <StatCard
          title="Cursos"
          value={stats.totalCourses}
          subtitle="Cursos disponíveis"
          icon={BookOpen}
          color="blue"
          onClick={() => handleFilterByType('CURSO')}
          clickable={true}
        />

        <StatCard
          title="Formações"
          value={stats.totalFormations}
          subtitle="Programas de formação"
          icon={Users}
          color="purple"
          onClick={() => handleFilterByType('FORMACAO')}
          clickable={true}
        />

        <StatCard
          title="Total de Vínculos"
          value={stats.obtidos + stats.desejados + stats.obrigatorios}
          subtitle="Conhecimentos vinculados"
          icon={Link}
          color="orange"
        />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Obtidos"
          value={stats.obtidos}
          subtitle="Certificações conquistadas"
          icon={Award}
          color="green"
          onClick={() => showGlobalAnalystsByStatus('OBTIDO')}
          clickable={true}
        />

        <StatCard
          title="Desejados"
          value={stats.desejados}
          subtitle="Em processo de obtenção"
          icon={TrendingUp}
          color="blue"
          onClick={() => showGlobalAnalystsByStatus('DESEJADO')}
          clickable={true}
        />

        <StatCard
          title="Obrigatórios"
          value={stats.obrigatorios}
          subtitle="Requisitos mandatórios"
          icon={ExternalLink}
          color="red"
          onClick={() => showGlobalAnalystsByStatus('OBRIGATORIO')}
          clickable={true}
        />
      </div>

      {/* Novo Conhecimento */}
      <div
        className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-ol-brand-300"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-ol-brand-50 text-ol-brand-600 rounded-lg flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Novo Conhecimento</h3>
            <p className="text-sm text-gray-500">Adicionar certificação, curso ou formação</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <PageSection title="Filtros e Busca">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              placeholder="Nome, código ou vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filterType}
              onChange={(e) => handleFilterByType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
            >
              <option value="TODOS">Todos os Tipos</option>
              <option value="CERTIFICACAO">Certificações</option>
              <option value="CURSO">Cursos</option>
              <option value="FORMACAO">Formações</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área {filterType !== 'TODOS' && `(${filterType.toLowerCase()})`}
            </label>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
            >
              <option value="TODAS">Todas as Áreas</option>
              {filteredAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor {filterType !== 'TODOS' && `(${filterType.toLowerCase()})`}
            </label>
            <select
              value={filterVendor}
              onChange={(e) => setFilterVendor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
            >
              <option value="TODOS">Todos os Vendors</option>
              {filteredVendors.map(vendor => (
                <option key={vendor} value={vendor}>{vendor}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredKnowledge.length} de {knowledge.length} conhecimentos
            {filterType !== 'TODOS' && (
              <span className="ml-2 px-2 py-1 bg-ol-brand-100 text-ol-brand-700 rounded text-xs">
                Filtrado por: {filterType}
              </span>
            )}
          </div>

          {(searchTerm || filterType !== 'TODOS' || filterArea !== 'TODAS' || filterVendor !== 'TODOS') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              icon={RotateCcw}
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      </PageSection>

      {/* Lista de Conhecimentos */}
      <PageSection title={`Conhecimentos (${filteredKnowledge.length})`}>
        {filteredKnowledge.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKnowledge.map(item => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="text-2xl flex-shrink-0">
                      {getTypeIcon(item.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
                        {item.nome}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.tipo)}`}>
                        {item.tipo}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Acessar página oficial"
                        className="text-ol-brand-600 hover:text-ol-brand-700 transition-colors p-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => showAllAnalysts(item.id)}
                      className="text-ol-brand-600 hover:text-ol-brand-700 transition-colors p-1"
                      title="Ver todos os colaboradores"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleEditKnowledge(item)}
                      title="Editar conhecimento"
                      className="text-ol-brand-600 hover:text-ol-brand-700 transition-colors p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  {item.codigo && (
                    <div className="flex items-center justify-between">
                      <span>Código:</span>
                      <span className="font-mono text-gray-900">{item.codigo}</span>
                    </div>
                  )}
                  {item.vendor && (
                    <div className="flex items-center justify-between">
                      <span>Vendor:</span>
                      <span className="text-gray-900">{item.vendor}</span>
                    </div>
                  )}
                  {item.area && (
                    <div className="flex items-center justify-between">
                      <span>Área:</span>
                      <span className="text-gray-900">{item.area}</span>
                    </div>
                  )}
                  {item.validade_meses && (
                    <div className="flex items-center justify-between">
                      <span>Validade:</span>
                      <span className="text-gray-900">{item.validade_meses} meses</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => showAnalystsByStatus(item.id, 'OBTIDO')}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
                      >
                        <span>✅</span>
                        <span>{employeeLinks.filter(link => link.knowledge_id === item.id && link.status === 'OBTIDO').length}</span>
                      </button>
                      <button
                        onClick={() => showAnalystsByStatus(item.id, 'DESEJADO')}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <span>💙</span>
                        <span>{employeeLinks.filter(link => link.knowledge_id === item.id && link.status === 'DESEJADO').length}</span>
                      </button>
                      <button
                        onClick={() => showAnalystsByStatus(item.id, 'OBRIGATORIO')}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <span>🔴</span>
                        <span>{employeeLinks.filter(link => link.knowledge_id === item.id && link.status === 'OBRIGATORIO').length}</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteKnowledge(item.id)}
                      className="text-red-600 hover:text-red-700 transition-colors p-1"
                      title="Excluir"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Nenhum conhecimento encontrado"
            description={
              searchTerm || filterType !== 'TODOS' || filterArea !== 'TODAS' || filterVendor !== 'TODOS'
                ? 'Tente ajustar os filtros para encontrar conhecimentos.'
                : 'Comece adicionando o primeiro conhecimento.'
            }
            actionLabel="Adicionar Primeiro Conhecimento"
            onAction={() => {
              resetForm();
              setShowModal(true);
            }}
          />
        )}
      </PageSection>

      {/* Modais (mesmo código original) */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <form onSubmit={handleSubmit} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingKnowledge ? 'Editar Conhecimento' : 'Novo Conhecimento'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
                    >
                      <option value="CERTIFICACAO">Certificação</option>
                      <option value="CURSO">Curso</option>
                      <option value="FORMACAO">Formação</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                    <input
                      type="text"
                      required
                      value={formData.codigo}
                      onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                    <input
                      type="text"
                      required
                      value={formData.vendor}
                      onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                    <input
                      type="text"
                      required
                      value={formData.area}
                      onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link (opcional)</label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Validade (meses)</label>
                    <input
                      type="number"
                      value={formData.validademeses}
                      onChange={(e) => setFormData(prev => ({ ...prev, validademeses: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <Button type="submit" className="flex-1">
                    {editingKnowledge ? 'Atualizar' : 'Criar'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de colaboradores (mesmo código original) */}
      {showAnalystsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowAnalystsModal(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[80vh] flex flex-col">

              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{selectedCertStatus}</h3>
                <button
                  onClick={() => setShowAnalystsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {typeof selectedAnalysts === 'object' && selectedAnalysts.OBTIDO !== undefined ? (
                  <div className="space-y-6">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                      {[
                        { key: 'OBTIDO', label: 'Obtidos', color: 'text-green-600', count: selectedAnalysts.OBTIDO?.length || 0 },
                        { key: 'DESEJADO', label: 'Desejados', color: 'text-blue-600', count: selectedAnalysts.DESEJADO?.length || 0 },
                        { key: 'OBRIGATORIO', label: 'Obrigatórios', color: 'text-red-600', count: selectedAnalysts.OBRIGATORIO?.length || 0 }
                      ].map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveStatusTab(tab.key)}
                          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            activeStatusTab === tab.key
                              ? 'bg-white shadow-sm text-gray-900'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <span className={tab.color}>
                            {tab.label} ({tab.count})
                          </span>
                        </button>
                      ))}
                    </div>

                    {['OBTIDO', 'DESEJADO', 'OBRIGATORIO'].map(status => (
                      <div
                        key={status}
                        className={activeStatusTab === status ? 'block' : 'hidden'}
                      >
                        {selectedAnalysts[status]?.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedAnalysts[status].map(analyst => (
                              <div key={analyst.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-ol-brand-100 rounded-full flex items-center justify-center">
                                    <span className="text-ol-brand-600 font-medium text-sm">
                                      {analyst.nome.split(' ').map(n => n[0]).join('').substr(0, 2)}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {analyst.nome}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                      {analyst.cargo}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {analyst.equipe}
                                    </p>
                                  </div>
                                </div>

                                {analyst.linkData && (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    {status === 'OBTIDO' && (
                                      <div className="space-y-1">
                                        {analyst.linkData.data_obtencao && (
                                          <p className="text-xs text-green-600">
                                            ✅ Obtido: {formatDate(analyst.linkData.data_obtencao)}
                                          </p>
                                        )}
                                        {analyst.linkData.data_expiracao && (
                                          <p className="text-xs text-orange-600">
                                            ⏰ Expira: {formatDate(analyst.linkData.data_expiracao)}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                    {(status === 'DESEJADO' || status === 'OBRIGATORIO') && analyst.linkData.data_alvo && (
                                      <p className="text-xs text-blue-600">
                                        🎯 Meta: {formatDate(analyst.linkData.data_alvo)}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Nenhum colaborador com status "{status.toLowerCase()}" para este conhecimento</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {Array.isArray(selectedAnalysts) && selectedAnalysts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedAnalysts.map(analyst => (
                          <div key={analyst.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-ol-brand-100 rounded-full flex items-center justify-center">
                                <span className="text-ol-brand-600 font-medium text-sm">
                                  {analyst.nome.split(' ').map(n => n[0]).join('').substr(0, 2)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {analyst.nome}
                                </p>
                                <p className="text-xs text-gray-600 truncate">
                                  {analyst.cargo}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {analyst.equipe}
                                </p>
                                {analyst.knowledgeName && (
                                  <p className="text-xs text-ol-brand-600 mt-1">
                                    {analyst.knowledgeName}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Nenhum colaborador encontrado</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default KnowledgePage;
