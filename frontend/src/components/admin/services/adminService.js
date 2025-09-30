const API_BASE_URL = 'http://localhost:8000';

const api = {
  get: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { data: await response.json() };
  },
  post: async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { data: await response.json() };
  }
};

export const adminService = {
  async getAllData() {
    try {
      const [stats, managers, pendingLinks, teams, permissions, systemConfig] = await Promise.all([
        this.getStats(),
        this.getManagers(),
        this.getPendingLinks(),
        this.getTeams(),
        this.getPermissions(),
        this.getSystemConfig()
      ]);

      return {
        stats,
        managers,
        pendingLinks,
        teams,
        permissions,
        systemConfig
      };
    } catch (error) {
      console.error('❌ Erro ao carregar dados administrativos:', error);
      throw error;
    }
  },

  async getStats() {
    // Implementar chamada API
    return {
      managersInDB: 3,
      managersWithUsers: 1,
      usersWithoutRole: 5,
      teamsConfigured: 8,
      pendingPermissions: 7,
      activeIntegrations: 3
    };
  },

  async getManagers() {
    // Implementar chamada API
    return [
      {
        id: 1,
        nome: 'Willian Araújo',
        email: 'willian@oltecnologia.com.br',
        team: 'Diretoria',
        status: 'pending_user',
        userId: null,
        permissions: ['admin', 'reports', 'team_management'],
        location: 'São Paulo'
      }
      // ... outros gerentes
    ];
  },

  // ... outras funções API
};
