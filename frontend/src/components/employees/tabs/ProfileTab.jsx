import React from 'react';
import { formatDate, formatCurrency } from '../utils/employeeUtils';

const ProfileTab = ({ employee }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Dados Pessoais */}
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-ol-brand-500 mb-3">Informações Pessoais</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ol-gray-600">CPF:</span>
              <span className="font-medium">{employee.cpf}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ol-gray-600">RG:</span>
              <span className="font-medium">{employee.rg}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ol-gray-600">Data Nascimento:</span>
              <span className="font-medium">{formatDate(employee.data_nascimento)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ol-gray-600">Estado Civil:</span>
              <span className="font-medium">{employee.estado_civil}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-ol-brand-500 mb-3">Contato</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ol-gray-600">Email:</span>
              <span className="font-medium">{employee.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ol-gray-600">Telefone:</span>
              <span className="font-medium">{employee.telefone}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-ol-brand-500 mb-3">Endereço</h4>
          <div className="text-sm">
            <p className="font-medium">{employee.endereco?.rua}, {employee.endereco?.numero}</p>
            {employee.endereco?.complemento && (
              <p className="text-ol-gray-600">{employee.endereco?.complemento}</p>
            )}
            <p className="text-ol-gray-600">
              {employee.endereco?.bairro}, {employee.endereco?.cidade} - {employee.endereco?.estado}
            </p>
            <p className="text-ol-gray-600">CEP: {employee.endereco?.cep}</p>
          </div>
        </div>
      </div>

      {/* Dados Profissionais */}
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-ol-brand-500 mb-3">Informações Profissionais</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ol-gray-600">Nível:</span>
              <span className="font-medium">{employee.nivel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ol-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                employee.status === 'ATIVO' ? 'bg-ol-brand-100 text-ol-brand-700' :
                employee.status === 'FERIAS' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {employee.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ol-gray-600">Salário:</span>
              <span className="font-medium">{formatCurrency(employee.salario)}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-ol-brand-500 mb-3">Competências</h4>
          {employee.competencias && employee.competencias.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {employee.competencias.map((comp, index) => (
                <span key={index} className="px-3 py-1 bg-ol-brand-100 text-ol-brand-700 rounded-full text-sm">
                  {comp}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-ol-gray-500 text-sm">Nenhuma competência cadastrada</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
