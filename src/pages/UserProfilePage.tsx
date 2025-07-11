
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslations } from '../../hooks/useTranslations';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EditProfileForm from '../components/users/EditProfileForm';
import ProjectList from '../components/projects/ProjectList';
import TaskList from '../components/tasks/TaskList';
import { Task, Project, TaskStatus, User, ActivityActionType, Permission } from '../../types';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { formatRelativeTime } from '../../utils/helpers';


const UserEditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const ProjectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
const TasksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-teal-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const ActivityIcon: React.FC<{ action: ActivityActionType, className?: string }> = ({ action, className="w-6 h-6" }) => {
    const iconProps = { className: `${className} text-gray-500` };
    switch (action) {
      case ActivityActionType.ProjectCreated:
        return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
      case ActivityActionType.TaskCreated:
        return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
      case ActivityActionType.TaskStatusChanged:
        return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;
      case ActivityActionType.CommentAdded:
         return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.763c0-1.124.672-2.163 1.72-2.625l4.873-2.074a.625.625 0 01.75.57V21.4a.625.625 0 01-.75.57l-4.873-2.074A2.625 2.625 0 012.25 12.763z" /><path strokeLinecap="round" strokeLinejoin="round" d="M11.383 3.902c.311-.132.647-.21.99-.21.99 0 1.83.62 2.147 1.516l.332.895a.625.625 0 00.923.395l.895-.332a2.625 2.625 0 012.983 1.12l.895.332c.25.092.485.24.67.433l.332.895a.625.625 0 00.57.75l2.074 4.873a2.625 2.625 0 01-2.625 1.72l-2.074-4.873a.625.625 0 00-.57-.75l-.332-.895a2.625 2.625 0 01-1.12-2.983l.332-.895a.625.625 0 00-.395-.923l-.895-.332c-.93-.346-1.631-1.22-1.516-2.147z" /></svg>;
      default:
        return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>;
    }
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow flex items-center">
    <div className="p-3 rounded-full bg-light-bg text-primary mr-4 rtl:mr-0 rtl:ml-4 shadow-inner">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);


