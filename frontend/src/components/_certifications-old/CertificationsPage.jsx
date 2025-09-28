import React, { useState, useMemo } from 'react';

// Mock data completo (mesmo anterior)
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
  },
  {
    id: 7,
    nome: "Python para Cibersegurança",
    tipo: "CURSO",
    codigo: "PY-CYBER-001",
    vendor: "Udemy",
    area: "Programação",
    link: "https://www.udemy.com/course/python-cybersecurity/",
    validade_meses: null
  },
  {
    id: 8,
    nome: "Análise de Malware Avançada",
    tipo: "CURSO",
    codigo: "MAL-ADV-001",
    vendor: "SANS",
    area: "Malware Analysis",
    link: "https://www.sans.org/cyber-security-courses/",
    validade_meses: null
  },
  {
    id: 9,
    nome: "Ciência da Computação",
    tipo: "FORMACAO",
    codigo: "CC-GRAD-001",
    vendor: "Universidade Federal",
    area: "Bacharelado",
    link: "https://www.ufpr.br/ciencia-computacao/",
    validade_meses: null,
    nivel_formacao: "GRADUACAO"
  },
  {
    id: 10,
    nome: "Segurança da Informação",
    tipo: "FORMACAO", 
    codigo: "SI-POS-001",
    vendor: "PUC-SP",
    area: "Especialização",
    link: "https://www.pucsp.br/pos-seguranca/",
    validade_meses: null,
    nivel_formacao: "POS_GRADUACAO"
  },
  {
    id: 11,
    nome: "Redes de Computadores",
    tipo: "FORMACAO",
    codigo: "RC-TEC-001", 
    vendor: "SENAC",
    area: "Tecnólogo",
    link: "https://www.senac.br/tecnologia/",
    validade_meses: null,
    nivel_formacao: "TECNOLOGO"
  },
  {
    id: 12,
    nome: "Mestrado em Cibersegurança",
    tipo: "FORMACAO",
    codigo: "CS-MEST-001",
    vendor: "USP",
    area: "Mestrado",
    link: "https://www.usp.br/mestrado/",
    validade_meses: null,
    nivel_formacao: "MESTRADO"
  },
  {
    id: 13,
    nome: "Doutorado em Inteligência Artificial",
    tipo: "FORMACAO",
    codigo: "IA-DOUT-001",
    vendor: "UNICAMP",
    area: "Doutorado",
    link: "https://www.unicamp.br/doutorado/",
    validade_meses: null,
    nivel_formacao: "DOUTORADO"
  },
  {
    id: 14,
    nome: "MBA em Gestão de TI",
    tipo: "FORMACAO",
    codigo: "MBA-TI-001",
    vendor: "FGV",
    area: "MBA",
    link: "https://www.fgv.br/mba/",
    validade_meses: null,
    nivel_formacao: "MBA"
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
  { id: 11, employee_id: 4, learning_item_id: 3, vinculo: "OBTIDO", data_obtencao: "2023-01-15", data_expiracao: "2024-01-15" },
  { id: 12, employee_id: 1, learning_item_id: 7, vinculo: "OBTIDO", data_obtencao: "2024-05-10", data_expiracao: null },
  { id: 13, employee_id: 2, learning_item_id: 8, vinculo: "DESEJADO", data_alvo: "2025-04-01" },
  { id: 14, employee_id: 1, learning_item_id: 9, vinculo: "OBTIDO", data_obtencao: "2020-12-15", data_expiracao: null },
  { id: 15, employee_id: 2, learning_item_id: 10, vinculo: "DESEJADO", data_alvo: "2025-12-01" },
  { id: 16, employee_id: 3, learning_item_id: 11, vinculo: "OBTIDO", data_obtencao: "2019-06-20", data_expiracao: null },
  { id: 17, employee_id: 4, learning_item_id: 12, vinculo: "OBTIDO", data_obtencao: "2022-03-10", data_expiracao: null },
  { id: 18, employee_id: 1, learning_item_id: 14, vinculo: "DESEJADO", data_alvo: "2025-08-15" },
  { id: 19, employee_id: 3, learning_item_id: 13, vinculo: "OBTIDO", data_obtencao: "2023-07-22", data_expiracao: null }
];

