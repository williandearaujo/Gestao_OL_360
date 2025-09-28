import React from 'react';

const CertificationStats = ({ 
  certifications, 
  employeeCertifications, 
  employees 
}) => {
  const calculateStats = () => {
    const totalCerts = certifications.length;
    const totalEmployees = employees.length;
    
    const obtidas = employeeCertifications.filter(ec => ec.vinculo === 'OBTIDO').length;
    const obrigatorias = employeeCertifications.filter(ec => ec.vinculo === 'OBRIGATORIO').length;
    const desejadas = employeeCertifications.filter(ec => ec.vinculo === 'DESEJADO').length;
    
    const expirandoEm30d = employeeCertifications.filter(ec => 
      ec.vinculo === 'OBTIDO' && 
      ec.data_expiracao && 
      new Date(ec.data_expiracao) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ).length;
    
    const semEvidencia = employeeCertifications.filter(ec => 
      ec.vinculo === 'OBTIDO' && !ec.anexo_path
    ).length;

    return {
      totalCerts,
      totalEmployees,
      obtidas,
      obrigatorias,
      desejadas,
      expirandoEm30d,
      semEvidencia
    };
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Total de Certificações */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Catálogo</p>
            <p className="text-2xl font-bold text-ol-brand-600">{stats.totalCerts}</p>
          </div>
          <div className="bg-ol-brand-100 p-2 rounded-lg">
            <svg className="w-6 h-6 text-ol-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Obtidas */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Obtidas</p>
            <p className="text-2xl font-bold text-green-600">{stats.obtidas}</p>
          </div>
          <div className="bg-green-100 p-2 rounded-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Obrigatórias Pendentes */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Obrigatórias</p>
            <p className="text-2xl font-bold text-red-600">{stats.obrigatorias}</p>
          </div>
          <div className="bg-red-100 p-2 rounded-lg">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expirando em 30d */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Expira ≤30d</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.expirandoEm30d}</p>
          </div>
          <div className="bg-yellow-100 p-2 rounded-lg">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Sem Evidência */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Sem Anexo</p>
            <p className="text-2xl font-bold text-orange-600">{stats.semEvidencia}</p>
          </div>
          <div className="bg-orange-100 p-2 rounded-lg">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationStats;
