import React, { useState, useMemo } from 'react';
import { useKnowledge } from '../../hooks/useKnowledge';
import { useEmployees } from '../../hooks/useEmployees';

const KnowledgePageIntegrated = ({ onBackToDashboard }) => {
  // Hooks para dados da API
  const {
    knowledge,
    loading: knowledgeLoading,
    error: knowledgeError,
    createKnowledge,
    updateKnowledge,
    deleteKnowledge
  } = useKnowledge();

  const {
    employees,
    loading: employeesLoading
  } = useEmployees();

  // Estados locais da interface
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('CERTIFICACAO');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnalystsModal, setShowAnalystsModal] = useState(false);
  const [selectedAnalysts, setSelectedAnalysts] = useState([]);
  const [selectedCertStatus, setSelectedCertStatus] = useState('');
  const [editingCert, setEditingCert] = useState(null);
  const [filters, setFilters] = useState({ search: '', vendor: '', area: '', tipo: '' });
  const [newCert, setNewCert] = useState({
    nome: '',
    codigo: '',
    vendor: '',
    area: '',
    tipo: 'CERTIFICACAO',
    link: '',
    validade_meses: '',
    nivel_formacao: ''
  });

  // Loading state
  if (knowledgeLoading || employeesLoading) {
    return (
      <div className="min-h-screen bg-ol-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ol-brand-600 mx-auto"></div>
          <p className="mt-4 text-ol-gray-600">Carregando conhecimentos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (knowledgeError) {
    return (
      <div className="min-h-screen bg-ol-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-4">{knowledgeError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-ol-brand-600 text-white rounded hover:bg-ol-brand-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Calcular estatísticas baseadas nos dados reais
  const stats = useMemo(() => {
    // Para agora, vamos usar dados básicos
    // Mais tarde conectaremos com employee_knowledge da API
    const totalCertificacoes = knowledge.filter(k => k.tipo === 'CERTIFICACAO').length;
    const totalCursos = knowledge.filter(k => k.tipo === 'CURSO').length;
    const totalFormacoes = knowledge.filter(k => k.tipo === 'FORMACAO').length;

    const graduacoes = knowledge.filter(k => k.tipo === 'FORMACAO' && k.nivel_formacao === 'GRADUACAO').length;
    const tecnologos = knowledge.filter(k => k.tipo === 'FORMACAO' && k.nivel_formacao === 'TECNOLOGO').length;
    const posGraduacoes = knowledge.filter(k => k.tipo === 'FORMACAO' && k.nivel_formacao === 'POS_GRADUACAO').length;
    const mestrados = knowledge.filter(k => k.tipo === 'FORMACAO' && k.nivel_formacao === 'MESTRADO').length;
    const doutorados = knowledge.filter(k => k.tipo === 'FORMACAO' && k.nivel_formacao === 'DOUTORADO').length;
    const mbas = knowledge.filter(k => k.tipo === 'FORMACAO' && k.nivel_formacao === 'MBA').length;

    return {
      totalCertificacoes, totalCursos, totalFormacoes,
      graduacoes, tecnologos, posGraduacoes, mestrados, doutorados, mbas,
      // Temporário - depois conectaremos com employee_knowledge
      obtidas: 0,
      obrigatorias: 0,
      desejadas: 0,
      expirandoEm30d: 0,
      expiradas: 0
    };
  }, [knowledge]);

  // Handlers
  const openAddModal = (type) => {
    setModalType(type);
    setNewCert({
      nome: '',
      codigo: '',
      vendor: '',
      area: '',
      tipo: type,
      link: '',
      validade_meses: '',
      nivel_formacao: type === 'FORMACAO' ? 'GRADUACAO' : ''
    });
    setShowAddModal(true);
  };

  const handleAddCertification = async (e) => {
    e.preventDefault();
    try {
      const knowledgeData = {
        ...newCert,
        validade_meses: (newCert.tipo === 'CURSO' || newCert.tipo === 'FORMACAO') ? null : (newCert.validade_meses ? parseInt(newCert.validade_meses) : null)
      };

      await createKnowledge(knowledgeData);

      setNewCert({
        nome: '',
        codigo: '',
        vendor: '',
        area: '',
        tipo: 'CERTIFICACAO',
        link: '',
        validade_meses: '',
        nivel_formacao: ''
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Erro ao criar conhecimento:', error);
      alert('Erro ao criar conhecimento. Tente novamente.');
    }
  };

  const handleEditCertification = (cert) => {
    setEditingCert({ ...cert });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...editingCert,
        validade_meses: editingCert.validade_meses ? parseInt(editingCert.validade_meses) : null
      };

      await updateKnowledge(editingCert.id, updatedData);

      setShowEditModal(false);
      setEditingCert(null);
    } catch (error) {
      console.error('Erro ao atualizar conhecimento:', error);
      alert('Erro ao atualizar conhecimento. Tente novamente.');
    }
  };

  // Filtros
  const filteredCertifications = useMemo(() => {
    return knowledge.filter(cert => {
      const matchesSearch = !filters.search ||
        cert.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
        cert.codigo.toLowerCase().includes(filters.search.toLowerCase());
      const matchesVendor = !filters.vendor || cert.vendor === filters.vendor;
      const matchesArea = !filters.area || cert.area === filters.area;
      const matchesTipo = !filters.tipo || cert.tipo === filters.tipo;
      return matchesSearch && matchesVendor && matchesArea && matchesTipo;
    });
  }, [knowledge, filters]);

  const vendors = [...new Set(knowledge.map(cert => cert.vendor))];
  const areas = [...new Set(knowledge.map(cert => cert.area))];

  // Rest of the component - same structure as your original but using real data
  // ... (o resto do JSX continua igual ao seu código original)

  return (
    <div className="min-h-screen bg-ol-gray-50 p-3 sm:p-6" style={{ minWidth: '100vw' }}>
      {/* Usar a mesma estrutura JSX do seu código original */}
      {/* mas agora com dados reais da API */}
    </div>
  );
};

export default KnowledgePageIntegrated;
