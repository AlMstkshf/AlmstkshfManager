export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Review = 'Review',
  Done = 'Done',
  Blocked = 'Blocked',
  Overdue = 'Overdue', // New status
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum Language {
  EN = 'en',
  AR = 'ar',
}

export enum UserRole {
  Admin = "Admin",
  ProjectManager = "ProjectManager",
  TeamMember = "TeamMember",
}

// NEW: Granular permissions
export enum Permission {
  // Projects
  CREATE_PROJECTS = 'CREATE_PROJECTS',
  EDIT_ALL_PROJECTS = 'EDIT_ALL_PROJECTS',
  DELETE_ALL_PROJECTS = 'DELETE_ALL_PROJECTS',
  ARCHIVE_ALL_PROJECTS = 'ARCHIVE_ALL_PROJECTS',
  
  // Tasks
  CREATE_TASKS = 'CREATE_TASKS',
  EDIT_ALL_TASKS = 'EDIT_ALL_TASKS',
  DELETE_ALL_TASKS = 'DELETE_ALL_TASKS',
  ASSIGN_USERS_TO_TASKS = 'ASSIGN_USERS_TO_TASKS',
  
  // Users
  MANAGE_USERS = 'MANAGE_USERS', // Add, edit, delete, change permissions

  // Organization
  MANAGE_ORGANIZATION = 'MANAGE_ORGANIZATION', // Edit org name, etc.

  // AI Features
  GENERATE_PROJECT_TIMELINE = 'GENERATE_PROJECT_TIMELINE',
  GENERATE_PROJECT_INSIGHTS = 'GENERATE_PROJECT_INSIGHTS',
  GENERATE_MEETING_AGENDA = 'GENERATE_MEETING_AGENDA',

  // System
  VIEW_ACTIVITY_LOG = 'VIEW_ACTIVITY_LOG',
  ACCESS_DASHBOARD = 'ACCESS_DASHBOARD',
}

export type UserPermissions = Record<Permission, boolean>;


export enum UserStatus {
  Active = 'Active',
  Invited = 'Invited', // Invited by admin, password not set yet
  Deactivated = 'Deactivated', 
}

export const TEAM_MEMBER_PERMISSIONS: UserPermissions = {
  [Permission.CREATE_PROJECTS]: false,
  [Permission.EDIT_ALL_PROJECTS]: false,
  [Permission.DELETE_ALL_PROJECTS]: false,
  [Permission.ARCHIVE_ALL_PROJECTS]: false,
  [Permission.CREATE_TASKS]: true,
  [Permission.EDIT_ALL_TASKS]: false, 
  [Permission.DELETE_ALL_TASKS]: false,
  [Permission.ASSIGN_USERS_TO_TASKS]: false,
  [Permission.MANAGE_USERS]: false,
  [Permission.MANAGE_ORGANIZATION]: false,
  [Permission.GENERATE_PROJECT_TIMELINE]: false,
  [Permission.GENERATE_PROJECT_INSIGHTS]: false,
  [Permission.GENERATE_MEETING_AGENDA]: false,
  [Permission.VIEW_ACTIVITY_LOG]: false,
  [Permission.ACCESS_DASHBOARD]: true,
};

export const PROJECT_MANAGER_PERMISSIONS: UserPermissions = {
  ...TEAM_MEMBER_PERMISSIONS,
  [Permission.CREATE_PROJECTS]: true,
  [Permission.CREATE_TASKS]: true,
  [Permission.ASSIGN_USERS_TO_TASKS]: true,
  [Permission.GENERATE_PROJECT_TIMELINE]: true,
  [Permission.GENERATE_MEETING_AGENDA]: true,
  [Permission.ACCESS_DASHBOARD]: true,
  [Permission.VIEW_ACTIVITY_LOG]: true,
};

export const ADMIN_PERMISSIONS: UserPermissions = {
  [Permission.CREATE_PROJECTS]: true,
  [Permission.EDIT_ALL_PROJECTS]: true,
  [Permission.DELETE_ALL_PROJECTS]: true,
  [Permission.ARCHIVE_ALL_PROJECTS]: true,
  [Permission.CREATE_TASKS]: true,
  [Permission.EDIT_ALL_TASKS]: true,
  [Permission.DELETE_ALL_TASKS]: true,
  [Permission.ASSIGN_USERS_TO_TASKS]: true,
  [Permission.MANAGE_USERS]: true,
  [Permission.MANAGE_ORGANIZATION]: true,
  [Permission.GENERATE_PROJECT_TIMELINE]: true,
  [Permission.GENERATE_PROJECT_INSIGHTS]: true,
  [Permission.GENERATE_MEETING_AGENDA]: true,
  [Permission.VIEW_ACTIVITY_LOG]: true,
  [Permission.ACCESS_DASHBOARD]: true,
};

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; 
  photoURL?: string;
  permissions: UserPermissions;
  organizationId: string;
  status: UserStatus; 
  invitationToken?: string; 
  passwordResetToken?: string; 
  passwordResetTokenExpiry?: number; 
}

