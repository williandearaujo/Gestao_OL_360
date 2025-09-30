import React from 'react';
import { BarChart3, Users, Activity, Settings, FileText, Download } from 'lucide-react';

const TemplateCard = ({
  title,
  description,
  icon: Icon,
  color,
  dataCount,
  onGenerate,
  generating = false
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  };

  return (
    <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-all">
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-3">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{dataCount} registros</span>
            <button
              onClick={onGenerate}
              disabled={generating}
              className={`flex items-center px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                generating
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : `bg-${color}-600 text-white hover:bg-${color}-700`
              }`}
            >
              <Download className="w-4 h-4 mr-1" />
              {generating ? 'Gerando...' : 'Gerar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportTemplates = ({
  analytics,
  realData,
  logs,
  systemHealth,
  onGenerateReport
}) => {
  const templates = [
    {
      key: 'executive',
      title: 'Relatório Executivo',
      description: 'Dashboard consolidado com KPIs e métricas principais',
      icon: BarChart3,
      color: 'blue',
      dataCount: Object.keys(analytics).length,
      data: {
        type: 'executive',
        analytics: analytics,
        systemHealth: systemHealth,
        timestamp: new Date().toISOString(),
        summary: {
          totalUsers: analytics.totalUsers,
          onlineUsers: analytics.onlineUsers,
          totalEmployees: analytics.totalEmployees,
          totalKnowledge: analytics.totalKnowledge,
          systemHealth: analytics.systemHealth
        }
      }
    },
    {
      key: 'users',
      title: 'Relatório de Usuários',
      description: 'Lista completa de usuários com roles e status',
      icon: Users,
      color: 'green',
      dataCount: realData.users?.length || 0,
      data: {
        type: 'users',
        users: realData.users || [],
        summary: {
          total: analytics.totalUsers,
          online: analytics.onlineUsers,
          admins: analytics.adminUsers,
          byRole: {
            admin: realData.users?.filter(u => u.role === 'admin').length || 0,
            diretoria: realData.users?.filter(u => u.role === 'diretoria').length || 0,
            gerente: realData.users?.filter(u => u.role === 'gerente').length || 0,
            colaborador: realData.users?.filter(u => u.role === 'colaborador').length || 0
          }
        }
      }
    },
    {
      key: 'activities',
      title: 'Relatório de Atividades',
      description: 'Logs de auditoria e histórico de ações do sistema',
      icon: Activity,
      color: 'purple',
      dataCount: logs?.length || 0,
      data: {
        type: 'activities',
        logs: logs || [],
        summary: {
          total: logs?.length || 0,
          byType: {
            create: logs?.filter(l => l.type === 'create').length || 0,
            update: logs?.filter(l => l.type === 'update').length || 0,
            delete: logs?.filter(l => l.type === 'delete').length || 0,
            system: logs?.filter(l => l.type === 'system').length || 0
          },
          recentActions: analytics.recentActions,
          uniqueUsers: [...new Set(logs?.map(l => l.user) || [])].length
        }
      }
    },
    {
      key: 'system',
      title: 'Relatório do Sistema',
      description: 'Status de saúde, configurações e métricas técnicas',
      icon: Settings,
      color: 'orange',
      dataCount: 15, // Mock - itens de configuração
      data: {
        type: 'system',
        systemHealth: systemHealth,
        systemInfo: {
          version: '2.1.0',
          environment: process.env.NODE_ENV || 'development',
          uptime: Math.floor((Date.now() - new Date('2025-09-29').getTime()) / 1000 / 60 / 60 / 24),
          responseTime: systemHealth?.responseTime || 0
        },
        resources: {
          totalRecords: (realData.employees?.length || 0) +
                       (realData.knowledge?.length || 0) +
                       (realData.employeeLinks?.length || 0),
          storage: '2.3 GB',
          memoryUsage: '95%'
        }
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Templates de Relatório</h3>
        <p className="text-gray-600">Selecione um template para gerar seu relatório</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(template => (
          <TemplateCard
            key={template.key}
            title={template.title}
            description={template.description}
            icon={template.icon}
            color={template.color}
            dataCount={template.dataCount}
            onGenerate={() => onGenerateReport(template)}
          />
        ))}
      </div>

      {/* Relatório Customizado */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Relatório Customizado</h3>
            <p className="text-gray-600 text-sm mb-3">
              Crie relatórios personalizados com filtros específicos e dados selecionados
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              Criar Customizado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTemplates;
