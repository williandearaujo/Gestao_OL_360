export const knowledgeCatalog = [
  // CERTIFICAÇÕES
  {
    id: 1,
    nome: "Certified Information Systems Security Professional",
    tipo: "CERTIFICACAO",
    codigo: "CISSP-001",
    vendor: "ISC2",
    area: "Cibersegurança",
    link: "https://www.isc2.org/Certifications/CISSP",
    validade_meses: 36
  },
  {
    id: 2,
    nome: "Certified Ethical Hacker",
    tipo: "CERTIFICACAO", 
    codigo: "CEH-001",
    vendor: "EC-Council",
    area: "Ethical Hacking",
    link: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/",
    validade_meses: 36
  },
  {
    id: 3,
    nome: "Offensive Security Certified Professional",
    tipo: "CERTIFICACAO",
    codigo: "OSCP-001", 
    vendor: "Offensive Security",
    area: "Penetration Testing",
    link: "https://www.offensive-security.com/pwk-oscp/",
    validade_meses: null // Certificação permanente
  },
  
  // CURSOS
  {
    id: 7,
    nome: "Python para Cibersegurança",
    tipo: "CURSO",
    codigo: "PY-CYBER-001",
    vendor: "Udemy", // Plataforma para cursos
    area: "Programação",
    link: "https://www.udemy.com/course/python-cybersecurity/",
    validade_meses: null // Cursos não expiram
  },
  {
    id: 8,
    nome: "Análise de Malware Avançada",
    tipo: "CURSO",
    codigo: "MAL-ADV-001",
    vendor: "SANS", // Plataforma para cursos
    area: "Malware Analysis",
    link: "https://www.sans.org/cyber-security-courses/",
    validade_meses: null // Cursos não expiram
  },
  
  // FORMAÇÕES
  {
    id: 9,
    nome: "Ciência da Computação",
    tipo: "FORMACAO",
    codigo: "CC-GRAD-001",
    vendor: "Universidade Federal", // Instituição para formações
    area: "Bacharelado",
    link: "https://www.ufpr.br/ciencia-computacao/",
    validade_meses: null, // Formações não expiram
    nivel_formacao: "GRADUACAO"
  },
  {
    id: 10,
    nome: "Segurança da Informação",
    tipo: "FORMACAO", 
    codigo: "SI-POS-001",
    vendor: "PUC-SP", // Instituição para formações
    area: "Especialização",
    link: "https://www.pucsp.br/pos-seguranca/",
    validade_meses: null, // Formações não expiram
    nivel_formacao: "POS_GRADUACAO"
  },
  {
    id: 12,
    nome: "Mestrado em Cibersegurança",
    tipo: "FORMACAO",
    codigo: "CS-MEST-001",
    vendor: "USP", // Instituição para formações
    area: "Mestrado",
    link: "https://www.usp.br/mestrado/",
    validade_meses: null, // Formações não expiram
    nivel_formacao: "MESTRADO"
  },
  {
    id: 13,
    nome: "Doutorado em Inteligência Artificial",
    tipo: "FORMACAO",
    codigo: "IA-DOUT-001",
    vendor: "UNICAMP", // Instituição para formações
    area: "Doutorado",
    link: "https://www.unicamp.br/doutorado/",
    validade_meses: null, // Formações não expiram
    nivel_formacao: "DOUTORADO"
  }
];

// Vendors organizados por tipo
export const vendors = [...new Set(knowledgeCatalog.map(k => k.vendor))].sort();
export const areas = [...new Set(knowledgeCatalog.map(k => k.area).filter(Boolean))].sort();
