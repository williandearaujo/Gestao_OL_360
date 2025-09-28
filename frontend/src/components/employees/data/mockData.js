// Mock data organizado e separado
export const catalogoCertificacoes = [
  { id: 1, nome: "CISSP", categoria: "Governança", fornecedor: "(ISC)²", validade_anos: 3 },
  { id: 2, nome: "CEH", categoria: "Ethical Hacking", fornecedor: "EC-Council", validade_anos: 3 },
  { id: 3, nome: "Security+", categoria: "Fundamentos", fornecedor: "CompTIA", validade_anos: 3 },
  { id: 4, nome: "CySA+", categoria: "Análise", fornecedor: "CompTIA", validade_anos: 3 },
  { id: 5, nome: "GCIH", categoria: "Incident Response", fornecedor: "SANS", validade_anos: 4 },
  { id: 6, nome: "CISA", categoria: "Auditoria", fornecedor: "ISACA", validade_anos: 3 },
  { id: 7, nome: "OSCP", categoria: "Penetration Testing", fornecedor: "Offensive Security", validade_anos: 3 }
];

export const initialEmployees = [
  {
    id: 1,
    nome: "João Silva Santos",
    email: "joao.silva@oltecnologia.com.br",
    telefone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    data_nascimento: "1990-05-15",
    estado_civil: "CASADO",
    cargo: "Analista Sênior",
    equipe: "Red Team",
    nivel: "SENIOR",
    status: "ATIVO",
    data_admissao: "2022-03-15",
    salario: 8500.00,
    endereco: {
      rua: "Rua das Flores", numero: "123", complemento: "Apto 45",
      bairro: "Jardins", cidade: "São Paulo", estado: "SP", cep: "01234-567"
    },
    competencias: ["Penetration Testing", "OSINT", "Social Engineering"],
    avatar: null,
    pdi: {
      data_ultimo: "2024-06-15", data_atual: "2024-09-20", data_proximo: "2025-01-20",
      status: "EM_DIA", checks: [], historico: []
    },
    reunioes_1x1: {
      data_ultimo: "2024-08-10", data_atual: "2024-09-20", data_proximo: "2024-10-20",
      status: "EM_DIA", historico: []
    },
    ferias: {
      ultimo_periodo: { inicio: "2023-12-18", fim: "2024-01-15", dias: 20 },
      proximo_periodo: { inicio: "2024-12-20", fim: "2025-01-10", dias: 15 },
      dias_disponivel: 10, 
      status: "EM_DIA", 
      historico: [],
      ferias_vencidas: 0,
      pode_vender: 10
    },
    dayoff: {
      mes_aniversario: 5, 
      usado_ano_atual: false, 
      data_usado: null,
      data_ultimo: null,
      data_atual: null,
      data_proximo: null,
      historico: []
    }
  },
  {
    id: 2,
    nome: "Ana Costa Oliveira",
    email: "ana.costa@oltecnologia.com.br",
    telefone: "(11) 97654-3210",
    cpf: "987.654.321-00",
    rg: "98.765.432-1",
    data_nascimento: "1995-08-22",
    estado_civil: "SOLTEIRO",
    cargo: "Analista Júnior",
    equipe: "Blue Team",
    nivel: "JUNIOR",
    status: "ATIVO",
    data_admissao: "2023-07-20",
    salario: 4500.00,
    endereco: {
      rua: "Av. Paulista", numero: "456", complemento: "",
      bairro: "Bela Vista", cidade: "São Paulo", estado: "SP", cep: "01310-100"
    },
    competencias: ["SOC Analysis", "Incident Response"],
    avatar: null,
    pdi: { data_ultimo: null, data_atual: null, data_proximo: null, status: "NUNCA_AGENDADO", checks: [], historico: [] },
    reunioes_1x1: { data_ultimo: null, data_atual: null, data_proximo: null, status: "NUNCA_AGENDADO", historico: [] },
    ferias: { 
      ultimo_periodo: null, 
      proximo_periodo: null, 
      dias_disponivel: 30, 
      status: "ATRASADO", 
      historico: [],
      ferias_vencidas: 0,
      pode_vender: 10
    },
    dayoff: { 
      mes_aniversario: 8, 
      usado_ano_atual: true, 
      data_usado: "2024-08-15",
      data_ultimo: "2024-08-15",
      data_atual: null,
      data_proximo: null,
      historico: [{ data: "2024-08-15", ano: "2024" }] 
    }
  }
];

export const employeeCertifications = [
  { 
    id: 1, 
    employee_id: 1, 
    certification_name: "CISSP", 
    status: "OBTIDO", 
    data_obtencao: "2024-03-15", 
    data_expiracao: "2027-03-15", 
    certification_id: 1,
    certificado_arquivo: null
  },
  { 
    id: 2, 
    employee_id: 1, 
    certification_name: "CEH", 
    status: "OBTIDO", 
    data_obtencao: "2023-11-20", 
    data_expiracao: "2026-11-20", 
    certification_id: 2,
    certificado_arquivo: null
  },
  { 
    id: 3, 
    employee_id: 2, 
    certification_name: "Security+", 
    status: "OBTIDO", 
    data_obtencao: "2024-01-10", 
    data_expiracao: "2027-01-10", 
    certification_id: 3,
    certificado_arquivo: null
  }
];
