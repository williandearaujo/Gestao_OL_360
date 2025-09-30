import React, { useState } from 'react';
import { Building, BarChart3, List, RefreshCw } from 'lucide-react';
import AreasList from './AreasList';
import AreasModal from './AreasModal';
import AreasStats from './AreasStats';
import { useAreas } from '../../hooks/useAreas';

const TabButton = ({ active, onClick, icon: Icon, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      active 
        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{children}</span>
  </button>
);

const AreasTab = ({
  areas,
  employees,
  onAreasUpdate,
  onLogsUpdate
}) => {
  const [activeSection, setActiveSection] = useState('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [refreshing, setRefreshing] = useState(false);

  const { loading, createArea, updateArea, deleteArea } = useAreas();

  const handleAddArea = () => {
    setSelectedArea(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditArea = (area) => {
    setSelectedArea(area);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteArea = async (area) => {
    if (window.confirm(`Tem certeza que deseja excluir a área "${area.nome}"?`)) {
      const result = await deleteArea(area.id, area.nome);

      if (result.success) {
        // Recarregar dados
        if (onAreasUpdate) {
          await handleRefresh();
        }
        if (onLogsUpdate) {
          onLogsUpdate();
        }
      } else {
        alert('Erro ao deletar área: ' + result.error);
      }
    }
  };

  const handleSaveArea = async (areaData) => {
    let result;

    if (modalMode === 'create') {
      result = await createArea(areaData);
    } else {
      result = await updateArea(selectedArea.id, areaData);
    }

    if (result.success) {
      setModalOpen(false);

      // Recarregar dados
      if (onAreasUpdate) {
        await handleRefresh();
      }
      if (onLogsUpdate) {
        onLogsUpdate();
      }
    } else {
      alert('Erro ao salvar área: ' + result.error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Buscar áreas atualizadas
      const response = await fetch('http://localhost:8000/areas');
      const updatedAreas = await response.json();

      if (Array.isArray(updatedAreas) && onAreasUpdate) {
        onAreasUpdate(updatedAreas);
      }
    } catch (error) {
      console.error('Erro ao recarregar áreas:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Áreas</h2>
          <p className="text-gray-600 mt-1">
            Gerencie os departamentos e áreas da organização
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
            refreshing
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      <div className="flex space-x-1">
        <TabButton
          active={activeSection === 'list'}
          onClick={() => setActiveSection('list')}
          icon={List}
        >
          Lista de Áreas
        </TabButton>
        <TabButton
          active={activeSection === 'stats'}
          onClick={() => setActiveSection('stats')}
          icon={BarChart3}
        >
          Estatísticas
        </TabButton>
      </div>

      <div>
        {activeSection === 'list' && (
          <AreasList
            areas={areas}
            employees={employees}
            onAddArea={handleAddArea}
            onEditArea={handleEditArea}
            onDeleteArea={handleDeleteArea}
            loading={loading}
          />
        )}

        {activeSection === 'stats' && (
          <AreasStats
            areas={areas}
            employees={employees}
          />
        )}
      </div>

      <AreasModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        area={selectedArea}
        mode={modalMode}
        onSave={handleSaveArea}
        loading={loading}
      />

      {/* Status da Conexão */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center space-x-4">
          <Building className="w-12 h-12 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Sistema de Áreas Conectado</h3>
            <p className="text-gray-600 text-sm mb-3">
              Gestão de departamentos integrada com backend em tempo real
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>• {areas?.length || 0} áreas cadastradas</span>
              <span>• {areas?.filter(a => a.ativa).length || 0} áreas ativas</span>
              <span>• {employees?.length || 0} colaboradores distribuídos</span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Backend conectado
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreasTab;
