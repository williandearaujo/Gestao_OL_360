import api from './api';

export const employeesService = {
  async getAll() {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  },

  async create(employeeData) {
    try {
      const response = await api.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  async update(id, employeeData) {
    try {
      console.log('🔧 Updating employee:', id, employeeData);
      const response = await api.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  // ✅ Soft delete - Inativar
  async inactivate(id) {
    try {
      console.log('🟡 Inativando funcionário:', id);
      const response = await api.put(`/employees/${id}/inactivate`);
      return response.data;
    } catch (error) {
      console.error('Error inactivating employee:', error);
      throw error;
    }
  },

  // ✅ Hard delete - Deletar permanente
  async delete(id) {
    try {
      console.log('🔴 Deletando funcionário:', id);
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }
};


