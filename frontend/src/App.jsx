import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import EmployeesPage from './components/employees/EmployeesPage';
import KnowledgePage from './components/knowledge/KnowledgePage';

// Novos dados mocks centralizados
import { initialEmployees } from './components/employees/data/mockData';
import { knowledgeCatalog, vendors, areas } from './components/knowledge/mockKnowledgeData';
import { employeeKnowledge } from './components/knowledge/mockEmployeeKnowledge';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [employees, setEmployees] = useState(initialEmployees);
  const [knowledge, setKnowledge] = useState(knowledgeCatalog);
  const [employeeKnowledgeData, setEmployeeKnowledgeData] = useState(employeeKnowledge);

  const DashboardContent = () => (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ol-brand-500 mb-2">
          Gestão OL 360
        </h1>
        <p className="text-ol-gray-600 text-sm sm:text-base">
          Sistema de Gestão de Analistas, Conhecimentos e Relacionamento
        </p>
        <p className="text-sm text-ol-brand-400 font-medium">OL Tecnologia</p>
      </div>

      {/* Cards Dashboard RESPONSIVO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Alertas Críticos */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ol-gray-600">Alertas Críticos</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">3</p>
              <p className="text-xs text-red-500 mt-1">Ação imediata</p>
            </div>
            <div className="bg-red-100 p-2 sm:p-3 rounded-full flex-shrink-0 ml-2">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* PDI Pendentes */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-ol-brand-500 hover:shadow-lg transition-shadow overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ol-gray-600">PDI Pendentes</p>
              <p className="text-2xl sm:text-3xl font-bold text-ol-brand-500">7</p>
              <p className="text-xs text-ol-brand-400 mt-1">Para agendar</p>
            </div>
            <div className="bg-ol-brand-100 p-2 sm:p-3 rounded-full flex-shrink-0 ml-2">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-ol-brand-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Conhecimentos */}
        <div 
          className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-green-500 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105 overflow-hidden"
          onClick={() => setCurrentPage('knowledge')}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ol-gray-600">Conhecimentos</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{knowledge.length}</p>
              <p className="text-xs text-green-500 mt-1">🚀 Certificações, Cursos, Graduações</p>
            </div>
            <div className="bg-green-100 p-2 sm:p-3 rounded-full flex-shrink-0 ml-2">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Colaboradores */}
        <div 
          className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105 overflow-hidden"
          onClick={() => setCurrentPage('employees')}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ol-gray-600">Colaboradores</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">{employees.length}</p>
              <p className="text-xs text-purple-500 mt-1">🚀 Sistema Funcionando!</p>
            </div>
            <div className="bg-purple-100 p-2 sm:p-3 rounded-full flex-shrink-0 ml-2">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'knowledge':
        return (
          <KnowledgePage
            employees={employees}
            knowledgeCatalog={knowledge}
            setKnowledge={setKnowledge}
            employeeKnowledge={employeeKnowledgeData}
            setEmployeeKnowledge={setEmployeeKnowledgeData}
            vendors={vendors}
            areas={areas}
            onBackToDashboard={() => setCurrentPage('dashboard')}
          />
        );
      case 'employees':
        return (
          <EmployeesPage
            employees={employees}
            setEmployees={setEmployees}
            knowledgeCatalog={knowledge}
            employeeKnowledge={employeeKnowledgeData}
            onBackToDashboard={() => setCurrentPage('dashboard')}
          />
        );
      default:
        return <DashboardContent />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
