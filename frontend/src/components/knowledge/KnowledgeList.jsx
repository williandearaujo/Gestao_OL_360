import React from 'react';

const KnowledgeList = ({ knowledge, onEdit, onDelete, isEmpty, onAddFirst }) => {
  if (isEmpty) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-ol-gray-900 mb-2">Catálogo vazio</h3>
        <p className="text-ol-gray-500 mb-4">
          Comece adicionando certificações, cursos ou formações ao catálogo.
        </p>
        <button
          onClick={onAddFirst}
          className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600"
        >
          ➕ Adicionar Primeiro Conhecimento
        </button>
      </div>
    );
  }

  if (knowledge.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-ol-gray-900 mb-2">Nenhum conhecimento encontrado</h3>
        <p className="text-ol-gray-500 mb-4">
          Tente ajustar os filtros para encontrar conhecimentos.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Catálogo de Conhecimentos</h3>
        <p className="text-sm text-gray-600">Conhecimentos disponíveis para vincular aos colaboradores</p>
      </div>

      <div className="divide-y divide-gray-200">
        {knowledge.map((item) => (
          <div key={item.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-gray-900">{item.nome}</h4>
                  <span className={`px-2 py-1 text-xs rounded ${
                    item.tipo === 'CERTIFICACAO' ? 'bg-blue-100 text-blue-800' :
                    item.tipo === 'CURSO' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {item.tipo}
                  </span>
                  {item.codigo && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.codigo}
                    </span>
                  )}
                  {item.validade_meses && (
                    <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      ⏰ {item.validade_meses}m
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                  {item.vendor && <span>📍 {item.vendor}</span>}
                  <span>🏷️ {item.area}</span>
                  {item.nivel_formacao && <span>🎓 {item.nivel_formacao}</span>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600"
                    title="Abrir link"
                  >
                    🔗
                  </a>
                )}
                <button
                  onClick={() => onEdit(item)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-gray-400 hover:text-red-600"
                  title="Excluir"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeList;
