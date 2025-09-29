import React, { useState, useEffect } from 'react';

// ✅ SERVICE CORRETO PARA CONHECIMENTOS
const API_BASE_URL = 'http://localhost:8000';

const api = {
  get: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { data: await response.json() };
  },
  put: async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { data: await response.json() };
  },
  delete: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { success: true };
  }
};

const knowledgeService = {
  async getAll() {
    try {
      const response = await api.get('/knowledge');
      return response.data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar conhecimentos:', error);
      return [];
    }
  }
};

const employeeKnowledgeService = {
  async update(linkId, data) {
    try {
      const response = await api.put(`/employee-knowledge/${linkId}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar vínculo:', error);
      throw error;
    }
  },
  async delete(linkId) {
    try {
      await api.delete(`/employee-knowledge/${linkId}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar vínculo:', error);
      throw error;
    }
  }
};

const EmployeeDetailModal = ({
  isOpen,
  onClose,
  selectedEmployee,
  setSelectedEmployee,
  setEmployees,
  employees,
  onManageLinks,
  employeeLinks = [],
  setEmployeeLinks
}) => {
  const [activeTab, setActiveTab] = useState('geral');
  const [editingField, setEditingField] = useState(null);

  // Estados para vínculos
  const [knowledge, setKnowledge] = useState([]);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);
  const [linkFilter, setLinkFilter] = useState('todos');

  // Estados para modal de edição inline
  const [editingLink, setEditingLink] = useState(null);
  const [showEditLinkModal, setShowEditLinkModal] = useState(false);
  const [editLinkLoading, setEditLinkLoading] = useState(false);

  // ✅ CARREGAR CONHECIMENTOS
  useEffect(() => {
    if (isOpen && activeTab === 'vinculos' && knowledge.length === 0) {
      loadKnowledge();
    }
  }, [isOpen, activeTab]);

  const loadKnowledge = async () => {
    try {
      setKnowledgeLoading(true);
      const data = await knowledgeService.getAll();
      setKnowledge(data);
    } catch (error) {
      console.error('Erro ao carregar conhecimentos:', error);
    } finally {
      setKnowledgeLoading(false);
    }
  };

  if (!isOpen || !selectedEmployee) return null;

  const handleSave = (field, value) => {
    const updatedEmployee = { ...selectedEmployee, [field]: value };
    setSelectedEmployee(updatedEmployee);
    setEmployees(employees.map(emp =>
      emp.id === selectedEmployee.id ? updatedEmployee : emp
    ));
    setEditingField(null);
  };

  const formatDate = (date) => {
    if (!date) return 'Não definido';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const getStatusColor = (status) => {
    const colors = {
      'ATIVO': 'bg-green-100 text-green-700',
      'INATIVO': 'bg-red-100 text-red-700',
      'FERIAS': 'bg-blue-100 text-blue-700',
      'LICENCA': 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  // Calcular vínculos e filtros
  const userLinks = employeeLinks.filter(link => link.employee_id === selectedEmployee.id);
  const linkStats = {
    todos: userLinks.length,
    obtidos: userLinks.filter(link => link.status === 'OBTIDO').length,
    desejados: userLinks.filter(link => link.status === 'DESEJADO').length,
    obrigatorios: userLinks.filter(link => link.status === 'OBRIGATORIO').length
  };

  const filteredLinks = linkFilter === 'todos' ? userLinks :
                       linkFilter === 'obtidos' ? userLinks.filter(link => link.status === 'OBTIDO') :
                       linkFilter === 'desejados' ? userLinks.filter(link => link.status === 'DESEJADO') :
                       linkFilter === 'obrigatorios' ? userLinks.filter(link => link.status === 'OBRIGATORIO') :
                       userLinks;

  const getKnowledgeDetails = (vinculo) => {
    if (!knowledge || knowledge.length === 0) return null;
    const knowledgeId = vinculo.knowledge_id;
    const item = knowledge.find(k => k.id === knowledgeId);
    return item || null;
  };

  // ✅ FUNÇÕES PARA MODAL DE EDIÇÃO
  const handleEditLink = (vinculo) => {
    setEditingLink({ ...vinculo });
    setShowEditLinkModal(true);
  };

  // ✅ FUNÇÃO PARA UPLOAD DE ANEXO
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Arquivo muito grande! Máximo 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target.result;
        setEditingLink(prev => ({
          ...prev,
          anexo_path: fileData,
          anexo_nome: file.name,
          anexo_tipo: file.type
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ FUNÇÃO PARA VISUALIZAR ANEXO
  const viewAttachment = (attachment) => {
    if (!attachment) return;

    const newWindow = window.open();
    if (newWindow) {
      if (attachment.includes('data:application/pdf')) {
        newWindow.document.write(`
          <html><head><title>Evidência</title></head>
          <body style="margin:0;">
            <embed src="${attachment}" width="100%" height="100%" type="application/pdf" />
          </body></html>
        `);
      } else {
        newWindow.document.write(`
          <html><head><title>Evidência</title></head>
          <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f3f4f6;">
            <img src="${attachment}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="Evidência" />
          </body></html>
        `);
      }
    }
  };

  const handleSaveLink = async () => {
    if (!editingLink) return;

    try {
      setEditLinkLoading(true);

      const linkData = {
        employee_id: editingLink.employee_id,
        knowledge_id: editingLink.knowledge_id,
        status: editingLink.status,
        data_obtencao: editingLink.data_obtencao || null,
        data_expiracao: editingLink.data_expiracao || null,
        data_alvo: editingLink.data_alvo || null,
        anexo_path: editingLink.anexo_path || null
      };

      await employeeKnowledgeService.update(editingLink.id, linkData);

      if (setEmployeeLinks) {
        setEmployeeLinks(prev => prev.map(link =>
          link.id === editingLink.id ? { ...editingLink } : link
        ));
      }

      alert('✅ Vínculo atualizado com sucesso!');
      setShowEditLinkModal(false);
      setEditingLink(null);

    } catch (error) {
      console.error('❌ Erro ao salvar vínculo:', error);
      alert('❌ Erro ao salvar vínculo. Tente novamente.');
    } finally {
      setEditLinkLoading(false);
    }
  };

  const handleDeleteLink = async (vinculo) => {
    if (!window.confirm(`Tem certeza que deseja remover o vínculo "${getKnowledgeDetails(vinculo)?.nome || 'este conhecimento'}"?`)) {
      return;
    }

    try {
      await employeeKnowledgeService.delete(vinculo.id);
      if (setEmployeeLinks) {
        setEmployeeLinks(prev => prev.filter(link => link.id !== vinculo.id));
      }
      alert('✅ Vínculo removido com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao deletar vínculo:', error);
      alert('❌ Erro ao remover vínculo. Tente novamente.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-ol-brand-100 rounded-full flex items-center justify-center overflow-hidden">
                    {selectedEmployee.avatar ? (
                      <img src={selectedEmployee.avatar} alt={selectedEmployee.nome} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-ol-brand-600 font-medium text-lg">
                        {selectedEmployee.nome.split(' ').map(n => n[0]).join('').substr(0, 2)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{selectedEmployee.nome}</h2>
                    <p className="text-gray-600">{selectedEmployee.cargo} • {selectedEmployee.equipe}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedEmployee.status)}`}>
                        {selectedEmployee.status}
                      </span>
                      {linkStats.obtidos > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          ✅ {linkStats.obtidos} obtidos
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ✅ TODAS AS ABAS RESTAURADAS */}
            <div className="border-b border-gray-200 flex-shrink-0">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'geral', label: 'Dados Gerais', icon: '👤' },
                  { id: 'contato', label: 'Contato', icon: '📞' },
                  { id: 'pdi', label: 'PDI & 1x1', icon: '📊' },
                  { id: 'ferias', label: 'Férias', icon: '🏖️' },
                  { id: 'vinculos', label: `Vínculos (${linkStats.todos})`, icon: '🔗' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-ol-brand-500 text-ol-brand-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* ✅ ABA GERAL COMPLETA */}
                {activeTab === 'geral' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Informações Pessoais</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.nome}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">CPF</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.cpf}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">RG</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.rg}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                          <p className="text-sm text-gray-900">{formatDate(selectedEmployee.data_nascimento)}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Estado Civil</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.estado_civil}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Informações Profissionais</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Cargo</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.cargo}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Equipe</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.equipe}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nível</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.nivel}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Data de Admissão</label>
                          <p className="text-sm text-gray-900">{formatDate(selectedEmployee.data_admissao)}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedEmployee.status)}`}>
                            {selectedEmployee.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ✅ ABA CONTATO */}
                {activeTab === 'contato' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Contato</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Telefone</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.telefone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Endereço</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Rua</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.endereco?.rua || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Cidade</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.endereco?.cidade || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">CEP</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.endereco?.cep || 'Não informado'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ✅ ABA PDI */}
                {activeTab === 'pdi' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">PDI (Plano de Desenvolvimento Individual)</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Status PDI</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            selectedEmployee.pdi?.status === 'EM_DIA' ? 'bg-green-100 text-green-700' :
                            selectedEmployee.pdi?.status === 'ATRASADO' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {selectedEmployee.pdi?.status || 'NUNCA_AGENDADO'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Última reunião: {formatDate(selectedEmployee.pdi?.data_ultimo)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Reuniões 1x1</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Status 1x1</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            selectedEmployee.reunioes_1x1?.status === 'EM_DIA' ? 'bg-green-100 text-green-700' :
                            selectedEmployee.reunioes_1x1?.status === 'ATRASADO' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {selectedEmployee.reunioes_1x1?.status || 'NUNCA_AGENDADO'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Última reunião: {formatDate(selectedEmployee.reunioes_1x1?.data_ultimo)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ✅ ABA FÉRIAS */}
                {activeTab === 'ferias' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Controle de Férias</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.ferias?.status || 'SEM_DIREITO'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Dias Disponíveis</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.ferias?.dias_disponivel || 0} dias</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Férias Vencidas</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.ferias?.ferias_vencidas || 0} dias</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Pode Vender</label>
                          <p className="text-sm text-gray-900">{selectedEmployee.ferias?.pode_vender || 0} dias</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ✅ ABA VÍNCULOS */}
                {activeTab === 'vinculos' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Vínculos de Conhecimento</h3>
                      {onManageLinks && (
                        <button
                          onClick={() => {
                            onManageLinks(selectedEmployee);
                            onClose();
                          }}
                          className="px-4 py-2 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600"
                        >
                          🔗 Gerenciar Vínculos
                        </button>
                      )}
                    </div>

                    {/* Filtros */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-gray-600">Filtrar:</span>
                      {[
                        { key: 'todos', label: 'Todos', count: linkStats.todos },
                        { key: 'obtidos', label: 'Obtidos', count: linkStats.obtidos },
                        { key: 'desejados', label: 'Desejados', count: linkStats.desejados },
                        { key: 'obrigatorios', label: 'Obrigatórios', count: linkStats.obrigatorios }
                      ].map(filter => (
                        <button
                          key={filter.key}
                          onClick={() => setLinkFilter(filter.key)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            linkFilter === filter.key 
                              ? 'bg-ol-brand-100 text-ol-brand-700 ring-2 ring-ol-brand-500' 
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {filter.label} ({filter.count})
                        </button>
                      ))}
                    </div>

                    {knowledgeLoading && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ol-brand-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Carregando conhecimentos...</p>
                      </div>
                    )}

                    {!knowledgeLoading && (
                      <div className="space-y-3">
                        {filteredLinks.map(vinculo => {
                          const knowledgeDetails = getKnowledgeDetails(vinculo);
                          return (
                            <div key={`link-${vinculo.id}`} className="flex items-start justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 mb-2">
                                  {knowledgeDetails ? knowledgeDetails.nome : `Conhecimento ID: ${vinculo.knowledge_id}`}
                                </h5>

                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    vinculo.status === 'OBTIDO' ? 'bg-green-100 text-green-700' :
                                    vinculo.status === 'OBRIGATORIO' ? 'bg-red-100 text-red-700' :
                                    vinculo.status === 'DESEJADO' ? 'bg-blue-100 text-blue-700' :
                                    'bg-ol-brand-100 text-ol-brand-700'
                                  }`}>
                                    {vinculo.status}
                                  </span>

                                  {vinculo.data_obtencao && (
                                    <span className="text-green-600">
                                      ✅ Obtido: {formatDate(vinculo.data_obtencao)}
                                    </span>
                                  )}

                                  {vinculo.data_expiracao && (
                                    <span className="text-orange-600">
                                      ⏰ Expira: {formatDate(vinculo.data_expiracao)}
                                    </span>
                                  )}

                                  {vinculo.data_alvo && !vinculo.data_obtencao && (
                                    <span className="text-blue-600">
                                      🎯 Meta: {formatDate(vinculo.data_alvo)}
                                    </span>
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

                              <div className="flex items-center space-x-2 ml-4">
                                <button
                                  onClick={() => handleEditLink(vinculo)}
                                  className="text-ol-brand-600 hover:text-ol-brand-700 text-sm px-2 py-1 rounded hover:bg-ol-brand-50"
                                  title="Editar vínculo"
                                >
                                  ✏️
                                </button>

                                <button
                                  onClick={() => handleDeleteLink(vinculo)}
                                  className="text-red-600 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                                  title="Remover vínculo"
                                >
                                  🗑️
                                </button>

                                {vinculo.anexo_path && (
                                  <button
                                    onClick={() => viewAttachment(vinculo.anexo_path)}
                                    className="text-blue-600 hover:text-blue-700 text-sm px-2 py-1 rounded hover:bg-blue-50"
                                    title="Ver evidência"
                                  >
                                    👁️
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {filteredLinks.length === 0 && (
                          <div className="text-center py-8 text-ol-gray-500">
                            <p>Nenhum vínculo encontrado</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MODAL DE EDIÇÃO COM ANEXO */}
      {showEditLinkModal && editingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Editar Vínculo</h3>
                <button
                  onClick={() => {
                    setShowEditLinkModal(false);
                    setEditingLink(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Certificação */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certificação
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-900 font-medium">
                      {getKnowledgeDetails(editingLink)?.nome || `ID: ${editingLink.knowledge_id}`}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingLink.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      const updatedLink = { ...editingLink, status: newStatus };

                      if (newStatus === 'OBTIDO') {
                        updatedLink.data_obtencao = updatedLink.data_obtencao || new Date().toISOString().split('T')[0];
                        updatedLink.data_alvo = null;
                      } else if (newStatus === 'DESEJADO' || newStatus === 'OBRIGATORIO') {
                        updatedLink.data_obtencao = null;
                        updatedLink.data_expiracao = null;
                        updatedLink.anexo_path = null;
                      }

                      setEditingLink(updatedLink);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="DESEJADO">💙 Desejado</option>
                    <option value="OBRIGATORIO">🔴 Obrigatório</option>
                    <option value="OBTIDO">✅ Obtido</option>
                  </select>
                </div>

                {/* ✅ CAMPOS CONDICIONAIS COM ANEXO */}
                {editingLink.status === 'OBTIDO' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Obtenção *
                      </label>
                      <input
                        type="date"
                        value={formatDateForInput(editingLink.data_obtencao)}
                        onChange={(e) => setEditingLink({...editingLink, data_obtencao: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Expiração
                      </label>
                      <input
                        type="date"
                        value={formatDateForInput(editingLink.data_expiracao)}
                        onChange={(e) => setEditingLink({...editingLink, data_expiracao: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* ✅ CAMPO ANEXO */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Anexar Evidência
                      </label>

                      {editingLink.anexo_path && (
                        <div className="mb-3 p-3 bg-green-50 rounded-md border border-green-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm text-green-800">
                                {editingLink.anexo_nome || 'Arquivo anexado'}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => viewAttachment(editingLink.anexo_path)}
                                className="text-blue-600 hover:text-blue-700 text-xs"
                              >
                                👁️ Ver
                              </button>
                              <button
                                onClick={() => setEditingLink({...editingLink, anexo_path: null, anexo_nome: null})}
                                className="text-red-600 hover:text-red-700 text-xs"
                              >
                                🗑️ Remover
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600">
                            📎 Clique para anexar evidência
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            PDF, imagens até 10MB
                          </span>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {(editingLink.status === 'DESEJADO' || editingLink.status === 'OBRIGATORIO') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Alvo
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(editingLink.data_alvo)}
                      onChange={(e) => setEditingLink({...editingLink, data_alvo: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                )}
              </div>

              {/* Botões */}
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={handleSaveLink}
                  disabled={editLinkLoading || (editingLink.status === 'OBTIDO' && !editingLink.data_obtencao)}
                  className="flex-1 px-4 py-3 bg-ol-brand-500 text-white rounded-md hover:bg-ol-brand-600 disabled:opacity-50"
                >
                  {editLinkLoading ? 'Salvando...' : '💾 Salvar'}
                </button>
                <button
                  onClick={() => {
                    setShowEditLinkModal(false);
                    setEditingLink(null);
                  }}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeDetailModal;
