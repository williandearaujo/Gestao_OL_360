import React from 'react';

const Header = ({ sidebarOpen, setSidebarOpen, breadcrumbs = ['Dashboard'] }) => {
  return (
    // 🆕 CONTROLANDO LARGURA MÁXIMA
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-ol-gray-200 h-16 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 h-full w-full">
        
        {/* Lado esquerdo */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
          {/* Menu toggle mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-md text-ol-gray-600 hover:bg-ol-gray-100 hover:text-ol-brand-600 transition-colors"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Logo responsivo */}
          <div className="flex items-center">
            {/* Desktop */}
            <div className="hidden sm:flex items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-ol-brand-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <span className="text-white font-bold text-sm sm:text-lg">G</span>
              </div>
              <div>
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-ol-brand-600">Gestão 360</h1>
                <p className="text-xs text-ol-gray-500 -mt-1">OL</p>
              </div>
            </div>

            {/* Mobile */}
            <div className="sm:hidden flex items-center">
              <div className="w-7 h-7 bg-ol-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="ml-2 text-base font-bold text-ol-brand-600">G360</span>
            </div>
          </div>

          {/* Breadcrumbs - Desktop only */}
          <nav className="hidden md:flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <svg className="w-4 h-4 mx-2 text-ol-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                <span className={`${index === breadcrumbs.length - 1 ? 'text-ol-brand-600 font-medium' : 'text-ol-gray-500'} truncate`}>
                  {crumb}
                </span>
              </div>
            ))}
          </nav>
        </div>

        {/* Lado direito */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
          {/* Busca - Desktop */}
          <div className="hidden md:block relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-ol-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ol-brand-500 w-40 lg:w-48 xl:w-64"
            />
            <svg className="w-4 h-4 absolute left-3 top-3 text-ol-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Busca mobile */}
          <button className="md:hidden p-1.5 text-ol-gray-600 hover:bg-ol-gray-100 rounded-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Notificações */}
          <button className="relative p-1.5 text-ol-gray-600 hover:bg-ol-gray-100 rounded-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM15 17H9a4 4 0 01-4-4v-5a7 7 0 0114 0v5" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>

          {/* User */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block text-right text-xs">
              <p className="font-medium text-ol-gray-900 truncate max-w-20">Willian</p>
              <p className="text-ol-gray-500 truncate">Dev</p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-ol-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-ol-brand-600 font-medium text-xs sm:text-sm">WA</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
