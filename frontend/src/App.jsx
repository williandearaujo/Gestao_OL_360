import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';

// Suas páginas
import EmployeesPage from './components/employees/EmployeesPage';
import KnowledgePage from './components/knowledge/KnowledgePage';
import EmployeeKnowledgePage from './components/employee-knowledge/EmployeeKnowledgePage';
import DashboardPage from './components/dashboard/DashboardPage'; // ✅ ADICIONAR IMPORT

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'employees':
        return (
          <EmployeesPage
            onBackToDashboard={() => setCurrentPage('dashboard')}
            useAPI={true}
            setCurrentPage={setCurrentPage}
          />
        );

      case 'knowledge':
        return (
          <KnowledgePage
            onBackToDashboard={() => setCurrentPage('dashboard')}
            useAPI={true}
          />
        );

      case 'employee-knowledge':
        return (
          <EmployeeKnowledgePage
            onBackToDashboard={() => setCurrentPage('dashboard')}
          />
        );

      case 'teams':
        return (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">🏢 Gerenciamento de Equipes</h1>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Página de Equipes</h2>
              <p className="text-gray-500 mb-4">
                ✅ Sempre conectado à API - Equipes reais: Comercial, TI, Admin, etc.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  🚧 Página em desenvolvimento<br/>
                  Em breve: CRUD completo de equipes com cores e descrições
                </p>
              </div>
            </div>
          </div>
        );

      case 'managers':
        return (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">👔 Gerenciamento de Gerentes</h1>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-orange-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Página de Gerentes</h2>
              <p className="text-gray-500 mb-4">
                ✅ Sempre conectado à API - Gerentes reais: André Brazioli, etc.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-700">
                  🚧 Página em desenvolvimento<br/>
                  Em breve: CRUD completo de gerentes e hierarquia
                </p>
              </div>
            </div>
          </div>
        );

      // ✅ ADICIONAR CASE DASHBOARD
    case 'dashboard':
      return <DashboardPage setCurrentPage={setCurrentPage} />;

    default:
      return <DashboardPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        {renderPage()}
      </Layout>
    </AuthProvider>
  );
}

export default App;
