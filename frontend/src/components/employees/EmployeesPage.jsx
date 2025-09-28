import React, { useState, useMemo, useEffect } from 'react';

// Data e Utils
import { initialEmployees } from './data/mockData';
import { knowledgeCatalog } from '../knowledge/mockKnowledgeData';
import { employeeKnowledge as initialEmployeeKnowledge } from '../knowledge/mockEmployeeKnowledge';
import { calcularStatusFerias } from './utils/vacationCalculations';
import { filterEmployees } from './utils/employeeUtils';

// Components
import EmployeeStats from './components/EmployeeStats';
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeCard from './components/EmployeeCard';

// Modals
import EmployeeDetailModal from './modals/EmployeeDetailModal';
import AddEmployeeModal from './modals/AddEmployeeModal';
import EditEmployeeModal from './modals/EditEmployeeModal';
import AddKnowledgeModal from './modals/AddKnowledgeModal';

const EmployeesPage = ({ onBackToDashboard }) => {
  // Estados principais
  const [employees, setEmployees] = useState(initialEmployees);
  const [employeeKnowledge, setEmployeeKnowledge] = useState(initialEmployeeKnowledge);
  const [filters, setFilters] = useState({ search: '', equipe: '', nivel: '', status: '' });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Estados dos modais
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddKnowledgeModal, setShowAddKnowledgeModal] = useState(false);

  // Estados dos colaboradores
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Estado para novo vínculo de conhecimento
  const [newKnowledge, setNewKnowledge] = useState({
    knowledge_id: '',
    status: 'DESEJADO',
    data_obtencao: '',
    data_alvo: '',
    anexo: null
  });

  // Estado para novo colaborador ✅ CORRIGIDO
  const [newEmployee, setNewEmployee] = useState({
    nome: '', email: '', telefone: '', cpf: '', rg: '', data_nascimento: '',
    estado_civil: 'SOLTEIRO', cargo: '', equipe: '', nivel: 'JUNIOR', status: 'ATIVO',
    data_admissao: new Date().toISOString().split('T')[0], salario: '',
    endereco: { rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' },
    competencias: [], avatar: null,
    manager_id: null,            // ✅ ADICIONADO
    access_level: 'COLABORADOR', // ✅ ADICIONADO
    pdi: { data_ultimo: null, data_atual: null, data_proximo: null, status: "NUNCA_AGENDADO", checks: [], historico: [] },
    reunioes_1x1: { data_ultimo: null, data_atual: null, data_proximo: null, status: "NUNCA_AGENDADO", historico: [] },
    ferias: { ultimo_periodo: null, proximo_periodo: null, dias_disponivel: 30, status: "SEM_DIREITO", historico: [], ferias_vencidas: 0, pode_vender: 10 },
    dayoff: { mes_aniversario: null, usado_ano_atual: false, data_usado: null, data_ultimo: null, data_atual: null, data_proximo: null, historico: [] }
  });

  // Update horário Brasília
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Atualizar automaticamente status das férias
  useEffect(() => {
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
  }, [currentTime]);

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
      'Compliance Team': employees.filter(emp => emp.equipe === 'Compliance Team').length
    };

    const conhecimentosObtidos = employeeKnowledge.filter(ek => ek.status === 'OBTIDO').length;
    const conhecimentosDesejados = employeeKnowledge.filter(ek => ek.status === 'DESEJADO').length;

    return { 
      total, ativos, inativos, ferias, licenca, porEquipe, 
      conhecimentosObtidos, conhecimentosDesejados
    };
  }, [employees, employeeKnowledge]);

  // Colaboradores filtrados
  const filteredEmployees = useMemo(() => {
    return filterEmployees(employees, filters);
  }, [employees, filters]);

  // Modal handlers
  const openDetailModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const openEditModal = (employee) => {
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

  // Upload de anexo
  const handleFileUpload = (event, _, isNew = false) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Apenas imagens (JPEG, PNG) ou PDF são permitidos!');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande! Máximo 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target.result;
        if (isNew) {
          setNewKnowledge(prev => ({ ...prev, anexo: fileData }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Adicionar vínculo colaborador <-> conhecimento
  const handleAddKnowledge = () => {
    if (!newKnowledge.knowledge_id) {
      alert('Selecione um conhecimento!');
      return;
    }
    const novaId = Math.max(0, ...employeeKnowledge.map(link => link.id || 0)) + 1;
    const knowledgeObj = knowledgeCatalog.find(k => k.id === parseInt(newKnowledge.knowledge_id));
    if (!knowledgeObj) {
      alert('Conhecimento não encontrado!');
      return;
    }
    const novoVinculo = {
      id: novaId,
      employee_id: selectedEmployee.id,
      learning_item_id: parseInt(newKnowledge.knowledge_id),
      status: newKnowledge.status,
      prioridade: 'MEDIA',
      data_obtencao: newKnowledge.status === 'OBTIDO' ? newKnowledge.data_obtencao : null,
      data_expiracao: null,
      data_alvo: newKnowledge.status === 'DESEJADO' ? newKnowledge.data_alvo : null,
      anexo_path: newKnowledge.anexo || '',
      observacoes: ''
    };
    setEmployeeKnowledge(prev => [...prev, novoVinculo]);
    setNewKnowledge({ knowledge_id: '', status: 'DESEJADO', data_obtencao: '', data_alvo: '', anexo: null });
    setShowAddKnowledgeModal(false);
  };

  // Adicionar colaborador ✅ CORRIGIDO
  const handleAddEmployee = (e) => {
    e.preventDefault();
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
    setNewEmployee({
      nome: '', email: '', telefone: '', cpf: '', rg: '', data_nascimento: '',
      estado_civil: 'SOLTEIRO', cargo: '', equipe: '', nivel: 'JUNIOR', status: 'ATIVO',
      data_admissao: new Date().toISOString().split('T')[0], salario: '',
      endereco: { rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' },
      competencias: [], avatar: null,
      manager_id: null,
      access_level: 'COLABORADOR',
      pdi: { data_ultimo: null, data_atual: null, data_proximo: null, status: "NUNCA_AGENDADO", checks: [], historico: [] },
      reunioes_1x1: { data_ultimo: null, data_atual: null, data_proximo: null, status: "NUNCA_AGENDADO", historico: [] },
      ferias: { ultimo_periodo: null, proximo_periodo: null, dias_disponivel: 30, status: "SEM_DIREITO", historico: [], ferias_vencidas: 0, pode_vender: 10 },
      dayoff: { mes_aniversario: null, usado_ano_atual: false, data_usado: null, data_ultimo: null, data_atual: null, data_proximo: null, historico: [] }
    });
    setShowAddModal(false);
  };

  // Editar colaborador
  const handleEditEmployee = (e) => {
    e.preventDefault();
    setEmployees(prev => 
      prev.map(emp => emp.id === editingEmployee.id ? {
        ...editingEmployee,
        salario: parseFloat(editingEmployee.salario) || 0
      } : emp)
    );
    setShowEditModal(false);
    setEditingEmployee(null);
  };

  // Deletar colaborador
  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Tem certeza que deseja remover este colaborador?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      setEmployeeKnowledge(prev => prev.filter(link => link.employee_id !== employeeId));
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Header */}
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
      
      {/* Grid de Colaboradores */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {filteredEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            employeeKnowledge={employeeKnowledge}
            onViewDetails={openDetailModal}
            onEdit={openEditModal}
            onDelete={handleDeleteEmployee}
          />
        ))}
      </div>
      
      {/* Lista vazia */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <svg className="w-16 h-16 mx-auto text-ol-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
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

      {/* Modals ✅ CORRIGIDOS */}
      <EmployeeDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        setEmployees={setEmployees}
        employeeKnowledge={employeeKnowledge}
        setEmployeeKnowledge={setEmployeeKnowledge}
        knowledgeCatalog={knowledgeCatalog}
        onShowAddKnowledgeModal={() => setShowAddKnowledgeModal(true)}
        onFileUpload={handleFileUpload}
        employees={employees} // ✅ ADICIONADO
      />
      
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        newEmployee={newEmployee}
        setNewEmployee={setNewEmployee}
        onAddEmployee={handleAddEmployee}
        onPhotoUpload={handlePhotoUpload}
        employees={employees} // ✅ ADICIONADO
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
        employees={employees} // ✅ ADICIONADO
      />
      
      <AddKnowledgeModal
        isOpen={showAddKnowledgeModal}
        onClose={() => setShowAddKnowledgeModal(false)}
        selectedEmployee={selectedEmployee}
        newKnowledge={newKnowledge}
        setNewKnowledge={setNewKnowledge}
        onAddKnowledge={handleAddKnowledge}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default EmployeesPage;
