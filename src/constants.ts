import { UserPermissions, Permission } from './types';

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
