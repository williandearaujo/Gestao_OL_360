import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

// Provider do contexto
export const AuthProvider = ({ children }) => {
  // Usuário simulado - você pode trocar aqui para testar diferentes perfis
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    nome: "Carlos Silva",
    access_level: "ADMIN", // ADMIN, DIRETORIA, GERENTE, COLABORADOR
    manager_id: null,
    equipe: "Red Team",
    cargo: "Gerente de Segurança"
  });

  // Lista de usuários disponíveis para teste
  const availableUsers = [
    {
      id: 1,
      nome: "Carlos Admin",
      access_level: "ADMIN",
      manager_id: null,
      equipe: "TI",
      cargo: "Administrador do Sistema"
    },
    {
      id: 2,
      nome: "Maria Diretora",
      access_level: "DIRETORIA",
      manager_id: null,
      equipe: "Diretoria",
      cargo: "Diretora de Tecnologia"
    },
    {
      id: 3,
      nome: "João Gerente",
      access_level: "GERENTE",
      manager_id: 2,
      equipe: "Red Team",
      cargo: "Gerente de Segurança"
    },
    {
      id: 4,
      nome: "Ana Colaboradora",
      access_level: "COLABORADOR",
      manager_id: 3,
      equipe: "Red Team",
      cargo: "Analista Sênior"
    }
  ];

  // Função para trocar usuário (para testes)
  const switchUser = (userId) => {
    const user = availableUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // Funções de permissão
  const permissions = {
    // ADMIN: Tudo relacionado a sistema
    canManageUsers: () => currentUser.access_level === 'ADMIN',
    canManageKnowledge: () => ['ADMIN', 'DIRETORIA'].includes(currentUser.access_level),
    
    // DIRETORIA: Ve tudo de todos
    canViewAllEmployees: () => ['ADMIN', 'DIRETORIA'].includes(currentUser.access_level),
    canViewSalary: (employee) => {
      if (['ADMIN', 'DIRETORIA'].includes(currentUser.access_level)) return true;
      if (currentUser.access_level === 'GERENTE') {
        return employee.manager_id === currentUser.id; // Só da sua equipe
      }
      return employee.id === currentUser.id; // Só o próprio
    },
    
    // GERENTE: Ve sua equipe + dados limitados dos outros
    canViewPDI: (employee) => {
      if (['ADMIN', 'DIRETORIA'].includes(currentUser.access_level)) return true;
      if (currentUser.access_level === 'GERENTE') {
        return employee.manager_id === currentUser.id; // Só da sua equipe
      }
      return employee.id === currentUser.id; // Só o próprio
    },
    
    canViewMeetings: (employee) => {
      if (['ADMIN', 'DIRETORIA'].includes(currentUser.access_level)) return true;
      if (currentUser.access_level === 'GERENTE') {
        return employee.manager_id === currentUser.id; // Só da sua equipe
      }
      return employee.id === currentUser.id; // Só o próprio
    },
    
    // Permissões gerais
    canEditEmployee: (employee) => {
      if (['ADMIN', 'DIRETORIA'].includes(currentUser.access_level)) return true;
      if (currentUser.access_level === 'GERENTE') {
        return employee.manager_id === currentUser.id;
      }
      return false;
    },
    
    canDeleteEmployee: () => ['ADMIN', 'DIRETORIA'].includes(currentUser.access_level),
    
    canAddEmployee: () => ['ADMIN', 'DIRETORIA', 'GERENTE'].includes(currentUser.access_level)
  };

  const value = {
    currentUser,
    availableUsers,
    switchUser,
    permissions,
    isAdmin: () => currentUser.access_level === 'ADMIN',
    isDiretoria: () => currentUser.access_level === 'DIRETORIA',
    isGerente: () => currentUser.access_level === 'GERENTE',
    isColaborador: () => currentUser.access_level === 'COLABORADOR'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