const UserProfilePage: React.FC = () => {
  const { 
    currentUser, 
    getProjectsByOwnerId, 
    getTasksByAssigneeId, 
    getTasksCompletedByAssignee, 
    getTasksInProgressByAssignee,
    updateTask,
    deleteTask,
    users,
    getProjectById,
    addNotification,
    activityLogs,
    organizations,
  } = useAppContext();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const organization = useMemo(() => {
    if (!currentUser) return null;
    return organizations.find(org => org.id === currentUser.organizationId);
  }, [currentUser, organizations]);

  const userActivity = useMemo(() => {
    if (!currentUser) return [];
    return activityLogs
        .filter(log => log.userId === currentUser.id)
        .slice(0, 7);
  }, [currentUser, activityLogs]);

  const projectsOwned = useMemo<Project[]>(() => {
    if (!currentUser) return [];
    return getProjectsByOwnerId(currentUser.id);
  }, [currentUser, getProjectsByOwnerId]);

  const tasksAssigned = useMemo<Task[]>(() => {
    if (!currentUser) return [];
    return getTasksByAssigneeId(currentUser.id);
  }, [currentUser, getTasksByAssigneeId]);

  const tasksCompleted = useMemo<number>(() => {
    if (!currentUser) return 0;
    return getTasksCompletedByAssignee(currentUser.id).length;
  }, [currentUser, getTasksCompletedByAssignee]);

  const tasksInProgress = useMemo<number>(() => {
    if (!currentUser) return 0;
    return getTasksInProgressByAssignee(currentUser.id).length;
  }, [currentUser, getTasksInProgressByAssignee]);

  if (!currentUser) {
    return <div className="text-center py-10">{t('loadingOrNotFound')}</div>;
  }
  
  const getPermissionSummary = (permissions: User['permissions']): string => {
    if (permissions[Permission.MANAGE_ORGANIZATION]) return t('userRoleAdmin');
    if (permissions[Permission.CREATE_PROJECTS]) return t('userRoleProjectManager');
    return t('userRoleTeamMember');
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    const task = tasksAssigned.find(t => t.id === taskId);
    if (task) {
      updateTask({ ...task, status });
    }
  };

  const handleEditTaskRedirect = (task: Task) => {
    const project = getProjectById(task.projectId);
    if (project) {
      addNotification('notificationRedirectingToEditTask', { taskName: task.name }, `/project/${task.projectId}?openEditTask=${task.id}`); 
    }
  };

  const handleDeleteTaskFromProfile = (taskId: string) => {
    if(window.confirm(t('deleteTaskConfirmation'))) {
      deleteTask(taskId);
    }
  };

  const handleViewCommentsRedirect = (taskId: string) => {
    const task = tasksAssigned.find(t => t.id === taskId);
    if (task) {
      const project = getProjectById(task.projectId);
      if (project) {
        addNotification('notificationRedirectingToViewComments', { taskName: task.name }, `/project/${task.projectId}?openComments=${taskId}`); 
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
        <Card>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.name} className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-6 rtl:md:mr-0 rtl:md:ml-6 flex-shrink-0 shadow-lg" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-semibold mb-4 md:mb-0 md:mr-6 rtl:md:mr-0 rtl:md:ml-6 flex-shrink-0 shadow-lg">
                      {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-grow">
                    <h1 className="text-3xl font-bold text-gray-800">{currentUser.name}</h1>
                    <p className="text-md text-gray-600">{currentUser.email}</p>
                    <div className="mt-2 text-sm text-gray-500 space-x-4 rtl:space-x-reverse">
                        <span><span className="font-semibold">{t('userProfileRoleLabel')}:</span> {getPermissionSummary(currentUser.permissions)}</span>
                        {organization && <span><span className="font-semibold">{t('userProfileOrganizationLabel')}:</span> {organization.name}</span>}
                    </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-auto rtl:md:ml-0 rtl:md:mr-auto flex-shrink-0">
                    <Button 
                        onClick={() => setIsEditModalOpen(true)} 
                        variant="outline" 
                        size="sm" 
                        leftIcon={<UserEditIcon />}
                    >
                        {t('editProfileButton')}
                    </Button>
                </div>
            </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title={t('projectsOwnedStat')} value={projectsOwned.length} icon={<ProjectIcon />} />
          <StatCard title={t('tasksAssignedStat')} value={tasksAssigned.length} icon={<TasksIcon />} />
          <StatCard title={t('tasksCompletedStat')} value={tasksCompleted} icon={<CheckCircleIcon />} />
          <StatCard title={t('tasksInProgressStat')} value={tasksInProgress} icon={<ClockIcon />} />
        </div>
      
        <Card title={t('myProfileActivityTitle')}>
            {userActivity.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {userActivity.map(log => (
                        <li key={log.id} className="py-3 flex items-center space-x-4 rtl:space-x-reverse">
                            <ActivityIcon action={log.actionType} />
                            <div className="flex-1">
                                <p className="text-sm text-gray-800">{log.details}</p>
                                <p className="text-xs text-gray-500">{formatRelativeTime(log.timestamp)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-center py-4">{t('myProfileNoActivity')}</p>
            )}
        </Card>

        <Card title={t('myProfileProjectsSectionTitle')}>
            {projectsOwned.length > 0 ? (
                <ProjectList projects={projectsOwned} />
            ) : (
                <p className="text-gray-500 text-center py-4">{t('noProjectsYet')}</p>
            )}
        </Card>
        
        <Card title={t('myProfileTasksSectionTitle')}>
            {tasksAssigned.length > 0 ? (
                <div className="p-1">
                    <TaskList
                        tasks={tasksAssigned}
                        users={users}
                        onUpdateTaskStatus={handleUpdateTaskStatus}
                        onEditTask={handleEditTaskRedirect}
                        onDeleteTask={handleDeleteTaskFromProfile}
                        onViewComments={handleViewCommentsRedirect}
                    />
                </div>
            ) : (
                <p className="text-gray-500 text-center py-4">{t('noTasksAssigned')}</p>
            )}
        </Card>

        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t('editProfileModalTitle')}>
            <EditProfileForm onClose={() => setIsEditModalOpen(false)} />
        </Modal>
    </div>
  );
};

export default UserProfilePage;