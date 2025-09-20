import React, { useState, useMemo } from 'react';

// Mock data completo
const initialCertifications = [
  {
    id: 1,
    nome: "Certified Information Systems Security Professional",
    tipo: "CERTIFICACAO",
    codigo: "CISSP-001",
    vendor: "ISC2",
    area: "Cibersegurança",
    link: "https://www.isc2.org/Certifications/CISSP",
    validade_meses: 36
  },
  {
    id: 2,
    nome: "Certified Ethical Hacker",
    tipo: "CERTIFICACAO", 
    codigo: "CEH-001",
    vendor: "EC-Council",
    area: "Ethical Hacking",
    link: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/",
    validade_meses: 36
  },
  {
    id: 3,
    nome: "Offensive Security Certified Professional",
    tipo: "CERTIFICACAO",
    codigo: "OSCP-001", 
    vendor: "Offensive Security",
    area: "Penetration Testing",
    link: "https://www.offensive-security.com/pwk-oscp/",
    validade_meses: null
  },
  {
    id: 4,
    nome: "AWS Certified Security - Specialty",
    tipo: "CERTIFICACAO",
    codigo: "AWS-SEC-001",
    vendor: "Amazon",
    area: "Cloud Security",
    link: "https://aws.amazon.com/certification/",
    validade_meses: 36
  },
  {
    id: 5,
    nome: "Microsoft Azure Security Engineer",
    tipo: "CERTIFICACAO",
    codigo: "AZ-500",
    vendor: "Microsoft", 
    area: "Cloud Security",
    link: "https://docs.microsoft.com/en-us/learn/certifications/azure-security-engineer/",
    validade_meses: 24
  },
  {
    id: 6,
    nome: "CompTIA Security+",
    tipo: "CERTIFICACAO",
    codigo: "SY0-601",
    vendor: "CompTIA",
    area: "Fundamentos de Segurança",
    link: "https://www.comptia.org/certifications/security",
    validade_meses: 36
  }
];

const initialEmployees = [
  { id: 1, nome: "João Silva", cargo: "Analista Sênior", equipe: "Red Team" },
  { id: 2, nome: "Ana Costa", cargo: "Analista Júnior", equipe: "Blue Team" },
  { id: 3, nome: "Carlos Mendes", cargo: "Analista Pleno", equipe: "SOC Team" },
  { id: 4, nome: "Maria Santos", cargo: "Analista Sênior", equipe: "Compliance Team" }
];

const initialEmployeeCertifications = [
  { id: 1, employee_id: 1, learning_item_id: 1, vinculo: "OBTIDO", data_obtencao: "2024-03-15", data_expiracao: "2027-03-15" },
  { id: 2, employee_id: 1, learning_item_id: 2, vinculo: "DESEJADO", data_alvo: "2025-06-01" },
  { id: 3, employee_id: 1, learning_item_id: 3, vinculo: "OBRIGATORIO", data_alvo: "2025-03-01" },
  { id: 4, employee_id: 2, learning_item_id: 4, vinculo: "OBTIDO", data_obtencao: "2024-07-20", data_expiracao: "2027-07-20" },
  { id: 5, employee_id: 2, learning_item_id: 5, vinculo: "DESEJADO", data_alvo: "2025-05-15" },
  { id: 6, employee_id: 2, learning_item_id: 6, vinculo: "OBTIDO", data_obtencao: "2024-01-10", data_expiracao: "2025-01-10" },
  { id: 7, employee_id: 3, learning_item_id: 1, vinculo: "OBRIGATORIO", data_alvo: "2025-02-01" },
  { id: 8, employee_id: 3, learning_item_id: 6, vinculo: "OBTIDO", data_obtencao: "2024-09-15", data_expiracao: "2027-09-15" },
  { id: 9, employee_id: 4, learning_item_id: 1, vinculo: "OBTIDO", data_obtencao: "2023-05-20", data_expiracao: "2026-05-20" },
  { id: 10, employee_id: 4, learning_item_id: 2, vinculo: "DESEJADO", data_alvo: "2025-08-01" },
  // Certificação expirada para teste
  { id: 11, employee_id: 4, learning_item_id: 3, vinculo: "OBTIDO", data_obtencao: "2023-01-15", data_expiracao: "2024-01-15" }
];

