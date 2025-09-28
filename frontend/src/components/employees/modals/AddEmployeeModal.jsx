import React, { useState } from 'react';
import TabButton from '../components/TabButton';

const AddEmployeeModal = ({
  isOpen,
  onClose,
  newEmployee,
  setNewEmployee,
  onAddEmployee,
  onPhotoUpload,
  employees  // ✅ PROP ADICIONADA
}) => {
  const [activeTab, setActiveTab] = useState('dados');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-ol-brand-500">Adicionar Novo Colaborador</h3>
            <button
              onClick={onClose}
              className="text-ol-gray-400 hover:text-ol-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Abas */}
          <div className="flex space-x-2 mb-6 border-b">
            <TabButton id="dados" label="Dados Básicos" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="endereco" label="Endereço" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="profissional" label="Dados Profissionais" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <form onSubmit={onAddEmployee} className="space-y-6">
            {/* ABA DADOS BÁSICOS */}
            {activeTab === 'dados' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload de foto */}
                <div className="col-span-full flex items-center space-x-4">
                  <div className="w-16 h-16 bg-ol-brand-100 rounded-full flex items-center justify-center overflow-hidden">
                    {newEmployee.avatar ? (
                      <img src={newEmployee.avatar} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-ol-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onPhotoUpload(e)}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer bg-ol-brand-100 text-ol-brand-700 px-4 py-2 rounded-md hover:bg-ol-brand-200 text-sm"
                    >
                      Escolher Foto
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={newEmployee.nome}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="Nome completo do colaborador"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="email@oltecnologia.com.br"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={newEmployee.telefone}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, telefone: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    value={newEmployee.cpf}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, cpf: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">RG</label>
                  <input
                    type="text"
                    value={newEmployee.rg}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, rg: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="00.000.000-0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Data de Nascimento *</label>
                  <input
                    type="date"
                    required
                    value={newEmployee.data_nascimento}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, data_nascimento: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Estado Civil</label>
                  <select
                    value={newEmployee.estado_civil}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, estado_civil: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  >
                    <option value="SOLTEIRO">Solteiro(a)</option>
                    <option value="CASADO">Casado(a)</option>
                    <option value="DIVORCIADO">Divorciado(a)</option>
                    <option value="VIUVO">Viúvo(a)</option>
                  </select>
                </div>
              </div>
            )}

            {/* ABA ENDEREÇO */}
            {activeTab === 'endereco' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Rua *</label>
                  <input
                    type="text"
                    required
                    value={newEmployee.endereco.rua}
                    onChange={(e) => setNewEmployee(prev => ({ 
                      ...prev, 
                      endereco: { ...prev.endereco, rua: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="Nome da rua"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Número *</label>
                  <input
                    type="text"
                    required
                    value={newEmployee.endereco.numero}
                    onChange={(e) => setNewEmployee(prev => ({ 
                      ...prev, 
                      endereco: { ...prev.endereco, numero: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Complemento</label>
                  <input
                    type="text"
                    value={newEmployee.endereco.complemento}
                    onChange={(e) => setNewEmployee(prev => ({ 
                      ...prev, 
                      endereco: { ...prev.endereco, complemento: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="Apto, bloco, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Bairro *</label>
                  <input
                    type="text"
                    required
                    value={newEmployee.endereco.bairro}
                    onChange={(e) => setNewEmployee(prev => ({ 
                      ...prev, 
                      endereco: { ...prev.endereco, bairro: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="Nome do bairro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Cidade *</label>
                  <input
                    type="text"
                    required
                    value={newEmployee.endereco.cidade}
                    onChange={(e) => setNewEmployee(prev => ({ 
                      ...prev, 
                      endereco: { ...prev.endereco, cidade: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="São Paulo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Estado *</label>
                  <select
                    required
                    value={newEmployee.endereco.estado}
                    onChange={(e) => setNewEmployee(prev => ({ 
                      ...prev, 
                      endereco: { ...prev.endereco, estado: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  >
                    <option value="">Selecione o estado</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="PR">Paraná</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">CEP *</label>
                  <input
                    type="text"
                    required
                    value={newEmployee.endereco.cep}
                    onChange={(e) => setNewEmployee(prev => ({ 
                      ...prev, 
                      endereco: { ...prev.endereco, cep: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="00000-000"
                  />
                </div>
              </div>
            )}

            {/* ABA PROFISSIONAL - ✅ COMPLETA E CORRIGIDA */}
            {activeTab === 'profissional' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Cargo *</label>
                  <input
                    type="text"
                    required
                    value={newEmployee.cargo}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, cargo: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="Analista, Coordenador, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Equipe *</label>
                  <select
                    required
                    value={newEmployee.equipe}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, equipe: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  >
                    <option value="">Selecione a equipe</option>
                    <option value="Red Team">Red Team</option>
                    <option value="Blue Team">Blue Team</option>
                    <option value="SOC Team">SOC Team</option>
                    <option value="Compliance Team">Compliance Team</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Nível *</label>
                  <select
                    required
                    value={newEmployee.nivel}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, nivel: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  >
                    <option value="ESTAGIARIO">Estagiário</option>
                    <option value="JUNIOR">Júnior</option>
                    <option value="PLENO">Pleno</option>
                    <option value="SENIOR">Sênior</option>
                    <option value="COORDENADOR">Coordenador</option>
                    <option value="GERENTE">Gerente</option>
                    <option value="DIRETOR">Diretor</option>
                  </select>
                </div>

                {/* ✅ Gerente Responsável */}
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    Gerente Responsável
                  </label>
                  <select
                    value={newEmployee.manager_id || ''}
                    onChange={(e) => setNewEmployee(prev => ({ 
                      ...prev, 
                      manager_id: e.target.value ? parseInt(e.target.value) : null 
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  >
                    <option value="">Nenhum gerente</option>
                    {employees && employees
                      .filter(emp => ['GERENTE', 'DIRETOR', 'COORDENADOR'].includes(emp.nivel))
                      .map(manager => (
                        <option key={manager.id} value={manager.id}>
                          {manager.nome} ({manager.cargo})
                        </option>
                      ))
                    }
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Selecione o gerente direto deste colaborador
                  </p>
                </div>

                {/* ✅ Tipo de Acesso */}
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    Tipo de Acesso
                  </label>
                  <select
                    value={newEmployee.access_level || 'COLABORADOR'}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, access_level: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  >
                    <option value="COLABORADOR">Colaborador</option>
                    <option value="GESTOR">Gestor</option>
                    <option value="RH">RH</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Define o nível de acesso na plataforma
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Status</label>
                  <select
                    value={newEmployee.status}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  >
                    <option value="ATIVO">Ativo</option>
                    <option value="FERIAS">Férias</option>
                    <option value="LICENCA">Licença</option>
                    <option value="INATIVO">Inativo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Data de Admissão *</label>
                  <input
                    type="date"
                    required
                    value={newEmployee.data_admissao}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, data_admissao: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Salário</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newEmployee.salario}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, salario: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="5000.00"
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Competências</label>
                  <input
                    type="text"
                    placeholder="Digite competências separadas por vírgula"
                    onChange={(e) => setNewEmployee(prev => ({ 
                      ...prev, 
                      competencias: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                  <p className="text-xs text-ol-gray-500 mt-1">Ex: Penetration Testing, OSINT, Social Engineering</p>
                </div>
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex justify-between pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-ol-gray-600 border border-ol-gray-300 rounded-md hover:bg-ol-gray-50"
              >
                Cancelar
              </button>
              <div className="flex space-x-3">
                {activeTab !== 'dados' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'endereco') setActiveTab('dados');
                      if (activeTab === 'profissional') setActiveTab('endereco');
                    }}
                    className="px-4 py-2 text-ol-brand-600 border border-ol-brand-300 rounded-md hover:bg-ol-brand-50"
                  >
                    Anterior
                  </button>
                )}
                {activeTab !== 'profissional' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'dados') setActiveTab('endereco');
                      if (activeTab === 'endereco') setActiveTab('profissional');
                    }}
                    className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600"
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600"
                  >
                    Salvar Colaborador
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
