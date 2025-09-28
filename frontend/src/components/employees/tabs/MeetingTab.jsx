import React from 'react';

const MeetingTab = ({ employee, setSelectedEmployee, setEmployees }) => {
  const handleMeetingDateChange = (field, value) => {
    const updatedEmployee = {
      ...employee,
      reunioes_1x1: {
        ...employee.reunioes_1x1,
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
        employee.reunioes_1x1.status === 'EM_DIA' ? 'bg-ol-brand-50 border border-ol-brand-200' :
        employee.reunioes_1x1.status === 'ATRASADO' ? 'bg-red-50 border border-red-200' :
        'bg-yellow-50 border border-yellow-200'
      }`}>
        <h4 className="font-semibold mb-4 text-ol-brand-700">Reuniões One-on-One</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-ol-gray-700 mb-2">Reunião Anterior</label>
            <input
              type="date"
              value={employee.reunioes_1x1.data_ultimo || ''}
              onChange={(e) => handleMeetingDateChange('data_ultimo', e.target.value)}
              className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ol-gray-700 mb-2">Reunião Atual</label>
            <input
              type="date"
              value={employee.reunioes_1x1.data_atual || ''}
              onChange={(e) => handleMeetingDateChange('data_atual', e.target.value)}
              className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ol-gray-700 mb-2">Próxima Reunião</label>
            <input
              type="date"
              value={employee.reunioes_1x1.data_proximo || ''}
              onChange={(e) => handleMeetingDateChange('data_proximo', e.target.value)}
              className="w-full px-3 py-2 border border-ol-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ol-brand-500"
            />
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded border">
          <span className="text-sm font-medium text-ol-gray-700">Status atual:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            employee.reunioes_1x1.status === 'EM_DIA' ? 'bg-ol-brand-100 text-ol-brand-700' :
            employee.reunioes_1x1.status === 'ATRASADO' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {employee.reunioes_1x1.status.replace('_', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MeetingTab;
