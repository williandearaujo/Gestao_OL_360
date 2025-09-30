import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

const FormatOption = ({ format, selected, onSelect, icon: Icon, description }) => (
  <div
    onClick={() => onSelect(format)}
    className={`p-4 rounded-lg border cursor-pointer transition-all ${
      selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
    }`}
  >
    <div className="flex items-center space-x-3">
      <Icon className={`w-5 h-5 ${selected ? 'text-blue-600' : 'text-gray-500'}`} />
      <div>
        <p className={`font-medium ${selected ? 'text-blue-900' : 'text-gray-900'}`}>
          {format.toUpperCase()}
        </p>
        <p className={`text-sm ${selected ? 'text-blue-700' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
    </div>
  </div>
);

const ExportOptions = ({
  selectedTemplate,
  onExport,
  onCancel,
  exporting = false
}) => {
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [includeDetails, setIncludeDetails] = useState(true);

  const formats = [
    {
      key: 'json',
      icon: FileText,
      description: 'Formato estruturado para análise técnica'
    },
    {
      key: 'csv',
      icon: FileText,
      description: 'Planilha compatível com Excel'
    },
    {
      key: 'pdf',
      icon: FileText,
      description: 'Documento formatado para apresentação'
    }
  ];

  const handleExport = () => {
    const options = {
      format: selectedFormat,
      dateRange: dateRange,
      includeDetails: includeDetails,
      template: selectedTemplate
    };
    onExport(options);
  };

  if (!selectedTemplate) return null;

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Opções de Exportação</h3>
          <p className="text-gray-600">Configure seu relatório: {selectedTemplate.title}</p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">

        {/* Formato */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Formato de Exportação
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {formats.map(format => (
              <FormatOption
                key={format.key}
                format={format.key}
                selected={selectedFormat === format.key}
                onSelect={setSelectedFormat}
                icon={format.icon}
                description={format.description}
              />
            ))}
          </div>
        </div>

        {/* Período */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Calendar className="w-4 h-4 inline mr-2" />
            Período dos Dados
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Data Início</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Data Fim</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Opções Adicionais */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Filter className="w-4 h-4 inline mr-2" />
            Opções Adicionais
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeDetails}
                onChange={(e) => setIncludeDetails(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Incluir detalhes completos nos dados
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={true}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Incluir timestamp de geração
              </span>
            </label>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Preview do Relatório</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Formato: <span className="font-medium">{selectedFormat.toUpperCase()}</span></p>
            <p>• Período: <span className="font-medium">{dateRange.start} até {dateRange.end}</span></p>
            <p>• Registros: <span className="font-medium">{selectedTemplate.dataCount} itens</span></p>
            <p>• Detalhes: <span className="font-medium">{includeDetails ? 'Incluídos' : 'Resumo apenas'}</span></p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
              exporting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Download className="w-4 h-4 mr-2" />
            {exporting ? 'Gerando...' : 'Gerar Relatório'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;
