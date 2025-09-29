import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Users, Plus, Link, RefreshCw, UserPlus, Settings, TrendingUp, AlertTriangle, Award, Clock } from 'lucide-react';

// Data e Utils
import { initialEmployees } from './data/mockData';
import { calcularStatusFerias } from './utils/vacationCalculations';
import { filterEmployees } from './utils/employeeUtils';

// API Services
import { employeesService } from '../../services/employeesService';

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
  }
};

const employeeKnowledgeService = {
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.employee_id) params.append('employee_id', filters.employee_id);
      if (filters.knowledge_id) params.append('knowledge_id', filters.knowledge_id);
      if (filters.status) params.append('status', filters.status);

      const url = `/employee-knowledge${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar vínculos:', error);
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
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-sm font-medium">Modo Mock Ativo - Dados de demonstração</span>
      </div>
    )}
    {error && (
      <div className="mt-2 text-sm text-red-600">{error}</div>
    )}
  </PageSection>
);

const EmployeesPage = ({ onBackToDashboard, useAPI = false, setCurrentPage }) => {
  // Estados principais
  const [employees, setEmployees] = useState(initialEmployees);
  const [filters, setFilters] = useState({ search: '', equipe: '', nivel: '', status: '' });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [employeeLinks, setEmployeeLinks] = useState([]);

  // Estados para API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados dos modais
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    endereco: { rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' },
    competencias: [], avatar: null,
    manager_id: null, team_id: null, access_level: 'COLABORADOR',
    pdi: { data_ultimo: null, data_atual: null, data_proximo: null, status: "NUNCA_AGENDADO", checks: [], historico: [] },
    reunioes_1x1: { data_ultimo: null, data_atual: null, data_proximo: null, status: "NUNCA_AGENDADO", historico: [] },
    ferias: { ultimo_periodo: null, proximo_periodo: null, dias_disponivel: 30, status: "SEM_DIREITO", historico: [], ferias_vencidas: 0, pode_vender: 10 },
    dayoff: { mes_aniversario: null, usado_ano_atual: false, data_usado: null, data_ultimo: null, data_atual: null, data_proximo: null, historico: [] }
  });

  // ✅ FUNÇÃO PARA CARREGAR VÍNCULOS
  const loadEmployeeLinks = useCallback(async () => {
    try {
      const links = await employeeKnowledgeService.getAll();
      setEmployeeLinks(links);
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

      const apiEmployees = await employeesService.getAll();

      const transformedEmployees = apiEmployees.map(emp => ({
        ...emp,
        equipe: emp.area || emp.equipe || 'N/A',
        competencias: emp.competencias || [],
        endereco: emp.endereco || { rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' },
        pdi: emp.pdi || { data_ultimo: null, data_atual: null, data_proximo: null, status: "NUNCA_AGENDADO", checks: [], historico: [] },
        reunioes_1x1: emp.reunioes_1x1 || { data_ultimo: null, data_atual: null, data_proximo: null, status: "NUNCA_AGENDADO", historico: [] },
        ferias: emp.ferias || { ultimo_periodo: null, proximo_periodo: null, dias_disponivel: 30, status: "SEM_DIREITO", historico: [], ferias_vencidas: 0, pode_vender: 10 },
        dayoff: emp.dayoff || { mes_aniversario: null, usado_ano_atual: false, data_usado: null, data_ultimo: null, data_atual: null, data_proximo: null, historico: [] }
      }));

      setEmployees(transformedEmployees);

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
    } else {
      setEmployees(initialEmployees);
      setEmployeeLinks([]);
      setError(null);
    }
  }, [useAPI, loadEmployeesFromAPI, loadEmployeeLinks]);

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

  // ✅ HANDLERS OTIMIZADOS
  const handleManageLinks = useCallback((employee) => {
    if (setCurrentPage) {
      setCurrentPage('employee-knowledge');
    } else {
      alert(`Navegando para vínculos de ${employee.nome}`);
    }
  }, [setCurrentPage]);

  const openDetailModal = useCallback((employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
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
      const dataNascimento = new Date(newEmployee.data_nascimento);
      setEmployees(prev => [...prev, {
        ...newEmployee,
        id: newId,
        salario: parseFloat(newEmployee.salario) || 0,
        dayoff: { ...newEmployee.dayoff, mes_aniversario: dataNascimento.getMonth() + 1 }
      }]);
    }

    setNewEmployee({
      nome: '', email: '', telefone: '', cpf: '', rg: '', data_nascimento: '',
      estado_civil: 'SOLTEIRO', cargo: '', equipe: '', nivel: 'JUNIOR', status: 'ATIVO',
      data_admissao: new Date().toISOString().split('T')[0], salario: '',
      endereco: { rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' },
      competencias: [], avatar: null,
      manager_id: null, team_id: null, access_level: 'COLABORADOR',
      pdi: { data_ultimo: null, data_atual: null, data_proximo: null, status: "NUNCA_AGENDADO", checks: [], historico: [] },
      reunioes_1x1: { data_ultimo: null, data_atual: null, data_proximo: null, status: "NUNCA_AGENDADO", historico: [] },
      ferias: { ultimo_periodo: null, proximo_periodo: null, dias_disponivel: 30, status: "SEM_DIREITO", historico: [], ferias_vencidas: 0, pode_vender: 10 },
      dayoff: { mes_aniversario: null, usado_ano_atual: false, data_usado: null, data_ultimo: null, data_atual: null, data_proximo: null, historico: [] }
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

  const handleDeleteEmployee = useCallback((employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setEmployeeToDelete(employee);
      setShowDeleteModal(true);
    }
  }, [employees]);

  const handleSoftDelete = useCallback(async (employeeId) => {
    if (useAPI) {
      try {
        setDeleteLoading(true);
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

  // ✅ AÇÕES DO HEADER
  const headerActions = useMemo(() => {
    const actions = [
      <Button
        key="new"
        variant="primary"
        icon={UserPlus}
        onClick={() => setShowAddModal(true)}
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
        >
          Todos os Vínculos ({employeeLinks.length})
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
        >
          Atualizar
        </Button>
      );
    }

    return actions;
  }, [employeeLinks.length, setCurrentPage, useAPI, refreshEmployeeLinks]);

  if (loading) {
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

      {/* Header */}
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

      {/* ✅ AÇÕES EM CARDS SEPARADOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-ol-brand-300"
          onClick={() => setShowAddModal(true)}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-ol-brand-50 text-ol-brand-600 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Novo Colaborador</h3>
              <p className="text-sm text-gray-500">Adicionar membro à equipe</p>
            </div>
          </div>
        </div>

        {setCurrentPage && (
          <div
            className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-yellow-300"
            onClick={() => setCurrentPage('employee-knowledge')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center">
                <Link className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gerenciar Vínculos</h3>
                <p className="text-sm text-gray-500">{employeeLinks.length} vínculos ativos</p>
              </div>
            </div>
          </div>
        )}

        {useAPI && (
          <div
            className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-gray-300"
            onClick={refreshEmployeeLinks}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Atualizar Dados</h3>
                <p className="text-sm text-gray-500">Sincronizar com servidor</p>
              </div>
            </div>
          </div>
        )}
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

      {/* Modais */}
      <EmployeeDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        setEmployees={setEmployees}
        employees={employees}
        onManageLinks={handleManageLinks}
        employeeLinks={employeeLinks}
        setEmployeeLinks={setEmployeeLinks}
      />

      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        newEmployee={newEmployee}
        setNewEmployee={setNewEmployee}
        onAddEmployee={handleAddEmployee}
        onPhotoUpload={handlePhotoUpload}
        employees={employees}
        useAPI={useAPI}
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
        employees={employees}
        useAPI={useAPI}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setEmployeeToDelete(null);
        }}
        employee={employeeToDelete}
        onInactivate={handleSoftDelete}
        onDelete={handleHardDelete}
        loading={deleteLoading}
      />
    </PageContainer>
  );
};

export default EmployeesPage;
