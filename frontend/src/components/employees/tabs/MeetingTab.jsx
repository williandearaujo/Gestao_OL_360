import React, { useState } from 'react';
import { Users, Plus, Calendar, Clock, MessageSquare, CheckCircle, XCircle, AlertTriangle, Trash2, Edit, X } from 'lucide-react';
// IMPORT DA API
import employeesService from '../../../services/employeesService';

// MODAL PARA ADICIONAR/EDITAR REUNIÃO 1x1
const AddMeetingModal = ({ isOpen, onClose, onSave, editingMeeting }) => {
  const [formData, setFormData] = useState({
    data: '',
    duracao: '60',
    tipo: 'FEEDBACK',
    assuntos: '',
    observacoes: '',
    status: 'AGENDADA',
    feedback_gestor: '',
    feedback_colaborador: '',
    proximosPassos: ''
  });

  React.useEffect(() => {
    if (editingMeeting) {
      setFormData(editingMeeting);
    } else {
      setFormData({
        data: '',
        duracao: '60',
        tipo: 'FEEDBACK',
        assuntos: '',
        observacoes: '',
        status: 'AGENDADA',
        feedback_gestor: '',
        feedback_colaborador: '',
        proximosPassos: ''
      });
    }
  }, [editingMeeting, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.data || !formData.assuntos.trim()) {
      alert('Data e assuntos são obrigatórios.');
      return;
    }

    onSave({
      ...formData,
      id: editingMeeting?.id || Date.now(),
      data_criacao: editingMeeting?.data_criacao || new Date().toISOString().split('T')[0],
      data_atualizacao: new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            {editingMeeting ? 'Editar Reunião 1x1' : 'Nova Reunião 1x1'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* DATA E DURAÇÃO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Reunião *
              </label>
              <input
                type="datetime-local"
                value={formData.data}
                onChange={(e) => setFormData({...formData, data: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração (minutos)
              </label>
              <select
                value={formData.duracao}
                onChange={(e) => setFormData({...formData, duracao: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
                <option value="120">120 min</option>
              </select>
            </div>
          </div>

          {/* TIPO E STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Reunião
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="FEEDBACK">Feedback</option>
                <option value="ACOMPANHAMENTO">Acompanhamento</option>
                <option value="DESENVOLVIMENTO">Desenvolvimento</option>
                <option value="ALINHAMENTO">Alinhamento</option>
                <option value="METAS">Metas e Objetivos</option>
                <option value="CARREIRA">Carreira</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>

            {editingMeeting && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AGENDADA">Agendada</option>
                  <option value="REALIZADA">Realizada</option>
                  <option value="CANCELADA">Cancelada</option>
                  <option value="REAGENDADA">Reagendada</option>
                </select>
              </div>
            )}
          </div>

          {/* ASSUNTOS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assuntos a Tratar *
            </label>
            <textarea
              value={formData.assuntos}
              onChange={(e) => setFormData({...formData, assuntos: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Liste os assuntos que serão abordados na reunião..."
              required
            />
          </div>

          {/* OBSERVAÇÕES */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
              placeholder="Observações adicionais sobre a reunião..."
            />
          </div>

          {/* FEEDBACKS (apenas ao editar e se reunião foi realizada) */}
          {editingMeeting && formData.status === 'REALIZADA' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback do Gestor
                </label>
                <textarea
                  value={formData.feedback_gestor}
                  onChange={(e) => setFormData({...formData, feedback_gestor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Feedback e observações do gestor sobre a reunião..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback do Colaborador
                </label>
                <textarea
                  value={formData.feedback_colaborador}
                  onChange={(e) => setFormData({...formData, feedback_colaborador: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Feedback e observações do colaborador sobre a reunião..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Próximos Passos
                </label>
                <textarea
                  value={formData.proximosPassos}
                  onChange={(e) => setFormData({...formData, proximosPassos: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Ações e próximos passos definidos na reunião..."
                />
              </div>
            </>
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
              {editingMeeting ? 'Atualizar' : 'Agendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MeetingTab = ({ employee, setSelectedEmployee, setEmployees, currentUser }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [saving, setSaving] = useState(false);

  // CALCULAR STATUS DAS REUNIÕES
  const calcularStatusReunioes = () => {
    const reunioes = employee.reunioes_1x1?.historico || [];
    const hoje = new Date();

    const total = reunioes.length;
    const realizadas = reunioes.filter(r => r.status === 'REALIZADA').length;
    const agendadas = reunioes.filter(r => r.status === 'AGENDADA').length;
    const canceladas = reunioes.filter(r => r.status === 'CANCELADA').length;

    // Reuniões atrasadas (agendadas para uma data passada)
    const atrasadas = reunioes.filter(r => {
      if (r.status === 'AGENDADA' && r.data) {
        return new Date(r.data) < hoje;
      }
      return false;
    }).length;

    // Última reunião realizada
    const ultimaRealizada = reunioes
      .filter(r => r.status === 'REALIZADA')
      .sort((a, b) => new Date(b.data) - new Date(a.data))[0];

    // Próxima reunião agendada
    const proximaAgendada = reunioes
      .filter(r => r.status === 'AGENDADA' && new Date(r.data) >= hoje)
      .sort((a, b) => new Date(a.data) - new Date(b.data))[0];

    return {
      total,
      realizadas,
      agendadas,
      canceladas,
      atrasadas,
      ultimaRealizada,
      proximaAgendada
    };
  };

  const statusReunioes = calcularStatusReunioes();

  // ADICIONAR NOVA REUNIÃO - COM API
  const handleAddMeeting = async (meetingData) => {
    setSaving(true);

    try {
      const novaReuniao = {
        ...meetingData,
        usuario_criacao: currentUser?.nome || 'Sistema',
        timestamp: new Date().toISOString()
      };

      const updatedEmployee = {
        ...employee,
        reunioes_1x1: {
          ...employee.reunioes_1x1,
          historico: [...(employee.reunioes_1x1?.historico || []), novaReuniao],
          data_proxima: meetingData.status === 'AGENDADA' ? meetingData.data : employee.reunioes_1x1?.data_proxima,
          data_atualizacao: new Date().toISOString().split('T')[0]
        }
      };

      console.log('🔄 Salvando nova reunião 1x1 via API...', updatedEmployee);

      // SALVAR NO BACKEND
      await employeesService.update(employee.id, updatedEmployee);

      console.log('✅ Reunião 1x1 salva com sucesso!');

      // ATUALIZAR ESTADOS
      setSelectedEmployee(updatedEmployee);
      setEmployees(prev => prev.map(emp =>
        emp.id === employee.id ? updatedEmployee : emp
      ));

      alert('Reunião 1x1 agendada com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao salvar reunião 1x1:', error);
      alert('Erro ao salvar reunião 1x1. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // EDITAR REUNIÃO - COM API
  const handleEditMeeting = async (meetingData) => {
    setSaving(true);

    try {
      const updatedEmployee = {
        ...employee,
        reunioes_1x1: {
          ...employee.reunioes_1x1,
          historico: employee.reunioes_1x1.historico.map(meeting =>
            meeting.id === meetingData.id ? {
              ...meetingData,
              usuario_atualizacao: currentUser?.nome || 'Sistema',
              timestamp_atualizacao: new Date().toISOString()
            } : meeting
          ),
          data_ultima: meetingData.status === 'REALIZADA' ? meetingData.data : employee.reunioes_1x1?.data_ultima,
          data_atualizacao: new Date().toISOString().split('T')[0]
        }
      };

      console.log('🔄 Atualizando reunião 1x1 via API...', updatedEmployee);

      // SALVAR NO BACKEND
      await employeesService.update(employee.id, updatedEmployee);

      console.log('✅ Reunião 1x1 atualizada com sucesso!');

      // ATUALIZAR ESTADOS
      setSelectedEmployee(updatedEmployee);
      setEmployees(prev => prev.map(emp =>
        emp.id === employee.id ? updatedEmployee : emp
      ));

      alert('Reunião 1x1 atualizada com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao atualizar reunião 1x1:', error);
      alert('Erro ao atualizar reunião 1x1. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // DELETAR REUNIÃO - COM API
  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta reunião?')) {
      return;
    }

    setSaving(true);

    try {
      const updatedEmployee = {
        ...employee,
        reunioes_1x1: {
          ...employee.reunioes_1x1,
          historico: employee.reunioes_1x1.historico.filter(meeting => meeting.id !== meetingId),
          data_atualizacao: new Date().toISOString().split('T')[0]
        }
      };

      console.log('🔄 Removendo reunião 1x1 via API...', updatedEmployee);

      // SALVAR NO BACKEND
      await employeesService.update(employee.id, updatedEmployee);

      console.log('✅ Reunião 1x1 removida com sucesso!');

      // ATUALIZAR ESTADOS
      setSelectedEmployee(updatedEmployee);
      setEmployees(prev => prev.map(emp =>
        emp.id === employee.id ? updatedEmployee : emp
      ));

      alert('Reunião 1x1 removida com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao remover reunião 1x1:', error);
      alert('Erro ao remover reunião 1x1. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // MARCAR REUNIÃO COMO REALIZADA - COM API
  const handleMarkAsCompleted = async (meetingId) => {
    setSaving(true);

    try {
      const updatedEmployee = {
        ...employee,
        reunioes_1x1: {
          ...employee.reunioes_1x1,
          historico: employee.reunioes_1x1.historico.map(meeting =>
            meeting.id === meetingId ? {
              ...meeting,
              status: 'REALIZADA',
              data_realizacao: new Date().toISOString().split('T')[0],
              usuario_realizacao: currentUser?.nome || 'Sistema',
              timestamp_realizacao: new Date().toISOString()
            } : meeting
          ),
          data_ultima: employee.reunioes_1x1.historico.find(m => m.id === meetingId)?.data,
          data_atualizacao: new Date().toISOString().split('T')[0]
        }
      };

      console.log('🔄 Marcando reunião como realizada via API...', updatedEmployee);

      // SALVAR NO BACKEND
      await employeesService.update(employee.id, updatedEmployee);

      console.log('✅ Reunião marcada como realizada!');

      // ATUALIZAR ESTADOS
      setSelectedEmployee(updatedEmployee);
      setEmployees(prev => prev.map(emp =>
        emp.id === employee.id ? updatedEmployee : emp
      ));

      alert('Reunião marcada como realizada!');

    } catch (error) {
      console.error('❌ Erro ao marcar reunião como realizada:', error);
      alert('Erro ao marcar reunião como realizada. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // FUNÇÕES AUXILIARES
  const getStatusColor = (status) => {
    switch (status) {
      case 'REALIZADA': return 'text-green-600 bg-green-100';
      case 'AGENDADA': return 'text-blue-600 bg-blue-100';
      case 'CANCELADA': return 'text-red-600 bg-red-100';
      case 'REAGENDADA': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isMeetingOverdue = (meeting) => {
    if (meeting.status === 'AGENDADA' && meeting.data) {
      return new Date(meeting.data) < new Date();
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* RESUMO GERAL */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Reuniões 1x1
          </h4>
          <button
            onClick={() => {
              setEditingMeeting(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 text-sm"
            disabled={saving}
          >
            <Plus className="h-4 w-4" />
            {saving ? 'Salvando...' : 'Nova Reunião'}
          </button>
        </div>

        {/* ESTATÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{statusReunioes.total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statusReunioes.realizadas}</div>
            <div className="text-sm text-gray-500">Realizadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statusReunioes.agendadas}</div>
            <div className="text-sm text-gray-500">Agendadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{statusReunioes.atrasadas}</div>
            <div className="text-sm text-gray-500">Atrasadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{statusReunioes.canceladas}</div>
            <div className="text-sm text-gray-500">Canceladas</div>
          </div>
        </div>

        {/* PRÓXIMA E ÚLTIMA REUNIÃO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statusReunioes.proximaAgendada && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-700">Próxima Reunião</span>
              </div>
              <p className="text-sm text-blue-600">
                {new Date(statusReunioes.proximaAgendada.data).toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-blue-500">{statusReunioes.proximaAgendada.tipo}</p>
            </div>
          )}

          {statusReunioes.ultimaRealizada && (
            <div className="bg-green-50 border border-green-200 p-3 rounded">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-700">Última Reunião</span>
              </div>
              <p className="text-sm text-green-600">
                {new Date(statusReunioes.ultimaRealizada.data).toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-green-500">{statusReunioes.ultimaRealizada.tipo}</p>
            </div>
          )}
        </div>
      </div>

      {/* LISTA DE REUNIÕES */}
      {employee.reunioes_1x1?.historico && employee.reunioes_1x1.historico.length > 0 ? (
        <div className="space-y-3">
          {employee.reunioes_1x1.historico
            .sort((a, b) => new Date(b.data) - new Date(a.data))
            .map(meeting => (
              <div
                key={meeting.id}
                className={`p-4 rounded-lg border-l-4 ${
                  isMeetingOverdue(meeting) ? 'border-red-500 bg-red-50' :
                  meeting.status === 'REALIZADA' ? 'border-green-500 bg-green-50' :
                  meeting.status === 'AGENDADA' ? 'border-blue-500 bg-blue-50' :
                  meeting.status === 'CANCELADA' ? 'border-red-500 bg-red-50' :
                  'border-yellow-500 bg-yellow-50'
                } bg-white`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">
                            {new Date(meeting.data).toLocaleString('pt-BR')}
                          </span>
                          {isMeetingOverdue(meeting) && (
                            <AlertTriangle className="h-4 w-4 text-red-500" title="Reunião atrasada" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{meeting.assuntos}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {meeting.tipo}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {meeting.duracao}min
                      </span>
                    </div>

                    {/* DETALHES ADICIONAIS */}
                    {meeting.observacoes && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Observações:</strong> {meeting.observacoes}
                      </p>
                    )}

                    {/* FEEDBACKS (se reunião foi realizada) */}
                    {meeting.status === 'REALIZADA' && (
                      <div className="space-y-2 mt-3">
                        {meeting.feedback_gestor && (
                          <div className="bg-blue-50 border border-blue-200 p-2 rounded">
                            <p className="text-xs font-medium text-blue-700 mb-1">Feedback do Gestor:</p>
                            <p className="text-sm text-blue-600">{meeting.feedback_gestor}</p>
                          </div>
                        )}

                        {meeting.feedback_colaborador && (
                          <div className="bg-green-50 border border-green-200 p-2 rounded">
                            <p className="text-xs font-medium text-green-700 mb-1">Feedback do Colaborador:</p>
                            <p className="text-sm text-green-600">{meeting.feedback_colaborador}</p>
                          </div>
                        )}

                        {meeting.proximosPassos && (
                          <div className="bg-yellow-50 border border-yellow-200 p-2 rounded">
                            <p className="text-xs font-medium text-yellow-700 mb-1">Próximos Passos:</p>
                            <p className="text-sm text-yellow-600">{meeting.proximosPassos}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
                      <span>Criado por: {meeting.usuario_criacao || 'Sistema'}</span>
                      {meeting.data_realizacao && (
                        <span>Realizada em: {new Date(meeting.data_realizacao).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>

                  {/* AÇÕES */}
                  <div className="flex gap-2 ml-4">
                    {meeting.status === 'AGENDADA' && (
                      <button
                        onClick={() => handleMarkAsCompleted(meeting.id)}
                        className="text-green-500 hover:text-green-700 p-1"
                        title="Marcar como realizada"
                        disabled={saving}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setEditingMeeting(meeting);
                        setModalOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Editar reunião"
                      disabled={saving}
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteMeeting(meeting.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Excluir reunião"
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
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhuma reunião 1x1 cadastrada</h3>
          <p className="text-gray-500 mb-4">Comece agendando reuniões regulares com este colaborador.</p>
          <button
            onClick={() => {
              setEditingMeeting(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 mx-auto"
            disabled={saving}
          >
            <Plus className="h-4 w-4" />
            Agendar Primeira Reunião
          </button>
        </div>
      )}

      {/* MODAL PARA ADICIONAR/EDITAR REUNIÃO */}
      <AddMeetingModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingMeeting(null);
        }}
        onSave={editingMeeting ? handleEditMeeting : handleAddMeeting}
        editingMeeting={editingMeeting}
      />

      {/* INFORMAÇÕES SOBRE REUNIÕES 1x1 */}
      <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
        <h5 className="font-semibold text-purple-700 mb-2">Sobre as Reuniões 1x1</h5>
        <ul className="text-sm text-purple-600 space-y-1">
          <li>• Reuniões regulares entre gestor e colaborador para feedback e alinhamento</li>
          <li>• Recomenda-se frequência quinzenal ou mensal</li>
          <li>• Use para discutir desenvolvimento, metas, carreira e bem-estar</li>
          <li>• Documente feedbacks e próximos passos para acompanhamento</li>
          <li>• Mantenha um ambiente seguro e aberto para diálogo</li>
        </ul>
      </div>
    </div>
  );
};

export default MeetingTab;
