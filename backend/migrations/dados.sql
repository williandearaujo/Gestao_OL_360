-- ============================================================================
-- OL 360 - DADOS COMPLETOS LIMPOS V2.0
-- ============================================================================

-- PRIMEIRO: CRIAR TABELA areas QUE FALTAVA
CREATE TABLE areas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    sigla VARCHAR(10) NOT NULL UNIQUE,
    descricao TEXT,
    cor VARCHAR(7) DEFAULT '#3B82F6',
    ativa BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERIR DADOS NAS TABELAS (na ordem correta)

-- 1. AREAS PRIMEIRO
INSERT INTO areas (id, nome, sigla, descricao, cor, ativa, created_at) VALUES
(1, 'Diretoria', 'DIR', 'Diretoria executiva e estratégica', '#1F2937', 1, datetime('now')),
(2, 'Tecnologia da Informação', 'TI', 'Desenvolvimento, infraestrutura e operações de TI', '#3B82F6', 1, datetime('now')),
(3, 'Segurança da Informação', 'SEC', 'Segurança cibernética e compliance', '#EF4444', 1, datetime('now')),
(4, 'Redes e Infraestrutura', 'INFRA', 'Infraestrutura de redes e sistemas', '#10B981', 1, datetime('now'));

-- 2. TEAMS SEGUNDO
INSERT INTO teams (id, nome, descricao, cor, area_id, ativo, created_at) VALUES
(1, 'Diretoria Executiva', 'Alta liderança e decisões estratégicas', '#1F2937', 1, 1, datetime('now')),
(2, 'Gerência de TI', 'Gestão e coordenação de tecnologia', '#6366F1', 2, 1, datetime('now')),
(3, 'N3 - Segurança', 'Analistas seniores de segurança da informação', '#F59E0B', 3, 1, datetime('now')),
(4, 'N3 - Redes', 'Analistas seniores de redes e infraestrutura', '#10B981', 4, 1, datetime('now')),
(5, 'N2 - Redes', 'Analistas plenos de redes e infraestrutura', '#8B5CF6', 4, 1, datetime('now'));

-- 3. MANAGERS TERCEIRO
INSERT INTO managers (id, nome, email, cargo, nivel_hierarquico, telefone, ativo, created_at) VALUES
(1, 'Sergio Cavalcante', 'sergio.cavalcante@ol360.com', 'CEO/Fundador', 'CEO', '(11) 99999-0000', 1, datetime('now')),
(2, 'André Brazioli', 'andre.brazioli@ol360.com', 'Diretor Técnico', 'DIRETOR', '(11) 99999-0001', 1, datetime('now')),
(3, 'Willian Araujo', 'willian.araujo@ol360.com', 'Gerente de Operações de TI', 'GERENTE', '(11) 99999-0002', 1, datetime('now')),
(4, 'Rogério Pegorario', 'rogerio.pegorario@ol360.com', 'Gerente de Operações de TI', 'GERENTE', '(11) 99999-0003', 1, datetime('now'));

-- 4. EMPLOYEES QUARTO
INSERT INTO employees (nome, email, telefone, cpf, data_nascimento, estado_civil, cargo, equipe, nivel, status, data_admissao, salario, team_id, manager_id, area_id, endereco, competencias, ferias, dayoff, pdi, reunioes_1x1, observacoes, created_at) VALUES

