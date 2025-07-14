import React from 'react';
import { Task, User } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { formatDate, getTaskStatusColor } from '@/utils/helpers';
import { LocaleKey } from '@/locales';

interface ProjectTimelineViewProps {
  tasks: Task[];
  users: User[];
}

const ProjectTimelineView: React.FC<ProjectTimelineViewProps> = ({ tasks, users }) => {
  const { t } = useTranslations();

  const sortedTasks = React.useMemo(() => {
    return [...tasks].sort((a, b) => {
       // @ts-ignore
      const dateA = new Date(a.startDate || a.dueDate || 0).getTime();
       // @ts-ignore
      const dateB = new Date(b.startDate || b.dueDate || 0).getTime();
      return dateA - dateB;
    });
  }, [tasks]);

  if (sortedTasks.length === 0) {
    return <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow">{t('noTasksForTimeline')}</div>;
  }

  const getAssigneeName = (assigneeId?: string) => {
    if (!assigneeId) return t('unassigned');
    return users.find(u => u.id === assigneeId)?.name || t('unknownUser');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">{t('timelineViewTitle')}</h3>
      <div className="space-y-4">
        {sortedTasks.map(task => {
          const statusColor = getTaskStatusColor(task.status).split(' ')[0];
          const dependentTask = task.dependsOnTaskId ? sortedTasks.find(dep => dep.id === task.dependsOnTaskId) : null;

          return (
            <div key={task.id} className={`p-4 rounded-md border ${statusColor.replace('bg-', 'border-').replace('-500', '-300')} shadow-sm`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold text-gray-700">{task.name}</h4>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTaskStatusColor(task.status)}`}>
                  {t(`taskStatus${task.status.replace(/ /g, '')}` as LocaleKey)}
                </span>
              </div>
              
              <div className="h-3 w-full bg-gray-200 rounded-full mb-2">
                <div className={`h-3 ${statusColor} rounded-full`} style={{ width: '100%' }}></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
                 {/* @ts-ignore */}
                {task.startDate && (
                   // @ts-ignore
                  <p><span className="font-medium">{t('taskStartDate')}</span> {formatDate(task.startDate)}</p>
                )}
                {task.dueDate && (
                  <p><span className="font-medium">{t('dueDateLabel')}</span> {formatDate(task.dueDate)}</p>
                )}
                <p><span className="font-medium">{t('assigneeLabel')}</span> {getAssigneeName(task.assigneeId)}</p>
                {dependentTask && (
                  <p className="col-span-full md:col-span-1">
                    <span className="font-medium">{t('taskDependsOn')}</span> {dependentTask.name}
                  </p>
                )}
              </div>
              {task.description && <p className="text-xs text-gray-500 mt-2">{task.description}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTimelineView;
