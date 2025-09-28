import React, { useState } from 'react';
import KnowledgeBadge from './KnowledgeBadge';
import Modal from '../common/Modal';

// Grid de “conhecimentos” (certificações, cursos, graduações etc.)
const KnowledgeGrid = ({
  knowledge,             // array de objetos do mockKnowledgeData
  onEditKnowledge,       // função para editar o item (abre modal)
  employees,             // array de colaboradores
  employeeKnowledge      // array com os vínculos (tipo employeeCertifications)
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAnalystsModal, setShowAnalystsModal] = useState(false);

  const getKnowledgeStats = (itemId) => {
    const links = employeeKnowledge.filter(ec => ec.learning_item_id === itemId);
    return {
      desejadas: links.filter(link => link.vinculo === 'DESEJADO').length,
      obrigatorias: links.filter(link => link.vinculo === 'OBRIGATORIO').length,
      obtidas: links.filter(link => link.vinculo === 'OBTIDO').length,
      expirandoEm30d: links.filter(link => 
        link.vinculo === 'OBTIDO' &&
        link.data_expiracao &&
        new Date(link.data_expiracao) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ).length
    };
  };

  const handleViewAnalysts = (item, status) => {
    setSelectedItem({ item, status });
    setShowAnalystsModal(true);
  };

  const getAnalystsByStatus = (itemId, status) => {
    const links = employeeKnowledge.filter(ec =>
      ec.learning_item_id === itemId && ec.vinculo === status
    );
    return links.map(link => {
      const employee = employees.find(e => e.id === link.employee_id);
      return {
        ...employee,
        knowledgeData: link
      };
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {knowledge.map(item => {
          const stats = getKnowledgeStats(item.id);

          return (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.nome}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.codigo} • {item.vendor}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {item.tipo}
                    </span>
                    {item.area && (
                      <span className="text-xs bg-ol-brand-100 text-ol-brand-700 px-2 py-1 rounded">
                        {item.area}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {item.link && (
                    <a
                      href={item.link}
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
                    onClick={() => onEditKnowledge && onEditKnowledge(item)}
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
                      onClick={() => handleViewAnalysts(item, 'OBTIDO')}
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
                      onClick={() => handleViewAnalysts(item, 'OBRIGATORIO')}
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
                      onClick={() => handleViewAnalysts(item, 'DESEJADO')}
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
              {item.validade_meses && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Validade: {item.validade_meses} meses
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
          setSelectedItem(null);
        }}
        title={selectedItem ? `${selectedItem.item.nome} - ${selectedItem.status}` : ''}
        size="lg"
      >
        {selectedItem && (
          <AnalystsListContent
            analysts={getAnalystsByStatus(selectedItem.item.id, selectedItem.status)}
            knowledge={selectedItem.item}
            status={selectedItem.status}
          />
        )}
      </Modal>
    </>
  );
};

const AnalystsListContent = ({ analysts, knowledge, status }) => {
  if (!analysts.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum analista encontrado para este status.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        {analysts.length} analista(s) com status "{status}" para {knowledge.nome}
      </p>
      <div className="space-y-3">
        {analysts.map(a => (
          <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-ol-brand-100 rounded-full flex items-center justify-center">
                <span className="text-ol-brand-600 font-medium text-sm">
                  {a.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{a.nome}</p>
                <p className="text-sm text-gray-600">{a.cargo} • {a.equipe}</p>
              </div>
            </div>
            <div className="text-right">
              {status === 'OBTIDO' && a.knowledgeData.data_obtencao && (
                <p className="text-sm text-gray-600">
                  Obtido em: {new Date(a.knowledgeData.data_obtencao).toLocaleDateString('pt-BR')}
                </p>
              )}
              {status === 'OBTIDO' && a.knowledgeData.data_expiracao && (
                <p className="text-sm text-gray-600">
                  Expira em: {new Date(a.knowledgeData.data_expiracao).toLocaleDateString('pt-BR')}
                </p>
              )}
              {(status === 'DESEJADO' || status === 'OBRIGATORIO') && a.knowledgeData.data_alvo && (
                <p className="text-sm text-gray-600">
                  Meta: {new Date(a.knowledgeData.data_alvo).toLocaleDateString('pt-BR')}
                </p>
              )}
              <KnowledgeBadge 
                status={status}
                expirationDate={a.knowledgeData.data_expiracao}
                priority={a.knowledgeData.prioridade}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeGrid;