const CertificationsPage = ({ onBackToDashboard }) => {
  const [certifications, setCertifications] = useState(initialCertifications);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnalystsModal, setShowAnalystsModal] = useState(false);
  const [selectedAnalysts, setSelectedAnalysts] = useState([]);
  const [selectedCertStatus, setSelectedCertStatus] = useState('');
  const [editingCert, setEditingCert] = useState(null);
  const [filters, setFilters] = useState({ search: '', vendor: '', area: '' });
  const [newCert, setNewCert] = useState({ nome: '', codigo: '', vendor: '', area: '', tipo: 'CERTIFICACAO', validade_meses: '' });

  // Calcular estatísticas COMPLETAS
  const stats = useMemo(() => {
    const obtidas = initialEmployeeCertifications.filter(ec => ec.vinculo === 'OBTIDO').length;
    const obrigatorias = initialEmployeeCertifications.filter(ec => ec.vinculo === 'OBRIGATORIO').length;
    const desejadas = initialEmployeeCertifications.filter(ec => ec.vinculo === 'DESEJADO').length;
    
    const now = new Date();
    const expirandoEm30d = initialEmployeeCertifications.filter(ec => 
      ec.vinculo === 'OBTIDO' && ec.data_expiracao && 
      new Date(ec.data_expiracao) > now &&
      new Date(ec.data_expiracao) <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    ).length;

    // NOVA: Certificações expiradas
    const expiradas = initialEmployeeCertifications.filter(ec => 
      ec.vinculo === 'OBTIDO' && ec.data_expiracao && 
      new Date(ec.data_expiracao) < now
    ).length;

    return { obtidas, obrigatorias, desejadas, expirandoEm30d, expiradas };
  }, []);

  // Obter estatísticas por certificação
  const getCertificationStats = (certId) => {
    const employeeCerts = initialEmployeeCertifications.filter(ec => ec.learning_item_id === certId);
    return {
      obtidas: employeeCerts.filter(ec => ec.vinculo === 'OBTIDO').length,
      obrigatorias: employeeCerts.filter(ec => ec.vinculo === 'OBRIGATORIO').length,
      desejadas: employeeCerts.filter(ec => ec.vinculo === 'DESEJADO').length
    };
  };

  // Mostrar analistas por status GLOBAL (dos cards de estatísticas)
  const showGlobalAnalystsByStatus = (status) => {
    let employeeCerts = [];
    
    if (status === 'EXPIRADAS') {
      const now = new Date();
      employeeCerts = initialEmployeeCertifications.filter(ec => 
        ec.vinculo === 'OBTIDO' && ec.data_expiracao && 
        new Date(ec.data_expiracao) < now
      );
    } else if (status === 'EXPIRANDO') {
      const now = new Date();
      employeeCerts = initialEmployeeCertifications.filter(ec => 
        ec.vinculo === 'OBTIDO' && ec.data_expiracao && 
        new Date(ec.data_expiracao) > now &&
        new Date(ec.data_expiracao) <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      );
    } else {
      employeeCerts = initialEmployeeCertifications.filter(ec => ec.vinculo === status);
    }
    
    const analysts = employeeCerts.map(ec => {
      const employee = initialEmployees.find(emp => emp.id === ec.employee_id);
      const cert = certifications.find(c => c.id === ec.learning_item_id);
      return { ...employee, certData: ec, certification: cert };
    });

    setSelectedAnalysts(analysts);
    
    const statusNames = {
      'OBTIDO': 'Obtidas',
      'OBRIGATORIO': 'Obrigatórias',
      'DESEJADO': 'Desejadas',
      'EXPIRANDO': 'Expirando em 30 dias',
      'EXPIRADAS': 'Expiradas'
    };
    
    setSelectedCertStatus(`Todas as Certificações - ${statusNames[status] || status}`);
    setShowAnalystsModal(true);
  };

  // Mostrar analistas por status de UMA certificação específica
  const showAnalystsByStatus = (certId, status) => {
    const employeeCerts = initialEmployeeCertifications.filter(ec => 
      ec.learning_item_id === certId && ec.vinculo === status
    );
    
    const analysts = employeeCerts.map(ec => {
      const employee = initialEmployees.find(emp => emp.id === ec.employee_id);
      return { ...employee, certData: ec };
    });

    const cert = certifications.find(c => c.id === certId);
    setSelectedAnalysts(analysts);
    setSelectedCertStatus(`${cert.nome} - ${status}`);
    setShowAnalystsModal(true);
  };

  // Editar certificação
  const handleEditCertification = (cert) => {
    setEditingCert({ ...cert });
    setShowEditModal(true);
  };

  // Salvar edição
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setCertifications(prev => 
      prev.map(cert => cert.id === editingCert.id ? {
        ...editingCert,
        validade_meses: editingCert.validade_meses ? parseInt(editingCert.validade_meses) : null
      } : cert)
    );
    setShowEditModal(false);
    setEditingCert(null);
  };

  // Filtrar certificações
  const filteredCertifications = useMemo(() => {
    return certifications.filter(cert => {
      const matchesSearch = !filters.search || 
        cert.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
        cert.codigo.toLowerCase().includes(filters.search.toLowerCase());
      const matchesVendor = !filters.vendor || cert.vendor === filters.vendor;
      const matchesArea = !filters.area || cert.area === filters.area;
      return matchesSearch && matchesVendor && matchesArea;
    });
  }, [certifications, filters]);

  const vendors = [...new Set(certifications.map(cert => cert.vendor))];
  const areas = [...new Set(certifications.map(cert => cert.area))];

  // Adicionar nova certificação
  const handleAddCertification = (e) => {
    e.preventDefault();
    const newId = Math.max(...certifications.map(c => c.id)) + 1;
    setCertifications(prev => [...prev, {
      ...newCert,
      id: newId,
      validade_meses: newCert.validade_meses ? parseInt(newCert.validade_meses) : null
    }]);
    setNewCert({ nome: '', codigo: '', vendor: '', area: '', tipo: 'CERTIFICACAO', validade_meses: '' });
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-ol-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com botão + */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ol-brand-600">Certificações & Cursos</h1>
            <p className="text-ol-gray-600 mt-1">Gerencie o catálogo e acompanhe o progresso dos analistas</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-ol-brand-600 text-white rounded-lg hover:bg-ol-brand-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nova Certificação</span>
          </button>
        </div>

        {/* Estatísticas - AGORA CLICÁVEIS + EXPIRADAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Catálogo</p>
                <p className="text-2xl font-bold text-ol-brand-600">{certifications.length}</p>
              </div>
              <div className="bg-ol-brand-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-ol-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* CLICÁVEL */}
          <button
            onClick={() => showGlobalAnalystsByStatus('OBTIDO')}
            className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Obtidas</p>
                <p className="text-2xl font-bold text-green-600">{stats.obtidas}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </button>

          {/* CLICÁVEL */}
          <button
            onClick={() => showGlobalAnalystsByStatus('OBRIGATORIO')}
            className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Obrigatórias</p>
                <p className="text-2xl font-bold text-red-600">{stats.obrigatorias}</p>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </button>

          {/* CLICÁVEL */}
          <button
            onClick={() => showGlobalAnalystsByStatus('DESEJADO')}
            className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Desejadas</p>
                <p className="text-2xl font-bold text-blue-600">{stats.desejadas}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </button>

          {/* CLICÁVEL */}
          <button
            onClick={() => showGlobalAnalystsByStatus('EXPIRANDO')}
            className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expira ≤30d</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.expirandoEm30d}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </button>

          {/* NOVO: EXPIRADAS - CLICÁVEL */}
          <button
            onClick={() => showGlobalAnalystsByStatus('EXPIRADAS')}
            className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiradas</p>
                <p className="text-2xl font-bold text-purple-600">{stats.expiradas}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Buscar certificação..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            />
            
            <select
              value={filters.vendor}
              onChange={(e) => setFilters(prev => ({ ...prev, vendor: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            >
              <option value="">Todos os Vendors</option>
              {vendors.map(vendor => (
                <option key={vendor} value={vendor}>{vendor}</option>
              ))}
            </select>

            <select
              value={filters.area}
              onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            >
              <option value="">Todas as Áreas</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid das Certificações - LAYOUT DIVIDIDO EM 3 SEÇÕES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertifications.map((cert) => {
            const certStats = getCertificationStats(cert.id);
            
            return (
              <div key={cert.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                {/* SEÇÃO 1: Info da Certificação */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{cert.nome}</h3>
                      <p className="text-sm text-gray-600 mb-2">{cert.codigo} • {cert.vendor}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{cert.tipo}</span>
                        {cert.area && (
                          <span className="text-xs bg-ol-brand-100 text-ol-brand-700 px-2 py-1 rounded">{cert.area}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {cert.link && (
                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-ol-brand-600 hover:text-ol-brand-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      {/* BOTÃO EDITAR MELHORADO */}
                      <button 
                        onClick={() => handleEditCertification(cert)}
                        className="text-ol-gray-400 hover:text-ol-brand-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* LINHA DIVISÓRIA */}
                <div className="border-t border-gray-100"></div>

                {/* SEÇÃO 2: Status por Analistas */}
                <div className="px-6 py-4 space-y-2">
                  {certStats.obtidas > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Obtidas:</span>
                      <button
                        onClick={() => showAnalystsByStatus(cert.id, 'OBTIDO')}
                        className="text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        {certStats.obtidas} analistas →
                      </button>
                    </div>
                  )}

                  {certStats.obrigatorias > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Obrigatórias:</span>
                      <button
                        onClick={() => showAnalystsByStatus(cert.id, 'OBRIGATORIO')}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        {certStats.obrigatorias} pendentes →
                      </button>
                    </div>
                  )}

                  {certStats.desejadas > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Desejadas:</span>
                      <button
                        onClick={() => showAnalystsByStatus(cert.id, 'DESEJADO')}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        {certStats.desejadas} analistas →
                      </button>
                    </div>
                  )}

                  {certStats.obtidas === 0 && certStats.obrigatorias === 0 && certStats.desejadas === 0 && (
                    <p className="text-sm text-gray-500 text-center py-1">Nenhum analista vinculado</p>
                  )}
                </div>

                {/* LINHA DIVISÓRIA */}
                {cert.validade_meses && <div className="border-t border-gray-100"></div>}

                {/* SEÇÃO 3: Validade */}
                {cert.validade_meses && (
                  <div className="px-6 py-3">
                    <p className="text-xs text-gray-500">Validade: {cert.validade_meses} meses</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal de Adicionar */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowAddModal(false)}></div>
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Nova Certificação</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleAddCertification} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Certificação *</label>
                      <input
                        type="text"
                        required
                        value={newCert.nome}
                        onChange={(e) => setNewCert(prev => ({ ...prev, nome: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                        placeholder="Ex: Certified Information Systems Security Professional"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                      <input
                        type="text"
                        required
                        value={newCert.codigo}
                        onChange={(e) => setNewCert(prev => ({ ...prev, codigo: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                        placeholder="Ex: CISSP-001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
                      <input
                        type="text"
                        required
                        value={newCert.vendor}
                        onChange={(e) => setNewCert(prev => ({ ...prev, vendor: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                        placeholder="Ex: ISC2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                      <input
                        type="text"
                        value={newCert.area}
                        onChange={(e) => setNewCert(prev => ({ ...prev, area: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                        placeholder="Ex: Cibersegurança"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Validade (meses)</label>
                      <input
                        type="number"
                        min="1"
                        value={newCert.validade_meses}
                        onChange={(e) => setNewCert(prev => ({ ...prev, validade_meses: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                        placeholder="Ex: 36"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-ol-brand-600 border border-transparent rounded-md hover:bg-ol-brand-700"
                    >
                      Criar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Editar - NOVO */}
        {showEditModal && editingCert && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowEditModal(false)}></div>
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Editar Certificação</h3>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Certificação *</label>
                      <input
                        type="text"
                        required
                        value={editingCert.nome}
                        onChange={(e) => setEditingCert(prev => ({ ...prev, nome: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                      <input
                        type="text"
                        required
                        value={editingCert.codigo}
                        onChange={(e) => setEditingCert(prev => ({ ...prev, codigo: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
                      <input
                        type="text"
                        required
                        value={editingCert.vendor}
                        onChange={(e) => setEditingCert(prev => ({ ...prev, vendor: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                      <input
                        type="text"
                        value={editingCert.area || ''}
                        onChange={(e) => setEditingCert(prev => ({ ...prev, area: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Validade (meses)</label>
                      <input
                        type="number"
                        min="1"
                        value={editingCert.validade_meses || ''}
                        onChange={(e) => setEditingCert(prev => ({ ...prev, validade_meses: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-ol-brand-600 border border-transparent rounded-md hover:bg-ol-brand-700"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Analistas */}
        {showAnalystsModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowAnalystsModal(false)}></div>
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedCertStatus}</h3>
                  <button onClick={() => setShowAnalystsModal(false)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-6">
                  {selectedAnalysts.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhum analista encontrado para este status.</p>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 mb-4">
                        {selectedAnalysts.length} analista(s) encontrado(s)
                      </p>
                      
                      {selectedAnalysts.map((analyst, index) => (
                        <div key={`${analyst.id}-${index}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-ol-brand-100 rounded-full flex items-center justify-center">
                              <span className="text-ol-brand-600 font-medium text-sm">
                                {analyst.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{analyst.nome}</p>
                              <p className="text-sm text-gray-600">{analyst.cargo} • {analyst.equipe}</p>
                              {analyst.certification && (
                                <p className="text-xs text-ol-brand-600">{analyst.certification.nome}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            {analyst.certData.data_obtencao && (
                              <p className="text-sm text-gray-600">
                                Obtido: {new Date(analyst.certData.data_obtencao).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                            {analyst.certData.data_alvo && (
                              <p className="text-sm text-gray-600">
                                Meta: {new Date(analyst.certData.data_alvo).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                            {analyst.certData.data_expiracao && (
                              <p className={`text-sm ${new Date(analyst.certData.data_expiracao) < new Date() ? 'text-red-600' : 'text-gray-600'}`}>
                                Expira: {new Date(analyst.certData.data_expiracao).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsPage;