('Sergio Cavalcante', 'sergio.cavalcante@ol360.com', '(11) 99999-0000', '11111111111', '1975-03-15', 'CASADO', 'CEO/Fundador', 'Diretoria Executiva', 'DIRETOR', 'ATIVO', '2019-12-31', 25000.00, 1, NULL, 1,
'{"rua": "Av. Paulista", "numero": "1000", "cidade": "São Paulo", "estado": "SP", "cep": "01310000"}',
'["Liderança Estratégica", "Gestão Empresarial", "Visão de Negócios"]',
'{"dias_disponivel": 30, "dias_utilizados": 0, "pode_vender": 10, "status": "EM_DIA", "ferias_vencidas": 0, "proximo_periodo": {"inicio": null, "fim": null, "dias": 0}}',
'{"mes_aniversario": 3, "usado_ano_atual": false, "data_ultimo": null, "data_atual": null, "data_proximo": null, "historico": []}',
'{"status": "EM_DIA", "data_ultimo": "2024-01-15", "data_atual": null, "data_proximo": "2024-04-15"}',
'{"status": "EM_DIA", "data_ultimo": "2024-01-10", "data_atual": null, "data_proximo": "2024-04-10"}',
'CEO da OL360', datetime('now')),

('André Brazioli', 'andre.brazioli@ol360.com', '(11) 99999-0001', '22222222222', '1980-07-20', 'SOLTEIRO', 'Diretor Técnico', 'Gerência de TI', 'DIRETOR', 'ATIVO', '2020-05-31', 18000.00, 2, 1, 2,
'{"rua": "Rua Augusta", "numero": "500", "cidade": "São Paulo", "estado": "SP", "cep": "01305000"}',
'["Gestão de TI", "Arquitetura de Sistemas", "Liderança Técnica"]',
'{"dias_disponivel": 30, "dias_utilizados": 10, "pode_vender": 10, "status": "EM_DIA", "ferias_vencidas": 0, "proximo_periodo": {"inicio": null, "fim": null, "dias": 0}}',
'{"mes_aniversario": 7, "usado_ano_atual": false, "data_ultimo": "2023-07-20", "data_atual": null, "data_proximo": null, "historico": [{"data": "2023-07-20", "ano": "2023"}]}',
'{"status": "EM_DIA", "data_ultimo": "2024-02-01", "data_atual": null, "data_proximo": "2024-05-01"}',
'{"status": "EM_DIA", "data_ultimo": "2024-01-20", "data_atual": null, "data_proximo": "2024-04-20"}',
'Diretor Técnico da OL360', datetime('now')),

('Willian Araujo', 'willian.araujo@ol360.com', '(11) 99999-0002', '37055237831', '1990-01-11', 'SOLTEIRO', 'Gerente de Operações de TI', 'Gerência de TI', 'GERENTE', 'ATIVO', '2021-02-28', 12000.00, 2, 2, 2,
'{"rua": "Salgado Filho", "numero": "2844", "cidade": "Guarulhos", "estado": "SP", "cep": "07115000"}',
'["Gestão de Equipes", "DevOps", "Infraestrutura"]',
'{"dias_disponivel": 25, "dias_utilizados": 5, "pode_vender": 8, "status": "EM_DIA", "ferias_vencidas": 0, "proximo_periodo": {"inicio": null, "fim": null, "dias": 0}}',
'{"mes_aniversario": 1, "usado_ano_atual": true, "data_ultimo": "2024-01-11", "data_atual": "2024-01-11", "data_proximo": null, "historico": [{"data": "2024-01-11", "ano": "2024"}]}',
'{"status": "EM_DIA", "data_ultimo": "2024-02-15", "data_atual": null, "data_proximo": "2024-05-15"}',
'{"status": "EM_DIA", "data_ultimo": "2024-02-10", "data_atual": null, "data_proximo": "2024-05-10"}',
'Gerente de Operações de TI', datetime('now')),

