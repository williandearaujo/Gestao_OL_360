import React from 'react';

const DayOffTab = ({ employee, setSelectedEmployee, setEmployees }) => {
  const handleDayOffDateChange = (field, value) => {
    const updatedField = { [field]: value };
    
    // Validação especial para day off atual
    if (field === 'data_atual' && value) {
      const mesAniversario = employee.dayoff.mes_aniversario;
      const dataObj = new Date(value);
      
      if (dataObj.getMonth() + 1 !== mesAniversario) {
        alert(`Day Off só pode ser usado no mês ${mesAniversario} (mês do aniversário).`);
        return;
      }
      
      // Atualizar histórico
      updatedField.data_usado = value;
      updatedField.usado_ano_atual = true;
      updatedField.historico = [
        ...employee.dayoff.historico.filter(h => h.ano !== new Date().getFullYear().toString()),
        { data: value, ano: new Date().getFullYear().toString() }
      ];
      
      alert(`Day Off registrado para ${dataObj.toLocaleDateString('pt-BR')}!`);
    }

    const updatedEmployee = {
      ...employee,
      dayoff: {
        ...employee.dayoff,
        ...updatedField
      }
    };

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

  return (
    <div className="space-y-6">
      {/* Status atual */}
      <div className={`p-4 rounded-lg ${
        employee.dayoff.usado_ano_atual ? 'bg-ol-brand-50 border border-ol-brand-200' :
        new Date().getMonth() + 1 === employee.dayoff.mes_aniversario ? 'bg-yellow-50 border border-yellow-200' :
        'bg-ol-gray-50 border border-ol-gray-200'
      }`}>
        <h4 className="font-semibold mb-4 text-ol-brand-700">Gestão de Day Off</h4>
        
        {/* Calendários padronizados para Day Off */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Day Off Anterior */}
          <div>
            <label className="block text-sm font-medium text-ol-gray-700 mb-2">Day Off Anterior</label>
            <input
              type="date"
              value={employee.dayoff.data_ultimo || ''}
              onChange={(e) => handleDayOffDateChange('data_ultimo', e.target.value)}
              className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            />
          </div>

          {/* Day Off Atual */}
          <div>
            <label className="block text-sm font-medium text-ol-gray-700 mb-2">Day Off Atual</label>
            <input
              type="date"
              value={employee.dayoff.data_atual || ''}
              onChange={(e) => handleDayOffDateChange('data_atual', e.target.value)}
              className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            />
          </div>

          {/* Próximo Day Off */}
          <div>
            <label className="block text-sm font-medium text-ol-gray-700 mb-2">Próximo Day Off</label>
            <input
              type="date"
              value={employee.dayoff.data_proximo || ''}
              onChange={(e) => handleDayOffDateChange('data_proximo', e.target.value)}
              className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            />
          </div>
        </div>
        
        {/* Informações do Day Off */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded border">
            <span className="text-sm font-medium text-ol-gray-700">Mês do aniversário:</span>
            <span className="ml-2 font-bold text-ol-brand-600">Mês {employee.dayoff.mes_aniversario}</span>
          </div>
          <div className="p-3 bg-white rounded border">
            <span className="text-sm font-medium text-ol-gray-700">Status {new Date().getFullYear()}:</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
              employee.dayoff.usado_ano_atual ? 'bg-ol-brand-100 text-ol-brand-700' :
              new Date().getMonth() + 1 === employee.dayoff.mes_aniversario ? 'bg-yellow-100 text-yellow-700' :
              'bg-ol-gray-100 text-ol-gray-700'
            }`}>
              {employee.dayoff.usado_ano_atual ? 'Já usado' : 
               new Date().getMonth() + 1 === employee.dayoff.mes_aniversario ? 'Disponível agora' : 
               'Aguardando mês do aniversário'}
            </span>
          </div>
        </div>
      </div>

      {/* Histórico de Day Off */}
      {employee.dayoff.historico && employee.dayoff.historico.length > 0 && (
        <div>
          <h4 className="font-semibold text-ol-brand-500 mb-3">Histórico de Day Off</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {employee.dayoff.historico.map((dayoff, index) => (
              <div key={index} className="p-3 bg-ol-gray-50 rounded-lg border">
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {new Date(dayoff.data).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-ol-gray-500">
                      {dayoff.ano}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayOffTab;
