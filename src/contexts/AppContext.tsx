import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { 
  Project, Task, Todo, Notification, User, Organization, TaskStatus,
  Language, UserStatus, TaskComment, TaskCommentSentiment, AISentimentResponse,
  AIInsightsResponse, TourStep, SavedProjectIdea,
  ActivityLog, ActivityActionType, Permission, TEAM_MEMBER_PERMISSIONS, ADMIN_PERMISSIONS,
  PROJECT_MANAGER_PERMISSIONS, MeetingAgenda
} from '@/types';
import { 
    auth, db, signUpUser as signUpUserFunction, completeInvitedUserSetup as completeInvitedUserSetupFunction, 
    deleteUserByAdmin, analyzeTaskComment as analyzeTaskCommentFunction,
    generateProjectIdeas as generateProjectIdeasFunction,
    generateProjectInsights as generateProjectInsightsFunction,
    generateMeetingAgenda as generateMeetingAgendaFunction
} from '@/firebase';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { 
    collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, where, writeBatch, getDocs, serverTimestamp, getDoc 
} from 'firebase/firestore';
import { DEFAULT_LANGUAGE } from '@/constants';
import { translations } from '@/locales';
import type { LocaleKey, ProjectIdea } from '@/types';
import type { User as FirebaseUser } from 'firebase/auth';

// Helper to map backend role to frontend permissions
const getPermissionsFromRole = (role: string) => {
    switch (role) {
        case 'Admin': return ADMIN_PERMISSIONS;
        case 'ProjectManager': return PROJECT_MANAGER_PERMISSIONS;
        case 'TeamMember': return TEAM_MEMBER_PERMISSIONS;
        default: return TEAM_MEMBER_PERMISSIONS;
    }
}

