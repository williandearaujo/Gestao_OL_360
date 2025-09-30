// ✅ UTILITIES PARA USUÁRIOS
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

export const calculateAnalytics = (realData, logs, systemHealth) => {
  const users = realData.users || [];
  const recentLogs = logs.filter(l => new Date() - l.timestamp < 3600000);

  return {
    totalUsers: users.length,
    onlineUsers: users.filter(u => u.status === 'online').length,
    adminUsers: users.filter(u => u.role === 'admin' || u.role === 'diretoria').length,
    recentActions: recentLogs.length,
    systemHealth: systemHealth?.online ? 95 : 25,
    totalEmployees: realData.employees?.length || 0,
    totalKnowledge: realData.knowledge?.length || 0,
    totalLinks: realData.employeeLinks?.length || 0,
    apiResponseTime: systemHealth?.responseTime || 0
  };
};

export const getRoleColor = (role) => {
  const colors = {
    admin: 'bg-purple-100 text-purple-800',
    diretoria: 'bg-blue-100 text-blue-800',
    gerente: 'bg-green-100 text-green-800',
    colaborador: 'bg-gray-100 text-gray-800'
  };
  return colors[role] || colors.colaborador;
};

export const getPermissions = (role) => {
  const permissions = {
    admin: ['Acesso Total', 'Gestão de Usuários', 'Configurações', 'Relatórios', 'Auditoria'],
    diretoria: ['Dashboard', 'Relatórios', 'Gestão de Usuários', 'Visualizações Executivas'],
    gerente: ['Dashboard', 'Gestão de Colaboradores', 'Relatórios de Equipe'],
    colaborador: ['Dashboard', 'Visualização Básica']
  };
  return permissions[role] || permissions.colaborador;
};

export const filterUsers = (users, filters) => {
  return users.filter(user => {
    const matchesSearch = !filters.search ||
      user.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.cargo?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus = !filters.status || user.status === filters.status;

    return matchesSearch && matchesRole && matchesStatus;
  });
};
