import React from 'react';
import { Server, Code, Globe, HardDrive, Cpu, MemoryStick } from 'lucide-react';

const InfoCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

const SystemInfo = ({ systemHealth, realData }) => {
  // Calcular métricas do sistema
  const totalRecords = (realData.employees?.length || 0) +
                      (realData.knowledge?.length || 0) +
                      (realData.employeeLinks?.length || 0);

  const systemVersion = '2.1.0';
  const environment = process.env.NODE_ENV || 'development';
  const buildDate = '2025-09-29';
  const uptime = Math.floor((Date.now() - new Date('2025-09-29').getTime()) / 1000 / 60 / 60 / 24);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Informações do Sistema</h3>
        <p className="text-gray-600">Detalhes técnicos e métricas do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard
          title="Versão do Sistema"
          value={`v${systemVersion}`}
          subtitle={`Build: ${buildDate}`}
          icon={Code}
          color="blue"
        />

        <InfoCard
          title="Ambiente"
          value={environment.charAt(0).toUpperCase() + environment.slice(1)}
          subtitle={systemHealth?.online ? "Online" : "Offline"}
          icon={Globe}
          color={systemHealth?.online ? "green" : "red"}
        />

        <InfoCard
          title="Uptime"
          value={`${uptime} dias`}
          subtitle="Desde o último deploy"
          icon={Server}
          color="purple"
        />

        <InfoCard
          title="Registros Totais"
          value={totalRecords.toLocaleString()}
          subtitle="Dados no sistema"
          icon={HardDrive}
          color="green"
        />

        <InfoCard
          title="Performance"
          value={`${systemHealth?.responseTime || 0}ms`}
          subtitle="Tempo de resposta médio"
          icon={Cpu}
          color={systemHealth?.responseTime > 1000 ? "orange" : "green"}
        />

        <InfoCard
          title="Armazenamento"
          value="2.3 GB"
          subtitle="49.7 GB disponível"
          icon={MemoryStick}
          color="orange"
        />
      </div>

      {/* Detalhes técnicos */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Especificações Técnicas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">Frontend</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• React 18.2.0</li>
              <li>• Vite 4.4.5</li>
              <li>• TailwindCSS 3.3.3</li>
              <li>• Lucide React Icons</li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">Backend</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• FastAPI Python</li>
              <li>• SQLAlchemy ORM</li>
              <li>• PostgreSQL Database</li>
              <li>• RESTful API</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;
