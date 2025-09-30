-- ============================================================================
-- OL 360 - MIGRATION COMPLETA V2.0 COM GESTAO TOTAL
-- ============================================================================

-- REMOVER TABELAS EXISTENTES
DROP TABLE IF EXISTS system_notifications;
DROP TABLE IF EXISTS system_reports;
DROP TABLE IF EXISTS system_logs;
DROP TABLE IF EXISTS system_settings;
DROP TABLE IF EXISTS employee_knowledge;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS managers;
DROP TABLE IF EXISTS areas;
DROP TABLE IF EXISTS knowledge;

-- CRIAR TABELAS NA ORDEM CORRETA

-- TABELA AREAS
CREATE TABLE areas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    sigla VARCHAR(10) NOT NULL UNIQUE,
    descricao TEXT,
    cor VARCHAR(7) DEFAULT '#3B82F6',
    ativa BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA TEAMS
CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    cor VARCHAR(7) DEFAULT '#3B82F6',
    area_id INTEGER NOT NULL,
    ativo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (area_id) REFERENCES areas(id)
);

-- TABELA MANAGERS
CREATE TABLE managers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    nivel_hierarquico VARCHAR(50),
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA EMPLOYEES COM TODOS OS CAMPOS DE GESTAO
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14) UNIQUE NOT NULL,
    rg VARCHAR(15),
    data_nascimento DATE NOT NULL,
    estado_civil VARCHAR(20) DEFAULT 'SOLTEIRO',
    cargo VARCHAR(100) NOT NULL,
    equipe VARCHAR(100),
    nivel VARCHAR(20) DEFAULT 'JUNIOR',
    status VARCHAR(20) DEFAULT 'ATIVO',
    data_admissao DATE NOT NULL,
    salario DECIMAL(10,2),
    team_id INTEGER,
    manager_id INTEGER,
    area_id INTEGER,
    endereco TEXT,
    competencias TEXT,
    avatar TEXT,
    access_level VARCHAR(20) DEFAULT 'COLABORADOR',
    -- CAMPOS JSON PARA GESTAO
    ferias TEXT DEFAULT '{}',
    dayoff TEXT DEFAULT '{}',
    pdi TEXT DEFAULT '{}',
    reunioes_1x1 TEXT DEFAULT '{}',
    -- CAMPOS ADMINISTRATIVOS NOVOS
    observacoes TEXT DEFAULT '',
    notas_admin TEXT DEFAULT '',
    historico_alteracoes TEXT DEFAULT '[]',
    log_sistema TEXT DEFAULT '[]',
    data_ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_ultima_atualizacao VARCHAR(100) DEFAULT 'Sistema',
    aprovado_por VARCHAR(100) DEFAULT NULL,
    data_aprovacao TIMESTAMP DEFAULT NULL,
    status_aprovacao VARCHAR(20) DEFAULT 'APROVADO',
    relatorios_gerados TEXT DEFAULT '[]',
    alertas_ativos TEXT DEFAULT '[]',
    configuracoes_usuario TEXT DEFAULT '{}',
    ferias_detalhes TEXT DEFAULT '{}',
    dayoff_detalhes TEXT DEFAULT '{}',
    pdi_detalhes TEXT DEFAULT '{}',
    reunioes_detalhes TEXT DEFAULT '{}',
    historico_completo TEXT DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (manager_id) REFERENCES managers(id),
    FOREIGN KEY (area_id) REFERENCES areas(id)
);

-- TABELA KNOWLEDGE
CREATE TABLE knowledge (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) DEFAULT 'CURSO',
    categoria VARCHAR(100),
    codigo VARCHAR(50),
    fornecedor VARCHAR(100),
    validade_anos INTEGER,
    nivel_formacao VARCHAR(50),
    link TEXT,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA EMPLOYEE_KNOWLEDGE
CREATE TABLE employee_knowledge (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    learning_item_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'DESEJADO',
    prioridade VARCHAR(20) DEFAULT 'MEDIA',
    data_alvo DATE,
    data_obtencao DATE,
    data_expiracao DATE,
    anexo_path TEXT,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (learning_item_id) REFERENCES knowledge(id),
    UNIQUE(employee_id, learning_item_id)
);

-- TABELA DE LOGS DO SISTEMA
CREATE TABLE system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    action_description TEXT NOT NULL,
    old_data TEXT DEFAULT NULL,
    new_data TEXT DEFAULT NULL,
    user_who_made_change VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    metadata TEXT DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- TABELA DE CONFIGURACOES
CREATE TABLE system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_name VARCHAR(100) NOT NULL UNIQUE,
    key_value TEXT NOT NULL,
    key_type VARCHAR(20) DEFAULT 'string',
    description TEXT DEFAULT NULL,
    category VARCHAR(50) DEFAULT 'geral',
    editable BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA DE NOTIFICACOES
CREATE TABLE system_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER DEFAULT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'NORMAL',
    read_status BOOLEAN DEFAULT 0,
    action_url TEXT DEFAULT NULL,
    metadata TEXT DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- TABELA DE RELATORIOS
CREATE TABLE system_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_name VARCHAR(100) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    report_config TEXT NOT NULL,
    generated_by VARCHAR(100) NOT NULL,
    generated_for VARCHAR(100) DEFAULT NULL,
    file_path TEXT DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP DEFAULT NULL
);

-- INDICES PARA PERFORMANCE
CREATE INDEX idx_system_logs_employee ON system_logs(employee_id);
CREATE INDEX idx_system_logs_action_type ON system_logs(action_type);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX idx_notifications_employee ON system_notifications(employee_id);
CREATE INDEX idx_notifications_type ON system_notifications(notification_type);
CREATE INDEX idx_notifications_read ON system_notifications(read_status);

-- INSERIR DADOS...
-- [Seus dados atuais de INSERT aqui - areas, teams, managers, employees, etc]
-- [Use os mesmos INSERTs que já funcionavam]

SELECT 'MIGRACAO COMPLETA OL360 V2.0 - TODOS OS CAMPOS CRIADOS!' as status;
