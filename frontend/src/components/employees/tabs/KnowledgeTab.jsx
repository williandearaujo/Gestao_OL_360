import React, { useState, useMemo } from 'react';
import { Award, Plus, FileText, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const KnowledgeTab = ({
  employee,
  employeeKnowledge = [],
  setEmployeeKnowledge,
  knowledgeCatalog = [],
  onShowAddKnowledgeModal,
  onFileUpload
}) => {
  const [filter, setFilter] = useState('TODOS');

  // ✅ FILTRAR CONHECIMENTOS DO COLABORADOR
  const employeeLinks = useMemo(() => {
    console.log('🔍 KnowledgeTab - employeeKnowledge:', employeeKnowledge);
    console.log('🔍 KnowledgeTab - knowledgeCatalog:', knowledgeCatalog);
    console.log('🔍 KnowledgeTab - employee.id:', employee?.id);

    if (!employeeKnowledge || !Array.isArray(employeeKnowledge)) {
      console.log('❌ employeeKnowledge não é um array válido');
      return [];
    }

    return employeeKnowledge.filter(link => {
      const matches = link.employee_id === employee.id;
      if (matches) {
        console.log('✅ Link encontrado para employee:', link);
      }
      return matches;
    });
  }, [employeeKnowledge, employee?.id]);

  // ✅ APLICAR FILTROS
  const filteredLinks = useMemo(() => {
    if (filter === 'TODOS') return employeeLinks;
    return employeeLinks.filter(link => link.status === filter);
  }, [employeeLinks, filter]);

  // ✅ FUNÇÃO PARA BUSCAR DETALHES DO CONHECIMENTO
  const getKnowledgeDetails = (link) => {
    if (!knowledgeCatalog || knowledgeCatalog.length === 0) {
      console.log('❌ knowledgeCatalog está vazio');
      return null;
    }

    const knowledgeId = link.learning_item_id;
    const item = knowledgeCatalog.find(k => k.id === knowledgeId);

    if (!item) {
      console.log(`❌ Conhecimento não encontrado para ID: ${knowledgeId}`);
    }

    return item || null;
  };

  // ✅ FUNÇÃO PARA ABRIR MODAL DE ADICIONAR CONHECIMENTO
  const handleAddKnowledge = () => {
    console.log('🎯 Abrindo modal para adicionar conhecimento ao employee:', employee.nome);
    if (onShowAddKnowledgeModal) {
      onShowAddKnowledgeModal(employee);
    } else {
      console.log('❌ onShowAddKnowledgeModal não foi fornecido');
    }
  };

  // ✅ FORMATADORES
  const formatDate = (date) => {
    if (!date) return 'Não definido';
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'OBTIDO': 'bg-green-100 text-green-800',
      'OBRIGATORIO': 'bg-red-100 text-red-800',
      'DESEJADO': 'bg-blue-100 text-blue-800',
      'EXPIRANDO': 'bg-yellow-100 text-yellow-800',
      'EXPIRADO': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (prioridade) => {
    const colors = {
      'ALTA': 'bg-red-100 text-red-800',
      'MEDIA': 'bg-yellow-100 text-yellow-800',
      'BAIXA': 'bg-green-100 text-green-800'
    };
    return colors[prioridade] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OBTIDO':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'OBRIGATORIO':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'DESEJADO':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Award className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* ✅ HEADER COM FILTROS E BOTÃO ADICIONAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="font-semibold text-ol-brand-700 mb-2">Conhecimentos do Colaborador</h4>
          <p className="text-sm text-ol-gray-600">
            {filteredLinks.length} conhecimento(s) {filter !== 'TODOS' && `com status: ${filter}`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Filtro por status */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm"
          >
            <option value="TODOS">Todos</option>
            <option value="OBTIDO">Obtidos</option>
            <option value="OBRIGATORIO">Obrigatórios</option>
            <option value="DESEJADO">Desejados</option>
          </select>

          {/* Botão adicionar conhecimento */}
          <button
            onClick={handleAddKnowledge}
            className="px-4 py-2 bg-ol-brand-600 text-white rounded-md hover:bg-ol-brand-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Conhecimento</span>
          </button>
        </div>
      </div>

      {/* ✅ LISTA DE CONHECIMENTOS */}
      {filteredLinks.length > 0 ? (
        <div className="space-y-4">
          {filteredLinks.map((link) => {
            const knowledgeItem = getKnowledgeDetails(link);

            return (
              <div key={link.id} className="bg-white border border-ol-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    {getStatusIcon(link.status)}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-ol-gray-900 truncate">
                        {knowledgeItem ? knowledgeItem.nome : `Conhecimento ID: ${link.learning_item_id}`}
                      </h5>
                      {knowledgeItem && (
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-ol-gray-100 text-ol-gray-700 rounded">
                            {knowledgeItem.tipo}
                          </span>
                          {knowledgeItem.categoria && (
                            <span className="text-xs text-ol-gray-500">
                              {knowledgeItem.categoria}
                            </span>
                          )}
                          {knowledgeItem.fornecedor && (
                            <span className="text-xs text-ol-gray-500">
                              • {knowledgeItem.fornecedor}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(link.status)}`}>
                        {link.status}
                      </span>
                      {link.prioridade && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(link.prioridade)}`}>
                          {link.prioridade}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ✅ INFORMAÇÕES DO VÍNCULO */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  {link.data_alvo && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-ol-gray-400" />
                      <div>
                        <span className="text-ol-gray-600">Data alvo:</span>
                        <span className="ml-1 font-medium">{formatDate(link.data_alvo)}</span>
                      </div>
                    </div>
                  )}

                  {link.data_obtencao && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <div>
                        <span className="text-ol-gray-600">Obtido em:</span>
                        <span className="ml-1 font-medium">{formatDate(link.data_obtencao)}</span>
                      </div>
                    </div>
                  )}

                  {link.data_expiracao && (
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <div>
                        <span className="text-ol-gray-600">Expira em:</span>
                        <span className="ml-1 font-medium">{formatDate(link.data_expiracao)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ✅ OBSERVAÇÕES */}
                {link.observacoes && (
                  <div className="mt-3 pt-3 border-t border-ol-gray-100">
                    <p className="text-sm text-ol-gray-600">
                      <strong>Observações:</strong> {link.observacoes}
                    </p>
                  </div>
                )}

                {/* ✅ ANEXO */}
                {link.anexo_path && (
                  <div className="mt-3 pt-3 border-t border-ol-gray-100">
                    <div className="flex items-center space-x-2 text-sm">
                      <FileText className="w-4 h-4 text-ol-brand-500" />
                      <span className="text-ol-gray-600">Anexo:</span>
                      <a
                        href={link.anexo_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ol-brand-600 hover:text-ol-brand-700 underline"
                      >
                        Ver documento
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // ✅ ESTADO VAZIO
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-ol-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-ol-gray-900 mb-2">
            {filter === 'TODOS' ?
              'Nenhum conhecimento cadastrado' :
              `Nenhum conhecimento com status: ${filter}`
            }
          </h3>
          <p className="text-ol-gray-600 mb-6">
            {filter === 'TODOS' ?
              'Comece adicionando certificações, cursos ou formações para este colaborador.' :
              'Altere o filtro para ver outros conhecimentos.'
            }
          </p>
          <button
            onClick={handleAddKnowledge}
            className="px-6 py-3 bg-ol-brand-600 text-white rounded-md hover:bg-ol-brand-700 transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar Primeiro Conhecimento</span>
          </button>
        </div>
      )}

      {/* ✅ DEBUG INFO (REMOVER EM PRODUÇÃO) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 p-3 rounded text-xs">
          <details>
            <summary className="cursor-pointer font-semibold">🔍 Debug Info</summary>
            <div className="mt-2 space-y-1">
              <div>Employee ID: {employee?.id}</div>
              <div>Total employeeKnowledge: {employeeKnowledge?.length || 0}</div>
              <div>Employee Links: {employeeLinks.length}</div>
              <div>Filtered Links: {filteredLinks.length}</div>
              <div>Knowledge Catalog: {knowledgeCatalog?.length || 0}</div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default KnowledgeTab;
