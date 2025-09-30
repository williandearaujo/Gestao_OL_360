// ✅ SISTEMA DE AUDITORIA
export const auditSystem = {
  log: (action, details, user = 'Sistema') => {
    const logs = JSON.parse(localStorage.getItem('ol_audit_logs') || '[]');
    const newLog = {
      id: Date.now(),
      user,
      action,
      details,
      timestamp: new Date(),
      type: action.toLowerCase().includes('criou') ? 'create' :
            action.toLowerCase().includes('atualizou') ? 'update' :
            action.toLowerCase().includes('deletou') ? 'delete' : 'system',
      ip: '192.168.1.100'
    };

    logs.unshift(newLog);
    const trimmedLogs = logs.slice(0, 100);
    localStorage.setItem('ol_audit_logs', JSON.stringify(trimmedLogs));

    return newLog;
  },

  getLogs: () => {
    return JSON.parse(localStorage.getItem('ol_audit_logs') || '[]')
      .map(log => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
  },

  clearLogs: () => {
    localStorage.removeItem('ol_audit_logs');
  },

  exportLogs: (logs) => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }
};
