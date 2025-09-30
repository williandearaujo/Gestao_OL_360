import React, { useState } from 'react';
import { Gift, Calendar, CheckCircle, XCircle, Coffee } from 'lucide-react';

const DayOffTab = ({ employee, setSelectedEmployee, setEmployees, currentUser }) => {
  const [saving, setSaving] = useState(false);

  // PASSO 2: TROCAR SÓ ESTA FUNÇÃO (resto continua igual)
const handleDayOffDateChange = async (value) => {  // ← async NOVO
  if (!value) return;

  console.log('🧪 PASSO 2: Vai tentar salvar:', value);
  console.log('🧪 PASSO 2: Employee ID:', employee.id);

  setSaving(true);

  try {
    // ✅ PASSO 2: Teste fetch simples
    console.log('🧪 PASSO 2: Chamando API...');

    const response = await fetch(`http://localhost:8000/employees/${employee.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...employee,
        observacoes: `TESTE Day Off ${value} - ${new Date().toLocaleString()}`
      })
    });

    console.log('🧪 PASSO 2: Response status:', response.status);

    if (!response.ok) {
      throw new Error(`API retornou ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ PASSO 2: API respondeu OK:', result);

    alert(`✅ PASSO 2: API funcionou! Status ${response.status}`);

  } catch (error) {
    console.error('❌ PASSO 2: Erro na API:', error);
    alert(`❌ PASSO 2: ${error.message}`);
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border">
        <h5 className="font-semibold mb-4 flex items-center gap-2">
          <Gift className="h-4 w-4" />
          Day Off - Versão Básica Funcionando
        </h5>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione a data do seu Day Off
          </label>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <input
                type="date"
                onChange={(e) => handleDayOffDateChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>
          </div>
          {saving && (
            <div className="text-sm text-blue-600 mt-2">
              💾 Salvando Day Off... (simulado)
            </div>
          )}
        </div>
      </div>

      {/* INFORMAÇÕES BÁSICAS */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h5 className="font-semibold text-blue-700 mb-2">Day Off</h5>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Versão básica funcionando</li>
          <li>• Próximo passo: testar API</li>
          <li>• Employee ID: {employee.id}</li>
          <li>• Nome: {employee.nome}</li>
        </ul>
      </div>
    </div>
  );
};

export default DayOffTab;
