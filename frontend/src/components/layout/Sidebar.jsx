import React from 'react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage, setBreadcrumbs }) => {
  const menuItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
    ),
    breadcrumb: ['Dashboard']
  },
  {
    id: 'employees',
    name: 'Colaboradores',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    breadcrumb: ['Dashboard', 'Colaboradores']
  },
  // ✅ NOVOS ITENS
  {
    id: 'teams',
    name: 'Equipes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    breadcrumb: ['Dashboard', 'Equipes']
  },
  {
    id: 'managers',
    name: 'Gerentes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    breadcrumb: ['Dashboard', 'Gerentes']
  },
  {
    id: 'knowledge',
    name: 'Conhecimentos',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    breadcrumb: ['Dashboard', 'Conhecimentos'],
  }
];


  const handleMenuClick = (item) => {
    setCurrentPage(item.id);
    setBreadcrumbs(item.breadcrumb);
    // Fechar sidebar em mobile
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 z-20 w-64 h-[calc(100vh-4rem)] bg-white border-r border-ol-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                currentPage === item.id
                  ? 'bg-ol-brand-100 text-ol-brand-700'
                  : 'text-ol-gray-700 hover:bg-ol-gray-100 hover:text-ol-brand-600'
              }`}
            >
              <span className={`${currentPage === item.id ? 'text-ol-brand-600' : 'text-ol-gray-500'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-1 text-xs bg-ol-brand-600 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-ol-gray-200 bg-ol-gray-50">
          <div className="text-center">
            <p className="text-xs text-ol-gray-500">Gestão 360 OL</p>
            <p className="text-xs text-ol-gray-400">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
