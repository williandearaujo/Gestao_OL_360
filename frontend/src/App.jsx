import React, { useState } from 'react';
import CertificationsPage from './components/certifications/CertificationsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Componente Dashboard (seu código atual)
  const DashboardContent = () => (
    <>
      {/* Logo/Título */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-ol-brand-500 mb-2">Gestão OL 360</h1>
        <p className="text-ol-gray-600">Sistema de Gestão de Analistas, Certificações e Relacionamento</p>
        <p className="text-sm text-ol-brand-400 font-medium">OL Tecnologia</p>
      </div>

      {/* Cards Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Alertas Críticos */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ol-gray-600">Alertas Críticos</p>
              <p className="text-3xl font-bold text-red-600">3</p>
              <p className="text-xs text-red-500 mt-1">Ação imediata</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* PDI Pendentes */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-ol-brand-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ol-gray-600">PDI Pendentes</p>
              <p className="text-3xl font-bold text-ol-brand-500">7</p>
              <p className="text-xs text-ol-brand-400 mt-1">Para agendar</p>
            </div>
            <div className="bg-ol-brand-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-ol-brand-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Certificações - SISTEMA COMPLETO */}
        <div 
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105"
          onClick={() => setCurrentPage('certifications')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ol-gray-600">Certificações</p>
              <p className="text-3xl font-bold text-green-600">24</p>
              <p className="text-xs text-green-500 mt-1">🚀 Sistema Completo!</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Visitas */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ol-gray-600">Visitas Agendadas</p>
              <p className="text-3xl font-bold text-blue-600">12</p>
              <p className="text-xs text-blue-500 mt-1">Este mês</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Status do Sistema */}
      <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-ol-brand-500">
        <h2 className="text-xl font-semibold mb-4 text-ol-brand-500">Status do Sistema</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">Módulo Certificações COMPLETO</span>
            </div>
            <span className="text-green-600 text-sm bg-green-100 px-2 py-1 rounded">✓ CRUD + Stats + Filtros</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-ol-brand-50 rounded-lg border border-ol-brand-200">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-ol-brand-500 rounded-full"></div>
              <span className="text-ol-brand-700 font-medium">Navegação Entre Módulos</span>
            </div>
            <span className="text-ol-brand-600 text-sm bg-ol-brand-100 px-2 py-1 rounded">Funcionando</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center bg-ol-brand-50 rounded-lg p-6 border border-ol-brand-200">
        <div className="inline-flex items-center space-x-2 mb-2">
          <svg className="w-6 h-6 text-ol-brand-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h3 className="text-xl font-semibold text-ol-brand-500">Sistema Completo Ativo!</h3>
        </div>
        <p className="text-ol-gray-600 mb-1">✅ CRUD • ✅ Estatísticas • ✅ Filtros • ✅ Navegação Cruzada • ✅ Modais</p>
        <p className="text-sm text-ol-brand-400 mt-2">Clique no card "Certificações" para testar tudo!</p>
      </div>
    </>
  );

  // Função para renderizar páginas
  const renderPage = () => {
    switch (currentPage) {
      case 'certifications':
        return <CertificationsPage onBackToDashboard={() => setCurrentPage('dashboard')} />;
      case 'dashboard':
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-ol-gray-50">
      {/* Navigation Bar */}
      {currentPage !== 'dashboard' && (
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="flex items-center space-x-2 text-ol-brand-600 hover:text-ol-brand-700 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Dashboard</span>
                </button>
                <span className="text-ol-gray-400">•</span>
                <h1 className="text-xl font-semibold text-ol-brand-600">
                  {currentPage === 'certifications' ? 'Certificações & Cursos' : currentPage}
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-ol-brand-400 font-medium">Gestão OL 360</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
