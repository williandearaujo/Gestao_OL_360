import React, { useState } from 'react';

const KnowledgeStats = ({ knowledge = [], employeeKnowledge = [], employees = [] }) => {
  const [selectedDrillDown, setSelectedDrillDown] = useState(null);

  // Proteção contra dados undefined
  const safeKnowledge = Array.isArray(knowledge) ? knowledge : [];
  const safeEmployeeKnowledge = Array.isArray(employeeKnowledge) ? employeeKnowledge : [];
  const safeEmployees = Array.isArray(employees) ? employees : [];

  // Função para calcular dias até vencimento
  const getDaysToExpiration = (expirationDate) => {
    if (!expirationDate) return null;
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // =================== CERTIFICAÇÕES ===================
  const certificacoes = safeKnowledge.filter(k => k.tipo === 'CERTIFICACAO');
  const vinculosCertificacoes = safeEmployeeKnowledge.filter(v => {
    const item = safeKnowledge.find(k => k.id === v.learning_item_id);
    return item && item.tipo === 'CERTIFICACAO';
  });

  const certStats = {
    totalCatalogo: certificacoes.length,
    obtidas: vinculosCertificacoes.filter(v => v.status === 'OBTIDO').length,
    desejadas: vinculosCertificacoes.filter(v => v.status === 'DESEJADO').length,
    obrigatorias: vinculosCertificacoes.filter(v => v.status === 'OBRIGATORIO').length,
    vencendo60: vinculosCertificacoes.filter(v => {
      const days = getDaysToExpiration(v.data_expiracao);
      return days !== null && days > 30 && days <= 60 && v.status === 'OBTIDO';
    }).length,
    vencendo30: vinculosCertificacoes.filter(v => {
      const days = getDaysToExpiration(v.data_expiracao);
      return days !== null && days > 0 && days <= 30 && v.status === 'OBTIDO';
    }).length,
    vencidas: vinculosCertificacoes.filter(v => {
      const days = getDaysToExpiration(v.data_expiracao);
      return days !== null && days <= 0 && v.status === 'OBTIDO';
    }).length
  };

  // =================== CURSOS ===================
  const cursos = safeKnowledge.filter(k => k.tipo === 'CURSO');
  const vinculosCursos = safeEmployeeKnowledge.filter(v => {
    const item = safeKnowledge.find(k => k.id === v.learning_item_id);
    return item && item.tipo === 'CURSO';
  });

  const cursoStats = {
    totalCatalogo: cursos.length,
    cursosObtidos: vinculosCursos.filter(v => v.status === 'OBTIDO').length,
    cursosDesejados: vinculosCursos.filter(v => v.status === 'DESEJADO').length,
    cursosObrigatorios: vinculosCursos.filter(v => v.status === 'OBRIGATORIO').length,
    colaboradoresComCursos: [...new Set(vinculosCursos.map(v => v.employee_id))].length
  };

  // =================== FORMAÇÕES ===================
  const formacoes = safeKnowledge.filter(k => k.tipo === 'FORMACAO');
  const vinculosFormacoes = safeEmployeeKnowledge.filter(v => {
    const item = safeKnowledge.find(k => k.id === v.learning_item_id);
    return item && item.tipo === 'FORMACAO';
  });

  const formacaoStats = {
    totalCatalogo: formacoes.length,
    graduacao: formacoes.filter(f => f.nivel_formacao === 'GRADUACAO').length,
    tecnologo: formacoes.filter(f => f.nivel_formacao === 'TECNOLOGO').length,
    posGraduacao: formacoes.filter(f => f.nivel_formacao === 'POS_GRADUACAO').length,
    especializacao: formacoes.filter(f => f.nivel_formacao === 'ESPECIALIZACAO').length,
    mba: formacoes.filter(f => f.nivel_formacao === 'MBA').length,
    mestrado: formacoes.filter(f => f.nivel_formacao === 'MESTRADO').length,
    doutorado: formacoes.filter(f => f.nivel_formacao === 'DOUTORADO').length,
    colaboradoresComFormacao: [...new Set(vinculosFormacoes.map(v => v.employee_id))].length
  };

  // Função para obter colaboradores por filtro
  const getEmployeesByFilter = (filterType) => {
    let filteredVinculos = [];

    switch (filterType) {
      case 'cert-obtidas':
        filteredVinculos = vinculosCertificacoes.filter(v => v.status === 'OBTIDO');
        break;
      case 'cert-desejadas':
        filteredVinculos = vinculosCertificacoes.filter(v => v.status === 'DESEJADO');
        break;
      case 'cert-obrigatorias':
        filteredVinculos = vinculosCertificacoes.filter(v => v.status === 'OBRIGATORIO');
        break;
      case 'cert-vencendo60':
        filteredVinculos = vinculosCertificacoes.filter(v => {
          const days = getDaysToExpiration(v.data_expiracao);
          return days !== null && days > 30 && days <= 60 && v.status === 'OBTIDO';
        });
        break;
      case 'cert-vencendo30':
        filteredVinculos = vinculosCertificacoes.filter(v => {
          const days = getDaysToExpiration(v.data_expiracao);
          return days !== null && days > 0 && days <= 30 && v.status === 'OBTIDO';
        });
        break;
      case 'cert-vencidas':
        filteredVinculos = vinculosCertificacoes.filter(v => {
          const days = getDaysToExpiration(v.data_expiracao);
          return days !== null && days <= 0 && v.status === 'OBTIDO';
        });
        break;
      case 'cursos-obtidos':
        filteredVinculos = vinculosCursos.filter(v => v.status === 'OBTIDO');
        break;
      case 'cursos-desejados':
        filteredVinculos = vinculosCursos.filter(v => v.status === 'DESEJADO');
        break;
      case 'cursos-obrigatorios':
        filteredVinculos = vinculosCursos.filter(v => v.status === 'OBRIGATORIO');
        break;
      case 'formacao-colaboradores':
        filteredVinculos = vinculosFormacoes;
        break;
      default:
        filteredVinculos = [];
    }

    const employeeIds = [...new Set(filteredVinculos.map(v => v.employee_id))];
    return safeEmployees.filter(emp => employeeIds.includes(emp.id)).map(emp => {
      const empVinculos = filteredVinculos.filter(v => v.employee_id === emp.id);
      return {
        ...emp,
        vinculos: empVinculos.map(v => {
          const conhecimento = safeKnowledge.find(k => k.id === v.learning_item_id);
          return { ...v, conhecimento };
        })
      };
    });
  };

  const handleCardClick = (filterType) => {
    const employeesData = getEmployeesByFilter(filterType);
    setSelectedDrillDown({
      type: filterType,
      employees: employeesData,
      title: getFilterTitle(filterType)
    });
  };

  const getFilterTitle = (filterType) => {
    const titles = {
      'cert-obtidas': 'Colaboradores com Certificações Obtidas',
      'cert-desejadas': 'Colaboradores com Certificações Desejadas',
      'cert-obrigatorias': 'Colaboradores com Certificações Obrigatórias',
      'cert-vencendo60': 'Certificações Vencendo em 60 dias',
      'cert-vencendo30': 'Certificações Vencendo em 30 dias',
      'cert-vencidas': 'Certificações Vencidas',
      'cursos-obtidos': 'Colaboradores com Cursos Concluídos',
      'cursos-desejados': 'Colaboradores com Cursos Desejados',
      'cursos-obrigatorios': 'Colaboradores com Cursos Obrigatórios',
      'formacao-colaboradores': 'Colaboradores com Formações'
    };
    return titles[filterType] || 'Detalhes';
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        
        {/* =================== CARD CERTIFICAÇÕES =================== */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 overflow-hidden">
          <h3 className="text-base sm:text-lg font-semibold text-ol-brand-600 mb-3 sm:mb-4 flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Certificações
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-ol-gray-600">Total no Catálogo</span>
              <span className="text-lg sm:text-xl font-bold text-ol-brand-600">{certStats.totalCatalogo}</span>
            </div>
            
            <button
              onClick={() => handleCardClick('cert-obtidas')}
              className="w-full flex justify-between items-center p-2 sm:p-3 bg-green-50 hover:bg-green-100 rounded-lg cursor-pointer transition-colors"
            >
              <span className="text-xs sm:text-sm text-green-700">Obtidas</span>
              <span className="text-sm sm:text-lg font-bold text-green-600">{certStats.obtidas}</span>
            </button>
            
            <button
              onClick={() => handleCardClick('cert-desejadas')}
              className="w-full flex justify-between items-center p-2 sm:p-3 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors"
            >
              <span className="text-xs sm:text-sm text-blue-700">Desejadas</span>
              <span className="text-sm sm:text-lg font-bold text-blue-600">{certStats.desejadas}</span>
            </button>
            
            <button
              onClick={() => handleCardClick('cert-obrigatorias')}
              className="w-full flex justify-between items-center p-2 sm:p-3 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors"
            >
              <span className="text-xs sm:text-sm text-red-700">Obrigatórias</span>
              <span className="text-sm sm:text-lg font-bold text-red-600">{certStats.obrigatorias}</span>
            </button>
            
            <button
              onClick={() => handleCardClick('cert-vencendo60')}
              className="w-full flex justify-between items-center p-2 sm:p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg cursor-pointer transition-colors"
            >
              <span className="text-xs sm:text-sm text-yellow-700">Vence 60 dias</span>
              <span className="text-sm sm:text-lg font-bold text-yellow-600">{certStats.vencendo60}</span>
            </button>
            
            <button
              onClick={() => handleCardClick('cert-vencendo30')}
              className="w-full flex justify-between items-center p-2 sm:p-3 bg-orange-50 hover:bg-orange-100 rounded-lg cursor-pointer transition-colors"
            >
              <span className="text-xs sm:text-sm text-orange-700">Vence 30 dias</span>
              <span className="text-sm sm:text-lg font-bold text-orange-600">{certStats.vencendo30}</span>
            </button>
            
            <button
              onClick={() => handleCardClick('cert-vencidas')}
              className="w-full flex justify-between items-center p-2 sm:p-3 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors"
            >
              <span className="text-xs sm:text-sm text-red-700">Vencidas</span>
              <span className="text-sm sm:text-lg font-bold text-red-600">{certStats.vencidas}</span>
            </button>
            
            {/* Footer - Info de validade */}
            <div className="mt-3 pt-3 border-t border-ol-gray-200">
              <div className="flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-ol-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-ol-brand-600">Com controle de validade</p>
              </div>
            </div>
          </div>
        </div>

        {/* =================== CARD CURSOS =================== */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 overflow-hidden">
          <h3 className="text-base sm:text-lg font-semibold text-blue-600 mb-3 sm:mb-4 flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
            Cursos
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-ol-gray-600">Total no Catálogo</span>
              <span className="text-lg sm:text-xl font-bold text-blue-600">{cursoStats.totalCatalogo}</span>
            </div>
            
            <button
              onClick={() => handleCardClick('cursos-obtidos')}
              className="w-full flex justify-between items-center p-2 sm:p-3 bg-green-50 hover:bg-green-100 rounded-lg cursor-pointer transition-colors"
            >
              <span className="text-xs sm:text-sm text-green-700">Concluídos</span>
              <span className="text-sm sm:text-lg font-bold text-green-600">{cursoStats.cursosObtidos}</span>
            </button>
            
            <button
              onClick={() => handleCardClick('cursos-desejados')}
              className="w-full flex justify-between items-center p-2 sm:p-3 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors"
            >
              <span className="text-xs sm:text-sm text-blue-700">Desejados</span>
              <span className="text-sm sm:text-lg font-bold text-blue-600">{cursoStats.cursosDesejados}</span>
            </button>
            
            <button
              onClick={() => handleCardClick('cursos-obrigatorios')}
              className="w-full flex justify-between items-center p-2 sm:p-3 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors"
            >
              <span className="text-xs sm:text-sm text-red-700">Obrigatórios</span>
              <span className="text-sm sm:text-lg font-bold text-red-600">{cursoStats.cursosObrigatorios}</span>
            </button>
            
            <div className="flex justify-between items-center p-2 sm:p-3 bg-blue-50 rounded-lg">
              <span className="text-xs sm:text-sm text-blue-700">Colaboradores Únicos</span>
              <span className="text-sm sm:text-lg font-bold text-blue-600">{cursoStats.colaboradoresComCursos}</span>
            </div>
            
            {/* ✅ Footer - Info de não expiração */}
            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-blue-600">Certificados não expiram</p>
              </div>
            </div>
          </div>
        </div>

        {/* =================== CARD FORMAÇÕES =================== */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 overflow-hidden">
          <h3 className="text-base sm:text-lg font-semibold text-ol-gray-700 mb-3 sm:mb-4 flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Formações Acadêmicas
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-ol-gray-600">Total no Catálogo</span>
              <span className="text-lg sm:text-xl font-bold text-ol-gray-700">{formacaoStats.totalCatalogo}</span>
            </div>
            
            {/* ✅ Sempre mostrar TODAS as formações, mesmo com 0 */}
            <div className="flex justify-between items-center p-2 bg-ol-gray-100 rounded-lg">
              <span className="text-xs sm:text-sm text-ol-gray-700">Graduações</span>
              <span className="text-xs sm:text-sm font-bold text-ol-gray-700">{formacaoStats.graduacao}</span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-ol-gray-100 rounded-lg">
              <span className="text-xs sm:text-sm text-ol-gray-700">Tecnólogos</span>
              <span className="text-xs sm:text-sm font-bold text-ol-gray-700">{formacaoStats.tecnologo}</span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-ol-gray-100 rounded-lg">
              <span className="text-xs sm:text-sm text-ol-gray-700">Pós-Graduações</span>
              <span className="text-xs sm:text-sm font-bold text-ol-gray-700">{formacaoStats.posGraduacao}</span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-ol-gray-100 rounded-lg">
              <span className="text-xs sm:text-sm text-ol-gray-700">Especializações</span>
              <span className="text-xs sm:text-sm font-bold text-ol-gray-700">{formacaoStats.especializacao}</span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-ol-gray-100 rounded-lg">
              <span className="text-xs sm:text-sm text-ol-gray-700">MBAs</span>
              <span className="text-xs sm:text-sm font-bold text-ol-gray-700">{formacaoStats.mba}</span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-ol-gray-100 rounded-lg">
              <span className="text-xs sm:text-sm text-ol-gray-700">Mestrados</span>
              <span className="text-xs sm:text-sm font-bold text-ol-gray-700">{formacaoStats.mestrado}</span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-ol-gray-100 rounded-lg">
              <span className="text-xs sm:text-sm text-ol-gray-700">Doutorados</span>
              <span className="text-xs sm:text-sm font-bold text-ol-gray-700">{formacaoStats.doutorado}</span>
            </div>
            
            <button
              onClick={() => handleCardClick('formacao-colaboradores')}
              className="w-full flex justify-between items-center p-2 bg-ol-brand-100 hover:bg-ol-brand-200 rounded-lg cursor-pointer transition-colors"
            >
              <span className="text-xs sm:text-sm text-ol-brand-700">Colaboradores Únicos</span>
              <span className="text-xs sm:text-sm font-bold text-ol-brand-600">{formacaoStats.colaboradoresComFormacao}</span>
            </button>
            
            {/* ✅ Footer - Info de não expiração */}
            <div className="mt-3 pt-3 border-t border-ol-gray-300">
              <div className="flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-ol-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-xs text-ol-gray-700">Diplomas não expiram</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================== MODAL DRILL-DOWN =================== */}
      {selectedDrillDown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-ol-brand-500">{selectedDrillDown.title}</h3>
                <button
                  onClick={() => setSelectedDrillDown(null)}
                  className="text-ol-gray-400 hover:text-ol-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedDrillDown.employees.map(emp => (
                  <div key={emp.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-ol-gray-900">{emp.nome}</h4>
                      <span className="text-sm text-ol-gray-500">{emp.cargo} • {emp.equipe}</span>
                    </div>
                    <div className="space-y-1">
                      {emp.vinculos.map(vinculo => (
                        <div key={vinculo.id} className="text-sm text-ol-gray-600 flex justify-between items-center">
                          <span>{vinculo.conhecimento?.nome || 'N/A'}</span>
                          <div className="flex items-center space-x-2">
                            {vinculo.data_expiracao && (
                              <span className="text-xs text-ol-gray-500">
                                {getDaysToExpiration(vinculo.data_expiracao) > 0 
                                  ? `Expira em ${getDaysToExpiration(vinculo.data_expiracao)} dias`
                                  : 'Vencida'
                                }
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded text-xs ${
                              vinculo.status === 'OBTIDO' ? 'bg-green-100 text-green-700' :
                              vinculo.status === 'OBRIGATORIO' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {vinculo.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {selectedDrillDown.employees.length === 0 && (
                  <div className="text-center py-8 text-ol-gray-500">
                    <p>Nenhum colaborador encontrado para este filtro.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KnowledgeStats;
