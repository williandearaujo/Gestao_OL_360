// Cálculos específicos de férias baseados na legislação brasileira
export const calcularStatusFerias = (employee) => {
  const hoje = new Date();
  const dataAdmissao = new Date(employee.data_admissao);
  const mesesTrabalhados = Math.floor((hoje - dataAdmissao) / (1000 * 60 * 60 * 24 * 30.44));
  
  let status = 'SEM_DIREITO';
  let diasDisponiveis = 0;
  let feriasVencidas = 0;
  let podeVender = 0;
  
  if (mesesTrabalhados >= 12) {
    // Tem direito a férias
    const anosTrabalhados = Math.floor(mesesTrabalhados / 12);
    diasDisponiveis = Math.min(30 * anosTrabalhados, 60); // Máximo 60 dias acumulados
    podeVender = Math.min(10, diasDisponiveis); // Pode vender até 10 dias
    
    // Verificar se tem férias vencidas (mais de 23 meses sem tirar)
    const dataLimiteFerias = new Date(dataAdmissao);
    dataLimiteFerias.setMonth(dataLimiteFerias.getMonth() + 23);
    
    if (hoje > dataLimiteFerias && !employee.ferias?.ultimo_periodo) {
      feriasVencidas = 30;
      status = 'FERIAS_VENCIDAS';
    } else if (mesesTrabalhados >= 11) {
      status = 'EM_DIA';
    }
  }
  
  return {
    status,
    dias_disponivel: diasDisponiveis,
    ferias_vencidas: feriasVencidas,
    pode_vender: podeVender
  };
};

export const calcularAlertasFerias = (employee) => {
  const hoje = new Date();
  const admissao = new Date(employee.data_admissao);
  const mesesTrabalho = Math.floor((hoje - admissao) / (1000 * 60 * 60 * 24 * 30));
  
  const alertas = {
    vencimento_1: null,
    vencimento_2: null,
    proximo_periodo: null
  };

  // Vencimento 1 (12 meses)
  if (mesesTrabalho >= 12) {
    const venc1 = new Date(admissao.getTime() + (12 * 30 * 24 * 60 * 60 * 1000));
    const diasRestantes = Math.ceil((venc1 - hoje) / (1000 * 60 * 60 * 24));
    alertas.vencimento_1 = {
      dias_restantes: diasRestantes,
      vencido: diasRestantes < -90,
      alerta_2_meses: diasRestantes <= 60 && diasRestantes > 0
    };
  }

  // Próximo período
  if (employee.ferias.proximo_periodo) {
    const inicioFerias = new Date(employee.ferias.proximo_periodo.inicio);
    const diasRestantes = Math.ceil((inicioFerias - hoje) / (1000 * 60 * 60 * 24));
    alertas.proximo_periodo = { dias_restantes: diasRestantes };
  }

  return alertas;
};

export const calcularDiasFerias = (dataInicio, dataFim) => {
  if (!dataInicio || !dataFim) return 0;
  return Math.ceil((new Date(dataFim) - new Date(dataInicio)) / (1000 * 60 * 60 * 24)) + 1;
};

export const validarPeriodoFerias = (dataInicio, dataFim, diasDisponiveis) => {
  const dias = calcularDiasFerias(dataInicio, dataFim);
  
  const validacoes = {
    dias_calculados: dias,
    valido: true,
    erros: [],
    alertas: []
  };

  if (dias <= 0) {
    validacoes.valido = false;
    validacoes.erros.push('Período inválido');
  }

  if (dias > diasDisponiveis) {
    validacoes.valido = false;
    validacoes.erros.push(`Período excede dias disponíveis (${diasDisponiveis})`);
  }

  if (dias < 5) {
    validacoes.alertas.push('Período muito curto (mínimo recomendado: 5 dias)');
  }

  if (dias > 30) {
    validacoes.alertas.push('Período muito longo (máximo: 30 dias corridos)');
  }

  return validacoes;
};
