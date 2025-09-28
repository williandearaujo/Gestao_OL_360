// Utilitários gerais para funcionários
export const formatCPF = (cpf) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatPhone = (phone) => {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

export const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export const calculateWorkMonths = (admissionDate) => {
  const today = new Date();
  const admission = new Date(admissionDate);
  return Math.floor((today - admission) / (1000 * 60 * 60 * 24 * 30.44));
};

export const getStatusColor = (status) => {
  const colors = {
    'ATIVO': 'bg-ol-brand-100 text-ol-brand-700',
    'FERIAS': 'bg-yellow-100 text-yellow-700',
    'LICENCA': 'bg-blue-100 text-blue-700',
    'INATIVO': 'bg-red-100 text-red-700'
  };
  return colors[status] || 'bg-ol-gray-100 text-ol-gray-700';
};

export const getNivelColor = (nivel) => {
  const colors = {
    'SENIOR': 'bg-ol-brand-100 text-ol-brand-700',
    'PLENO': 'bg-ol-brand-100 text-ol-brand-700',
    'JUNIOR': 'bg-ol-gray-100 text-ol-gray-700',
    'ESTAGIARIO': 'bg-ol-gray-100 text-ol-gray-700',
    'COORDENADOR': 'bg-purple-100 text-purple-700',
    'GERENTE': 'bg-purple-100 text-purple-700'
  };
  return colors[nivel] || 'bg-ol-gray-100 text-ol-gray-700';
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.length === 11;
};

export const filterEmployees = (employees, filters) => {
  return employees.filter(emp => {
    const matchesSearch = !filters.search || 
      emp.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
      emp.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      emp.cargo.toLowerCase().includes(filters.search.toLowerCase());
    const matchesEquipe = !filters.equipe || emp.equipe === filters.equipe;
    const matchesNivel = !filters.nivel || emp.nivel === filters.nivel;
    const matchesStatus = !filters.status || emp.status === filters.status;
    return matchesSearch && matchesEquipe && matchesNivel && matchesStatus;
  });
};