('Rogério Pegorario', 'rogerio.pegorario@ol360.com', '(11) 99999-0003', '33333333333', '1985-09-10', 'CASADO', 'Gerente de Operações de TI', 'Gerência de TI', 'GERENTE', 'ATIVO', '2021-08-14', 12000.00, 2, 2, 2,
'{"rua": "Rua das Flores", "numero": "123", "cidade": "São Paulo", "estado": "SP", "cep": "04567000"}',
'["Gestão de Projetos", "Redes", "Infraestrutura"]',
'{"dias_disponivel": 28, "dias_utilizados": 2, "pode_vender": 9, "status": "EM_DIA", "ferias_vencidas": 0, "proximo_periodo": {"inicio": null, "fim": null, "dias": 0}}',
'{"mes_aniversario": 9, "usado_ano_atual": false, "data_ultimo": "2023-09-10", "data_atual": null, "data_proximo": null, "historico": [{"data": "2023-09-10", "ano": "2023"}]}',
'{"status": "EM_DIA", "data_ultimo": "2024-01-20", "data_atual": null, "data_proximo": "2024-04-20"}',
'{"status": "EM_DIA", "data_ultimo": "2024-01-25", "data_atual": null, "data_proximo": "2024-04-25"}',
'Gerente de Operações de TI', datetime('now')),

('Breno Dias', 'breno.dias@ol360.com', '(11) 99999-0004', '44444444444', '1992-12-05', 'SOLTEIRO', 'Analista de Segurança da Informação Senior', 'N3 - Segurança', 'SENIOR', 'ATIVO', '2022-01-09', 8500.00, 3, 3, 3,
'{"rua": "Av. Ibirapuera", "numero": "789", "cidade": "São Paulo", "estado": "SP", "cep": "04029000"}',
'["Segurança Cibernética", "Pentest", "Compliance", "ISO 27001"]',
'{"dias_disponivel": 30, "dias_utilizados": 0, "pode_vender": 10, "status": "EM_DIA", "ferias_vencidas": 0, "proximo_periodo": {"inicio": null, "fim": null, "dias": 0}}',
'{"mes_aniversario": 12, "usado_ano_atual": false, "data_ultimo": null, "data_atual": null, "data_proximo": null, "historico": []}',
'{"status": "PENDENTE", "data_ultimo": null, "data_atual": null, "data_proximo": "2024-06-01"}',
'{"status": "EM_DIA", "data_ultimo": "2024-02-01", "data_atual": null, "data_proximo": "2024-05-01"}',
'Analista Senior de Segurança', datetime('now')),

('Luis Arevalo', 'luis.arevalo@ol360.com', '(11) 99999-0005', '55555555555', '1988-04-18', 'CASADO', 'Analista de Redes Senior', 'N3 - Redes', 'SENIOR', 'ATIVO', '2022-05-19', 7500.00, 4, 3, 4,
'{"rua": "Rua Vergueiro", "numero": "456", "cidade": "São Paulo", "estado": "SP", "cep": "01504000"}',
'["Redes TCP/IP", "Cisco", "Firewall", "VPN"]',
'{"dias_disponivel": 30, "dias_utilizados": 0, "pode_vender": 10, "status": "EM_DIA", "ferias_vencidas": 0, "proximo_periodo": {"inicio": null, "fim": null, "dias": 0}}',
'{"mes_aniversario": 4, "usado_ano_atual": false, "data_ultimo": null, "data_atual": null, "data_proximo": null, "historico": []}',
'{"status": "PENDENTE", "data_ultimo": null, "data_atual": null, "data_proximo": "2024-08-01"}',
'{"status": "EM_DIA", "data_ultimo": "2024-01-15", "data_atual": null, "data_proximo": "2024-04-15"}',
'Analista Senior de Redes', datetime('now')),

('Danilo Kubo', 'danilo.kubo@ol360.com', '(11) 99999-0006', '66666666666', '1995-11-25', 'SOLTEIRO', 'Analista de Redes Pleno', 'N2 - Redes', 'PLENO', 'ATIVO', '2023-01-31', 6500.00, 5, 4, 4,
'{"rua": "Rua Consolação", "numero": "321", "cidade": "São Paulo", "estado": "SP", "cep": "01301000"}',
'["Redes", "Monitoramento", "Suporte L2", "Windows Server"]',
'{"dias_disponivel": 30, "dias_utilizados": 0, "pode_vender": 10, "status": "EM_DIA", "ferias_vencidas": 0, "proximo_periodo": {"inicio": null, "fim": null, "dias": 0}}',
'{"mes_aniversario": 11, "usado_ano_atual": false, "data_ultimo": null, "data_atual": null, "data_proximo": null, "historico": []}',
'{"status": "PENDENTE", "data_ultimo": null, "data_atual": null, "data_proximo": "2024-07-01"}',
'{"status": "EM_DIA", "data_ultimo": "2024-02-05", "data_atual": null, "data_proximo": "2024-05-05"}',
'Analista Pleno de Redes', datetime('now'));