// --- Context Type Definition ---
interface AppContextType {
  projects: Project[];
  tasks: Task[];
  todos: Todo[];
  users: User[];
  organizations: Organization[];
  savedIdeas: SavedProjectIdea[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  currentUser: User | null;
  loading: boolean;
  language: Language;
  
  loginUser: (email: string, pass: string) => Promise<{ success: boolean; error?: LocaleKey }>;
  logout: () => void;
  registerAndCreateOrg: (userData: Omit<User, 'id' | 'organizationId' | 'status' | 'permissions'>, orgName: string, pass: string) => Promise<{ success: boolean; error?: LocaleKey }>;
  registerWithInvite: (userData: Omit<User, 'id' | 'organizationId' | 'status' | 'permissions'>, inviteCode: string, pass: string) => Promise<{ success: boolean; error?: LocaleKey }>;
  completeUserSetup: (token: string, pass: string, fullName: string) => Promise<{ success: boolean; error?: LocaleKey }>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  
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
  
  addProject: (projectData: Omit<Project, 'id' | 'ownerId' | 'organizationId'>, fromIdea?: boolean) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  archiveProject: (projectId: string, archive: boolean) => Promise<void>;

  addTask: (taskData: Omit<Task, 'id' | 'organizationId'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;

  addTodo: (todoData: Omit<Todo, 'id' | 'userId' | 'organizationId'>) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
  deleteTodo: (todoId: string) => Promise<void>;
  
  updateUser: (user: User) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<void>;
  updateOrganization: (orgId: string, orgData: Partial<Organization>) => Promise<void>;
  
  addTaskComment: (taskId: string, projectId: string, text: string) => Promise<void>;

  saveProjectIdea: (idea: Omit<ProjectIdea, 'organizationId' | 'id'> & {id?:string}) => Promise<void>;
  removeSavedIdea: (ideaId: string) => Promise<void>;
  isIdeaSaved: (ideaId: string) => boolean;

  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'organizationId' | 'userId'>) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  clearNotifications: () => Promise<void>;

  isTourOpen: boolean;
  tourSteps: TourStep[];
  currentTourStepIndex: number;
  startTour: () => void;
  finishTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;

  setLanguage: (language: Language) => void;
  logActivity: (actionType: ActivityActionType, data: { details?: string, targetEntityType?: 'project' | 'task' | 'user' | 'auth' | 'comment' | 'organization', targetEntityId?: string, targetEntityName?: string }) => void;

  canCurrentUserManageUsers: () => boolean;
  isCurrentUserAdmin: () => boolean;
  canCurrentUserEditTask: (task: Task, project?: Project | null) => boolean;
  canCurrentUserDeleteTask: (task: Task, project?: Project | null) => boolean;
  generateProjectInsights: () => Promise<AIInsightsResponse>;
  generateMeetingAgenda: (prompt: string) => Promise<MeetingAgenda>;
  generateProjectIdeas: (prompt: string) => Promise<ProjectIdea[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE as Language);

    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [savedIdeas, setSavedIdeas] = useState<SavedProjectIdea[]>([]);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [taskComments, setTaskComments] = useState<TaskComment[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const unsubProfile = onSnapshot(userDocRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        const tokenResult = await user.getIdTokenResult(true);
                        const claims = tokenResult.claims;
                        const profileData = docSnap.data();

                        const userRole = claims.role || profileData.role || 'TeamMember';
                        
                        setCurrentUser({
                            ...profileData,
                            id: user.uid,
                            photoURL: user.photoURL || profileData.photoURL,
                            permissions: getPermissionsFromRole(userRole),
                            organizationId: claims.organizationId || profileData.organizationId,
                        } as User);
                    } else {
                        await signOut(auth);
                        setCurrentUser(null);
                    }
                });
                return () => unsubProfile();
            } else {
                setCurrentUser(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!currentUser?.organizationId) {
            setProjects([]);
            setTasks([]);
            setTodos([]);
            setUsers([]);
            setOrganizations([]);
            setSavedIdeas([]);
            setActivityLogs([]);
            setNotifications([]);
            setTaskComments([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const orgId = currentUser.organizationId;

        const unsubs: (()=>void)[] = [];

        const orgDocRef = doc(db, 'organizations', orgId);
        const unsubOrg = onSnapshot(orgDocRef, (doc) => {
            if(doc.exists()){
                setOrganizations([{ id: doc.id, ...doc.data() } as Organization]);
            }
        });
        unsubs.push(unsubOrg);

        const collectionsToSubscribe = [
            'projects', 'tasks', 'users', 'savedIdeas', 'activityLogs', 'notifications', 'taskComments'
        ];
        
        collectionsToSubscribe.forEach(collectionName => {
            const q = query(collection(db, collectionName), where('organizationId', '==', orgId));
            const unsub = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if(collectionName === 'projects') setProjects(data as Project[]);
                if(collectionName === 'tasks') setTasks(data as Task[]);
                if(collectionName === 'users') setUsers(data as User[]);
                if(collectionName === 'savedIdeas') setSavedIdeas(data as SavedProjectIdea[]);
                if(collectionName === 'activityLogs') setActivityLogs((data as ActivityLog[]).sort((a,b) => (b.timestamp as any)?.seconds - (a.timestamp as any)?.seconds));
                if(collectionName === 'notifications') setNotifications((data as Notification[]).sort((a,b) => (b.timestamp as any)?.seconds - (a.timestamp as any)?.seconds));
                if(collectionName === 'taskComments') setTaskComments(data as TaskComment[]);
            });
            unsubs.push(unsub);
        });

        const todosQuery = query(collection(db, 'todos'), where('userId', '==', currentUser.id));
        const unsubTodos = onSnapshot(todosQuery, (snapshot) => {
             const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
             setTodos(data as Todo[]);
        });
        unsubs.push(unsubTodos);

        setLoading(false);
        return () => unsubs.forEach(unsub => unsub());
    }, [currentUser?.id, currentUser?.organizationId]);

    const loginUser = async (email: string, pass: string): Promise<{ success: boolean; error?: LocaleKey }> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const userDocRef = doc(db, 'users', userCredential.user.uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const userData = docSnap.data() as User;
                if (userData.status === UserStatus.Deactivated) {
                    await signOut(auth);
                    return { success: false, error: 'loginUserDeactivatedPrompt' };
                }
                if (userData.status === UserStatus.Invited) {
                    await signOut(auth);
                    return { success: false, error: 'loginUserInvitedPrompt'};
                }
            } else {
                await signOut(auth);
                return { success: false, error: 'loginFailedError' };
            }
            return { success: true };
        } catch (error: any) {
            return { success: false, error: 'loginFailedError' };
        }
    };

    const logout = async () => {
        await signOut(auth);
    };
    
    const registerAndCreateOrg = async (userData: Omit<User, 'id' | 'organizationId' | 'status' | 'permissions'>, orgName: string, pass: string): Promise<{ success: boolean; error?: LocaleKey }> => {
        try {
            await signUpUserFunction({
                email: userData.email,
                password: pass,
                fullName: userData.name,
                mode: 'create',
                organizationName: orgName,
            });
            return { success: true };
        } catch (error: any) {
            const msg = (error as any).details?.message || (error as Error).message;
            if (msg?.includes("already-exists")) return { success: false, error: 'emailAlreadyExistsError' };
            return { success: false, error: 'registrationFailedError' };
        }
    };
    
    const registerWithInvite = async (userData: Omit<User, 'id' | 'organizationId' | 'status' | 'permissions'>, inviteCode: string, pass: string): Promise<{ success: boolean; error?: LocaleKey }> => {
         try {
            await signUpUserFunction({
                email: userData.email,
                password: pass,
                fullName: userData.name,
                mode: 'join',
                inviteCode,
            });
            return { success: true };
        } catch (error: any)
        {
            const msg = (error as any).details?.message || (error as Error).message;
            if (msg?.includes("not-found")) return { success: false, error: 'inviteCodeInvalidError' };
            if (msg?.includes("already-exists")) return { success: false, error: 'emailAlreadyExistsError' };
            return { success: false, error: 'registrationFailedError' };
        }
    };

    const completeUserSetup = async (token: string, pass: string, fullName: string): Promise<{ success: boolean; error?: LocaleKey }> => {
        try {
            await completeInvitedUserSetupFunction({
                invitationToken: token,
                password: pass,
                fullName: fullName,
            });
            return { success: true };
        } catch (error: any) {
            const msg = (error as any).details?.message || (error as Error).message;
            if(msg?.includes("not-found")) return { success: false, error: 'invalidInvitationLinkError' };
            if(msg?.includes("already-exists")) return { success: false, error: 'emailAlreadyExistsError' };
            return { success: false, error: 'setPasswordFailedError' };
        }
    };

    const requestPasswordReset = async (email: string): Promise<boolean> => {
        try {
            await sendPasswordResetEmail(auth, email);
            return true;
        } catch (error) {
            console.error("Password reset error:", error);
            return false;
        }
    };

    const logActivity = useCallback((actionType: ActivityActionType, data: { details?: string, targetEntityType?: 'project' | 'task' | 'user' | 'auth' | 'comment' | 'organization', targetEntityId?: string, targetEntityName?: string }) => {
        if (!currentUser) return;
        addActivityLog(actionType, { ...data, userId: currentUser.id, userName: currentUser.name });
    }, [currentUser]);

    const addActivityLog = async (actionType: ActivityActionType, data: { userId: string, userName?: string, details?: string, targetEntityType?: 'project' | 'task' | 'user' | 'auth' | 'comment' | 'organization', targetEntityId?: string, targetEntityName?: string }) => {
        if (!currentUser) return;
        const newLog = {
            ...data,
            timestamp: serverTimestamp(),
            organizationId: currentUser.organizationId,
            action: actionType,
        };
        await addDoc(collection(db, 'activityLogs'), newLog);
    };

    const getProjectById = useCallback((projectId: string) => projects.find(p => p.id === projectId), [projects]);
    const getTasksByProjectId = useCallback((projectId: string) => tasks.filter(t => t.projectId === projectId), [tasks]);
    const getActiveProjects = useCallback(() => projects.filter(p => !p.isArchived), [projects]);
    const getUserById = useCallback((userId: string) => users.find(u => u.id === userId), [users]);
    const getTasksByAssigneeId = useCallback((userId: string) => tasks.filter(t => t.assigneeId === userId), [tasks]);
    const getTodosByUserId = useCallback((userId: string) => todos.filter(t => t.userId === userId), [todos]);
    const getCommentsByTaskId = useCallback((taskId: string) => taskComments.filter(c => c.taskId === taskId).sort((a,b) => (a.timestamp as any)?.seconds - (b.timestamp as any)?.seconds), [taskComments]);
    const getProjectsByOwnerId = useCallback((userId: string) => projects.filter(p => p.ownerId === userId), [projects]);
    const getTasksCompletedByAssignee = useCallback((userId: string) => getTasksByAssigneeId(userId).filter(t => t.status === TaskStatus.Done), [getTasksByAssigneeId]);
    const getTasksInProgressByAssignee = useCallback((userId: string) => getTasksByAssigneeId(userId).filter(t => t.status === TaskStatus.InProgress), [getTasksByAssigneeId]);

    const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'organizationId' | 'userId'>) => {
        if (!currentUser) return;
        const newNotification = {
            ...notification,
            read: false,
            timestamp: serverTimestamp(),
            organizationId: currentUser.organizationId,
            userId: currentUser.id,
        };
        await addDoc(collection(db, 'notifications'), newNotification);
    };
    const markNotificationAsRead = async (notificationId: string) => await updateDoc(doc(db, 'notifications', notificationId), { read: true });
    const clearNotifications = async () => {
        if (!currentUser) return;
        const q = query(collection(db, 'notifications'), where('userId', '==', currentUser.id));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
    };

    const addProject = async (projectData: Omit<Project, 'id' | 'ownerId' | 'organizationId'>) => {
        if (!currentUser) return;
        await addDoc(collection(db, 'projects'), { ...projectData, ownerId: currentUser.id, organizationId: currentUser.organizationId });
    };
    const updateProject = async (project: Project) => await updateDoc(doc(db, 'projects', project.id), { ...project });
    const deleteProject = async (projectId: string) => {
        const batch = writeBatch(db);
        batch.delete(doc(db, 'projects', projectId));
        const tasksSnapshot = await getDocs(query(collection(db, 'tasks'), where('projectId', '==', projectId)));
        tasksSnapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
    };
    const archiveProject = async (projectId: string, archive: boolean) => await updateDoc(doc(db, 'projects', projectId), { isArchived: archive });

    const addTask = async (taskData: Omit<Task, 'id' | 'organizationId'>) => {
        if (!currentUser) return;
        await addDoc(collection(db, 'tasks'), { ...taskData, organizationId: currentUser.organizationId });
    };
    const updateTask = async (task: Task) => await updateDoc(doc(db, 'tasks', task.id), { ...task });
    const deleteTask = async (taskId: string) => await deleteDoc(doc(db, 'tasks', taskId));

    const addTodo = async (todoData: Omit<Todo, 'id' | 'userId' | 'organizationId'>) => {
        if (!currentUser) return;
        await addDoc(collection(db, 'todos'), { ...todoData, userId: currentUser.id, organizationId: currentUser.organizationId });
    };
    const updateTodo = async (todo: Todo) => await updateDoc(doc(db, 'todos', todo.id), { ...todo });
    const deleteTodo = async (todoId: string) => await deleteDoc(doc(db, 'todos', todoId));

    const updateUser = async (user: User) => {
        if (!currentUser || !isCurrentUserAdmin()) return false;
        try {
            await updateDoc(doc(db, 'users', user.id), { name: user.name, permissions: user.permissions });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };
    const deleteUser = async (userId: string) => {
        if (!currentUser || !isCurrentUserAdmin() || userId === currentUser.id) return;
        try {
            await deleteUserByAdmin({ userIdToDelete: userId });
        } catch(e) {
            console.error("Error deleting user:", e);
        }
    };
    const updateOrganization = async (orgId: string, orgData: Partial<Organization>) => {
        if(!currentUser || !isCurrentUserAdmin()) return;
        await updateDoc(doc(db, 'organizations', orgId), orgData);
    };

    const addTaskComment = async (taskId: string, projectId: string, text: string) => {
        if (!currentUser) return;
        const newComment = {
            taskId,
            projectId,
            userId: currentUser.id,
            text,
            timestamp: serverTimestamp(),
            sentiment: TaskCommentSentiment.Unknown,
            isUrgent: false,
            organizationId: currentUser.organizationId,
        };
        const commentRef = await addDoc(collection(db, 'taskComments'), newComment);

        try {
            const t = (key: LocaleKey, params?: Record<string, string | number>): string => {
                let translation = translations[language]?.[key] || key;
                if (params) Object.keys(params).forEach(paramKey => {
                    const regex = new RegExp(`{{${paramKey}}}`, 'g');
                    translation = translation.replace(regex, String(params[paramKey]));
                });
                return translation;
            };

            const prompt = t('geminiSentimentPrompt', { commentText: text });
            const result = await analyzeTaskCommentFunction({ prompt });
            const sentimentData = result.data as AISentimentResponse;
            
            await updateDoc(commentRef, { sentiment: sentimentData.sentiment, isUrgent: sentimentData.isUrgent });
            
        } catch (e) {
            console.error("Sentiment analysis failed:", e);
             await updateDoc(commentRef, { sentiment: TaskCommentSentiment.Neutral });
        }
    };

    const saveProjectIdea = async (idea: Omit<ProjectIdea, 'organizationId' | 'id'> & {id?:string}) => {
        if(!currentUser) return;
        const newIdea = {
            ...idea,
            savedAt: serverTimestamp(),
            savedBy: currentUser.id,
            organizationId: currentUser.organizationId,
        }
        await addDoc(collection(db, 'savedIdeas'), newIdea);
    };
    const removeSavedIdea = async (ideaId: string) => await deleteDoc(doc(db, 'savedIdeas', ideaId));
    const isIdeaSaved = (ideaId: string) => savedIdeas.some(i => i.id === ideaId);

    const canCurrentUserManageUsers = () => currentUser?.permissions[Permission.MANAGE_USERS] ?? false;
    const isCurrentUserAdmin = () => currentUser?.permissions[Permission.MANAGE_ORGANIZATION] ?? false;
    const canCurrentUserEditTask = (task: Task, project?: Project | null) => {
        if (!currentUser) return false;
        if (currentUser.permissions[Permission.EDIT_ALL_TASKS]) return true;
        const proj = project || getProjectById(task.projectId);
        if (proj && proj.ownerId === currentUser.id) return true;
        if(task.assigneeId === currentUser.id) return true;
        return false;
    };
    const canCurrentUserDeleteTask = (task: Task, project?: Project | null) => {
        if (!currentUser) return false;
        if (currentUser.permissions[Permission.DELETE_ALL_TASKS]) return true;
        const proj = project || getProjectById(task.projectId);
        if (proj && proj.ownerId === currentUser.id) return true;
        return false;
    };
    
    const tourSteps: TourStep[] = [
        { titleKey: 'tourWelcomeTitle', messageKey: 'tourWelcomeMessage' },
        { titleKey: 'tourDashboardTitle', messageKey: 'tourDashboardMessage', targetHighlight: '#dashboard-page' },
        { titleKey: 'tourCreateProjectTitle', messageKey: 'tourCreateProjectMessage', targetHighlight: '#create-project-btn' },
    ];
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [currentTourStepIndex, setCurrentTourStepIndex] = useState(0);
    const startTour = () => { setCurrentTourStepIndex(0); setIsTourOpen(true); };
    const finishTour = () => setIsTourOpen(false);
    const nextTourStep = () => setCurrentTourStepIndex(prev => Math.min(prev + 1, tourSteps.length - 1));
    const prevTourStep = () => setCurrentTourStepIndex(prev => Math.max(prev - 1, 0));

    const generateProjectIdeas = async (prompt: string): Promise<ProjectIdea[]> => {
        if (!currentUser) throw new Error("User not authenticated");
        try {
            const result = await generateProjectIdeasFunction({ prompt });
            return result.data as ProjectIdea[];
        } catch (error) {
            console.error("Error generating project ideas:", error);
            throw error;
        }
    };
    
    const generateMeetingAgenda = async (prompt: string): Promise<MeetingAgenda> => {
        if (!currentUser) throw new Error("User not authenticated");
        try {
            const result = await generateMeetingAgendaFunction({ prompt });
            return result.data as MeetingAgenda;
        } catch (error) {
            console.error("Error generating meeting agenda:", error);
            throw error;
        }
    };

    const generateProjectInsights = async (): Promise<AIInsightsResponse> => {
        if (!currentUser) throw new Error("User not authenticated");
        
        const projectsJson = JSON.stringify(projects.filter(p => !p.isArchived).map(p => ({id: p.id, name: p.name, ownerId: p.ownerId})));
        const tasksJson = JSON.stringify(tasks.map(t => ({id: t.id, name: t.name, status: t.status, priority: t.priority, assigneeId: t.assigneeId, dueDate: t.dueDate})));
        const usersJson = JSON.stringify(users.map(u => ({id: u.id, name: u.name})));

        const t = (key: LocaleKey, params?: Record<string, string | number>): string => {
            let translation = translations[language]?.[key] || key;
            if (params) Object.keys(params).forEach(paramKey => {
                const regex = new RegExp(`{{${paramKey}}}`, 'g');
                translation = translation.replace(regex, String(params[paramKey]));
            });
            return translation;
        };
        const prompt = t('geminiInsightsPrompt', { projectsJson, tasksJson, usersJson });
        
        const result = await generateProjectInsightsFunction({ prompt });
        return result.data as AIInsightsResponse;
    };
    
    return (
        <AppContext.Provider value={{
            projects, tasks, todos, users, organizations, savedIdeas, activityLogs, notifications, currentUser, loading, language,
            loginUser, logout, registerAndCreateOrg, registerWithInvite, completeUserSetup, requestPasswordReset,
            getProjectById, getTasksByProjectId, getTasksByAssigneeId, getTodosByUserId, getCommentsByTaskId, getActiveProjects, getProjectsByOwnerId, getTasksCompletedByAssignee, getTasksInProgressByAssignee, getUserById,
            addProject, updateProject, deleteProject, archiveProject, addTask, updateTask, deleteTask, addTodo, updateTodo, deleteTodo, updateUser, deleteUser, updateOrganization, addTaskComment, saveProjectIdea, removeSavedIdea, isIdeaSaved,
            addNotification, markNotificationAsRead, clearNotifications,
            isTourOpen, tourSteps, currentTourStepIndex, startTour, finishTour, nextTourStep, prevTourStep,
            setLanguage: (lang: Language) => setLanguage(lang), logActivity, canCurrentUserManageUsers, isCurrentUserAdmin, canCurrentUserEditTask, canCurrentUserDeleteTask, generateProjectInsights, generateMeetingAgenda, generateProjectIdeas
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
