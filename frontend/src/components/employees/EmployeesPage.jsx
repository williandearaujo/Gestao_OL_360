import React, { useState, useMemo, useEffect } from 'react';

// Data e Utils
import { initialEmployees } from './data/mockData';
import { calcularStatusFerias } from './utils/vacationCalculations';
import { filterEmployees } from './utils/employeeUtils';

// API Services
import { employeesService } from '../../services/employeesService';

// Components
import EmployeeStats from './components/EmployeeStats';
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeCard from './components/EmployeeCard';

// Modals
import EmployeeDetailModal from './modals/EmployeeDetailModal';
import AddEmployeeModal from './modals/AddEmployeeModal';
import EditEmployeeModal from './modals/EditEmployeeModal';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';

// ✅ SERVIÇO INLINE PARA VÍNCULOS (evita import problemático)
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
      console.log('🔍 Buscando vínculos:', url);

      const response = await api.get(url);
      console.log('✅ Vínculos recebidos:', response.data?.length || 0);

      return response.data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar vínculos:', error);
      return [];
    }
  }
};

const EmployeesPage = ({ onBackToDashboard, useAPI = false, setCurrentPage }) => {
  // Estados principais
  const [employees, setEmployees] = useState(initialEmployees);
  const [filters, setFilters] = useState({ search: '', equipe: '', nivel: '', status: '' });
  const [currentTime, setCurrentTime] = useState(new Date());

  // ✅ ESTADO PARA VÍNCULOS
  const [employeeLinks, setEmployeeLinks] = useState([]);

  // Estados para API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados dos modais
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Estados para delete inteligente
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Estados dos colaboradores
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Estados para vínculos
  const [selectedEmployeeForLinks, setSelectedEmployeeForLinks] = useState(null);

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
  const loadEmployeeLinks = async () => {
    try {
      console.log('📊 Carregando vínculos dos colaboradores...');
      const links = await employeeKnowledgeService.getAll();
      console.log('✅ Vínculos carregados:', links.length);
      setEmployeeLinks(links);
    } catch (error) {
      console.error('❌ Erro ao carregar vínculos:', error);
      setEmployeeLinks([]);
    }
  };

  // ✅ ALTERNAR ENTRE MOCK E API (CORRIGIDO)
  useEffect(() => {
    console.log('EmployeesPage - useAPI changed:', useAPI);
    if (useAPI) {
      loadEmployeesFromAPI();
      loadEmployeeLinks(); // ✅ CARREGAR VÍNCULOS TAMBÉM
    } else {
      setEmployees(initialEmployees);
      setEmployeeLinks([]); // ✅ LIMPAR VÍNCULOS
      setError(null);
    }
  }, [useAPI]);

  // Carregar dados da API
  const loadEmployeesFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Carregando funcionários da API...');

      const apiEmployees = await employeesService.getAll();
      console.log('Funcionários da API:', apiEmployees);

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
  };

  // Update horário Brasília
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
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

  // Estatísticas
  const stats = useMemo(() => {
    const total = employees.length;
    const ativos = employees.filter(emp => emp.status === 'ATIVO').length;
    const inativos = employees.filter(emp => emp.status === 'INATIVO').length;
    const ferias = employees.filter(emp => emp.status === 'FERIAS').length;
    const licenca = employees.filter(emp => emp.status === 'LICENCA').length;

    const porEquipe = {
      'Red Team': employees.filter(emp => emp.equipe === 'Red Team').length,
      'Blue Team': employees.filter(emp => emp.equipe === 'Blue Team').length,
      'SOC Team': employees.filter(emp => emp.equipe === 'SOC Team').length,
      'Compliance Team': employees.filter(emp => emp.equipe === 'Compliance Team').length,
      'Comercial': employees.filter(emp => emp.equipe === 'Comercial').length,
      'Tecnologia': employees.filter(emp => emp.equipe === 'Tecnologia').length,
      'Administrativo': employees.filter(emp => emp.equipe === 'Administrativo').length,
      'Operacional': employees.filter(emp => emp.equipe === 'Operacional').length,
      'Financeiro': employees.filter(emp => emp.equipe === 'Financeiro').length
    };

    return { total, ativos, inativos, ferias, licenca, porEquipe };
  }, [employees]);

  // Colaboradores filtrados
  const filteredEmployees = useMemo(() => {
    return filterEmployees(employees, filters);
  }, [employees, filters]);

  // ✅ FUNÇÃO PARA GERENCIAR VÍNCULOS
  const handleManageLinks = (employee) => {
    console.log('🔗 Navegando para vínculos do colaborador:', employee.nome);
    setSelectedEmployeeForLinks(employee);
    if (setCurrentPage) {
      setCurrentPage('employee-knowledge');
    } else {
      alert(`Navegando para vínculos de ${employee.nome}`);
    }
  };

  // Modal handlers
  const openDetailModal = (employee) => {
    console.log('👁️ Abrindo modal detalhes para:', employee.nome);
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const openEditModal = (employee) => {
    console.log('✏️ Abrindo modal edição para:', employee.nome);
    setEditingEmployee({ ...employee });
    setShowEditModal(true);
  };

  // Upload de foto
  const handlePhotoUpload = (event, isEditing = false) => {
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
  };

  // ✅ FUNÇÃO PARA REFRESH DE VÍNCULOS
  const refreshEmployeeLinks = async () => {
    console.log('🔄 Refreshing employee links...');
    await loadEmployeeLinks();
  };

  // Adicionar colaborador (Mock ou API)
  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (useAPI) {
      try {
        setLoading(true);
        const employeeData = {
          ...newEmployee,
          area: newEmployee.equipe,
          user_id: 1
        };

        await employeesService.create(employeeData);
        alert('Funcionário criado com sucesso!');
        await loadEmployeesFromAPI();
        await loadEmployeeLinks(); // ✅ REFRESH VÍNCULOS

      } catch (error) {
        console.error('Erro ao criar funcionário:', error);
        alert('Erro ao criar funcionário via API');
      } finally {
        setLoading(false);
      }
    } else {
      const newId = Math.max(...employees.map(emp => emp.id)) + 1;
      const dataNascimento = new Date(newEmployee.data_nascimento);
      setEmployees(prev => [
        ...prev,
        {
          ...newEmployee,
          id: newId,
          salario: parseFloat(newEmployee.salario) || 0,
          dayoff: {
            ...newEmployee.dayoff,
            mes_aniversario: dataNascimento.getMonth() + 1
          }
        }
      ]);
    }

    // Reset form
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
  };

  // Editar colaborador
  const handleEditEmployee = async (e) => {
    e.preventDefault();

    if (useAPI) {
      try {
        setLoading(true);
        const employeeData = {
          ...editingEmployee,
          area: editingEmployee.equipe
        };

        await employeesService.update(editingEmployee.id, employeeData);
        alert('Funcionário atualizado com sucesso!');
        await loadEmployeesFromAPI();
        await loadEmployeeLinks(); // ✅ REFRESH VÍNCULOS

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
  };

  // Deletar colaborador inteligente
  const handleDeleteEmployee = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setEmployeeToDelete(employee);
      setShowDeleteModal(true);
    }
  };

  // Soft delete (inativar)
  const handleSoftDelete = async (employeeId) => {
    if (useAPI) {
      try {
        setDeleteLoading(true);
        await employeesService.inactivate(employeeId);
        alert('Funcionário inativado com sucesso!');
        await loadEmployeesFromAPI();
        await loadEmployeeLinks(); // ✅ REFRESH VÍNCULOS
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
  };

  // Hard delete (deletar permanente)
  const handleHardDelete = async (employeeId) => {
    if (useAPI) {
      try {
        setDeleteLoading(true);
        await employeesService.delete(employeeId);
        alert('Funcionário deletado permanentemente!');
        await loadEmployeesFromAPI();
        await loadEmployeeLinks(); // ✅ REFRESH VÍNCULOS
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
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ol-brand-600 mx-auto mb-4"></div>
            <p className="text-ol-gray-600">
              {useAPI ? 'Carregando dados da API...' : 'Carregando...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Header com botão voltar */}
      <div className="flex items-center mb-4">
        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex-1">
          {/* Indicador de modo */}
          <div className="mb-4 p-3 rounded-lg border">
            {useAPI ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Modo API Ativo - Dados do servidor</span>
                <span className="text-xs text-green-600 ml-2">
                  ({employeeLinks.length} vínculos carregados)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-2 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Modo Mock Ativo - Dados de demonstração</span>
              </div>
            )}
            {error && (
              <div className="mt-2 text-sm text-red-600">{error}</div>
            )}
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-ol-brand-500">Gestão 360 OL - Colaboradores</h1>
          <p className="text-ol-gray-600 mt-1 text-sm sm:text-base">Sistema completo de gestão de colaboradores e competências</p>
          <div className="text-xs text-ol-gray-500 mt-1">
            Horário Brasília: {currentTime.toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'})}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-ol-brand-500 text-white rounded-lg hover:bg-ol-brand-600 transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Novo Colaborador</span>
          </button>

          {/* Botão - Gerenciar Todos os Vínculos */}
          {setCurrentPage && (
            <button
              onClick={() => setCurrentPage('employee-knowledge')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Todos os Vínculos ({employeeLinks.length})</span>
            </button>
          )}

          {/* ✅ BOTÃO REFRESH VÍNCULOS */}
          {useAPI && (
            <button
              onClick={refreshEmployeeLinks}
              title="Atualizar vínculos"
              className="flex items-center justify-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      <EmployeeStats stats={stats} />

      {/* Filtros */}
      <EmployeeFilters
        filters={filters}
        setFilters={setFilters}
        totalEmployees={employees.length}
        filteredCount={filteredEmployees.length}
      />

      {/* ✅ GRID DE COLABORADORES COM VÍNCULOS */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {filteredEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            employeeLinks={employeeLinks}  // ✅ PROP COM VÍNCULOS
            onViewDetails={openDetailModal}
            onEdit={openEditModal}
            onDelete={handleDeleteEmployee}
            onManageLinks={handleManageLinks}
          />
        ))}
      </div>

      {/* Lista vazia */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <svg className="w-16 h-16 mx-auto text-ol-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-medium text-ol-gray-900 mb-2">Nenhum colaborador encontrado</h3>
          <p className="text-ol-gray-500 mb-4">
            {filters.search || filters.equipe || filters.nivel || filters.status
              ? 'Tente ajustar os filtros para encontrar colaboradores.'
              : 'Comece adicionando o primeiro colaborador da equipe.'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600"
          >
            Adicionar Primeiro Colaborador
          </button>
        </div>
      )}

      {/* ✅ MODAIS CORRIGIDOS */}
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
    </div>
  );
};

export default EmployeesPage;
