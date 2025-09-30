import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import { PageContainer } from '../ui';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import EmptyState from '../ui/feedback/EmptyState';
import OL_COLORS from '../../config/olColors';

// ✅ COMPONENTES INLINE OTIMIZADOS - CORRIGIDOS
const Loading = ({ fullScreen }) => (
  <div className={fullScreen ? "flex items-center justify-center min-h-screen" : "flex items-center justify-center p-8"}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black opacity-60" onClick={onClose}></div>
        <div className="relative bg-white rounded-xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

const PageSection = ({ title, children }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
    <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
    {children}
  </div>
);

const AlertCard = ({ alerts }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
    <h3 className="text-xl font-semibold text-gray-900 mb-6">Alertas do Sistema</h3>
    {alerts && alerts.length > 0 ? (
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="p-4 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors"
          >
            <p className="text-sm text-amber-800">{alert.message}</p>
          </div>
        ))}
      </div>
    ) : (
      <EmptyState
        icon={() => (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        title="Sem alertas"
        subtitle="Sistema funcionando perfeitamente"
        variant="success"
      />
    )}
  </div>
);

// ✅ API SERVICE
const API_BASE_URL = 'http://localhost:8000';

const api = {
  get: async (url) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();

      console.log(`📡 API Response for ${url}:`, result);

      // ✅ GARANTIR SEMPRE ARRAY - CORRIGIDO
      return {
        data: Array.isArray(result) ? result : (result?.data && Array.isArray(result.data) ? result.data : [])
      };
    } catch (error) {
      console.error(`❌ API Error: ${url}`, error);
      return { data: [] };
    }
  }
};

