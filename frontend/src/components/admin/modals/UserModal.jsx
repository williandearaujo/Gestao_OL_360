import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const UserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cargo: '',
    area: '',
    equipe: '',
    role: 'colaborador'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        cargo: user.cargo || '',
        area: user.area || '',
        equipe: user.equipe || '',
        role: user.role || 'colaborador'
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        cargo: '',
        area: '',
        equipe: '',
        role: 'colaborador'
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'E-mail inválido';
    if (!formData.cargo.trim()) newErrors.cargo = 'Cargo é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({ ...user, ...formData });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg max-w-lg w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {user ? 'Editar Usuário' : 'Novo Usuário'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.nome ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: João Silva"
              />
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: joao.silva@empresa.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo *</label>
              <input
                type="text"
                value={formData.cargo}
                onChange={(e) => setFormData(prev => ({ ...prev, cargo: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cargo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Desenvolvedor Sênior"
              />
              {errors.cargo && <p className="text-red-500 text-xs mt-1">{errors.cargo}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Tecnologia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipe</label>
                <input
                  type="text"
                  value={formData.equipe}
                  onChange={(e) => setFormData(prev => ({ ...prev, equipe: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Desenvolvimento"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Função no Sistema</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="colaborador">👤 Colaborador</option>
                <option value="gerente">👔 Gerente</option>
                <option value="diretoria">💼 Diretoria</option>
                <option value="admin">🔧 Administrador</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {user ? 'Salvar Alterações' : 'Criar Usuário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
