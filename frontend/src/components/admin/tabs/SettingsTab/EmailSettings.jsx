import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, XCircle, Save, TestTube } from 'lucide-react';

const EmailSettings = ({ onLogsUpdate }) => {
  const [config, setConfig] = useState({
    smtp: {
      host: '',
      port: '',
      username: '',
      password: '',
      secure: true,
      from: ''
    },
    notifications: {
      newUser: true,
      systemAlerts: true,
      reports: false,
      backups: true
    }
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Carregar configurações salvas
  useEffect(() => {
    const savedConfig = localStorage.getItem('ol_email_config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Erro ao carregar configurações de email:', error);
      }
    }
  }, []);

  const handleSMTPChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      smtp: {
        ...prev.smtp,
        [field]: value
      }
    }));
    setSaved(false);
  };

  const handleNotificationChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
    setSaved(false);
  };

  const testConnection = async () => {
    if (!config.smtp.host || !config.smtp.port) {
      setTestResult({ success: false, message: 'Host e porta são obrigatórios' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    // Simular teste de conexão SMTP
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular sucesso/falha baseado na configuração
      const isValidHost = config.smtp.host.includes('smtp');
      const isValidPort = ['587', '465', '25'].includes(config.smtp.port);

      if (isValidHost && isValidPort) {
        setTestResult({
          success: true,
          message: 'Conexão SMTP estabelecida com sucesso!'
        });
      } else {
        setTestResult({
          success: false,
          message: 'Falha na conexão. Verifique host e porta.'
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Erro ao testar conexão: ' + error.message
      });
    } finally {
      setTesting(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);

    try {
      // Salvar no localStorage
      localStorage.setItem('ol_email_config', JSON.stringify(config));

      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSaved(true);

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
              type: 'update',
              ip: '192.168.1.100'
            };
            logs.unshift(newLog);
            localStorage.setItem('ol_audit_logs', JSON.stringify(logs));
          }
        };

        auditSystem.log(
          'Atualizou configurações de e-mail',
          `SMTP: ${config.smtp.host}:${config.smtp.port}`,
          'Willian Araújo'
        );
        onLogsUpdate();
      }

      // Remover indicação de salvo após 3 segundos
      setTimeout(() => setSaved(false), 3000);

    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setSaving(false);
    }
  };

  const isConfigured = config.smtp.host && config.smtp.port && config.smtp.from;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Configurações de E-mail</h3>
        <p className="text-gray-600">Configure SMTP e notificações por e-mail</p>
      </div>

      {/* Status */}
      <div className={`rounded-lg border p-4 ${
        isConfigured 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center space-x-3">
          {isConfigured ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-yellow-600" />
          )}
          <div>
            <p className={`font-medium ${
              isConfigured ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {isConfigured ? 'E-mail Configurado' : 'E-mail Não Configurado'}
            </p>
            <p className={`text-sm ${
              isConfigured ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {isConfigured
                ? `SMTP: ${config.smtp.host}:${config.smtp.port}`
                : 'Configure o servidor SMTP para ativar notificações'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Configuração SMTP */}
      <div className="bg-white rounded-lg border p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Servidor SMTP
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Host SMTP *
            </label>
            <input
              type="text"
              value={config.smtp.host}
              onChange={(e) => handleSMTPChange('host', e.target.value)}
              placeholder="smtp.gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Porta *
            </label>
            <input
              type="number"
              value={config.smtp.port}
              onChange={(e) => handleSMTPChange('port', e.target.value)}
              placeholder="587"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuário
            </label>
            <input
              type="text"
              value={config.smtp.username}
              onChange={(e) => handleSMTPChange('username', e.target.value)}
              placeholder="seu-email@gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={config.smtp.password}
              onChange={(e) => handleSMTPChange('password', e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail Remetente *
          </label>
          <input
            type="email"
            value={config.smtp.from}
            onChange={(e) => handleSMTPChange('from', e.target.value)}
            placeholder="sistema@empresa.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.smtp.secure}
              onChange={(e) => handleSMTPChange('secure', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Usar conexão segura (SSL/TLS)
            </span>
          </label>
        </div>

        {/* Teste de Conexão */}
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={testConnection}
            disabled={testing || !config.smtp.host || !config.smtp.port}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              testing
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <TestTube className="w-4 h-4 mr-2" />
            {testing ? 'Testando...' : 'Testar Conexão'}
          </button>

          {testResult && (
            <div className={`flex items-center space-x-2 ${
              testResult.success ? 'text-green-600' : 'text-red-600'
            }`}>
              {testResult.success ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{testResult.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Configurações de Notificação */}
      <div className="bg-white rounded-lg border p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Notificações</h4>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Novos Usuários</span>
              <p className="text-xs text-gray-500">Notificar quando novos usuários são criados</p>
            </div>
            <input
              type="checkbox"
              checked={config.notifications.newUser}
              onChange={(e) => handleNotificationChange('newUser', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Alertas do Sistema</span>
              <p className="text-xs text-gray-500">Notificar sobre problemas críticos</p>
            </div>
            <input
              type="checkbox"
              checked={config.notifications.systemAlerts}
              onChange={(e) => handleNotificationChange('systemAlerts', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Relatórios</span>
              <p className="text-xs text-gray-500">Enviar relatórios por e-mail</p>
            </div>
            <input
              type="checkbox"
              checked={config.notifications.reports}
              onChange={(e) => handleNotificationChange('reports', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Backups</span>
              <p className="text-xs text-gray-500">Notificar sobre status de backups</p>
            </div>
            <input
              type="checkbox"
              checked={config.notifications.backups}
              onChange={(e) => handleNotificationChange('backups', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={saveSettings}
          disabled={saving}
          className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
            saved
              ? 'bg-green-600 text-white'
              : saving
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Salvo!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EmailSettings;
