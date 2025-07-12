export interface User {
  id: string;
  name: string;
  email: string;
  permissions: UserPermissions;
  organizationId: string;
  status: UserStatus;
  password?: string;
  photoURL?: string;
  invitationToken?: string;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: number;
}

export interface UserPermissions {
  [key: string]: boolean;
}

export enum Permission {
  MANAGE_ORGANIZATION = 'MANAGE_ORGANIZATION',
  MANAGE_USERS = 'MANAGE_USERS',
  CREATE_PROJECTS = 'CREATE_PROJECTS',
  EDIT_ALL_PROJECTS = 'EDIT_ALL_PROJECTS',
  DELETE_ALL_PROJECTS = 'DELETE_ALL_PROJECTS',
  ARCHIVE_ALL_PROJECTS = 'ARCHIVE_ALL_PROJECTS',
  CREATE_TASKS = 'CREATE_TASKS',
  EDIT_ALL_TASKS = 'EDIT_ALL_TASKS',
  DELETE_ALL_TASKS = 'DELETE_ALL_TASKS',
  ASSIGN_USERS_TO_TASKS = 'ASSIGN_USERS_TO_TASKS',
  VIEW_ACTIVITY_LOG = 'VIEW_ACTIVITY_LOG',
  ACCESS_DASHBOARD = 'ACCESS_DASHBOARD',
  GENERATE_PROJECT_TIMELINE = 'GENERATE_PROJECT_TIMELINE',
  GENERATE_PROJECT_INSIGHTS = 'GENERATE_PROJECT_INSIGHTS',
  GENERATE_MEETING_AGENDA = 'GENERATE_MEETING_AGENDA',
}

export const TEAM_MEMBER_PERMISSIONS: UserPermissions = {
  [Permission.CREATE_TASKS]: true,
};

export const PROJECT_MANAGER_PERMISSIONS: UserPermissions = {
  ...TEAM_MEMBER_PERMISSIONS,
  [Permission.CREATE_PROJECTS]: true,
  [Permission.EDIT_ALL_PROJECTS]: true,
  [Permission.ASSIGN_USERS_TO_TASKS]: true,
};

export const ADMIN_PERMISSIONS: UserPermissions = {
  [Permission.MANAGE_ORGANIZATION]: true,
  [Permission.MANAGE_USERS]: true,
  [Permission.CREATE_PROJECTS]: true,
  [Permission.EDIT_ALL_PROJECTS]: true,
  [Permission.DELETE_ALL_PROJECTS]: true,
  [Permission.ARCHIVE_ALL_PROJECTS]: true,
  [Permission.CREATE_TASKS]: true,
  [Permission.EDIT_ALL_TASKS]: true,
  [Permission.DELETE_ALL_TASKS]: true,
  [Permission.ASSIGN_USERS_TO_TASKS]: true,
  [Permission.VIEW_ACTIVITY_LOG]: true,
  [Permission.ACCESS_DASHBOARD]: true,
  [Permission.GENERATE_PROJECT_TIMELINE]: true,
  [Permission.GENERATE_PROJECT_INSIGHTS]: true,
  [Permission.GENERATE_MEETING_AGENDA]: true,
};

// Language enum
export enum Language {
  EN = 'en',
  AR = 'ar'
}

// Task related types
export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Review = 'Review',
  Done = 'Done',
  Blocked = 'Blocked',
  Overdue = 'Overdue'
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  projectId: string;
  dueDate?: string;
  dependsOnTaskId?: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

// Project related types
export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  ownerId: string;
  organizationId: string;
  budget?: number;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export type LocaleKey = string;

export interface SavedProjectIdea extends ProjectIdea {
  savedAt: number;
  savedBy: string;
  organizationId: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  estimatedDuration: string;
  requiredSkills: string[];
  potentialChallenges: string[];
  expectedOutcome: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  inviteCode: string;
  logoUrl: string;
}

export interface ProjectTimelineMilestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  tasks: string[]; // Task IDs
}

export interface ProjectInsightItem {
  type: 'risk' | 'opportunity' | 'suggestion';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
}

export interface AIInsightsResponse {
  insights: ProjectInsightItem[];
  summary: string;
  recommendations: string[];
}

export interface AIQuickTaskSuggestion {
  name: string;
  description: string;
  priority: TaskPriority;
  estimatedDuration: string;
}

// Meeting and agenda types
export interface MeetingAgenda {
  discussionPoints: Array<{
    taskName?: string;
    point?: string;
    assigneeName?: string;
    dueDate?: string;
    blockedByTaskName?: string;
    relatedTaskIds?: string[];
  }>;
  overdueTasksReview: Array<{
    taskName?: string;
    point?: string;
    assigneeName?: string;
    dueDate?: string;
    blockedByTaskName?: string;
    relatedTaskIds?: string[];
  }>;
  blockedTasksReview: Array<{
    taskName?: string;
    point?: string;
    assigneeName?: string;
    dueDate?: string;
    blockedByTaskName?: string;
    relatedTaskIds?: string[];
  }>;
  planningSuggestions: string[];
}

// Todo types
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

// Tour types
export interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

// Activity log types
export enum UserStatus {
  Active = 'Active',
  Invited = 'Invited',
  Deactivated = 'Deactivated'
}

export enum ActivityActionType {
  ProjectCreated = 'PROJECT_CREATED',
  ProjectUpdated = 'PROJECT_UPDATED',
  ProjectDeleted = 'PROJECT_DELETED',
  ProjectArchived = 'PROJECT_ARCHIVED',
  ProjectUnarchived = 'PROJECT_UNARCHIVED',
  TaskCreated = 'TASK_CREATED',
  TaskUpdated = 'TASK_UPDATED',
  TaskDeleted = 'TASK_DELETED',
  TaskStatusChanged = 'TASK_STATUS_CHANGED',
  UserInvited = 'USER_INVITED',
  UserJoined = 'USER_JOINED',
  UserLoggedIn = 'USER_LOGGED_IN',
  UserLoggedOut = 'USER_LOGGED_OUT',
  UserActivatedByInvite = 'USER_ACTIVATED_BY_INVITE',
  UserPasswordResetRequested = 'USER_PASSWORD_RESET_REQUESTED',
  UserPasswordResetCompleted = 'USER_PASSWORD_RESET_COMPLETED'
}

export interface ActivityLog {
  id: string;
  action: ActivityActionType;
  userId: string;
  userName: string;
  targetEntityId?: string;
  targetEntityName?: string;
  targetEntityType?: 'project' | 'task' | 'user';
  details?: string;
  timestamp: number;
  organizationId: string;
}

// Notification types
export interface Notification {
  id: string;
  messageKey: LocaleKey;
  messageParams: Record<string, string | number>;
  read: boolean;
  timestamp: number;
  link?: string;
  organizationId: string;
}

// Comment types
export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  organizationId: string;
}