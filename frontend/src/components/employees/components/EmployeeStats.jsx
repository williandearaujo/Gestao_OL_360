import React from 'react';

const EmployeeStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      
      {/* Total Colaboradores */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
        <h3 className="text-base sm:text-lg font-semibold text-ol-brand-500 mb-3 sm:mb-4 flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          Total Colaboradores
        </h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-ol-gray-600">Total</span>
            <span className="text-lg sm:text-xl font-bold text-ol-brand-500">{stats.total}</span>
          </div>
          <div className="flex justify-between items-center p-2 sm:p-3 bg-ol-brand-50 rounded-lg">
            <span className="text-xs sm:text-sm text-ol-gray-700">Ativos</span>
            <span className="text-sm sm:text-lg font-bold text-ol-brand-600">{stats.ativos}</span>
          </div>
          <div className="flex justify-between items-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
            <span className="text-xs sm:text-sm text-ol-gray-700">Férias</span>
            <span className="text-sm sm:text-lg font-bold text-yellow-600">{stats.ferias}</span>
          </div>
          <div className="flex justify-between items-center p-2 sm:p-3 bg-red-50 rounded-lg">
            <span className="text-xs sm:text-sm text-ol-gray-700">Inativos</span>
            <span className="text-sm sm:text-lg font-bold text-red-600">{stats.inativos}</span>
          </div>
        </div>
      </div>

      {/* Por Equipe */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 overflow-hidden">
        <h3 className="text-base sm:text-lg font-semibold text-ol-brand-600 mb-3 sm:mb-4 flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
          </svg>
          Por Equipe
        </h3>
        <div className="space-y-2">
          {Object.entries(stats.porEquipe).map(([equipe, count]) => (
            <div key={equipe} className="flex justify-between items-center p-2 bg-ol-brand-50 rounded-lg">
              <span className="text-xs sm:text-sm text-ol-brand-700">{equipe}</span>
              <span className="text-xs sm:text-sm font-bold text-ol-brand-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conhecimentos */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 overflow-hidden">
        <h3 className="text-base sm:text-lg font-semibold text-ol-brand-600 mb-3 sm:mb-4 flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Conhecimentos
        </h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center p-2 sm:p-3 bg-ol-brand-50 rounded-lg">
            <span className="text-xs sm:text-sm text-ol-gray-700">Obtidos</span>
            <span className="text-sm sm:text-lg font-bold text-ol-brand-600">{stats.conhecimentosObtidos}</span>
          </div>
          <div className="flex justify-between items-center p-2 sm:p-3 bg-blue-50 rounded-lg">
            <span className="text-xs sm:text-sm text-ol-gray-700">Desejados</span>
            <span className="text-sm sm:text-lg font-bold text-blue-600">{stats.conhecimentosDesejados}</span>
          </div>
        </div>
      </div>

      {/* Alertas RH */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 overflow-hidden">
        <h3 className="text-base sm:text-lg font-semibold text-red-600 mb-3 sm:mb-4 flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Alertas RH
        </h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
            <span className="text-xs sm:text-sm text-ol-gray-700">PDI Pendentes</span>
            <span className="text-sm sm:text-lg font-bold text-yellow-600">{stats.pdiAtrasados}</span>
          </div>
          <div className="flex justify-between items-center p-2 sm:p-3 bg-red-50 rounded-lg">
            <span className="text-xs sm:text-sm text-ol-gray-700">1x1 Atrasados</span>
            <span className="text-sm sm:text-lg font-bold text-red-600">{stats.reunioesAtrasadas}</span>
          </div>
          <div className="flex justify-between items-center p-2 sm:p-3 bg-ol-brand-50 rounded-lg">
            <span className="text-xs sm:text-sm text-ol-gray-700">Aniversários</span>
            <span className="text-sm sm:text-lg font-bold text-ol-brand-600">{stats.aniversarios}</span>
          </div>
          <div className="flex justify-between items-center p-2 sm:p-3 bg-orange-50 rounded-lg">
            <span className="text-xs sm:text-sm text-ol-gray-700">Férias Críticas</span>
            <span className="text-sm sm:text-lg font-bold text-orange-600">{stats.feriasObrigatorias}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeStats;
