import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Award,
  Clock,
  Target,
  Edit,
  Settings,
  UserPlus,
  ExternalLink,
  Eye
} from 'lucide-react';
import {
  PieChart as RechartsPie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// ✅ IMPORT DO DESIGN SYSTEM CENTRALIZADO
import {
  PageContainer,
  PageHeader,
  PageSection,
  StatCard,
  ChartCard,
  AlertCard,
  Button,
  Loading,
  Modal,
  StatusBadge
} from '../ui';

const API_BASE_URL = 'http://localhost:8000';

const api = {
  get: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { data: await response.json() };
  }
};

const dataService = {
  async getAllData() {
    try {
      const [knowledge, employees, employeeLinks] = await Promise.all([
        api.get('/knowledge'),
        api.get('/employees'),
        api.get('/employee-knowledge')
      ]);

      return {
        knowledge: knowledge.data || [],
        employees: employees.data || [],
        employeeLinks: employeeLinks.data || []
      };
    } catch (error) {
      console.error('❌ Erro ao carregar dados do dashboard:', error);
      return { knowledge: [], employees: [], employeeLinks: [] };
    }
  }
};

// Avatar component inline (specific to Dashboard)
const Avatar = ({ name, src, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} bg-ol-brand-100 rounded-full flex items-center justify-center`}>
      <span className="text-ol-brand-600 font-medium">
        {getInitials(name)}
      </span>
    </div>
  );
};

const DashboardPage = ({ setCurrentPage }) => {
  const [data, setData] = useState({ knowledge: [], employees: [], employeeLinks: [] });
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});
  const [detailModal, setDetailModal] = useState({ isOpen: false, title: '', content: null, actions: [] });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const result = await dataService.getAllData();
      setData(result);

      const calculatedAnalytics = calculateAnalytics(result);
      setAnalytics(calculatedAnalytics);
    } catch (error) {
      console.error('❌ Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = ({ knowledge, employees, employeeLinks }) => {
    const today = new Date();
    const in30Days = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

    const expiringCertifications = employeeLinks.filter(link => {
      if (!link.data_expiracao || link.status !== 'OBTIDO') return false;
      const expirationDate = new Date(link.data_expiracao);
      return expirationDate >= today && expirationDate <= in30Days;
    });

    const teamCoverage = {};
    employees.forEach(emp => {
      const team = emp.equipe || 'Sem Equipe';
      if (!teamCoverage[team]) {
        teamCoverage[team] = {
          employees: 0,
          certifications: 0,
          obtained: 0
        };
      }
      teamCoverage[team].employees++;

      const empLinks = employeeLinks.filter(link => link.employee_id === emp.id);
      teamCoverage[team].certifications += empLinks.length;
      teamCoverage[team].obtained += empLinks.filter(link => link.status === 'OBTIDO').length;
    });

    const knowledgeStats = {};
    employeeLinks.forEach(link => {
      const knowledgeId = link.knowledge_id;
      if (!knowledgeStats[knowledgeId]) {
        knowledgeStats[knowledgeId] = {
          id: knowledgeId,
          name: knowledge.find(k => k.id === knowledgeId)?.nome || 'Desconhecido',
          desired: 0,
          obtained: 0,
          required: 0
        };
      }

      if (link.status === 'DESEJADO') knowledgeStats[knowledgeId].desired++;
      if (link.status === 'OBTIDO') knowledgeStats[knowledgeId].obtained++;
      if (link.status === 'OBRIGATORIO') knowledgeStats[knowledgeId].required++;
    });

    const topDesiredKnowledge = Object.values(knowledgeStats)
      .sort((a, b) => b.desired - a.desired)
      .slice(0, 5);

    const statusData = [
      { name: 'Obtidos', value: employeeLinks.filter(l => l.status === 'OBTIDO').length, color: '#22c55e' },
      { name: 'Desejados', value: employeeLinks.filter(l => l.status === 'DESEJADO').length, color: '#3b82f6' },
      { name: 'Obrigatórios', value: employeeLinks.filter(l => l.status === 'OBRIGATORIO').length, color: '#ef4444' }
    ];

    const teamData = Object.entries(teamCoverage).map(([team, data]) => ({
      team: team.length > 15 ? team.substring(0, 15) + '...' : team,
      fullTeam: team,
      employees: data.employees,
      certifications: data.certifications,
      obtained: data.obtained,
      coverage: data.certifications > 0 ? Math.round((data.obtained / data.certifications) * 100) : 0
    }));

    const employeesWithoutLinks = employees.filter(emp =>
      !employeeLinks.some(link => link.employee_id === emp.id)
    );

    const knowledgeWithoutLinks = knowledge.filter(k =>
      !employeeLinks.some(link => link.knowledge_id === k.id)
    );

    const alerts = [];

    if (expiringCertifications.length > 0) {
      alerts.push({
        title: `${expiringCertifications.length} certificações vencendo`,
        description: 'Certificações expiram nos próximos 30 dias',
        priority: 'high',
        date: 'Hoje',
        type: 'expiring',
        data: expiringCertifications
      });
    }

    if (employeesWithoutLinks.length > 0) {
      alerts.push({
        title: `${employeesWithoutLinks.length} colaboradores sem certificações`,
        description: `Colaboradores: ${employeesWithoutLinks.slice(0, 3).map(emp => emp.nome).join(', ')}${employeesWithoutLinks.length > 3 ? '...' : ''}`,
        priority: 'medium',
        date: 'Hoje',
        type: 'no_links',
        data: employeesWithoutLinks
      });
    }

    if (knowledgeWithoutLinks.length > 0) {
      alerts.push({
        title: `${knowledgeWithoutLinks.length} conhecimentos sem vínculos`,
        description: `Conhecimentos: ${knowledgeWithoutLinks.slice(0, 2).map(k => k.nome).join(', ')}${knowledgeWithoutLinks.length > 2 ? '...' : ''}`,
        priority: 'low',
        date: 'Hoje',
        type: 'orphaned',
        data: knowledgeWithoutLinks
      });
    }

    return {
      totalEmployees: employees.length,
      totalKnowledge: knowledge.length,
      totalLinks: employeeLinks.length,
      obtainedCertifications: employeeLinks.filter(l => l.status === 'OBTIDO').length,
      expiringCount: expiringCertifications.length,
      coverageRate: employeeLinks.length > 0 ? Math.round((employeeLinks.filter(l => l.status === 'OBTIDO').length / employeeLinks.length) * 100) : 0,
      teamCoverage,
      topDesiredKnowledge,
      statusData,
      teamData,
      alerts,
      employeesWithoutLinks,
      knowledgeWithoutLinks,
      expiringCertifications
    };
  };

  const handleCardClick = useCallback((type) => {
    if (!setCurrentPage) return;

    switch(type) {
      case 'employees':
        setCurrentPage('employees');
        break;
      case 'knowledge':
        setCurrentPage('knowledge');
        break;
      case 'employee-knowledge':
        setCurrentPage('employee-knowledge');
        break;
      default:
        console.log('Card clicked:', type);
    }
  }, [setCurrentPage]);

  const handleExpiringClick = useCallback(() => {
    const expiringDetails = analytics.expiringCertifications.map(cert => {
      const employee = data.employees.find(emp => emp.id === cert.employee_id);
      const knowledge = data.knowledge.find(k => k.id === cert.knowledge_id);
      return { ...cert, employee, knowledge };
    });

    setDetailModal({
      isOpen: true,
      title: `${analytics.expiringCount} Certificações Vencendo em 30 Dias`,
      actions: [
        {
          label: 'Gerenciar Vínculos',
          onClick: () => {
            setDetailModal({ isOpen: false, title: '', content: null, actions: [] });
            setCurrentPage && setCurrentPage('employee-knowledge');
          }
        }
      ],
      content: (
        <div className="space-y-4">
          {expiringDetails.map(cert => (
            <div key={cert.id} className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <Avatar name={cert.employee?.nome} size="md" />
                  <div>
                    <p className="font-medium text-gray-900">{cert.employee?.nome}</p>
                    <p className="text-sm text-gray-600">{cert.knowledge?.nome}</p>
                    <p className="text-sm text-orange-600">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Expira: {new Date(cert.data_expiracao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Edit}
                  onClick={() => {
                    setDetailModal({ isOpen: false, title: '', content: null, actions: [] });
                    setCurrentPage && setCurrentPage('employees');
                  }}
                >
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )
    });
  }, [analytics.expiringCertifications, analytics.expiringCount, data.employees, data.knowledge, setCurrentPage]);

  const handleEmployeesWithoutLinksClick = useCallback(() => {
    setDetailModal({
      isOpen: true,
      title: `${analytics.employeesWithoutLinks.length} Colaboradores Sem Certificações`,
      actions: [
        {
          label: 'Gerenciar Vínculos',
          onClick: () => {
            setDetailModal({ isOpen: false, title: '', content: null, actions: [] });
            setCurrentPage && setCurrentPage('employee-knowledge');
          }
        }
      ],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.employeesWithoutLinks.map(employee => (
              <div key={employee.id} className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar name={employee.nome} size="md" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{employee.nome}</p>
                    <p className="text-sm text-gray-600">{employee.cargo}</p>
                    <p className="text-sm text-gray-500">{employee.equipe}</p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Edit}
                  className="w-full"
                  onClick={() => {
                    setDetailModal({ isOpen: false, title: '', content: null, actions: [] });
                    setCurrentPage && setCurrentPage('employees');
                  }}
                >
                  Editar Colaborador
                </Button>
              </div>
            ))}
          </div>
        </div>
      )
    });
  }, [analytics.employeesWithoutLinks, setCurrentPage]);

  const handleOrphanedKnowledgeClick = useCallback(() => {
    setDetailModal({
      isOpen: true,
      title: `${analytics.knowledgeWithoutLinks.length} Conhecimentos Sem Vínculos`,
      actions: [
        {
          label: 'Gerenciar Conhecimentos',
          onClick: () => {
            setDetailModal({ isOpen: false, title: '', content: null, actions: [] });
            setCurrentPage && setCurrentPage('knowledge');
          }
        }
      ],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.knowledgeWithoutLinks.map(knowledge => (
              <div key={knowledge.id} className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{knowledge.nome}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <StatusBadge status={knowledge.tipo} />
                      <span className="text-sm text-gray-500">{knowledge.vendor}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{knowledge.area}</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Settings}
                    onClick={() => {
                      setDetailModal({ isOpen: false, title: '', content: null, actions: [] });
                      setCurrentPage && setCurrentPage('knowledge');
                    }}
                  >
                    Gerenciar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    });
  }, [analytics.knowledgeWithoutLinks, setCurrentPage]);

  const handleKnowledgeClick = useCallback((knowledgeItem) => {
    const relatedLinks = data.employeeLinks.filter(link => link.knowledge_id === knowledgeItem.id);
    const relatedEmployees = relatedLinks.map(link => {
      const employee = data.employees.find(emp => emp.id === link.employee_id);
      return employee ? { ...employee, linkData: link } : null;
    }).filter(Boolean);

    setDetailModal({
      isOpen: true,
      title: `Colaboradores com ${knowledgeItem.name}`,
      actions: [
        {
          label: 'Gerenciar Vínculos',
          onClick: () => {
            setDetailModal({ isOpen: false, title: '', content: null, actions: [] });
            setCurrentPage && setCurrentPage('employee-knowledge');
          }
        }
      ],
      content: (
        <div className="space-y-4">
          {relatedEmployees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedEmployees.map(employee => (
                <div key={employee.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar name={employee.nome} size="md" />
                    <div>
                      <p className="font-medium text-gray-900">{employee.nome}</p>
                      <p className="text-sm text-gray-600">{employee.cargo}</p>
                      <p className="text-sm text-gray-500">{employee.equipe}</p>
                      <StatusBadge status={employee.linkData.status} className="mt-1" />
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Edit}
                    className="w-full"
                    onClick={() => {
                      setDetailModal({ isOpen: false, title: '', content: null, actions: [] });
                      setCurrentPage && setCurrentPage('employees');
                    }}
                  >
                    Editar Colaborador
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Nenhum colaborador vinculado a este conhecimento</p>
          )}
        </div>
      )
    });
  }, [data.employeeLinks, data.employees, setCurrentPage]);

  const handleAlertClick = useCallback((alert) => {
    if (alert.type === 'expiring') {
      handleExpiringClick();
    } else if (alert.type === 'no_links') {
      handleEmployeesWithoutLinksClick();
    } else if (alert.type === 'orphaned') {
      handleOrphanedKnowledgeClick();
    }
  }, [handleExpiringClick, handleEmployeesWithoutLinksClick, handleOrphanedKnowledgeClick]);

  const handlePieClick = useCallback((data, index) => {
    const clickedSegment = analytics.statusData[index];
    if (!clickedSegment) return;

    const status = clickedSegment.name === 'Obtidos' ? 'OBTIDO' :
                  clickedSegment.name === 'Desejados' ? 'DESEJADO' : 'OBRIGATORIO';

    const filteredLinks = data.employeeLinks.filter(link => link.status === status);
    const employeesInSegment = filteredLinks.map(link => {
      const employee = data.employees.find(emp => emp.id === link.employee_id);
      const knowledge = data.knowledge.find(k => k.id === link.knowledge_id);
      return employee ? { ...employee, knowledge: knowledge?.nome, linkData: link } : null;
    }).filter(Boolean);

    setDetailModal({
      isOpen: true,
      title: `Vínculos ${clickedSegment.name} (${clickedSegment.value})`,
      actions: [
        {
          label: 'Gerenciar Vínculos',
          onClick: () => {
            setDetailModal({ isOpen: false, title: '', content: null, actions: [] });
            setCurrentPage && setCurrentPage('employee-knowledge');
          }
        }
      ],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employeesInSegment.map(employee => (
              <div key={`${employee.id}-${employee.linkData.id}`} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Avatar name={employee.nome} size="sm" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{employee.nome}</p>
                    <p className="text-sm text-gray-600">{employee.cargo}</p>
                    <p className="text-sm text-gray-500">{employee.equipe}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-ol-brand-600">{employee.knowledge}</p>
                  {employee.linkData.data_obtencao && (
                    <p className="text-xs text-gray-500">
                      Obtido: {new Date(employee.linkData.data_obtencao).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                  {employee.linkData.data_alvo && (
                    <p className="text-xs text-gray-500">
                      Meta: {new Date(employee.linkData.data_alvo).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Edit}
                  className="mt-2 w-full"
                  onClick={() => {
                    setDetailModal({ isOpen: false, title: '', content: null, actions: [] });
                    setCurrentPage && setCurrentPage('employees');
                  }}
                >
                  Editar
                </Button>
              </div>
            ))}
          </div>
        </div>
      )
    });
  }, [analytics.statusData, setCurrentPage]);

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do sistema de gestão de conhecimentos"
      />

      {/* Cards Estatísticos Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Colaboradores"
          value={analytics.totalEmployees}
          subtitle="Ativos no sistema"
          icon={Users}
          color="blue"
          onClick={() => handleCardClick('employees')}
          clickable={!!setCurrentPage}
        />

        <StatCard
          title="Conhecimentos Cadastrados"
          value={analytics.totalKnowledge}
          subtitle="Certificações, cursos e formações"
          icon={BookOpen}
          color="green"
          onClick={() => handleCardClick('knowledge')}
          clickable={!!setCurrentPage}
        />

        <StatCard
          title="Taxa de Cobertura"
          value={`${analytics.coverageRate}%`}
          subtitle="Vínculos obtidos vs total"
          icon={Target}
          color="purple"
          onClick={() => handleCardClick('employee-knowledge')}
          clickable={!!setCurrentPage}
        />

        <StatCard
          title="Vencendo em 30 dias"
          value={analytics.expiringCount}
          subtitle="Certificações a renovar"
          icon={Clock}
          color={analytics.expiringCount > 0 ? "orange" : "green"}
          onClick={handleExpiringClick}
          clickable={analytics.expiringCount > 0}
        />
      </div>

      {/* Cards Secundários */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Certificações Obtidas"
          value={analytics.obtainedCertifications}
          subtitle="Colaboradores certificados"
          icon={Award}
          color="green"
        />

        <StatCard
          title="Sem Vínculos"
          value={analytics.employeesWithoutLinks?.length || 0}
          subtitle="Colaboradores sem certificações"
          icon={AlertTriangle}
          color={analytics.employeesWithoutLinks?.length > 0 ? "yellow" : "green"}
          onClick={handleEmployeesWithoutLinksClick}
          clickable={analytics.employeesWithoutLinks?.length > 0}
        />

        <StatCard
          title="Conhecimentos Órfãos"
          value={analytics.knowledgeWithoutLinks?.length || 0}
          subtitle="Sem vínculos com colaboradores"
          icon={BookOpen}
          color={analytics.knowledgeWithoutLinks?.length > 0 ? "yellow" : "green"}
          onClick={handleOrphanedKnowledgeClick}
          clickable={analytics.knowledgeWithoutLinks?.length > 0}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Distribuição por Status (clique nas fatias)">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPie
              data={analytics.statusData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              onClick={(entry, index) => handlePieClick(data, index)}
            >
              {analytics.statusData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </RechartsPie>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Certificações por Equipe">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.teamData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="obtained" fill="#22c55e" name="Obtidas" />
              <Bar dataKey="certifications" fill="#e5e7eb" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Conhecimentos e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PageSection title="Top 5 Conhecimentos Mais Desejados">
          <div className="space-y-3">
            {analytics.topDesiredKnowledge?.length > 0 ? (
              analytics.topDesiredKnowledge.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleKnowledgeClick(item)}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.desired} desejados • {item.obtained} obtidos • {item.required} obrigatórios
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-lg font-bold text-blue-600 mr-2">
                      {item.desired}
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Nenhum conhecimento com vínculos desejados</p>
            )}
          </div>
        </PageSection>

        <AlertCard alerts={analytics.alerts || []} onAlertClick={handleAlertClick} />
      </div>

      {/* Cobertura por Equipe */}
      <PageSection title="Cobertura por Equipe">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Colaboradores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Vínculos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Obtidas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa Cobertura
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.teamData?.map((team) => (
                <tr
                  key={team.fullTeam}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    const teamEmployees = data.employees.filter(emp => emp.equipe === team.fullTeam);
                    setDetailModal({
                      isOpen: true,
                      title: `Equipe: ${team.fullTeam}`,
                      actions: [
                        {
                          label: 'Gerenciar Colaboradores',
                          onClick: () => {
                            setDetailModal({ isOpen: false, title: '', content: null, actions: [] });
                            setCurrentPage && setCurrentPage('employees');
                          }
                        }
                      ],
                      content: (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teamEmployees.map(employee => {
                              const empLinks = data.employeeLinks.filter(link => link.employee_id === employee.id);
                              return (
                                <div key={employee.id} className="bg-gray-50 p-4 rounded-lg">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <Avatar name={employee.nome} size="md" />
                                    <div>
                                      <p className="font-medium text-gray-900">{employee.nome}</p>
                                      <p className="text-sm text-gray-600">{employee.cargo}</p>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500 mb-2">
                                    <p>Vínculos: {empLinks.length}</p>
                                    <p>Obtidos: {empLinks.filter(l => l.status === 'OBTIDO').length}</p>
                                  </div>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    icon={Edit}
                                    className="w-full"
                                    onClick={() => {
                                      setDetailModal({ isOpen: false, title: '', content: null, actions: [] });
                                      setCurrentPage && setCurrentPage('employees');
                                    }}
                                  >
                                    Editar
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )
                    });
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {team.fullTeam}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.employees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.certifications}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.obtained}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 mr-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${team.coverage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{team.coverage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>

      {/* Modal de Detalhes */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, title: '', content: null, actions: [] })}
        title={detailModal.title}
        actions={detailModal.actions}
      >
        {detailModal.content}
      </Modal>
    </PageContainer>
  );
};

export default DashboardPage;
