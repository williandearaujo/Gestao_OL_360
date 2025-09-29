import React, { useState, useMemo } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { useKnowledge } from '../../hooks/useKnowledge';
import { useEmployeeKnowledge } from '../../hooks/useEmployeeKnowledge';

// Componentes (manter os imports do seu projeto atual)
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeStats from './components/EmployeeStats';
import EmployeeCard from './components/EmployeeCard';
import TabButton from './components/TabButton';
import AddEmployeeModal from './modals/AddEmployeeModal';
import EditEmployeeModal from './modals/EditEmployeeModal';
import EmployeeDetailModal from './modals/EmployeeDetailModal';
import AddKnowledgeModal from './modals/AddKnowledgeModal';

const EmployeesPageIntegrated = ({ onBackToDashboard }) => {
  // Hooks da API
  const {
    employees,
    loading: employeesLoading,
    error: employeesError,
    createEmployee,
    updateEmployee,
    deleteEmployee
  } = useEmployees();

  const { knowledge, loading: knowledgeLoading } = useKnowledge();
  const { addKnowledgeToEmployee } = useEmployeeKnowledge();

  // Estados da interface
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddKnowledgeModal, setShowAddKnowledgeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [filters, setFilters] = useState({
    search: '',
    area: '',
    nivel: '',
    status: ''
  });

  // Loading state
  if (employeesLoading || knowledgeLoading) {
    return (
      <div className="min-h-screen bg-ol-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ol-brand-600 mx-auto"></div>
          <p className="mt-4 text-ol-gray-600">Carregando funcionários...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (employeesError) {
    return (
      <div className="min-h-screen bg-ol-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar funcionários</h3>
          <p className="text-gray-600 mb-4">{employeesError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-ol-brand-600 text-white rounded hover:bg-ol-brand-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Calcular estatísticas dos funcionários reais
  const stats = useMemo(() => {
    const total = employees.length;
    const ativo = employees.filter(emp => emp.status === 'ATIVO').length;
    const inativo = employees.filter(emp => emp.status === 'INATIVO').length;
    const ferias = employees.filter(emp => emp.status === 'FERIAS').length;

    // Áreas
    const areaCount = employees.reduce((acc, emp) => {
      acc[emp.area] = (acc[emp.area] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      ativo,
      inativo,
      ferias,
      areas: areaCount
    };
  }, [employees]);

  // Filtros
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = !filters.search ||
        employee.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesArea = !filters.area || employee.area === filters.area;
      const matchesNivel = !filters.nivel || employee.nivel === filters.nivel;
      const matchesStatus = !filters.status || employee.status === filters.status;
      return matchesSearch && matchesArea && matchesNivel && matchesStatus;
    });
  }, [employees, filters]);

  // Handlers
  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      await createEmployee(employeeData);
      setShowAddModal(false);
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      alert('Erro ao criar funcionário. Tente novamente.');
    }
  };

  const handleUpdateEmployee = async (employeeData) => {
    try {
      await updateEmployee(selectedEmployee.id, employeeData);
      setShowEditModal(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      alert('Erro ao atualizar funcionário. Tente novamente.');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await deleteEmployee(employeeId);
      } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        alert('Erro ao excluir funcionário. Tente novamente.');
      }
    }
  };

  const handleAddKnowledge = async (knowledgeData) => {
    try {
      await addKnowledgeToEmployee(selectedEmployee.id, knowledgeData);
      setShowAddKnowledgeModal(false);
      // Recarregar dados do funcionário se necessário
    } catch (error) {
      console.error('Erro ao adicionar conhecimento:', error);
      alert('Erro ao adicionar conhecimento. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-ol-gray-50 p-3 sm:p-6" style={{ minWidth: '100vw' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="p-2 text-ol-gray-600 hover:text-ol-brand-600 hover:bg-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-ol-gray-900">Funcionários</h1>
              <p className="text-ol-gray-600">Gerencie sua equipe e suas informações</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-ol-brand-600 hover:bg-ol-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Novo Funcionário
          </button>
        </div>
      </div>

      {/* Stats */}
      <EmployeeStats stats={stats} />

      {/* Filters */}
      <EmployeeFilters
        filters={filters}
        onFiltersChange={setFilters}
        employees={employees}
      />

      {/* Grid de Funcionários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEmployees.map(employee => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onView={() => handleViewEmployee(employee)}
            onEdit={() => handleEditEmployee(employee)}
            onDelete={() => handleDeleteEmployee(employee.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-ol-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-medium text-ol-gray-900 mb-2">Nenhum funcionário encontrado</h3>
          <p className="text-ol-gray-600">Tente ajustar os filtros ou adicione um novo funcionário.</p>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddEmployee}
        />
      )}

      {showEditModal && selectedEmployee && (
        <EditEmployeeModal
          employee={selectedEmployee}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEmployee(null);
          }}
          onSave={handleUpdateEmployee}
        />
      )}

      {showDetailModal && selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedEmployee(null);
            setActiveTab('profile');
          }}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onEdit={() => {
            setShowDetailModal(false);
            setShowEditModal(true);
          }}
          onAddKnowledge={() => {
            setShowDetailModal(false);
            setShowAddKnowledgeModal(true);
          }}
          knowledge={knowledge}
        />
      )}

      {showAddKnowledgeModal && selectedEmployee && (
        <AddKnowledgeModal
          employee={selectedEmployee}
          knowledge={knowledge}
          onClose={() => setShowAddKnowledgeModal(false)}
          onSave={handleAddKnowledge}
        />
      )}
    </div>
  );
};

export default EmployeesPageIntegrated;
