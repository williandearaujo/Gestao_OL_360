import React from 'react';

const PDITab = ({ employee, setSelectedEmployee, setEmployees }) => {
  const handlePDIDateChange = (field, value) => {
    const updatedEmployee = {
      ...employee,
      pdi: {
        ...employee.pdi,
        [field]: value
      }
    };

    setSelectedEmployee(updatedEmployee);
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employee.id) {
        return updatedEmployee;
      }
      return emp;
    }));
  };

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg ${
        employee.pdi.status === 'EM_DIA' ? 'bg-ol-brand-50 border border-ol-brand-200' :
        employee.pdi.status === 'ATRASADO' ? 'bg-red-50 border border-red-200' :
        'bg-yellow-50 border border-yellow-200'
      }`}>
        <h4 className="font-semibold mb-4 text-ol-brand-700">Plano de Desenvolvimento Individual (PDI)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-ol-gray-700 mb-2">PDI Anterior</label>
            <input
              type="date"
              value={employee.pdi.data_ultimo || ''}
              onChange={(e) => handlePDIDateChange('data_ultimo', e.target.value)}
              className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ol-gray-700 mb-2">PDI Atual</label>
            <input
              type="date"
              value={employee.pdi.data_atual || ''}
              onChange={(e) => handlePDIDateChange('data_atual', e.target.value)}
              className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ol-gray-700 mb-2">Próximo PDI</label>
            <input
              type="date"
              value={employee.pdi.data_proximo || ''}
              onChange={(e) => handlePDIDateChange('data_proximo', e.target.value)}
              className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            />
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded border">
          <span className="text-sm font-medium text-ol-gray-700">Status atual:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            employee.pdi.status === 'EM_DIA' ? 'bg-ol-brand-100 text-ol-brand-700' :
            employee.pdi.status === 'ATRASADO' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {employee.pdi.status.replace('_', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PDITab;
