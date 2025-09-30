import React, { useState } from 'react';
import { Calendar, DollarSign, Trash2, AlertTriangle, CheckCircle, XCircle, Plus, History, X } from 'lucide-react';
// IMPORT DA API
import employeesService from '../../../services/employeesService';

// MODAL PARA CANCELAMENTO COM MOTIVO
const CancelModal = ({ isOpen, onClose, item, onConfirm, type }) => {
  const [motivo, setMotivo] = useState('CANCELADO');
  const [descricao, setDescricao] = useState('');

  const handleConfirm = () => {
    if (!descricao.trim()) {
      alert('Por favor, informe uma descrição para o cancelamento.');
      return;
    }
    onConfirm(motivo, descricao.trim());
    setMotivo('CANCELADO');
    setDescricao('');
    onClose();
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-red-700">
            Cancelar {type === 'venda' ? 'Venda de Férias' : 'Agendamento'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded border">
          <p className="text-sm">
            <strong>{type === 'venda' ? `Venda de ${item.dias} dias por R$ ${item.valor?.toFixed(2)}` : `Agendamento ${item.dias} dias`}</strong>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Data: {new Date(item.data).toLocaleDateString('pt-BR')}
          </p>
          {item.inicio && item.fim && (
            <p className="text-xs text-gray-600">
              Período: {new Date(item.inicio).toLocaleDateString('pt-BR')} a {new Date(item.fim).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivo do Cancelamento
          </label>
          <select
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="CANCELADO">Cancelado</option>
            <option value="ADIADO">Adiado</option>
            <option value="ERRO_SISTEMA">Erro do Sistema</option>
            <option value="SOLICITACAO_FUNCIONARIO">Solicitação do Funcionário</option>
            <option value="DECISAO_GERENCIA">Decisão da Gerência</option>
            <option value="OUTROS">Outros</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição Detalhada
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva brevemente o motivo do cancelamento..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            rows={3}
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Confirmar Cancelamento
          </button>
        </div>
      </div>
    </div>
  );
};

const VacationTab = ({ employee, setSelectedEmployee, setEmployees, currentUser }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [cancelModal, setCancelModal] = useState({ isOpen: false, item: null, type: null });
  const [saving, setSaving] = useState(false);

  // CALCULAR TEMPO DE TRABALHO
  const calcularTempoTrabalho = () => {
    if (!employee.data_admissao) {
      return { anos: 0, meses: 0, temDireito: false };
    }

    const admissao = new Date(employee.data_admissao);
    const hoje = new Date();
    const diffTime = Math.abs(hoje - admissao);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const anos = Math.floor(diffMonths / 12);
    const meses = diffMonths % 12;

    return {
      anos,
      meses,
      temDireito: diffMonths >= 12,
      totalMeses: diffMonths
    };
  };

  const tempoTrabalho = calcularTempoTrabalho();

  // AGENDAR FÉRIAS - COM API
  const handleScheduleVacation = async () => {
    if (!tempoTrabalho.temDireito) {
      alert('Colaborador ainda não tem direito a férias (menos de 1 ano na empresa).');
      return;
    }

    const inicio = employee.ferias.proximo_periodo?.inicio;
    const fim = employee.ferias.proximo_periodo?.fim;
    const dias = employee.ferias.proximo_periodo?.dias;

    if (!inicio || !fim || !dias) {
      alert('Preencha as datas de início e fim das férias.');
      return;
    }

    if (dias > employee.ferias.dias_disponivel) {
      alert(`Período solicitado (${dias} dias) excede os dias disponíveis (${employee.ferias.dias_disponivel} dias).`);
      return;
    }

    setSaving(true);

    try {
      const agendamento = {
        id: Date.now(),
        data: new Date().toISOString().split('T')[0],
        tipo: 'AGENDAMENTO',
        inicio,
        fim,
        dias,
        observacao: `Agendamento de férias - ${dias} dias`,
        usuario: currentUser?.nome || 'Sistema',
        timestamp: new Date().toISOString()
      };

      const updatedEmployee = {
        ...employee,
        ferias: {
          ...employee.ferias,
          historico: [...(employee.ferias.historico || []), agendamento]
        }
      };

      console.log('🔄 Salvando agendamento de férias via API...', updatedEmployee);

      // SALVAR NO BACKEND
      await employeesService.update(employee.id, updatedEmployee);

      console.log('✅ Férias agendadas com sucesso!');

      // ATUALIZAR ESTADOS
      setSelectedEmployee(updatedEmployee);
      setEmployees(prev => prev.map(emp =>
        emp.id === employee.id ? updatedEmployee : emp
      ));

      alert(`Férias agendadas: ${new Date(inicio).toLocaleDateString('pt-BR')} a ${new Date(fim).toLocaleDateString('pt-BR')} (${dias} dias)`);

    } catch (error) {
      console.error('❌ Erro ao agendar férias:', error);
      alert('Erro ao agendar férias. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // CALCULAR PERÍODO DE FÉRIAS
  const handleVacationDateChange = (field, value) => {
    const updatedEmployee = {
      ...employee,
      ferias: {
        ...employee.ferias,
        proximo_periodo: {
          ...employee.ferias.proximo_periodo,
          [field]: value
        }
      }
    };

    if (field === 'fim' || field === 'inicio') {
      const inicio = field === 'inicio' ? value : employee.ferias.proximo_periodo?.inicio;
      const fim = field === 'fim' ? value : employee.ferias.proximo_periodo?.fim;

      if (inicio && fim) {
        const dias = Math.ceil((new Date(fim) - new Date(inicio)) / (1000 * 60 * 60 * 24)) + 1;
        updatedEmployee.ferias.proximo_periodo.dias = dias;
      }
    }

    setSelectedEmployee(updatedEmployee);
    setEmployees(prev => prev.map(emp =>
      emp.id === employee.id ? updatedEmployee : emp
    ));
  };

  // VENDER FÉRIAS COM HISTÓRICO - COM API
  const handleSellVacation = async () => {
    if (!tempoTrabalho.temDireito) {
      alert('Colaborador ainda não tem direito a férias (menos de 1 ano na empresa).');
      return;
    }

    const diasVenda = prompt(`Quantos dias deseja vender? Máximo: ${employee.ferias.pode_vender}`);
    const dias = parseInt(diasVenda);

    if (dias && dias > 0 && dias <= employee.ferias.pode_vender) {
      setSaving(true);

      try {
        const valorDia = employee.salario / 30;
        const valorVenda = (valorDia * dias * 1.33).toFixed(2);
        const novosDiasDisponiveis = employee.ferias.dias_disponivel - dias;
        const novosPodeVender = employee.ferias.pode_vender - dias;

        const novoHistorico = {
          id: Date.now(),
          data: new Date().toISOString().split('T')[0],
          tipo: 'VENDA',
          dias: dias,
          valor: parseFloat(valorVenda),
          observacao: `Venda de ${dias} dias de férias`,
          usuario: currentUser?.nome || 'Sistema',
          timestamp: new Date().toISOString()
        };

        const updatedEmployee = {
          ...employee,
          ferias: {
            ...employee.ferias,
            dias_disponivel: novosDiasDisponiveis,
            pode_vender: novosPodeVender,
            historico: [...(employee.ferias.historico || []), novoHistorico]
          }
        };

        console.log('🔄 Salvando venda de férias via API...', updatedEmployee);

        // SALVAR NO BACKEND
        await employeesService.update(employee.id, updatedEmployee);

        console.log('✅ Venda de férias salva com sucesso!');

        // ATUALIZAR ESTADOS
        setSelectedEmployee(updatedEmployee);
        setEmployees(prev => prev.map(emp =>
          emp.id === employee.id ? updatedEmployee : emp
        ));

        alert(`${dias} dias vendidos! Valor: R$ ${valorVenda}. ${novosDiasDisponiveis} dias disponíveis.`);

      } catch (error) {
        console.error('❌ Erro ao vender férias:', error);
        alert('Erro ao vender férias. Tente novamente.');
      } finally {
        setSaving(false);
      }
    } else if (dias > employee.ferias.pode_vender) {
      alert(`Máximo permitido: ${employee.ferias.pode_vender} dias.`);
    }
  };

  // CANCELAR AGENDAMENTO COM MODAL DETALHADO
  const handleCancelSchedule = (agendamento) => {
    setCancelModal({ isOpen: true, item: agendamento, type: 'agendamento' });
  };

  // CANCELAR VENDA COM MODAL DETALHADO
  const handleCancelSale = (venda) => {
    setCancelModal({ isOpen: true, item: venda, type: 'venda' });
  };

  // CONFIRMAR CANCELAMENTO COM MOTIVO E DESCRIÇÃO - COM API
  const confirmCancel = async (motivo, descricao) => {
    const item = cancelModal.item;
    const type = cancelModal.type;
    setSaving(true);

    try {
      if (type === 'venda') {
        // REVERTER VENDA
        const novosDiasDisponiveis = employee.ferias.dias_disponivel + item.dias;
        const novosPodeVender = employee.ferias.pode_vender + item.dias;

        const registroCancelamento = {
          id: Date.now(),
          data: new Date().toISOString().split('T')[0],
          tipo: `CANCELAMENTO_VENDA_${motivo}`,
          dias: item.dias,
          valor: item.valor,
          motivo_cancelamento: motivo,
          descricao_cancelamento: descricao,
          observacao: `${motivo}: ${descricao}`,
          usuario: currentUser?.nome || 'Sistema',
          timestamp: new Date().toISOString(),
          vendaOriginal: item.id
        };

        const updatedEmployee = {
          ...employee,
          ferias: {
            ...employee.ferias,
            dias_disponivel: novosDiasDisponiveis,
            pode_vender: novosPodeVender,
            historico: [
              ...employee.ferias.historico.filter(h => h.id !== item.id),
              registroCancelamento
            ]
          }
        };

        console.log('🔄 Cancelando venda via API...', updatedEmployee);
        await employeesService.update(employee.id, updatedEmployee);

        setSelectedEmployee(updatedEmployee);
        setEmployees(prev => prev.map(emp =>
          emp.id === employee.id ? updatedEmployee : emp
        ));

        alert(`Venda cancelada! ${item.dias} dias devolvidos ao saldo. ${motivo}`);

      } else if (type === 'agendamento') {
        // CANCELAR AGENDAMENTO
        const registroCancelamento = {
          id: Date.now(),
          data: new Date().toISOString().split('T')[0],
          tipo: `CANCELAMENTO_AGENDAMENTO_${motivo}`,
          dias: item.dias,
          inicio: item.inicio,
          fim: item.fim,
          motivo_cancelamento: motivo,
          descricao_cancelamento: descricao,
          observacao: `${motivo}: ${descricao}`,
          usuario: currentUser?.nome || 'Sistema',
          timestamp: new Date().toISOString(),
          agendamentoOriginal: item.id
        };

        const updatedEmployee = {
          ...employee,
          ferias: {
            ...employee.ferias,
            historico: [
              ...employee.ferias.historico.filter(h => h.id !== item.id),
              registroCancelamento
            ]
          }
        };

        console.log('🔄 Cancelando agendamento via API...', updatedEmployee);
        await employeesService.update(employee.id, updatedEmployee);

        setSelectedEmployee(updatedEmployee);
        setEmployees(prev => prev.map(emp =>
          emp.id === employee.id ? updatedEmployee : emp
        ));

        alert(`Agendamento cancelado! ${motivo}`);
      }

    } catch (error) {
      console.error('❌ Erro ao cancelar:', error);
      alert('Erro ao cancelar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // FUNÇÃO PARA RENDERIZAR ÍCONE DO HISTÓRICO
  const getHistoryIcon = (tipo) => {
    if (tipo === 'VENDA') return <DollarSign className="h-4 w-4 text-green-500" />;
    if (tipo === 'AGENDAMENTO') return <Calendar className="h-4 w-4 text-blue-500" />;
    if (tipo.startsWith('CANCELAMENTO_VENDA')) return <XCircle className="h-4 w-4 text-red-500" />;
    if (tipo.startsWith('CANCELAMENTO_AGENDAMENTO')) return <XCircle className="h-4 w-4 text-orange-500" />;
    return <History className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* VALIDAÇÃO DE DIREITO A FÉRIAS */}
      <div className={`p-4 rounded-lg border ${
        tempoTrabalho.temDireito ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {tempoTrabalho.temDireito ?
            <CheckCircle className="h-5 w-5 text-green-600" /> :
            <XCircle className="h-5 w-5 text-red-600" />
          }
          <h4 className="font-semibold">
            Tempo de Trabalho: {tempoTrabalho.anos}a {tempoTrabalho.meses}m
          </h4>
        </div>

        {!tempoTrabalho.temDireito && (
          <div className="bg-red-100 border border-red-300 p-3 rounded">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Ainda não tem direito a férias</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              Colaborador precisa completar 12 meses de trabalho para ter direito a férias.
              Faltam {12 - tempoTrabalho.totalMeses} meses.
            </p>
          </div>
        )}
      </div>

      {/* STATUS DAS FÉRIAS */}
      {tempoTrabalho.temDireito && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* DIAS DISPONÍVEIS */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Dias Disponíveis</span>
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {employee.ferias.dias_disponivel}
            </span>
          </div>

          {/* PODE VENDER */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Pode Vender</span>
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
            <span className="text-2xl font-bold text-green-600">
              {employee.ferias.pode_vender}
            </span>
          </div>

          {/* STATUS */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Status</span>
            </div>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              employee.ferias.status === 'EM_DIA' ? 'bg-green-100 text-green-700' :
              employee.ferias.status === 'FERIAS_VENCIDAS' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {employee.ferias.status?.replace('_', ' ')}
            </span>
          </div>

          {/* HISTÓRICO */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Histórico</span>
              <History className="h-4 w-4 text-purple-500" />
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              {employee.ferias.historico?.length || 0} registros
            </button>
          </div>
        </div>
      )}

      {/* AGENDAMENTO DE FÉRIAS */}
      {tempoTrabalho.temDireito && (
        <div className="bg-white p-4 rounded-lg border">
          <h5 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Agendar Próximas Férias
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* DATA INÍCIO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
              <input
                type="date"
                value={employee.ferias.proximo_periodo?.inicio || ''}
                onChange={(e) => handleVacationDateChange('inicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>

            {/* DATA FIM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
              <input
                type="date"
                value={employee.ferias.proximo_periodo?.fim || ''}
                onChange={(e) => handleVacationDateChange('fim', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>
          </div>

          {/* VISUALIZAR PERÍODO CALCULADO */}
          {employee.ferias.proximo_periodo?.inicio && employee.ferias.proximo_periodo?.fim && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="flex justify-between items-center">
                <span>
                  <strong>Período:</strong> {new Date(employee.ferias.proximo_periodo.inicio).toLocaleDateString('pt-BR')} a {new Date(employee.ferias.proximo_periodo.fim).toLocaleDateString('pt-BR')}
                </span>
                <span className="font-bold text-blue-600">
                  {employee.ferias.proximo_periodo.dias} dias
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleScheduleVacation}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            disabled={!employee.ferias.proximo_periodo?.inicio || !employee.ferias.proximo_periodo?.fim || saving}
          >
            <Plus className="h-4 w-4" />
            {saving ? 'Agendando...' : 'Agendar Férias'}
          </button>
        </div>
      )}

      {/* AÇÕES DE FÉRIAS */}
      {tempoTrabalho.temDireito && (
        <div className="bg-white p-4 rounded-lg border">
          <h5 className="font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Gerenciar Férias
          </h5>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSellVacation}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm flex items-center gap-2"
              disabled={employee.ferias.pode_vender <= 0 || saving}
            >
              <DollarSign className="h-4 w-4" />
              {saving ? 'Processando...' : `Vender Férias (${employee.ferias.pode_vender} disponíveis)`}
            </button>
          </div>
        </div>
      )}

      {/* HISTÓRICO DE FÉRIAS MELHORADO */}
      {showHistory && tempoTrabalho.temDireito && (
        <div className="bg-white p-4 rounded-lg border">
          <h5 className="font-semibold mb-4 flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico de Férias
          </h5>

          {employee.ferias.historico && employee.ferias.historico.length > 0 ? (
            <div className="space-y-2">
              {employee.ferias.historico
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map(item => (
                  <div
                    key={item.id}
                    className={`p-3 rounded border-l-4 ${
                      item.tipo === 'VENDA' ? 'border-green-500 bg-green-50' :
                      item.tipo === 'AGENDAMENTO' ? 'border-blue-500 bg-blue-50' :
                      item.tipo.startsWith('CANCELAMENTO') ? 'border-red-500 bg-red-50' :
                      'border-gray-500 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {getHistoryIcon(item.tipo)}
                            {item.tipo === 'VENDA' ? 'Venda de Férias' :
                             item.tipo === 'AGENDAMENTO' ? 'Agendamento de Férias' :
                             item.tipo.startsWith('CANCELAMENTO_VENDA') ? 'Cancelamento de Venda' :
                             item.tipo.startsWith('CANCELAMENTO_AGENDAMENTO') ? 'Cancelamento de Agendamento' :
                             item.tipo}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(item.data).toLocaleDateString('pt-BR')}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600">{item.observacao}</p>

                        {/* DETALHES DO ITEM */}
                        {item.valor && (
                          <p className="text-sm font-medium">Valor: R$ {item.valor.toFixed(2)}</p>
                        )}
                        {item.inicio && item.fim && (
                          <p className="text-sm">
                            Período: {new Date(item.inicio).toLocaleDateString('pt-BR')} a {new Date(item.fim).toLocaleDateString('pt-BR')} ({item.dias} dias)
                          </p>
                        )}

                        {/* MOSTRAR MOTIVO E DESCRIÇÃO DO CANCELAMENTO */}
                        {item.motivo_cancelamento && (
                          <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-sm">
                            <p><strong>Motivo:</strong> {item.motivo_cancelamento}</p>
                            {item.descricao_cancelamento && (
                              <p><strong>Descrição:</strong> {item.descricao_cancelamento}</p>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-gray-400 mt-1">Por: {item.usuario}</p>
                      </div>

                      {/* BOTÕES DE CANCELAMENTO PARA GERENTES */}
                      {currentUser?.isManager && !item.tipo.startsWith('CANCELAMENTO') && (
                        <button
                          onClick={() => {
                            if (item.tipo === 'VENDA') {
                              handleCancelSale(item);
                            } else if (item.tipo === 'AGENDAMENTO') {
                              handleCancelSchedule(item);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1 ml-2"
                          title={`Cancelar ${item.tipo === 'VENDA' ? 'venda' : 'agendamento'} (apenas gerentes)`}
                          disabled={saving}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum registro no histórico.</p>
          )}
        </div>
      )}

      {/* MODAL DE CANCELAMENTO */}
      <CancelModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, item: null, type: null })}
        item={cancelModal.item}
        type={cancelModal.type}
        onConfirm={confirmCancel}
      />

      {/* INFORMAÇÕES SOBRE FÉRIAS */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <h5 className="font-semibold text-green-700 mb-2">Informações sobre Férias</h5>
        <ul className="text-sm text-green-600 space-y-1">
          <li>• Direito a 30 dias de férias após 12 meses de trabalho</li>
          <li>• Possível vender até 1/3 das férias (10 dias)</li>
          <li>• Férias podem ser divididas em até 3 períodos</li>
          <li>• Um período deve ter no mínimo 14 dias</li>
          <li>• Apenas gerentes podem cancelar agendamentos e vendas</li>
          <li>• Todo histórico de alterações fica registrado</li>
        </ul>
      </div>
    </div>
  );
};

export default VacationTab;
