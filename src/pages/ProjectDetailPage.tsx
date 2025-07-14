
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Project, Task, TaskStatus, Permission } from '@/types';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { formatDate } from '@/utils/helpers';
import { PROJECT_COLORS } from '@/constants';
import ProjectForm from '@/components/projects/ProjectForm';
import { useTranslations } from '@/hooks/useTranslations';
import TaskComments from '@/components/tasks/TaskComments'; 
import ProjectTimelineView from '@/components/projects/ProjectTimelineView';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 me-1 rtl:me-0 rtl:ms-1"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 me-1 rtl:me-0 rtl:ms-1"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.03 3.22.077m3.22-.077L10.879 3.286a1.125 1.125 0 011.07-1.071h.078a1.125 1.125 0 011.07 1.07L15.18 5.79m-3.22-.077c1.153 0 2.24.03 3.22.077" /></svg>;
const ArchiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 me-1 rtl:me-0 rtl:ms-1"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.001c0 .621.504 1.125 1.125 1.125z" /></svg>;
const UnarchiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 me-1 rtl:me-0 rtl:ms-1"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m.25 11.25h10.25M12 15.75V11.25L9.75 7.5M12 11.25L14.25 7.5M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.001c0 .621.504 1.125 1.125 1.125z" /></svg>;

