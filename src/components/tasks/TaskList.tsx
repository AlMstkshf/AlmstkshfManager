import React from 'react';
import { Task, User, TaskStatus } from '@/types';
import TaskItem from './TaskItem';
import { useTranslations } from '@/hooks/useTranslations';


interface TaskListProps {
  tasks: Task[];
  users: User[];
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onViewComments: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, users, onUpdateTaskStatus, onEditTask, onDeleteTask, onViewComments }) => {
  const { t } = useTranslations();
  if (tasks.length === 0) {
    return <p className="text-gray-600">{t('noTasksInProject')}</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskItem 
            key={task.id} 
            task={task} 
            users={users} 
            onUpdateStatus={onUpdateTaskStatus}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task.id)}
            onViewComments={onViewComments}
        />
      ))}
    </div>
  );
};

export default TaskList;
