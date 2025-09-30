import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle,
  Palette,
  Globe,
  Shield,
  Clock,
  Bell,
  RefreshCw
} from 'lucide-react';

const GeneralSettings = ({ onLogsUpdate }) => {
  const [config, setConfig] = useState({
    system: {
      companyName: 'OL Gestão de Conhecimentos',
      adminEmail: 'admin@empresa.com',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      dateFormat: 'DD/MM/YYYY',
      autoRefresh: true,
      refreshInterval: 300000 // 5 minutos
    },
    security: {
      sessionTimeout: 3600000, // 1 hora
      loginAttempts: 5,
      requireStrongPassword: true,
      enableAuditLog: true,
      logRetention: 90 // dias
    },
    ui: {
      theme: 'light',
      compactMode: false,
      showAnimations: true,
      defaultPageSize: 10,
      enableNotifications: true
    }
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Carregar configurações salvas
  useEffect(() => {
    const savedConfig = localStorage.getItem('ol_system_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(prev => ({
          ...prev,
          ...parsed
        }));
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  }, []);

  const handleSystemChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      system: {
        ...prev.system,
        [field]: value
      }
    }));
    setSaved(false);
  };

  const handleSecurityChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [field]: value
      }
    }));
    setSaved(false);
  };

  const handleUIChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        [field]: value
      }
    }));
    setSaved(false);
  };

  const saveSettings = async () => {
    setSaving(true);

    try {
      // Salvar no localStorage
      localStorage.setItem('ol_system_config', JSON.stringify(config));

      // Aplicar configurações imediatamente
      if (config.ui.theme) {
        document.documentElement.setAttribute('data-theme', config.ui.theme);
      }

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
          'Atualizou configurações gerais',
          `Tema: ${config.ui.theme}, Empresa: ${config.system.companyName}`,
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Configurações Gerais</h3>
        <p className="text-gray-600">Personalize o comportamento e aparência do sistema</p>
      </div>

      {/* Configurações do Sistema */}
      <div className="bg-white rounded-lg border p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Sistema
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Empresa
            </label>
            <input
              type="text"
              value={config.system.companyName}
              onChange={(e) => handleSystemChange('companyName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail do Administrador
            </label>
            <input
              type="email"
              value={config.system.adminEmail}
              onChange={(e) => handleSystemChange('adminEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuso Horário
            </label>
            <select
              value={config.system.timezone}
              onChange={(e) => handleSystemChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="America/New_York">New York (GMT-5)</option>
              <option value="Europe/London">London (GMT+0)</option>
              <option value="UTC">UTC (GMT+0)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Idioma
            </label>
            <select
              value={config.system.language}
              onChange={(e) => handleSystemChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Formato de Data
            </label>
            <select
              value={config.system.dateFormat}
              onChange={(e) => handleSystemChange('dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intervalo de Atualização
            </label>
            <select
              value={config.system.refreshInterval}
              onChange={(e) => handleSystemChange('refreshInterval', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="60000">1 minuto</option>
              <option value="300000">5 minutos</option>
              <option value="600000">10 minutos</option>
              <option value="1800000">30 minutos</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.system.autoRefresh}
              onChange={(e) => handleSystemChange('autoRefresh', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Atualizar dados automaticamente
            </span>
          </label>
        </div>
      </div>

      {/* Configurações de Segurança */}
      <div className="bg-white rounded-lg border p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Segurança
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timeout de Sessão (minutos)
            </label>
            <select
              value={config.security.sessionTimeout}
              onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1800000">30 minutos</option>
              <option value="3600000">1 hora</option>
              <option value="7200000">2 horas</option>
              <option value="14400000">4 horas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tentativas de Login
            </label>
            <select
              value={config.security.loginAttempts}
              onChange={(e) => handleSecurityChange('loginAttempts', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="3">3 tentativas</option>
              <option value="5">5 tentativas</option>
              <option value="10">10 tentativas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Retenção de Logs (dias)
            </label>
            <select
              value={config.security.logRetention}
              onChange={(e) => handleSecurityChange('logRetention', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="30">30 dias</option>
              <option value="90">90 dias</option>
              <option value="180">180 dias</option>
              <option value="365">1 ano</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.security.requireStrongPassword}
              onChange={(e) => handleSecurityChange('requireStrongPassword', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Exigir senhas fortes (8+ caracteres, números, símbolos)
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.security.enableAuditLog}
              onChange={(e) => handleSecurityChange('enableAuditLog', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Manter log de auditoria de todas as ações
            </span>
          </label>
        </div>
      </div>

      {/* Configurações de Interface */}
      <div className="bg-white rounded-lg border p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Interface
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tema
            </label>
            <select
              value={config.ui.theme}
              onChange={(e) => handleUIChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
              <option value="auto">Automático</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Itens por Página
            </label>
            <select
              value={config.ui.defaultPageSize}
              onChange={(e) => handleUIChange('defaultPageSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">5 itens</option>
              <option value="10">10 itens</option>
              <option value="25">25 itens</option>
              <option value="50">50 itens</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.ui.compactMode}
              onChange={(e) => handleUIChange('compactMode', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Modo compacto (menos espaçamento)
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.ui.showAnimations}
              onChange={(e) => handleUIChange('showAnimations', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Exibir animações e transições
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.ui.enableNotifications}
              onChange={(e) => handleUIChange('enableNotifications', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Ativar notificações do navegador
            </span>
          </label>
        </div>
      </div>

      {/* Preview das Configurações */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">Preview das Configurações</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-800">
              <strong>Empresa:</strong> {config.system.companyName}
            </p>
            <p className="text-blue-800">
              <strong>Tema:</strong> {config.ui.theme === 'light' ? 'Claro' : config.ui.theme === 'dark' ? 'Escuro' : 'Automático'}
            </p>
            <p className="text-blue-800">
              <strong>Idioma:</strong> {config.system.language === 'pt-BR' ? 'Português' : 'Inglês'}
            </p>
          </div>
          <div>
            <p className="text-blue-800">
              <strong>Auto-refresh:</strong> {config.system.autoRefresh ? 'Ativo' : 'Desativo'}
            </p>
            <p className="text-blue-800">
              <strong>Timeout:</strong> {config.security.sessionTimeout / 60000} minutos
            </p>
            <p className="text-blue-800">
              <strong>Retenção de logs:</strong> {config.security.logRetention} dias
            </p>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            const defaultConfig = {
              system: {
                companyName: 'OL Gestão de Conhecimentos',
                adminEmail: 'admin@empresa.com',
                timezone: 'America/Sao_Paulo',
                language: 'pt-BR',
                dateFormat: 'DD/MM/YYYY',
                autoRefresh: true,
                refreshInterval: 300000
              },
              security: {
                sessionTimeout: 3600000,
                loginAttempts: 5,
                requireStrongPassword: true,
                enableAuditLog: true,
                logRetention: 90
              },
              ui: {
                theme: 'light',
                compactMode: false,
                showAnimations: true,
                defaultPageSize: 10,
                enableNotifications: true
              }
            };
            setConfig(defaultConfig);
            setSaved(false);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2 inline" />
          Restaurar Padrões
        </button>

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

export default GeneralSettings;
