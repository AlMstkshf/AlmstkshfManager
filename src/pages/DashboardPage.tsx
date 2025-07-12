
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAppContext } from '@/contexts/AppContext';
import ProjectForm from '@/components/projects/ProjectForm';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import DashboardAnalytics from '@/components/dashboard/DashboardAnalytics';
import UrgentTasksSummary from '@/components/dashboard/UrgentTasksSummary';
import AIInsightsPanel from '@/components/dashboard/AIInsightsPanel';
import ProjectList from '@/components/projects/ProjectList';
import TaskList from '@/components/tasks/TaskList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTranslations } from '@/hooks/useTranslations';
import { TaskPriority, TaskStatus, MeetingAgenda, User, Project, Task, ProjectInsightItem, AIInsightsResponse, Permission } from '@/types';
import { isDueWithinHours, formatDate } from '@/utils/helpers'; 
import { generateMeetingAgenda as generateMeetingAgendaFunction } from '@/firebase';
import { PlusIcon, ArchiveBoxIcon, EyeIcon, FolderOpenIcon, ClipboardListIcon, LightBulbIcon, UserGroupIconDashboard } from '@/components/ui/Icons';

interface UrgentTaskView extends Task {
  projectName: string;
  projectOwnerName: string;
}

const StatCardLink: React.FC<{ title: string; description: string; linkTo: string; icon: React.ReactNode; buttonText: string; colorClass: string }> = ({ title, description, linkTo, icon, buttonText, colorClass }) => {
  const navigate = useNavigate();
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full`}>
      <div>
        <div className="flex items-start">
          <div className={`p-3 rounded-full ${colorClass} text-white mr-4 rtl:mr-0 rtl:ml-4`}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 text-right rtl:text-left">
        <Button onClick={() => navigate(linkTo)} variant="outline" size="sm">
          {buttonText} 
        </Button>
      </div>
    </div>
  );
};


const DashboardPage: React.FC = () => {
  const { 
    projects, currentUser, tasks, users, getProjectById, getActiveProjects, 
    generateProjectInsights, 
  } = useAppContext(); 
  const { t } = useTranslations();
  const navigate = useNavigate();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [meetingAgenda, setMeetingAgenda] = useState<MeetingAgenda | null>(null);
  const [isLoadingAgenda, setIsLoadingAgenda] = useState(false);
  const [agendaError, setAgendaError] = useState<string | null>(null);

  const [projectInsights, setProjectInsights] = useState<ProjectInsightItem[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);


  const userProjects = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.permissions[Permission.MANAGE_USERS]) return projects; // Admins see all projects
    return projects.filter(p => p.ownerId === currentUser.id || tasks.some(t => t.projectId === p.id && t.assigneeId === currentUser.id));
  }, [projects, tasks, currentUser]);

  const activeProjects = useMemo(() => {
    return userProjects.filter(p => !p.isArchived);
  }, [userProjects]);
  
  const archivedProjects = useMemo(() => {
    return userProjects.filter(p => p.isArchived);
  }, [userProjects]);

  const projectsToDisplay = showArchived ? archivedProjects : activeProjects;
  
  const tasksForAnalytics = useMemo(() => {
    const isElevatedUser = currentUser?.permissions[Permission.MANAGE_USERS] || currentUser?.permissions[Permission.CREATE_PROJECTS];
    const projectIdsForAnalytics = isElevatedUser
                                    ? projects.filter(p => !p.isArchived).map(p => p.id)
                                    : activeProjects.map(p => p.id);
    return tasks.filter(t => projectIdsForAnalytics.includes(t.projectId));
  }, [tasks, projects, activeProjects, currentUser]);


  const urgentHighPriorityTasksGrouped: Record<string, UrgentTaskView[]> = useMemo(() => {
    const isElevatedUser = currentUser?.permissions[Permission.MANAGE_USERS] || currentUser?.permissions[Permission.CREATE_PROJECTS];
    const projectsToCheck = isElevatedUser 
                            ? projects.filter(p => !p.isArchived)
                            : activeProjects; 

    const urgentTasks = tasks
      .map(task => {
        const project = projectsToCheck.find(p => p.id === task.projectId);
        if (!project) return null;

        if (
          task.priority === TaskPriority.High &&
          task.status !== TaskStatus.Done &&
          isDueWithinHours(task.dueDate, 48)
        ) {
          const owner = users.find(u => u.id === project.ownerId);
          if (owner) {
            return {
              ...task,
              projectName: project.name,
              projectOwnerName: owner.name,
            };
          }
        }
        return null;
      })
      .filter((task): task is UrgentTaskView => task !== null);

    return urgentTasks.reduce((acc, task) => {
      const ownerName = task.projectOwnerName;
      if (!acc[ownerName]) {
        acc[ownerName] = [];
      }
      acc[ownerName].push(task);
      return acc;
    }, {} as Record<string, UrgentTaskView[]>);
  }, [tasks, projects, users, activeProjects, currentUser]);

  const handleGenerateAgenda = async () => {
    setIsLoadingAgenda(true);
    setAgendaError(null);
    setMeetingAgenda(null);
    
    if (!currentUser) return;

    const isElevatedUser = currentUser.permissions[Permission.MANAGE_USERS] || currentUser.permissions[Permission.CREATE_PROJECTS];
    const relevantProjects = isElevatedUser 
                                ? getActiveProjects()
                                : activeProjects; 
    const relevantProjectIds = relevantProjects.map(p => p.id);
    const relevantTasks = tasks.filter(task => 
        relevantProjectIds.includes(task.projectId) && task.status !== TaskStatus.Done
    );

    const projectNamesString = relevantProjects.map(p => p.name).join(', ');
    const taskListJsonString = JSON.stringify(relevantTasks.map(task => ({
        id: task.id,
        name: task.name,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assigneeId: task.assigneeId,
        dependsOnTaskId: task.dependsOnTaskId,
        projectName: relevantProjects.find(p=>p.id === task.projectId)?.name
    })));
    

    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const prompt = t('geminiMeetingAgendaPrompt', {
        currentDate,
        projectNamesString: projectNamesString || 'N/A',
        taskListJsonString,
      });
      
      const result = await generateMeetingAgendaFunction({ prompt });
      const parsedData = result.data as MeetingAgenda;

      if (parsedData && parsedData.agendaTitle) {
        setMeetingAgenda(parsedData);
      } else {
        setAgendaError(t('agendaGenerationError') + ' (Invalid format)');
      }
    } catch (err) {
      console.error("Error generating meeting agenda:", err);
      setAgendaError(t('agendaGenerationError'));
    } finally {
      setIsLoadingAgenda(false);
      if(!isAgendaModalOpen) setIsAgendaModalOpen(true); 
    }
  };

  const renderAgendaItem = (item: {taskName?: string, point?: string, assigneeName?: string, dueDate?: string, blockedByTaskName?:string, relatedTaskIds?: string[]}, type: 'discussion' | 'overdue' | 'blocked') => {
    let content = item.point || item.taskName || 'N/A';
    const task = item.relatedTaskIds && item.relatedTaskIds.length > 0 ? tasks.find(t => t.id === item.relatedTaskIds![0]) : null;
    const project = task ? getProjectById(task.projectId) : null;

    return (
        <li key={item.point || item.taskName || Math.random()} className="py-2">
             {task && project ? (
                <Link to={`/project/${project.id}?openComments=${task.id}`} className="text-primary hover:underline">{content}</Link>
            ) : (
                <span>{content}</span>
            )}
            {(item.assigneeName || item.dueDate || item.blockedByTaskName) && (
                <span className="text-xs text-gray-500 ml-2 rtl:mr-2 rtl:ml-0">
                    ({item.assigneeName && `${t('agendaAssignee')}: ${item.assigneeName}`}
                    {item.dueDate && `, ${t('agendaDueDate')}: ${formatDate(item.dueDate)}`}
                    {item.blockedByTaskName && `, ${t('agendaBlockedBy')}: ${item.blockedByTaskName}`})
                </span>
            )}
        </li>
    );
  };

  const handleGenerateInsights = async () => {
    setIsLoadingInsights(true);
    setInsightsError(null);
    setProjectInsights([]);
    try {
        const insightsData = await generateProjectInsights(); 
        if (insightsData && insightsData.insights) {
            setProjectInsights(insightsData.insights);
        } else {
            setInsightsError(t('insightsGenerationNoInsights'));
        }
    } catch (error) {
        console.error("Error fetching insights from dashboard:", error);
        setInsightsError(t('insightsGenerationError'));
    } finally {
        setIsLoadingInsights(false);
    }
  };

  const projectListTitle = currentUser?.permissions[Permission.MANAGE_USERS] ? t('allOrganizationProjectsTitle') : t('myProjects');
  const canPerformAIActions = currentUser?.permissions[Permission.MANAGE_USERS] || currentUser?.permissions[Permission.CREATE_PROJECTS];


  return (
    <div className="container mx-auto">
      {currentUser && <UrgentTasksSummary groupedTasks={urgentHighPriorityTasksGrouped} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 mt-8">
         {currentUser?.permissions[Permission.MANAGE_USERS] && (
            <StatCardLink
                title={t('dashboardUserManagementCardTitle')}
                description={t('dashboardUserManagementCardDesc')}
                linkTo="/user-management"
                icon={<UserGroupIconDashboard />}
                buttonText={t('dashboardUserManagementCardButton')}
                colorClass="bg-purple-500"
            />
        )}
        {canPerformAIActions && (
             <div className="lg:col-span-1">
             </div>
        )}
         {canPerformAIActions && (
             <div className="lg:col-span-1">
             </div>
        )}
      </div>

      {currentUser && activeProjects.length > 0 && <DashboardAnalytics projects={activeProjects} tasks={tasksForAnalytics} users={users} />}


      <div className="flex justify-between items-center mb-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          {showArchived ? t('archivedProjects') : projectListTitle}
        </h2>
        <div className="flex space-x-2 rtl:space-x-reverse flex-wrap gap-2 justify-end">
           {canPerformAIActions && (
            <Button 
                onClick={handleGenerateInsights} 
                variant="outline"
                size="md"
                leftIcon={<LightBulbIcon />}
                isLoading={isLoadingInsights}
                disabled={isLoadingInsights || activeProjects.length === 0}
                title={activeProjects.length === 0 ? t('noProjectsYet') : t('generateInsightsButton')}
            >
                {t('generateInsightsButton')}
            </Button>
           )}
           {canPerformAIActions && (
            <Button 
                onClick={handleGenerateAgenda} 
                variant="outline"
                size="md"
                leftIcon={<ClipboardListIcon />}
                isLoading={isLoadingAgenda}
                disabled={isLoadingAgenda || activeProjects.length === 0}
                title={activeProjects.length === 0 ? t('noProjectsYet') : t('generateMeetingAgendaButton')}
            >
                {t('generateMeetingAgendaButton')}
            </Button>
           )}
          <Button 
            onClick={() => setShowArchived(!showArchived)} 
            variant="outline"
            size="md"
            leftIcon={showArchived ? <EyeIcon /> : <ArchiveBoxIcon />}
          >
            {showArchived ? t('showActiveProjects') : t('showArchivedProjects')}
          </Button>
          {!showArchived && currentUser?.permissions[Permission.CREATE_PROJECTS] && (
            <Button onClick={() => setIsProjectModalOpen(true)} leftIcon={<PlusIcon/>}>
              {t('createProjectBtn')}
            </Button>
          )}
        </div>
      </div>

      <AIInsightsPanel insights={projectInsights} isLoading={isLoadingInsights} error={insightsError} />

      <ProjectList projects={projectsToDisplay} />

      {projectsToDisplay.length === 0 && showArchived && (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm mt-6">
            <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">{t('noArchivedProjects')}</h3>
        </div>
      )}
       {projectsToDisplay.length === 0 && !showArchived && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm mt-6">
            <FolderOpenIcon />
            <h3 className="mt-4 text-xl font-medium text-gray-900">{t('noProjectsYet')}</h3>
            <p className="mt-2 text-sm text-gray-500">{t('createOneToGetStarted')}</p>
            {currentUser?.permissions[Permission.CREATE_PROJECTS] && (
                <Button onClick={() => setIsProjectModalOpen(true)} leftIcon={<PlusIcon />} className="mt-6">
                    {t('createProjectBtn')}
                </Button>
            )}
        </div>
      )}


      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title={t('createProject')}>
        <ProjectForm onClose={() => setIsProjectModalOpen(false)} />
      </Modal>

      <Modal isOpen={isAgendaModalOpen} onClose={() => setIsAgendaModalOpen(false)} title={meetingAgenda?.agendaTitle || t('meetingAgendaTitle')} size="xl">
        {isLoadingAgenda && (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-3 text-gray-600">{t('generatingAgendaLoading')}</p>
            </div>
        )}
        {agendaError && !isLoadingAgenda && (
            <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">{t('error')} </strong>
                <span className="block sm:inline">{agendaError}</span>
            </div>
        )}
        {meetingAgenda && !isLoadingAgenda && !agendaError && (
            <div className="space-y-6 p-2">
                {meetingAgenda.discussionPoints?.length > 0 && (
                    <section>
                        <h3 className="text-lg font-semibold text-secondary mb-2 border-b pb-1">{t('agendaDiscussionPoints')}</h3>
                        <ul className="list-disc list-inside ml-4 rtl:mr-4 rtl:ml-0 space-y-1 text-sm">
                            {meetingAgenda.discussionPoints.map(item => renderAgendaItem(item, 'discussion'))}
                        </ul>
                    </section>
                )}
                {meetingAgenda.overdueTasksReview?.length > 0 && (
                    <section>
                        <h3 className="text-lg font-semibold text-red-600 mb-2 border-b pb-1">{t('agendaOverdueTasksReview')}</h3>
                        <ul className="list-disc list-inside ml-4 rtl:mr-4 rtl:ml-0 space-y-1 text-sm">
                             {meetingAgenda.overdueTasksReview.map(item => renderAgendaItem(item, 'overdue'))}
                        </ul>
                    </section>
                )}
                {meetingAgenda.blockedTasksReview?.length > 0 && (
                    <section>
                        <h3 className="text-lg font-semibold text-yellow-600 mb-2 border-b pb-1">{t('agendaBlockedTasksReview')}</h3>
                        <ul className="list-disc list-inside ml-4 rtl:mr-4 rtl:ml-0 space-y-1 text-sm">
                            {meetingAgenda.blockedTasksReview.map(item => renderAgendaItem(item, 'blocked'))}
                        </ul>
                    </section>
                )}
                 {(meetingAgenda.discussionPoints?.length === 0 && meetingAgenda.overdueTasksReview?.length === 0 && meetingAgenda.blockedTasksReview?.length === 0) && (
                    <p className="text-gray-600">{t('agendaNoTasksToDiscuss')}</p>
                 )}
                {meetingAgenda.planningSuggestions?.length > 0 && (
                     <section>
                        <h3 className="text-lg font-semibold text-green-600 mb-2 border-b pb-1">{t('agendaPlanningSuggestions')}</h3>
                        <ul className="list-disc list-inside ml-4 rtl:mr-4 rtl:ml-0 space-y-1 text-sm text-gray-700">
                            {meetingAgenda.planningSuggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}
                        </ul>
                    </section>
                )}
                 <div className="text-xs text-gray-400 text-center pt-4">AI Generated Agenda</div>
            </div>
        )}
         {!isLoadingAgenda && !agendaError && !meetingAgenda && (
            <p className="text-gray-600 text-center py-10">{t('agendaGenerationNoAgenda')}</p>
        )}
      </Modal>

    </div>
  );
};

export default DashboardPage;