import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);

  // ✅ CARREGAR TOKEN SALVO NA INICIALIZAÇÃO
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('gestao360_token');
        const savedUser = localStorage.getItem('gestao360_user');
        const savedOriginalUser = localStorage.getItem('gestao360_original_user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          const userData = JSON.parse(savedUser);
          setUser(userData);

          if (savedOriginalUser) {
            setOriginalUser(JSON.parse(savedOriginalUser));
          } else {
            setOriginalUser(userData);
          }

          setIsAuthenticated(true);
          console.log('✅ Autenticação restaurada do localStorage');
        } else {
          console.log('ℹ️ Nenhum token salvo encontrado');
        }
      } catch (error) {
        console.error('❌ Erro na inicialização da auth:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      console.log('🔐 Tentando login para:', credentials.username);

      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro no login');
      }

      const data = await response.json();

      setToken(data.access_token);
      setUser(data.user);
      setOriginalUser(data.user);
      setIsAuthenticated(true);

      localStorage.setItem('gestao360_token', data.access_token);
      localStorage.setItem('gestao360_user', JSON.stringify(data.user));
      localStorage.setItem('gestao360_original_user', JSON.stringify(data.user));
      if (data.refresh_token) {
        localStorage.setItem('gestao360_refresh_token', data.refresh_token);
      }

      console.log('✅ Login realizado com sucesso');
      return { success: true, user: data.user };

    } catch (error) {
      console.error('❌ Erro no login:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNÇÃO REGISTER (CORRIGIDA)
  const register = async (userData) => {
    setLoading(true);
    try {
      console.log('📝 Tentando registrar usuário:', userData.username);

      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro no registro');
      }

      const data = await response.json();

      console.log('✅ Usuário registrado com sucesso:', data);

      // Após registrar, fazer login automático
      const loginResult = await login({
        username: userData.username,
        password: userData.password
      });

      return loginResult;

    } catch (error) {
      console.error('❌ Erro no registro:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('👋 Realizando logout');
    clearAuthData();
  };

  const clearAuthData = () => {
    setToken(null);
    setUser(null);
    setOriginalUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem('gestao360_token');
    localStorage.removeItem('gestao360_user');
    localStorage.removeItem('gestao360_original_user');
    localStorage.removeItem('gestao360_refresh_token');
  };

  const switchRole = (roleData) => {
    if (!originalUser || originalUser.username !== 'admin') {
      console.warn('⚠️ Switch de role disponível apenas para admin');
      return;
    }

    console.log('🔄 Switching role para:', roleData.name);

    const newUser = {
      ...originalUser,
      permissions: roleData.permissions,
      is_admin: roleData.is_admin,
      current_role: roleData.name,
      role_switched: true
    };

    setUser(newUser);
    localStorage.setItem('gestao360_user', JSON.stringify(newUser));

    console.log('✅ Role alterado para:', roleData.name);
  };

  const resetRole = () => {
    if (originalUser) {
      console.log('🔄 Restaurando role original');
      setUser(originalUser);
      localStorage.setItem('gestao360_user', JSON.stringify(originalUser));
    }
  };

  const getAuthHeaders = () => {
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  };

  const value = {
    // Estados
    user,
    token,
    loading,
    isAuthenticated,
    originalUser,

    // Funções
    login,
    register, // ✅ ADICIONADO
    logout,
    switchRole,
    resetRole,

    // Utilitários
    isAdmin: user?.is_admin || false,
    isDev: originalUser?.username === 'admin',
    isRoleSwitched: user?.role_switched || false,
    hasPermission: (permission) => user?.permissions?.[permission]?.read || false,
    canWrite: (permission) => user?.permissions?.[permission]?.write || false,
    canDelete: (permission) => user?.permissions?.[permission]?.delete || false,
    getAuthHeaders,

    // Informações úteis
    username: user?.username || 'Usuário',
    email: user?.email || '',
    permissions: user?.permissions || {},
    currentRole: user?.current_role || (user?.is_admin ? 'Admin' : 'Usuário')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
