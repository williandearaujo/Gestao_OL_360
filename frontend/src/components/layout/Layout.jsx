import React, { useState, useCallback } from 'react';
import { User, Menu, X, BarChart3, Users, BookOpen, Link, Settings } from 'lucide-react';
import { useConfig } from '../../contexts/ConfigContext';

const Layout = ({ children, currentPage, setCurrentPage, userRole, setUserRole }) => {
  const { companyName } = useConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const getPageTitle = () => {
    switch(currentPage) {
      case 'dashboard': return 'Dashboard';
      case 'employees': return 'Colaboradores';
      case 'knowledge': return 'Conhecimentos';
      case 'employee-knowledge': return 'Vínculos';
      case 'admin-config': return 'Configurações Admin';
      default: return 'Sistema';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Settings className="w-4 h-4" />;
      case 'diretoria': return <User className="w-4 h-4" />;
      case 'gerente': return <Users className="w-4 h-4" />;
      case 'colaborador': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 'admin': return 'Admin';
      case 'diretoria': return 'Diretoria';
      case 'gerente': return 'Gerente';
      case 'colaborador': return 'Colaborador';
      default: return 'Colaborador';
    }
  };

  const getPageIcon = (page) => {
    switch(page) {
      case 'dashboard': return <BarChart3 className="w-4 h-4 mr-2" />;
      case 'employees': return <Users className="w-4 h-4 mr-2" />;
      case 'knowledge': return <BookOpen className="w-4 h-4 mr-2" />;
      case 'employee-knowledge': return <Link className="w-4 h-4 mr-2" />;
      case 'admin-config': return <Settings className="w-4 h-4 mr-2" />;
      default: return null;
    }
  };

  // ✅ NAVEGAÇÃO SEGURA - SEM LOOPS
  const handleNavigation = useCallback((page) => {
    // Prevenir cliques múltiplos
    if (isNavigating) {
      console.log('⚠️ Navegação já em andamento, ignorando clique');
      return;
    }

    console.log('🔗 Navegação solicitada para:', page);
    setIsNavigating(true);

    try {
      // Verificar se setCurrentPage é válido
      if (typeof setCurrentPage === 'function') {
        console.log('✅ Executando navegação para:', page);
        setCurrentPage(page);
      } else {
        console.warn('⚠️ setCurrentPage não é uma função válida');
        alert(`Navegação para: ${page} (modo debug)`);
      }
    } catch (error) {
      console.error('❌ Erro na navegação:', error);
      alert('Erro na navegação. Tente recarregar a página.');
    } finally {
      // Fechar menu mobile
      setMobileMenuOpen(false);

      // Liberar navegação após delay
      setTimeout(() => {
        setIsNavigating(false);
        console.log('🔄 Navegação liberada');
      }, 300);
    }
  }, [setCurrentPage, isNavigating]);

  const getCurrentYear = () => new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfc]">

      {/* HEADER FIXO NO TOPO */}
      <header className="bg-white border-b border-[#cccccc] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* LOGO E TÍTULO OL VERMELHO EXATO */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#821314] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">OL</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-[#000000]">{getPageTitle()}</h1>
                <p className="text-sm text-gray-600">{companyName} - Sistema de Gestão</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-[#000000]">{getPageTitle()}</h1>
              </div>
            </div>

            {/* DESKTOP: SELETOR DE PERFIL */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Logado como:</span>
                <span className="font-semibold text-[#000000] flex items-center space-x-1">
                  {getRoleIcon(userRole)}
                  <span>{getRoleLabel(userRole)}</span>
                </span>
              </div>

              <div className="flex items-center space-x-2 bg-[#fcfcfc] px-4 py-2 rounded-xl border border-[#cccccc] shadow-sm">
                <User className="w-4 h-4 text-gray-500" />
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="border-0 bg-transparent text-sm focus:ring-0 focus:outline-none font-semibold text-[#000000]"
                >
                  <option value="colaborador">Colaborador</option>
                  <option value="gerente">Gerente</option>
                  <option value="admin">Admin</option>
                  <option value="diretoria">Diretoria</option>
                </select>
              </div>
            </div>

            {/* MOBILE: MENU HAMBURGER */}
            <div className="md:hidden flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                {getRoleIcon(userRole)}
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-500 hover:text-[#821314] hover:bg-[#fef2f2] rounded-xl transition-all duration-200"
                disabled={isNavigating}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* NAVEGAÇÃO DESKTOP - ÍCONES LUCIDE */}
        <nav className="hidden md:block bg-white border-t border-[#cccccc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">

              <button
                onClick={() => handleNavigation('dashboard')}
                disabled={isNavigating}
                className={`py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 flex items-center ${
                  currentPage === 'dashboard'
                    ? 'border-[#821314] text-[#821314] bg-[#fef2f2]'
                    : 'border-transparent text-gray-500 hover:text-[#821314] hover:border-[#c9252c]'
                } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {getPageIcon('dashboard')}
                Dashboard
              </button>

              <button
                onClick={() => handleNavigation('employees')}
                disabled={isNavigating}
                className={`py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 flex items-center ${
                  currentPage === 'employees'
                    ? 'border-[#821314] text-[#821314] bg-[#fef2f2]'
                    : 'border-transparent text-gray-500 hover:text-[#821314] hover:border-[#c9252c]'
                } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {getPageIcon('employees')}
                Colaboradores
              </button>

              <button
                onClick={() => handleNavigation('knowledge')}
                disabled={isNavigating}
                className={`py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 flex items-center ${
                  currentPage === 'knowledge'
                    ? 'border-[#821314] text-[#821314] bg-[#fef2f2]'
                    : 'border-transparent text-gray-500 hover:text-[#821314] hover:border-[#c9252c]'
                } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {getPageIcon('knowledge')}
                Conhecimentos
              </button>

              <button
                onClick={() => handleNavigation('employee-knowledge')}
                disabled={isNavigating}
                className={`py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 flex items-center ${
                  currentPage === 'employee-knowledge'
                    ? 'border-[#821314] text-[#821314] bg-[#fef2f2]'
                    : 'border-transparent text-gray-500 hover:text-[#821314] hover:border-[#c9252c]'
                } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {getPageIcon('employee-knowledge')}
                Vínculos
              </button>

              {(userRole === 'admin' || userRole === 'diretoria') && (
                <button
                  onClick={() => handleNavigation('admin-config')}
                  disabled={isNavigating}
                  className={`py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 flex items-center ${
                    currentPage === 'admin-config'
                      ? 'border-[#821314] text-[#821314] bg-[#fef2f2]'
                      : 'border-transparent text-gray-500 hover:text-[#821314] hover:border-[#c9252c]'
                  } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {getPageIcon('admin-config')}
                  Admin
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* MENU MOBILE DROPDOWN - ÍCONES LUCIDE */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#cccccc] shadow-lg">
            <div className="px-4 py-3 space-y-2">

              {/* Perfil Mobile */}
              <div className="px-4 py-3 bg-[#fef2f2] rounded-xl mb-4 border border-[#c9252c]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#fef2f2] rounded-full flex items-center justify-center border border-[#c9252c]">
                    {getRoleIcon(userRole)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#821314]">{getRoleLabel(userRole)}</p>
                    <p className="text-xs text-[#c9252c]">Perfil ativo</p>
                  </div>
                </div>
                <div className="mt-3">
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#c9252c] rounded-lg focus:ring-2 focus:ring-[#821314] focus:border-transparent bg-white"
                  >
                    <option value="colaborador">Colaborador</option>
                    <option value="gerente">Gerente</option>
                    <option value="admin">Admin</option>
                    <option value="diretoria">Diretoria</option>
                  </select>
                </div>
              </div>

              {/* Navegação Mobile */}
              <button
                onClick={() => handleNavigation('dashboard')}
                disabled={isNavigating}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center ${
                  currentPage === 'dashboard'
                    ? 'bg-[#fef2f2] text-[#821314] border-l-4 border-[#821314]'
                    : 'text-gray-600 hover:bg-[#fef2f2] hover:text-[#821314]'
                } ${isNavigating ? 'opacity-50' : ''}`}
              >
                {getPageIcon('dashboard')}
                Dashboard
              </button>

              <button
                onClick={() => handleNavigation('employees')}
                disabled={isNavigating}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center ${
                  currentPage === 'employees'
                    ? 'bg-[#fef2f2] text-[#821314] border-l-4 border-[#821314]'
                    : 'text-gray-600 hover:bg-[#fef2f2] hover:text-[#821314]'
                } ${isNavigating ? 'opacity-50' : ''}`}
              >
                {getPageIcon('employees')}
                Colaboradores
              </button>

              <button
                onClick={() => handleNavigation('knowledge')}
                disabled={isNavigating}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center ${
                  currentPage === 'knowledge'
                    ? 'bg-[#fef2f2] text-[#821314] border-l-4 border-[#821314]'
                    : 'text-gray-600 hover:bg-[#fef2f2] hover:text-[#821314]'
                } ${isNavigating ? 'opacity-50' : ''}`}
              >
                {getPageIcon('knowledge')}
                Conhecimentos
              </button>

              <button
                onClick={() => handleNavigation('employee-knowledge')}
                disabled={isNavigating}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center ${
                  currentPage === 'employee-knowledge'
                    ? 'bg-[#fef2f2] text-[#821314] border-l-4 border-[#821314]'
                    : 'text-gray-600 hover:bg-[#fef2f2] hover:text-[#821314]'
                } ${isNavigating ? 'opacity-50' : ''}`}
              >
                {getPageIcon('employee-knowledge')}
                Vínculos
              </button>

              {(userRole === 'admin' || userRole === 'diretoria') && (
                <button
                  onClick={() => handleNavigation('admin-config')}
                  disabled={isNavigating}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center ${
                    currentPage === 'admin-config'
                      ? 'bg-[#fef2f2] text-[#821314] border-l-4 border-[#821314]'
                      : 'text-gray-600 hover:bg-[#fef2f2] hover:text-[#821314]'
                  } ${isNavigating ? 'opacity-50' : ''}`}
                >
                  {getPageIcon('admin-config')}
                  Admin
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isNavigating && (
          <div className="absolute top-0 left-0 w-full h-1 bg-[#821314] opacity-75 animate-pulse"></div>
        )}
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-auto bg-[#fcfcfc]">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#cccccc] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>© {getCurrentYear()} {companyName}</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Sistema Online</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span className="font-medium flex items-center space-x-1">
                {getRoleIcon(userRole)}
                <span>{getRoleLabel(userRole)}</span>
              </span>
              <span>•</span>
              <span>{getPageTitle()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
