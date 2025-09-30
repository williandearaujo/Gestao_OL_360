import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, loginComponent, fallbackMode = true }) => {
  const { isAuthenticated, loading } = useAuth();

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  // ✅ FUNÇÃO PARA MOSTRAR LOGIN
  const showLogin = () => {
    console.log('🔐 Exibindo tela de login');
    return loginComponent;
  };

  // ✅ DETECTAR CLIQUE DO BOTÃO LOGIN
  const handleLoginRequest = () => {
    console.log('🔐 Solicitar login clicado');
    if (!isAuthenticated) {
      return showLogin();
    }
    return children;
  };

  // ✅ VERIFICAR SE É SOLICITAÇÃO DE LOGIN
  React.useEffect(() => {
    // Escutar eventos de solicitação de login
    const handleLoginButtonClick = (event) => {
      if (event.detail && event.detail.action === 'request-login') {
        console.log('🔐 Solicitar login via evento');
        // Forçar remontagem do componente para mostrar login
        window.location.reload();
      }
    };

    window.addEventListener('login-requested', handleLoginButtonClick);

    return () => {
      window.removeEventListener('login-requested', handleLoginButtonClick);
    };
  }, []);

  // ✅ MODO FALLBACK - PERMITE ACESSO MAS COM BOTÃO LOGIN
  if (fallbackMode) {
    console.log('🔄 Modo fallback ativo - Acesso permitido sem login');

    // Se não autenticado, adicionar botão de login flutuante
    if (!isAuthenticated) {
      return (
        <div className="relative">
          {children}

          {/* ✅ BOTÃO LOGIN FLUTUANTE */}
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={() => {
                console.log('🔐 Botão login clicado - Exibindo tela de login');
                // Usar um state para controlar a exibição do login
                window.dispatchEvent(new CustomEvent('show-login-modal', { detail: { show: true } }));
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Login</span>
            </button>
          </div>

          {/* ✅ MODAL DE LOGIN */}
          <LoginModal />
        </div>
      );
    }

    return children;
  }

  // ✅ MODO RESTRITO - SÓ PERMITE SE AUTENTICADO
  console.log('🔒 Modo restrito - Login obrigatório');
  return isAuthenticated ? children : loginComponent;
};

// ✅ COMPONENTE MODAL DE LOGIN
const LoginModal = () => {
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    const handleShowLogin = () => {
      console.log('🔐 Exibindo modal de login');
      setShowModal(true);
    };

    window.addEventListener('show-login-modal', handleShowLogin);

    return () => {
      window.removeEventListener('show-login-modal', handleShowLogin);
    };
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg max-w-md w-full mx-4">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        <div className="p-6">
          {/* Aqui será renderizado o componente Login */}
          <LoginForm onClose={() => setShowModal(false)} />
        </div>
      </div>
    </div>
  );
};

// ✅ FORMULÁRIO DE LOGIN SIMPLIFICADO
const LoginForm = ({ onClose }) => {
  const { login } = useAuth();
  const [credentials, setCredentials] = React.useState({
    username: 'admin',
    password: 'admin123'
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(credentials);
      if (result.success) {
        console.log('✅ Login realizado com sucesso');
        onClose();
        // Recarregar a página para atualizar o estado
        window.location.reload();
      } else {
        setError(result.error || 'Erro no login');
      }
    } catch (error) {
      setError('Erro inesperado no login');
      console.error('❌ Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-center mb-4">Login</h2>

      <div>
        <input
          type="text"
          placeholder="Usuário"
          value={credentials.username}
          onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Senha"
          value={credentials.password}
          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50 transition-colors"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      <div className="text-center text-sm text-gray-600">
        <p><strong>Padrão:</strong> admin / admin123</p>
      </div>
    </form>
  );
};

export default ProtectedRoute;
