import React, { useState } from 'react';
import TabButton from '../components/TabButton';
import ProfileTab from '../tabs/ProfileTab';
import KnowledgeTab from '../tabs/KnowledgeTab';
import VacationTab from '../tabs/VacationTab';
import DayOffTab from '../tabs/DayOffTab';
import PDITab from '../tabs/PDITab';
import MeetingTab from '../tabs/MeetingTab';
import { getInitials } from '../utils/employeeUtils';

const EmployeeDetailModal = ({ 
  isOpen,
  onClose,
  selectedEmployee,
  setSelectedEmployee,
  setEmployees,
  employeeKnowledge,
  setEmployeeKnowledge,
  knowledgeCatalog,
  onShowAddKnowledgeModal,
  onFileUpload,
  employees  // 🆕 Para mostrar nome do gerente
}) => {
  const [activeDetailTab, setActiveDetailTab] = useState('perfil');

  if (!isOpen || !selectedEmployee) return null;

  // 🆕 Buscar informações do gerente
  const manager = employees?.find(emp => emp.id === selectedEmployee.manager_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-ol-brand-100 rounded-full flex items-center justify-center overflow-hidden">
                {selectedEmployee.avatar ? (
                  <img src={selectedEmployee.avatar} alt={selectedEmployee.nome} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-ol-brand-600 font-medium text-lg">
                    {getInitials(selectedEmployee.nome)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="text-xl font-semibold text-ol-gray-900">{selectedEmployee.nome}</h3>
                  {/* 🆕 Badge do nível de acesso */}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedEmployee.access_level === 'ADMIN' ? 'bg-red-100 text-red-700' :
                    selectedEmployee.access_level === 'GESTOR' ? 'bg-purple-100 text-purple-700' :
                    selectedEmployee.access_level === 'RH' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedEmployee.access_level || 'COLABORADOR'}
                  </span>
                </div>
                
                <p className="text-ol-gray-600">
                  {selectedEmployee.cargo} • {selectedEmployee.equipe} • {selectedEmployee.nivel}
                </p>
                
                {/* 🆕 Informações adicionais */}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-ol-gray-500">
                  <span>Admitido em {new Date(selectedEmployee.data_admissao).toLocaleDateString('pt-BR')}</span>
                  
                  {manager && (
                    <>
                      <span>•</span>
                      <span>Gerente: <strong className="text-ol-brand-600">{manager.nome}</strong></span>
                    </>
                  )}
                  
                  <span>•</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    selectedEmployee.status === 'ATIVO' ? 'bg-green-100 text-green-700' :
                    selectedEmployee.status === 'FERIAS' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                onClose();
                setActiveDetailTab('perfil');
              }}
              className="text-ol-gray-400 hover:text-ol-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Abas */}
          <div className="flex space-x-2 mb-6 border-b overflow-x-auto">
            <TabButton id="perfil" label="Perfil" activeTab={activeDetailTab} setActiveTab={setActiveDetailTab} />
            <TabButton id="pdi" label="PDI" activeTab={activeDetailTab} setActiveTab={setActiveDetailTab} />
            <TabButton id="reunioes" label="1x1" activeTab={activeDetailTab} setActiveTab={setActiveDetailTab} />
            <TabButton 
              id="knowledge" 
              label="Conhecimentos" 
              activeTab={activeDetailTab} 
              setActiveTab={setActiveDetailTab} 
              count={employeeKnowledge.filter(v => v.employee_id === selectedEmployee.id).length} 
            />
            <TabButton 
              id="ferias" 
              label="Férias" 
              activeTab={activeDetailTab} 
              setActiveTab={setActiveDetailTab} 
              count={selectedEmployee.ferias?.dias_disponivel || 0}
            />
            <TabButton 
              id="dayoff" 
              label="Day Off" 
              activeTab={activeDetailTab} 
              setActiveTab={setActiveDetailTab} 
              count={selectedEmployee.dayoff?.usado_ano_atual ? 0 : 1}
            />
          </div>

          {/* Conteúdo das abas */}
          <div className="min-h-[400px]">
            {activeDetailTab === 'perfil' && (
              <ProfileTab 
                employee={selectedEmployee} 
                manager={manager}  // 🆕 Para mostrar dados do gerente
              />
            )}
            {activeDetailTab === 'knowledge' && (
              <KnowledgeTab
                employee={selectedEmployee}
                employeeKnowledge={employeeKnowledge}
                setEmployeeKnowledge={setEmployeeKnowledge}
                knowledgeCatalog={knowledgeCatalog}
                onShowAddKnowledgeModal={onShowAddKnowledgeModal}
                onFileUpload={onFileUpload}
              />
            )}
            {activeDetailTab === 'ferias' && (
              <VacationTab
                employee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                setEmployees={setEmployees}
              />
            )}
            {activeDetailTab === 'dayoff' && (
              <DayOffTab
                employee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                setEmployees={setEmployees}
              />
            )}
            {activeDetailTab === 'pdi' && (
              <PDITab
                employee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                setEmployees={setEmployees}
              />
            )}
            {activeDetailTab === 'reunioes' && (
              <MeetingTab
                employee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                setEmployees={setEmployees}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
