import React from 'react';

const KnowledgeTab = ({ 
  employee,
  employeeKnowledge = [], // ✅ Proteção default
  setEmployeeKnowledge,
  knowledgeCatalog = [], // ✅ Proteção default
  onShowAddKnowledgeModal,
  onFileUpload
}) => {
  // ✅ Proteção contra dados undefined
  if (!employee || !Array.isArray(employeeKnowledge) || !Array.isArray(knowledgeCatalog)) {
    return (
      <div className="text-center py-8 text-ol-gray-500">
        <p>Erro ao carregar conhecimentos do colaborador</p>
      </div>
    );
  }

  const vinculosDoColab = employeeKnowledge.filter(v => v.employee_id === employee.id);

  const handleDeleteKnowledge = (vinculoId) => {
    if (window.confirm('Remover este vínculo de conhecimento?')) {
      setEmployeeKnowledge(prev => prev.filter(v => v.id !== vinculoId));
    }
  };

  const viewEvidence = (vinculo) => {
    if (!vinculo.anexo_path) {
      alert('Nenhum arquivo anexado para este vínculo.');
      return;
    }

    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html><head><title>Evidência - ${vinculo.learning_item_id}</title></head>
        <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f3f4f6;">
          ${vinculo.anexo_path.includes('data:application/pdf') 
            ? `<embed src="${vinculo.anexo_path}" width="100%" height="100%" type="application/pdf" />`
            : `<img src="${vinculo.anexo_path}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="Evidência" />`
          }
        </body></html>
      `);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-ol-brand-500">Conhecimentos do Colaborador</h4>
        <button
          onClick={onShowAddKnowledgeModal}
          className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600 text-sm"
        >
          Adicionar Conhecimento
        </button>
      </div>

      <div className="space-y-3">
        {vinculosDoColab.map(vinculo => {
          const conhecimento = knowledgeCatalog.find(k => k.id === vinculo.learning_item_id);
          return (
            <div key={`knowledge-${vinculo.id}`} className="flex items-center justify-between p-4 bg-ol-gray-50 rounded-lg border">
              <div className="flex-1">
                <h5 className="font-medium text-ol-gray-900">
                  {conhecimento?.nome || 'Conhecimento não encontrado'} 
                  {conhecimento?.tipo && (
                    <span className="ml-2 text-xs bg-ol-brand-100 text-ol-brand-700 px-2 py-1 rounded">
                      {conhecimento.tipo}
                    </span>
                  )}
                </h5>
                
                <div className="flex items-center space-x-4 mt-1 text-sm text-ol-gray-600">
                  <span className={`px-2 py-1 rounded text-xs ${
                    vinculo.status === 'OBTIDO' ? 'bg-green-100 text-green-700' :
                    vinculo.status === 'OBRIGATORIO' ? 'bg-red-100 text-red-700' :
                    vinculo.status === 'DESEJADO' ? 'bg-blue-100 text-blue-700' :
                    'bg-ol-brand-100 text-ol-brand-700'
                  }`}>
                    {vinculo.status}
                  </span>
                  
                  {vinculo.data_obtencao && (
                    <span>Obtido: {new Date(vinculo.data_obtencao).toLocaleDateString('pt-BR')}</span>
                  )}
                  
                  {vinculo.data_expiracao && (
                    <span>Expira: {new Date(vinculo.data_expiracao).toLocaleDateString('pt-BR')}</span>
                  )}
                  
                  {vinculo.data_alvo && (
                    <span>Meta: {new Date(vinculo.data_alvo).toLocaleDateString('pt-BR')}</span>
                  )}
                </div>
                
                {vinculo.anexo_path && (
                  <div className="mt-2 text-xs text-green-600 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Evidência anexada
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Upload de evidência para status OBTIDO */}
                {vinculo.status === 'OBTIDO' && (
                  <div>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => onFileUpload && onFileUpload(e, vinculo.id)}
                      className="hidden"
                      id={`kn-upload-${vinculo.id}`}
                    />
                    <label
                      htmlFor={`kn-upload-${vinculo.id}`}
                      className="cursor-pointer text-xs bg-ol-brand-100 text-ol-brand-700 px-2 py-1 rounded hover:bg-ol-brand-200 transition-colors"
                    >
                      📎 {vinculo.anexo_path ? 'Alterar' : 'Anexar'}
                    </label>
                  </div>
                )}
                
                {/* Visualizar evidência */}
                {vinculo.anexo_path && (
                  <button
                    onClick={() => viewEvidence(vinculo)}
                    className="text-blue-600 hover:text-blue-700 text-xs"
                  >
                    👁️ Ver
                  </button>
                )}
                
                {/* Alerta de vencimento */}
                {vinculo.data_expiracao && 
                 new Date(vinculo.data_expiracao) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    {new Date(vinculo.data_expiracao) < new Date() ? 'Vencido' : 'Vencendo'}
                  </span>
                )}
                
                {/* Botão deletar */}
                <button
                  onClick={() => handleDeleteKnowledge(vinculo.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Remover vínculo"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Estado vazio */}
        {vinculosDoColab.length === 0 && (
          <div className="text-center py-8 text-ol-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-ol-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Nenhum conhecimento vinculado para este colaborador</p>
            <p className="text-xs mt-2">Clique em "Adicionar Conhecimento" para começar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeTab;
