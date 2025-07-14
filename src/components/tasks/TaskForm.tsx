
import React, { useState, useEffect, FormEvent } from 'react';
import { Task, TaskStatus, TaskPriority, AIQuickTaskSuggestion } from '@/types';
import { useAppContext } from '@/contexts/AppContext';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useTranslations } from '@/hooks/useTranslations';
import { LocaleKey } from '@/locales';

interface TaskFormProps {
  onClose: () => void;
  projectId: string;
  taskToEdit?: Task;
  initialTaskData?: Partial<AIQuickTaskSuggestion>;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, projectId, taskToEdit, initialTaskData }) => {
  const { addTask, updateTask, users, tasks: projectTasksForDependencies } = useAppContext();
  const { t } = useTranslations();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.ToDo);
  const [dependsOnTaskId, setDependsOnTaskId] = useState<string | undefined>(undefined);
  const [aiDueDateSuggestion, setAiDueDateSuggestion] = useState<string | null | undefined>(null);

  useEffect(() => {
    if (taskToEdit) {
      setName(taskToEdit.name);
      setDescription(taskToEdit.description || '');
      setAssigneeId(taskToEdit.assigneeId);
      setDueDate(taskToEdit.dueDate || '');
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setDependsOnTaskId(taskToEdit.dependsOnTaskId);
      setAiDueDateSuggestion(null);
    } else if (initialTaskData) {
      setName(initialTaskData.name || '');
      setDescription(initialTaskData.description || '');
      setAssigneeId(initialTaskData.assigneeId || undefined);
      setPriority(initialTaskData.priority || TaskPriority.Medium);
      setStatus(TaskStatus.ToDo);
      setDependsOnTaskId(undefined);
      setAiDueDateSuggestion(initialTaskData.dueDateSuggestion);
      if (!initialTaskData.dueDateSuggestion) {
        setDueDate(new Date().toISOString().split('T')[0]);
      } else {
        setDueDate('');
      }
    } else {
      setName('');
      setDescription('');
      setAssigneeId(undefined);
      setDueDate(new Date().toISOString().split('T')[0]);
      setPriority(TaskPriority.Medium);
      setStatus(TaskStatus.ToDo);
      setDependsOnTaskId(undefined);
      setAiDueDateSuggestion(null);
    }
  }, [taskToEdit, initialTaskData]);

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

  const availableTasksForDependency = projectTasksForDependencies.filter(
    task => task.projectId === projectId && task.id !== taskToEdit?.id
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const taskData = {
      name,
      description,
      assigneeId,
      dueDate,
      priority,
      status,
      dependsOnTaskId,
      projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (taskToEdit) {
      updateTask({ ...taskToEdit, ...taskData });
    } else {
      addTask(taskData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">{t('taskName')}</label>
        <Input id="taskName" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">{t('taskDescriptionOptional')}</label>
        <Textarea id="taskDescription" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="taskAssignee" className="block text-sm font-medium text-gray-700">{t('assigneeOptional')}</label>
          <Select onValueChange={setAssigneeId} value={assigneeId}>
            <SelectTrigger id="taskAssignee">
              <SelectValue placeholder={t('unassigned')} />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
            <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-700">{t('dueDateOptional')}</label>
            <Input id="taskDueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            {aiDueDateSuggestion && (!taskToEdit || (initialTaskData && !taskToEdit)) && (
                 <p className="text-xs text-blue-600 mt-1">{t('aiSuggestedDueDate', { suggestion: aiDueDateSuggestion})}</p>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700">{t('priority')}</label>
          <Select onValueChange={setPriority} value={priority}>
            <SelectTrigger id="taskPriority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TaskPriority).map(p => <SelectItem key={p} value={p}>{t(taskPriorityMap[p])}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700">{t('status')}</label>
          <Select onValueChange={setStatus} value={status}>
            <SelectTrigger id="taskStatus">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TaskStatus).map(s => <SelectItem key={s} value={s}>{t(taskStatusMap[s])}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label htmlFor="taskDependsOn" className="block text-sm font-medium text-gray-700">{t('taskDependsOn')}</label>
        <Select onValueChange={setDependsOnTaskId} value={dependsOnTaskId}>
          <SelectTrigger id="taskDependsOn">
            <SelectValue placeholder={t('noDescription')} />
          </SelectTrigger>
          <SelectContent>
            {availableTasksForDependency.map(task => (
              <SelectItem key={task.id} value={task.id}>{task.name}</SelectItem>
            ))}
          </eSelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>{t('cancel')}</Button>
        <Button type="submit">{taskToEdit ? t('updateTaskBtn') : t('createTaskBtn')}</Button>
      </div>
    </form>
  );
};

export default TaskForm;
