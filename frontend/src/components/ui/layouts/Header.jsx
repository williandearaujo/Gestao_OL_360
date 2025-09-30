import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const Header = () => {
  const {
    user,
    logout,
    isAuthenticated,
    isRoleSwitched,
    resetRole,
    currentRole,
    isAdmin,
    isDev
  } = useAuth();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ✅ LOGO E BRANDING */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">OL</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Gestão OL 360
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">
                    Sistema Empresarial Completo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ INDICADORES DE STATUS */}
          <div className="flex items-center space-x-4">
            {/* Status de conexão */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Online</span>
            </div>

            {/* Menu do usuário */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-3 py-2 transition-all duration-150"
                >
                  {/* Avatar */}
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                    <span className="text-sm font-medium text-white">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>

                  {/* Info do usuário */}
                  <div className="hidden md:block text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {user?.username || 'Usuário'}
                      </span>

                      {/* Badges */}
                      {isAdmin && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                          Admin
                        </span>
                      )}

                      {isDev && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">
                          Dev
                        </span>
                      )}
                    </div>

                    {/* Role atual */}
                    <div className={`text-xs ${isRoleSwitched ? 'text-orange-600' : 'text-gray-500'}`}>
                      {isRoleSwitched && '🔄 '}{currentRole || 'Usuário'}
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* ✅ DROPDOWN MENU */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                    {/* Header do menu */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{user?.username}</div>
                          <div className="text-sm text-gray-500">{user?.email}</div>

                          {/* Indicador de role switching */}
                          {isRoleSwitched && (
                            <div className="mt-1 flex items-center space-x-1 text-xs text-orange-600">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>Testando como: {currentRole}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">
                      {/* Restaurar role original */}
                      {isRoleSwitched && (
                        <>
                          <button
                            onClick={() => {
                              resetRole();
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Restaurar Role Original</span>
                          </button>
                          <div className="border-t border-gray-100 my-2"></div>
                        </>
                      )}

                      {/* Admin panel */}
                      {isAdmin && (
                        <button
                          onClick={() => {
                            // Navegar para admin (implementar conforme sua navegação)
                            console.log('Navegar para admin');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Painel Administrativo</span>
                        </button>
                      )}

                      {/* Configurações */}
                      <button
                        onClick={() => {
                          console.log('Abrir configurações');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                        <span>Configurações</span>
                      </button>

                      <div className="border-t border-gray-100 my-2"></div>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sair do Sistema</span>
                      </button>
                    </div>

                    {/* Footer do menu */}
                    <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Versão 2.0.1</span>
                        <span>{new Date().toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Botão de login se não autenticado */
              <button
                onClick={() => console.log('Ir para login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-150"
              >
                Fazer Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
