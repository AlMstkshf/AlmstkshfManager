import React from 'react';
import { Task, User, TaskStatus, TaskPriority, TaskCommentSentiment } from '@/types';
import { formatDate, getTaskStatusColor, getTaskPriorityPill } from '@/utils/helpers';
import Select from '../ui/Select';
import { Button } from '@/components/ui/Button';
import { useTranslations } from '@/hooks/useTranslations';
import { LocaleKey } from '@/locales';
import { useAppContext } from '@/contexts/AppContext';


interface TaskItemProps {
  task: Task;
  users: User[];
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewComments: (taskId: string) => void; // New prop
}

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.03 3.22.077m3.22-.077L10.879 3.286a1.125 1.125 0 011.07-1.071h.078a1.125 1.125 0 011.07 1.07L15.18 5.79m-3.22-.077c1.153 0 2.24.03 3.22.077" /></svg>;
const CommentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.862 8.25-8.625 8.25CF7.862 20.25 4 16.556 4 12c0-4.556 3.862-8.25 8.625-8.25s8.625 3.694 8.625 8.25z" /></svg>;
const ExclamationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>;

const LockClosedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-gray-500 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>;



const TaskItem: React.FC<TaskItemProps> = ({ task, users, onUpdateStatus, onEdit, onDelete, onViewComments }) => {
  const { t } = useTranslations();
  const { getCommentsByTaskId, tasks: allTasks, canCurrentUserEditTask, canCurrentUserDeleteTask, getProjectById } = useAppContext();
  const assignee = users.find(u => u.id === task.assigneeId);

  const comments = getCommentsByTaskId(task.id);
  const commentCount = comments.length;
  const hasUrgentComments = comments.some(c => c.isUrgent || c.sentiment === TaskCommentSentiment.Negative);

  const projectForTask = getProjectById(task.projectId);
  const canEditThisTask = canCurrentUserEditTask(task, projectForTask);
  const canDeleteThisTask = canCurrentUserDeleteTask(task, projectForTask);


  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Check if user has permission to change status, especially to "Done"
    // For now, allow if canEditThisTask, but more granular control might be needed
    if (canEditThisTask) {
      onUpdateStatus(task.id, e.target.value as TaskStatus);
    } else {
      // Optionally, show a message or revert
      e.target.value = task.status; // Revert if no permission
    }
  };

  const taskStatusMap: Record<TaskStatus, LocaleKey> = {
    [TaskStatus.ToDo]: 'taskStatusToDo',
    [TaskStatus.InProgress]: 'taskStatusInProgress',
    [TaskStatus.Review]: 'taskStatusReview',
    [TaskStatus.Done]: 'taskStatusDone',
    [TaskStatus.Blocked]: 'taskStatusBlocked',
    [TaskStatus.Overdue]: 'taskStatusOverdue', 
  };

  const taskPriorityMap: Record<TaskPriority, LocaleKey> = {
    [TaskPriority.Low]: 'taskPriorityLow',
    [TaskPriority.Medium]: 'taskPriorityMedium',
    [TaskPriority.High]: 'taskPriorityHigh',
  };
  
  const getStatusBorderColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.Overdue:
      case TaskStatus.Blocked:
        return 'border-red-500';
      case TaskStatus.Done:
        return 'border-green-500';
      case TaskStatus.InProgress:
        return 'border-blue-500';
      case TaskStatus.Review:
        return 'border-yellow-500';
      case TaskStatus.ToDo:
      default:
        return 'border-gray-300';
    }
  };

  const prerequisiteTask = task.dependsOnTaskId ? allTasks.find(t => t.id === task.dependsOnTaskId) : null;
  const isBlockedByDependency = prerequisiteTask && prerequisiteTask.status !== TaskStatus.Done;


  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 rtl:border-l-0 rtl:border-r-4 ${getStatusBorderColor(task.status)} hover:bg-gray-50 transition-colors duration-150`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            {isBlockedByDependency && (
              <span title={t('taskDependencyPromptMessage', { nextTaskName: task.name, completedTaskName: prerequisiteTask?.name || 'another task' } )}>
                <LockClosedIcon />
              </span>
            )}
            <h4 className="text-md font-semibold text-gray-800">{task.name}</h4>
          </div>
          {task.description && <p className="text-xs text-gray-500 mt-1">{task.description}</p>}
        </div>
        <div className="flex space-x-1 rtl:space-x-reverse">
           {canEditThisTask && <Button onClick={onEdit} variant="ghost" size="sm" className="p-1.5" aria-label={t('editTaskBtn')} title={t('editTaskBtn')}><EditIcon /></Button>}
           {canDeleteThisTask && <Button onClick={onDelete} variant="ghost" size="sm" className="p-1.5 text-red-500 hover:bg-red-100" aria-label={t('deleteTaskBtn')} title={t('deleteTaskBtn')}><DeleteIcon /></Button>}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 text-xs">
        <div>
          <span className="text-gray-500 font-medium">{t('assigneeLabel')}: </span>
          <span className="text-gray-700">{assignee ? assignee.name : t('unassigned')}</span>
        </div>
        <div>
          <span className="text-gray-500 font-medium">{t('dueDateLabel')}: </span>
          <span className="text-gray-700">{formatDate(task.dueDate) || t('notAvailableShort')}</span>
        </div>
        <div>
            <span className="text-gray-500 font-medium">{t('priorityLabel')}: </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTaskPriorityPill(task.priority)}`}>
                {t(taskPriorityMap[task.priority])}
            </span>
        </div>
        <div>
          <label htmlFor={`status-${task.id}`} className="sr-only">{t('statusLabel')}</label>
          <Select
            id={`status-${task.id}`}
            value={task.status}
            onChange={handleStatusChange}
            className={`text-xs py-1 px-2 rounded ${getTaskStatusColor(task.status)}`}
            aria-label={t('statusLabel')}
            disabled={(isBlockedByDependency && task.status !== TaskStatus.Blocked && task.status !== TaskStatus.ToDo) || !canEditThisTask}
          >
            {Object.values(TaskStatus).map((statusValue: TaskStatus) => (
              <option key={statusValue} value={statusValue} className="bg-white text-gray-800">
                {t(taskStatusMap[statusValue])}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
        <Button 
            onClick={() => onViewComments(task.id)} 
            variant="ghost" 
            size="sm" 
            leftIcon={hasUrgentComments ? <ExclamationCircleIcon /> : <CommentIcon />}
            className={`text-xs ${hasUrgentComments ? 'text-red-600 hover:bg-red-100' : 'text-gray-600 hover:bg-gray-100'}`}
            aria-label={t('viewCommentsBtn')}
            title={t('viewCommentsBtn')}
        >
            {t('viewCommentsBtn')} ({commentCount})
            {hasUrgentComments && <span className="sr-only">{t('commentFlaggedUrgentTooltip')}</span>}
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;