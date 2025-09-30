import React from 'react';
import { User, Mail, Phone, MapPin, Building, Calendar, Edit, Trash2, Eye, Link } from 'lucide-react';

// ✅ FUNÇÃO PARA FAZER PARSE DO ENDEREÇO JSON
const parseEndereco = (enderecoString) => {
  try {
    if (!enderecoString) return {};
    if (typeof enderecoString === 'object') return enderecoString;

    // Remove escapes desnecessários e faz parse
    const cleanJson = enderecoString.replace(/\"\"/g, '"');
    return JSON.parse(cleanJson);
  } catch (error) {
    return {};
  }
};

const EmployeeCard = ({
  employee,
  onEdit,
  onDelete,
  onViewDetails,
  onManageLinks,
  showActions = true,
  employeeLinks = []
}) => {
  const endereco = parseEndereco(employee.endereco);

  const getStatusColor = (status) => {
    const colors = {
      'ATIVO': 'bg-green-100 text-green-800 border-green-200',
      'FERIAS': 'bg-blue-100 text-blue-800 border-blue-200',
      'LICENCA': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'INATIVO': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLevelColor = (level) => {
    const colors = {
      'ESTAGIARIO': 'bg-gray-100 text-gray-800',
      'JUNIOR': 'bg-green-100 text-green-800',
      'PLENO': 'bg-blue-100 text-blue-800',
      'SENIOR': 'bg-purple-100 text-purple-800',
      'COORDENADOR': 'bg-orange-100 text-orange-800',
      'GERENTE': 'bg-red-100 text-red-800',
      'DIRETOR': 'bg-indigo-100 text-indigo-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    if (!date) return 'Não informado';
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  // ✅ CALCULAR VÍNCULOS DO COLABORADOR
  const employeeKnowledgeCount = employeeLinks.filter(link =>
    parseInt(link.employee_id) === parseInt(employee.id)
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden w-full">
      {/* ✅ HEADER CORRIGIDO - SEM SOBREPOSIÇÃO */}
      <div className="p-4 border-b border-gray-100">
        {/* Avatar e Nome */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {employee.avatar ? (
              <img src={employee.avatar} alt="Foto do colaborador" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {employee.nome}
            </h3>
            <p className="text-xs text-gray-600 truncate">
              {employee.cargo}
            </p>
          </div>
        </div>

        {/* ✅ TAGS EM LINHA SEPARADA - NÃO CORTAM */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
            {employee.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(employee.nivel)}`}>
            {employee.nivel}
          </span>
        </div>

        {/* ✅ AÇÕES EM LINHA SEPARADA - COM DEBUG COMPLETO */}
        {showActions && (
          <div className="flex justify-end space-x-1">
            {/* ✅ BOTÃO OLHINHO COM DEBUG */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔍 CLICOU NO OLHO - Employee:', employee.nome);
                console.log('🔍 CLICOU NO OLHO - onViewDetails existe?', !!onViewDetails);
                console.log('🔍 CLICOU NO OLHO - Employee completo:', employee);
                if (onViewDetails) {
                  onViewDetails(employee);
                } else {
                  alert('Função onViewDetails não foi passada como prop!');
                }
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded"
              title="Ver detalhes"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* ✅ BOTÃO VÍNCULOS */}
            {onManageLinks && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onManageLinks(employee);
                }}
                className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors rounded"
                title={`Vínculos (${employeeKnowledgeCount})`}
              >
                <Link className="w-4 h-4" />
              </button>
            )}

            {/* ✅ BOTÃO EDITAR */}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(employee);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}

            {/* ✅ BOTÃO EXCLUIR */}
            {onDelete && (
              <button
  onClick={() => {
    console.log('🔍 EmployeeCard - Clicou em deletar, employee:', employee);
    onDelete(employee); // ✅ DEVE PASSAR O OBJETO COMPLETO
  }}
  className="text-red-600 hover:text-red-700"
>
  <Trash2 className="h-4 w-4" />
</button>
            )}
          </div>
        )}
      </div>

      {/* ✅ CONTEÚDO CORRIGIDO */}
      <div className="p-4 space-y-3">
        {/* Informações de contato */}
        <div className="space-y-2">
          <div className="flex items-center text-xs text-gray-600">
            <Mail className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>

          {employee.telefone && (
            <div className="flex items-center text-xs text-gray-600">
              <Phone className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{employee.telefone}</span>
            </div>
          )}

          <div className="flex items-center text-xs text-gray-600">
            <Building className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{employee.equipe}</span>
          </div>

          {/* ✅ ENDEREÇO FORMATADO */}
          {(endereco.cidade || endereco.estado) && (
            <div className="flex items-start text-xs text-gray-600">
              <MapPin className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="truncate">
                {endereco.cidade}
                {endereco.cidade && endereco.estado && ', '}
                {endereco.estado}
              </span>
            </div>
          )}
        </div>

        {/* ✅ INFORMAÇÕES ADICIONAIS */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span className="truncate">
                {formatDate(employee.data_admissao)}
              </span>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="font-medium">
                {employee.data_admissao ?
                  Math.floor((new Date() - new Date(employee.data_admissao)) / (1000 * 60 * 60 * 24 * 365))
                  : 0} anos
              </span>
            </div>
          </div>
        </div>

        {/* ✅ VÍNCULOS DE CONHECIMENTO */}
        {employeeKnowledgeCount > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Vínculos:</span>
              <span className="font-medium text-purple-600">
                {employeeKnowledgeCount} conhecimentos
              </span>
            </div>
          </div>
        )}

        {/* ✅ COMPETÊNCIAS LIMITADAS - COM PROTEÇÃO */}
        {employee.competencias && (
          (() => {
            try {
              const competenciasArray = Array.isArray(employee.competencias)
                ? employee.competencias
                : (typeof employee.competencias === 'string' ? employee.competencias.split(',') : []);

              if (competenciasArray.length > 0) {
                return (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {competenciasArray.slice(0, 2).map((competencia, index) => (
                        <span key={index} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs truncate">
                          {competencia.trim()}
                        </span>
                      ))}
                      {competenciasArray.length > 2 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                          +{competenciasArray.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }
            } catch (error) {
              console.error('❌ Erro ao processar competências:', error);
            }
            return null;
          })()
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;
