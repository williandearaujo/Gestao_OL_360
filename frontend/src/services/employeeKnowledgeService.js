// src/services/employeeKnowledgeService.js

// ❌ REMOVER: import { api } from './api.js';
// ✅ ADICIONAR API INLINE:

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
    return { data: await response.json() };
  }
};

export const employeeKnowledgeService = {
  // Listar todos os vínculos employee-knowledge
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.employee_id) {
        params.append('employee_id', filters.employee_id);
      }
      if (filters.knowledge_id) {
        params.append('knowledge_id', filters.knowledge_id);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.skip) {
        params.append('skip', filters.skip);
      }
      if (filters.limit) {
        params.append('limit', filters.limit);
      }

      const url = `/employee-knowledge${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('🔍 Buscando vínculos:', url);

      const response = await api.get(url);
      console.log('✅ Vínculos recebidos:', response.data?.length || 0);

      return response.data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar vínculos:', error);
      throw error;
    }
  },

  // Criar novo vínculo employee-knowledge
  async create(data) {
    try {
      console.log('🔥 Criando vínculo:', data);

      // Validar dados obrigatórios
      if (!data.employee_id) {
        throw new Error('employee_id é obrigatório');
      }
      if (!data.learning_item_id && !data.knowledge_id) {
        throw new Error('learning_item_id ou knowledge_id é obrigatório');
      }
      if (!data.status) {
        data.status = 'DESEJADO'; // Default
      }

      // Mapear knowledge_id para learning_item_id se necessário
      if (data.knowledge_id && !data.learning_item_id) {
        data.learning_item_id = data.knowledge_id;
        delete data.knowledge_id;
      }

      const response = await api.post('/employee-knowledge', data);
      console.log('✅ Vínculo criado:', response.data);

      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar vínculo:', error);
      throw error;
    }
  },

  // Atualizar vínculo existente
  async update(id, data) {
    try {
      console.log('🔧 Atualizando vínculo:', id, data);

      // Mapear knowledge_id para learning_item_id se necessário
      if (data.knowledge_id && !data.learning_item_id) {
        data.learning_item_id = data.knowledge_id;
        delete data.knowledge_id;
      }

      const response = await api.put(`/employee-knowledge/${id}`, data);
      console.log('✅ Vínculo atualizado:', response.data);

      return response.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar vínculo:', error);
      throw error;
    }
  },

  // Deletar vínculo
  async delete(id) {
    try {
      console.log('🗑️ Deletando vínculo:', id);

      const response = await api.delete(`/employee-knowledge/${id}`);
      console.log('✅ Vínculo deletado:', response.data);

      return response.data;
    } catch (error) {
      console.error('❌ Erro ao deletar vínculo:', error);
      throw error;
    }
  },

  // Obter estatísticas
  async getStats() {
    try {
      console.log('📊 Buscando estatísticas...');

      const response = await api.get('/employee-knowledge/stats');
      console.log('✅ Estatísticas recebidas:', response.data);

      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw error;
    }
  },

  // Obter vínculos por colaborador
  async getByEmployee(employeeId) {
    try {
      console.log('👤 Buscando vínculos do colaborador:', employeeId);

      return await this.getAll({ employee_id: employeeId });
    } catch (error) {
      console.error('❌ Erro ao buscar vínculos do colaborador:', error);
      throw error;
    }
  },

  // Obter vínculos por conhecimento
  async getByKnowledge(knowledgeId) {
    try {
      console.log('📚 Buscando vínculos do conhecimento:', knowledgeId);

      return await this.getAll({ knowledge_id: knowledgeId });
    } catch (error) {
      console.error('❌ Erro ao buscar vínculos do conhecimento:', error);
      throw error;
    }
  },

  // Obter vínculos por status
  async getByStatus(status) {
    try {
      console.log('📊 Buscando vínculos com status:', status);

      return await this.getAll({ status });
    } catch (error) {
      console.error('❌ Erro ao buscar vínculos por status:', error);
      throw error;
    }
  }
};
