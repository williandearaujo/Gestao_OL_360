import React from 'react';
import { Edit } from 'lucide-react';
import { PageSection, Button } from '../../ui';

// ✅ AVATAR COM CORES DINÂMICAS
const Avatar = ({ name, src, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  // ✅ CORES BASEADAS NO NOME (SEMPRE A MESMA COR POR PESSOA)
  const getColorFromName = (name) => {
    const colors = [
      'bg-blue-100 text-blue-600 border-blue-200',
      'bg-green-100 text-green-600 border-green-200',
      'bg-purple-100 text-purple-600 border-purple-200',
      'bg-orange-100 text-orange-600 border-orange-200',
      'bg-red-100 text-red-600 border-red-200',
      'bg-indigo-100 text-indigo-600 border-indigo-200',
      'bg-pink-100 text-pink-600 border-pink-200',
      'bg-teal-100 text-teal-600 border-teal-200'
    ];

    // Hash simples baseado no nome
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border-2 border-gray-200`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} ${getColorFromName(name)} rounded-full flex items-center justify-center border-2`}>
      <span className="font-semibold">
        {getInitials(name)}
      </span>
    </div>
  );
};

const TeamCoverageTable = ({ analytics, data, onTeamClick }) => {
  if (!analytics.teamData || analytics.teamData.length === 0) {
    return (
      <PageSection title="Cobertura por Equipe">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">Nenhuma equipe</h4>
          <p className="text-gray-500">Aguardando dados das equipes...</p>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection title="Cobertura por Equipe">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Colaboradores
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Vínculos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Obtidas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taxa Cobertura
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {analytics.teamData.map((team) => {
              const teamEmployees = data.employees.filter(emp => emp.equipe === team.fullTeam);

              return (
                <tr
                  key={team.fullTeam}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onTeamClick && onTeamClick(team, teamEmployees)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {team.fullTeam}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex -space-x-1 mr-2">
                      {teamEmployees.slice(0, 3).map((emp, index) => (
                        <Avatar key={emp.id} name={emp.nome} size="sm" />
                      ))}
                      {teamEmployees.length > 3 && (
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-xs text-gray-600 font-medium">+{teamEmployees.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{team.employees}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.certifications}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.obtained}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 mr-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${team.coverage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 min-w-[3rem]">{team.coverage}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageSection>
  );
};

export default TeamCoverageTable;
