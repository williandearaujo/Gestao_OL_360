import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ConfigProvider } from './contexts/ConfigContext';
import Layout from './components/layout/Layout';
import Login from './components/Login';                      // ✅ VOLTA PARA /components
import ProtectedRoute from './components/ProtectedRoute';    // ✅ VOLTA PARA /components
import DevRoleSwitcher from './components/dev/DevRoleSwitcher'; // ✅ ESTE ESTÁ CERTO

// Suas páginas existentes
import EmployeesPage from './components/employees/EmployeesPage';
import KnowledgePage from './components/knowledge/KnowledgePage';
import EmployeeKnowledgePage from './components/employee-knowledge/EmployeeKnowledgePage';
import DashboardPage from './components/dashboard/DashboardPage';
import AdminConfigPage from './components/admin/AdminConfigPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userRole, setUserRole] = useState('admin');

  // ✅ NAVEGAÇÃO SEGURA COM PROTEÇÃO (SUA FUNÇÃO EXISTENTE)
  const safeSetCurrentPage = (page) => {
    console.log('🔗 App navegando para:', page);

    try {
      const validPages = ['dashboard', 'employees', 'knowledge', 'employee-knowledge', 'admin-config'];
      if (!validPages.includes(page)) {
        console.warn('⚠️ Página inválida:', page);
        return;
      }
      setCurrentPage(page);
    } catch (error) {
      console.error('❌ Erro na navegação App:', error);
      setCurrentPage('dashboard');
    }
  };

  // ✅ SUA FUNÇÃO DE RENDERIZAÇÃO EXISTENTE (INALTERADA)
  const renderPage = () => {
    try {
      switch (currentPage) {
        case 'employees':
          return (
            <EmployeesPage
              onBackToDashboard={() => safeSetCurrentPage('dashboard')}
              useAPI={true}
              setCurrentPage={safeSetCurrentPage}
              userRole={userRole}
            />
          );

        case 'knowledge':
          return (
            <KnowledgePage
              onBackToDashboard={() => safeSetCurrentPage('dashboard')}
              useAPI={true}
              userRole={userRole}
            />
          );

        case 'employee-knowledge':
          return (
            <EmployeeKnowledgePage
              onBackToDashboard={() => safeSetCurrentPage('dashboard')}
              userRole={userRole}
            />
          );

        case 'admin-config':
          return (
            <AdminConfigPage
              onBackToDashboard={() => safeSetCurrentPage('dashboard')}
              userRole={userRole}
              setCurrentPage={safeSetCurrentPage}
            />
          );

        case 'dashboard':
        default:
          return (
            <DashboardPage
              setCurrentPage={safeSetCurrentPage}
              userRole={userRole}
            />
          );
      }
    } catch (error) {
      console.error('❌ Erro ao renderizar página:', error);
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Erro na Página</h2>
          <button
            onClick={() => safeSetCurrentPage('dashboard')}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Ir para Dashboard
          </button>
        </div>
      );
    }
  };

  // ✅ COMPONENT INTERNO PARA APLICAÇÃO AUTENTICADA
  const AuthenticatedApp = () => (
    <>
      <Layout
        currentPage={currentPage}
        setCurrentPage={safeSetCurrentPage}
        userRole={userRole}
        setUserRole={setUserRole}
      >
        {renderPage()}
      </Layout>

      {/* ✅ DEV ROLE SWITCHER - SÓ APARECE PARA ADMIN */}
      <DevRoleSwitcher />
    </>
  );

  return (
    <ConfigProvider>
      <AuthProvider>
        {/* 🔐 SISTEMA DE AUTENTICAÇÃO WRAPPER */}
        <ProtectedRoute
          loginComponent={<Login />}
          fallbackMode={true} // ✅ PERMITE ACESSO MESMO SEM LOGIN (MODO COMPATIBILIDADE)
        >
          <AuthenticatedApp />
        </ProtectedRoute>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
