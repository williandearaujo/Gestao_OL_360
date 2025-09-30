import React, { useState } from 'react';
import {
  Download,
  Upload,
  Database,
  Calendar,
  CheckCircle,
  AlertTriangle,
  FileText,
  HardDrive
} from 'lucide-react';

const BackupCard = ({ title, description, icon: Icon, action, actionText, color = 'blue', disabled = false }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          <button
            onClick={action}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : `bg-${color}-600 text-white hover:bg-${color}-700`
            }`}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

const BackupHistory = () => {
  const backupHistory = [
    {
      id: 1,
      date: new Date('2025-09-29T10:30:00'),
      type: 'Automático',
      size: '2.3 MB',
      status: 'success'
    },
    {
      id: 2,
      date: new Date('2025-09-28T10:30:00'),
      type: 'Automático',
      size: '2.1 MB',
      status: 'success'
    },
    {
      id: 3,
      date: new Date('2025-09-27T15:45:00'),
      type: 'Manual',
      size: '2.2 MB',
      status: 'success'
    },
    {
      id: 4,
      date: new Date('2025-09-26T10:30:00'),
      type: 'Automático',
      size: '1.9 MB',
      status: 'failed'
    }
  ];

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Histórico de Backups</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {backupHistory.map(backup => (
            <div key={backup.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  backup.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {backup.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Backup {backup.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    {backup.date.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{backup.size}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  backup.status === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {backup.status === 'success' ? 'Sucesso' : 'Falhou'}
                </span>
                {backup.status === 'success' && (
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BackupRestore = ({ realData, onLogsUpdate }) => {
  const [processing, setProcessing] = useState(false);

  const handleBackup = async () => {
    setProcessing(true);

    try {
      // Simular processo de backup
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Criar arquivo de backup com dados reais
      const backupData = {
        timestamp: new Date().toISOString(),
        version: '2.1.0',
        data: {
          users: realData.users || [],
          employees: realData.employees || [],
          knowledge: realData.knowledge || [],
          employeeLinks: realData.employeeLinks || [],
          logs: JSON.parse(localStorage.getItem('ol_audit_logs') || '[]')
        },
        metadata: {
          totalRecords: (realData.users?.length || 0) +
                       (realData.employees?.length || 0) +
                       (realData.knowledge?.length || 0),
          backupType: 'manual'
        }
      };

      // Download do arquivo
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ol-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      // Log da ação
      if (onLogsUpdate) {
        const auditSystem = {
          log: (action, details, user = 'Sistema') => {
            const logs = JSON.parse(localStorage.getItem('ol_audit_logs') || '[]');
            const newLog = {
              id: Date.now(),
              user,
              action,
              details,
              timestamp: new Date(),
              type: 'system',
              ip: '192.168.1.100'
            };
            logs.unshift(newLog);
            localStorage.setItem('ol_audit_logs', JSON.stringify(logs));
          }
        };

        auditSystem.log('Criou backup do sistema', `${backupData.metadata.totalRecords} registros salvos`, 'Willian Araújo');
        onLogsUpdate();
      }

    } catch (error) {
      console.error('Erro no backup:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setProcessing(true);
        // Simular processo de restore
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('Restore simulado com sucesso! Em produção, os dados seriam restaurados.');
        setProcessing(false);
      }
    };
    input.click();
  };

  const handleScheduleBackup = () => {
    alert('Configuração de backup automático será implementada na próxima versão!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Backup & Restauração</h3>
        <p className="text-gray-600">Gerencie backups e restauração dos dados do sistema</p>
      </div>

      {/* Cards de Ação */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BackupCard
          title="Backup Manual"
          description="Criar backup completo dos dados do sistema agora"
          icon={Download}
          action={handleBackup}
          actionText={processing ? "Criando..." : "Criar Backup"}
          color="blue"
          disabled={processing}
        />

        <BackupCard
          title="Restaurar Dados"
          description="Restaurar sistema a partir de um arquivo de backup"
          icon={Upload}
          action={handleRestore}
          actionText={processing ? "Restaurando..." : "Selecionar Arquivo"}
          color="green"
          disabled={processing}
        />

        <BackupCard
          title="Backup Automático"
          description="Configurar backups automáticos diários"
          icon={Calendar}
          action={handleScheduleBackup}
          actionText="Configurar"
          color="orange"
        />
      </div>

      {/* Informações do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Dados no Sistema</p>
              <p className="text-2xl font-bold text-gray-900">
                {(realData.users?.length || 0) +
                 (realData.employees?.length || 0) +
                 (realData.knowledge?.length || 0)}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Registros totais</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-3 mb-3">
            <HardDrive className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Tamanho Estimado</p>
              <p className="text-2xl font-bold text-gray-900">2.3 MB</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Para backup completo</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Último Backup</p>
              <p className="text-2xl font-bold text-gray-900">Hoje</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">10:30 - Automático</p>
        </div>
      </div>

      {/* Histórico */}
      <BackupHistory />

      {/* Aviso */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Importante</h4>
            <p className="text-yellow-700 text-sm mt-1">
              Mantenha backups regulares em local seguro. Em caso de restauração,
              todos os dados atuais serão substituídos pelos dados do backup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
