import api from './api';

export const managersService = {
  async getAll() {
    try {
      const response = await api.get('/managers');
      return response.data;
    } catch (error) {
      console.error('Error fetching managers:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/managers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching manager:', error);
      throw error;
    }
  },

  async create(managerData) {
    try {
      const response = await api.post('/managers', managerData);
      return response.data;
    } catch (error) {
      console.error('Error creating manager:', error);
      throw error;
    }
  },

  async update(id, managerData) {
    try {
      const response = await api.put(`/managers/${id}`, managerData);
      return response.data;
    } catch (error) {
      console.error('Error updating manager:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/managers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting manager:', error);
      throw error;
    }
  }
};
