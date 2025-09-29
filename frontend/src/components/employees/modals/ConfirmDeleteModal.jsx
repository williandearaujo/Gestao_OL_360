import React, { useState } from 'react';

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  employee,
  onInactivate,
  onDelete,
  loading
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !employee) return null;

  // Modal de confirmação final para delete
  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDeleteConfirm(false)}></div>

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  ⚠️ CONFIRMAÇÃO FINAL
                </h3>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                Tem certeza que deseja <strong className="text-red-600">DELETAR PERMANENTEMENTE</strong> o funcionário:
              </p>
              <div className="bg-red-50 p-3 rounded-md border border-red-200">
                <p className="font-medium text-red-800">{employee.nome}</p>
                <p className="text-sm text-red-600">{employee.email}</p>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ ATENÇÃO:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Todos os dados serão perdidos</li>
                  <li>• Todo o histórico será excluído</li>
                  <li>• Esta ação NÃO pode ser desfeita</li>
                  <li>• Recomendamos "Inativar" em vez de deletar</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(employee.id);
                  setShowDeleteConfirm(false);
                  onClose();
                }}
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Deletando...' : '🗑️ DELETAR PERMANENTEMENTE'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal principal - Escolher ação
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Remover Funcionário
              </h3>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">
              O que você deseja fazer com o funcionário:
            </p>
            <div className="bg-gray-50 p-3 rounded-md border">
              <p className="font-medium text-gray-800">{employee.nome}</p>
              <p className="text-sm text-gray-600">{employee.cargo} - {employee.equipe}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {/* Opção Inativar */}
            <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-yellow-800">💼 Inativar Funcionário</h4>
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Recomendado</span>
              </div>
              <p className="text-sm text-yellow-700 mb-3">
                Muda o status para "INATIVO". Mantém todo o histórico e dados.
              </p>
              <ul className="text-xs text-yellow-600 space-y-1">
                <li>✅ Mantém histórico completo</li>
                <li>✅ Pode ser reativado depois</li>
                <li>✅ Dados preservados</li>
              </ul>
            </div>

            {/* Opção Deletar */}
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h4 className="font-medium text-red-800 mb-2">🗑️ Deletar Permanentemente</h4>
              <p className="text-sm text-red-700 mb-3">
                Remove completamente do sistema. AÇÃO IRREVERSÍVEL.
              </p>
              <ul className="text-xs text-red-600 space-y-1">
                <li>❌ Perde todo o histórico</li>
                <li>❌ Não pode ser recuperado</li>
                <li>❌ Dados perdidos para sempre</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onInactivate(employee.id);
                onClose();
              }}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              {loading ? 'Inativando...' : '💼 Inativar'}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            >
              🗑️ Deletar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
