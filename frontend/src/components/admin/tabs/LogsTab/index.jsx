import React, { useState, useCallback, useMemo } from 'react';
import LogStats from './LogStats';
import LogFilters from './LogFilters';
import LogTable from './LogTable';
import LogDetailsModal from '../../modals/LogDetailsModal';
import { auditSystem } from '../../services/auditSystem';

const LogsTab = ({ logs, onLogsUpdate }) => {
  const [logDetailsModal, setLogDetailsModal] = useState({ isOpen: false, log: null });
  const [filters, setFilters] = useState({
    search: '',
    user: '',
    type: '',
    dateStart: '',
    dateEnd: ''
  });

  // Filtrar logs baseado nos filtros aplicados
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = !filters.search ||
        log.action.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.details.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.user.toLowerCase().includes(filters.search.toLowerCase());

      const matchesUser = !filters.user || log.user === filters.user;
      const matchesType = !filters.type || log.type === filters.type;

      const logDate = new Date(log.timestamp).toISOString().split('T')[0];
      const matchesDateStart = !filters.dateStart || logDate >= filters.dateStart;
      const matchesDateEnd = !filters.dateEnd || logDate <= filters.dateEnd;

      return matchesSearch && matchesUser && matchesType && matchesDateStart && matchesDateEnd;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Mais recentes primeiro
  }, [logs, filters]);

  const handleExportLogs = useCallback(() => {
    const dataToExport = filteredLogs.map(log => ({
      id: log.id,
      timestamp: new Date(log.timestamp).toISOString(),
      user: log.user,
      action: log.action,
      details: log.details,
      type: log.type,
      ip: log.ip
    }));

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    auditSystem.log('Exportou logs de auditoria', `${filteredLogs.length} eventos exportados`, 'Willian Araújo');
    onLogsUpdate();
  }, [filteredLogs, onLogsUpdate]);

  const handleClearLogs = useCallback(() => {
    if (confirm(`Tem certeza que deseja limpar todos os ${logs.length} logs de auditoria? Esta ação não pode ser desfeita.`)) {
      auditSystem.clearLogs();
      auditSystem.log('Limpou logs de auditoria', `${logs.length} eventos foram removidos`, 'Willian Araújo');
      onLogsUpdate();
    }
  }, [logs.length, onLogsUpdate]);

  const handleLogDetails = useCallback((log) => {
    setLogDetailsModal({ isOpen: true, log });
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Logs de Auditoria</h2>
        <p className="text-gray-600 mt-1">
          Monitoramento completo de todas as ações realizadas no sistema
        </p>
      </div>

      {/* Estatísticas */}
      <LogStats
        logs={logs}
        onFilterChange={setFilters}
      />

      {/* Filtros */}
      <LogFilters
        filters={filters}
        onFiltersChange={setFilters}
        logs={logs}
        onExport={handleExportLogs}
        onClearLogs={handleClearLogs}
        filteredLogs={filteredLogs}
      />

      {/* Timeline */}
      <LogTable
        logs={filteredLogs}
        onLogDetails={handleLogDetails}
      />

      {/* Modal de Detalhes */}
      <LogDetailsModal
        isOpen={logDetailsModal.isOpen}
        onClose={() => setLogDetailsModal({ isOpen: false, log: null })}
        log={logDetailsModal.log}
      />
    </div>
  );
};

export default LogsTab;
