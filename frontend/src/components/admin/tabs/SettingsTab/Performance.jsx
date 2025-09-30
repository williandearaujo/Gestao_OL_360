import React, { useState, useEffect } from 'react';
import {
  Zap,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  Database,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
          }`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
};

const Performance = ({ systemHealth, realData }) => {
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(false);

  const calculateRealMetrics = () => {
    // Calcular métricas reais baseadas nos dados
    const totalRecords = (realData.employees?.length || 0) +
                        (realData.knowledge?.length || 0) +
                        (realData.employeeLinks?.length || 0) +
                        (realData.users?.length || 0);

    // Storage real do localStorage
    const storageData = {
      employees: JSON.stringify(realData.employees || []),
      knowledge: JSON.stringify(realData.knowledge || []),
      employeeLinks: JSON.stringify(realData.employeeLinks || []),
      users: JSON.stringify(realData.users || []),
      logs: localStorage.getItem('ol_audit_logs') || '[]',
      emailConfig: localStorage.getItem('ol_email_config') || '{}',
      systemConfig: localStorage.getItem('ol_system_config') || '{}'
    };

    const totalStorageSize = Object.values(storageData)
      .reduce((acc, data) => acc + new Blob([data]).size, 0);

    const storageInMB = (totalStorageSize / 1024 / 1024).toFixed(2);
    const storagePercentage = Math.min((totalStorageSize / (10 * 1024 * 1024)) * 100, 100); // Máximo 10MB

    // Performance da API
    const avgResponseTime = systemHealth?.responseTime || 0;
    const apiHealth = avgResponseTime < 500 ? 'excellent' :
                     avgResponseTime < 1000 ? 'good' :
                     avgResponseTime < 2000 ? 'fair' : 'poor';

    // Métricas de sessão
    const sessionStart = sessionStorage.getItem('ol_session_start') || Date.now();
    const sessionDuration = Math.floor((Date.now() - parseInt(sessionStart)) / 1000 / 60); // minutos

    // Performance score calculado
    const performanceScore = Math.max(0, Math.min(100,
      100 - (avgResponseTime / 20) - (storagePercentage * 0.5) + (totalRecords * 0.1)
    ));

    return {
      storage: {
        used: storageInMB,
        percentage: storagePercentage,
        records: totalRecords
      },
      api: {
        responseTime: avgResponseTime,
        health: apiHealth,
        status: systemHealth?.online ? 'online' : 'offline'
      },
      session: {
        duration: sessionDuration,
        requests: parseInt(sessionStorage.getItem('ol_api_requests') || '0')
      },
      performance: {
        score: Math.round(performanceScore),
        trend: Math.floor(Math.random() * 10) - 5 // Mock trend
      }
    };
  };

  const refreshMetrics = async () => {
    setLoading(true);

    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newMetrics = calculateRealMetrics();
    setMetrics(newMetrics);

    setLoading(false);
  };

  useEffect(() => {
    // Salvar início da sessão se não existir
    if (!sessionStorage.getItem('ol_session_start')) {
      sessionStorage.setItem('ol_session_start', Date.now().toString());
    }

    refreshMetrics();
  }, [realData, systemHealth]);

  const getPerformanceColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'orange';
    return 'red';
  };

  const getApiHealthColor = (health) => {
    switch (health) {
      case 'excellent': return 'green';
      case 'good': return 'blue';
      case 'fair': return 'orange';
      case 'poor': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Métricas de Performance</h3>
          <p className="text-gray-600">Monitoramento em tempo real do sistema</p>
        </div>
        <button
          onClick={refreshMetrics}
          disabled={loading}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            loading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Score de Performance"
          value={`${metrics.performance?.score || 0}%`}
          subtitle="Baseado em múltiplas métricas"
          icon={Zap}
          color={getPerformanceColor(metrics.performance?.score || 0)}
          trend={metrics.performance?.trend}
        />

        <MetricCard
          title="Armazenamento"
          value={`${metrics.storage?.used || 0} MB`}
          subtitle={`${metrics.storage?.records || 0} registros`}
          icon={HardDrive}
          color={metrics.storage?.percentage > 80 ? 'red' : metrics.storage?.percentage > 50 ? 'orange' : 'green'}
        />

        <MetricCard
          title="API Response Time"
          value={`${metrics.api?.responseTime || 0}ms`}
          subtitle={`Status: ${metrics.api?.health || 'unknown'}`}
          icon={Clock}
          color={getApiHealthColor(metrics.api?.health)}
        />

        <MetricCard
          title="Sessão Ativa"
          value={`${metrics.session?.duration || 0}min`}
          subtitle={`${metrics.session?.requests || 0} requisições`}
          icon={Cpu}
          color="blue"
        />
      </div>

      {/* Detalhes de Armazenamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Uso de Armazenamento
          </h4>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Dados do Sistema</span>
                <span className="font-medium">{metrics.storage?.used || 0} MB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    (metrics.storage?.percentage || 0) > 80 ? 'bg-red-500' :
                    (metrics.storage?.percentage || 0) > 50 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(metrics.storage?.percentage || 0, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {metrics.storage?.percentage?.toFixed(1) || 0}% de 10 MB utilizados
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Colaboradores</p>
                <p className="font-medium">{realData.employees?.length || 0}</p>
              </div>
              <div>
                <p className="text-gray-600">Conhecimentos</p>
                <p className="font-medium">{realData.knowledge?.length || 0}</p>
              </div>
              <div>
                <p className="text-gray-600">Usuários</p>
                <p className="font-medium">{realData.users?.length || 0}</p>
              </div>
              <div>
                <p className="text-gray-600">Logs</p>
                <p className="font-medium">
                  {JSON.parse(localStorage.getItem('ol_audit_logs') || '[]').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <MemoryStick className="w-5 h-5 mr-2" />
            Performance da API
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status da Conexão</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                systemHealth?.online 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {systemHealth?.online ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tempo de Resposta</span>
              <span className={`font-medium ${
                (metrics.api?.responseTime || 0) < 500 ? 'text-green-600' :
                (metrics.api?.responseTime || 0) < 1000 ? 'text-blue-600' :
                (metrics.api?.responseTime || 0) < 2000 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {metrics.api?.responseTime || 0}ms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Qualidade da Conexão</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                metrics.api?.health === 'excellent' ? 'bg-green-100 text-green-800' :
                metrics.api?.health === 'good' ? 'bg-blue-100 text-blue-800' :
                metrics.api?.health === 'fair' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {metrics.api?.health === 'excellent' ? 'Excelente' :
                 metrics.api?.health === 'good' ? 'Boa' :
                 metrics.api?.health === 'fair' ? 'Regular' : 'Ruim'}
              </span>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                Última verificação: {new Date().toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendações */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">Recomendações de Performance</h4>
        <div className="space-y-2 text-sm">
          {(metrics.storage?.percentage || 0) > 80 && (
            <p className="text-blue-800">
              • Considere limpar logs antigos para liberar armazenamento
            </p>
          )}
          {(metrics.api?.responseTime || 0) > 1000 && (
            <p className="text-blue-800">
              • Tempo de resposta elevado - verifique conexão com a API
            </p>
          )}
          {(metrics.performance?.score || 0) < 60 && (
            <p className="text-blue-800">
              • Score de performance baixo - otimize o sistema
            </p>
          )}
          {(metrics.performance?.score || 0) >= 80 && (
            <p className="text-blue-800">
              • ✅ Sistema operando com excelente performance!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Performance;
