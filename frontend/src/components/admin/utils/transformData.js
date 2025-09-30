// ✅ TRANSFORMAÇÕES DE DADOS
export const transformEmployeesToUsers = (employees) => {
  return employees.map(emp => ({
    id: emp.id,
    nome: emp.nome,
    email: emp.email || `${emp.nome.toLowerCase().replace(/\s+/g, '.')}@empresa.com`,
    role: emp.cargo?.toLowerCase().includes('diretor') ? 'diretoria' :
          emp.cargo?.toLowerCase().includes('gerente') ? 'gerente' :
          emp.cargo?.toLowerCase().includes('admin') ? 'admin' : 'colaborador',
    status: Math.random() > 0.5 ? 'online' : 'offline',
    lastAccess: new Date(Date.now() - Math.random() * 86400000),
    permissions: emp.cargo?.toLowerCase().includes('diretor') || emp.cargo?.toLowerCase().includes('admin')
      ? ['all']
      : emp.cargo?.toLowerCase().includes('gerente')
        ? ['dashboard', 'employees', 'reports']
        : ['dashboard'],
    cargo: emp.cargo,
    area: emp.area,
    equipe: emp.equipe
  }));
};

export const calculateAnalytics = (realData, logs, systemHealth, systemConfig) => {
  const users = realData.users || [];
  const recentLogs = logs.filter(l => new Date() - l.timestamp < 3600000);

  return {
    totalUsers: users.length,
    onlineUsers: users.filter(u => u.status === 'online').length,
    adminUsers: users.filter(u => u.role === 'admin' || u.role === 'diretoria').length,
    recentActions: recentLogs.length,
    systemHealth: systemHealth?.online ? 95 : 25,
    storageUsed: systemConfig?.storage?.percentage || 0,
    totalEmployees: realData.employees?.length || 0,
    totalKnowledge: realData.knowledge?.length || 0,
    totalLinks: realData.employeeLinks?.length || 0,
    apiResponseTime: systemHealth?.responseTime || 0
  };
};
