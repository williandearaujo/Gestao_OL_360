import React, { useState, useEffect } from 'react';
import { Link, Users, BookOpen, TrendingUp, Plus, Filter, RotateCcw, Edit, Trash2, AlertCircle } from 'lucide-react';
import { employeeKnowledgeService } from '../../services/employeeKnowledgeService';
import EmployeeKnowledgeModal from './EmployeeKnowledgeModal';

// ✅ DESIGN SYSTEM COMPONENTS (IGUAL ÀS OUTRAS PÁGINAS)

// PageContainer
const PageContainer = ({ children }) => (
  <div className="flex-1 space-y-6 p-6 bg-gray-50 min-h-screen">
    {children}
  </div>
);

// PageHeader (igual ao Dashboard)
const PageHeader = ({ title, subtitle }) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
    </div>
    <div className="text-sm text-gray-500">
      Última atualização: {new Date().toLocaleDateString('pt-BR')}
    </div>
  </div>
);

// PageSection (igual ao Dashboard)
const PageSection = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
    {title && (
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

// StatCard (IGUAL AO DASHBOARD)
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend = null,
  onClick,
  clickable = false,
  className = ''
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    red: "bg-red-50 text-red-600 border-red-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200"
  };

  return (
    <div
      className={`
        bg-white p-6 rounded-lg border shadow-sm transition-all
        ${clickable 
          ? 'hover:shadow-lg hover:scale-105 cursor-pointer hover:border-ol-brand-300' 
          : 'hover:shadow-md'
        }
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend > 0 ? '+' : ''}{trend}% vs período anterior
            </div>
          )}
          {clickable && (
            <div className="flex items-center mt-2 text-xs text-ol-brand-600">
              <Filter className="w-3 h-3 mr-1" />
              Clique para filtrar
            </div>
          )}
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

// Button
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-ol-brand-500 text-white hover:bg-ol-brand-600 focus:ring-ol-brand-500 shadow-sm',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-ol-brand-500 shadow-sm',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-ol-brand-500'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-md transition-all 
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />}
      {children}
    </button>
  );
};

// Loading
const Loading = ({ fullScreen = false, text = 'Carregando vínculos...' }) => {
  if (fullScreen) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ol-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ol-brand-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
};

// StatusBadge
const StatusBadge = ({ status }) => {
  const getVariant = (status) => {
    switch(status) {
      case 'OBTIDO': return 'success';
      case 'OBRIGATORIO': return 'error';
      case 'DESEJADO': return 'warning';
      default: return 'default';
    }
  };

  const variants = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-blue-100 text-blue-800',
    error: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800'
  };

  const variant = getVariant(status);

  return (
    <span className={`inline-flex items-center font-medium rounded-full px-2.5 py-0.5 text-xs ${variants[variant]}`}>
      {status}
    </span>
  );
};

// PriorityBadge
const PriorityBadge = ({ priority }) => {
  if (priority !== 'ALTA') return null;

  return (
    <span className="inline-flex items-center font-medium rounded-full px-2.5 py-0.5 text-xs bg-red-100 text-red-800">
      🔥 ALTA
    </span>
  );
};

// ✅ COMPONENTE PRINCIPAL COM DESIGN SYSTEM
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

  // Estados do modal
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar vínculos e stats em paralelo
      const [linksData, statsData] = await Promise.all([
        employeeKnowledgeService.getAll(filters),
        employeeKnowledgeService.getStats()
      ]);

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
    // Recarregar dados com novos filtros
    loadData();
  };

  const clearFilters = () => {
    setFilters({ employee_id: '', knowledge_id: '', status: '' });
    loadData();
  };

  // ✅ FUNÇÃO PARA FILTRAR POR STATUS (STATCARDS CLICÁVEIS)
  const handleFilterByStatus = (status) => {
    setFilters({ ...filters, status });
    loadData();
  };

  // Funções do modal
  const handleAddLink = () => {
    setEditingLink(null);
    setShowModal(true);
  };

  const handleEditLink = (link) => {
    setEditingLink(link);
    setShowModal(true);
  };

  const handleDeleteLink = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este vínculo?')) {
      try {
        await employeeKnowledgeService.delete(id);
        await loadData();
      } catch (error) {
        console.error('❌ Erro ao deletar vínculo:', error);
        alert('Erro ao deletar vínculo');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLink(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <Loading fullScreen />;
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

      {/* Header igual ao Dashboard */}
      <PageHeader
        title="Vínculos Colaborador ↔ Conhecimento"
        subtitle="Gerencie certificações, cursos e formações dos colaboradores"
      />

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
            <Button onClick={loadData} variant="ghost" size="sm" className="ml-4">
              Tentar novamente
            </Button>
          </div>
        </div>
      )}

      {/* ✅ ESTATÍSTICAS COMO STATCARDS ELEGANTES (IGUAL OUTRAS PÁGINAS) */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Vínculos"
            value={stats.total}
            subtitle="Conexões ativas"
            icon={Link}
            color="gray"
          />

          <StatCard
            title="Obtidos"
            value={stats.por_status?.obtidos || 0}
            subtitle="Certificações conquistadas"
            icon={BookOpen}
            color="green"
            onClick={() => handleFilterByStatus('OBTIDO')}
            clickable={true}
          />

          <StatCard
            title="Obrigatórios"
            value={stats.por_status?.obrigatorios || 0}
            subtitle="Requisitos mandatórios"
            icon={AlertCircle}
            color="red"
            onClick={() => handleFilterByStatus('OBRIGATORIO')}
            clickable={true}
          />

          <StatCard
            title="Desejados"
            value={stats.por_status?.desejados || 0}
            subtitle="Em processo de obtenção"
            icon={TrendingUp}
            color="blue"
            onClick={() => handleFilterByStatus('DESEJADO')}
            clickable={true}
          />
        </div>
      )}

      {/* ✅ AÇÃO NOVO VÍNCULO EM CARD ELEGANTE */}
      <div
        className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-ol-brand-300"
        onClick={handleAddLink}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-ol-brand-50 text-ol-brand-600 rounded-lg flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Vincular Conhecimento</h3>
            <p className="text-sm text-gray-500">Conectar colaboradores com certificações, cursos e formações</p>
          </div>
        </div>
      </div>

      {/* ✅ FILTROS EM SEÇÃO SEPARADA */}
      <PageSection title="Filtros e Busca">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Colaborador</label>
            <select
              value={filters.employee_id}
              onChange={(e) => handleFilterChange('employee_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
            >
              <option value="">Todos os Colaboradores</option>
              {/* Aqui você pode popular com a lista de colaboradores */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conhecimento</label>
            <select
              value={filters.knowledge_id}
              onChange={(e) => handleFilterChange('knowledge_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
            >
              <option value="">Todos os Conhecimentos</option>
              {/* Aqui você pode popular com a lista de conhecimentos */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ol-brand-500 focus:border-transparent"
            >
              <option value="">Todos os Status</option>
              <option value="OBTIDO">Obtidos</option>
              <option value="DESEJADO">Desejados</option>
              <option value="OBRIGATORIO">Obrigatórios</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {links.length} vínculos encontrados
            {filters.status && (
              <span className="ml-2 px-2 py-1 bg-ol-brand-100 text-ol-brand-700 rounded text-xs">
                Filtrado por: {filters.status}
              </span>
            )}
          </div>

          {(filters.employee_id || filters.knowledge_id || filters.status) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              icon={RotateCcw}
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      </PageSection>

      {/* ✅ VÍNCULOS EM SEÇÃO SEPARADA */}
      <PageSection title={`Vínculos Ativos (${links.length})`}>
        {links.length === 0 ? (
          <div className="text-center py-12">
            <Link className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum vínculo encontrado</h3>
            <p className="text-gray-500 mb-4">
              {filters.employee_id || filters.knowledge_id || filters.status
                ? 'Tente ajustar os filtros para encontrar vínculos.'
                : 'Comece criando vínculos entre colaboradores e conhecimentos.'}
            </p>
            <Button onClick={handleAddLink} icon={Plus}>
              Criar Primeiro Vínculo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-ol-brand-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-ol-brand-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {link.employee?.nome} ↔ {link.knowledge?.nome}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <StatusBadge status={link.status} />
                          <PriorityBadge priority={link.prioridade} />
                        </div>
                      </div>
                    </div>

                    <div className="ml-13 space-y-1">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {link.employee?.cargo}
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {link.knowledge?.tipo}
                        </span>
                      </div>

                      {(link.data_alvo || link.data_obtencao) && (
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {link.data_alvo && (
                            <span>🎯 Meta: {formatDate(link.data_alvo)}</span>
                          )}
                          {link.data_obtencao && (
                            <span>✅ Obtido: {formatDate(link.data_obtencao)}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
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
            ))}
          </div>
        )}
      </PageSection>

      {/* Modal */}
      <EmployeeKnowledgeModal
        isOpen={showModal || !!editingLink}
        onClose={handleCloseModal}
        onSave={loadData}
        linkItem={editingLink}
      />
    </PageContainer>
  );
};

export default EmployeeKnowledgePage;