const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslations();
    const { 
        getProjectById, getTasksByProjectId, users, updateTask, deleteTask, 
        currentUser, deleteProject, archiveProject,
    } = useAppContext();

    const [project, setProject] = useState<Project | null | undefined>(undefined);
    const [tasks, setTasks] = useState<Task[]>([]);
    
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [activeCommentsTaskId, setActiveCommentsTaskId] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<'tasks' | 'timeline'>('tasks');


    useEffect(() => {
        if (projectId) {
            const foundProject = getProjectById(projectId);
            setProject(foundProject);
            if(foundProject) {
                const projectTasks = getTasksByProjectId(projectId);
                setTasks(projectTasks);
            }
        }
    }, [projectId, getProjectById, getTasksByProjectId]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const commentTaskId = queryParams.get('openComments');
        const editTaskId = queryParams.get('openEditTask');

        if (commentTaskId) {
            handleViewComments(commentTaskId);
        }
        if (editTaskId) {
            const task = tasks.find(t => t.id === editTaskId);
            if (task) handleEditTask(task);
        }
    }, [location.search, tasks]);

    const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            updateTask({ ...task, status });
        }
    };
    
    const handleEditTask = (task: Task) => {
        setTaskToEdit(task);
        setIsTaskModalOpen(true);
    };

    const handleDeleteTask = (taskId: string) => {
        if (window.confirm(t('deleteTaskConfirmation'))) {
            deleteTask(taskId);
        }
    };

    const handleDeleteProject = () => {
        if (project && window.confirm(t('deleteProjectConfirmation'))) {
            deleteProject(project.id);
            navigate('/');
        }
    };

    const handleArchiveProject = (archive: boolean) => {
        if(project){
            const confirmation = archive ? t('archiveProjectConfirmation') : t('unarchiveProjectConfirmation');
            if(window.confirm(confirmation)){
                archiveProject(project.id, archive);
            }
        }
    };
    
    const handleViewComments = (taskId: string) => {
        setActiveCommentsTaskId(taskId);
        setIsCommentsModalOpen(true);
    };

    if (project === undefined) {
        return <div className="text-center py-10">{t('loadingOrNotFound')}</div>;
    }
    if (project === null) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold">{t('loadingOrNotFound')}</h2>
                <p className="text-gray-600">Project not found</p>
                <Button onClick={() => navigate('/')} className="mt-4">Go to Dashboard</Button>
            </div>
        );
    }
    
    const owner = users.find(u => u.id === project.ownerId);
    const projectColorMeta = PROJECT_COLORS.find(pc => pc.value === project.color || pc.twClass === project.color);
    const displayColor = projectColorMeta ? projectColorMeta.twClass : 'bg-gray-500';

    const canEditProject = currentUser?.permissions[Permission.EDIT_ALL_PROJECTS] || currentUser?.id === project.ownerId;
    const canDeleteProject = currentUser?.permissions[Permission.DELETE_ALL_PROJECTS];
    const canArchiveProject = currentUser?.permissions[Permission.ARCHIVE_ALL_PROJECTS];
    const canCreateTask = currentUser?.permissions[Permission.CREATE_TASKS];

    return (
        <div className="space-y-6">
            <header className={`p-6 rounded-lg shadow-lg bg-white border-t-8 ${displayColor.replace('bg-', 'border-')}`}>
                {project.isArchived && (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded" role="alert">
                      <p className="font-bold">{t('projectArchivedBadge')}</p>
                      <p>{t('projectIsArchivedNoTasks')}</p>
                  </div>
                )}
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
                        <p className="text-gray-600 mt-1">{project.description || t('noDescription')}</p>
                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                            <span><strong>{t('status')}</strong> {project.isArchived ? t('projectArchivedBadge') : 'Active'}</span>
                            <span><strong>Owner</strong> {owner?.name || t('unknownUser')}</span>
                             {/* @ts-ignore */}
                            <span><strong>{t('startDate')}</strong> {formatDate(project.startDate)}</span>
                             {/* @ts-ignore */}
                            {project.endDate && <span><strong>{t('endDateOptional')}</strong> {formatDate(project.endDate)}</span>}
                            {project.budget && <span><strong>{t('budgetOptional')}</strong> ${project.budget.toLocaleString()}</span>}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 md:mt-0 md:ms-4 flex-shrink-0">
                       {canEditProject && <Button variant="outline" size="sm" onClick={() => setIsProjectModalOpen(true)} leftIcon={<EditIcon />}>{t('editProject')}</Button>}
                       {canArchiveProject && <Button variant="outline" size="sm" onClick={() => handleArchiveProject(!project.isArchived)} leftIcon={project.isArchived ? <UnarchiveIcon /> : <ArchiveIcon />}>{project.isArchived ? t('unarchiveProjectBtn') : t('archiveProjectBtn')}</Button>}
                       {canDeleteProject && <Button variant="danger" size="sm" onClick={handleDeleteProject} leftIcon={<DeleteIcon />}>{t('deleteProjectBtn')}</Button>}
                    </div>
                </div>
            </header>

            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <div className="flex space-x-1 rtl:space-x-reverse">
                         <Button variant={activeTab === 'tasks' ? 'primary' : 'ghost'} onClick={() => setActiveTab('tasks')}>{t('tasks')}</Button>
                         <Button variant={activeTab === 'timeline' ? 'primary' : 'ghost'} onClick={() => setActiveTab('timeline')}>{t('timelineViewTab')}</Button>
                    </div>
                    <div>
                        {canCreateTask && !project.isArchived && (
                            <Button onClick={() => { setTaskToEdit(undefined); setIsTaskModalOpen(true); }} leftIcon={<PlusIcon />}>
                                {t('addTask')}
                            </Button>
                        )}
                    </div>
                </div>

                {activeTab === 'tasks' && (
                    <>
                        {project.isArchived ? (
                             <p className="text-center text-gray-500 py-8">{t('projectIsArchivedNoTasks')}</p>
                        ) : (
                             <TaskList 
                                tasks={tasks} 
                                users={users} 
                                onUpdateTaskStatus={handleUpdateTaskStatus} 
                                onEditTask={handleEditTask}
                                onDeleteTask={handleDeleteTask}
                                onViewComments={handleViewComments}
                            />
                        )}
                    </>
                )}
                {activeTab === 'timeline' && (
                     <ProjectTimelineView tasks={tasks} users={users} />
                )}
            </div>

            {isTaskModalOpen && (
                <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={taskToEdit ? t('editTask') : t('addTask')}>
                    <TaskForm 
                        onClose={() => setIsTaskModalOpen(false)} 
                        projectId={project.id} 
                        taskToEdit={taskToEdit}
                    />
                </Modal>
            )}

            {isProjectModalOpen && (
                <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title={t('editProject')}>
                    <ProjectForm 
                        onClose={() => setIsProjectModalOpen(false)} 
                        projectToEdit={project}
                    />
                </Modal>
            )}
            
            {isCommentsModalOpen && activeCommentsTaskId && (
                <Modal isOpen={isCommentsModalOpen} onClose={() => setIsCommentsModalOpen(false)} title={t('taskCommentsTitle')} size="lg">
                    <TaskComments
                        taskId={activeCommentsTaskId}
                        projectId={project.id}
                        onClose={() => setIsCommentsModalOpen(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ProjectDetailPage;
