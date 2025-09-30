import React from 'react';
import { Download, Calendar, FileText, Eye } from 'lucide-react';

const ReportHistory = () => {
  // Mock de histórico de relatórios
  const reports = [
    {
      id: 1,
      name: 'Relatório Executivo',
      type: 'executive',
      format: 'JSON',
      size: '156 KB',
      createdAt: new Date('2025-09-29T14:30:00'),
      createdBy: 'Willian Araújo',
      downloads: 3
    },
    {
      id: 2,
      name: 'Relatório de Usuários',
      type: 'users',
      format: 'CSV',
      size: '24 KB',
      createdAt: new Date('2025-09-29T10:15:00'),
      createdBy: 'Willian Araújo',
      downloads: 1
    },
    {
      id: 3,
      name: 'Relatório de Atividades',
      type: 'activities',
      format: 'JSON',
      size: '89 KB',
      createdAt: new Date('2025-09-28T16:45:00'),
      createdBy: 'Willian Araújo',
      downloads: 5
    },
    {
      id: 4,
      name: 'Relatório do Sistema',
      type: 'system',
      format: 'PDF',
      size: '2.1 MB',
      createdAt: new Date('2025-09-28T09:20:00'),
      createdBy: 'Willian Araújo',
      downloads: 2
    }
  ];

  const getTypeColor = (type) => {
    const colors = {
      executive: 'bg-blue-100 text-blue-800',
      users: 'bg-green-100 text-green-800',
      activities: 'bg-purple-100 text-purple-800',
      system: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return date.toLocaleString('pt-BR');
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);

    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  const handleDownload = (report) => {
    // Mock download - em produção seria um link real
    alert(`Download do relatório: ${report.name} (${report.format})`);
  };

  const handlePreview = (report) => {
    alert(`Preview do relatório: ${report.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Relatórios Gerados</h3>
          <p className="text-gray-600">Histórico de relatórios exportados</p>
        </div>
        <div className="text-sm text-gray-500">
          {reports.length} relatórios
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum relatório gerado</h3>
          <p className="text-gray-500">Os relatórios exportados aparecerão aqui</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Relatório
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Formato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tamanho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Criado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(report.type)}`}>
                            {report.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            por {report.createdBy}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {report.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {report.size}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{formatDate(report.createdAt)}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(report.createdAt)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {report.downloads}x
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePreview(report)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(report)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              <p className="text-sm text-gray-600">Relatórios Gerados</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-3">
            <Download className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.reduce((acc, r) => acc + r.downloads, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Downloads</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r =>
                  new Date() - r.createdAt < 24 * 60 * 60 * 1000
                ).length}
              </p>
              <p className="text-sm text-gray-600">Hoje</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHistory;
