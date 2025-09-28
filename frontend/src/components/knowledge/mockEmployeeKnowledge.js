// Vínculos reais que batem com os colaboradores do sistema
export const employeeKnowledge = [
  // === CARLOS SILVA (ID: 1) ===
  // Certificações
  { id: 1, employee_id: 1, learning_item_id: 1, status: "OBTIDO", data_obtencao: "2024-03-15", data_expiracao: "2027-03-15", anexo_path: null },
  { id: 2, employee_id: 1, learning_item_id: 2, status: "OBTIDO", data_obtencao: "2024-01-10", data_expiracao: "2025-01-10", anexo_path: null }, // Esta vence em 2025
  { id: 3, employee_id: 1, learning_item_id: 3, status: "DESEJADO", data_alvo: "2025-06-01", anexo_path: null },
  
  // Cursos
  { id: 4, employee_id: 1, learning_item_id: 7, status: "OBTIDO", data_obtencao: "2024-05-10", data_expiracao: null, anexo_path: null },
  { id: 5, employee_id: 1, learning_item_id: 8, status: "DESEJADO", data_alvo: "2025-04-01", anexo_path: null },
  
  // Formação
  { id: 6, employee_id: 1, learning_item_id: 9, status: "OBTIDO", data_obtencao: "2020-12-15", data_expiracao: null, anexo_path: null },
  
  // === MARIA SANTOS (ID: 2) ===
  // Certificações
  { id: 7, employee_id: 2, learning_item_id: 4, status: "OBTIDO", data_obtencao: "2024-07-20", data_expiracao: "2027-07-20", anexo_path: null },
  { id: 8, employee_id: 2, learning_item_id: 5, status: "OBRIGATORIO", data_alvo: "2025-05-15", anexo_path: null },
  { id: 9, employee_id: 2, learning_item_id: 6, status: "OBTIDO", data_obtencao: "2023-01-10", data_expiracao: "2024-01-10", anexo_path: null }, // VENCIDA
  
  // Cursos
  { id: 10, employee_id: 2, learning_item_id: 7, status: "DESEJADO", data_alvo: "2025-03-01", anexo_path: null },
  
  // Formação
  { id: 11, employee_id: 2, learning_item_id: 10, status: "OBTIDO", data_obtencao: "2021-06-30", data_expiracao: null, anexo_path: null },
  
  // === JOÃO OLIVEIRA (ID: 3) ===
  // Certificações
  { id: 12, employee_id: 3, learning_item_id: 1, status: "DESEJADO", data_alvo: "2025-08-01", anexo_path: null },
  { id: 13, employee_id: 3, learning_item_id: 2, status: "OBRIGATORIO", data_alvo: "2025-03-01", anexo_path: null },
  
  // Cursos
  { id: 14, employee_id: 3, learning_item_id: 8, status: "OBTIDO", data_obtencao: "2024-08-15", data_expiracao: null, anexo_path: null },
  
  // === ANA COSTA (ID: 4) ===
  // Certificações
  { id: 15, employee_id: 4, learning_item_id: 3, status: "OBTIDO", data_obtencao: "2024-09-01", data_expiracao: null, anexo_path: null }, // OSCP permanente
  { id: 16, employee_id: 4, learning_item_id: 1, status: "OBTIDO", data_obtencao: "2024-11-01", data_expiracao: "2025-02-01", anexo_path: null }, // Vence em 30 dias
  
  // Formação
  { id: 17, employee_id: 4, learning_item_id: 12, status: "OBTIDO", data_obtencao: "2023-12-20", data_expiracao: null, anexo_path: null },
  
  // === PEDRO LIMA (ID: 5) ===
  // Certificações
  { id: 18, employee_id: 5, learning_item_id: 2, status: "OBTIDO", data_obtencao: "2024-10-01", data_expiracao: "2025-04-01", anexo_path: null }, // Vence em 60 dias
  
  // Cursos
  { id: 19, employee_id: 5, learning_item_id: 7, status: "OBTIDO", data_obtencao: "2024-06-20", data_expiracao: null, anexo_path: null }
];
