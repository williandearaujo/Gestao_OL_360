import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Users, Plus, Link, RefreshCw, UserPlus, Settings, TrendingUp, AlertTriangle, Award, Clock } from 'lucide-react';

// Data e Utils
import { initialEmployees } from './data/mockData';
import { calcularStatusFerias } from './utils/vacationCalculations';
import { filterEmployees } from './utils/employeeUtils';

// ✅ API Services - CORRIGIR IMPORT
import { employeesService } from '../../services/employeesService';
// ✅ DEBUG TEMPORÁRIO
console.log('🔍 DEBUG - employeesService importado:', employeesService);

// ✅ CORES OL CENTRALIZADAS
import OL_COLORS from '../../config/olColors';

// ✅ NOVO IMPORT - DADOS ADMIN
import { useAdminData } from '../admin/hooks/useAdminData';

// ✅ IMPORTS PARA MODAL DE VÍNCULOS
import EmployeeKnowledgeModal from '../employee-knowledge/EmployeeKnowledgeModal';
import AddKnowledgeModal from './modals/AddKnowledgeModal'; // ✅ ADICIONAR IMPORT

// Components
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeCard from './components/EmployeeCard';

// Modals
import EmployeeDetailModal from './modals/EmployeeDetailModal';
import AddEmployeeModal from './modals/AddEmployeeModal';
import EditEmployeeModal from './modals/EditEmployeeModal';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';

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

// ✅ SERVIÇO INLINE PARA VÍNCULOS
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
  }
};

