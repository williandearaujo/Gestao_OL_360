import React, { useState } from 'react';
import { Target, Plus, CheckCircle, XCircle, AlertTriangle, Calendar, User, Trash2, Edit, X, Clock } from 'lucide-react';
// IMPORT DA API
import employeesService from '../../../services/employeesService';

// MODAL PARA ADICIONAR/EDITAR AÇÃO DE PDI
const AddActionModal = ({ isOpen, onClose, onSave, editingAction }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: 'TECNICA',
    prioridade: 'MEDIA',
    data_limite: '',
    responsavel: '',
    status: 'PENDENTE'
  });

  React.useEffect(() => {
    if (editingAction) {
      setFormData(editingAction);
    } else {
      setFormData({
        titulo: '',
        descricao: '',
        categoria: 'TECNICA',
        prioridade: 'MEDIA',
        data_limite: '',
        responsavel: '',
        status: 'PENDENTE'
      });
    }
  }, [editingAction, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.descricao.trim()) {
      alert('Título e descrição são obrigatórios.');
      return;
    }

    onSave({
      ...formData,
      id: editingAction?.id || Date.now(),
      data_criacao: editingAction?.data_criacao || new Date().toISOString().split('T')[0],
      data_atualizacao: new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            {editingAction ? 'Editar Ação de PDI' : 'Nova Ação de PDI'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TÍTULO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da Ação *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Curso de React Avançado"
              required
            />
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição Detalhada *
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Descreva os objetivos, métodos e resultados esperados..."
              required
            />
          </div>

          {/* CATEGORIA E PRIORIDADE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TECNICA">Técnica</option>
                <option value="COMPORTAMENTAL">Comportamental</option>
                <option value="LIDERANCA">Liderança</option>
                <option value="COMUNICACAO">Comunicação</option>
                <option value="GESTAO">Gestão</option>
                <option value="IDIOMAS">Idiomas</option>
                <option value="CERTIFICACAO">Certificação</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                value={formData.prioridade}
                onChange={(e) => setFormData({...formData, prioridade: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
              </select>
            </div>
          </div>

          {/* DATA LIMITE E RESPONSÁVEL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Limite
              </label>
              <input
                type="date"
                value={formData.data_limite}
                onChange={(e) => setFormData({...formData, data_limite: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsável
              </label>
              <input
                type="text"
                value={formData.responsavel}
                onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do responsável"
              />
            </div>
          </div>

          {/* STATUS (apenas ao editar) */}
          {editingAction && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDENTE">Pendente</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="CONCLUIDO">Concluído</option>
                <option value="PAUSADO">Pausado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
          )}

          {/* BOTÕES */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {editingAction ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PDITab = ({ employee, setSelectedEmployee, setEmployees, currentUser }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [saving, setSaving] = useState(false);

  // CALCULAR STATUS GERAL DO PDI
  const calcularStatusPDI = () => {
    const acoes = employee.pdi?.checks || [];
    const total = acoes.length;
    const concluidas = acoes.filter(a => a.status === 'CONCLUIDO').length;
    const emAndamento = acoes.filter(a => a.status === 'EM_ANDAMENTO').length;
    const pendentes = acoes.filter(a => a.status === 'PENDENTE').length;
    const atrasadas = acoes.filter(a => {
      if (a.data_limite && a.status !== 'CONCLUIDO') {
        return new Date(a.data_limite) < new Date();
      }
      return false;
    }).length;

    const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    return {
      total,
      concluidas,
      emAndamento,
      pendentes,
      atrasadas,
      progresso
    };
  };

  const statusPDI = calcularStatusPDI();

  // ADICIONAR NOVA AÇÃO - COM API
  const handleAddAction = async (actionData) => {
    setSaving(true);

    try {
      const novaAcao = {
        ...actionData,
        usuario_criacao: currentUser?.nome || 'Sistema',
        timestamp: new Date().toISOString()
      };

      const updatedEmployee = {
        ...employee,
        pdi: {
          ...employee.pdi,
          checks: [...(employee.pdi?.checks || []), novaAcao],
          data_atualizacao: new Date().toISOString().split('T')[0]
        }
      };

      console.log('🔄 Salvando nova ação de PDI via API...', updatedEmployee);

      // SALVAR NO BACKEND
      await employeesService.update(employee.id, updatedEmployee);

      console.log('✅ Ação de PDI salva com sucesso!');

      // ATUALIZAR ESTADOS
      setSelectedEmployee(updatedEmployee);
      setEmployees(prev => prev.map(emp =>
        emp.id === employee.id ? updatedEmployee : emp
      ));

      alert('Ação de PDI adicionada com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao salvar ação de PDI:', error);
      alert('Erro ao salvar ação de PDI. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // EDITAR AÇÃO - COM API
  const handleEditAction = async (actionData) => {
    setSaving(true);

    try {
      const updatedEmployee = {
        ...employee,
        pdi: {
          ...employee.pdi,
          checks: employee.pdi.checks.map(action =>
            action.id === actionData.id ? {
              ...actionData,
              usuario_atualizacao: currentUser?.nome || 'Sistema',
              timestamp_atualizacao: new Date().toISOString()
            } : action
          ),
          data_atualizacao: new Date().toISOString().split('T')[0]
        }
      };

      console.log('🔄 Atualizando ação de PDI via API...', updatedEmployee);

      // SALVAR NO BACKEND
      await employeesService.update(employee.id, updatedEmployee);

      console.log('✅ Ação de PDI atualizada com sucesso!');

      // ATUALIZAR ESTADOS
      setSelectedEmployee(updatedEmployee);
      setEmployees(prev => prev.map(emp =>
        emp.id === employee.id ? updatedEmployee : emp
      ));

      alert('Ação de PDI atualizada com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao atualizar ação de PDI:', error);
      alert('Erro ao atualizar ação de PDI. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // DELETAR AÇÃO - COM API
  const handleDeleteAction = async (actionId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta ação do PDI?')) {
      return;
    }

    setSaving(true);

    try {
      const updatedEmployee = {
        ...employee,
        pdi: {
          ...employee.pdi,
          checks: employee.pdi.checks.filter(action => action.id !== actionId),
          data_atualizacao: new Date().toISOString().split('T')[0]
        }
      };

      console.log('🔄 Removendo ação de PDI via API...', updatedEmployee);

      // SALVAR NO BACKEND
      await employeesService.update(employee.id, updatedEmployee);

      console.log('✅ Ação de PDI removida com sucesso!');

      // ATUALIZAR ESTADOS
      setSelectedEmployee(updatedEmployee);
      setEmployees(prev => prev.map(emp =>
        emp.id === employee.id ? updatedEmployee : emp
      ));

      alert('Ação de PDI removida com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao remover ação de PDI:', error);
      alert('Erro ao remover ação de PDI. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // MARCAR AÇÃO COMO CONCLUÍDA - COM API
  const handleCompleteAction = async (actionId) => {
    setSaving(true);

    try {
      const updatedEmployee = {
        ...employee,
        pdi: {
          ...employee.pdi,
          checks: employee.pdi.checks.map(action =>
            action.id === actionId ? {
              ...action,
              status: 'CONCLUIDO',
              data_conclusao: new Date().toISOString().split('T')[0],
              usuario_conclusao: currentUser?.nome || 'Sistema',
              timestamp_conclusao: new Date().toISOString()
            } : action
          ),
          data_atualizacao: new Date().toISOString().split('T')[0]
        }
      };

      console.log('🔄 Marcando ação como concluída via API...', updatedEmployee);

      // SALVAR NO BACKEND
      await employeesService.update(employee.id, updatedEmployee);

      console.log('✅ Ação marcada como concluída!');

      // ATUALIZAR ESTADOS
      setSelectedEmployee(updatedEmployee);
      setEmployees(prev => prev.map(emp =>
        emp.id === employee.id ? updatedEmployee : emp
      ));

      alert('Ação marcada como concluída!');

    } catch (error) {
      console.error('❌ Erro ao marcar ação como concluída:', error);
      alert('Erro ao marcar ação como concluída. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // FUNÇÕES AUXILIARES
  const getStatusColor = (status) => {
    switch (status) {
      case 'CONCLUIDO': return 'text-green-600 bg-green-100';
      case 'EM_ANDAMENTO': return 'text-blue-600 bg-blue-100';
      case 'PENDENTE': return 'text-yellow-600 bg-yellow-100';
      case 'PAUSADO': return 'text-gray-600 bg-gray-100';
      case 'CANCELADO': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'CRITICA': return 'text-red-600 bg-red-100';
      case 'ALTA': return 'text-orange-600 bg-orange-100';
      case 'MEDIA': return 'text-yellow-600 bg-yellow-100';
      case 'BAIXA': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isActionOverdue = (action) => {
    if (action.data_limite && action.status !== 'CONCLUIDO') {
      return new Date(action.data_limite) < new Date();
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* RESUMO GERAL */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Target className="h-5 w-5" />
            Plano de Desenvolvimento Individual (PDI)
          </h4>
          <button
            onClick={() => {
              setEditingAction(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 text-sm"
            disabled={saving}
          >
            <Plus className="h-4 w-4" />
            {saving ? 'Salvando...' : 'Nova Ação'}
          </button>
        </div>

        {/* ESTATÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{statusPDI.total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statusPDI.concluidas}</div>
            <div className="text-sm text-gray-500">Concluídas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statusPDI.emAndamento}</div>
            <div className="text-sm text-gray-500">Em Andamento</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusPDI.pendentes}</div>
            <div className="text-sm text-gray-500">Pendentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{statusPDI.atrasadas}</div>
            <div className="text-sm text-gray-500">Atrasadas</div>
          </div>
        </div>

        {/* BARRA DE PROGRESSO */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
            <span className="text-sm font-medium text-gray-700">{statusPDI.progresso}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${statusPDI.progresso}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* LISTA DE AÇÕES */}
      {employee.pdi?.checks && employee.pdi.checks.length > 0 ? (
        <div className="space-y-3">
          {employee.pdi.checks
            .sort((a, b) => {
              // Ordenar por prioridade, depois por data limite
              const prioridadeOrder = { 'CRITICA': 4, 'ALTA': 3, 'MEDIA': 2, 'BAIXA': 1 };
              if (prioridadeOrder[a.prioridade] !== prioridadeOrder[b.prioridade]) {
                return prioridadeOrder[b.prioridade] - prioridadeOrder[a.prioridade];
              }
              if (a.data_limite && b.data_limite) {
                return new Date(a.data_limite) - new Date(b.data_limite);
              }
              return 0;
            })
            .map(action => (
              <div
                key={action.id}
                className={`p-4 rounded-lg border-l-4 ${
                  isActionOverdue(action) ? 'border-red-500 bg-red-50' :
                  action.status === 'CONCLUIDO' ? 'border-green-500 bg-green-50' :
                  action.status === 'EM_ANDAMENTO' ? 'border-blue-500 bg-blue-50' :
                  'border-yellow-500 bg-yellow-50'
                } bg-white`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                          {action.titulo}
                          {isActionOverdue(action) && (
                            <AlertTriangle className="h-4 w-4 text-red-500" title="Atrasada" />
                          )}
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">{action.descricao}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(action.status)}`}>
                        {action.status?.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(action.prioridade)}`}>
                        {action.prioridade}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {action.categoria}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      {action.data_limite && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Limite: {new Date(action.data_limite).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                      {action.responsavel && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {action.responsavel}
                        </span>
                      )}
                      {action.data_conclusao && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          Concluído em: {new Date(action.data_conclusao).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* AÇÕES */}
                  <div className="flex gap-2 ml-4">
                    {action.status !== 'CONCLUIDO' && (
                      <button
                        onClick={() => handleCompleteAction(action.id)}
                        className="text-green-500 hover:text-green-700 p-1"
                        title="Marcar como concluído"
                        disabled={saving}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setEditingAction(action);
                        setModalOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Editar ação"
                      disabled={saving}
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteAction(action.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Excluir ação"
                      disabled={saving}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhuma ação de PDI cadastrada</h3>
          <p className="text-gray-500 mb-4">Comece adicionando ações de desenvolvimento para este colaborador.</p>
          <button
            onClick={() => {
              setEditingAction(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 mx-auto"
            disabled={saving}
          >
            <Plus className="h-4 w-4" />
            Adicionar Primeira Ação
          </button>
        </div>
      )}

      {/* MODAL PARA ADICIONAR/EDITAR AÇÃO */}
      <AddActionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAction(null);
        }}
        onSave={editingAction ? handleEditAction : handleAddAction}
        editingAction={editingAction}
      />

      {/* INFORMAÇÕES SOBRE PDI */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h5 className="font-semibold text-blue-700 mb-2">Sobre o PDI</h5>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• PDI é uma ferramenta de desenvolvimento profissional personalizada</li>
          <li>• Cada ação deve ter objetivos claros e prazos definidos</li>
          <li>• Acompanhe regularmente o progresso das ações</li>
          <li>• Mantenha as ações atualizadas conforme evolução do colaborador</li>
          <li>• Use categorias e prioridades para organizar melhor o desenvolvimento</li>
        </ul>
      </div>
    </div>
  );
};

export default PDITab;
