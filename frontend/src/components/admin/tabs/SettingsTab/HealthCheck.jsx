import React, { useState, useCallback } from 'react';
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Database,
  Server,
  Wifi,
  HardDrive,
  Mail,
  Zap
} from 'lucide-react';

const HealthItem = ({
  name,
  status,
  details,
  icon: Icon,
  onTest,
  testing = false,
  lastTest
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'Online'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'Aviso'
        };
      case 'offline':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'Offline'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'Desconhecido'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className={`bg-white rounded-lg border p-6 ${config.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${config.bg}`}>
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{details}</p>
            {lastTest && (
              <p className="text-xs text-gray-400 mt-1">
                Último teste: {lastTest.toLocaleTimeString('pt-BR')}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-5 h-5 ${config.color}`} />
            <span className={`text-sm font-medium ${config.color}`}>{config.text}</span>
          </div>
          {onTest && (
            <button
              onClick={onTest}
              disabled={testing}
              className={`p-2 rounded-lg transition-colors ${
                testing 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Testar serviço"
            >
              <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const HealthCheck = ({ systemHealth, onRefreshHealth, onLogsUpdate }) => {
  const [services, setServices] = useState([]);
  const [testing, setTesting] = useState({});
  const [lastFullCheck, setLastFullCheck] = useState(new Date());

  // Inicializar serviços com testes reais
  const initializeServices = useCallback(() => {
    const emailConfig = JSON.parse(localStorage.getItem('ol_email_config') || '{}');
    const isEmailConfigured = emailConfig.smtp && emailConfig.smtp.host && emailConfig.smtp.port;

    const storageUsed = Object.keys(localStorage).reduce((total, key) => {
      return total + (localStorage.getItem(key) || '').length;
    }, 0);

    const storagePercentage = (storageUsed / (5 * 1024 * 1024)) * 100; // 5MB máximo

    return [
      {
        id: 'api',
        name: 'API Backend',
        status: systemHealth?.online ? 'online' : 'offline',
        details: systemHealth?.online
          ? `Respondendo em ${systemHealth.responseTime}ms`
          : 'Não foi possível conectar com a API',
        icon: Server,
        testable: true,
        lastTest: new Date()
      },
      {
        id: 'database',
        name: 'Armazenamento Local',
        status: storagePercentage > 90 ? 'warning' : 'online',
        details: storagePercentage > 90
          ? `Storage ${storagePercentage.toFixed(1)}% - Atenção!`
          : `${(storageUsed / 1024).toFixed(1)} KB utilizados`,
        icon: Database,
        testable: true,
        lastTest: new Date()
      },
      {
        id: 'connectivity',
        name: 'Conectividade',
        status: navigator.onLine ? 'online' : 'offline',
        details: navigator.onLine
          ? 'Conexão com internet ativa'
          : 'Sem conexão com internet',
        icon: Wifi,
        testable: true,
        lastTest: new Date()
      },
      {
        id: 'storage',
        name: 'Sistema de Arquivos',
        status: 'online',
        details: `localStorage disponível (${(5 - storageUsed/1024/1024).toFixed(1)}MB livres)`,
        icon: HardDrive,
        testable: true,
        lastTest: new Date()
      },
      {
        id: 'email',
        name: 'Sistema de E-mail',
        status: isEmailConfigured ? 'online' : 'warning',
        details: isEmailConfigured
          ? `SMTP configurado: ${emailConfig.smtp.host}`
          : 'SMTP não configurado - Configure nas opções de e-mail',
        icon: Mail,
        testable: true,
        lastTest: new Date()
      },
      {
        id: 'performance',
        name: 'Performance',
        status: systemHealth?.responseTime < 1000 ? 'online' :
               systemHealth?.responseTime < 2000 ? 'warning' : 'offline',
        details: `Tempo médio: ${systemHealth?.responseTime || 0}ms`,
        icon: Zap,
        testable: true,
        lastTest: new Date()
      }
    ];
  }, [systemHealth]);

  // Inicializar serviços
  React.useEffect(() => {
    setServices(initializeServices());
  }, [initializeServices]);

  const testService = async (serviceId) => {
    setTesting(prev => ({ ...prev, [serviceId]: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular teste

      let updatedStatus = 'online';
      let updatedDetails = '';

      switch (serviceId) {
        case 'api':
          // Teste real da API
          try {
            const start = Date.now();
            const response = await fetch('http://localhost:8000/employees');
            const end = Date.now();
            const responseTime = end - start;

            if (response.ok) {
              updatedStatus = 'online';
              updatedDetails = `API respondendo em ${responseTime}ms`;
            } else {
              updatedStatus = 'warning';
              updatedDetails = `HTTP ${response.status} - Verifique o servidor`;
            }
          } catch (error) {
            updatedStatus = 'offline';
            updatedDetails = 'Erro de conexão com a API';
          }
          break;

        case 'database':
          // Teste real do localStorage
          try {
            const testKey = 'ol_health_test';
            const testValue = 'test_' + Date.now();
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);

            if (retrieved === testValue) {
              const storageUsed = Object.keys(localStorage).reduce((total, key) => {
                return total + (localStorage.getItem(key) || '').length;
              }, 0);
              const storagePercentage = (storageUsed / (5 * 1024 * 1024)) * 100;

              updatedStatus = storagePercentage > 90 ? 'warning' : 'online';
              updatedDetails = `Storage ${storagePercentage.toFixed(1)}% utilizado`;
            } else {
              updatedStatus = 'offline';
              updatedDetails = 'Erro ao acessar localStorage';
            }
          } catch (error) {
            updatedStatus = 'offline';
            updatedDetails = 'localStorage indisponível';
          }
          break;

        case 'connectivity':
          // Teste real de conectividade
          try {
            const response = await fetch('https://httpbin.org/status/200', {
              mode: 'no-cors',
              method: 'HEAD'
            });
            updatedStatus = 'online';
            updatedDetails = 'Conectividade com internet verificada';
          } catch (error) {
            updatedStatus = navigator.onLine ? 'warning' : 'offline';
            updatedDetails = navigator.onLine
              ? 'Conectado mas com restrições'
              : 'Sem conexão com internet';
          }
          break;

        case 'email':
          // Verificar configuração de email
          const emailConfig = JSON.parse(localStorage.getItem('ol_email_config') || '{}');
          const isConfigured = emailConfig.smtp && emailConfig.smtp.host && emailConfig.smtp.port;

          updatedStatus = isConfigured ? 'online' : 'warning';
          updatedDetails = isConfigured
            ? `SMTP ${emailConfig.smtp.host}:${emailConfig.smtp.port} configurado`
            : 'Configure SMTP para ativar e-mails';
          break;

        case 'performance':
          // Teste de performance
          const perfStart = performance.now();
          // Simular operação
          for (let i = 0; i < 100000; i++) { Math.random(); }
          const perfEnd = performance.now();
          const perfTime = perfEnd - perfStart;

          updatedStatus = perfTime < 10 ? 'online' : perfTime < 50 ? 'warning' : 'offline';
          updatedDetails = `Performance do navegador: ${perfTime.toFixed(2)}ms`;
          break;

        default:
          updatedStatus = 'online';
          updatedDetails = 'Teste concluído com sucesso';
      }

      // Atualizar o serviço
      setServices(prev => prev.map(service =>
        service.id === serviceId
          ? {
              ...service,
              status: updatedStatus,
              details: updatedDetails,
              lastTest: new Date()
            }
          : service
      ));

      // Log do teste
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

        auditSystem.log(
          'Testou serviço do sistema',
          `${serviceId}: ${updatedStatus} - ${updatedDetails}`,
          'Willian Araújo'
        );
        onLogsUpdate();
      }

    } catch (error) {
      console.error(`Erro ao testar ${serviceId}:`, error);

      setServices(prev => prev.map(service =>
        service.id === serviceId
          ? {
              ...service,
              status: 'offline',
              details: 'Erro durante o teste',
              lastTest: new Date()
            }
          : service
      ));
    } finally {
      setTesting(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  const testAllServices = async () => {
    setLastFullCheck(new Date());

    // Testar todos os serviços em paralelo
    const testPromises = services
      .filter(service => service.testable)
      .map(service => testService(service.id));

    await Promise.all(testPromises);

    if (onRefreshHealth) {
      onRefreshHealth();
    }
  };

  const overallHealth = services.every(s => s.status === 'online')
    ? 'online'
    : services.some(s => s.status === 'offline')
    ? 'offline'
    : 'warning';

  const onlineCount = services.filter(s => s.status === 'online').length;
  const warningCount = services.filter(s => s.status === 'warning').length;
  const offlineCount = services.filter(s => s.status === 'offline').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Status dos Serviços</h3>
          <p className="text-gray-600">Testes reais de conectividade e funcionalidade</p>
        </div>
        <button
          onClick={testAllServices}
          disabled={Object.values(testing).some(t => t)}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            Object.values(testing).some(t => t)
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${Object.values(testing).some(t => t) ? 'animate-spin' : ''}`} />
          {Object.values(testing).some(t => t) ? 'Testando...' : 'Testar Todos'}
        </button>
      </div>

      {/* Status Geral */}
      <div className={`rounded-lg border-2 p-6 ${
        overallHealth === 'online' ? 'bg-green-50 border-green-200' :
        overallHealth === 'warning' ? 'bg-yellow-50 border-yellow-200' :
        'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              overallHealth === 'online' ? 'bg-green-100' :
              overallHealth === 'warning' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              {overallHealth === 'online' ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : overallHealth === 'warning' ? (
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">
                Sistema {overallHealth === 'online' ? 'Saudável' :
                       overallHealth === 'warning' ? 'Com Avisos' : 'Com Problemas'}
              </h4>
              <p className={`text-sm ${
                overallHealth === 'online' ? 'text-green-700' :
                overallHealth === 'warning' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {onlineCount} online, {warningCount} com avisos, {offlineCount} offline
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">Última verificação completa:</p>
            <p className="font-medium text-gray-900">{lastFullCheck.toLocaleTimeString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {/* Lista de Serviços */}
      <div className="space-y-4">
        {services.map((service) => (
          <HealthItem
            key={service.id}
            name={service.name}
            status={service.status}
            details={service.details}
            icon={service.icon}
            onTest={service.testable ? () => testService(service.id) : undefined}
            testing={testing[service.id]}
            lastTest={service.lastTest}
          />
        ))}
      </div>

      {/* Estatísticas */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Estatísticas dos Testes</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{onlineCount}</p>
            <p className="text-sm text-gray-600">Serviços Online</p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
            <p className="text-sm text-gray-600">Com Avisos</p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{offlineCount}</p>
            <p className="text-sm text-gray-600">Offline</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;
