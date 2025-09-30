import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

export const useAdminData = () => {
  const [loading, setLoading] = useState(true);

  // Estados para dados reais
  const [areas, setAreas] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [logs, setLogs] = useState([]);
  const [systemHealth, setSystemHealth] = useState({ online: false });
  const [analytics, setAnalytics] = useState({
    onlineUsers: 0,
    recentActions: 0,
    totalEmployees: 0,
    totalAreas: 0,
    totalTeams: 0
  });

  // ✅ FUNÇÃO PARA BUSCAR DADOS DAS APIS
  const fetchData = async () => {
    try {
      setLoading(true);

      // Buscar dados em paralelo
      const [
        areasRes,
        teamsRes,
        employeesRes,
        managersRes,
        knowledgeRes,
        statsRes,
        healthRes
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/areas`).then(r => r.json()),
        fetch(`${API_BASE_URL}/teams`).then(r => r.json()),
        fetch(`${API_BASE_URL}/employees`).then(r => r.json()),
        fetch(`${API_BASE_URL}/managers`).then(r => r.json()),
        fetch(`${API_BASE_URL}/knowledge`).then(r => r.json()),
        fetch(`${API_BASE_URL}/admin/stats`).then(r => r.json()),
        fetch(`${API_BASE_URL}/admin/health`).then(r => r.json())
      ]);

      // Atualizar estados com dados reais
      setAreas(Array.isArray(areasRes) ? areasRes : []);
      setTeams(Array.isArray(teamsRes) ? teamsRes : []);
      setEmployees(Array.isArray(employeesRes) ? employeesRes : []);
      setManagers(Array.isArray(managersRes) ? managersRes : []);
      setKnowledge(Array.isArray(knowledgeRes) ? knowledgeRes : []);

      // Mapear managers para users (compatibilidade)
      setUsers(Array.isArray(managersRes) ? managersRes.map(manager => ({
        id: manager.id,
        nome: manager.nome,
        email: manager.email,
        role: 'gerente',
        ativo: manager.ativo,
        ultimo_login: new Date().toISOString(),
        created_at: manager.created_at
      })) : []);

      // Analytics dos dados reais
      if (statsRes && !statsRes.error) {
        setAnalytics({
          onlineUsers: statsRes.employees?.active || 0,
          recentActions: statsRes.employee_knowledge?.total || 0,
          totalEmployees: statsRes.employees?.total || 0,
          totalAreas: statsRes.areas?.total || 0,
          totalTeams: statsRes.teams?.total || 0,
          totalManagers: statsRes.managers?.total || 0,
          totalKnowledge: statsRes.knowledge?.total || 0,
          completionRate: statsRes.summary?.completion_rate || 0
        });
      }

      // System health
      if (healthRes && !healthRes.error) {
        setSystemHealth({
          online: healthRes.status === 'online',
          database: healthRes.database,
          responseTime: healthRes.response_time,
          version: healthRes.version
        });
      }

      console.log('✅ Dados carregados do backend:', {
        areas: areasRes?.length || 0,
        teams: teamsRes?.length || 0,
        employees: employeesRes?.length || 0,
        managers: managersRes?.length || 0
      });

    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);

      // Fallback em caso de erro
      setSystemHealth({ online: false, error: error.message });
      setAnalytics({
        onlineUsers: 0,
        recentActions: 0,
        totalEmployees: 0,
        totalAreas: 0,
        totalTeams: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNÇÃO PARA ATUALIZAR ÁREAS
  const updateAreas = async (newAreas) => {
    setAreas(newAreas);
    // Recarregar analytics após mudança
    await refreshData();
  };

  // ✅ FUNÇÃO PARA ATUALIZAR EQUIPES
  const updateTeams = async (newTeams) => {
    setTeams(newTeams);
    // Recarregar analytics após mudança
    await refreshData();
  };

  // ✅ FUNÇÃO PARA ATUALIZAR USUÁRIOS
  const updateUsers = async (newUsers) => {
    setUsers(newUsers);
    await refreshData();
  };

  // ✅ FUNÇÃO PARA RECARREGAR DADOS
  const refreshData = async () => {
    await fetchData();
  };

  // ✅ FUNÇÃO PARA RECARREGAR LOGS
  const refreshLogs = () => {
    // Por enquanto, logs podem ser localStorage
    const saved = localStorage.getItem('ol_audit_logs');
    setLogs(saved ? JSON.parse(saved) : []);
  };

  // ✅ CARREGAR DADOS NA INICIALIZAÇÃO
  useEffect(() => {
    fetchData();
    refreshLogs();
  }, []);

  const realData = {
    users,
    employees,
    areas,
    teams,
    managers,
    knowledge,
    employeeLinks: [] // Por enquanto vazio
  };

  return {
    loading,
    systemHealth,
    realData,
    logs,
    analytics,
    refreshData,
    updateUsers,
    updateAreas,    // ✅ NOVA FUNÇÃO
    updateTeams,    // ✅ NOVA FUNÇÃO
    refreshLogs
  };
};
