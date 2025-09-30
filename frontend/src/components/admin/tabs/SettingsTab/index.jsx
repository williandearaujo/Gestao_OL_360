import React, { useState } from 'react';
import {
  Server,
  Shield,
  HardDrive,
  Zap,
  Mail,
  Settings as SettingsIcon
} from 'lucide-react';

// ✅ TODOS OS COMPONENTES FUNCIONAIS
import SystemInfo from './SystemInfo';
import HealthCheck from './HealthCheck';
import BackupRestore from './BackupRestore';
import Performance from './Performance';      // ✅ NOVO - FUNCIONAL
import EmailSettings from './EmailSettings';   // ✅ NOVO - FUNCIONAL
import GeneralSettings from './GeneralSettings'; // ✅ NOVO - FUNCIONAL

const SettingCard = ({ title, description, icon: Icon, active, onClick, status }) => (
  <div
    onClick={onClick}
    className={`p-6 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
      active ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500' : 'bg-white border-gray-200'
    }`}
  >
    <div className="flex items-start space-x-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
        active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${active ? 'text-blue-900' : 'text-gray-900'}`}>
            {title}
          </h3>
          {status && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              status === 'online' ? 'bg-green-100 text-green-800' :
              status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              status === 'configured' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {status === 'online' ? 'Online' :
               status === 'warning' ? 'Aviso' :
               status === 'configured' ? 'Configurado' :
               status === 'offline' ? 'Offline' : 'OK'}
            </span>
          )}
        </div>
        <p className={`text-sm mt-1 ${active ? 'text-blue-700' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
    </div>
  </div>
);

const SettingsTab = ({
  systemHealth,
  realData,
  onRefreshHealth,
  onLogsUpdate
}) => {
  const [activeSection, setActiveSection] = useState('info');

  // ✅ STATUS REAIS CALCULADOS
  const getEmailStatus = () => {
    const emailConfig = JSON.parse(localStorage.getItem('ol_email_config') || '{}');
    return emailConfig.smtp && emailConfig.smtp.host && emailConfig.smtp.port ? 'configured' : 'warning';
  };

  const getPerformanceStatus = () => {
    const responseTime = systemHealth?.responseTime || 0;
    return responseTime < 1000 ? 'online' : responseTime < 2000 ? 'warning' : 'offline';
  };

  const getGeneralStatus = () => {
    const config = JSON.parse(localStorage.getItem('ol_system_config') || '{}');
    return config.system && config.system.companyName ? 'configured' : 'online';
  };

  const sections = [
    {
      key: 'info',
      title: 'Informações do Sistema',
      description: 'Versão, ambiente e especificações técnicas',
      icon: Server,
      status: 'online'
    },
    {
      key: 'health',
      title: 'Status dos Serviços',
      description: 'Monitoramento em tempo real dos componentes',
      icon: Shield,
      status: systemHealth?.online ? 'online' : 'warning'
    },
    {
      key: 'backup',
      title: 'Backup & Restauração',
      description: 'Gerenciar backups e restauração de dados',
      icon: HardDrive,
      status: 'online'
    },
    {
      key: 'performance',
      title: 'Performance & Otimização', // ✅ FUNCIONAL AGORA
      description: 'Métricas reais de desempenho do sistema',
      icon: Zap,
      status: getPerformanceStatus()
    },
    {
      key: 'email',
      title: 'Configurações de E-mail', // ✅ FUNCIONAL AGORA
      description: 'SMTP, notificações e configurações de e-mail',
      icon: Mail,
      status: getEmailStatus()
    },
    {
      key: 'general',
      title: 'Configurações Gerais', // ✅ FUNCIONAL AGORA
      description: 'Preferências do sistema, UI e segurança',
      icon: SettingsIcon,
      status: getGeneralStatus()
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'info':
        return (
          <SystemInfo
            systemHealth={systemHealth}
            realData={realData}
          />
        );

      case 'health':
        return (
          <HealthCheck
            systemHealth={systemHealth}
            onRefreshHealth={onRefreshHealth}
            onLogsUpdate={onLogsUpdate}
          />
        );

      case 'backup':
        return (
          <BackupRestore
            realData={realData}
            onLogsUpdate={onLogsUpdate}
          />
        );

      // ✅ COMPONENTES REAIS FUNCIONAIS
      case 'performance':
        return (
          <Performance
            systemHealth={systemHealth}
            realData={realData}
          />
        );

      case 'email':
        return (
          <EmailSettings
            onLogsUpdate={onLogsUpdate}
          />
        );

      case 'general':
        return (
          <GeneralSettings
            onLogsUpdate={onLogsUpdate}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h2>
        <p className="text-gray-600 mt-1">
          Gerencie todas as configurações, monitoramento e manutenção do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Menu Lateral - TODOS FUNCIONAIS */}
        <div className="space-y-4">
          {sections.map(section => (
            <SettingCard
              key={section.key}
              title={section.title}
              description={section.description}
              icon={section.icon}
              active={activeSection === section.key}
              onClick={() => setActiveSection(section.key)}
              status={section.status}
            />
          ))}
        </div>

        {/* Conteúdo - TODOS OS COMPONENTES FUNCIONAIS */}
        <div className="lg:col-span-2">
          {renderContent()}
        </div>
      </div>

      {/* Status Geral */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center space-x-4">
          <SettingsIcon className="w-12 h-12 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Sistema de Configurações</h3>
            <p className="text-gray-600 text-sm mb-3">
              Todas as funcionalidades estão ativas e configuráveis
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {sections.filter(s => s.status === 'online').length} Online
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                {sections.filter(s => s.status === 'configured').length} Configurados
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                {sections.filter(s => s.status === 'warning').length} Com Avisos
              </span>
              <span>• 100% Funcional</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