const employeeKnowledgeService = {
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.employee_id) params.append('employee_id', filters.employee_id);
      if (filters.learning_item_id) params.append('learning_item_id', filters.learning_item_id);
      if (filters.status) params.append('status', filters.status);

      const url = `/employee-knowledge${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar vínculos:', error);
      return [];
    }
  },

  async create(linkData) {
    try {
      const response = await api.post('/employee-knowledge', linkData);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar vínculo:', error);
      throw error;
    }
  }
};

// ✅ SERVIÇO PARA CONHECIMENTOS
const knowledgeService = {
  async getAll() {
    try {
      const response = await api.get('/knowledge');
      return response.data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar conhecimentos:', error);
      return [];
    }
  }
};

// ModeIndicator component inline (specific to Employees)
const ModeIndicator = ({ useAPI, error, employeeLinksCount }) => (
  <PageSection>
    {useAPI ? (
      <div className="flex items-center gap-2 text-green-700">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">Modo API Ativo - Dados do servidor</span>
        <span className="text-xs text-green-600 ml-2">
          ({employeeLinksCount} vínculos carregados)
        </span>
      </div>
    ) : (
      <div className="flex items-center gap-2 text-blue-700">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">Modo Mock Ativo - Dados de demonstração</span>
      </div>
    )}
    {error && (
      <div className="mt-2 text-sm text-red-600">{error}</div>
    )}
  </PageSection>
);

const EmployeesPage = ({ onBackToDashboard, useAPI = true, setCurrentPage }) => {
  // ✅ DADOS ADMIN CENTRALIZADOS
  const { realData, loading: adminLoading } = useAdminData();

  // Estados principais
  const [employees, setEmployees] = useState(initialEmployees);
  const [filters, setFilters] = useState({ search: '', equipe: '', nivel: '', status: '' });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [employeeLinks, setEmployeeLinks] = useState([]);

  // ✅ ESTADOS PARA CONHECIMENTOS
  const [knowledge, setKnowledge] = useState([]);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);

  // Estados para API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados dos modais
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ✅ ESTADOS PARA MODAL DE VÍNCULOS
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedEmployeeForLink, setSelectedEmployeeForLink] = useState(null);
  const [knowledgeData, setKnowledgeData] = useState([]);

  // ✅ ESTADOS PARA MODAL DE ADICIONAR CONHECIMENTO
  const [showAddKnowledgeModal, setShowAddKnowledgeModal] = useState(false);

  // Estados para operações
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Estado para novo colaborador
  const [newEmployee, setNewEmployee] = useState({
    nome: '', email: '', telefone: '', cpf: '', rg: '', data_nascimento: '',
    estado_civil: 'SOLTEIRO', cargo: '', equipe: '', nivel: 'JUNIOR', status: 'ATIVO',
    data_admissao: new Date().toISOString().split('T')[0], salario: '',
    endereco: {},
    endereco_obj: {},
    competencias: [], avatar: null,
    manager_id: null, team_id: null, area_id: null, access_level: 'COLABORADOR'
  });

  // ✅ FUNÇÃO PARA CARREGAR CONHECIMENTOS
  const loadKnowledge = useCallback(async () => {
    try {
      setKnowledgeLoading(true);
      const data = await knowledgeService.getAll();
      setKnowledge(data);
      setKnowledgeData(data); // ✅ TAMBÉM SETAR knowledgeData
      console.log('✅ Conhecimentos carregados:', data.length);
    } catch (error) {
      console.error('❌ Erro ao carregar conhecimentos:', error);
      setKnowledge([]);
      setKnowledgeData([]);
    } finally {
      setKnowledgeLoading(false);
    }
  }, []);

  // ✅ FUNÇÃO PARA CARREGAR VÍNCULOS
  const loadEmployeeLinks = useCallback(async () => {
    try {
      const links = await employeeKnowledgeService.getAll();
      setEmployeeLinks(links);
      console.log('✅ Vínculos carregados:', links.length);
    } catch (error) {
      console.error('❌ Erro ao carregar vínculos:', error);
      setEmployeeLinks([]);
    }
  }, []);

  // ✅ FUNÇÃO PARA CARREGAR COLABORADORES DA API
  const loadEmployeesFromAPI = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 DEBUG - Chamando employeesService.getAll()');
      const apiEmployees = await employeesService.getAll();
      console.log('🔍 DEBUG - Dados recebidos:', apiEmployees);

      const transformedEmployees = apiEmployees.map(emp => ({
        ...emp,
        equipe: emp.area || emp.equipe || 'N/A',
        competencias: emp.competencias || [],
        endereco: emp.endereco || {}
      }));

      setEmployees(transformedEmployees);
      console.log('✅ Colaboradores carregados da API:', transformedEmployees.length);

    } catch (err) {
      console.error('Erro ao carregar funcionários da API:', err);
      setError('Erro ao conectar com a API. Usando dados mock como fallback.');
      setEmployees(initialEmployees);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ EFEITO PARA ALTERNAR ENTRE MOCK E API
  useEffect(() => {
    if (useAPI) {
      loadEmployeesFromAPI();
      loadEmployeeLinks();
      loadKnowledge(); // ✅ CARREGAR CONHECIMENTOS
    } else {
      setEmployees(initialEmployees);
      setEmployeeLinks([]);
      setKnowledge([]);
      setKnowledgeData([]);
      setError(null);
    }
  }, [useAPI, loadEmployeesFromAPI, loadEmployeeLinks, loadKnowledge]);

  // Update horário Brasília
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Atualizar automaticamente status das férias (só para dados mock)
  useEffect(() => {
    if (!useAPI) {
      setEmployees(prevEmployees =>
        prevEmployees.map(emp => {
          const feriasCalculadas = calcularStatusFerias(emp);
          return {
            ...emp,
            ferias: {
              ...emp.ferias,
              status: feriasCalculadas.status,
              dias_disponivel: feriasCalculadas.dias_disponivel,
              ferias_vencidas: feriasCalculadas.ferias_vencidas,
              pode_vender: feriasCalculadas.pode_vender
            }
          };
        })
      );
    }
  }, [currentTime, useAPI]);

  // ✅ ESTATÍSTICAS OTIMIZADAS
  const stats = useMemo(() => {
    const total = employees.length;
    const ativos = employees.filter(emp => emp.status === 'ATIVO').length;
    const inativos = employees.filter(emp => emp.status === 'INATIVO').length;
    const ferias = employees.filter(emp => emp.status === 'FERIAS').length;
    const licenca = employees.filter(emp => emp.status === 'LICENCA').length;

    return { total, ativos, inativos, ferias, licenca };
  }, [employees]);

  // ✅ COLABORADORES FILTRADOS OTIMIZADOS
  const filteredEmployees = useMemo(() => {
    return filterEmployees(employees, filters);
  }, [employees, filters]);

  // ✅ FUNÇÃO CORRIGIDA PARA ABRIR MODAL DE VÍNCULOS DIRETO
  const handleManageLinks = useCallback(async (employee) => {
    console.log('🔍 Abrindo modal de vínculos para:', employee.nome);

    try {
      // Carregar conhecimentos se ainda não carregou
      if (knowledge.length === 0) {
        console.log('🔍 Carregando conhecimentos...');
        await loadKnowledge();
      }

      // Definir colaborador selecionado e abrir modal
      setSelectedEmployeeForLink(employee);
      setShowLinkModal(true);

      console.log('🔍 Modal de vínculos deve abrir para:', employee.nome);

    } catch (error) {
      console.error('❌ Erro ao carregar conhecimentos:', error);
      alert('Erro ao carregar conhecimentos. Tentando navegação...');

      // Fallback: navegar para página de vínculos
      if (setCurrentPage) {
        setCurrentPage('employee-knowledge');
      } else {
        alert(`Navegando para vínculos de ${employee.nome}`);
      }
    }
  }, [knowledge.length, loadKnowledge, setCurrentPage]);

  // ✅ FUNÇÃO PARA FECHAR MODAL DE VÍNCULOS
  const handleCloseLinkModal = () => {
    console.log('🔍 Fechando modal de vínculos');
    setShowLinkModal(false);
    setSelectedEmployeeForLink(null);
  };

  // ✅ FUNÇÃO PARA SALVAR VÍNCULO
  const handleSaveLinkModal = async () => {
    console.log('🔍 Vínculo salvo - recarregando dados');
    await loadEmployeeLinks(); // Recarregar vínculos
    handleCloseLinkModal();
  };

  // ✅ FUNÇÃO PARA ABRIR MODAL DE ADICIONAR CONHECIMENTO
  const handleShowAddKnowledgeModal = (employee) => {
    console.log('🎯 Abrindo modal de adicionar conhecimento para:', employee.nome);
    setSelectedEmployee(employee);
    setShowAddKnowledgeModal(true);
  };

  // ✅ FUNÇÃO PARA ADICIONAR CONHECIMENTO
  const handleAddKnowledge = async (vinculoData) => {
    try {
      console.log('🚀 Salvando vínculo de conhecimento:', vinculoData);
      await employeeKnowledgeService.create(vinculoData);

      // Recarregar vínculos
      await loadEmployeeLinks();

      console.log('✅ Vínculo de conhecimento salvo com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar vínculo de conhecimento:', error);
      throw error;
    }
  };

  // ✅ FUNÇÃO PARA UPLOAD DE ARQUIVO
  const handleFileUpload = async (file) => {
    try {
      console.log('📁 Upload de arquivo:', file.name);
      // Implementar upload de arquivo conforme necessário
      return file; // Por enquanto, retorna o próprio arquivo
    } catch (error) {
      console.error('❌ Erro ao fazer upload:', error);
      throw error;
    }
  };

  // ✅ FUNÇÃO CORRIGIDA COM DEBUG
  const openDetailModal = useCallback((employee) => {
    console.log('🔍 openDetailModal - INÍCIO');
    console.log('🔍 openDetailModal - employee recebido:', employee);
    console.log('🔍 openDetailModal - employee.nome:', employee?.nome);

    // SETAR O EMPLOYEE SELECIONADO
    setSelectedEmployee(employee);
    console.log('🔍 openDetailModal - selectedEmployee setado');

    // ABRIR O MODAL
    setShowDetailModal(true);
    console.log('🔍 openDetailModal - modal deve abrir');
  }, []);

  const openEditModal = useCallback((employee) => {
    setEditingEmployee({ ...employee });
    setShowEditModal(true);
  }, []);

  const handlePhotoUpload = useCallback((event, isEditing = false) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target.result;
        if (isEditing) {
          setEditingEmployee(prev => ({ ...prev, avatar: photoUrl }));
        } else {
          setNewEmployee(prev => ({ ...prev, avatar: photoUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const refreshEmployeeLinks = useCallback(async () => {
    await loadEmployeeLinks();
  }, [loadEmployeeLinks]);

  // CRUD handlers
  const handleAddEmployee = useCallback(async (e) => {
    e.preventDefault();
    if (useAPI) {
      try {
        setLoading(true);
        const employeeData = { ...newEmployee, area: newEmployee.equipe, user_id: 1 };
        await employeesService.create(employeeData);
        alert('Funcionário criado com sucesso!');
        await loadEmployeesFromAPI();
        await loadEmployeeLinks();
      } catch (error) {
        console.error('Erro ao criar funcionário:', error);
        alert('Erro ao criar funcionário via API');
      } finally {
        setLoading(false);
      }
    } else {
      const newId = Math.max(...employees.map(emp => emp.id)) + 1;
      setEmployees(prev => [...prev, {
        ...newEmployee,
        id: newId,
        salario: parseFloat(newEmployee.salario) || 0
      }]);
    }

    setNewEmployee({
      nome: '', email: '', telefone: '', cpf: '', rg: '', data_nascimento: '',
      estado_civil: 'SOLTEIRO', cargo: '', equipe: '', nivel: 'JUNIOR', status: 'ATIVO',
      data_admissao: new Date().toISOString().split('T')[0], salario: '',
      endereco: {},
      endereco_obj: {},
      competencias: [], avatar: null,
      manager_id: null, team_id: null, area_id: null, access_level: 'COLABORADOR'
    });
    setShowAddModal(false);
  }, [useAPI, newEmployee, employees, loadEmployeesFromAPI, loadEmployeeLinks]);

  const handleEditEmployee = useCallback(async (e) => {
    e.preventDefault();
    if (useAPI) {
      try {
        setLoading(true);
        const employeeData = { ...editingEmployee, area: editingEmployee.equipe };
        await employeesService.update(editingEmployee.id, employeeData);
        alert('Funcionário atualizado com sucesso!');
        await loadEmployeesFromAPI();
        await loadEmployeeLinks();
      } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
        alert('Erro ao atualizar funcionário via API');
      } finally {
        setLoading(false);
      }
    } else {
      setEmployees(prev =>
        prev.map(emp => emp.id === editingEmployee.id ? {
          ...editingEmployee,
          salario: parseFloat(editingEmployee.salario) || 0
        } : emp)
      );
    }
    setShowEditModal(false);
    setEditingEmployee(null);
  }, [useAPI, editingEmployee, loadEmployeesFromAPI, loadEmployeeLinks]);

 // ✅ CORREÇÃO: handleDeleteEmployee deve receber o OBJETO, não o ID
const handleDeleteEmployee = useCallback((employee) => {
  console.log('🔍 handleDeleteEmployee chamado com employee COMPLETO:', employee);
  console.log('🔍 handleDeleteEmployee - employee.id:', employee?.id);
  console.log('🔍 handleDeleteEmployee - employee.nome:', employee?.nome);

  // ✅ SETAR O OBJETO COMPLETO, NÃO APENAS O ID
  setEmployeeToDelete(employee); // ← DEVE SER O OBJETO COMPLETO
  setShowDeleteModal(true);
}, []);


  // ✅ CORRIGIR FUNÇÃO handleSoftDelete COM DEBUG
  const handleSoftDelete = useCallback(async (employeeId) => {
    console.log('🔍 handleSoftDelete chamado com ID:', employeeId); // ✅ DEBUG

    if (!employeeId) {
      console.error('❌ Employee ID é undefined!');
      alert('Erro: ID do funcionário não encontrado!');
      return;
    }

    if (useAPI) {
      try {
        setDeleteLoading(true);
        console.log('🔍 Chamando employeesService.inactivate com ID:', employeeId);
        await employeesService.inactivate(employeeId);
        alert('Funcionário inativado com sucesso!');
        await loadEmployeesFromAPI();
        await loadEmployeeLinks();
      } catch (error) {
        console.error('Erro ao inativar funcionário:', error);
        alert('Erro ao inativar funcionário via API');
      } finally {
        setDeleteLoading(false);
      }
    } else {
      setEmployees(prev =>
        prev.map(emp => emp.id === employeeId ? { ...emp, status: 'INATIVO' } : emp)
      );
      alert('Funcionário inativado com sucesso!');
    }
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  }, [useAPI, loadEmployeesFromAPI, loadEmployeeLinks]);

  const handleHardDelete = useCallback(async (employeeId) => {
    console.log('🔍 handleHardDelete chamado com ID:', employeeId); // ✅ DEBUG

    if (!employeeId) {
      console.error('❌ Employee ID é undefined!');
      alert('Erro: ID do funcionário não encontrado!');
      return;
    }

    if (useAPI) {
      try {
        setDeleteLoading(true);
        await employeesService.delete(employeeId);
        alert('Funcionário deletado permanentemente!');
        await loadEmployeesFromAPI();
        await loadEmployeeLinks();
      } catch (error) {
        console.error('Erro ao deletar funcionário:', error);
        alert('Erro ao deletar funcionário via API');
      } finally {
        setDeleteLoading(false);
      }
    } else {
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      alert('Funcionário deletado permanentemente!');
    }
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  }, [useAPI, loadEmployeesFromAPI, loadEmployeeLinks]);

  // ✅ AÇÕES DO HEADER COM CORES OL
  const headerActions = useMemo(() => {
    const actions = [
      <Button
        key="new"
        variant="primary"
        icon={UserPlus}
        onClick={() => setShowAddModal(true)}
        style={{
          backgroundColor: OL_COLORS.primary,
          borderColor: OL_COLORS.primary,
          color: 'white'
        }}
      >
        Novo Colaborador
      </Button>
    ];

    if (setCurrentPage) {
      actions.push(
       <Button
  key="links"
  variant="warning"
  icon={Link}
  onClick={() => setCurrentPage('employee-knowledge')}
  style={{
    backgroundColor: OL_COLORS.accent || '#f59e0b',  // ✅ COR DE DESTAQUE
    borderColor: OL_COLORS.accent || '#f59e0b',
    color: '#ffffff'
  }}
>
  Vínculos ({employeeLinks.length})
</Button>
      );
    }

    if (useAPI) {
      actions.push(
        <Button
          key="refresh"
          variant="ghost"
          icon={RefreshCw}
          onClick={refreshEmployeeLinks}
          style={{
            color: OL_COLORS.primary,
            borderColor: OL_COLORS.light
          }}
        >
          Atualizar
        </Button>
      );
    }

    return actions;
  }, [employeeLinks.length, setCurrentPage, useAPI, refreshEmployeeLinks]);

  if (loading && !employees.length) {
    return <Loading fullScreen text={useAPI ? 'Carregando dados da API...' : 'Carregando...'} />;
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

      {/* Mode Indicator */}
      <ModeIndicator
        useAPI={useAPI}
        error={error}
        employeeLinksCount={employeeLinks.length}
      />

      {/* ✅ HEADER COM AÇÕES E CORES OL */}
      <PageHeader
        title="Colaboradores"
        subtitle={`Sistema completo de gestão de colaboradores e competências • ${currentTime.toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'})}`}
        breadcrumbs={['Dashboard', 'Colaboradores']}
        actions={headerActions}
      />

      {/* ✅ ESTATÍSTICAS COMO STATCARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Colaboradores"
          value={stats.total}
          subtitle="Cadastrados no sistema"
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Colaboradores Ativos"
          value={stats.ativos}
          subtitle="Trabalhando atualmente"
          icon={Award}
          color="green"
        />

        <StatCard
          title="Em Férias"
          value={stats.ferias}
          subtitle="Aproveitando o descanso"
          icon={Clock}
          color="orange"
        />

        <StatCard
          title="Vínculos de Conhecimento"
          value={employeeLinks.length}
          subtitle="Competências mapeadas"
          icon={Link}
          color="purple"
        />
      </div>

      {/* ✅ FILTROS EM SEÇÃO SEPARADA */}
      <PageSection title="Filtros e Busca">
        <EmployeeFilters
          filters={filters}
          setFilters={setFilters}
          totalEmployees={employees.length}
          filteredCount={filteredEmployees.length}
        />
      </PageSection>

      {/* ✅ COLABORADORES EM SEÇÃO SEPARADA */}
      <PageSection title={`Colaboradores (${filteredEmployees.length})`}>
        {filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                employeeLinks={employeeLinks}
                onViewDetails={openDetailModal}
                onEdit={openEditModal}
                onDelete={handleDeleteEmployee}
                onManageLinks={handleManageLinks}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="Nenhum colaborador encontrado"
            description={
              filters.search || filters.equipe || filters.nivel || filters.status
                ? 'Tente ajustar os filtros para encontrar colaboradores.'
                : 'Comece adicionando o primeiro colaborador da equipe.'
            }
            actionLabel="Adicionar Primeiro Colaborador"
            onAction={() => setShowAddModal(true)}
          />
        )}
      </PageSection>

    {/* ✅ MODAIS CORRIGIDOS COMPLETAMENTE */}
