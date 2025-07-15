import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, TaskStatus } from '@/types'; 
import { formatDate } from '@/utils/helpers';
import { PROJECT_COLORS } from '@/constants';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslations } from '@/hooks/useTranslations';

interface ProjectItemProps {
  project: Project;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  const navigate = useNavigate();
  const { getTasksByProjectId } = useAppContext(); 
  const { t } = useTranslations();

  const projectColorMeta = PROJECT_COLORS.find(pc => pc.value === project.color);
  const displayColor = projectColorMeta ? projectColorMeta.twClass : 'bg-gray-500';

  const projectTasks = getTasksByProjectId(project.id);
  const completedTasks = projectTasks.filter(task => task.status === TaskStatus.Done).length;
  const progressPercentage = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;

  return (
    <div
      className={`group bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between ${project.isArchived ? 'opacity-70' : ''}`}
      onClick={() => navigate(`/project/${project.id}`)}
      style={{ minHeight: '230px' }} 
      role="button"
      tabIndex={0}
      aria-label={`${t('projectDetails')}: ${project.name} ${project.isArchived ? '(' + t('projectArchivedBadge') + ')' : '' }`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/project/${project.id}`); }}
    >
      <div>
        <div className={`h-3 ${displayColor}`}></div>
        <div className="p-5 relative">
          {project.isArchived && (
            <span className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-gray-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
              {t('projectArchivedBadge')}
            </span>
          )}
          <h3 className="text-lg font-semibold text-primary group-hover:text-secondary transition-colors mb-1 truncate" title={project.name}>{project.name}</h3>
          <p className="text-gray-600 text-sm mb-3 h-10 overflow-hidden text-ellipsis" title={project.description || t('noDescription')}>
            {project.description || t('noDescription')}
          </p>
          
          <div className="mb-3">
            <div className="flex justify-between items-center text-xs text-gray-500 mb-0.5">
              <span>{t('progress')}</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${displayColor}`}
                style={{ width: `${progressPercentage}%` }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${t('projectName')}: ${project.name}, ${t('progress')}`}
              ></div>
            </div>
            {projectTasks.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">{t('noTasksYet')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 pt-2">
        <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
          <p>{t('startLabel')}: {formatDate(project.createdAt) || t('notAvailableShort')}</p>
          {project.updatedAt && <p>{t('endLabel')}: {formatDate(project.updatedAt) || t('notAvailableShort')}</p>}
          {project.budget !== undefined && project.budget !== null && <p>{t('budgetLabel')}: ${project.budget.toLocaleString()}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
