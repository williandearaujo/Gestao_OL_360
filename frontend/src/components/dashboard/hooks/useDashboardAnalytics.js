import { useMemo } from 'react';

export const useDashboardAnalytics = (data) => {
  return useMemo(() => {
    const { knowledge, employees, employeeLinks } = data;

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
  }, [data]);
};
