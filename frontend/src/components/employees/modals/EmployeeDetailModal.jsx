import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Calendar, User, Building, Award, Clock, Edit, X, Plane, Coffee, Target, Users2 } from 'lucide-react';

// ✅ IMPORTS DAS TABS QUE FUNCIONAM
import KnowledgeTab from '../tabs/KnowledgeTab';
import ProfileTab from '../tabs/ProfileTab';
import DayOffTab from '../tabs/DayOffTab';

// ✅ CORES OL DIRETAS
const OL_COLORS = {
  primary: '#D32F2F',
  secondary: '#F44336',
  accent: '#FF5722',
  light: '#FFCDD2',
  bg: '#FFEBEE'
};

// ✅ FUNÇÃO PARA FAZER PARSE DO ENDEREÇO JSON
const parseEndereco = (enderecoString) => {
  try {
    if (!enderecoString) return {};
    if (typeof enderecoString === 'object') return enderecoString;
    const cleanJson = enderecoString.replace(/\"\"/g, '"');
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('❌ Erro ao fazer parse do endereço:', error);
    return {};
  }
};

const EmployeeDetailModal = ({
  isOpen,
  onClose,
  employee,
  onEdit,
  onDelete,
  // ✅ PROPS ADICIONAIS PARA AS TABS
  setSelectedEmployee,
  setEmployees,
  employeeKnowledge = [],
  setEmployeeKnowledge,
  knowledgeCatalog = [],
  onShowAddKnowledgeModal,
  onFileUpload
}) => {
  const [activeTab, setActiveTab] = useState('geral');
  const [enderecoParsed, setEnderecoParsed] = useState({});

  // ✅ DEBUG CONSOLE
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 EmployeeDetailModal ABRIU - employee:', employee?.nome);
    }
  }, [isOpen, employee]);

  const getKnowledgeDetails = (vinculo) => {
    if (!knowledgeCatalog || knowledgeCatalog.length === 0) return null;

    const knowledgeId = vinculo.knowledgeid;
    const item = knowledgeCatalog.find(k => k.id === knowledgeId);
    return item || null;
  };

  // ✅ FAZER PARSE DO ENDEREÇO
  useEffect(() => {
    if (employee && employee.endereco) {
      const enderecoObj = parseEndereco(employee.endereco);
      setEnderecoParsed(enderecoObj);
    }
  }, [employee?.endereco]);

  // ✅ RESETAR ABA QUANDO MODAL ABRE
  useEffect(() => {
    if (isOpen) {
      setActiveTab('geral');
    }
  }, [isOpen]);

  if (!isOpen || !employee) {
    return null;
  }

  // ✅ FORMATADORES
  const formatDate = (date) => {
    if (!date) return 'Não informado';
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Não informado';
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(salary);
    } catch {
      return `R$ ${salary}`;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'ATIVO': 'bg-green-100 text-green-800',
      'FERIAS': 'bg-blue-100 text-blue-800',
      'LICENCA': 'bg-yellow-100 text-yellow-800',
      'INATIVO': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getLevelColor = (level) => {
    const colors = {
      'ESTAGIARIO': 'bg-gray-100 text-gray-800',
      'JUNIOR': 'bg-green-100 text-green-800',
      'PLENO': 'bg-blue-100 text-blue-800',
      'SENIOR': 'bg-purple-100 text-purple-800',
      'COORDENADOR': 'bg-orange-100 text-orange-800',
      'GERENTE': 'bg-red-100 text-red-800',
      'DIRETOR': 'bg-indigo-100 text-indigo-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  // ✅ TABS COMPLETAS - COM DAYOFF AGORA
  const tabs = [
    { id: 'geral', name: 'Informações Gerais', icon: User },
    { id: 'endereco', name: 'Endereço', icon: MapPin },
    { id: 'profissional', name: 'Dados Profissionais', icon: Building },
    { id: 'knowledge', name: 'Conhecimentos', icon: Award },
    { id: 'dayoff', name: 'Day Off', icon: Coffee }, // ✅ ADICIONADA
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* ✅ HEADER COM CORES OL */}
        <div
          className="text-white p-6"
          style={{
            background: `linear-gradient(135deg, ${OL_COLORS.primary} 0%, ${OL_COLORS.secondary} 100%)`
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Detalhes do Colaborador</h3>
            <div className="flex space-x-2">
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(employee);
                    onClose();
                  }}
                  className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                  title="Editar colaborador"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            {/* Foto do colaborador */}
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {employee.avatar ? (
                <img src={employee.avatar} alt="Foto do colaborador" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-white opacity-70" />
              )}
            </div>

            {/* Info básica */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-white mb-1">{employee.nome}</h2>
              <p className="text-white text-opacity-80 mb-2">{employee.cargo}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white text-opacity-70">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{employee.email}</span>
                </div>
                {employee.telefone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{employee.telefone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Building className="w-4 h-4" />
                  <span>{employee.equipe}</span>
                </div>
              </div>
            </div>

            {/* Status e Nível */}
            <div className="flex flex-col space-y-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                {employee.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(employee.nivel)}`}>
                {employee.nivel}
              </span>
            </div>
          </div>
        </div>

        {/* ✅ TABS DE NAVEGAÇÃO */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ✅ CONTEÚDO DAS TABS */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>

          {/* ✅ TAB INFORMAÇÕES GERAIS */}
          {activeTab === 'geral' && (
            <ProfileTab employee={employee} />
          )}

          {/* ✅ TAB ENDEREÇO */}
          {activeTab === 'endereco' && (
            <div className="space-y-4">
              {Object.keys(enderecoParsed).length > 0 ? (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-red-600" />
                    Endereço Completo
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rua:</span>
                      <span className="font-medium">{enderecoParsed.rua || 'Não informado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Número:</span>
                      <span className="font-medium">{enderecoParsed.numero || 'Não informado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Complemento:</span>
                      <span className="font-medium">{enderecoParsed.complemento || 'Não informado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bairro:</span>
                      <span className="font-medium">{enderecoParsed.bairro || 'Não informado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cidade:</span>
                      <span className="font-medium">{enderecoParsed.cidade || 'Não informado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className="font-medium">{enderecoParsed.estado || 'Não informado'}</span>
                    </div>
                    <div className="flex justify-between md:col-span-2">
                      <span className="text-gray-600">CEP:</span>
                      <span className="font-medium">{enderecoParsed.cep || 'Não informado'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum endereço cadastrado</p>
                </div>
              )}
            </div>
          )}

          {/* ✅ TAB DADOS PROFISSIONAIS */}
          {activeTab === 'profissional' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-red-600" />
                    Informações da Empresa
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cargo:</span>
                      <span className="font-medium">{employee.cargo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Equipe:</span>
                      <span className="font-medium">{employee.equipe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nível:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(employee.nivel)}`}>
                        {employee.nivel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-red-600" />
                    Informações Contratuais
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data de Admissão:</span>
                      <span className="font-medium">{formatDate(employee.data_admissao)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salário:</span>
                      <span className="font-medium">{formatSalary(employee.salario)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo de Acesso:</span>
                      <span className="font-medium">{employee.access_level || 'COLABORADOR'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-red-600" />
                  Tempo de Empresa
                </h4>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600 mb-2">
                    {employee.data_admissao ?
                      Math.floor((new Date() - new Date(employee.data_admissao)) / (1000 * 60 * 60 * 24 * 365))
                      : 0} anos
                  </p>
                  <p className="text-gray-600">desde a admissão</p>
                </div>
              </div>
            </div>
          )}

          {/* ✅ TAB KNOWLEDGE */}
          {activeTab === 'knowledge' && (
            <KnowledgeTab
              employee={employee}
              employeeKnowledge={employeeKnowledge}
              setEmployeeKnowledge={setEmployeeKnowledge}
              knowledgeCatalog={knowledgeCatalog}
              onShowAddKnowledgeModal={onShowAddKnowledgeModal}
              onFileUpload={onFileUpload}
            />
          )}

          {/* ✅ TAB DAY OFF - NOVA! */}
          {activeTab === 'dayoff' && (
            <DayOffTab
              employee={employee}
              setSelectedEmployee={setSelectedEmployee}
              setEmployees={setEmployees}
              currentUser={{ nome: 'Sistema' }}
            />
          )}
        </div>

        {/* ✅ FOOTER */}
        <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
          {onEdit && (
            <button
              onClick={() => {
                onEdit(employee);
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Editar Colaborador
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
