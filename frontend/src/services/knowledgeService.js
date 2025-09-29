import api from './api';

export const knowledgeService = {
  async getAll() {
    try {
      const response = await api.get('/knowledge'); // ✅ CORRETO
      return response.data;
    } catch (error) {
      console.error('Error fetching knowledge:', error);
      throw error;
    }
  },

  async create(knowledgeData) {
    try {
      console.log('🔥 Creating knowledge:', knowledgeData); // DEBUG
      const response = await api.post('/knowledge', knowledgeData); // ✅ CORRETO
      return response.data;
    } catch (error) {
      console.error('Error creating knowledge:', error);
      throw error;
    }
  },

  async update(id, knowledgeData) {
    try {
      const response = await api.put(`/knowledge/${id}`, knowledgeData);
      return response.data;
    } catch (error) {
      console.error('Error updating knowledge:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/knowledge/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting knowledge:', error);
      throw error;
    }
  }
};