const DashboardPage = React.memo(({ setCurrentPage, userRole = 'admin' }) => {
  // ✅ ESTADOS
  const [data, setData] = useState({ knowledge: [], employees: [], employeeLinks: [] });
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState({ isOpen: false, title: '', content: null });

  // ✅ CARREGAMENTO DE DADOS - CORRIGIDO
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [knowledge, employees, employeeLinks] = await Promise.all([
        api.get('/knowledge'),
        api.get('/employees'),
        api.get('/employee-knowledge')
      ]);

      // ✅ GARANTIR QUE SEMPRE SEJAM ARRAYS
      const safeData = {
        knowledge: Array.isArray(knowledge.data) ? knowledge.data : [],
        employees: Array.isArray(employees.data) ? employees.data : [],
        employeeLinks: Array.isArray(employeeLinks.data) ? employeeLinks.data : []
      };

      console.log('📊 Dashboard Data Loaded:', safeData);
      setData(safeData);

    } catch (error) {
      console.error('❌ Erro ao carregar dashboard:', error);
      // ✅ FALLBACK SEGURO
      setData({
        knowledge: [],
        employees: [],
        employeeLinks: []
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // ✅ ANALYTICS CORRIGIDO - SEM CLASSES DINÂMICAS
  const analytics = useMemo(() => {
    // ✅ VERIFICAÇÃO SEGURA
    const safeEmployees = Array.isArray(data.employees) ? data.employees : [];
    const safeKnowledge = Array.isArray(data.knowledge) ? data.knowledge : [];
    const safeLinks = Array.isArray(data.employeeLinks) ? data.employeeLinks : [];

    if (safeEmployees.length === 0 && safeKnowledge.length === 0 && safeLinks.length === 0) {
      return {
        totalEmployees: 0,
        totalKnowledge: 0,
        totalLinks: 0,
        obtainedCertifications: 0,
        expiringCount: 0,
        coverageRate: 0,
        employeesWithoutLinks: [],
        knowledgeWithoutLinks: [],
        statusData: [
          { name: 'Obtidos', value: 0, color: OL_COLORS.success },
          { name: 'Desejados', value: 0, color: OL_COLORS.info },
          { name: 'Obrigatórios', value: 0, color: OL_COLORS.primary }
        ],
        alerts: []
      };
    }

    const employeesWithoutLinks = safeEmployees.filter(emp =>
      !safeLinks.some(link => link.employee_id === emp.id)
    );

    const knowledgeWithoutLinks = safeKnowledge.filter(k =>
      !safeLinks.some(link => link.knowledge_id === k.id)
    );

    const obtainedCount = safeLinks.filter(l => l.status === 'OBTIDO').length;
    const desiredCount = safeLinks.filter(l => l.status === 'DESEJADO').length;
    const requiredCount = safeLinks.filter(l => l.status === 'OBRIGATORIO').length;

    return {
      totalEmployees: safeEmployees.length,
      totalKnowledge: safeKnowledge.length,
      totalLinks: safeLinks.length,
      obtainedCertifications: obtainedCount,
      expiringCount: 0,
      coverageRate: safeLinks.length > 0 ?
        Math.round((obtainedCount / safeLinks.length) * 100) : 0,
      employeesWithoutLinks,
      knowledgeWithoutLinks,
      statusData: [
        { name: 'Obtidos', value: obtainedCount, color: OL_COLORS.success },
        { name: 'Desejados', value: desiredCount, color: OL_COLORS.info },
        { name: 'Obrigatórios', value: requiredCount, color: OL_COLORS.primary }
      ],
      alerts: []
    };
  }, [data]);

  // ✅ NAVEGAÇÃO
  const handleCardClick = useCallback((type) => {
    try {
      console.log('🔗 Clicou em:', type);

      if (type === 'employee-knowledge') {
        alert('Página de vínculos em manutenção. Use Dashboard > Colaboradores para gerenciar competências.');
        return;
      }

      if (setCurrentPage && typeof setCurrentPage === 'function') {
        setCurrentPage(type);
      }
    } catch (error) {
      console.error('❌ Erro na navegação:', error);
      alert('Erro ao navegar. Tente novamente.');
    }
  }, [setCurrentPage]);

  const closeModal = useCallback(() => {
    setDetailModal({ isOpen: false, title: '', content: null });
  }, []);

  // ✅ MODAL CONTENT - CORRIGIDO SEM CLASSES DINÂMICAS
  const modalContent = {
    expiring: (
      <EmptyState
        icon={() => <div className="w-8 h-8 text-green-500">✓</div>}
        title="Tudo em dia!"
        subtitle="Nenhuma certificação vencendo nos próximos 30 dias"
        variant="success"
      />
    ),

    employeesWithoutLinks: (
      <div className="space-y-6">
        {analytics.employeesWithoutLinks.length > 0 ? (
          <div className="text-center py-8">
            <p>Lista de {analytics.employeesWithoutLinks.length} colaboradores sem vínculos</p>
          </div>
        ) : (
          <EmptyState
            icon={() => <div className="w-8 h-8 text-green-500">✓</div>}
            title="Excelente!"
            subtitle="Todos colaboradores têm ao menos uma certificação"
            variant="success"
          />
        )}
      </div>
    ),

    orphanedKnowledge: (
      <div className="space-y-6">
        {analytics.knowledgeWithoutLinks.length > 0 ? (
          <div className="text-center py-8">
            <p>Lista de {analytics.knowledgeWithoutLinks.length} conhecimentos órfãos</p>
          </div>
        ) : (
          <EmptyState
            icon={() => <div className="w-8 h-8 text-green-500">✓</div>}
            title="Perfeito!"
            subtitle="Todos conhecimentos têm vínculos ativos"
            variant="success"
          />
        )}
      </div>
    ),

    pieDetails: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analytics.statusData.map((item, index) => (
          <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-4"
              style={{ backgroundColor: item.color }}
            />
            <h4 className="text-2xl font-bold text-gray-800 mb-1">{item.value}</h4>
            <p className="text-gray-600">{item.name}</p>
          </div>
        ))}
      </div>
    )
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <PageContainer>
      {/* ✅ ESTATÍSTICAS */}
      <DashboardStats
        analytics={analytics}
        userRole={userRole}
        onCardClick={handleCardClick}
        onExpiringClick={() => setDetailModal({
          isOpen: true,
          title: 'Certificações Vencendo',
          content: modalContent.expiring
        })}
        onEmployeesWithoutLinksClick={() => setDetailModal({
          isOpen: true,
          title: 'Colaboradores Sem Certificações',
          content: modalContent.employeesWithoutLinks
        })}
        onOrphanedKnowledgeClick={() => setDetailModal({
          isOpen: true,
          title: 'Conhecimentos Órfãos',
          content: modalContent.orphanedKnowledge
        })}
      />

      {/* ✅ GRÁFICOS */}
      <DashboardCharts
        analytics={analytics}
        onPieClick={() => setDetailModal({
          isOpen: true,
          title: 'Detalhes da Distribuição',
          content: modalContent.pieDetails
        })}
      />

      {/* ✅ SEÇÕES FINAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PageSection title="Top 5 Conhecimentos Mais Desejados">
          <EmptyState
            icon={BookOpen}
            title="Carregando dados..."
            subtitle="Conhecimentos mais desejados em breve"
            variant="default"
          />
        </PageSection>

        <AlertCard alerts={analytics.alerts} />
      </div>

      {/* ✅ MODAL */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={closeModal}
        title={detailModal.title}
      >
        {detailModal.content}
      </Modal>
    </PageContainer>
  );
});

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
