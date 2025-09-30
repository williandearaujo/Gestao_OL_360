import React, { useState, useEffect } from 'react';
import TabButton from '../components/TabButton';

// ✅ FUNÇÃO PARA FAZER PARSE DO ENDEREÇO JSON
const parseEndereco = (enderecoString) => {
  try {
    if (!enderecoString) return {};
    if (typeof enderecoString === 'object') return enderecoString;

    // Remove escapes desnecessários e faz parse
    const cleanJson = enderecoString.replace(/\"\"/g, '"');
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('❌ Erro ao fazer parse do endereço:', error);
    return {};
  }
};

// ✅ FUNÇÃO PARA CONVERTER ENDEREÇO PARA STRING JSON
const stringifyEndereco = (enderecoObj) => {
  try {
    if (!enderecoObj || typeof enderecoObj !== 'object') return '';
    return JSON.stringify(enderecoObj);
  } catch (error) {
    console.error('❌ Erro ao converter endereço para JSON:', error);
    return '';
  }
};

const EditEmployeeModal = ({
  isOpen,
  onClose,
  editingEmployee,
  setEditingEmployee,
  onEditEmployee,
  onPhotoUpload,
  employees,
  useAPI = true,
  adminData,
  adminLoading
}) => {
  const [activeTab, setActiveTab] = useState('dados');

  // ✅ DADOS VINDOS DO useAdminData COM PROTEÇÃO
  const { areas = [], teams = [], managers = [] } = adminData || {};
  const loading = adminLoading || false;

  // ✅ RESETAR ABA QUANDO MODAL ABRE
  useEffect(() => {
    if (isOpen) {
      setActiveTab('dados');
    }
  }, [isOpen]);

  // ✅ FAZER PARSE DO ENDEREÇO QUANDO EMPLOYEE MUDA
  useEffect(() => {
    if (editingEmployee && editingEmployee.endereco) {
      const enderecoObj = parseEndereco(editingEmployee.endereco);
      if (JSON.stringify(enderecoObj) !== JSON.stringify(editingEmployee.endereco_parsed)) {
        setEditingEmployee(prev => ({
          ...prev,
          endereco_parsed: enderecoObj
        }));
      }
    }
  }, [editingEmployee?.endereco]);

  // ✅ FILTRAR EQUIPES POR ÁREA SELECIONADA COM PROTEÇÃO
  const availableTeams = teams.filter(team => {
    try {
      return !editingEmployee?.area_id || team.area_id === editingEmployee.area_id;
    } catch (error) {
      console.error('❌ Erro ao filtrar equipes:', error);
      return [];
    }
  });

  // ✅ FUNÇÃO DE PROTEÇÃO PARA UPDATES
  const safeSetEditingEmployee = (updateFn) => {
    try {
      setEditingEmployee(updateFn);
    } catch (error) {
      console.error('❌ Erro ao atualizar funcionário:', error);
    }
  };

  if (!isOpen || !editingEmployee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-red-600">
              Editar Colaborador: {editingEmployee.nome || 'Sem nome'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ✅ INDICADOR DE MODE COM DADOS ADMIN - CORES PADRÃO */}
          {useAPI && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-700 font-medium">
                  Modo API - Editando com dados reais
                  {loading && " (Carregando...)"}
                </span>
                <span className="text-xs text-blue-600 ml-2">
                  ({areas.length} áreas, {teams.length} equipes, {managers.length} gerentes)
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
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {editingEmployee.avatar ? (
                      <img src={editingEmployee.avatar} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-sm transition-colors"
                    >
                      Alterar Foto
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.nome || ''}
                    onChange={(e) => safeSetEditingEmployee(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={editingEmployee.email || ''}
                    onChange={(e) => safeSetEditingEmployee(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={editingEmployee.telefone || ''}
                    onChange={(e) => safeSetEditingEmployee(prev => ({ ...prev, telefone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.cpf || ''}
                    onChange={(e) => safeSetEditingEmployee(prev => ({ ...prev, cpf: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                  <input
                    type="text"
                    value={editingEmployee.rg || ''}
                    onChange={(e) => safeSetEditingEmployee(prev => ({ ...prev, rg: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento *</label>
                  <input
                    type="date"
                    required
                    value={editingEmployee.data_nascimento || ''}
                    onChange={(e) => safeSetEditingEmployee(prev => ({ ...prev, data_nascimento: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
                  <select
                    value={editingEmployee.estado_civil || 'SOLTEIRO'}
                    onChange={(e) => safeSetEditingEmployee(prev => ({ ...prev, estado_civil: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="SOLTEIRO">Solteiro(a)</option>
                    <option value="CASADO">Casado(a)</option>
                    <option value="DIVORCIADO">Divorciado(a)</option>
                    <option value="VIUVO">Viúvo(a)</option>
                  </select>
                </div>
              </div>
            )}

            {/* ✅ ABA ENDEREÇO - COM PARSING DE JSON */}
            {activeTab === 'endereco' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rua *</label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.endereco_parsed?.rua || ''}
                      onChange={(e) => {
                        const newEndereco = { ...editingEmployee.endereco_parsed, rua: e.target.value };
                        safeSetEditingEmployee(prev => ({
                          ...prev,
                          endereco_parsed: newEndereco,
                          endereco: stringifyEndereco(newEndereco)
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.endereco_parsed?.numero || ''}
                      onChange={(e) => {
                        const newEndereco = { ...editingEmployee.endereco_parsed, numero: e.target.value };
                        safeSetEditingEmployee(prev => ({
                          ...prev,
                          endereco_parsed: newEndereco,
                          endereco: stringifyEndereco(newEndereco)
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                    <input
                      type="text"
                      value={editingEmployee.endereco_parsed?.complemento || ''}
                      onChange={(e) => {
                        const newEndereco = { ...editingEmployee.endereco_parsed, complemento: e.target.value };
                        safeSetEditingEmployee(prev => ({
                          ...prev,
                          endereco_parsed: newEndereco,
                          endereco: stringifyEndereco(newEndereco)
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.endereco_parsed?.bairro || ''}
                      onChange={(e) => {
                        const newEndereco = { ...editingEmployee.endereco_parsed, bairro: e.target.value };
                        safeSetEditingEmployee(prev => ({
                          ...prev,
                          endereco_parsed: newEndereco,
                          endereco: stringifyEndereco(newEndereco)
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.endereco_parsed?.cidade || ''}
                      onChange={(e) => {
                        const newEndereco = { ...editingEmployee.endereco_parsed, cidade: e.target.value };
                        safeSetEditingEmployee(prev => ({
                          ...prev,
                          endereco_parsed: newEndereco,
                          endereco: stringifyEndereco(newEndereco)
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <select
                      required
                      value={editingEmployee.endereco_parsed?.estado || ''}
                      onChange={(e) => {
                        const newEndereco = { ...editingEmployee.endereco_parsed, estado: e.target.value };
                        safeSetEditingEmployee(prev => ({
                          ...prev,
                          endereco_parsed: newEndereco,
                          endereco: stringifyEndereco(newEndereco)
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.endereco_parsed?.cep || ''}
                      onChange={(e) => {
                        const newEndereco = { ...editingEmployee.endereco_parsed, cep: e.target.value };
                        safeSetEditingEmployee(prev => ({
                          ...prev,
                          endereco_parsed: newEndereco,
                          endereco: stringifyEndereco(newEndereco)
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ✅ ABA PROFISSIONAL - ULTRA PROTEGIDA */}
            {activeTab === 'profissional' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo *</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.cargo || ''}
                    onChange={(e) => safeSetEditingEmployee(prev => ({ ...prev, cargo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                {/* ✅ SELECT DE ÁREA SUPER PROTEGIDO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Área *
                    {loading && <span className="text-xs text-gray-500 ml-1">(Carregando...)</span>}
                  </label>
                  <select
                    required
                    value={editingEmployee.area_id || ''}
                    onChange={(e) => {
                      try {
                        const areaId = e.target.value ? parseInt(e.target.value) : null;
                        safeSetEditingEmployee(prev => ({
                          ...prev,
                          area_id: areaId,
                          team_id: null // Reset equipe ao mudar área
                        }));
                      } catch (error) {
                        console.error('❌ Erro ao mudar área:', error);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    disabled={loading}
                  >
                    <option value="">Selecione uma área</option>
                    {areas.map(area => (
                      <option key={area.id || Math.random()} value={area.id}>
                        {area.nome || 'Área sem nome'} ({area.sigla || 'N/A'})
                      </option>
                    ))}
                  </select>
                  {areas.length === 0 && !loading && (
                    <p className="text-xs text-red-500 mt-1">⚠️ Nenhuma área encontrada</p>
                  )}
                </div>

                {/* ✅ SELECT DE EQUIPE SUPER PROTEGIDO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipe *
                    {loading && <span className="text-xs text-gray-500 ml-1">(Carregando...)</span>}
                  </label>
                  <select
                    required
                    value={editingEmployee.team_id || ''}
                    onChange={(e) => {
                      try {
                        const selectedTeam = availableTeams.find(t => t.id == e.target.value);
                        safeSetEditingEmployee(prev => ({
                          ...prev,
                          team_id: e.target.value ? parseInt(e.target.value) : null,
                          equipe: selectedTeam ? selectedTeam.nome : ''
                        }));
                      } catch (error) {
                        console.error('❌ Erro ao mudar equipe:', error);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    disabled={loading || !editingEmployee.area_id}
                  >
                    <option value="">
                      {!editingEmployee.area_id ? 'Selecione uma área primeiro' : 'Selecione uma equipe'}
                    </option>
                    {availableTeams.map(team => (
                      <option key={team.id || Math.random()} value={team.id}>
                        {team.nome || 'Equipe sem nome'}
                      </option>
                    ))}
                  </select>
                  {!editingEmployee.area_id && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selecione uma área para ver as equipes disponíveis
                    </p>
                  )}
                  {availableTeams.length === 0 && editingEmployee.area_id && !loading && (
                    <p className="text-xs text-red-500 mt-1">⚠️ Nenhuma equipe encontrada para esta área</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nível *</label>
                  <select
                    required
                    value={editingEmployee.nivel || 'JUNIOR'}
                    onChange={(e) => safeSetEditingEmployee(prev => ({ ...prev, nivel: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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

                {/* ✅ SELECT DE GERENTE SUPER PROTEGIDO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gerente Responsável
                    {loading && <span className="text-xs text-gray-500 ml-1">(Carregando...)</span>}
                  </label>
                  <select
                    value={editingEmployee.manager_id || ''}
                    onChange={(e) => safeSetEditingEmployee(prev => ({
                      ...prev,
                      manager_id: e.target.value ? parseInt(e.target.value) : null
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    disabled={loading}
                  >
                    <option value="">Selecione um gerente</option>
                    {managers.map(manager => (
                      <option key={manager.id || Math.random()} value={manager.id}>
                        {manager.nome || 'Gerente sem nome'} ({manager.cargo || 'Cargo não informado'})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Selecione o gerente direto deste colaborador
                  </p>
                  {managers.length === 0 && !loading && (
                    <p className="text-xs text-red-500 mt-1">⚠️ Nenhum gerente encontrado</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Acesso
                  </label>
                  <select
                    value={editingEmployee.access_level || 'COLABORADOR'}
                    onChange={(e) => safeSetEditingEmployee(prev => ({ ...prev, access_level: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingEmployee.status || 'ATIVO'}
                    onChange={(e) => safeSetEditingEmployee(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="ATIVO">Ativo</option>
                    <option value="FERIAS">Férias</option>
                    <option value="LICENCA">Licença</option>
                    <option value="INATIVO">Inativo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Admissão *</label>
                  <input
                    type="date"
                    required
                    value={editingEmployee.data_admissao || ''}
                    onChange={(e) => safeSetEditingEmployee(prev => ({ ...prev, data_admissao: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salário</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingEmployee.salario || ''}
                    onChange={(e) => safeSetEditingEmployee(prev => ({ ...prev, salario: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Competências</label>
                  <input
                    type="text"
                    value={Array.isArray(editingEmployee.competencias) ? editingEmployee.competencias.join(', ') : editingEmployee.competencias || ''}
                    onChange={(e) => safeSetEditingEmployee(prev => ({
                      ...prev,
                      competencias: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Competências separadas por vírgula"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ex: Penetration Testing, OSINT, Social Engineering</p>
                </div>
              </div>
            )}

            {/* ✅ BOTÕES DE AÇÃO - CORES PADRÃO */}
            <div className="flex justify-between pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
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
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Próximo
                  </button>
                )}

                {/* ✅ BOTÃO SALVAR SEMPRE PRESENTE */}
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
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
