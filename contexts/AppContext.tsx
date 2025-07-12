import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { 
  Project, 
  Task, 
  Todo, 
  Notification, 
  User, 
  Organization, 
  TaskStatus, 
  Language, 
  UserStatus, 
  TaskComment, 
  TaskCommentSentiment,
  AISentimentResponse,
  AIInsightsResponse, 
  TourStep,
  ProjectIdea, 
  SavedProjectIdea,
  ActivityLog,
  ActivityActionType,
  Permission,
  TEAM_MEMBER_PERMISSIONS,
  ADMIN_PERMISSIONS,
  MeetingAgenda
} from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { generateId } from '../utils/helpers';
import { DEFAULT_LANGUAGE } from '../constants';
import { LocaleKey, translations } from '../locales';

const MOCK_USERS: User[] = [];
const MOCK_ORGANIZATIONS: Organization[] = [];

// --- Helper Functions ---
const generateSecureToken = (length = 32) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// --- Context Type Definition ---
interface AppContextType {
  // State
  projects: Project[];
  tasks: Task[];
  todos: Todo[];
  users: User[];
  organizations: Organization[];
  savedIdeas: SavedProjectIdea[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  currentUser: User | null;
  language: Language;
  
  // Auth
  loginUser: (email: string, pass: string) => User | { error: LocaleKey };
  logout: () => void;
  registerAndCreateOrg: (userData: Omit<User, 'id' | 'organizationId' | 'status' | 'permissions'>, orgName: string, pass: string) => User | { error: LocaleKey };
  registerWithInvite: (userData: Omit<User, 'id' | 'organizationId' | 'status' | 'permissions'>, inviteCode: string, pass: string) => User | { error: LocaleKey };
  verifyInvitationToken: (token: string) => User | null;
  setUserPasswordAndActivate: (userId: string, pass: string) => boolean;
  requestPasswordReset: (email: string) => Promise<boolean>;
  verifyPasswordResetToken: (token: string) => User | null;
  resetUserPassword: (userId: string, pass: string) => boolean;

  // Data Getters
  getProjectById: (projectId: string) => Project | undefined;
  getTasksByProjectId: (projectId: string) => Task[];
  getTasksByAssigneeId: (userId: string) => Task[];
  getTodosByUserId: (userId: string) => Todo[];
  getCommentsByTaskId: (taskId: string) => TaskComment[];
  getActiveProjects: () => Project[];
  getProjectsByOwnerId: (userId: string) => Project[];
  getTasksCompletedByAssignee: (userId: string) => Task[];
  getTasksInProgressByAssignee: (userId: string) => Task[];
  getUserById: (userId: string) => User | undefined;
  
  // Data Mutators
  addProject: (projectData: Omit<Project, 'id' | 'ownerId' | 'organizationId'>, fromIdea?: boolean) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  archiveProject: (projectId: string, archive: boolean) => void;

  addTask: (taskData: Omit<Task, 'id' | 'organizationId'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;

  addTodo: (todoData: Omit<Todo, 'id' | 'userId' | 'organizationId'>) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (todoId: string) => void;

  addUser: (userData: Omit<User, 'id' | 'organizationId' | 'status'>) => boolean;
  updateUser: (user: User) => boolean;
  deleteUser: (userId: string) => void;
  updateOrganization: (orgId: string, orgData: Partial<Organization>) => void;
  
  addTaskComment: (taskId: string, projectId: string, text: string) => Promise<void>;

  saveProjectIdea: (idea: Omit<ProjectIdea, 'organizationId' | 'id'> & {id?:string}) => void;
  removeSavedIdea: (ideaId: string) => void;
  isIdeaSaved: (ideaId: string) => boolean;

  // Notifications
  addNotification: (messageKey: LocaleKey, messageParams?: Record<string, string | number>, link?: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;

  // Tour
  isTourOpen: boolean;
  tourSteps: TourStep[];
  currentTourStepIndex: number;
  startTour: () => void;
  finishTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;

  // Language
  setLanguage: (language: Language) => void;

  // Permissions
  canCurrentUserManageUsers: () => boolean;
  isCurrentUserAdmin: () => boolean;
  canCurrentUserEditTask: (task: Task, project?: Project | null) => boolean;
  canCurrentUserDeleteTask: (task: Task, project?: Project | null) => boolean;

  // AI Features
  generateProjectInsights: () => Promise<AIInsightsResponse>;
  generateMeetingAgenda: (prompt: string) => Promise<MeetingAgenda>;
  generateProjectIdeas: (prompt: string) => Promise<ProjectIdea[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // This is a simplified context implementation. In a real app, you'd likely
    // split this into multiple contexts (AuthContext, DataContext, etc.)
    // and use a library like Redux Toolkit or Zustand for more complex state.
    
    // --- STATE MANAGEMENT ---
    const [organizations, setOrganizations] = useLocalStorage<Organization[]>('organizations', MOCK_ORGANIZATIONS);
    const [users, setUsers] = useLocalStorage<User[]>('users', MOCK_USERS);
    const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
    const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
    const [taskComments, setTaskComments] = useLocalStorage<TaskComment[]>('taskComments', []);
    const [savedIdeas, setSavedIdeas] = useLocalStorage<SavedProjectIdea[]>('savedIdeas', []);
    const [activityLogs, setActivityLogs] = useLocalStorage<ActivityLog[]>('activityLogs', []);

    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);
    const [language, setLanguage] = useLocalStorage<Language>('language', DEFAULT_LANGUAGE);
    
    // --- AUTH LOGIC (MOCK) ---
    const loginUser = (email: string, pass: string): User | { error: LocaleKey } => {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user && user.password === pass) {
            if (user.status === UserStatus.Deactivated) {
                return { error: 'loginUserDeactivatedPrompt' };
            }
            if (user.status === UserStatus.Invited) {
                return { error: 'loginUserInvitedPrompt' };
            }
            setCurrentUser(user);
            addActivityLog(ActivityActionType.UserLoggedIn, {userId: user.id, userName: user.name, targetEntityId: user.id, targetEntityName: user.name, targetEntityType: 'auth'});
            return user;
        }
        return { error: 'loginFailedError' };
    };

    const logout = () => {
        if (currentUser) {
           addActivityLog(ActivityActionType.UserLoggedOut, {userId: currentUser.id, userName: currentUser.name, targetEntityId: currentUser.id, targetEntityName: currentUser.name, targetEntityType: 'auth'});
        }
        setCurrentUser(null);
    };
    
    const registerAndCreateOrg = (userData: Omit<User, 'id' | 'organizationId' | 'status' | 'permissions'>, orgName: string, pass: string): User | { error: LocaleKey } => {
        if(users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            return { error: 'emailAlreadyExistsError' };
        }
        const newOrgId = generateId();
        const newOrg: Organization = {
            id: newOrgId,
            name: orgName,
            inviteCode: `${orgName.substring(0,4).toUpperCase()}${generateId().substring(0,4)}`,
            logoUrl: `https://via.placeholder.com/150/007bff/FFFFFF?Text=${orgName.charAt(0).toUpperCase()}`
        };
        setOrganizations(prev => [...prev, newOrg]);

        const newUser: User = {
            ...userData,
            id: generateId(),
            organizationId: newOrgId,
            status: UserStatus.Active,
            permissions: ADMIN_PERMISSIONS,
            password: pass,
        };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        addNotification('notificationOrgCreated', { orgName: newOrg.name, appName: "Almstkshf Manager"});
        return newUser;
    };
    
    const registerWithInvite = (userData: Omit<User, 'id' | 'organizationId' | 'status' | 'permissions'>, inviteCode: string, pass: string): User | { error: LocaleKey } => {
        if(users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            return { error: 'emailAlreadyExistsError' };
        }
        const org = organizations.find(o => o.inviteCode === inviteCode);
        if(!org) {
            return { error: 'inviteCodeInvalidError' };
        }
        const newUser: User = {
            ...userData,
            id: generateId(),
            organizationId: org.id,
            status: UserStatus.Active,
            permissions: TEAM_MEMBER_PERMISSIONS,
            password: pass,
        };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        addNotification('notificationUserRegistered', { name: newUser.name, orgName: org.name});
        return newUser;
    };
    
    const verifyInvitationToken = (token: string): User | null => {
        const user = users.find(u => u.invitationToken === token);
        return user || null;
    };

    const setUserPasswordAndActivate = (userId: string, pass: string): boolean => {
        let userFound = false;
        setUsers(prev => prev.map(u => {
            if (u.id === userId && u.status === UserStatus.Invited) {
                userFound = true;
                addActivityLog(ActivityActionType.UserActivatedByInvite, { userId: u.id, userName: u.name, targetEntityId: u.id, targetEntityName: u.name, targetEntityType: 'user' });
                return { ...u, password: pass, status: UserStatus.Active, invitationToken: undefined };
            }
            return u;
        }));
        return userFound;
    };

    const requestPasswordReset = async (email: string): Promise<boolean> => {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.status === UserStatus.Active);
        if (user) {
            const token = generateSecureToken();
            const expiry = Date.now() + 30 * 60 * 1000; // 30 minutes
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, passwordResetToken: token, passwordResetTokenExpiry: expiry } : u));
            addActivityLog(ActivityActionType.UserPasswordResetRequested, { userId: user.id, userName: user.name, targetEntityId: user.id, targetEntityName: user.name, targetEntityType: 'user' });
            // In a real app, you would send an email here with the link: `/reset-password?token=${token}`
            console.log(`Password reset for ${email}: token=${token}`);
        }
        return true; // Always return true for security
    };

    const verifyPasswordResetToken = (token: string): User | null => {
        const user = users.find(u => u.passwordResetToken === token && u.passwordResetTokenExpiry && u.passwordResetTokenExpiry > Date.now());
        return user || null;
    };
    
    const resetUserPassword = (userId: string, pass: string): boolean => {
        let userFound = false;
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                userFound = true;
                addActivityLog(ActivityActionType.UserPasswordResetCompleted, { userId: u.id, userName: u.name, targetEntityId: u.id, targetEntityName: u.name, targetEntityType: 'user' });
                return { ...u, password: pass, passwordResetToken: undefined, passwordResetTokenExpiry: undefined };
            }
            return u;
        }));
        return userFound;
    };

    // --- ACTIVITY LOG ---
    const addActivityLog = useCallback((actionType: ActivityActionType, data: { userId: string, userName?: string, details?: string, targetEntityType?: 'project' | 'task' | 'user' | 'auth' | 'comment' | 'organization', targetEntityId?: string, targetEntityName?: string }) => {
        if (!currentUser) return;
        const t = (key: LocaleKey, params?: Record<string, string | number>): string => {
          let translation = translations[language]?.[key] || key;
          if (params) {
            Object.keys(params).forEach(paramKey => {
              const regex = new RegExp(`{{${paramKey}}}`, 'g');
              translation = translation.replace(regex, String(params[paramKey]));
            });
          }
          return translation;
        };

        const logKey = `logDetails${actionType}` as LocaleKey;
        const details = t(logKey, { targetName: data.targetEntityName || '', userName: data.userName || '', ...data });

        // Create log object with base properties first
        const newLog: ActivityLog = {
            id: generateId(),
            timestamp: Date.now(),
            organizationId: currentUser.organizationId,
            actionType,
            details,
        };
        
        // Add remaining properties, ensuring userId from data takes precedence
        const logWithData = {
            ...newLog,
            ...data,
            // Ensure userName is set even if not in data
            userName: data.userName || users.find(u=>u.id === data.userId)?.name
        };
        setActivityLogs(prev => [logWithData, ...prev].slice(0, 200)); // Keep last 200 logs
    }, [currentUser, setActivityLogs, users, language]);


    // --- DATA GETTERS ---
    const orgScoped = <T extends {organizationId: string}>(items: T[]): T[] => {
      if(!currentUser) return [];
      return items.filter(item => item.organizationId === currentUser.organizationId);
    };
    const getProjectById = useCallback((projectId: string) => orgScoped<Project>(projects).find(p => p.id === projectId), [projects, currentUser]);
    const getTasksByProjectId = useCallback((projectId: string) => orgScoped<Task>(tasks).filter(t => t.projectId === projectId), [tasks, currentUser]);
    const getActiveProjects = useCallback(() => orgScoped<Project>(projects).filter(p => !p.isArchived), [projects, currentUser]);
    const getUserById = useCallback((userId: string) => orgScoped<User>(users).find(u => u.id === userId), [users, currentUser]);
    const getTasksByAssigneeId = useCallback((userId: string) => {
        const activeProjectIds = getActiveProjects().map(p => p.id);
        return orgScoped<Task>(tasks).filter(t => t.assigneeId === userId && activeProjectIds.includes(t.projectId));
    }, [tasks, getActiveProjects, currentUser]);
    const getTodosByUserId = useCallback((userId: string) => orgScoped<Todo>(todos).filter(t => t.userId === userId), [todos, currentUser]);
    const getCommentsByTaskId = useCallback((taskId: string) => orgScoped<TaskComment>(taskComments).filter(c => c.taskId === taskId).sort((a,b) => a.timestamp - b.timestamp), [taskComments, currentUser]);
    const getProjectsByOwnerId = useCallback((userId: string) => orgScoped<Project>(projects).filter(p => p.ownerId === userId), [projects, currentUser]);
    const getTasksCompletedByAssignee = useCallback((userId: string) => getTasksByAssigneeId(userId).filter(t => t.status === TaskStatus.Done), [getTasksByAssigneeId]);
    const getTasksInProgressByAssignee = useCallback((userId: string) => getTasksByAssigneeId(userId).filter(t => t.status === TaskStatus.InProgress), [getTasksByAssigneeId]);


    // --- NOTIFICATIONS ---
    const addNotification = useCallback((messageKey: LocaleKey, messageParams: Record<string, string | number> = {}, link?: string) => {
        if (!currentUser) return;
        const newNotification: Notification = {
            id: generateId(),
            messageKey,
            messageParams: {...messageParams, orgName: organizations.find(o=>o.id === currentUser.organizationId)?.name || ''},
            read: false,
            timestamp: Date.now(),
            link,
            organizationId: currentUser.organizationId,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, [setNotifications, currentUser, organizations]);

    const markNotificationAsRead = (notificationId: string) => setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    const clearNotifications = () => setNotifications(prev => prev.filter(n => n.organizationId !== currentUser?.organizationId));

    // --- DATA MUTATORS ---
    const addProject = (projectData: Omit<Project, 'id' | 'ownerId' | 'organizationId'>) => {
        if (!currentUser) return;
        const newProject: Project = {
            id: generateId(),
            ...projectData,
            ownerId: currentUser.id,
            organizationId: currentUser.organizationId,
        };
        setProjects(prev => [...prev, newProject]);
        addActivityLog(ActivityActionType.ProjectCreated, {userId: currentUser.id, userName: currentUser.name, targetEntityId: newProject.id, targetEntityName: newProject.name, targetEntityType: 'project'});
        addNotification('notificationProjectCreated', { name: newProject.name });
    };
    const updateProject = (project: Project) => {
        if (!currentUser) return;
        setProjects(prev => prev.map(p => p.id === project.id ? project : p));
        addActivityLog(ActivityActionType.ProjectUpdated, {userId: currentUser.id, userName: currentUser.name, targetEntityId: project.id, targetEntityName: project.name, targetEntityType: 'project'});
        addNotification('notificationProjectUpdated', { name: project.name });
    };
    const deleteProject = (projectId: string) => {
        if (!currentUser) return;
        const project = getProjectById(projectId);
        if (project) {
          setProjects(prev => prev.filter(p => p.id !== projectId));
          setTasks(prev => prev.filter(t => t.projectId !== projectId));
          addActivityLog(ActivityActionType.ProjectDeleted, {userId: currentUser.id, userName: currentUser.name, targetEntityId: project.id, targetEntityName: project.name, targetEntityType: 'project'});
          addNotification('notificationProjectDeleted', { name: project.name });
        }
    };
    const archiveProject = (projectId: string, archive: boolean) => {
        if (!currentUser) return;
        const project = getProjectById(projectId);
        if (project) {
          updateProject({ ...project, isArchived: archive });
          const actionType = archive ? ActivityActionType.ProjectArchived : ActivityActionType.ProjectUnarchived;
          addActivityLog(actionType, {userId: currentUser.id, userName: currentUser.name, targetEntityId: project.id, targetEntityName: project.name, targetEntityType: 'project'});
          addNotification(archive ? 'notificationProjectArchived' : 'notificationProjectUnarchived', { name: project.name });
        }
    };

    const addTask = (taskData: Omit<Task, 'id'| 'organizationId'>) => {
        if (!currentUser) return;
        const newTask: Task = { id: generateId(), ...taskData, organizationId: currentUser.organizationId };
        setTasks(prev => [...prev, newTask]);
        const project = getProjectById(newTask.projectId);
        const assignee = newTask.assigneeId ? getUserById(newTask.assigneeId) : null;
        addActivityLog(ActivityActionType.TaskCreated, {userId: currentUser.id, userName: currentUser.name, targetEntityId: newTask.id, targetEntityName: newTask.name, targetEntityType: 'task'});

        if(assignee) {
          addNotification('notificationTaskCreatedWithAssignee', { taskName: newTask.name, projectName: project?.name || '', assigneeName: assignee.name });
        } else {
          addNotification('notificationTaskCreated', { taskName: newTask.name, projectName: project?.name || '' });
        }
    };
    const updateTask = (task: Task) => {
        if (!currentUser) return;
        const oldTask = tasks.find(t=>t.id === task.id);
        setTasks(prev => prev.map(t => t.id === task.id ? task : t));
        if(oldTask?.status !== task.status) {
             addActivityLog(ActivityActionType.TaskStatusChanged, {userId: currentUser.id, userName: currentUser.name, targetEntityId: task.id, targetEntityName: task.name, targetEntityType: 'task', details: `Status changed from ${oldTask?.status} to ${task.status}`});
        } else {
             addActivityLog(ActivityActionType.TaskUpdated, {userId: currentUser.id, userName: currentUser.name, targetEntityId: task.id, targetEntityName: task.name, targetEntityType: 'task'});
        }
        addNotification('notificationTaskUpdated', { name: task.name, status: task.status });
    };
    const deleteTask = (taskId: string) => {
        if (!currentUser) return;
        const task = tasks.find(t=>t.id === taskId);
        if (task) {
          setTasks(prev => prev.filter(t => t.id !== taskId));
          addActivityLog(ActivityActionType.TaskDeleted, {userId: currentUser.id, userName: currentUser.name, targetEntityId: task.id, targetEntityName: task.name, targetEntityType: 'task'});
          addNotification('notificationTaskDeleted', { name: task.name });
        }
    };

    const addTodo = (todoData: Omit<Todo, 'id' | 'userId' | 'organizationId'>) => {
        if (!currentUser) return;
        const newTodo: Todo = { id: generateId(), ...todoData, userId: currentUser.id, organizationId: currentUser.organizationId };
        setTodos(prev => [...prev, newTodo]);
    };
    const updateTodo = (todo: Todo) => setTodos(prev => prev.map(t => t.id === todo.id ? todo : t));
    const deleteTodo = (todoId: string) => setTodos(prev => prev.filter(t => t.id !== todoId));

    const addUser = (userData: Omit<User, 'id'|'organizationId'|'status'>) => {
        if (!currentUser || !isCurrentUserAdmin()) return false;
        if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase() && u.organizationId === currentUser.organizationId)) return false;
        
        const newUser: User = {
            ...userData,
            id: generateId(),
            status: UserStatus.Invited,
            organizationId: currentUser.organizationId,
            invitationToken: generateSecureToken(),
        };
        setUsers(prev => [...prev, newUser]);
        addActivityLog(ActivityActionType.UserInvited, {userId: currentUser.id, userName: currentUser.name, targetEntityId: newUser.id, targetEntityName: newUser.name, targetEntityType: 'user'});
        // In a real app, send an email with link: `/set-password?token=${newUser.invitationToken}`
        console.log(`INVITE LINK for ${newUser.email}: /set-password?token=${newUser.invitationToken}`);
        addNotification('notificationUserAdded', { name: newUser.name });
        return true;
    };
    const updateUser = (user: User) => {
        if (!currentUser || !isCurrentUserAdmin()) return false;
        const oldUser = users.find(u => u.id === user.id);
        setUsers(prev => prev.map(u => u.id === user.id ? user : u));
        
        if (oldUser && JSON.stringify(oldUser.permissions) !== JSON.stringify(user.permissions)) {
            addActivityLog(ActivityActionType.UserPermissionsChanged, {userId: currentUser.id, userName: currentUser.name, targetEntityId: user.id, targetEntityName: user.name, targetEntityType: 'user'});
        } else {
            addActivityLog(ActivityActionType.UserUpdated, {userId: currentUser.id, userName: currentUser.name, targetEntityId: user.id, targetEntityName: user.name, targetEntityType: 'user'});
        }
        
        addNotification('notificationUserUpdated', { name: user.name });
        return true;
    };
    const deleteUser = (userId: string) => {
        if (!currentUser || !isCurrentUserAdmin() || userId === currentUser.id) return;
        const user = getUserById(userId);
        if (user) {
          setUsers(prev => prev.filter(u => u.id !== userId));
          // Unassign tasks from deleted user
          setTasks(prev => prev.map(t => t.assigneeId === userId ? { ...t, assigneeId: undefined } : t));
          addActivityLog(ActivityActionType.UserDeleted, {userId: currentUser.id, userName: currentUser.name, targetEntityId: user.id, targetEntityName: user.name, targetEntityType: 'user'});
          addNotification('notificationUserDeleted', { name: user.name });
        }
    };
    
    const updateOrganization = (orgId: string, orgData: Partial<Organization>) => {
        if(!currentUser || !isCurrentUserAdmin()) return;
        setOrganizations(prev => prev.map(o => o.id === orgId ? {...o, ...orgData} : o));
        addActivityLog(ActivityActionType.OrganizationUpdated, {userId: currentUser.id, userName: currentUser.name, targetEntityId: orgId, targetEntityName: orgData.name, targetEntityType: 'organization'});
        addNotification('organizationNameUpdated');
    };

    const addTaskComment = async (taskId: string, projectId: string, text: string) => {
        if (!currentUser) return;
        const newComment: TaskComment = {
            id: generateId(),
            taskId,
            userId: currentUser.id,
            text,
            timestamp: Date.now(),
            sentiment: TaskCommentSentiment.Unknown,
            isUrgent: false,
            organizationId: currentUser.organizationId,
        };
        setTaskComments(prev => [...prev, newComment]);
        addActivityLog(ActivityActionType.CommentAdded, {userId: currentUser.id, userName: currentUser.name, targetEntityId: taskId, targetEntityName: tasks.find(t=>t.id === taskId)?.name, targetEntityType: 'comment'});

        // AI Sentiment Analysis (fire and forget)
        try {
            const t = (key: LocaleKey, params?: Record<string, string | number>): string => {
                let translation = translations[language]?.[key] || key;
                if (params) Object.keys(params).forEach(paramKey => {
                    const regex = new RegExp(`{{${paramKey}}}`, 'g');
                    translation = translation.replace(regex, String(params[paramKey]));
                });
                return translation;
            };

            // Use the Cloud Function instead of direct API call
            const prompt = t('geminiSentimentPrompt', { commentText: text });
            
            // Call the Cloud Function
            const functionData = { prompt };
            const response = await fetch('/api/analyzeTaskComment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(functionData)
            });
            
            if (!response.ok) {
                throw new Error(`Cloud function returned status: ${response.status}`);
            }
            
            const sentimentData = await response.json() as AISentimentResponse;
            setTaskComments(prev => prev.map(c => c.id === newComment.id ? { ...c, sentiment: sentimentData.sentiment, isUrgent: sentimentData.isUrgent } : c));
            
            if(sentimentData.isUrgent || sentimentData.sentiment === TaskCommentSentiment.Negative) {
                const task = tasks.find(t=>t.id === taskId);
                const project = projects.find(p=>p.id === projectId);
                addNotification('notificationUrgentComment', {
                    taskName: task?.name || '',
                    projectName: project?.name || '',
                    userName: currentUser.name,
                    commentTextSnippet: text.substring(0, 30)
                }, `/project/${projectId}?openComments=${taskId}`);
            }
        } catch (e) {
            console.error("Sentiment analysis failed:", e);
            setTaskComments(prev => prev.map(c => c.id === newComment.id ? { ...c, sentiment: TaskCommentSentiment.Neutral } : c));
        }
    };
    
    // --- Project Ideas ---
    const saveProjectIdea = (idea: Omit<ProjectIdea, 'organizationId' | 'id'> & {id?:string}) => {
        if(!currentUser) return;
        const newIdea: SavedProjectIdea = {
            id: idea.id || generateId(),
            name: idea.name,
            description: idea.description,
            features: idea.features,
            organizationId: currentUser.organizationId
        };
        setSavedIdeas(prev => [...prev, newIdea]);
        addNotification('notificationIdeaSaved', { ideaName: newIdea.name });
    };

    const removeSavedIdea = (ideaId: string) => {
        const idea = savedIdeas.find(i=>i.id === ideaId);
        if(idea) {
          setSavedIdeas(prev => prev.filter(i => i.id !== ideaId));
          addNotification('notificationIdeaRemoved', { ideaName: idea.name });
        }
    };

    const isIdeaSaved = (ideaId: string) => {
      if(!currentUser) return false;
      return savedIdeas.some(i => i.id === ideaId && i.organizationId === currentUser.organizationId);
    };

    // --- PERMISSIONS ---
    const canCurrentUserManageUsers = () => currentUser?.permissions[Permission.MANAGE_USERS] ?? false;
    const isCurrentUserAdmin = () => currentUser?.permissions[Permission.MANAGE_ORGANIZATION] ?? false;

    const canCurrentUserEditTask = (task: Task, project?: Project | null) => {
        if (!currentUser) return false;
        if (currentUser.permissions[Permission.EDIT_ALL_TASKS]) return true;
        if (project && project.ownerId === currentUser.id) return true;
        if(task.assigneeId === currentUser.id) return true;
        return false;
    };
    
    const canCurrentUserDeleteTask = (task: Task, project?: Project | null) => {
        if (!currentUser) return false;
        if (currentUser.permissions[Permission.DELETE_ALL_TASKS]) return true;
        
        // Use the provided project or get it from the task's projectId
        const taskProject = project || getProjectById(task.projectId);
        if (taskProject && taskProject.ownerId === currentUser.id) return true;
        
        return false;
    };


    // --- TOUR ---
    const tourSteps: TourStep[] = [
        { titleKey: 'tourWelcomeTitle', messageKey: 'tourWelcomeMessage' },
        { titleKey: 'tourDashboardTitle', messageKey: 'tourDashboardMessage', targetHighlight: '#dashboard-page' },
        { titleKey: 'tourCreateProjectTitle', messageKey: 'tourCreateProjectMessage', targetHighlight: '#create-project-btn' },
        { titleKey: 'tourAddTaskTitle', messageKey: 'tourAddTaskMessage' },
        { titleKey: 'tourMyTasksTitle', messageKey: 'tourMyTasksMessage' },
        { titleKey: 'tourAIFeaturesTitle', messageKey: 'tourAIFeaturesMessage' },
        { titleKey: 'tourGuidelinesTitle', messageKey: 'tourGuidelinesMessage' },
    ];
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [currentTourStepIndex, setCurrentTourStepIndex] = useState(0);

    const startTour = () => {
        setCurrentTourStepIndex(0);
        setIsTourOpen(true);
    };
    const finishTour = () => setIsTourOpen(false);
    const nextTourStep = () => setCurrentTourStepIndex(prev => Math.min(prev + 1, tourSteps.length - 1));
    const prevTourStep = () => setCurrentTourStepIndex(prev => Math.max(prev - 1, 0));

    // --- AI Features ---
    const generateProjectInsights = async (): Promise<AIInsightsResponse> => {
        if (!currentUser) throw new Error("User not authenticated");
        const userProjects = orgScoped<Project>(projects).filter(p => !p.isArchived);
        const userTasks = orgScoped<Task>(tasks).filter(task => userProjects.some(p => p.id === task.projectId));
        const relevantUsers = orgScoped<User>(users);

        const projectsJson = JSON.stringify(userProjects.map(p => ({id: p.id, name: p.name, ownerId: p.ownerId})));
        const tasksJson = JSON.stringify(userTasks.map(t => ({id: t.id, name: t.name, status: t.status, priority: t.priority, assigneeId: t.assigneeId, dueDate: t.dueDate})));
        const usersJson = JSON.stringify(relevantUsers.map(u => ({id: u.id, name: u.name})));

        const t = (key: LocaleKey, params?: Record<string, string | number>): string => {
            let translation = translations[language]?.[key] || key;
            if (params) Object.keys(params).forEach(paramKey => {
                const regex = new RegExp(`{{${paramKey}}}`, 'g');
                translation = translation.replace(regex, String(params[paramKey]));
            });
            return translation;
        };
        const prompt = t('geminiInsightsPrompt', { projectsJson, tasksJson, usersJson });
        
        try {
            // Call the Cloud Function
            const functionData = { prompt };
            const response = await fetch('/api/generateProjectInsights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(functionData)
            });
            
            if (!response.ok) {
                throw new Error(`Cloud function returned status: ${response.status}`);
            }
            
            return await response.json() as AIInsightsResponse;
        } catch (error) {
            console.error("Project insights generation failed:", error);
            throw error;
        }
    };
    
    const generateMeetingAgenda = async (prompt: string): Promise<MeetingAgenda> => {
        if (!currentUser) throw new Error("User not authenticated");
        
        try {
            // Call the Cloud Function
            const functionData = { prompt };
            const response = await fetch('/api/generateMeetingAgenda', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(functionData)
            });
            
            if (!response.ok) {
                throw new Error(`Cloud function returned status: ${response.status}`);
            }
            
            return await response.json() as MeetingAgenda;
        } catch (error) {
            console.error("Meeting agenda generation failed:", error);
            throw error;
        }
    };

    const generateProjectIdeas = async (prompt: string): Promise<ProjectIdea[]> => {
        if (!currentUser) throw new Error("User not authenticated");
        
        try {
            // Call the Cloud Function
            const functionData = { prompt };
            const response = await fetch('/api/generateProjectIdeas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(functionData)
            });
            
            if (!response.ok) {
                throw new Error(`Cloud function returned status: ${response.status}`);
            }
            
            return await response.json() as ProjectIdea[];
        } catch (error) {
            console.error("Project ideas generation failed:", error);
            throw error;
        }
    };
    

    const value: AppContextType = {
        // State
        projects: orgScoped<Project>(projects),
        tasks: orgScoped<Task>(tasks),
        todos: orgScoped<Todo>(todos),
        users: orgScoped<User>(users),
        organizations,
        savedIdeas: orgScoped<SavedProjectIdea>(savedIdeas),
        activityLogs: orgScoped<ActivityLog>(activityLogs),
        notifications: orgScoped<Notification>(notifications),
        currentUser,
        language,
        
        // Auth
        loginUser,
        logout,
        registerAndCreateOrg,
        registerWithInvite,
        verifyInvitationToken,
        setUserPasswordAndActivate,
        requestPasswordReset,
        verifyPasswordResetToken,
        resetUserPassword,

        // Data Getters
        getProjectById,
        getTasksByProjectId,
        getTasksByAssigneeId,
        getTodosByUserId,
        getCommentsByTaskId,
        getActiveProjects,
        getProjectsByOwnerId,
        getTasksCompletedByAssignee,
        getTasksInProgressByAssignee,
        getUserById,
        
        // Data Mutators
        addProject,
        updateProject,
        deleteProject,
        archiveProject,
        addTask,
        updateTask,
        deleteTask,
        addTodo,
        updateTodo,
        deleteTodo,
        addUser,
        updateUser,
        deleteUser,
        updateOrganization,
        addTaskComment,
        saveProjectIdea,
        removeSavedIdea,
        isIdeaSaved,
        
        // Notifications
        addNotification,
        markNotificationAsRead,
        clearNotifications,

        // Tour
        isTourOpen,
        tourSteps,
        currentTourStepIndex,
        startTour,
        finishTour,
        nextTourStep,
        prevTourStep,

        // Language
        setLanguage,
        
        // Permissions
        canCurrentUserManageUsers,
        isCurrentUserAdmin,
        canCurrentUserEditTask,
        canCurrentUserDeleteTask,

        // AI Features
        generateProjectInsights,
        generateMeetingAgenda,
        generateProjectIdeas
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};