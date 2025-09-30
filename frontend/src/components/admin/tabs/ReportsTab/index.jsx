import React, { useState, useCallback } from 'react';
import { FileText, BarChart3, History } from 'lucide-react';
import ReportTemplates from './ReportTemplates';
import ExportOptions from './ExportOptions';
import ReportHistory from './ReportHistory';
import { auditSystem } from '../../services/auditSystem';

const TabButton = ({ active, onClick, icon: Icon, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      active 
        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{children}</span>
  </button>
);

const ReportsTab = ({
  analytics,
  realData,
  logs,
  systemHealth,
  onLogsUpdate
}) => {
  const [activeSection, setActiveSection] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [exporting, setExporting] = useState(false);

  const handleGenerateReport = useCallback((template) => {
    setSelectedTemplate(template);
    setActiveSection('export');
  }, []);

  const handleExport = useCallback(async (options) => {
    setExporting(true);

    try {
      // Simular geração do relatório
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Preparar dados para exportação
      const reportData = {
        ...selectedTemplate.data,
        generatedAt: new Date().toISOString(),
        generatedBy: 'Willian Araújo',
        options: options,
        metadata: {
          format: options.format,
          dateRange: options.dateRange,
          includeDetails: options.includeDetails
        }
      };

      // Exportar baseado no formato
      let filename, blob;

      switch (options.format) {
        case 'json':
          filename = `${selectedTemplate.key}-report-${new Date().toISOString().split('T')[0]}.json`;
          blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
          break;

        case 'csv':
          // Mock CSV conversion
          let csvContent = '';
          if (selectedTemplate.key === 'users' && reportData.users) {
            csvContent = 'Nome,Email,Role,Status,Último Acesso\n';
            reportData.users.forEach(user => {
              csvContent += `${user.nome},${user.email},${user.role},${user.status},${user.lastAccess}\n`;
            });
          } else if (selectedTemplate.key === 'activities' && reportData.logs) {
            csvContent = 'Timestamp,Usuário,Ação,Detalhes,Tipo,IP\n';
            reportData.logs.forEach(log => {
              csvContent += `${log.timestamp},${log.user},"${log.action}","${log.details}",${log.type},${log.ip}\n`;
            });
          } else {
            csvContent = JSON.stringify(reportData, null, 2);
          }
          filename = `${selectedTemplate.key}-report-${new Date().toISOString().split('T')[0]}.csv`;
          blob = new Blob([csvContent], { type: 'text/csv' });
          break;

        case 'pdf':
          // Mock PDF - em produção usaria uma lib como jsPDF
          const pdfContent = `
RELATÓRIO: ${selectedTemplate.title.toUpperCase()}
Gerado em: ${new Date().toLocaleString('pt-BR')}
Por: Willian Araújo

${JSON.stringify(reportData, null, 2)}
          `;
          filename = `${selectedTemplate.key}-report-${new Date().toISOString().split('T')[0]}.pdf`;
          blob = new Blob([pdfContent], { type: 'application/pdf' });
          break;

        default:
          throw new Error('Formato não suportado');
      }

      // Download do arquivo
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      // Log da ação
      auditSystem.log(
        'Gerou relatório',
        `${selectedTemplate.title} - ${options.format.toUpperCase()}`,
        'Willian Araújo'
      );

      if (onLogsUpdate) {
        onLogsUpdate();
      }

      // Resetar estado
      setSelectedTemplate(null);
      setActiveSection('templates');

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setExporting(false);
    }
  }, [selectedTemplate, onLogsUpdate]);

  const handleCancelExport = useCallback(() => {
    setSelectedTemplate(null);
    setActiveSection('templates');
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Relatórios Executivos</h2>
        <p className="text-gray-600 mt-1">
          Gere relatórios detalhados e exporte dados do sistema
        </p>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1">
        <TabButton
          active={activeSection === 'templates'}
          onClick={() => setActiveSection('templates')}
          icon={BarChart3}
        >
          Gerar Relatório
        </TabButton>
        <TabButton
          active={activeSection === 'history'}
          onClick={() => setActiveSection('history')}
          icon={History}
        >
          Histórico
        </TabButton>
      </div>

      {/* Content */}
      <div>
        {activeSection === 'templates' && !selectedTemplate && (
          <ReportTemplates
            analytics={analytics}
            realData={realData}
            logs={logs}
            systemHealth={systemHealth}
            onGenerateReport={handleGenerateReport}
          />
        )}

        {activeSection === 'export' && selectedTemplate && (
          <ExportOptions
            selectedTemplate={selectedTemplate}
            onExport={handleExport}
            onCancel={handleCancelExport}
            exporting={exporting}
          />
        )}

        {activeSection === 'history' && (
          <ReportHistory />
        )}
      </div>

      {/* Summary Stats */}
      {activeSection === 'templates' && !selectedTemplate && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center space-x-4">
            <FileText className="w-12 h-12 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Sistema de Relatórios</h3>
              <p className="text-gray-600 text-sm mb-3">
                Exporte dados em múltiplos formatos para análise e apresentação
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>• {analytics.totalUsers} usuários</span>
                <span>• {logs?.length || 0} logs de auditoria</span>
                <span>• {analytics.totalEmployees + analytics.totalKnowledge} registros</span>
                <span>• Formatos: JSON, CSV, PDF</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTab;
