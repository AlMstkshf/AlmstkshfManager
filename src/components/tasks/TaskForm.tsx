
import React, { useState, useEffect, FormEvent } from 'react';
import { Task, TaskStatus, TaskPriority, User, AIQuickTaskSuggestion, Project } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Calendar } from '@/components/ui/Calendar';
import { useTranslations } from '../../hooks/useTranslations';
import { LocaleKey } from '../../locales';

interface TaskFormProps {
  onClose: () => void;
  projectId: string;
  taskToEdit?: Task;
  initialTaskData?: Partial<AIQuickTaskSuggestion>; // For AI pre-fill or idea pre-fill
  projectName?: string; // For AI context, optional
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, projectId, taskToEdit, initialTaskData, projectName }) => {
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
      setAiDueDateSuggestion(null); // Clear AI suggestion if editing existing task
    } else if (initialTaskData) {
      setName(initialTaskData.name || '');
      setDescription(initialTaskData.description || '');
      setAssigneeId(initialTaskData.assigneeId || undefined);
      setPriority(initialTaskData.priority || TaskPriority.Medium);
      setStatus(TaskStatus.ToDo); // Default status for new tasks from idea/AI
      setDependsOnTaskId(undefined); // Default for new tasks
      setAiDueDateSuggestion(initialTaskData.dueDateSuggestion);
      // Set due date only if not suggested by AI, otherwise let user decide based on suggestion
      if (!initialTaskData.dueDateSuggestion) {
        setDueDate(new Date().toISOString().split('T')[0]);
      } else {
        setDueDate(''); // Keep empty to highlight AI suggestion
      }
    } else {
      // Completely new task, not from edit or initialData
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
    const taskDataPayload = {
      projectId,
      name,
      description: description || undefined,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
      priority,
      status,
      dependsOnTaskId: dependsOnTaskId || undefined,
      startDate: taskToEdit?.startDate || (status === TaskStatus.InProgress && !taskToEdit?.startDate ? new Date().toISOString().split('T')[0] : undefined)
    };

    if (taskToEdit) {
      updateTask({ ...taskToEdit, ...taskDataPayload });
    } else {
      addTask(taskDataPayload);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label={t('taskName')} id="taskName" value={name} onChange={e => setName(e.target.value)} required />
      <Textarea label={t('taskDescriptionOptional')} id="taskDescription" value={description} onChange={e => setDescription(e.target.value)} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label={t('assigneeOptional')} id="taskAssignee" value={assigneeId || ''} onChange={e => setAssigneeId(e.target.value || undefined)}>
          <option value="">{t('unassigned')}</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </Select>
        <div>
            <Input label={t('dueDateOptional')} id="taskDueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            {aiDueDateSuggestion && (!taskToEdit || (initialTaskData && !taskToEdit)) && ( // Show suggestion only for new tasks from AI/idea
                 <p className="text-xs text-blue-600 mt-1">{t('aiSuggestedDueDate', { suggestion: aiDueDateSuggestion})}</p>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label={t('priority')} id="taskPriority" value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
          {Object.values(TaskPriority).map(p => <option key={p} value={p}>{t(taskPriorityMap[p])}</option>)}
        </Select>
        <Select label={t('status')} id="taskStatus" value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
          {Object.values(TaskStatus).map(s => <option key={s} value={s}>{t(taskStatusMap[s])}</option>)}
        </Select>
      </div>

      <Select
        label={t('taskDependsOn')}
        id="taskDependsOn"
        value={dependsOnTaskId || ''}
        onChange={e => setDependsOnTaskId(e.target.value || undefined)}
      >
        <option value="">{t('noDescription')}</option> {/* Using noDescription as "None" */}
        {availableTasksForDependency.map(task => (
          <option key={task.id} value={task.id}>{task.name}</option>
        ))}
      </Select>

      <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>{t('cancel')}</Button>
        <Button type="submit">{taskToEdit ? t('updateTaskBtn') : t('createTaskBtn')}</Button>
      </div>
    </form>
  );
};

export default TaskForm;