<EmployeeDetailModal
  isOpen={showDetailModal}
  onClose={() => {
    console.log('🔍 Fechando modal de detalhes');
    setShowDetailModal(false);
    setSelectedEmployee(null);
  }}
  employee={selectedEmployee}
  setSelectedEmployee={setSelectedEmployee}
  setEmployees={setEmployees}
  employeeKnowledge={employeeLinks}
  setEmployeeKnowledge={setEmployeeLinks}
  knowledgeCatalog={knowledgeData} // ✅ CORREÇÃO
  onShowAddKnowledgeModal={handleShowAddKnowledgeModal}
  onFileUpload={handleFileUpload}
  onEdit={openEditModal}
/>

<AddEmployeeModal
  isOpen={showAddModal}
  onClose={() => setShowAddModal(false)}
  newEmployee={newEmployee}
  setNewEmployee={setNewEmployee}
  onAddEmployee={handleAddEmployee}
  onPhotoUpload={handlePhotoUpload}
  useAPI={useAPI}
  adminData={realData}
  adminLoading={adminLoading}
/>

<EditEmployeeModal
  isOpen={showEditModal}
  onClose={() => {
    setShowEditModal(false);
    setEditingEmployee(null);
  }}
  editingEmployee={editingEmployee}
  setEditingEmployee={setEditingEmployee}
  onEditEmployee={handleEditEmployee}
  onPhotoUpload={handlePhotoUpload}
  useAPI={useAPI}
  adminData={realData}
  adminLoading={adminLoading}
