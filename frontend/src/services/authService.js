import api from './api';

export const authService = {
  // Login
  async login(username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Salvar token no localStorage
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('access_token');
  },

  // Verificar se está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  // Obter usuário atual
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
