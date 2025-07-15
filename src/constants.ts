import { UserPermissions } from './types';

export const DEFAULT_LANGUAGE = 'en';

export const PROJECT_COLORS = [
  { value: '#F44336', name: 'Red', twClass: 'bg-red-500' },
  { value: '#E91E63', name: 'Pink', twClass: 'bg-pink-500' },
  { value: '#9C27B0', name: 'Purple', twClass: 'bg-purple-500' },
  { value: '#673AB7', name: 'Deep Purple', twClass: 'bg-deep-purple-500' },
  { value: '#3F51B5', name: 'Indigo', twClass: 'bg-indigo-500' },
  { value: '#2196F3', name: 'Blue', twClass: 'bg-blue-500' },
  { value: '#03A9F4', name: 'Light Blue', twClass: 'bg-light-blue-500' },
  { value: '#00BCD4', name: 'Cyan', twClass: 'bg-cyan-500' },
  { value: '#009688', name: 'Teal', twClass: 'bg-teal-500' },
  { value: '#4CAF50', name: 'Green', twClass: 'bg-green-500' },
  { value: '#8BC34A', name: 'Light Green', twClass: 'bg-light-green-500' },
  { value: '#CDDC39', name: 'Lime', twClass: 'bg-lime-500' },
  { value: '#FFEB3B', name: 'Yellow', twClass: 'bg-yellow-500' },
  { value: '#FFC107', name: 'Amber', twClass: 'bg-amber-500' },
  { value: '#FF9800', name: 'Orange', twClass: 'bg-orange-500' },
  { value: '#FF5722', name: 'Deep Orange', twClass: 'bg-deep-orange-500' },
  { value: '#795548', name: 'Brown', twClass: 'bg-brown-500' },
  { value: '#9E9E9E', name: 'Grey', twClass: 'bg-grey-500' },
  { value: '#607D8B', name: 'Blue Grey', twClass: 'bg-blue-grey-500' },
];

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
