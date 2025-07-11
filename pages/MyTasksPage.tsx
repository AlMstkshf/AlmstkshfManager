import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Task, Todo, TaskStatus, Project } from '../types';
import TaskList from '../components/tasks/TaskList';
import TodoList from '../components/todos/TodoList';
import TodoForm from '../components/todos/TodoForm';
import Modal from '../components/ui/Modal';
import TaskForm from '../components/tasks/TaskForm';
import { useTranslations } from '../hooks/useTranslations';
import Button from '../components/ui/Button'; 
import { useNavigate } from 'react-router-dom'; 

const ArrowPathIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);
const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
);


const MyTasksPage: React.FC = () => {
  const { 
    currentUser, getTasksByAssigneeId, getTodosByUserId, users, 
    updateTask, deleteTask, updateTodo, deleteTodo,
    tasks, // Full tasks list from context to check dependencies
    todos, // Full todos list from context
    getProjectById, 
    addNotification,
  } = useAppContext();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [personalTodos, setPersonalTodos] = useState<Todo[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  
  const [promptNextTask, setPromptNextTask] = useState<Task | null>(null);
  const [completedTaskNameForPrompt, setCompletedTaskNameForPrompt] = useState<string>('');


  useEffect(() => {
    if (currentUser) {
      // getTasksByAssigneeId already filters for non-archived projects
      setAssignedTasks(getTasksByAssigneeId(currentUser.id));
      setPersonalTodos(getTodosByUserId(currentUser.id));
    }
  }, [currentUser, getTasksByAssigneeId, getTodosByUserId, tasks, todos]); // tasks, todos dependencies ensure re-fetch on global state change

  if (!currentUser) {
    return <div className="text-center py-10">{t('loadingOrNotFound')}</div>;
  }
  
  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    const task = assignedTasks.find(t => t.id === taskId);
    if (task) {
      const oldStatus = task.status;
      let updatedTaskData: Task = { ...task, status };

      // Update startDate if moving to In Progress and no startDate yet
      if (status === TaskStatus.InProgress && oldStatus !== TaskStatus.InProgress && !task.startDate) {
        updatedTaskData.startDate = new Date().toISOString().split('T')[0];
      }
      
      updateTask(updatedTaskData); // AppContext's updateTask will handle notifications
      
      const updatedTasksList = (prevTasks: Task[]) => prevTasks.map(t => t.id === taskId ? updatedTaskData : t);
      setAssignedTasks(updatedTasksList);

      if (status === TaskStatus.Done && oldStatus !== TaskStatus.Done) {
        const unblockedTask = tasks.find( // Check against all tasks from context
          (t) => t.dependsOnTaskId === taskId && t.status === TaskStatus.ToDo && t.assigneeId === currentUser.id
        );
        if (unblockedTask) {
          const projectOfUnblocked = getProjectById(unblockedTask.projectId);
          if (projectOfUnblocked && !projectOfUnblocked.isArchived) { // Ensure dependent task is in active project
             setCompletedTaskNameForPrompt(task.name);
             setPromptNextTask(unblockedTask);
          }
        }
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = assignedTasks.find(t => t.id === taskId);
    if (taskToDelete && window.confirm(t('deleteTaskConfirmation'))) {
        deleteTask(taskId);
        setAssignedTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    }
  };

  const handleUpdateTodo = (todo: Todo) => {
    updateTodo(todo);
    setPersonalTodos(prevTodos => prevTodos.map(t => t.id === todo.id ? todo : t));
  };

  const handleDeleteTodo = (todoId: string) => {
    if(window.confirm(t('deleteTodoConfirmation', { todoText: todos.find(td => td.id === todoId)?.text || t('thisTodo') }))) {
        deleteTodo(todoId);
        setPersonalTodos(prevTodos => prevTodos.filter(t => t.id !== todoId));
    }
  };

  const handleStartNextTask = () => {
    if (promptNextTask) {
      updateTask({ ...promptNextTask, status: TaskStatus.InProgress, startDate: new Date().toISOString().split('T')[0] });
      addNotification('notificationTaskStatusChanged', { taskName: promptNextTask.name, status: t('taskStatusInProgress')});
      setAssignedTasks(prev => prev.map(t => t.id === promptNextTask.id ? { ...t, status: TaskStatus.InProgress, startDate: new Date().toISOString().split('T')[0] } : t));
      setPromptNextTask(null);
    }
  };

  const handleViewComments = (taskId: string) => {
    const task = assignedTasks.find(t => t.id === taskId);
    if (task) {
      const project = getProjectById(task.projectId);
      if (project) {
         addNotification('notificationRedirectingToViewComments', { 
            taskName: task.name,
        }, `/project/${task.projectId}?openComments=${taskId}`); 
      }
    }
  };
  
  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('myAssignedTasks')}</h2>
        {assignedTasks.length > 0 ? (
          <TaskList 
            tasks={assignedTasks} 
            users={users} 
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onViewComments={handleViewComments} 
          />
        ) : (
          <p className="text-gray-600">{t('noTasksAssigned')}</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('myPersonalTodos')}</h2>
        <div className="mb-6">
          <TodoForm onTodoAdded={() => {
            if (currentUser) setPersonalTodos(getTodosByUserId(currentUser.id));
          }} />
        </div>
        <TodoList 
          todos={personalTodos} 
          onUpdateTodo={handleUpdateTodo}
          onDeleteTodo={handleDeleteTodo}
        />
      </div>
      
      {taskToEdit && (
        <Modal 
            isOpen={isTaskModalOpen} 
            onClose={() => setIsTaskModalOpen(false)} 
            title={t('editTask')}
        >
          <TaskForm 
            onClose={() => {
              setIsTaskModalOpen(false);
              setTaskToEdit(undefined);
              if (currentUser) setAssignedTasks(getTasksByAssigneeId(currentUser.id)); 
            }} 
            projectId={taskToEdit.projectId} 
            taskToEdit={taskToEdit} 
          />
        </Modal>
      )}

      {promptNextTask && (
        <Modal
          isOpen={!!promptNextTask}
          onClose={() => setPromptNextTask(null)}
          title={t('taskDependencyPromptTitle', { completedTaskName: completedTaskNameForPrompt })}
          size="md"
        >
          <div className="text-center">
            <ArrowPathIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg mb-2">
              {t('taskDependencyPromptMessage', { nextTaskName: promptNextTask.name })}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              {t('taskDependencyPromptSubMessage')}
            </p>
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              <Button onClick={() => setPromptNextTask(null)} variant="ghost">
                {t('taskDependencyPromptLater')}
              </Button>
              <Button onClick={handleStartNextTask} leftIcon={<PlayIcon />}>
                {t('taskDependencyPromptStart')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyTasksPage;
