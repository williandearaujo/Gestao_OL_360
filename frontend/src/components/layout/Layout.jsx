import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, currentPage, setCurrentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState(['Dashboard']);

  useEffect(() => {
  const breadcrumbMap = {
    dashboard: ['Dashboard'],
    knowledge: ['Dashboard', 'Conhecimentos'],
    employees: ['Dashboard', 'Colaboradores'],
    clients: ['Dashboard', 'Clientes']
  };
  setBreadcrumbs(breadcrumbMap[currentPage] || ['Dashboard']);
  }, [currentPage]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full min-h-screen bg-ol-gray-50">
      {/* Header */}
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        breadcrumbs={breadcrumbs}
      />
      
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setBreadcrumbs={setBreadcrumbs}
      />
      
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* 🆕 MAIN CONTENT COM PADDING CORRETO */}
      <main className="w-full lg:pl-64 pt-16">
        <div className="w-full max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
