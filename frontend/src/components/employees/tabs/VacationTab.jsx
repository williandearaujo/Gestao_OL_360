import React from 'react';

const VacationTab = ({ employee, setSelectedEmployee, setEmployees }) => {
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

    // Calcular dias se ambas as datas estiverem preenchidas
    if (field === 'fim' || field === 'inicio') {
      const inicio = field === 'inicio' ? value : employee.ferias.proximo_periodo?.inicio;
      const fim = field === 'fim' ? value : employee.ferias.proximo_periodo?.fim;
      
      if (inicio && fim) {
        const dias = Math.ceil((new Date(fim) - new Date(inicio)) / (1000 * 60 * 60 * 24)) + 1;
        updatedEmployee.ferias.proximo_periodo.dias = dias;

        // Validar período
        if (dias > employee.ferias.dias_disponivel) {
          alert(`Atenção: O período solicitado (${dias} dias) excede os dias disponíveis (${employee.ferias.dias_disponivel} dias).`);
        } else if (dias > 0) {
          alert(`Período de férias: ${dias} dias calculados.`);
        }
      }
    }

    // Atualizar estado local
    setSelectedEmployee(updatedEmployee);

    // Atualizar estado global
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employee.id) {
        return updatedEmployee;
      }
      return emp;
    }));
  };

  const handleSellVacation = () => {
    const diasVenda = prompt(`Quantos dias deseja vender? (Máximo: ${employee.ferias.pode_vender})`);
    const dias = parseInt(diasVenda);
    
    if (dias && dias > 0 && dias <= employee.ferias.pode_vender) {
      const novosDias = employee.ferias.dias_disponivel - dias;
      const updatedEmployee = {
        ...employee,
        ferias: {
          ...employee.ferias,
          dias_disponivel: novosDias,
          pode_vender: employee.ferias.pode_vender - dias
        }
      };
      
      setSelectedEmployee(updatedEmployee);
      setEmployees(prev => prev.map(emp => {
        if (emp.id === employee.id) {
          return updatedEmployee;
        }
        return emp;
      }));
      
      alert(`${dias} dias de férias vendidos com sucesso!`);
    } else if (dias > employee.ferias.pode_vender) {
      alert(`Máximo permitido: ${employee.ferias.pode_vender} dias.`);
    }
  };

  const handleAddDays = () => {
    const diasAdicionar = prompt('Quantos dias adicionar para completar o período?');
    const dias = parseInt(diasAdicionar);
    
    if (dias && dias > 0) {
      const novosDias = employee.ferias.dias_disponivel + dias;
      const updatedEmployee = {
        ...employee,
        ferias: { ...employee.ferias, dias_disponivel: novosDias }
      };
      
      setSelectedEmployee(updatedEmployee);
      setEmployees(prev => prev.map(emp => {
        if (emp.id === employee.id) {
          return updatedEmployee;
        }
        return emp;
      }));
      
      alert(`${dias} dias adicionados! Total: ${novosDias} dias.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status automático das férias */}
      <div className={`p-4 rounded-lg ${
        employee.ferias.status === 'EM_DIA' ? 'bg-ol-brand-50 border border-ol-brand-200' :
        employee.ferias.status === 'FERIAS_ATUAIS' ? 'bg-yellow-50 border border-yellow-200' :
        employee.ferias.status === 'FERIAS_VENCIDAS' ? 'bg-red-50 border border-red-200' :
        'bg-ol-gray-50 border border-ol-gray-200'
      }`}>
        <h4 className="font-semibold mb-4 text-ol-brand-700">Gestão de Férias (Legislação Brasileira)</h4>
        
        {/* Informações automáticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex justify-between items-center p-3 bg-white rounded">
            <span className="text-sm font-medium">Dias disponíveis:</span>
            <span className="text-lg font-bold text-ol-brand-600">
              {employee.ferias.dias_disponivel}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-white rounded">
            <span className="text-sm font-medium">Pode vender:</span>
            <span className="text-lg font-bold text-blue-600">
              {employee.ferias.pode_vender}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-white rounded">
            <span className="text-sm font-medium">Status:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              employee.ferias.status === 'EM_DIA' ? 'bg-ol-brand-100 text-ol-brand-700' :
              employee.ferias.status === 'FERIAS_VENCIDAS' ? 'bg-red-100 text-red-700' :
              'bg-ol-gray-100 text-ol-gray-700'
            }`}>
              {employee.ferias.status.replace('_', ' ')}
            </span>
          </div>
          
          {employee.ferias.ferias_vencidas > 0 && (
            <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded">
              <span className="text-sm font-medium text-red-700">Férias vencidas:</span>
              <span className="text-lg font-bold text-red-600">
                {employee.ferias.ferias_vencidas}
              </span>
            </div>
          )}
        </div>

        {/* Calendários para férias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ol-gray-700 mb-2">Data Início Próximas Férias</label>
            <input
              type="date"
              value={employee.ferias.proximo_periodo?.inicio || ''}
              onChange={(e) => handleVacationDateChange('inicio', e.target.value)}
              className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ol-gray-700 mb-2">Data Fim Próximas Férias</label>
            <input
              type="date"
              value={employee.ferias.proximo_periodo?.fim || ''}
              onChange={(e) => handleVacationDateChange('fim', e.target.value)}
              className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            />
          </div>
        </div>

        {/* Mostrar dias calculados */}
        {employee.ferias.proximo_periodo?.inicio && employee.ferias.proximo_periodo?.fim && (
          <div className="mt-4 p-3 bg-ol-brand-100 rounded text-sm">
            <div className="flex justify-between items-center">
              <span><strong>Período:</strong> {new Date(employee.ferias.proximo_periodo.inicio).toLocaleDateString('pt-BR')} a {new Date(employee.ferias.proximo_periodo.fim).toLocaleDateString('pt-BR')}</span>
              <span className="font-bold">({employee.ferias.proximo_periodo.dias} dias)</span>
            </div>
          </div>
        )}

        {/* Ações de férias */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
          <button
            onClick={handleSellVacation}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            disabled={employee.ferias.pode_vender === 0}
          >
            Vender Férias ({employee.ferias.pode_vender} disponíveis)
          </button>
          
          <button
            onClick={handleAddDays}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
          >
            Adicionar Dias
          </button>
        </div>
      </div>
      
      {/* Informações sobre legislação */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h5 className="font-semibold text-blue-700 mb-2">ℹ️ Legislação Brasileira - CLT</h5>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Direito a 30 dias de férias após 12 meses trabalhados</li>
          <li>• Máximo 10 dias podem ser vendidos (1/3 das férias)</li>
          <li>• Férias devem ser gozadas nos próximos 12 meses</li>
          <li>• Férias não gozadas no prazo são consideradas vencidas</li>
        </ul>
      </div>
    </div>
  );
};

export default VacationTab;
