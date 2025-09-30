// Constantes do sistema administrativo
export const ADMIN_ROLES = {
  ADMIN: 'admin',
  DIRETORIA: 'diretoria',
  GERENTE: 'gerente',
  COLABORADOR: 'colaborador'
};

export const MANAGER_STATUS = {
  ACTIVE: 'active',
  LINKED: 'linked',
  PENDING_USER: 'pending_user',
  INACTIVE: 'inactive'
};

export const PERMISSION_TYPES = {
  ADMIN: ['admin', 'reports', 'user_management', 'system_config'],
  DIRETORIA: ['reports', 'team_management', 'strategic_planning'],
  GERENTE: ['team_management', 'employee_reports', 'performance_tracking'],
  COLABORADOR: ['basic_access', 'profile_management']
};

export const LOCATIONS = {
  SAO_PAULO: 'São Paulo',
  BELO_HORIZONTE: 'Belo Horizonte',
  REMOTE: 'Remoto',
  HYBRID: 'Híbrido'
};

export const COLORS = {
  blue: 'blue',
  green: 'green',
  purple: 'purple',
  orange: 'orange',
  red: 'red',
  gray: 'gray'
};