const CertificationsPage = ({ onBackToDashboard }) => {
  const [certifications, setCertifications] = useState(initialCertifications);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('CERTIFICACAO');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnalystsModal, setShowAnalystsModal] = useState(false);
  const [selectedAnalysts, setSelectedAnalysts] = useState([]);
  const [selectedCertStatus, setSelectedCertStatus] = useState('');
  const [editingCert, setEditingCert] = useState(null);
  const [filters, setFilters] = useState({ search: '', vendor: '', area: '', tipo: '' });
  const [newCert, setNewCert] = useState({ nome: '', codigo: '', vendor: '', area: '', tipo: 'CERTIFICACAO', link: '', validade_meses: '', nivel_formacao: '' });

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

    const expiradas = initialEmployeeCertifications.filter(ec => 
      ec.vinculo === 'OBTIDO' && ec.data_expiracao && 
      new Date(ec.data_expiracao) < now
    ).length;

    const totalCertificacoes = certifications.filter(c => c.tipo === 'CERTIFICACAO').length;
    const totalCursos = certifications.filter(c => c.tipo === 'CURSO').length;
    const totalFormacoes = certifications.filter(c => c.tipo === 'FORMACAO').length;
    
    const graduacoes = certifications.filter(c => c.tipo === 'FORMACAO' && c.nivel_formacao === 'GRADUACAO').length;
    const tecnologos = certifications.filter(c => c.tipo === 'FORMACAO' && c.nivel_formacao === 'TECNOLOGO').length;
    const posGraduacoes = certifications.filter(c => c.tipo === 'FORMACAO' && c.nivel_formacao === 'POS_GRADUACAO').length;
    const mestrados = certifications.filter(c => c.tipo === 'FORMACAO' && c.nivel_formacao === 'MESTRADO').length;
    const doutorados = certifications.filter(c => c.tipo === 'FORMACAO' && c.nivel_formacao === 'DOUTORADO').length;
    const mbas = certifications.filter(c => c.tipo === 'FORMACAO' && c.nivel_formacao === 'MBA').length;

    return { 
      obtidas, obrigatorias, desejadas, expirandoEm30d, expiradas, 
      totalCertificacoes, totalCursos, totalFormacoes,
      graduacoes, tecnologos, posGraduacoes, mestrados, doutorados, mbas
    };
  }, [certifications]);

  const openAddModal = (type) => {
    setModalType(type);
    setNewCert({ nome: '', codigo: '', vendor: '', area: '', tipo: type, link: '', validade_meses: '', nivel_formacao: type === 'FORMACAO' ? 'GRADUACAO' : '' });
    setShowAddModal(true);
  };

  const getCertificationStats = (certId) => {
    const employeeCerts = initialEmployeeCertifications.filter(ec => ec.learning_item_id === certId);
    return {
      obtidas: employeeCerts.filter(ec => ec.vinculo === 'OBTIDO').length,
      obrigatorias: employeeCerts.filter(ec => ec.vinculo === 'OBRIGATORIO').length,
      desejadas: employeeCerts.filter(ec => ec.vinculo === 'DESEJADO').length
    };
  };

  const showFormationAnalysts = (formationType) => {
    const formationCerts = certifications.filter(c => c.tipo === 'FORMACAO' && c.nivel_formacao === formationType);
    const certIds = formationCerts.map(c => c.id);
    const employeeCerts = initialEmployeeCertifications.filter(ec => certIds.includes(ec.learning_item_id));
    
    const analysts = employeeCerts.map(ec => {
      const employee = initialEmployees.find(emp => emp.id === ec.employee_id);
      const cert = certifications.find(c => c.id === ec.learning_item_id);
      return { ...employee, certData: ec, certification: cert };
    });

    setSelectedAnalysts(analysts);
    const formationNames = {
      'GRADUACAO': 'Graduações',
      'TECNOLOGO': 'Tecnólogos', 
      'POS_GRADUACAO': 'Pós-Graduações',
      'MESTRADO': 'Mestrados',
      'DOUTORADO': 'Doutorados',
      'MBA': 'MBAs'
    };
    setSelectedCertStatus(`Formações - ${formationNames[formationType] || formationType}`);
    setShowAnalystsModal(true);
  };

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
    
    setSelectedCertStatus(`Todas as Certificações/Cursos/Formações - ${statusNames[status] || status}`);
    setShowAnalystsModal(true);
  };

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

  const handleEditCertification = (cert) => {
    setEditingCert({ ...cert });
    setShowEditModal(true);
  };

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

  // Filtros dinâmicos baseados no tipo selecionado
  const filteredCertifications = useMemo(() => {
    return certifications.filter(cert => {
      const matchesSearch = !filters.search || 
        cert.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
        cert.codigo.toLowerCase().includes(filters.search.toLowerCase());
      const matchesVendor = !filters.vendor || cert.vendor === filters.vendor;
      const matchesArea = !filters.area || cert.area === filters.area;
      const matchesTipo = !filters.tipo || cert.tipo === filters.tipo;
      return matchesSearch && matchesVendor && matchesArea && matchesTipo;
    });
  }, [certifications, filters]);

  // Vendors e areas dinâmicos baseados no tipo
  const vendors = useMemo(() => {
    const certsPorTipo = filters.tipo 
      ? certifications.filter(cert => cert.tipo === filters.tipo)
      : certifications;
    return [...new Set(certsPorTipo.map(cert => cert.vendor))].sort();
  }, [certifications, filters.tipo]);

  const areas = useMemo(() => {
    const certsPorTipo = filters.tipo 
      ? certifications.filter(cert => cert.tipo === filters.tipo)
      : certifications;
    return [...new Set(certsPorTipo.map(cert => cert.area).filter(Boolean))].sort();
  }, [certifications, filters.tipo]);

  // Função para limpar filtros quando muda tipo
  const handleTipoChange = (novoTipo) => {
    setFilters(prev => ({
      ...prev,
      tipo: novoTipo,
      vendor: '', // Limpa vendor
      area: ''    // Limpa área
    }));
  };

  const handleAddCertification = (e) => {
    e.preventDefault();
    const newId = Math.max(...certifications.map(c => c.id)) + 1;
    setCertifications(prev => [...prev, {
      ...newCert,
      id: newId,
      validade_meses: (newCert.tipo === 'CURSO' || newCert.tipo === 'FORMACAO') ? null : (newCert.validade_meses ? parseInt(newCert.validade_meses) : null)
    }]);
    setNewCert({ nome: '', codigo: '', vendor: '', area: '', tipo: 'CERTIFICACAO', link: '', validade_meses: '', nivel_formacao: '' });
    setShowAddModal(false);
  };

  // Footer funcionando
  const renderFooter = (cert) => {
    if (cert.tipo === 'CERTIFICACAO') {
      if (cert.validade_meses && cert.validade_meses > 0) {
        return (
          <>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-ol-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-ol-gray-500">Validade: {cert.validade_meses} meses</p>
          </>
        );
      } else {
        return (
          <>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-ol-brand-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-ol-brand-600">Certificação permanente</p>
          </>
        );
      }
    } else if (cert.tipo === 'CURSO') {
      return (
        <>
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          </svg>
          <p className="text-xs text-blue-600">Certificado permanente</p>
        </>
      );
    } else if (cert.tipo === 'FORMACAO') {
      return (
        <>
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-ol-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-xs text-ol-gray-700">Diploma de {cert.nivel_formacao?.toLowerCase().replace('_', '-')}</p>
        </>
      );
    }
    
    return (
      <p className="text-xs text-ol-gray-400">Sem informação de validade</p>
    );
  };

  return (
    // 🆕 CONTAINER SEM FORÇAR LARGURA - SEM BARRA HORIZONTAL
    <div className="w-full min-h-screen bg-ol-gray-50">
      <div className="w-full max-w-none mx-auto p-3 sm:p-4 lg:p-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-ol-brand-600">Gestão 360 OL - Certificações</h1>
            <p className="text-ol-gray-600 mt-1 text-sm sm:text-base">Sistema completo de gestão de certificações, cursos e formações</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => openAddModal('CERTIFICACAO')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-ol-brand-600 text-white rounded-lg hover:bg-ol-brand-700 transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Nova Certificação</span>
            </button>
            <button
              onClick={() => openAddModal('CURSO')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Novo Curso</span>
            </button>
            <button
              onClick={() => openAddModal('FORMACAO')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-ol-gray-700 text-white rounded-lg hover:bg-ol-gray-800 transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Nova Formação</span>
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          
          {/* CERTIFICAÇÕES */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-ol-brand-600 mb-3 sm:mb-4 flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Certificações
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-ol-gray-600">Total no Catálogo</span>
                <span className="text-lg sm:text-xl font-bold text-ol-brand-600">{stats.totalCertificacoes}</span>
              </div>
              <button
                onClick={() => showGlobalAnalystsByStatus('OBTIDO')}
                title="Clique aqui para detalhar os colaboradores com certificações obtidas"
                className="w-full flex justify-between items-center p-2 sm:p-3 bg-ol-brand-50 hover:bg-ol-brand-100 rounded-lg transition-colors text-left"
              >
                <span className="text-xs sm:text-sm text-ol-gray-700">Obtidas</span>
                <span className="text-sm sm:text-lg font-bold text-ol-brand-600">{stats.obtidas}</span>
              </button>
              <button
                onClick={() => showGlobalAnalystsByStatus('OBRIGATORIO')}
                title="Clique aqui para detalhar os colaboradores com certificações obrigatórias"
                className="w-full flex justify-between items-center p-2 sm:p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left"
              >
                <span className="text-xs sm:text-sm text-ol-gray-700">Obrigatórias</span>
                <span className="text-sm sm:text-lg font-bold text-red-600">{stats.obrigatorias}</span>
              </button>
              <button
                onClick={() => showGlobalAnalystsByStatus('DESEJADO')}
                title="Clique aqui para detalhar os colaboradores com certificações desejadas"
                className="w-full flex justify-between items-center p-2 sm:p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
              >
                <span className="text-xs sm:text-sm text-ol-gray-700">Desejadas</span>
                <span className="text-sm sm:text-lg font-bold text-blue-600">{stats.desejadas}</span>
              </button>
              <button
                onClick={() => showGlobalAnalystsByStatus('EXPIRANDO')}
                title="Clique aqui para detalhar os colaboradores com certificações expirando em 30 dias"
                className="w-full flex justify-between items-center p-2 sm:p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-left"
              >
                <span className="text-xs sm:text-sm text-ol-gray-700">Expira ≤30d</span>
                <span className="text-sm sm:text-lg font-bold text-yellow-600">{stats.expirandoEm30d}</span>
              </button>
              <button
                onClick={() => showGlobalAnalystsByStatus('EXPIRADAS')}
                title="Clique aqui para detalhar os colaboradores com certificações expiradas"
                className="w-full flex justify-between items-center p-2 sm:p-3 bg-ol-brand-50 hover:bg-ol-brand-100 rounded-lg transition-colors text-left"
              >
                <span className="text-xs sm:text-sm text-ol-gray-700">Expiradas</span>
                <span className="text-sm sm:text-lg font-bold text-ol-brand-600">{stats.expiradas}</span>
              </button>
            </div>
          </div>

          {/* CURSOS */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-blue-600 mb-3 sm:mb-4 flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              </svg>
              Cursos
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-ol-gray-600">Total no Catálogo</span>
                <span className="text-lg sm:text-xl font-bold text-blue-600">{stats.totalCursos}</span>
              </div>
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs sm:text-sm text-blue-700">Certificados permanentes</p>
                </div>
              </div>
            </div>
          </div>

          {/* FORMAÇÕES */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 md:col-span-2 xl:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold text-ol-gray-700 mb-3 sm:mb-4 flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Formações
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-ol-gray-600">Total no Catálogo</span>
                <span className="text-lg sm:text-xl font-bold text-ol-gray-700">{stats.totalFormacoes}</span>
              </div>
              
              {stats.graduacoes > 0 && (
                <button
                  onClick={() => showFormationAnalysts('GRADUACAO')}
                  title="Clique aqui para ver colaboradores com graduação"
                  className="w-full flex justify-between items-center p-2 bg-ol-gray-100 hover:bg-ol-gray-200 rounded transition-colors text-left"
                >
                  <span className="text-xs sm:text-sm text-ol-gray-700">Graduações</span>
                  <span className="text-xs sm:text-sm font-bold text-ol-gray-700">{stats.graduacoes}</span>
                </button>
              )}
              
              {stats.tecnologos > 0 && (
                <button
                  onClick={() => showFormationAnalysts('TECNOLOGO')}
                  title="Clique aqui para ver colaboradores com tecnólogo"
                  className="w-full flex justify-between items-center p-2 bg-ol-gray-100 hover:bg-ol-gray-200 rounded transition-colors text-left"
                >
                  <span className="text-xs sm:text-sm text-ol-gray-700">Tecnólogos</span>
                  <span className="text-xs sm:text-sm font-bold text-ol-gray-700">{stats.tecnologos}</span>
                </button>
              )}
              
              {stats.posGraduacoes > 0 && (
                <button
                  onClick={() => showFormationAnalysts('POS_GRADUACAO')}
                  title="Clique aqui para ver colaboradores com pós-graduação"
                  className="w-full flex justify-between items-center p-2 bg-ol-gray-100 hover:bg-ol-gray-200 rounded transition-colors text-left"
                >
                  <span className="text-xs sm:text-sm text-ol-gray-700">Pós-Graduações</span>
                  <span className="text-xs sm:text-sm font-bold text-ol-gray-700">{stats.posGraduacoes}</span>
                </button>
              )}
              
              {stats.mestrados > 0 && (
                <button
                  onClick={() => showFormationAnalysts('MESTRADO')}
                  title="Clique aqui para ver colaboradores com mestrado"
                  className="w-full flex justify-between items-center p-2 bg-ol-gray-100 hover:bg-ol-gray-200 rounded transition-colors text-left"
                >
                  <span className="text-xs sm:text-sm text-ol-gray-700">Mestrados</span>
                  <span className="text-xs sm:text-sm font-bold text-ol-gray-700">{stats.mestrados}</span>
                </button>
              )}
              
              {stats.doutorados > 0 && (
                <button
                  onClick={() => showFormationAnalysts('DOUTORADO')}
                  title="Clique aqui para ver colaboradores com doutorado"
                  className="w-full flex justify-between items-center p-2 bg-ol-gray-100 hover:bg-ol-gray-200 rounded transition-colors text-left"
                >
                  <span className="text-xs sm:text-sm text-ol-gray-700">Doutorados</span>
                  <span className="text-xs sm:text-sm font-bold text-ol-gray-700">{stats.doutorados}</span>
                </button>
              )}
              
              {stats.mbas > 0 && (
                <button
                  onClick={() => showFormationAnalysts('MBA')}
                  title="Clique aqui para ver colaboradores com MBA"
                  className="w-full flex justify-between items-center p-2 bg-ol-gray-100 hover:bg-ol-gray-200 rounded transition-colors text-left"
                >
                  <span className="text-xs sm:text-sm text-ol-gray-700">MBAs</span>
                  <span className="text-xs sm:text-sm font-bold text-ol-gray-700">{stats.mbas}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filtros com vendors e areas dinâmicos */}
        <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Buscar por nome ou código..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
            />
            
            {/* Filtro de tipo com limpeza automática */}
            <select
              value={filters.tipo}
              onChange={(e) => handleTipoChange(e.target.value)}
              className="px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
            >
              <option value="">Todos os Tipos</option>
              <option value="CERTIFICACAO">Certificações</option>
              <option value="CURSO">Cursos</option>
              <option value="FORMACAO">Formações</option>
            </select>
            
            {/* Vendors dinâmicos */}
            <select
              value={filters.vendor}
              onChange={(e) => setFilters(prev => ({ ...prev, vendor: e.target.value }))}
              className="px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
              disabled={vendors.length === 0}
            >
              <option value="">
                {filters.tipo === 'CERTIFICACAO' ? 'Todos os Vendors' : 
                 filters.tipo === 'CURSO' ? 'Todas as Plataformas' :
                 filters.tipo === 'FORMACAO' ? 'Todas as Instituições' :
                 'Todos os Vendors/Plataformas'}
              </option>
              {vendors.map(vendor => (
                <option key={vendor} value={vendor}>{vendor}</option>
              ))}
            </select>

            {/* Areas dinâmicas */}
            <select
              value={filters.area}
              onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
              className="px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
              disabled={areas.length === 0}
            >
              <option value="">Todas as Áreas</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
          
          {/* Contador de resultados */}
          <div className="mt-3 text-xs text-ol-gray-500">
            {filteredCertifications.length === certifications.length 
              ? `${certifications.length} itens no total`
              : `${filteredCertifications.length} de ${certifications.length} itens`
            }
            {filters.tipo && (
              <span className="ml-2 px-2 py-1 bg-ol-brand-100 text-ol-brand-700 rounded text-xs">
                Tipo: {filters.tipo === 'CERTIFICACAO' ? 'Certificações' : filters.tipo === 'CURSO' ? 'Cursos' : 'Formações'}
              </span>
            )}
          </div>
        </div>

        {/* Grid de Cards RESPONSIVO */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {filteredCertifications.map((cert) => {
            const certStats = getCertificationStats(cert.id);
            
            return (
              <div key={cert.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
                {/* SEÇÃO 1: Info */}
                <div className="p-4 sm:p-6 pb-3 sm:pb-4 flex-1">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-ol-gray-900 mb-1 break-words leading-tight">{cert.nome}</h3>
                      <p className="text-xs sm:text-sm text-ol-gray-600 mb-2 break-words">{cert.codigo} • {cert.vendor}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          cert.tipo === 'CURSO' 
                            ? 'bg-blue-100 text-blue-700'
                            : cert.tipo === 'FORMACAO'
                              ? 'bg-ol-gray-100 text-ol-gray-700'
                              : 'bg-ol-brand-100 text-ol-brand-700'
                        }`}>
                          {cert.tipo === 'FORMACAO' ? cert.nivel_formacao?.replace('_', ' ') : cert.tipo}
                        </span>
                        {cert.area && (
                          <span className="text-xs bg-ol-brand-100 text-ol-brand-700 px-2 py-1 rounded break-words">{cert.area}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                      {cert.link && (
                        <a 
                          href={cert.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          title={`Clique aqui para acessar a página ${cert.tipo === 'CURSO' ? 'do curso' : cert.tipo === 'FORMACAO' ? 'da formação' : 'da certificação'}`}
                          className="text-ol-brand-600 hover:text-ol-brand-700 transition-colors p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      <button 
                        onClick={() => handleEditCertification(cert)}
                        title="Clique aqui para editar os dados"
                        className="text-ol-brand-600 hover:text-ol-brand-700 transition-colors p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-ol-gray-100"></div>

                {/* SEÇÃO 2: Status com cores uniformes por tipo + fundo cinza */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-2 flex-shrink-0">
                  {certStats.obtidas > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-ol-gray-600">Obtidas:</span>
                      <button
                        onClick={() => showAnalystsByStatus(cert.id, 'OBTIDO')}
                        title="Clique aqui para detalhar os colaboradores com este conhecimento"
                        className={`font-medium text-xs sm:text-sm transition-colors px-2 py-1 rounded ${
                          cert.tipo === 'CURSO' 
                            ? 'text-blue-600 hover:text-blue-700 bg-ol-gray-100 hover:bg-ol-gray-200'
                            : cert.tipo === 'FORMACAO'
                              ? 'text-ol-gray-700 hover:text-ol-gray-800 bg-ol-gray-100 hover:bg-ol-gray-200'
                              : 'text-ol-brand-600 hover:text-ol-brand-700 bg-ol-gray-100 hover:bg-ol-gray-200'
                        }`}
                      >
                        {certStats.obtidas} analistas →
                      </button>
                    </div>
                  )}

                  {certStats.obrigatorias > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-ol-gray-600">Obrigatórias:</span>
                      <button
                        onClick={() => showAnalystsByStatus(cert.id, 'OBRIGATORIO')}
                        title="Clique aqui para detalhar os colaboradores com este conhecimento"
                        className="text-red-600 hover:text-red-700 font-medium text-xs sm:text-sm transition-colors px-2 py-1 rounded bg-ol-gray-100 hover:bg-ol-gray-200"
                      >
                        {certStats.obrigatorias} pendentes →
                      </button>
                    </div>
                  )}

                  {certStats.desejadas > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-ol-gray-600">Desejadas:</span>
                      <button
                        onClick={() => showAnalystsByStatus(cert.id, 'DESEJADO')}
                        title="Clique aqui para detalhar os colaboradores com este conhecimento"
                        className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm transition-colors px-2 py-1 rounded bg-ol-gray-100 hover:bg-ol-gray-200"
                      >
                        {certStats.desejadas} analistas →
                      </button>
                    </div>
                  )}

                  {certStats.obtidas === 0 && certStats.obrigatorias === 0 && certStats.desejadas === 0 && (
                    <p className="text-xs sm:text-sm text-ol-gray-400 text-center py-1">Nenhum analista vinculado</p>
                  )}
                </div>

                {/* SEÇÃO 3: Footer */}
                <div className="border-t border-ol-gray-100"></div>
                <div className="px-4 sm:px-6 py-3 flex items-center flex-shrink-0">
                  {renderFooter(cert)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal de adicionar */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowAddModal(false)}></div>
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl mx-4">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-ol-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-ol-gray-900">
                    {modalType === 'CURSO' ? 'Novo Curso' : modalType === 'FORMACAO' ? 'Nova Formação' : 'Nova Certificação'}
                  </h3>
                  <button onClick={() => setShowAddModal(false)} className="text-ol-gray-400 hover:text-ol-gray-600">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleAddCertification} className="p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                        Nome {modalType === 'CURSO' ? 'do Curso' : modalType === 'FORMACAO' ? 'da Formação' : 'da Certificação'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCert.nome}
                        onChange={(e) => setNewCert(prev => ({ ...prev, nome: e.target.value }))}
                        className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
                        placeholder={modalType === 'CURSO' ? "Ex: Python para Cibersegurança" : modalType === 'FORMACAO' ? "Ex: Ciência da Computação" : "Ex: Certified Information Systems Security Professional"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ol-gray-700 mb-1">Código *</label>
                      <input
                        type="text"
                        required
                        value={newCert.codigo}
                        onChange={(e) => setNewCert(prev => ({ ...prev, codigo: e.target.value }))}
                        className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
                        placeholder={modalType === 'CURSO' ? "Ex: PY-CYBER-001" : modalType === 'FORMACAO' ? "Ex: CC-GRAD-001" : "Ex: CISSP-001"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                        {modalType === 'CURSO' ? 'Plataforma' : modalType === 'FORMACAO' ? 'Instituição' : 'Vendor'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCert.vendor}
                        onChange={(e) => setNewCert(prev => ({ ...prev, vendor: e.target.value }))}
                        className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
                        placeholder={modalType === 'CURSO' ? "Ex: Udemy" : modalType === 'FORMACAO' ? "Ex: Universidade Federal" : "Ex: ISC2"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ol-gray-700 mb-1">Área</label>
                      <input
                        type="text"
                        value={newCert.area}
                        onChange={(e) => setNewCert(prev => ({ ...prev, area: e.target.value }))}
                        className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
                        placeholder="Ex: Cibersegurança"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ol-gray-700 mb-1">Link</label>
                      <input
                        type="url"
                        value={newCert.link}
                        onChange={(e) => setNewCert(prev => ({ ...prev, link: e.target.value }))}
                        className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
                        placeholder="Ex: https://www.exemplo.com"
                      />
                    </div>

                    {modalType === 'FORMACAO' && (
                      <div>
                        <label className="block text-sm font-medium text-ol-gray-700 mb-1">Nível da Formação *</label>
                        <select
                          required
                          value={newCert.nivel_formacao}
                          onChange={(e) => setNewCert(prev => ({ ...prev, nivel_formacao: e.target.value }))}
                          className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
                        >
                          <option value="GRADUACAO">Graduação</option>
                          <option value="TECNOLOGO">Tecnólogo</option>
                          <option value="POS_GRADUACAO">Pós-Graduação</option>
                          <option value="MESTRADO">Mestrado</option>
                          <option value="DOUTORADO">Doutorado</option>
                          <option value="MBA">MBA</option>
                        </select>
                      </div>
                    )}

                    {modalType === 'CERTIFICACAO' && (
                      <div>
                        <label className="block text-sm font-medium text-ol-gray-700 mb-1">Validade (meses)</label>
                        <input
                          type="number"
                          min="1"
                          value={newCert.validade_meses}
                          onChange={(e) => setNewCert(prev => ({ ...prev, validade_meses: e.target.value }))}
                          className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
                          placeholder="Ex: 36"
                        />
                      </div>
                    )}
                  </div>

                  {modalType === 'CURSO' && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs sm:text-sm text-blue-700">
                        💡 Cursos geram certificados sem data de expiração.
                      </p>
                    </div>
                  )}

                  {modalType === 'FORMACAO' && (
                    <div className="bg-ol-gray-100 p-3 rounded-lg">
                      <p className="text-xs sm:text-sm text-ol-gray-700">
                        🎓 Formações acadêmicas são diplomas permanentes.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-sm font-medium text-ol-gray-700 bg-white border border-ol-gray-300 rounded-md hover:bg-ol-gray-50 w-full sm:w-auto"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md w-full sm:w-auto ${
                        modalType === 'CURSO' 
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : modalType === 'FORMACAO'
                            ? 'bg-ol-gray-700 hover:bg-ol-gray-800' 
                            : 'bg-ol-brand-600 hover:bg-ol-brand-700'
                      }`}
                    >
                      Criar {modalType === 'CURSO' ? 'Curso' : modalType === 'FORMACAO' ? 'Formação' : 'Certificação'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Editar */}
        {showEditModal && editingCert && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowEditModal(false)}></div>
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl mx-4">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-ol-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-ol-gray-900">
                    Editar {editingCert.tipo === 'CURSO' ? 'Curso' : editingCert.tipo === 'FORMACAO' ? 'Formação' : 'Certificação'}
                  </h3>
                  <button onClick={() => setShowEditModal(false)} className="text-ol-gray-400 hover:text-ol-gray-600">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSaveEdit} className="p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-ol-gray-700 mb-1">Nome *</label>
                      <input
                        type="text"
                        required
                        value={editingCert.nome}
                        onChange={(e) => setEditingCert(prev => ({ ...prev, nome: e.target.value }))}
                        className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ol-gray-700 mb-1">Código *</label>
                      <input
                        type="text"
                        required
                        value={editingCert.codigo}
                        onChange={(e) => setEditingCert(prev => ({ ...prev, codigo: e.target.value }))}
                        className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ol-gray-700 mb-1">
                        {editingCert.tipo === 'CURSO' ? 'Plataforma' : editingCert.tipo === 'FORMACAO' ? 'Instituição' : 'Vendor'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingCert.vendor}
                        onChange={(e) => setEditingCert(prev => ({ ...prev, vendor: e.target.value }))}
                        className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ol-gray-700 mb-1">Área</label>
                      <input
                        type="text"
                        value={editingCert.area || ''}
                        onChange={(e) => setEditingCert(prev => ({ ...prev, area: e.target.value }))}
                        className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ol-gray-700 mb-1">Link</label>
                      <input
                        type="url"
                        value={editingCert.link || ''}
                        onChange={(e) => setEditingCert(prev => ({ ...prev, link: e.target.value }))}
                        className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
                      />
                    </div>

                    {editingCert.tipo === 'FORMACAO' && (
                      <div>
                        <label className="block text-sm font-medium text-ol-gray-700 mb-1">Nível da Formação *</label>
                        <select
                          required
                          value={editingCert.nivel_formacao || 'GRADUACAO'}
                          onChange={(e) => setEditingCert(prev => ({ ...prev, nivel_formacao: e.target.value }))}
                          className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
                        >
                          <option value="GRADUACAO">Graduação</option>
                          <option value="TECNOLOGO">Tecnólogo</option>
                          <option value="POS_GRADUACAO">Pós-Graduação</option>
                          <option value="MESTRADO">Mestrado</option>
                          <option value="DOUTORADO">Doutorado</option>
                          <option value="MBA">MBA</option>
                        </select>
                      </div>
                    )}

                    {editingCert.tipo === 'CERTIFICACAO' && (
                      <div>
                        <label className="block text-sm font-medium text-ol-gray-700 mb-1">Validade (meses)</label>
                        <input
                          type="number"
                          min="1"
                          value={editingCert.validade_meses || ''}
                          onChange={(e) => setEditingCert(prev => ({ ...prev, validade_meses: e.target.value }))}
                          className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500 text-sm sm:text-base"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-sm font-medium text-ol-gray-700 bg-white border border-ol-gray-300 rounded-md hover:bg-ol-gray-50 w-full sm:w-auto"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-ol-brand-600 border border-transparent rounded-md hover:bg-ol-brand-700 w-full sm:w-auto"
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
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-4xl mx-4">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-ol-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-ol-gray-900 break-words">{selectedCertStatus}</h3>
                  <button onClick={() => setShowAnalystsModal(false)} className="text-ol-gray-400 hover:text-ol-gray-600 flex-shrink-0 ml-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-4 sm:p-6">
                  {selectedAnalysts.length === 0 ? (
                    <p className="text-center text-ol-gray-500 py-8 text-sm sm:text-base">Nenhum analista encontrado para este status.</p>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      <p className="text-xs sm:text-sm text-ol-gray-600 mb-4">
                        {selectedAnalysts.length} analista(s) encontrado(s)
                      </p>
                      
                      {selectedAnalysts.map((analyst, index) => (
                        <div key={`${analyst.id}-${index}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-ol-gray-50 rounded-lg space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-ol-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-ol-brand-600 font-medium text-xs sm:text-sm">
                                {analyst.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-ol-gray-900 text-sm sm:text-base break-words">{analyst.nome}</p>
                              <p className="text-xs sm:text-sm text-ol-gray-600 break-words">{analyst.cargo} • {analyst.equipe}</p>
                              {analyst.certification && (
                                <p className={`text-xs ${
                                  analyst.certification.tipo === 'CURSO' 
                                    ? 'text-blue-600' 
                                    : analyst.certification.tipo === 'FORMACAO'
                                      ? 'text-ol-gray-700'
                                      : 'text-ol-brand-600'
                                } break-words`}>
                                  {analyst.certification.nome}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-left sm:text-right pl-11 sm:pl-0">
                            {analyst.certData.data_obtencao && (
                              <p className="text-xs sm:text-sm text-ol-gray-600">
                                Obtido: {new Date(analyst.certData.data_obtencao).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                            {analyst.certData.data_alvo && (
                              <p className="text-xs sm:text-sm text-ol-gray-600">
                                Meta: {new Date(analyst.certData.data_alvo).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                            {analyst.certData.data_expiracao && (
                              <p className={`text-xs sm:text-sm ${new Date(analyst.certData.data_expiracao) < new Date() ? 'text-red-600' : 'text-ol-gray-600'}`}>
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