export interface Organization {
  id: string;
  name: string;
  inviteCode: string; 
  logoUrl?: string; // Added for dynamic email branding
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  ownerId: string; 
  budget?: number;
  color: string; 
  isArchived?: boolean; 
  organizationId: string; 
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  assigneeId?: string; 
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dependsOnTaskId?: string; 
  startDate?: string;
  organizationId: string; 
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  userId: string; 
  organizationId: string; 
}

import type { LocaleKey } from './locales';

export interface Notification {
  id: string;
  messageKey: LocaleKey;
  messageParams?: Record<string, string | number | undefined>; // Allow undefined for optional params
  legacyMessage?: string;
  read: boolean;
  timestamp: number;
  link?: string;
  isWelcomeEmail?: boolean; 
  organizationId: string; 
}

export interface ProjectTimelineMilestone {
  milestone: string;
  description: string;
  estimatedCompletion: string;
  deliverables: string[];
}

export enum TaskCommentSentiment {
  Positive = 'Positive',
  Negative = 'Negative',
  Neutral = 'Neutral',
  Unknown = 'Unknown',
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  timestamp: number;
  sentiment?: TaskCommentSentiment;
  isUrgent?: boolean;
  organizationId: string; 
}

export interface AISentimentResponse {
  sentiment: TaskCommentSentiment;
  isUrgent: boolean;
}

export interface MeetingAgendaDiscussionPoint {
  point?: string;
  taskName?: string;
  assigneeName?: string;
  dueDate?: string;
  blockedByTaskName?: string;
  relatedTaskIds?: string[];
}

export interface MeetingAgenda {
  agendaTitle: string;
  discussionPoints: MeetingAgendaDiscussionPoint[];
  overdueTasksReview: MeetingAgendaDiscussionPoint[];
  blockedTasksReview: MeetingAgendaDiscussionPoint[];
  planningSuggestions: string[];
}

export type ProjectInsightType = 'bottleneck' | 'performance_high' | 'performance_low' | 'trend' | 'resource_concern' | 'positive_highlight';

export interface ProjectInsightItem {
  type: ProjectInsightType;
  description: string;
  relatedProjectIds?: string[];
  relatedTaskIds?: string[];
  relatedUserIds?: string[];
}

export interface AIInsightsResponse {
  insights: ProjectInsightItem[];
}

export interface AIQuickTaskSuggestion {
  name: string;
  description?: string | null;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDateSuggestion?: string | null;
}

export interface TourStep {
  titleKey: LocaleKey;
  messageKey: LocaleKey;
  targetHighlight?: string;
}

export interface ProjectIdea {
  id: string;
  name: string;
  description: string;
  features: string[];
  organizationId: string; 
}

export type SavedProjectIdea = ProjectIdea;


export enum ActivityActionType {
  ProjectCreated = 'ProjectCreated',
  ProjectUpdated = 'ProjectUpdated',
  ProjectDeleted = 'ProjectDeleted',
  ProjectArchived = 'ProjectArchived',
  ProjectUnarchived = 'ProjectUnarchived',
  TaskCreated = 'TaskCreated',
  TaskUpdated = 'TaskUpdated',
  TaskStatusChanged = 'TaskStatusChanged',
  TaskDeleted = 'TaskDeleted',
  UserInvited = 'UserInvited',
  UserUpdated = 'UserUpdated',
  UserPermissionsChanged = 'UserPermissionsChanged',
  UserDeleted = 'UserDeleted',
  UserActivatedByInvite = 'UserActivatedByInvite', 
  UserActivatedByAdmin = 'UserActivatedByAdmin', 
  UserDeactivated = 'UserDeactivated',
  UserPasswordResetRequested = 'UserPasswordResetRequested', 
  UserPasswordResetRequestedByAdmin = 'UserPasswordResetRequestedByAdmin', 
  UserPasswordResetCompleted = 'UserPasswordResetCompleted',
  UserLoggedIn = 'UserLoggedIn',
  UserLoggedOut = 'UserLoggedOut',
  CommentAdded = 'CommentAdded',
  OrganizationUpdated = 'OrganizationUpdated',
}

export interface ActivityLog {
  id: string;
  timestamp: number;
  userId: string; 
  userName?: string; 
  organizationId: string;
  actionType: ActivityActionType;
  details: string; 
  targetEntityType?: 'project' | 'task' | 'user' | 'auth' | 'comment' | 'organization';
  targetEntityId?: string;
  targetEntityName?: string; 
}