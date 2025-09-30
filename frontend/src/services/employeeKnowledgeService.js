const API_BASE_URL = 'http://localhost:8000';

class EmployeeKnowledgeService {
  async get(url) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`❌ API Error GET: ${url}`, error);
      return [];
    }
  }

  async post(url, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`❌ API Error POST: ${url}`, error);
      throw error;
    }
  }

  async put(url, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`❌ API Error PUT: ${url}`, error);
      throw error;
    }
  }

  async delete(url) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`❌ API Error DELETE: ${url}`, error);
      throw error;
    }
  }

  // ✅ MÉTODOS ESPECÍFICOS
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const url = `/employee-knowledge${params.toString() ? `?${params}` : ''}`;
    return this.get(url);
  }

  async getById(id) {
    return this.get(`/employee-knowledge/${id}`);
  }

  async create(data) {
    return this.post('/employee-knowledge', data);
  }

  async update(id, data) {
    return this.put(`/employee-knowledge/${id}`, data);
  }

  async remove(id) {
    return this.delete(`/employee-knowledge/${id}`);
  }

  async getStats() {
    const links = await this.getAll();

    if (!Array.isArray(links)) return { total: 0, por_status: {} };

    const total = links.length;
    const obtidos = links.filter(l => l.status === 'OBTIDO').length;
    const desejados = links.filter(l => l.status === 'DESEJADO').length;
    const obrigatorios = links.filter(l => l.status === 'OBRIGATORIO').length;

    return {
      total,
      por_status: {
        obtidos,
        desejados,
        obrigatorios
      }
    };
  }

  async getEmployees() {
    return this.get('/employees');
  }

  async getKnowledge() {
    return this.get('/knowledge');
  }
}

export const employeeKnowledgeService = new EmployeeKnowledgeService();
export default employeeKnowledgeService;
