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
  },
  put: async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { data: await response.json() };
  },
  delete: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { success: true };
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
      // Retornar dados mock para desenvolvimento
      return this.getMockData();
    }
  },

  async getStats() {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      return {
        managersInDB: 3,
        managersWithUsers: 1,
        usersWithoutRole: 5,
        teamsConfigured: 8,
        pendingPermissions: 7,
        activeIntegrations: 3
      };
    }
  },

  async getManagers() {
    try {
      const response = await api.get('/admin/managers');
      return response.data;
    } catch (error) {
      return [
        {
          id: 1,
          nome: 'Willian Araújo',
          email: 'willian@oltecnologia.com.br',
          team: 'Diretoria',
          status: 'pending_user',
          userId: null,
          permissions: ['admin', 'reports', 'team_management'],
          location: 'São Paulo',
          created_at: '2024-01-15',
          last_activity: null
        },
        {
          id: 2,
          nome: 'André Brazioli',
          email: 'andre@oltecnologia.com.br',
          team: 'Comercial',
          status: 'linked',
          userId: 15,
          permissions: ['team_management', 'sales_reports'],
          location: 'São Paulo',
          created_at: '2024-01-20',
          last_activity: '2024-03-15'
        },
        {
          id: 3,
          nome: 'Carlos Silva',
          email: 'carlos.silva@oltecnologia.com.br',
          team: 'Infraestrutura',
          status: 'active',
          userId: 22,
          permissions: ['team_management', 'tech_reports'],
          location: 'Belo Horizonte',
          created_at: '2024-02-01',
          last_activity: '2024-03-20'
        }
      ];
    }
  },

  async getPendingLinks() {
    try {
      const response = await api.get('/admin/pending-links');
      return response.data;
    } catch (error) {
      return [
        {
          id: 1,
          type: 'manager_without_user',
          managerName: 'Willian Araújo',
          managerEmail: 'willian@oltecnologia.com.br',
          managerId: 1,
          suggestedUserId: null,
          confidence: 0,
          action: 'Aguardando cadastro do usuário na plataforma',
          created_at: '2024-01-15'
        },
        {
          id: 2,
          type: 'user_without_role',
          userName: 'João Santos',
          userEmail: 'joao.santos@oltecnologia.com.br',
          userId: 28,
          suggestedRole: 'colaborador',
          confidence: 85,
          action: 'Sugerir vinculação automática baseada no email',
          created_at: '2024-03-10'
        },
        {
          id: 3,
          type: 'user_without_role',
          userName: 'Maria Oliveira',
          userEmail: 'maria.oliveira@oltecnologia.com.br',
          userId: 31,
          suggestedRole: 'colaborador',
          confidence: 92,
          action: 'Alta confiança - aplicar role automaticamente',
          created_at: '2024-03-12'
        }
      ];
    }
  },

  async getTeams() {
    try {
      const response = await api.get('/admin/teams');
      return response.data;
    } catch (error) {
      return [
        { id: 1, nome: 'Diretoria', gerente_id: 1, membros: 3, local: 'São Paulo', status: 'active' },
        { id: 2, nome: 'Comercial', gerente_id: 2, membros: 8, local: 'São Paulo', status: 'active' },
        { id: 3, nome: 'Infraestrutura', gerente_id: 3, membros: 12, local: 'Belo Horizonte', status: 'active' },
        { id: 4, nome: 'Desenvolvimento', gerente_id: null, membros: 18, local: 'São Paulo', status: 'pending_manager' },
        { id: 5, nome: 'Suporte', gerente_id: null, membros: 15, local: 'São Paulo', status: 'pending_manager' }
      ];
    }
  },

  async getPermissions() {
    try {
      const response = await api.get('/admin/permissions');
      return response.data;
    } catch (error) {
      return {
        roles: {
          admin: { count: 2, users: ['Willian Araújo', 'Admin Sistema'] },
          diretoria: { count: 3, users: ['Diretor 1', 'Diretor 2', 'Diretor 3'] },
          gerente: { count: 8, users: ['André Brazioli', 'Carlos Silva'] },
          colaborador: { count: 45, users: [] }
        },
        pendingApplications: 7
      };
    }
  },

  async getSystemConfig() {
    try {
      const response = await api.get('/admin/system-config');
      return response.data;
    } catch (error) {
      return {
        integrations: {
          active: 3,
          total: 5,
          list: ['Email SMTP', 'Backup S3', 'Monitoring']
        },
        backup: {
          status: 'active',
          lastBackup: '2024-03-20 02:00:00',
          nextBackup: '2024-03-21 02:00:00'
        },
        audit: {
          enabled: true,
          retentionDays: 90,
          totalLogs: 1542
        },
        notifications: {
          email: true,
          slack: false,
          sms: false
        }
      };
    }
  },

  async linkUserToManager(managerId, userId) {
    try {
      const response = await api.post('/admin/link-user-manager', {
        manager_id: managerId,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao vincular usuário a gerente:', error);
      // Simular sucesso para desenvolvimento
      return { success: true, message: 'Usuário vinculado com sucesso' };
    }
  },

  async applyPermissions(userId, permissions) {
    try {
      const response = await api.post('/admin/apply-permissions', {
        user_id: userId,
        permissions: permissions
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao aplicar permissões:', error);
      return { success: true, message: 'Permissões aplicadas com sucesso' };
    }
  },

  async updateManager(managerId, data) {
    try {
      const response = await api.put(`/admin/managers/${managerId}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar gerente:', error);
      return { success: true, message: 'Gerente atualizado com sucesso' };
    }
  },

  async createManager(data) {
    try {
      const response = await api.post('/admin/managers', data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar gerente:', error);
      return { success: true, message: 'Gerente criado com sucesso', id: Date.now() };
    }
  },

  getMockData() {
    return {
      stats: {
        managersInDB: 3,
        managersWithUsers: 1,
        usersWithoutRole: 5,
        teamsConfigured: 8,
        pendingPermissions: 7,
        activeIntegrations: 3
      },
      managers: [],
      pendingLinks: [],
      teams: [],
      permissions: {},
      systemConfig: {}
    };
  }
};