/>

{/* ✅ CORREÇÃO FINAL - ConfirmDeleteModal */}
<ConfirmDeleteModal
  isOpen={showDeleteModal}
  onClose={() => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  }}
  employee={employeeToDelete}
  onInactivate={() => {
    console.log('🔍 EmployeesPage - Inativar clicked, employeeToDelete:', employeeToDelete);
    console.log('🔍 EmployeesPage - employeeToDelete type:', typeof employeeToDelete);
    console.log('🔍 EmployeesPage - employeeToDelete.id:', employeeToDelete?.id);

    // ✅ VERIFICAÇÃO CORRIGIDA - DEVE SER OBJETO COM PROPRIEDADE ID
    if (employeeToDelete && typeof employeeToDelete === 'object' && employeeToDelete.id) {
      handleSoftDelete(employeeToDelete.id);
    } else {
      console.error('❌ employeeToDelete não é um objeto válido:', employeeToDelete);
      alert('Erro: Funcionário não identificado para inativar!');
    }
  }}
  onDelete={() => {
    console.log('🔍 EmployeesPage - Delete clicked, employeeToDelete:', employeeToDelete);
    console.log('🔍 EmployeesPage - employeeToDelete type:', typeof employeeToDelete);
    console.log('🔍 EmployeesPage - employeeToDelete.id:', employeeToDelete?.id);

    // ✅ VERIFICAÇÃO CORRIGIDA - DEVE SER OBJETO COM PROPRIEDADE ID
    if (employeeToDelete && typeof employeeToDelete === 'object' && employeeToDelete.id) {
      handleHardDelete(employeeToDelete.id);
    } else {
      console.error('❌ employeeToDelete não é um objeto válido:', employeeToDelete);
      alert('Erro: Funcionário não identificado para deletar!');
    }
  }}
  loading={deleteLoading}
/>


{/* ✅ MODAL DE VÍNCULOS PARA COLABORADOR ESPECÍFICO */}
<EmployeeKnowledgeModal
  isOpen={showLinkModal}
  onClose={handleCloseLinkModal}
  editingLink={null}
  employees={employees}
  knowledge={knowledgeData} // ✅ CORREÇÃO
  onSave={handleSaveLinkModal}
  preSelectedEmployee={selectedEmployeeForLink}
/>

{/* ✅ MODAL DE ADICIONAR CONHECIMENTO */}
<AddKnowledgeModal
  isOpen={showAddKnowledgeModal}
  onClose={() => {
    setShowAddKnowledgeModal(false);
    setSelectedEmployee(null);
  }}
  selectedEmployee={selectedEmployee}
  knowledgeCatalog={knowledgeData} // ✅ CORREÇÃO
  onAddKnowledge={handleAddKnowledge}
  onFileUpload={handleFileUpload}
/>


    </PageContainer>
  );
};

export default EmployeesPage;
