import React from 'react';
import { Users, BookOpen, Target, Clock, Award, AlertTriangle, Settings } from 'lucide-react';
import { StatCard } from '../ui';
import OL_COLORS from '../../config/olColors';

const DashboardStats = ({
  analytics,
  userRole,
  onCardClick,
  onExpiringClick,
  onEmployeesWithoutLinksClick,
  onOrphanedKnowledgeClick
}) => {
  return (
    <>
      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <StatCard
          title="Total de Colaboradores"
          value={analytics.totalEmployees}
          subtitle="Ativos no sistema"
          icon={Users}
          color="red"
          onClick={() => onCardClick('employees')}
          clickable={!!onCardClick}
        />

        <StatCard
          title="Conhecimentos Cadastrados"
          value={analytics.totalKnowledge}
          subtitle="Certificações, cursos e formações"
          icon={BookOpen}
          color="green"
          onClick={() => onCardClick('knowledge')}
          clickable={!!onCardClick}
        />

        <StatCard
          title="Taxa de Cobertura"
          value={`${analytics.coverageRate}%`}
          subtitle="Vínculos obtidos vs total"
          icon={Target}
          color="purple"
          onClick={() => onCardClick('employee-knowledge')}
          clickable={!!onCardClick}
        />

        <StatCard
          title="Vencendo em 30 dias"
          value={analytics.expiringCount}
          subtitle="Certificações a renovar"
          icon={Clock}
          color={analytics.expiringCount > 0 ? "orange" : "green"}
          onClick={onExpiringClick}
          clickable={true}
        />
      </div>

      {/* Cards Secundários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <StatCard
          title="Certificações Obtidas"
          value={analytics.obtainedCertifications}
          subtitle="Colaboradores certificados"
          icon={Award}
          color="green"
        />

        <StatCard
          title="Sem Vínculos"
          value={analytics.employeesWithoutLinks?.length || 0}
          subtitle="Colaboradores sem certificações"
          icon={AlertTriangle}
          color={analytics.employeesWithoutLinks?.length > 0 ? "yellow" : "green"}
          onClick={onEmployeesWithoutLinksClick}
          clickable={true}
        />

        <StatCard
          title="Conhecimentos Órfãos"
          value={analytics.knowledgeWithoutLinks?.length || 0}
          subtitle="Sem vínculos com colaboradores"
          icon={BookOpen}
          color={analytics.knowledgeWithoutLinks?.length > 0 ? "yellow" : "green"}
          onClick={onOrphanedKnowledgeClick}
          clickable={true}
        />

        {(userRole === 'admin' || userRole === 'diretoria') && (
          <StatCard
            title="Configurações Admin"
            value="7"
            subtitle="Pendências para resolver"
            icon={Settings}
            color="purple"
            onClick={() => onCardClick('admin-config')}
            clickable={true}
          />
        )}
      </div>
    </>
  );
};

export default DashboardStats;
