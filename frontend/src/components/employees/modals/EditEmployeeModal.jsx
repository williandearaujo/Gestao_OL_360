import React, { useState, useEffect } from 'react';
import TabButton from '../components/TabButton';
import { teamsService } from '../../../services/teamsService';
import { managersService } from '../../../services/managersService';

const EditEmployeeModal = ({
  isOpen,
  onClose,
  editingEmployee,
  setEditingEmployee,
  onEditEmployee,
  onPhotoUpload,
  employees,
  useAPI = false
}) => {
  const [activeTab, setActiveTab] = useState('dados');

  // ✅ ESTADOS PARA DROPDOWNS DINÂMICOS
  const [teams, setTeams] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ CARREGAR DADOS QUANDO MODAL ABRE
  useEffect(() => {
    if (isOpen && useAPI) {
      loadTeamsAndManagers();
    }
  }, [isOpen, useAPI]);

  // ✅ RESETAR ABA QUANDO MODAL ABRE
  useEffect(() => {
    if (isOpen) {
      setActiveTab('dados');
    }
  }, [isOpen]);

  // ✅ FUNÇÃO PARA CARREGAR DADOS DA API
  const loadTeamsAndManagers = async () => {
    setLoading(true);
    try {
      const [teamsData, managersData] = await Promise.all([
        teamsService.getAll(),
        managersService.getAll()
      ]);
      setTeams(teamsData);
      setManagers(managersData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !editingEmployee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-ol-brand-500">
              Editar Colaborador: {editingEmployee.nome}
            </h3>
            <button
              onClick={onClose}
              className="text-ol-gray-400 hover:text-ol-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ✅ INDICADOR DE MODO */}
          {useAPI && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-700 font-medium">
                  Modo API - Editando via servidor
                  {loading && " (Carregando dropdowns...)"}
                </span>
              </div>
            </div>
          )}

          {/* Abas */}
          <div className="flex space-x-2 mb-6 border-b">
            <TabButton id="dados" label="Dados Básicos" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="endereco" label="Endereço" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="profissional" label="Dados Profissionais" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <form onSubmit={onEditEmployee} className="space-y-6">
            {/* ABA DADOS BÁSICOS */}
            {activeTab === 'dados' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload de foto */}
                <div className="col-span-full flex items-center space-x-4">
                  <div className="w-16 h-16 bg-ol-brand-100 rounded-full flex items-center justify-center overflow-hidden">
                    {editingEmployee.avatar ? (
                      <img src={editingEmployee.avatar} alt="Preview" className="w-full h-full object-cover" />
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
                      onChange={(e) => onPhotoUpload(e, true)}
                      className="hidden"
                      id="photo-upload-edit"
                    />
                    <label
                      htmlFor="photo-upload-edit"
                      className="cursor-pointer bg-ol-brand-100 text-ol-brand-700 px-4 py-2 rounded-md hover:bg-ol-brand-200 text-sm"
                    >
                      Alterar Foto
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.nome}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={editingEmployee.email}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={editingEmployee.telefone || ''}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, telefone: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.cpf}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, cpf: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">RG</label>
                  <input
                    type="text"
                    value={editingEmployee.rg || ''}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, rg: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Data de Nascimento *</label>
                  <input
                    type="date"
                    required
                    value={editingEmployee.data_nascimento}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, data_nascimento: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Estado Civil</label>
                  <select
                    value={editingEmployee.estado_civil}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, estado_civil: e.target.value }))}
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
                    value={editingEmployee.endereco?.rua || ''}
                    onChange={(e) => setEditingEmployee(prev => ({
                      ...prev,
                      endereco: { ...prev.endereco, rua: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Número *</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.endereco?.numero || ''}
                    onChange={(e) => setEditingEmployee(prev => ({
                      ...prev,
                      endereco: { ...prev.endereco, numero: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Complemento</label>
                  <input
                    type="text"
                    value={editingEmployee.endereco?.complemento || ''}
                    onChange={(e) => setEditingEmployee(prev => ({
                      ...prev,
                      endereco: { ...prev.endereco, complemento: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Bairro *</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.endereco?.bairro || ''}
                    onChange={(e) => setEditingEmployee(prev => ({
                      ...prev,
                      endereco: { ...prev.endereco, bairro: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Cidade *</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.endereco?.cidade || ''}
                    onChange={(e) => setEditingEmployee(prev => ({
                      ...prev,
                      endereco: { ...prev.endereco, cidade: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Estado *</label>
                  <select
                    required
                    value={editingEmployee.endereco?.estado || ''}
                    onChange={(e) => setEditingEmployee(prev => ({
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
                    value={editingEmployee.endereco?.cep || ''}
                    onChange={(e) => setEditingEmployee(prev => ({
                      ...prev,
                      endereco: { ...prev.endereco, cep: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>
              </div>
            )}

            {/* ✅ ABA PROFISSIONAL COM DROPDOWNS DINÂMICOS */}
            {activeTab === 'profissional' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Cargo *</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.cargo}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, cargo: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                {/* 🔥 DROPDOWN DINÂMICO DE EQUIPES */}
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    Equipe *
                    {loading && <span className="text-xs text-gray-500 ml-1">(Carregando...)</span>}
                  </label>

                  {useAPI ? (
                    <select
                      required
                      value={editingEmployee.team_id || ''}
                      onChange={(e) => {
                        const selectedTeam = teams.find(t => t.id == e.target.value);
                        setEditingEmployee(prev => ({
                          ...prev,
                          team_id: e.target.value ? parseInt(e.target.value) : null,
                          equipe: selectedTeam ? selectedTeam.nome : ''
                        }));
                      }}
                      className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                      disabled={loading}
                    >
                      <option value="">Selecione uma equipe</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.nome}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      required
                      value={editingEmployee.equipe}
                      onChange={(e) => setEditingEmployee(prev => ({ ...prev, equipe: e.target.value }))}
                      className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    >
                      <option value="">Selecione a equipe</option>
                      <option value="Red Team">Red Team</option>
                      <option value="Blue Team">Blue Team</option>
                      <option value="SOC Team">SOC Team</option>
                      <option value="Compliance Team">Compliance Team</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Nível *</label>
                  <select
                    required
                    value={editingEmployee.nivel}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, nivel: e.target.value }))}
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

                {/* 🔥 DROPDOWN DINÂMICO DE GERENTES */}
                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    Gerente Responsável
                    {loading && <span className="text-xs text-gray-500 ml-1">(Carregando...)</span>}
                  </label>

                  {useAPI ? (
                    <select
                      value={editingEmployee.manager_id || ''}
                      onChange={(e) => setEditingEmployee(prev => ({
                        ...prev,
                        manager_id: e.target.value ? parseInt(e.target.value) : null
                      }))}
                      className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                      disabled={loading}
                    >
                      <option value="">Selecione um gerente</option>
                      {managers.map(manager => (
                        <option key={manager.id} value={manager.id}>
                          {manager.nome} ({manager.cargo})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={editingEmployee.manager_id || ''}
                      onChange={(e) => setEditingEmployee(prev => ({
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
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                    Tipo de Acesso
                  </label>
                  <select
                    value={editingEmployee.access_level || 'COLABORADOR'}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, access_level: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  >
                    <option value="COLABORADOR">Colaborador</option>
                    <option value="GESTOR">Gestor</option>
                    <option value="RH">RH</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Status</label>
                  <select
                    value={editingEmployee.status}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, status: e.target.value }))}
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
                    value={editingEmployee.data_admissao}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, data_admissao: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Salário</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingEmployee.salario}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, salario: e.target.value }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-ol-gray-700 mb-1">Competências</label>
                  <input
                    type="text"
                    value={editingEmployee.competencias ? editingEmployee.competencias.join(', ') : ''}
                    onChange={(e) => setEditingEmployee(prev => ({
                      ...prev,
                      competencias: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                    }))}
                    className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                    placeholder="Competências separadas por vírgula"
                  />
                </div>
              </div>
            )}

            {/* ✅ BOTÕES CORRIGIDOS - SALVAR EM TODAS AS ABAS */}
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

                {activeTab !== 'profissional' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'dados') setActiveTab('endereco');
                      if (activeTab === 'endereco') setActiveTab('profissional');
                    }}
                    className="px-4 py-2 text-ol-brand-600 border border-ol-brand-300 rounded-md hover:bg-ol-brand-50"
                  >
                    Próximo
                  </button>
                )}

                {/* ✅ BOTÃO SALVAR SEMPRE VISÍVEL */}
                <button
                  type="submit"
                  className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
