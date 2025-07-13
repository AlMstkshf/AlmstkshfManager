
import React from 'react';
import { Link } from 'react-router-dom';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { formatDate, getTaskStatusColor } from '@/utils/helpers';
import { LocaleKey } from '@/locales';

// Define an extended Task type that includes projectName and projectOwnerName
export interface UrgentTaskView extends Task {
  projectName: string;
  projectOwnerName: string;
}

interface UrgentTasksSummaryProps {
  groupedTasks: Record<string, UrgentTaskView[]>;
}

const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const UrgentTasksSummary: React.FC<UrgentTasksSummaryProps> = ({ groupedTasks }) => {
  const { t } = useTranslations();

  const owners = Object.keys(groupedTasks);

  if (owners.length === 0) {
    return (
      <div className="my-6 p-6 bg-yellow-50 border border-yellow-300 rounded-lg shadow-sm text-center">
        <ExclamationTriangleIcon className="mx-auto h-10 w-10 text-yellow-500 mb-2" />
        <p className="text-yellow-700 font-medium">{t('noUrgentTasksMessage')}</p>
      </div>
    );
  }
  
  const taskStatusMap: Record<TaskStatus, LocaleKey> = {
    [TaskStatus.ToDo]: 'taskStatusToDo',
    [TaskStatus.InProgress]: 'taskStatusInProgress',
    [TaskStatus.Review]: 'taskStatusReview',
    [TaskStatus.Done]: 'taskStatusDone',
    [TaskStatus.Blocked]: 'taskStatusBlocked',
    [TaskStatus.Overdue]: 'taskStatusOverdue',
  };

  return (
    <div className="my-8 p-6 bg-white rounded-lg shadow-lg border-t-4 border-red-500">
      <div className="flex items-center mb-6">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-600 mr-3 rtl:mr-0 rtl:ml-3" />
        <h2 className="text-2xl font-semibold text-red-700">{t('urgentTasksSummaryTitle')}</h2>
      </div>
      
      {owners.sort().map(ownerName => (
        <div key={ownerName} className="mb-6 last:mb-0">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
            {t('tasksForOwnerLabel', { ownerName: ownerName })}
          </h3>
          <div className="space-y-3">
            {groupedTasks[ownerName].map(task => (
              <div key={task.id} className="p-4 bg-gray-50 rounded-md border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <Link to={`/project/${task.projectId}`} className="text-primary hover:underline font-medium text-md">
                    {task.name}
                  </Link>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getTaskStatusColor(task.status)}`}>
                    {t(taskStatusMap[task.status])}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t('taskInProjectLabel')}: <Link to={`/project/${task.projectId}`} className="text-secondary hover:underline">{task.projectName}</Link>
                </p>
                {task.dueDate && (
                  <p className="text-xs text-red-600 font-medium mt-1">
                    {t('dueLabelShort')}: {formatDate(task.dueDate)}
                  </p>
                )}
                 <p className={`text-xs mt-1 ${task.priority === TaskPriority.High ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                    {t('priorityLabel')}: {t(task.priority === TaskPriority.High ? 'taskPriorityHigh' : (task.priority === TaskPriority.Medium ? 'taskPriorityMedium' : 'taskPriorityLow'))}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UrgentTasksSummary;
