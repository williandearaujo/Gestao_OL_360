import api from './api';

export const teamsService = {
  async getAll() {
    try {
      const response = await api.get('/teams');
      return response.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/teams/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching team:', error);
      throw error;
    }
  },

  async create(teamData) {
    try {
      const response = await api.post('/teams', teamData);
      return response.data;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  },

  async update(id, teamData) {
    try {
      const response = await api.put(`/teams/${id}`, teamData);
      return response.data;
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/teams/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }
};