-- 5. KNOWLEDGE QUINTO
INSERT INTO knowledge (nome, tipo, categoria, fornecedor, validade_anos, descricao, created_at) VALUES
('CISSP', 'CERTIFICACAO', 'Segurança da Informação', 'ISC²', 3, 'Certified Information Systems Security Professional', datetime('now')),
('CCNA', 'CERTIFICACAO', 'Redes', 'Cisco', 3, 'Cisco Certified Network Associate', datetime('now')),
('Python Avançado', 'CURSO', 'Desenvolvimento', 'Alura', 1, 'Curso completo de Python para desenvolvimento', datetime('now')),
('Gestão de Projetos', 'FORMACAO', 'Gestão', 'FGV', 2, 'MBA em Gestão de Projetos', datetime('now')),
('ISO 27001', 'CERTIFICACAO', 'Segurança', 'ISO', 3, 'Sistema de Gestão de Segurança da Informação', datetime('now')),
('CompTIA Security+', 'CERTIFICACAO', 'Segurança da Informação', 'CompTIA', 3, 'Certificação fundamental em segurança', datetime('now')),
('AWS Solutions Architect', 'CERTIFICACAO', 'Cloud Computing', 'Amazon', 3, 'Arquiteto de soluções AWS', datetime('now')),
('Scrum Master', 'CERTIFICACAO', 'Gestão de Projetos', 'Scrum.org', 2, 'Certificação em metodologia ágil', datetime('now'));

-- 6. EMPLOYEE_KNOWLEDGE SEXTO
INSERT INTO employee_knowledge (employee_id, learning_item_id, status, prioridade, data_alvo, observacoes, created_at) VALUES
(5, 1, 'OBTIDO', 'ALTA', '2024-12-31', 'Breno já possui CISSP', datetime('now')),
(5, 6, 'DESEJADO', 'MEDIA', '2024-06-30', 'CompTIA como base complementar', datetime('now')),
(5, 5, 'OBTIDO', 'ALTA', '2024-12-31', 'ISO 27001 obtida', datetime('now')),
(6, 2, 'OBRIGATORIO', 'ALTA', '2024-03-31', 'CCNA obrigatório para analista de redes', datetime('now')),
(7, 2, 'DESEJADO', 'MEDIA', '2024-08-31', 'CCNA para crescimento profissional', datetime('now')),
(3, 4, 'OBTIDO', 'ALTA', '2023-12-31', 'MBA já concluído', datetime('now')),
(4, 8, 'DESEJADO', 'MEDIA', '2024-05-31', 'Scrum Master para gestão ágil', datetime('now'));

-- RESULTADO FINAL
SELECT 'DADOS IMPORTADOS COM SUCESSO!' as status;

SELECT 'AREAS' as tabela, COUNT(*) as count FROM areas
UNION ALL
SELECT 'TEAMS' as tabela, COUNT(*) as count FROM teams
UNION ALL
SELECT 'MANAGERS' as tabela, COUNT(*) as count FROM managers
UNION ALL
SELECT 'EMPLOYEES' as tabela, COUNT(*) as count FROM employees
UNION ALL
SELECT 'KNOWLEDGE' as tabela, COUNT(*) as count FROM knowledge
UNION ALL
SELECT 'VINCULOS' as tabela, COUNT(*) as count FROM employee_knowledge;
