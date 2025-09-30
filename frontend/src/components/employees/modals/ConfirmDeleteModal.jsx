import React from 'react';
import { AlertTriangle, Trash2, UserX } from 'lucide-react';

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  employee,
  onInactivate,
  onDelete,
  loading = false
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="p-6">
          {/* Header com ícone de alerta */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>

          {/* Título */}
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Confirmar Ação
          </h3>

          {/* Informações do colaborador */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {employee.avatar ? (
                  <img src={employee.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <UserX className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{employee.nome}</p>
                <p className="text-sm text-gray-600">{employee.cargo}</p>
                <p className="text-sm text-gray-500">{employee.equipe}</p>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <p className="text-gray-600 text-center mb-6">
            O que você gostaria de fazer com este colaborador?
          </p>

          {/* Botões de ação */}
          <div className="space-y-3">
            {/* Inativar (Soft Delete) */}
            <button
              onClick={() => onInactivate(employee.id)}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserX className="w-4 h-4" />
              <span>{loading ? 'Processando...' : 'Inativar Colaborador'}</span>
            </button>

            <p className="text-xs text-gray-500 text-center">
              Recomendado: Mantém histórico e permite reativação posterior
            </p>

            {/* Deletar Permanentemente (Hard Delete) */}
            <button
              onClick={() => onDelete(employee.id)}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>{loading ? 'Processando...' : 'Deletar Permanentemente'}</span>
            </button>

            <p className="text-xs text-red-500 text-center">
              ⚠️ Ação irreversível: Remove todos os dados do colaborador
            </p>
          </div>

          {/* Botão Cancelar */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
