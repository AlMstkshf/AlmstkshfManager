import React from 'react';
import { Project } from '@/types';
import ProjectItem from './ProjectItem';
import { useTranslations } from '@/hooks/useTranslations';

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const { t } = useTranslations();
  if (projects.length === 0) {
    return <p className="text-gray-600">{t('noProjectsYet')}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
