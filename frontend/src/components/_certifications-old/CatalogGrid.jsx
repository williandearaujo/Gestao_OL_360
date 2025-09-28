import React, { useState } from 'react';
import CertificationBadge from './CertificationBadge';
import Modal from '../common/Modal';

const CatalogGrid = ({ 
  certifications, 
  onViewAnalysts, 
  onEditCertification, 
  employees,
  employeeCertifications 
}) => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [showAnalystsModal, setShowAnalystsModal] = useState(false);

  const getCertificationStats = (certId) => {
    const employeeCerts = employeeCertifications.filter(ec => ec.learning_item_id === certId);
    
    return {
      desejadas: employeeCerts.filter(ec => ec.vinculo === 'DESEJADO').length,
      obrigatorias: employeeCerts.filter(ec => ec.vinculo === 'OBRIGATORIO').length,
      obtidas: employeeCerts.filter(ec => ec.vinculo === 'OBTIDO').length,
      expirandoEm30d: employeeCerts.filter(ec => 
        ec.vinculo === 'OBTIDO' && 
        ec.data_expiracao && 
        new Date(ec.data_expiracao) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ).length
    };
  };

  const handleViewAnalysts = (cert, status) => {
    setSelectedCert({ cert, status });
    setShowAnalystsModal(true);
    onViewAnalysts && onViewAnalysts(cert.id, status);
  };

  const getAnalystsByStatus = (certId, status) => {
    const employeeCerts = employeeCertifications.filter(ec => 
      ec.learning_item_id === certId && ec.vinculo === status
    );
    
    return employeeCerts.map(ec => {
      const employee = employees.find(emp => emp.id === ec.employee_id);
      return {
        ...employee,
        certificationData: ec
      };
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => {
          const stats = getCertificationStats(cert.id);
          
          return (
            <div
              key={cert.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {cert.nome}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {cert.codigo} • {cert.vendor}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {cert.tipo}
                    </span>
                    {cert.area && (
                      <span className="text-xs bg-ol-brand-100 text-ol-brand-700 px-2 py-1 rounded">
                        {cert.area}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ol-brand-600 hover:text-ol-brand-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  <button
                    onClick={() => onEditCertification && onEditCertification(cert)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                {/* Obtidas */}
                {stats.obtidas > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Obtidas:</span>
                    <button
                      onClick={() => handleViewAnalysts(cert, 'OBTIDO')}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      {stats.obtidas} analistas
                    </button>
                  </div>
                )}

                {/* Obrigatórias */}
                {stats.obrigatorias > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Obrigatórias:</span>
                    <button
                      onClick={() => handleViewAnalysts(cert, 'OBRIGATORIO')}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      {stats.obrigatorias} pendentes
                    </button>
                  </div>
                )}

                {/* Desejadas */}
                {stats.desejadas > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Desejadas:</span>
                    <button
                      onClick={() => handleViewAnalysts(cert, 'DESEJADO')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {stats.desejadas} analistas
                    </button>
                  </div>
                )}

                {/* Expirando */}
                {stats.expirandoEm30d > 0 && (
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
                    <span className="text-sm text-yellow-800">⚠️ Expirando em 30d:</span>
                    <span className="text-yellow-800 font-medium">{stats.expirandoEm30d}</span>
                  </div>
                )}

                {/* Sem vínculos */}
                {stats.obtidas === 0 && stats.obrigatorias === 0 && stats.desejadas === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    Nenhum analista vinculado
                  </p>
                )}
              </div>

              {/* Footer */}
              {cert.validade_meses && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Validade: {cert.validade_meses} meses
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Analistas */}
      <Modal
        isOpen={showAnalystsModal}
        onClose={() => {
          setShowAnalystsModal(false);
          setSelectedCert(null);
        }}
        title={selectedCert ? `${selectedCert.cert.nome} - ${selectedCert.status}` : ''}
        size="lg"
      >
        {selectedCert && (
          <AnalystsListContent
            analysts={getAnalystsByStatus(selectedCert.cert.id, selectedCert.status)}
            certification={selectedCert.cert}
            status={selectedCert.status}
          />
        )}
      </Modal>
    </>
  );
};

const AnalystsListContent = ({ analysts, certification, status }) => {
  if (analysts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum analista encontrado para este status.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        {analysts.length} analista(s) com status "{status}" para a certificação {certification.nome}
      </p>
      
      <div className="space-y-3">
        {analysts.map((analyst) => (
          <div
            key={analyst.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-ol-brand-100 rounded-full flex items-center justify-center">
                <span className="text-ol-brand-600 font-medium text-sm">
                  {analyst.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{analyst.nome}</p>
                <p className="text-sm text-gray-600">{analyst.cargo} • {analyst.equipe}</p>
              </div>
            </div>
            
            <div className="text-right">
              {status === 'OBTIDO' && analyst.certificationData.data_obtencao && (
                <p className="text-sm text-gray-600">
                  Obtido em: {new Date(analyst.certificationData.data_obtencao).toLocaleDateString('pt-BR')}
                </p>
              )}
              {status === 'OBTIDO' && analyst.certificationData.data_expiracao && (
                <p className="text-sm text-gray-600">
                  Expira em: {new Date(analyst.certificationData.data_expiracao).toLocaleDateString('pt-BR')}
                </p>
              )}
              {(status === 'DESEJADO' || status === 'OBRIGATORIO') && analyst.certificationData.data_alvo && (
                <p className="text-sm text-gray-600">
                  Meta: {new Date(analyst.certificationData.data_alvo).toLocaleDateString('pt-BR')}
                </p>
              )}
              <CertificationBadge 
                status={status}
                expirationDate={analyst.certificationData.data_expiracao}
                priority={analyst.certificationData.prioridade}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogGrid;
