import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';

// Suas páginas
import EmployeesPage from './components/employees/EmployeesPage';
import KnowledgePage from './components/knowledge/KnowledgePage';
import EmployeeKnowledgePage from './components/employee-knowledge/EmployeeKnowledgePage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'employees':
        return (
          <EmployeesPage
            onBackToDashboard={() => setCurrentPage('dashboard')}
            useAPI={true}
            setCurrentPage={setCurrentPage}  // ✅ PROP ADICIONADA
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

      default:
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard OL 360</h1>

              {/* Indicador API */}
              <div className="mb-4 p-4 bg-white rounded-lg shadow-md border">
                <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-700 font-medium">
                      Sistema Integrado - Sempre Conectado à API
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    API: http://localhost:8000 | Dados reais em tempo real
                  </p>
                </div>
              </div>
            </div>

            {/* Grid com 5 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {/* Funcionários */}
              <button
                onClick={() => setCurrentPage('employees')}
                className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-all text-left group border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Funcionários</h3>
                </div>
                <p className="text-gray-600 mb-2 text-sm">Gerencie sua equipe</p>
                <div className="text-xs font-medium">
                  <span className="text-green-600">→ API Real</span>
                </div>
              </button>

              {/* Conhecimentos */}
              <button
                onClick={() => setCurrentPage('knowledge')}
                className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-all text-left group border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Conhecimentos</h3>
                </div>
                <p className="text-gray-600 mb-2 text-sm">Certificações e cursos</p>
                <div className="text-xs font-medium">
                  <span className="text-green-600">→ API Real</span>
                </div>
              </button>

              {/* Vínculos */}
              <button
                onClick={() => setCurrentPage('employee-knowledge')}
                className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-all text-left group border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Vínculos</h3>
                </div>
                <p className="text-gray-600 mb-2 text-sm">Colaborador ↔ Conhecimento</p>
                <div className="text-xs font-medium">
                  <span className="text-green-600">→ API Real</span>
                </div>
              </button>

              {/* Equipes */}
              <button
                onClick={() => setCurrentPage('teams')}
                className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-all text-left group border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Equipes</h3>
                </div>
                <p className="text-gray-600 mb-2 text-sm">Gerencie equipes</p>
                <div className="text-xs font-medium">
                  <span className="text-green-600">→ API Real</span>
                </div>
              </button>

              {/* Gerentes */}
              <button
                onClick={() => setCurrentPage('managers')}
                className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-all text-left group border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Gerentes</h3>
                </div>
                <p className="text-gray-600 mb-2 text-sm">Gerencie hierarquia</p>
                <div className="text-xs font-medium">
                  <span className="text-green-600">→ API Real</span>
                </div>
              </button>
            </div>
          </div>
        );
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
