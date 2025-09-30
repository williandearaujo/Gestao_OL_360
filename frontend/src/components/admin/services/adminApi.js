// ✅ API SERVICE COMPLETO
const API_BASE_URL = 'http://localhost:8000';

export const adminApi = {
  get: async (url) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`❌ API Error: ${url}`, error);
      return [];
    }
  },

  ping: async () => {
    try {
      const start = Date.now();
      const response = await fetch(`${API_BASE_URL}/employees`);
      const end = Date.now();
      return {
        online: response.ok,
        responseTime: end - start,
        status: response.status
      };
    } catch (error) {
      return {
        online: false,
        responseTime: 0,
        status: 0,
        error: error.message
      };
    }
  },

  loadAllData: async () => {
    try {
      console.log('🔄 Carregando dados reais da API...');

      const [employees, knowledge, employeeLinks] = await Promise.all([
        adminApi.get('/employees'),
        adminApi.get('/knowledge'),
        adminApi.get('/employee-knowledge')
      ]);

      return {
        employees: employees || [],
        knowledge: knowledge || [],
        employeeLinks: employeeLinks || []
      };
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      return {
        employees: [],
        knowledge: [],
        employeeLinks: []
      };
    }
  }
};
