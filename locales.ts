import { Language, Permission } from './types';

type PermissionTranslationKeys = {
  [K in Permission as `permission_${K}`]: string;
};

export type TranslationKeys = {
  appName: string;
  dashboard: string;
  myTasksAndTodos: string;
  createProject: string;
  editProject: string;
  projectName: string;
  projectDescription: string;
  startDate: string;
  endDateOptional: string;
  budgetOptional: string;
  projectColor: string;
  cancel: string;
  updateProjectBtn: string;
  createProjectBtn: string;
  myProjects: string;
  guest: string;
  notifications: string;
  clearAll: string;
  noNewNotifications: string;
  languageToggleToArabic: string;
  languageToggleToEnglish: string;
  loadingOrNotFound: string;
  deleteProjectBtn: string;
  deleteTaskConfirmation: string;
  deleteProjectConfirmation: string;
  projectDetails: string;
  tasks: string;
  addTask: string;
  editTask: string;
  taskName: string;
  taskDescriptionOptional: string;
  assigneeOptional: string;
  unassigned: string;
  dueDateOptional: string;
  priority: string;
  status: string;
  updateTaskBtn: string;
  createTaskBtn: string;
  myAssignedTasks: string;
  noTasksAssigned: string;
  myPersonalTodos: string;
  newTodo: string;
  addTodo: string;
  todoPlaceholder: string;
  noPersonalTodosMessage: string;
  totalProjects: string;
  totalTasks: string;
  tasksInProgress: string;
  tasksCompleted: string;
  totalOverdueTasks: string; 
  resourceAllocation: string; 
  activeTasksForUser: string; 
  highPriorityShort: string; 
  delete: string;
  due: string;
  progress: string;
  noTasksYet: string;
  noProjectsYet: string;
  createOneToGetStarted: string; 
  noDescription: string;
  startLabel: string;
  endLabel: string;
  budgetLabel: string;
  assigneeLabel: string;
  dueDateLabel: string;
  priorityLabel: string;
  statusLabel: string;
  taskStatusToDo: string;
  taskStatusInProgress: string;
  taskStatusReview: string;
  taskStatusDone: string;
  taskStatusBlocked: string;
  taskStatusOverdue: string; 
  taskPriorityLow: string;
  taskPriorityMedium: string;
  taskPriorityHigh: string;
  noTasksInProject: string;
  editTaskBtn: string;
  deleteTaskBtn: string;
  closeModalAriaLabel: string;
  unknownUser: string;
  notAvailableShort: string; 

  error: string; 
  genericRequiredError: string; 
  allRightsReserved: string; 

  // Project Archiving
  archiveProjectBtn: string;
  unarchiveProjectBtn: string;
  archiveProjectConfirmation: string;
  unarchiveProjectConfirmation: string;
  showArchivedProjects: string;
  showActiveProjects: string;
  projectArchivedBadge: string;
  archivedProjects: string;
  noArchivedProjects: string;
  projectIsArchivedNoTasks: string;
  notificationProjectArchived: string;
  notificationProjectUnarchived: string;

  // Notification message keys
  notificationProjectCreated: string;
  notificationProjectUpdated: string;
  notificationProjectDeleted: string;
  notificationTaskCreated: string;
  notificationTaskCreatedWithAssignee: string;
  notificationTaskUpdated: string;
  notificationTaskDeleted: string;
  notificationUserAdded: string; 
  notificationUserUpdated: string; 
  notificationUserDeleted: string; 
  notificationTaskOverdue: string; 
  notificationTaskOverdueForUser: string; 
  notificationTaskOverdueUnassigned: string; 
  notificationTaskStatusChanged: string; 
  notificationUrgentComment: string; 
  notificationTaskDeadlineChanged: string; 
  notificationSetPasswordInvite: string; 
  notificationPasswordResetLink: string; 
  notificationIdeaSaved: string;
  notificationIdeaRemoved: string;
  notificationIdeaCopied: string;
  notificationRedirectingToEditTask: string; 
  notificationRedirectingToViewComments: string; 
  notificationUserRegistered: string; 
  notificationOrgCreated: string; 
  organizationNameUpdated: string;


  // Project Idea Generator
  projectIdeas: string;
  projectIdeaGeneratorTitle: string;
  projectIdeaGeneratorInputLabel: string;
  projectIdeaGeneratorButton: string;
  projectIdeaGeneratorLoading: string;
  projectIdeaGeneratorNoIdeas: string;
  projectIdeaGeneratorError: string;
  projectIdeaGeneratorPrompt: string;
  ideaName: string;
  ideaDescription: string;
  ideaFeatures: string;
  ideaSaveButton: string;
  ideaCopyButton: string;
  ideaCopiedToClipboard: string;
  ideaCreateProjectButton: string;
  ideaAddTaskButton: string;
  savedIdeasSectionTitle: string;
  noSavedIdeasMessage: string;
  removeSavedIdeaButton: string;
  confirmRemoveSavedIdea: string;
  selectProjectForTaskModalTitle: string;
  selectProjectLabel: string;
  addIdeaAsTaskButton: string;
  noActiveProjectsToAddTaskTo: string;


  // User Management
  userManagement: string;
  userManagementTitle: string;
  addNewUser: string;
  addUserModalTitle: string;
  editUserModalTitle: string; 
  userNameLabel: string;
  userEmailLabel: string;
  userEmailPlaceholder: string;
  addUserBtn: string;
  updateUserBtn: string; 
  deleteUserBtn: string; 
  usersTableNoUsers: string;
  usersTableNameHeader: string;
  usersTableEmailHeader: string;
  usersTableActionsHeader: string; 
  usersTableRoleHeader: string; 
  usersTableStatusHeader: string; 
  usersTablePermissionsHeader: string;
  toGetStarted: string; 
  errorUserExists: string; 
  deleteUserConfirmationTitle: string; 
  deleteUserConfirmationMessage: string; 
  userRoleAdmin: string; 
  userRoleProjectManager: string; 
  userRoleTeamMember: string; 
  userRoleLabel: string; 
  accessDeniedTitle: string; 
  accessDeniedMessage: string; 
  pleaseSelectARole: string; 
  roleRequiredError: string; 
  userStatusActive: string;
  userStatusInvited: string;
  userStatusDeactivated: string;
  adminResetPasswordButton: string;
  adminDeactivateUserButton: string;
  adminActivateUserButton: string;
  adminResetPasswordConfirmation: string;
  adminDeactivateUserConfirmation: string;
  adminActivateUserConfirmation: string;
  adminPasswordResetEmailSent: string;
  adminPasswordResetEmailFailed: string;
  permissions: string;
  permissionPresets: string;
  applyAdminPreset: string;
  applyPMPreset: string;
  applyTMPreset: string;


  // Project Timeline Generator
  generateTimelineButton: string;
  generatingTimelineLoading: string;
  timelineGenerationError: string;
  timelineGenerationNoTimeline: string;
  suggestedProjectTimelineTitle: string;
  milestoneLabel: string;
  milestoneDescriptionLabel: string;
  estimatedCompletionLabel: string;
  deliverablesLabel: string;
  projectTimelineGeneratorPrompt: string;

  // Urgent Tasks Summary
  urgentTasksSummaryTitle: string;
  noUrgentTasksMessage: string;
  tasksForOwnerLabel: string;
  taskInProjectLabel: string;
  dueLabelShort: string;

  // MyTasksPage specific
  deleteTodoConfirmation: string;
  thisTodo: string;
  taskDependencyPromptTitle: string;
  taskDependencyPromptMessage: string;
  taskDependencyPromptSubMessage: string;
  taskDependencyPromptLater: string;
  taskDependencyPromptStart: string;

  // Task Comments & Sentiment Analysis
  taskCommentsTitle: string;
  addCommentPlaceholder: string;
  addCommentBtn: string;
  viewCommentsBtn: string;
  hideCommentsBtn: string;
  noCommentsYet: string;
  sentimentPositive: string;
  sentimentNegative: string;
  sentimentNeutral: string;
  sentimentUnknown: string;
  commentFlaggedUrgentTooltip: string;
  loadingComment: string;
  loadingSentiment: string;
  errorAddingComment: string;
  errorAnalyzingSentiment: string;
  geminiSentimentPrompt: string;
  
  // AI Meeting Agenda
  generateMeetingAgendaButton: string;
  generatingAgendaLoading: string;
  agendaGenerationError: string;
  agendaGenerationNoAgenda: string;
  meetingAgendaTitle: string;
  agendaDiscussionPoints: string;
  agendaOverdueTasksReview: string;
  agendaBlockedTasksReview: string;
  agendaPlanningSuggestions: string;
  geminiMeetingAgendaPrompt: string;
  agendaNoTasksToDiscuss: string;
  agendaTaskName: string;
  agendaAssignee: string;
  agendaDueDate: string;
  agendaBlockedBy: string;

  // AI Insights Panel
  generateInsightsButton: string;
  aiInsightsPanelTitle: string;
  generatingInsightsLoading: string;
  insightsGenerationError: string;
  insightsGenerationNoInsights: string;
  geminiInsightsPrompt: string;
  insightTypeBottleneck: string;
  insightTypePerformanceHigh: string;
  insightTypePerformanceLow: string;
  insightTypeTrend: string;
  insightTypeResourceConcern: string;
  insightTypePositiveHighlight: string;
  viewProjectLink: string;
  viewTaskLink: string; 
  viewUserLink: string; 
  relatedProjects: string;
  relatedTasks: string; 
  relatedUsers: string;
  totalUsersStatCard: string; 

  // Quick Add Task
  quickAddTaskButton: string;
  quickAddTaskModalTitle: string;
  quickAddTaskInputLabel: string;
  quickAddTaskGetSuggestionsButton: string;
  quickAddTaskError: string;
  geminiQuickTaskPrompt: string;
  aiSuggestedDueDate: string;

  // Simplified Timeline View
  timelineViewTab: string;
  timelineViewTitle: string;
  taskStartDate: string;
  taskDependsOn: string;
  noTasksForTimeline: string;
  
  // Login Page
  loginPageTitle: string;
  emailLabel: string;
  passwordLabel: string;
  loginButton: string;
  loginFailedError: string;
  loggingInStatus: string;
  logoutButton: string;
  emailRequiredError: string;
  emailInvalidError: string;
  passwordRequiredError: string;
  redirectToDashboard: string;
  welcomeBack: string;
  loginUserInvitedPrompt: string;
  loginUserDeactivatedPrompt: string;

  // User Profile Page
  userProfilePageTitle: string;
  editProfileButton: string;
  userStatsTitle: string;
  projectsOwnedStat: string;
  tasksAssignedStat: string;
  tasksCompletedStat: string;
  tasksInProgressStat: string; 
  myProfileProjectsSectionTitle: string;
  myProfileTasksSectionTitle: string;
  editProfileModalTitle: string;
  updateProfileButton: string;
  profileUpdatedSuccessfully: string;
  sidebarMyProfile: string;
  myProfileActivityTitle: string;
  myProfileNoActivity: string;
  userProfileOrganizationLabel: string;
  userProfileRoleLabel: string;

  // Tip Tour
  tourStartButton: string;
  tourNextButton: string;
  tourPreviousButton: string;
  tourFinishButton: string;
  tourStepProgress: string;
  tourWelcomeTitle: string;
  tourWelcomeMessage: string;
  tourDashboardTitle: string;
  tourDashboardMessage: string;
  tourCreateProjectTitle: string;
  tourCreateProjectMessage: string;
  tourAddTaskTitle: string;
  tourAddTaskMessage: string;
  tourMyTasksTitle: string;
  tourMyTasksMessage: string;
  tourAIFeaturesTitle: string;
  tourAIFeaturesMessage: string;
  tourGuidelinesTitle: string;
  tourGuidelinesMessage: string;
  tourCompletedMessage: string;
  sidebarHelpAndTour: string;

  // Guidelines Page
  guidelinesPageTitle: string;
  guidelinesIntroTitle: string;
  guidelinesIntroMessage: string;
  guidelinesProjectsTitle: string;
  guidelinesProjectsContentP1: string;
  guidelinesProjectsContentP2: string;
  guidelinesTasksTitle: string;
  guidelinesTasksContentP1: string;
  guidelinesTasksContentP2: string;
  guidelinesTodosTitle: string;
  guidelinesTodosContent: string;
  guidelinesAIFeaturesTitle: string;
  guidelinesAIFeaturesContentP1: string;
  guidelinesAIFeaturesContentP2: string;
  guidelinesAIFeaturesContentP3: string;
  guidelinesUserManagementTitle: string;
  guidelinesUserManagementContent: string;
  guidelinesUserProfileTitle: string;
  guidelinesUserProfileContent: string;
  guidelinesTipsTitle: string;
  guidelinesTipsContentLi1: string;
  guidelinesTipsContentLi2: string;
  guidelinesTipsContentLi3: string;
  guidelinesTipsContentLi4: string;

  // Permissions Overview Page
  permissionsOverviewTitle: string;
  permissionsFeature: string;
  permissionsAdmin: string;
  permissionsProjectManager: string;
  permissionsTeamMember: string;
  permissionFullAccess: string;
  permissionOwnOnly: string;
  permissionAssignedOnly: string;
  permissionNoAccess: string;
  permissionAdminOnly: string;
  permissionViewOnly: string;
  permFeatureProjectsCreate: string;
  permFeatureProjectsViewAll: string;
  permFeatureProjectsEdit: string;
  permFeatureProjectsDelete: string;
  permFeatureProjectsArchive: string;
  permFeatureProjectsGenerateTimeline: string;
  permFeatureProjectsGenerateInsights: string;
  permFeatureTasksCreate: string;
  permFeatureTasksView: string;
  permFeatureTasksEdit: string;
  permFeatureTasksDelete: string;
  permFeatureTasksAssignUsers: string;
  permFeatureTasksUpdateStatus: string;
  permFeatureTasksComments: string;
  permFeatureTasksQuickAdd: string;
  permFeatureTodosCRUD: string;
  permFeatureUserManagementAccess: string;
  permFeatureUserManagementAdd: string;
  permFeatureUserManagementEdit: string;
  permFeatureUserManagementDelete: string;
  permFeatureAIGenerateIdeas: string;
  permFeatureAIGenerateAgenda: string;
  permFeatureProfileViewEdit: string;
  permFeatureSystemGuidelines: string;
  permFeatureSystemTour: string;
  permFeatureSystemLanguage: string;
  permFeatureSidebarPermissionsLink: string; 
  permFeatureDashboardAccess: string;


  // Sidebar specific
  collapseSidebar: string;
  expandSidebar: string;

  // Navbar Search
  searchPlaceholder: string;
  searchToggleOpenAriaLabel: string;
  searchToggleCloseAriaLabel: string;

  // Registration Page
  registrationPageTitle: string;
  joinOrganizationOption: string;
  createOrganizationOption: string;
  fullNameLabel: string;
  confirmPasswordLabel: string;
  inviteCodeLabel: string;
  organizationNameLabel: string;
  registerButton: string;
  registrationSuccessMessage: string;
  passwordMismatchError: string;
  inviteCodeInvalidError: string;
  organizationNameRequiredError: string;
  emailAlreadyExistsError: string;
  registrationFailedError: string;
  switchToLoginLink: string;
  creatingOrganizationStatus: string;
  joiningOrganizationStatus: string;

  // Set Password Page (Invite Flow)
  setPasswordPageTitle: string;
  setPasswordInstructions: string;
  newPasswordLabel: string;
  confirmNewPasswordLabel: string; 
  setPasswordButton: string;
  passwordSetSuccessMessage: string;
  invalidInvitationLinkError: string;
  setPasswordFailedError: string;
  passwordsDoNotMatchError: string; 
  passwordPolicyError: string; 

  // Password Reset Flow
  forgotPasswordLink: string;
  requestPasswordResetPageTitle: string;
  requestPasswordResetInstruction: string;
  sendResetLinkButton: string;
  resetLinkSentMessage: string;
  failedToSendResetLinkMessage: string;
  resetPasswordPageTitle: string;
  resetPasswordInstruction: string;
  updatePasswordButton: string; 
  passwordResetSuccessMessage: string;
  invalidOrExpiredResetLinkError: string;
  failedToResetPasswordError: string;

  // Admin Dashboard Specific
  dashboardUserManagementCardTitle: string;
  dashboardUserManagementCardDesc: string;
  dashboardUserManagementCardButton: string;
  allOrganizationProjectsTitle: string;

  // Activity Log
  activityLogPageTitle: string;
  activityLogTableTimestampHeader: string;
  activityLogTableUserHeader: string;
  activityLogTableActionHeader: string;
  activityLogTableDetailsHeader: string;
  activityLogNoLogs: string;
  logActionProjectCreated: string;
  logActionProjectUpdated: string;
  logActionProjectDeleted: string;
  logActionProjectArchived: string;
  logActionProjectUnarchived: string;
  logActionTaskCreated: string;
  logActionTaskUpdated: string;
  logActionTaskStatusChanged: string;
  logActionTaskDeleted: string;
  logActionUserInvited: string;
  logActionUserUpdated: string;
  logActionUserPermissionsChanged: string;
  logActionUserDeleted: string;
  logActionUserActivatedByInvite: string;
  logActionUserActivatedByAdmin: string;
  logActionUserDeactivated: string;
  logActionUserPasswordResetRequested: string;
  logActionUserPasswordResetRequestedByAdmin: string;
  logActionUserPasswordResetCompleted: string;
  logActionUserLoggedIn: string;
  logActionUserLoggedOut: string;
  logActionCommentAdded: string;
  logActionOrganizationUpdated: string;

  logDetailsProjectCreated: string;
  logDetailsProjectUpdated: string;
  logDetailsProjectDeleted: string;
  logDetailsProjectArchived: string;
  logDetailsProjectUnarchived: string;
  logDetailsTaskCreated: string;
  logDetailsTaskUpdated: string;
  logDetailsTaskStatusChanged: string;
  logDetailsTaskDeleted: string;
  logDetailsUserInvited: string;
  logDetailsUserUpdated: string;
  logDetailsUserPermissionsChanged: string;
  logDetailsUserDeleted: string;
  logDetailsUserActivatedByInvite: string;
  logDetailsUserActivatedByAdmin: string;
  logDetailsUserDeactivated: string;
  logDetailsUserPasswordResetRequested: string;
  logDetailsUserPasswordResetRequestedByAdmin: string;
  logDetailsUserPasswordResetCompleted: string;
  logDetailsUserLoggedIn: string;
  logDetailsUserLoggedOut: string;
  logDetailsCommentAdded: string;
  logDetailsOrganizationUpdated: string;
  permFeatureActivityLogAccess: string;
  
  // Organization Settings
  organizationSettings: string;
  editOrganizationName: string;
  save: string;
} & PermissionTranslationKeys;

type Translations = {
  [key in Language]: TranslationKeys;
};

export const translations: Translations = {
  [Language.EN]: {
    appName: "Almstkshf Manager",
    dashboard: "Dashboard",
    myTasksAndTodos: "My Tasks & Todos",
    createProject: "Create New Project",
    editProject: "Edit Project",
    projectName: "Project Name",
    projectDescription: "Description",
    startDate: "Start Date",
    endDateOptional: "End Date (Optional)",
    budgetOptional: "Budget (Optional)",
    projectColor: "Project Color",
    cancel: "Cancel",
    updateProjectBtn: "Update Project",
    createProjectBtn: "Create Project",
    myProjects: "My Projects",
    guest: "Guest",
    notifications: "Notifications",
    clearAll: "Clear All",
    noNewNotifications: "No new notifications.",
    languageToggleToArabic: "العربية",
    languageToggleToEnglish: "English",
    loadingOrNotFound: "Loading details or item not found...",
    deleteProjectBtn: "Delete Project",
    deleteTaskConfirmation: "Are you sure you want to delete this task?",
    deleteProjectConfirmation: "Are you sure you want to delete this project and all its tasks? This action cannot be undone.",
    projectDetails: "Project Details",
    tasks: "Tasks",
    addTask: "Add Task",
    editTask: "Edit Task",
    taskName: "Task Name",
    taskDescriptionOptional: "Description (Optional)",
    assigneeOptional: "Assignee (Optional)",
    unassigned: "Unassigned",
    dueDateOptional: "Due Date (Optional)",
    priority: "Priority",
    status: "Status",
    updateTaskBtn: "Update Task",
    createTaskBtn: "Create Task",
    myAssignedTasks: "My Assigned Tasks",
    noTasksAssigned: "You have no tasks assigned to you currently.",
    myPersonalTodos: "My Personal Todos",
    newTodo: "New Todo",
    addTodo: "Add Todo",
    todoPlaceholder: "What needs to be done?",
    noPersonalTodosMessage: "No personal todos yet. Add some to stay organized!",
    totalProjects: "Active Projects", 
    totalTasks: "Active Tasks", 
    tasksInProgress: "Tasks In Progress",
    tasksCompleted: "Tasks Completed",
    totalOverdueTasks: "Overdue Tasks",
    resourceAllocation: "Resource Allocation",
    activeTasksForUser: "{{count}} active ({{highPriorityCount}} high prio.)",
    highPriorityShort: "High Prio.",
    delete: "Delete",
    due: "Due",
    progress: "Progress",
    noTasksYet: "No tasks yet.",
    noProjectsYet: "No active projects yet.",
    createOneToGetStarted: "Create one to get started!", 
    noDescription: "No description available.",
    startLabel: "Start",
    endLabel: "End",
    budgetLabel: "Budget",
    assigneeLabel: "Assignee",
    dueDateLabel: "Due Date",
    priorityLabel: "Priority",
    statusLabel: "Status",
    taskStatusToDo: "To Do",
    taskStatusInProgress: "In Progress",
    taskStatusReview: "Review",
    taskStatusDone: "Done",
    taskStatusBlocked: "Blocked",
    taskStatusOverdue: "Overdue", 
    taskPriorityLow: "Low",
    taskPriorityMedium: "Medium",
    taskPriorityHigh: "High",
    noTasksInProject: "No tasks in this project yet.",
    editTaskBtn: "Edit", 
    deleteTaskBtn: "Delete",
    closeModalAriaLabel: "Close modal",
    unknownUser: "Unknown",
    notAvailableShort: "N/A", 

    error: "Error!",
    genericRequiredError: "{{fieldName}} is required.",
    allRightsReserved: "All rights reserved.",

    archiveProjectBtn: "Archive Project",
    unarchiveProjectBtn: "Unarchive Project",
    archiveProjectConfirmation: "Are you sure you want to archive this project? Tasks will also be hidden.",
    unarchiveProjectConfirmation: "Are you sure you want to unarchive this project?",
    showArchivedProjects: "Show Archived",
    showActiveProjects: "Show Active",
    projectArchivedBadge: "Archived",
    archivedProjects: "Archived Projects",
    noArchivedProjects: "You have no archived projects.",
    projectIsArchivedNoTasks: "This project is archived. Tasks are not displayed for archived projects.",
    notificationProjectArchived: "Project \"{{name}}\" has been archived.",
    notificationProjectUnarchived: "Project \"{{name}}\" has been unarchived.",

    notificationProjectCreated: "New project \"{{name}}\" created in {{orgName}}.",
    notificationProjectUpdated: "Project \"{{name}}\" in {{orgName}} updated.",
    notificationProjectDeleted: "Project \"{{name}}\" from {{orgName}} deleted.",
    notificationTaskCreated: "New task \"{{taskName}}\" added to project \"{{projectName}}\" in {{orgName}}.",
    notificationTaskCreatedWithAssignee: "New task \"{{taskName}}\" added to project \"{{projectName}}\" in {{orgName}}. Assigned to {{assigneeName}}.",
    notificationTaskUpdated: "Task \"{{name}}\" updated. Status: {{status}} (in {{orgName}}).",
    notificationTaskDeleted: "Task \"{{name}}\" deleted from {{orgName}}.",
    notificationUserAdded: "User \"{{name}}\" has been invited to {{orgName}}.",
    notificationUserUpdated: "User \"{{name}}\" details in {{orgName}} have been updated.",
    notificationUserDeleted: "User \"{{name}}\" has been deleted from {{orgName}}.",
    notificationTaskOverdue: "Task '{{taskName}}' in project '{{projectName}}' ({{orgName}}) is now overdue.",
    notificationTaskOverdueForUser: "Task '{{taskName}}' assigned to {{assigneeName}} in project '{{projectName}}' ({{orgName}}) is now overdue.",
    notificationTaskOverdueUnassigned: "Unassigned task '{{taskName}}' in project '{{projectName}}' ({{orgName}}) is now overdue.",
    notificationTaskStatusChanged: "Task \"{{taskName}}\" status changed to {{status}} (in {{orgName}}).",
    notificationUrgentComment: "Urgent/Negative comment on task '{{taskName}}' in project '{{projectName}}' ({{orgName}}) by {{userName}}: '{{commentTextSnippet}}'",
    notificationTaskDeadlineChanged: "Deadline for task '{{taskName}}' in project '{{projectName}}' ({{orgName}}) changed to {{newDueDate}}.",
    notificationSetPasswordInvite: "You've been invited to {{orgName}}! Click the link to set your password and activate your account (powered by {{appName}}).",
    notificationPasswordResetLink: "You requested a password reset for your {{orgName}} account (powered by {{appName}}). Click the link to set a new password. This link expires in 30 minutes.",
    notificationIdeaSaved: "Project idea '{{ideaName}}' saved for {{orgName}}!",
    notificationIdeaRemoved: "Saved idea '{{ideaName}}' removed from {{orgName}}.",
    notificationIdeaCopied: "Idea '{{ideaName}}' details copied to clipboard!",
    notificationRedirectingToEditTask: "Opening task '{{taskName}}' for editing on the project page...",
    notificationRedirectingToViewComments: "Opening comments for task '{{taskName}}' on the project page...",
    notificationUserRegistered: "Welcome to {{orgName}}, {{name}}! Your registration was successful.",
    notificationOrgCreated: "New organization '{{orgName}}' created successfully with you as Admin (powered by {{appName}}).",
    organizationNameUpdated: "Organization name updated successfully!",


    projectIdeas: "Project Ideas",
    projectIdeaGeneratorTitle: "Project Idea Generator",
    projectIdeaGeneratorInputLabel: "Enter a topic or problem to brainstorm ideas for:",
    projectIdeaGeneratorButton: "Generate Ideas",
    projectIdeaGeneratorLoading: "Generating ideas, please wait...",
    projectIdeaGeneratorNoIdeas: "No ideas generated yet. Try a different topic or refine your input.",
    projectIdeaGeneratorError: "An error occurred while generating ideas. Please try again.",
    projectIdeaGeneratorPrompt: "You are an expert project ideation assistant. Based on the following topic or problem, generate 3 distinct project ideas. For each idea, provide a concise name, a short description (1-2 sentences), and a list of 3-5 potential key features. The user input is: \"{{userInput}}\". Please return the response as a valid JSON array, where each object in the array has the following structure: `{\"name\": \"string\", \"description\": \"string\", \"features\": [\"string\", \"string\", ...]}`. Ensure the JSON is well-formed and directly parsable.",
    ideaName: "Idea Name",
    ideaDescription: "Description",
    ideaFeatures: "Key Features",
    ideaSaveButton: "Save Idea",
    ideaCopyButton: "Copy Details",
    ideaCopiedToClipboard: "Idea details copied to clipboard!",
    ideaCreateProjectButton: "Create Project",
    ideaAddTaskButton: "Add as Task",
    savedIdeasSectionTitle: "Saved Ideas",
    noSavedIdeasMessage: "You haven't saved any ideas yet.",
    removeSavedIdeaButton: "Remove",
    confirmRemoveSavedIdea: "Are you sure you want to remove the saved idea '{{ideaName}}'?",
    selectProjectForTaskModalTitle: "Select Project for Task",
    selectProjectLabel: "Select Project",
    addIdeaAsTaskButton: "Add Idea as Task",
    noActiveProjectsToAddTaskTo: "No active projects available to add this task to. Please create a project first.",


    userManagement: "User Management",
    userManagementTitle: "User Management",
    addNewUser: "Add New User",
    addUserModalTitle: "Add New User",
    editUserModalTitle: "Edit User", 
    userNameLabel: "Full Name",
    userEmailLabel: "Email Address",
    userEmailPlaceholder: "e.g., user@example.com",
    addUserBtn: "Invite User", 
    updateUserBtn: "Update User",
    deleteUserBtn: "Delete",
    usersTableNoUsers: "No users found. Add one to get started!",
    usersTableNameHeader: "Name",
    usersTableEmailHeader: "Email",
    usersTableActionsHeader: "Actions", 
    usersTableRoleHeader: "Role", 
    usersTableStatusHeader: "Status",
    usersTablePermissionsHeader: "Permissions",
    toGetStarted: "to get started.", 
    errorUserExists: "A user with the email '{{email}}' already exists.", 
    deleteUserConfirmationTitle: "Delete User", 
    deleteUserConfirmationMessage: "Are you sure you want to delete the user '{{userName}}'? This action cannot be undone. Tasks assigned to this user will become unassigned.", 
    userRoleAdmin: "Admin", 
    userRoleProjectManager: "Project Manager", 
    userRoleTeamMember: "Team Member", 
    userRoleLabel: "Role", 
    accessDeniedTitle: "Access Denied", 
    accessDeniedMessage: "You do not have permission to access this page or perform this action.", 
    pleaseSelectARole: "-- Please Select a Role --", 
    roleRequiredError: "Role selection is required.", 
    userStatusActive: "Active",
    userStatusInvited: "Invited",
    userStatusDeactivated: "Deactivated",
    adminResetPasswordButton: "Reset Password",
    adminDeactivateUserButton: "Deactivate User",
    adminActivateUserButton: "Activate User",
    adminResetPasswordConfirmation: "Are you sure you want to send a password reset link to {{userName}}?",
    adminDeactivateUserConfirmation: "Are you sure you want to deactivate the account for {{userName}}?",
    adminActivateUserConfirmation: "Are you sure you want to activate the account for {{userName}}?",
    adminPasswordResetEmailSent: "Password reset link sent to {{userName}}.",
    adminPasswordResetEmailFailed: "Failed to send password reset link to {{userName}}.",
    permissions: "Permissions",
    permissionPresets: "Permission Presets",
    applyAdminPreset: "Apply Admin Preset",
    applyPMPreset: "Apply PM Preset",
    applyTMPreset: "Apply Team Member Preset",
    permission_CREATE_PROJECTS: "Create Projects",
    permission_EDIT_ALL_PROJECTS: "Edit All Projects",
    permission_DELETE_ALL_PROJECTS: "Delete All Projects",
    permission_ARCHIVE_ALL_PROJECTS: "Archive All Projects",
    permission_CREATE_TASKS: "Create Tasks",
    permission_EDIT_ALL_TASKS: "Edit All Tasks",
    permission_DELETE_ALL_TASKS: "Delete All Tasks",
    permission_ASSIGN_USERS_TO_TASKS: "Assign Users to Tasks",
    permission_MANAGE_USERS: "Manage Users (Invite, Edit, Delete)",
    permission_MANAGE_ORGANIZATION: "Manage Organization (Edit Name)",
    permission_GENERATE_PROJECT_TIMELINE: "Generate Project Timelines (AI)",
    permission_GENERATE_PROJECT_INSIGHTS: "Generate Project Insights (AI)",
    permission_GENERATE_MEETING_AGENDA: "Generate Meeting Agendas (AI)",
    permission_VIEW_ACTIVITY_LOG: "View Activity Log",
    permission_ACCESS_DASHBOARD: "Access Dashboard",


    generateTimelineButton: "Generate Timeline",
    generatingTimelineLoading: "Generating timeline, please wait...",
    timelineGenerationError: "An error occurred while generating the timeline. Please try again.",
    timelineGenerationNoTimeline: "No timeline could be generated based on the project details, or the AI did not return a valid timeline.",
    suggestedProjectTimelineTitle: "Suggested Project Timeline (AI Generated)",
    milestoneLabel: "Milestone",
    milestoneDescriptionLabel: "Description",
    estimatedCompletionLabel: "Est. Completion",
    deliverablesLabel: "Key Deliverables",
    projectTimelineGeneratorPrompt: "You are an expert project planning assistant. Based on the following project details:\nName: {{projectName}}\nDescription: {{projectDescription}}\nStart Date: {{startDate}}\nEnd Date: {{endDate}}\nExisting Tasks Summary: {{tasksSummary}}\n\nGenerate a realistic project timeline. The timeline should include major milestones (around 3-5), a brief description for each milestone, an estimated completion (e.g., a date 'YYYY-MM-DD' or a duration like '2 weeks from start'), and key deliverables (2-4) for each milestone. Please return the response as a valid JSON array, where each object in the array represents a milestone and has the following structure: `{\"milestone\": \"string\", \"description\": \"string\", \"estimatedCompletion\": \"string\", \"deliverables\": [\"string\", \"string\", ...]}`. Ensure the JSON is well-formed and directly parsable. If an end date is not provided, estimate a reasonable project duration based on the description and tasks. If insufficient information is provided to create a meaningful timeline, return an empty JSON array `[]`.",

    urgentTasksSummaryTitle: "Urgent High-Priority Tasks (Next 48 Hours)",
    noUrgentTasksMessage: "No high-priority tasks due within the next 48 hours.",
    tasksForOwnerLabel: "Tasks for {{ownerName}}:",
    taskInProjectLabel: "in Project",
    dueLabelShort: "Due",

    deleteTodoConfirmation: "Are you sure you want to delete this todo: \"{{todoText}}\"?",
    thisTodo: "this todo",
    taskDependencyPromptTitle: "Task '{{completedTaskName}}' Completed!",
    taskDependencyPromptMessage: "The next task '{{nextTaskName}}' in this sequence is now unblocked.",
    taskDependencyPromptSubMessage: "Would you like to start working on it now?",
    taskDependencyPromptLater: "Later",
    taskDependencyPromptStart: "Start Next Task",

    taskCommentsTitle: "Task Comments",
    addCommentPlaceholder: "Write a comment...",
    addCommentBtn: "Add Comment",
    viewCommentsBtn: "View Comments",
    hideCommentsBtn: "Hide Comments",
    noCommentsYet: "No comments yet. Be the first to add one!",
    sentimentPositive: "Positive",
    sentimentNegative: "Negative",
    sentimentNeutral: "Neutral",
    sentimentUnknown: "Analyzing...",
    commentFlaggedUrgentTooltip: "This comment is flagged as urgent or indicates strong frustration.",
    loadingComment: "Adding comment...",
    loadingSentiment: "Analyzing sentiment...",
    errorAddingComment: "Failed to add comment. Please try again.",
    errorAnalyzingSentiment: "Failed to analyze sentiment. Comment added without analysis.",
    geminiSentimentPrompt: "Analyze the sentiment of the following comment for a project task. Determine if its sentiment is 'Positive', 'Negative', or 'Neutral'. Also, indicate if the message suggests urgency or strong frustration (true/false for isUrgent). Comment: \"{{commentText}}\". Respond with a JSON object with this exact structure: {\"sentiment\": \"Positive\"|\"Negative\"|\"Neutral\", \"isUrgent\": boolean}. Do not add any markdown like ```json.",
    
    generateMeetingAgendaButton: "Generate Weekly Meeting Agenda",
    generatingAgendaLoading: "Generating agenda, please wait...",
    agendaGenerationError: "An error occurred while generating the agenda. Please try again.",
    agendaGenerationNoAgenda: "No agenda could be generated. This might be due to a lack of open tasks or an AI processing issue.",
    meetingAgendaTitle: "Meeting Agenda",
    agendaDiscussionPoints: "Discussion Points",
    agendaOverdueTasksReview: "Review Overdue Tasks",
    agendaBlockedTasksReview: "Review Blocked Tasks",
    agendaPlanningSuggestions: "Planning & Suggestions",
    geminiMeetingAgendaPrompt: "You are an expert meeting facilitator. For the current week (ending {{currentDate}}), analyze the provided project and task data to generate a concise and actionable meeting agenda. Focus on resolving open issues and planning. \nProject Names: {{projectNamesString}}\nTasks Data (JSON Array): {{taskListJsonString}}\n\nReturn a JSON object with this exact structure: `{\"agendaTitle\": \"string (e.g., Weekly Sync - Week of YYYY-MM-DD)\", \"discussionPoints\": [{\"point\": \"string\", \"relatedTaskIds\": [\"string\"]}] /* General points from active tasks */, \"overdueTasksReview\": [{\"taskName\": \"string\", \"assigneeName\": \"string\", \"dueDate\": \"string\", \"relatedTaskIds\": [\"string\"]}] /* List overdue tasks */, \"blockedTasksReview\": [{\"taskName\": \"string\", \"assigneeName\": \"string\", \"blockedByTaskName\": \"string?\", \"relatedTaskIds\": [\"string\"]}] /* List blocked tasks */, \"planningSuggestions\": [\"string\"] /* Suggestions for next steps or focus areas */}`. \nPrioritize tasks that are 'In Progress', 'Overdue', 'Blocked', or 'High Priority To Do'. For 'discussionPoints', select a few key active tasks or themes. Ensure the JSON is well-formed and directly parsable. If no significant tasks require discussion, suggest a brief check-in or skipping the meeting in 'planningSuggestions'.",
    agendaNoTasksToDiscuss: "No specific tasks to discuss based on current data.",
    agendaTaskName: "Task",
    agendaAssignee: "Assignee",
    agendaDueDate: "Due",
    agendaBlockedBy: "Blocked By",

    generateInsightsButton: "Generate Project Insights",
    aiInsightsPanelTitle: "AI Project Insights",
    generatingInsightsLoading: "Generating insights, please wait...",
    insightsGenerationError: "An error occurred while generating insights. Please try again.",
    insightsGenerationNoInsights: "No specific insights generated at this time.",
    geminiInsightsPrompt: "You are an expert project analysis AI. Analyze the following project data:\nActive Projects (JSON): {{projectsJson}}\nAll Tasks for Active Projects (JSON): {{tasksJson}}\nUsers (JSON): {{usersJson}}\n\nIdentify key trends, potential bottlenecks (e.g., projects with many overdue tasks, tasks stuck in a particular status, users with high overdue counts), resource allocation concerns (e.g. overloaded users), and notable team/user performance patterns (e.g., users consistently meeting deadlines - infer from low overdue counts, users consistently missing deadlines - infer from high overdue counts). Also highlight any positive trends or successes. Provide up to 5-7 distinct insights. For each insight, specify its type, a concise description, and optionally, IDs of related projects, tasks, or users. \nInsight types can be: 'bottleneck', 'performance_high', 'performance_low', 'trend', 'resource_concern', 'positive_highlight'.\nReturn a JSON object: `{\"insights\": [{\"type\": \"string\", \"description\": \"string\", \"relatedProjectIds\": [\"string\"], \"relatedTaskIds\": [\"string\"], \"relatedUserIds\": [\"string\"]}]}`. Ensure the JSON is well-formed and directly parsable.",
    insightTypeBottleneck: "Bottleneck",
    insightTypePerformanceHigh: "High Performance",
    insightTypePerformanceLow: "Low Performance",
    insightTypeTrend: "Trend",
    insightTypeResourceConcern: "Resource Concern",
    insightTypePositiveHighlight: "Positive Highlight",
    viewProjectLink: "View Project",
    viewTaskLink: "View Task", 
    viewUserLink: "View User", 
    relatedProjects: "Related Projects",
    relatedTasks: "Related Tasks", 
    relatedUsers: "Related Users",
    totalUsersStatCard: "Total Users", 

    quickAddTaskButton: "Quick Add Task",
    quickAddTaskModalTitle: "Quick Add New Task",
    quickAddTaskInputLabel: "Describe the task briefly (AI will help fill details):",
    quickAddTaskGetSuggestionsButton: "Get AI Suggestions",
    quickAddTaskError: "Failed to get AI suggestions. Please try again or add manually.",
    geminiQuickTaskPrompt: "You are an assistant helping to quickly add a task to a project.\nUser's raw input for the task: \"{{userInput}}\"\nCurrent Project Name: \"{{projectName}}\"\nExisting tasks in this project (name, priority, assigneeId):\n{{existingTasksJson}}\nAvailable users in the project (id, name):\n{{usersJson}}\n\nBased on this, suggest the following for the new task:\n1. `name`: A concise and clear task name (string).\n2. `description`: A brief, optional elaboration (string, or null).\n3. `priority`: 'Low', 'Medium', or 'High' (string).\n4. `assigneeId`: The ID of the most suitable user from the available users list, or null if unsure or if it should be unassigned (string or null).\n5. `dueDateSuggestion`: A *textual suggestion* for when this task might be due (e.g., 'today', 'tomorrow', 'in 3 days', 'next Friday', or null if not inferable from the input). Do NOT return a date YYYY-MM-DD here.\n\nReturn a single JSON object with the keys: \"name\", \"description\", \"priority\", \"assigneeId\", \"dueDateSuggestion\". Ensure valid JSON. Example response: `{\"name\": \"Finalize client X report\", \"description\": \"Compile all sections and perform final review of the report for client X.\", \"priority\": \"High\", \"assigneeId\": \"user1\", \"dueDateSuggestion\": \"in 2 days\"}`",
    aiSuggestedDueDate: "AI Suggests Due: {{suggestion}}",

    timelineViewTab: "Timeline",
    timelineViewTitle: "Project Task Timeline",
    taskStartDate: "Start",
    taskDependsOn: "Depends on",
    noTasksForTimeline: "No tasks with dates to display on timeline.",
    
    loginPageTitle: "Login to Almstkshf Manager",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Login",
    loginFailedError: "Invalid email or password. Please try again.",
    loggingInStatus: "Logging in...",
    logoutButton: "Logout",
    emailRequiredError: "Email is required.",
    emailInvalidError: "Please enter a valid email address.",
    passwordRequiredError: "Password is required.",
    redirectToDashboard: "Redirecting to dashboard...",
    welcomeBack: "Welcome Back, {{name}}!",
    loginUserInvitedPrompt: "Your account is pending password setup. Please check your email for an invitation link to set your password.",
    loginUserDeactivatedPrompt: "Your account has been deactivated. Please contact an administrator.",

    userProfilePageTitle: "My Profile",
    editProfileButton: "Edit Profile",
    userStatsTitle: "My Statistics",
    projectsOwnedStat: "Projects Owned",
    tasksAssignedStat: "Tasks Assigned",
    tasksCompletedStat: "Tasks Completed",
    tasksInProgressStat: "Tasks In Progress", 
    myProfileProjectsSectionTitle: "My Projects",
    myProfileTasksSectionTitle: "My Tasks",
    editProfileModalTitle: "Edit My Profile",
    updateProfileButton: "Update Profile",
    profileUpdatedSuccessfully: "Profile updated successfully!",
    sidebarMyProfile: "My Profile",
    myProfileActivityTitle: "Recent Activity",
    myProfileNoActivity: "No recent activity to display.",
    userProfileOrganizationLabel: "Organization",
    userProfileRoleLabel: "Role",

    tourStartButton: "Start Tour",
    tourNextButton: "Next",
    tourPreviousButton: "Previous",
    tourFinishButton: "Finish Tour",
    tourStepProgress: "Step {{currentStep}} of {{totalSteps}}",
    tourWelcomeTitle: "Welcome to Almstkshf Manager!",
    tourWelcomeMessage: "Let's take a quick tour to show you around. This app helps you manage projects, tasks, and even brainstorm new ideas with AI!",
    tourDashboardTitle: "Your Dashboard",
    tourDashboardMessage: "This is your main hub. Here you'll see an overview of your projects, urgent tasks, and some quick stats. You can create new projects from here.",
    tourCreateProjectTitle: "Creating a Project",
    tourCreateProjectMessage: "Click the 'Create Project' button on the Dashboard to start a new project. Give it a name, description, and choose a color to organize it.",
    tourAddTaskTitle: "Adding Tasks to a Project",
    tourAddTaskMessage: "Inside a project, you can add tasks. Assign them, set due dates, priorities, and descriptions. You can even use the 'Quick Add Task' AI feature for faster input!",
    tourMyTasksTitle: "My Tasks & Todos",
    tourMyTasksMessage: "The 'My Tasks & Todos' page in the sidebar shows all tasks assigned to you across projects, plus your personal to-do list.",
    tourAIFeaturesTitle: "AI-Powered Features",
    tourAIFeaturesMessage: "Explore AI features like Project Idea Generation, Project Timeline suggestions, AI Meeting Agendas, and sentiment analysis on task comments!",
    tourGuidelinesTitle: "Need More Info?",
    tourGuidelinesMessage: "For detailed information, check out the 'Guidelines' page accessible from the sidebar. You can also restart this tour anytime from the 'Help & Tour' button.",
    tourCompletedMessage: "Tour completed! You're all set to explore.",
    sidebarHelpAndTour: "Help & Tour",

    guidelinesPageTitle: "Application Guidelines",
    guidelinesIntroTitle: "Welcome to Almstkshf Manager!",
    guidelinesIntroMessage: "This guide will help you understand the features of Almstkshf Manager and how to use them effectively.",
    guidelinesProjectsTitle: "Managing Projects",
    guidelinesProjectsContentP1: "Projects are the core of your work. You can create projects from the Dashboard, giving them a name, description, start/end dates, and a color for visual organization. Each project has its own detail page where you manage its tasks.",
    guidelinesProjectsContentP2: "Archive projects that are completed or on hold to keep your active project list clean. You can view and unarchive them from the Dashboard.",
    guidelinesTasksTitle: "Managing Tasks",
    guidelinesTasksContentP1: "Within each project, you can create tasks. Each task can have a name, description, assignee, due date, priority (Low, Medium, High), and status (To Do, In Progress, Review, Done, Blocked, Overdue).",
    guidelinesTasksContentP2: "You can set dependencies between tasks. A task cannot be started if its prerequisite task is not marked as 'Done'. Use comments to discuss tasks with your team.",
    guidelinesTodosTitle: "Personal Todos",
    guidelinesTodosContent: "Use the 'My Tasks & Todos' page to manage your personal to-do list. These are separate from project tasks and are just for your personal organization.",
    guidelinesAIFeaturesTitle: "AI-Powered Features",
    guidelinesAIFeaturesContentP1: "Project Idea Generator: Stuck for ideas? Use the 'Project Ideas' page to get AI-generated suggestions based on a topic you provide.",
    guidelinesAIFeaturesContentP2: "Project Timeline & Milestones: On a project's detail page, click 'Generate Timeline' to get AI suggestions for key milestones and their estimated completion.",
    guidelinesAIFeaturesContentP3: "Task Comment Sentiment: When you add a comment to a task, AI analyzes its sentiment (Positive, Negative, Neutral) and flags urgent comments. Quick Add Task: Use the 'Quick Add Task' button on the project page to describe a task in natural language, and AI will help structure it. Meeting Agenda: Generate a meeting agenda from the dashboard based on active tasks.",
    guidelinesUserManagementTitle: "User Management",
    guidelinesUserManagementContent: "The 'User Management' page allows you to add, edit, and delete users from the system. New users can then log in and be assigned to tasks.",
    guidelinesUserProfileTitle: "My Profile",
    guidelinesUserProfileContent: "Access your profile via the sidebar to view your details, statistics about your projects and tasks, and edit your name.",
    guidelinesTipsTitle: "Tips for Effective Use",
    guidelinesTipsContentLi1: "Keep task statuses updated regularly.",
    guidelinesTipsContentLi2: "Use comments for communication within tasks.",
    guidelinesTipsContentLi3: "Set realistic due dates and priorities.",
    guidelinesTipsContentLi4: "Regularly review your 'My Tasks & Todos' page to stay on top of your work.",
    
    permissionsOverviewTitle: "Permissions Overview",
    permissionsFeature: "Feature / Action",
    permissionsAdmin: "Admin",
    permissionsProjectManager: "Project Manager",
    permissionsTeamMember: "Team Member",
    permissionFullAccess: "✓ (Full)",
    permissionOwnOnly: "Own Only",
    permissionAssignedOnly: "Assigned Only",
    permissionNoAccess: "✗ (No)",
    permissionAdminOnly: "Admin Only",
    permissionViewOnly: "View Only",
    permFeatureProjectsCreate: "Create Projects",
    permFeatureProjectsViewAll: "View All Projects",
    permFeatureProjectsEdit: "Edit Projects",
    permFeatureProjectsDelete: "Delete Projects",
    permFeatureProjectsArchive: "Archive/Unarchive Projects",
    permFeatureProjectsGenerateTimeline: "Generate Project Timeline (AI)",
    permFeatureProjectsGenerateInsights: "Generate Project Insights (AI - Dashboard)",
    permFeatureTasksCreate: "Create Tasks (in manageable projects)",
    permFeatureTasksView: "View Tasks (in accessible projects)",
    permFeatureTasksEdit: "Edit Tasks",
    permFeatureTasksDelete: "Delete Tasks",
    permFeatureTasksAssignUsers: "Assign Users to Tasks",
    permFeatureTasksUpdateStatus: "Update Task Status",
    permFeatureTasksComments: "Add/View Task Comments",
    permFeatureTasksQuickAdd: "Quick Add Tasks (AI)",
    permFeatureTodosCRUD: "Manage Own Personal Todos",
    permFeatureUserManagementAccess: "Access User Management Page",
    permFeatureUserManagementAdd: "Add New Users",
    permFeatureUserManagementEdit: "Edit Users (incl. roles)",
    permFeatureUserManagementDelete: "Delete Users",
    permFeatureAIGenerateIdeas: "Generate Project Ideas (AI)",
    permFeatureAIGenerateAgenda: "Generate Meeting Agenda (AI - Dashboard)",
    permFeatureProfileViewEdit: "View & Edit Own Profile",
    permFeatureSystemGuidelines: "View Guidelines Page",
    permFeatureSystemTour: "Use Guided Tour",
    permFeatureSystemLanguage: "Change Language",
    permFeatureSidebarPermissionsLink: "Permissions Overview", 
    permFeatureDashboardAccess: "Access Dashboard",


    collapseSidebar: "Collapse Sidebar",
    expandSidebar: "Expand Sidebar",
    
    searchPlaceholder: "Search...",
    searchToggleOpenAriaLabel: "Open Search Bar",
    searchToggleCloseAriaLabel: "Close Search Bar",

    registrationPageTitle: "Register New Account",
    joinOrganizationOption: "Join an Existing Organization",
    createOrganizationOption: "Create a New Organization",
    fullNameLabel: "Full Name",
    confirmPasswordLabel: "Confirm Password",
    inviteCodeLabel: "Organization Invite Code",
    organizationNameLabel: "New Organization Name",
    registerButton: "Register",
    registrationSuccessMessage: "Registration successful! Redirecting...",
    passwordMismatchError: "Passwords do not match.",
    inviteCodeInvalidError: "Invalid invite code. Please check and try again.",
    organizationNameRequiredError: "Organization name is required.",
    emailAlreadyExistsError: "An account with this email already exists.",
    registrationFailedError: "Registration failed. Please try again.",
    switchToLoginLink: "Already have an account? Login",
    creatingOrganizationStatus: "Creating Organization...",
    joiningOrganizationStatus: "Joining Organization...",

    setPasswordPageTitle: "Set Your Password",
    setPasswordInstructions: "Welcome! Please set a password for your account ({{email}}).",
    newPasswordLabel: "New Password",
    confirmNewPasswordLabel: "Confirm New Password", 
    setPasswordButton: "Set Password & Activate Account",
    passwordSetSuccessMessage: "Password set successfully! Redirecting to login...",
    invalidInvitationLinkError: "This invitation link is invalid or has expired. Please request a new invitation or contact support.",
    setPasswordFailedError: "Failed to set password. Please try again or contact support.",
    passwordsDoNotMatchError: "Passwords do not match. Please re-enter.",
    passwordPolicyError: "Password must be at least 8 characters, include one uppercase letter, one number, and one symbol.", 

    forgotPasswordLink: "Forgot Password?",
    requestPasswordResetPageTitle: "Request Password Reset",
    requestPasswordResetInstruction: "Enter your email address below to receive a password reset link.",
    sendResetLinkButton: "Send Reset Link",
    resetLinkSentMessage: "If an account with the email {{email}} exists, a password reset link has been sent. Please check your inbox (and spam folder).",
    failedToSendResetLinkMessage: "Failed to send reset link. Please try again later.",
    resetPasswordPageTitle: "Reset Your Password",
    resetPasswordInstruction: "Please enter your new password below.",
    updatePasswordButton: "Update Password",
    passwordResetSuccessMessage: "Your password has been reset successfully! You can now log in with your new password.",
    invalidOrExpiredResetLinkError: "The password reset link is invalid or has expired. Please request a new one.",
    failedToResetPasswordError: "Failed to reset password. Please try again.",

    dashboardUserManagementCardTitle: "User Management",
    dashboardUserManagementCardDesc: "Add, edit, or remove users and manage their roles within the organization.",
    dashboardUserManagementCardButton: "Manage Users",
    allOrganizationProjectsTitle: "All Organization Projects",

    activityLogPageTitle: "Activity Log",
    activityLogTableTimestampHeader: "Timestamp",
    activityLogTableUserHeader: "User",
    activityLogTableActionHeader: "Action",
    activityLogTableDetailsHeader: "Details",
    activityLogNoLogs: "No activity logs found for this organization.",
    logActionProjectCreated: "Project Created",
    logActionProjectUpdated: "Project Updated",
    logActionProjectDeleted: "Project Deleted",
    logActionProjectArchived: "Project Archived",
    logActionProjectUnarchived: "Project Unarchived",
    logActionTaskCreated: "Task Created",
    logActionTaskUpdated: "Task Updated",
    logActionTaskStatusChanged: "Task Status Changed",
    logActionTaskDeleted: "Task Deleted",
    logActionUserInvited: "User Invited",
    logActionUserUpdated: "User Updated",
    logActionUserPermissionsChanged: "User Permissions Changed",
    logActionUserDeleted: "User Deleted",
    logActionUserActivatedByInvite: "User Activated (Invite)",
    logActionUserActivatedByAdmin: "User Activated (Admin)",
    logActionUserDeactivated: "User Deactivated",
    logActionUserPasswordResetRequested: "Password Reset Requested",
    logActionUserPasswordResetRequestedByAdmin: "Password Reset (Admin)",
    logActionUserPasswordResetCompleted: "Password Reset Completed",
    logActionUserLoggedIn: "User Logged In",
    logActionUserLoggedOut: "User Logged Out",
    logActionCommentAdded: "Comment Added",
    logActionOrganizationUpdated: "Organization Updated",

    logDetailsProjectCreated: "Project '{{targetName}}' was created.",
    logDetailsProjectUpdated: "Project '{{targetName}}' was updated.",
    logDetailsProjectDeleted: "Project '{{targetName}}' was deleted.",
    logDetailsProjectArchived: "Project '{{targetName}}' was archived.",
    logDetailsProjectUnarchived: "Project '{{targetName}}' was unarchived.",
    logDetailsTaskCreated: "Task '{{targetName}}' was created in project '{{projectName}}'.",
    logDetailsTaskUpdated: "Task '{{targetName}}' was updated.",
    logDetailsTaskStatusChanged: "Task '{{targetName}}' status changed from '{{oldStatus}}' to '{{newStatus}}'.",
    logDetailsTaskDeleted: "Task '{{targetName}}' was deleted.",
    logDetailsUserInvited: "User '{{targetName}}' was invited by {{userName}}.",
    logDetailsUserUpdated: "User '{{targetName}}' details were updated by {{userName}}.",
    logDetailsUserPermissionsChanged: "Permissions for user '{{targetName}}' were changed by {{userName}}.",
    logDetailsUserDeleted: "User '{{targetName}}' was deleted by {{userName}}.",
    logDetailsUserActivatedByInvite: "User '{{targetName}}' activated their account via invitation.",
    logDetailsUserActivatedByAdmin: "User '{{targetName}}' account was activated by {{userName}}.",
    logDetailsUserDeactivated: "User '{{targetName}}' account was deactivated by {{userName}}.",
    logDetailsUserPasswordResetRequested: "User '{{targetName}}' requested a password reset.",
    logDetailsUserPasswordResetRequestedByAdmin: "Admin {{userName}} initiated a password reset for '{{targetName}}'.",
    logDetailsUserPasswordResetCompleted: "User '{{targetName}}' completed a password reset.",
    logDetailsUserLoggedIn: "User '{{userName}}' logged in.",
    logDetailsUserLoggedOut: "User '{{userName}}' logged out.",
    logDetailsCommentAdded: "User '{{userName}}' added a comment to task '{{targetName}}': \"{{commentSnippet}}...\"",
    logDetailsOrganizationUpdated: "Admin {{userName}} updated the organization name to '{{orgName}}'.",
    permFeatureActivityLogAccess: "View Activity Log",
    
    organizationSettings: "Organization Settings",
    editOrganizationName: "Edit Organization Name",
    save: "Save",
  },
  [Language.AR]: {
    appName: "مدير المستكشف",
    dashboard: "لوحة التحكم",
    myTasksAndTodos: "مهامي وواجباتي",
    createProject: "إنشاء مشروع جديد",
    editProject: "تعديل المشروع",
    projectName: "اسم المشروع",
    projectDescription: "الوصف",
    startDate: "تاريخ البدء",
    endDateOptional: "تاريخ الانتهاء (اختياري)",
    budgetOptional: "الميزانية (اختياري)",
    projectColor: "لون المشروع",
    cancel: "إلغاء",
    updateProjectBtn: "تحديث المشروع",
    createProjectBtn: "إنشاء مشروع",
    myProjects: "مشاريعي",
    guest: "زائر",
    notifications: "الإشعارات",
    clearAll: "مسح الكل",
    noNewNotifications: "لا توجد إشعارات جديدة.",
    languageToggleToArabic: "العربية",
    languageToggleToEnglish: "English",
    loadingOrNotFound: "جاري تحميل التفاصيل أو العنصر غير موجود...",
    deleteProjectBtn: "حذف المشروع",
    deleteTaskConfirmation: "هل أنت متأكد أنك تريد حذف هذه المهمة؟",
    deleteProjectConfirmation: "هل أنت متأكد أنك تريد حذف هذا المشروع وجميع مهامه؟ لا يمكن التراجع عن هذا الإجراء.",
    projectDetails: "تفاصيل المشروع",
    tasks: "المهام",
    addTask: "إضافة مهمة",
    editTask: "تعديل المهمة", 
    taskName: "اسم المهمة",
    taskDescriptionOptional: "الوصف (اختياري)",
    assigneeOptional: "المعين له (اختياري)",
    unassigned: "غير معين",
    dueDateOptional: "تاريخ الاستحقاق (اختياري)",
    priority: "الأولوية",
    status: "الحالة",
    updateTaskBtn: "تحديث المهمة",
    createTaskBtn: "إنشاء مهمة",
    myAssignedTasks: "المهام المعينة لي",
    noTasksAssigned: "ليس لديك مهام معينة حاليًا.",
    myPersonalTodos: "قائمة مهامي الشخصية",
    newTodo: "مهمة جديدة",
    addTodo: "إضافة مهمة",
    todoPlaceholder: "ما الذي يجب القيام به؟",
    noPersonalTodosMessage: "لا توجد مهام شخصية بعد. أضف البعض للبقاء منظمًا!",
    totalProjects: "المشاريع النشطة", 
    totalTasks: "المهام النشطة", 
    tasksInProgress: "مهام قيد التنفيذ",
    tasksCompleted: "المهام المكتملة",
    totalOverdueTasks: "المهام المتأخرة",
    resourceAllocation: "توزيع الموارد",
    activeTasksForUser: "{{count}} نشطة ({{highPriorityCount}} أولوية قصوى)",
    highPriorityShort: "أولوية قصوى",
    delete: "حذف",
    due: "تاريخ الاستحقاق",
    progress: "التقدم",
    noTasksYet: "لا توجد مهام بعد.",
    noProjectsYet: "لا توجد مشاريع نشطة بعد.",
    createOneToGetStarted: "قم بإنشاء واحد للبدء!", 
    noDescription: "لا يوجد وصف متاح.",
    startLabel: "البدء",
    endLabel: "الانتهاء",
    budgetLabel: "الميزانية",
    assigneeLabel: "المعين له",
    dueDateLabel: "تاريخ الاستحقاق",
    priorityLabel: "الأولوية",
    statusLabel: "الحالة",
    taskStatusToDo: "مهام مطلوبة",
    taskStatusInProgress: "قيد التنفيذ",
    taskStatusReview: "مراجعة",
    taskStatusDone: "مكتمل",
    taskStatusBlocked: "محظور",
    taskStatusOverdue: "متأخرة", 
    taskPriorityLow: "منخفض",
    taskPriorityMedium: "متوسط",
    taskPriorityHigh: "مرتفع",
    noTasksInProject: "لا توجد مهام في هذا المشروع بعد.",
    editTaskBtn: "تعديل",
    deleteTaskBtn: "حذف",
    closeModalAriaLabel: "إغلاق النافذة",
    unknownUser: "غير معروف",
    notAvailableShort: "N/A",
    error: "خطأ!",
    genericRequiredError: "{{fieldName}} مطلوب.",
    allRightsReserved: "كل الحقوق محفوظة.",


    archiveProjectBtn: "أرشفة المشروع",
    unarchiveProjectBtn: "إلغاء أرشفة المشروع",
    archiveProjectConfirmation: "هل أنت متأكد أنك تريد أرشفة هذا المشروع؟ سيتم إخفاء المهام أيضًا.",
    unarchiveProjectConfirmation: "هل أنت متأكد أنك تريد إلغاء أرشفة هذا المشروع؟",
    showArchivedProjects: "إظهار المؤرشفة",
    showActiveProjects: "إظهار النشطة",
    projectArchivedBadge: "مؤرشف",
    archivedProjects: "المشاريع المؤرشفة",
    noArchivedProjects: "ليس لديك مشاريع مؤرشفة.",
    projectIsArchivedNoTasks: "هذا المشروع مؤرشف. لا يتم عرض المهام للمشاريع المؤرشفة.",
    notificationProjectArchived: "تمت أرشفة المشروع \"{{name}}\".",
    notificationProjectUnarchived: "تم إلغاء أرشفة المشروع \"{{name}}\".",

    notificationProjectCreated: "تم إنشاء مشروع جديد \"{{name}}\" في {{orgName}}.",
    notificationProjectUpdated: "تم تحديث المشروع \"{{name}}\" في {{orgName}}.",
    notificationProjectDeleted: "تم حذف المشروع \"{{name}}\" من {{orgName}}.",
    notificationTaskCreated: "تمت إضافة مهمة جديدة \"{{taskName}}\" إلى المشروع \"{{projectName}}\" في {{orgName}}.",
    notificationTaskCreatedWithAssignee: "تمت إضافة مهمة جديدة \"{{taskName}}\" إلى المشروع \"{{projectName}}\" في {{orgName}}. تم تعيينها لـ {{assigneeName}}.",
    notificationTaskUpdated: "تم تحديث المهمة \"{{name}}\". الحالة: {{status}} (في {{orgName}}).",
    notificationTaskDeleted: "تم حذف المهمة \"{{name}}\" من {{orgName}}.",
    notificationUserAdded: "تمت دعوة المستخدم \"{{name}}\" إلى {{orgName}}.",
    notificationUserUpdated: "تم تحديث بيانات المستخدم \"{{name}}\" في {{orgName}}.",
    notificationUserDeleted: "تم حذف المستخدم \"{{name}}\" من {{orgName}}.",
    notificationTaskOverdue: "المهمة '{{taskName}}' في المشروع '{{projectName}}' ({{orgName}}) أصبحت متأخرة.",
    notificationTaskOverdueForUser: "المهمة '{{taskName}}' المعينة لـ {{assigneeName}} في المشروع '{{projectName}}' ({{orgName}}) أصبحت متأخرة.",
    notificationTaskOverdueUnassigned: "المهمة غير المعينة '{{taskName}}' في المشروع '{{projectName}}' ({{orgName}}) أصبحت متأخرة.",
    notificationTaskStatusChanged: "تم تغيير حالة المهمة \"{{taskName}}\" إلى {{status}} (في {{orgName}}).",
    notificationUrgentComment: "تعليق عاجل/سلبي على المهمة '{{taskName}}' في المشروع '{{projectName}}' ({{orgName}}) بواسطة {{userName}}: '{{commentTextSnippet}}'",
    notificationTaskDeadlineChanged: "تم تغيير الموعد النهائي للمهمة '{{taskName}}' في المشروع '{{projectName}}' ({{orgName}}) إلى {{newDueDate}}.",
    notificationSetPasswordInvite: "لقد تم دعوتك إلى {{orgName}}! انقر على الرابط لتعيين كلمة المرور وتفعيل حسابك (مقدم من {{appName}}).",
    notificationPasswordResetLink: "لقد طلبت إعادة تعيين كلمة المرور لحسابك في {{orgName}} (مقدم من {{appName}}). انقر على الرابط لتعيين كلمة مرور جديدة. هذا الرابط صالح لمدة 30 دقيقة.",
    notificationIdeaSaved: "تم حفظ فكرة المشروع '{{ideaName}}' لـ {{orgName}}!",
    notificationIdeaRemoved: "تمت إزالة الفكرة المحفوظة '{{ideaName}}' من {{orgName}}.",
    notificationIdeaCopied: "تم نسخ تفاصيل فكرة '{{ideaName}}' إلى الحافظة!",
    notificationRedirectingToEditTask: "جاري فتح المهمة '{{taskName}}' للتعديل في صفحة المشروع...",
    notificationRedirectingToViewComments: "جاري فتح تعليقات المهمة '{{taskName}}' في صفحة المشروع...",
    notificationUserRegistered: "مرحبًا بك في {{orgName}}، {{name}}! تم تسجيلك بنجاح.",
    notificationOrgCreated: "تم إنشاء مؤسسة جديدة '{{orgName}}' بنجاح وأنت مديرها (مقدم من {{appName}}).",
    organizationNameUpdated: "تم تحديث اسم المؤسسة بنجاح!",


    projectIdeas: "أفكار المشاريع",
    projectIdeaGeneratorTitle: "مولد أفكار المشاريع",
    projectIdeaGeneratorInputLabel: "أدخل موضوعًا أو مشكلة لتوليد أفكار لها:",
    projectIdeaGeneratorButton: "توليد الأفكار",
    projectIdeaGeneratorLoading: "جاري توليد الأفكار، يرجى الانتظار...",
    projectIdeaGeneratorNoIdeas: "لم يتم توليد أي أفكار بعد. جرب موضوعًا مختلفًا أو قم بتحسين إدخالك.",
    projectIdeaGeneratorError: "حدث خطأ أثناء توليد الأفكار. يرجى المحاولة مرة أخرى.",
    projectIdeaGeneratorPrompt: "أنت مساعد خبير في توليد أفكار المشاريع. بناءً على الموضوع أو المشكلة التالية، قم بتوليد 3 أفكار مشاريع مميزة. لكل فكرة، قدم اسمًا موجزًا، ووصفًا قصيرًا (1-2 جمل)، وقائمة من 3-5 ميزات رئيسية محتملة. إدخال المستخدم هو: \"{{userInput}}\". يرجى إرجاع الاستجابة كمصفوفة JSON صالحة، حيث يحتوي كل كائن في المصفوفة على البنية التالية: `{\"name\": \"string\", \"description\": \"string\", \"features\": [\"string\", \"string\", ...]}`. تأكد من أن JSON جيد التكوين وقابل للتحليل مباشرة.",
    ideaName: "اسم الفكرة",
    ideaDescription: "الوصف",
    ideaFeatures: "الميزات الرئيسية",
    ideaSaveButton: "حفظ الفكرة",
    ideaCopyButton: "نسخ التفاصيل",
    ideaCopiedToClipboard: "تم نسخ تفاصيل الفكرة إلى الحافظة!",
    ideaCreateProjectButton: "إنشاء مشروع",
    ideaAddTaskButton: "إضافة كمهمة",
    savedIdeasSectionTitle: "الأفكار المحفوظة",
    noSavedIdeasMessage: "لم تقم بحفظ أي أفكار بعد.",
    removeSavedIdeaButton: "إزالة",
    confirmRemoveSavedIdea: "هل أنت متأكد أنك تريد إزالة الفكرة المحفوظة '{{ideaName}}'؟",
    selectProjectForTaskModalTitle: "اختر مشروعًا للمهمة",
    selectProjectLabel: "اختر مشروع",
    addIdeaAsTaskButton: "إضافة الفكرة كمهمة",
    noActiveProjectsToAddTaskTo: "لا توجد مشاريع نشطة متاحة لإضافة هذه المهمة إليها. يرجى إنشاء مشروع أولاً.",


    userManagement: "إدارة المستخدمين",
    userManagementTitle: "إدارة المستخدمين",
    addNewUser: "إضافة مستخدم جديد",
    addUserModalTitle: "إضافة مستخدم جديد",
    editUserModalTitle: "تعديل المستخدم",
    userNameLabel: "الاسم الكامل",
    userEmailLabel: "عنوان البريد الإلكتروني",
    userEmailPlaceholder: "مثال: user@example.com",
    addUserBtn: "دعوة مستخدم", 
    updateUserBtn: "تحديث المستخدم",
    deleteUserBtn: "حذف",
    usersTableNoUsers: "لم يتم العثور على مستخدمين. أضف واحدًا للبدء!",
    usersTableNameHeader: "الاسم",
    usersTableEmailHeader: "البريد الإلكتروني",
    usersTableActionsHeader: "الإجراءات",
    usersTableRoleHeader: "الدور",
    usersTableStatusHeader: "الحالة",
    usersTablePermissionsHeader: "الأذونات",
    toGetStarted: "للبدء.",
    errorUserExists: "يوجد مستخدم بالبريد الإلكتروني '{{email}}' بالفعل.",
    deleteUserConfirmationTitle: "حذف المستخدم",
    deleteUserConfirmationMessage: "هل أنت متأكد أنك تريد حذف المستخدم '{{userName}}'؟ لا يمكن التراجع عن هذا الإجراء. ستصبح المهام المعينة لهذا المستخدم غير معينة.",
    userRoleAdmin: "مدير",
    userRoleProjectManager: "مدير مشروع",
    userRoleTeamMember: "عضو فريق",
    userRoleLabel: "الدور",
    accessDeniedTitle: "الوصول مرفوض",
    accessDeniedMessage: "ليس لديك الإذن للوصول إلى هذه الصفحة أو تنفيذ هذا الإجراء.",
    pleaseSelectARole: "-- الرجاء اختيار الدور --",
    roleRequiredError: "اختيار الدور مطلوب.",
    userStatusActive: "نشط",
    userStatusInvited: "مدعو",
    userStatusDeactivated: "معطل",
    adminResetPasswordButton: "إعادة تعيين كلمة المرور",
    adminDeactivateUserButton: "تعطيل المستخدم",
    adminActivateUserButton: "تفعيل المستخدم",
    adminResetPasswordConfirmation: "هل أنت متأكد أنك تريد إرسال رابط إعادة تعيين كلمة المرور إلى {{userName}}؟",
    adminDeactivateUserConfirmation: "هل أنت متأكد أنك تريد تعطيل حساب {{userName}}؟",
    adminActivateUserConfirmation: "هل أنت متأكد أنك تريد تفعيل حساب {{userName}}؟",
    adminPasswordResetEmailSent: "تم إرسال رابط إعادة تعيين كلمة المرور إلى {{userName}}.",
    adminPasswordResetEmailFailed: "فشل إرسال رابط إعادة تعيين كلمة المرور إلى {{userName}}.",
    permissions: "الأذونات",
    permissionPresets: "إعدادات الأذونات المسبقة",
    applyAdminPreset: "تطبيق دور المدير",
    applyPMPreset: "تطبيق دور مدير المشروع",
    applyTMPreset: "تطبيق دور عضو الفريق",
    permission_CREATE_PROJECTS: "إنشاء مشاريع",
    permission_EDIT_ALL_PROJECTS: "تعديل كل المشاريع",
    permission_DELETE_ALL_PROJECTS: "حذف كل المشاريع",
    permission_ARCHIVE_ALL_PROJECTS: "أرشفة كل المشاريع",
    permission_CREATE_TASKS: "إنشاء مهام",
    permission_EDIT_ALL_TASKS: "تعديل كل المهام",
    permission_DELETE_ALL_TASKS: "حذف كل المهام",
    permission_ASSIGN_USERS_TO_TASKS: "تعيين مستخدمين للمهام",
    permission_MANAGE_USERS: "إدارة المستخدمين (دعوة، تعديل، حذف)",
    permission_MANAGE_ORGANIZATION: "إدارة المؤسسة (تعديل الاسم)",
    permission_GENERATE_PROJECT_TIMELINE: "توليد جداول زمنية للمشاريع (AI)",
    permission_GENERATE_PROJECT_INSIGHTS: "توليد رؤى المشروع (AI)",
    permission_GENERATE_MEETING_AGENDA: "توليد جداول أعمال الاجتماعات (AI)",
    permission_VIEW_ACTIVITY_LOG: "عرض سجل النشاط",
    permission_ACCESS_DASHBOARD: "الوصول إلى لوحة التحكم",

    
    generateTimelineButton: "توليد الجدول الزمني",
    generatingTimelineLoading: "جاري توليد الجدول الزمني، يرجى الانتظار...",
    timelineGenerationError: "حدث خطأ أثناء توليد الجدول الزمني. يرجى المحاولة مرة أخرى.",
    timelineGenerationNoTimeline: "تعذر توليد جدول زمني بناءً على تفاصيل المشروع، أو لم يُرجع الذكاء الاصطناعي جدولًا زمنيًا صالحًا.",
    suggestedProjectTimelineTitle: "الجدول الزمني المقترح للمشروع (مولّد بالذكاء الاصطناعي)",
    milestoneLabel: "المرحلة الرئيسية",
    milestoneDescriptionLabel: "الوصف",
    estimatedCompletionLabel: "الإكمال المقدّر",
    deliverablesLabel: "المخرجات الرئيسية",
    projectTimelineGeneratorPrompt: "أنت مساعد خبير في تخطيط المشاريع. بناءً على تفاصيل المشروع التالية:\nالاسم: {{projectName}}\nالوصف: {{projectDescription}}\nتاريخ البدء: {{startDate}}\nتاريخ الانتهاء: {{endDate}}\nملخص المهام الحالية: {{tasksSummary}}\n\nقم بتوليد جدول زمني واقعي للمشروع. يجب أن يتضمن الجدول الزمني مراحل رئيسية (حوالي 3-5)، ووصفًا موجزًا لكل مرحلة، وتقديرًا للإكمال (على سبيل المثال، تاريخ 'YYYY-MM-DD' أو مدة مثل 'أسبوعين من البداية')، ومخرجات رئيسية (2-4) لكل مرحلة. يرجى إرجاع الاستجابة كمصفوفة JSON صالحة، حيث يمثل كل كائن في المصفوفة مرحلة رئيسية وله البنية التالية: `{\"milestone\": \"string\", \"description\": \"string\", \"estimatedCompletion\": \"string\", \"deliverables\": [\"string\", \"string\", ...]}`. تأكد من أن JSON جيد التكوين وقابل للتحليل مباشرة. إذا لم يتم توفير تاريخ انتهاء، قم بتقدير مدة معقولة للمشروع بناءً على الوصف والمهام. إذا كانت المعلومات غير كافية لإنشاء جدول زمني ذي معنى، قم بإرجاع مصفوفة JSON فارغة `[]`.",

    urgentTasksSummaryTitle: "مهام عاجلة ذات أولوية قصوى (خلال 48 ساعة)",
    noUrgentTasksMessage: "لا توجد مهام ذات أولوية قصوى مستحقة خلال الـ 48 ساعة القادمة.",
    tasksForOwnerLabel: "مهام للمالك {{ownerName}}:",
    taskInProjectLabel: "في مشروع",
    dueLabelShort: "المستحق",

    deleteTodoConfirmation: "هل أنت متأكد أنك تريد حذف هذه المهمة: \"{{todoText}}\"؟",
    thisTodo: "هذه المهمة",
    taskDependencyPromptTitle: "اكتملت المهمة '{{completedTaskName}}'!",
    taskDependencyPromptMessage: "المهمة التالية '{{nextTaskName}}' في هذا التسلسل أصبحت الآن غير محظورة.",
    taskDependencyPromptSubMessage: "هل ترغب في بدء العمل عليها الآن؟",
    taskDependencyPromptLater: "لاحقًا",
    taskDependencyPromptStart: "ابدأ المهمة التالية",

    taskCommentsTitle: "تعليقات المهمة",
    addCommentPlaceholder: "اكتب تعليقًا...",
    addCommentBtn: "إضافة تعليق",
    viewCommentsBtn: "عرض التعليقات",
    hideCommentsBtn: "إخفاء التعليقات",
    noCommentsYet: "لا توجد تعليقات حتى الآن. كن أول من يضيف تعليقًا!",
    sentimentPositive: "إيجابي",
    sentimentNegative: "سلبي",
    sentimentNeutral: "محايد",
    sentimentUnknown: "جاري التحليل...",
    commentFlaggedUrgentTooltip: "تم وضع علامة على هذا التعليق كعاجل أو يشير إلى إحباط شديد.",
    loadingComment: "جاري إضافة التعليق...",
    loadingSentiment: "جاري تحليل المشاعر...",
    errorAddingComment: "فشل في إضافة التعليق. يرجى المحاولة مرة أخرى.",
    errorAnalyzingSentiment: "فشل في تحليل المشاعر. تمت إضافة التعليق بدون تحليل.",
    geminiSentimentPrompt: "حلل مشاعر التعليق التالي لمهمة مشروع. حدد ما إذا كانت مشاعره 'Positive' أو 'Negative' أو 'Neutral'. وأشر أيضًا إذا كانت الرسالة تشير إلى إلحاح أو إحباط قوي (true/false لـ isUrgent). التعليق: \"{{commentText}}\". قم بالرد بكائن JSON بهذه البنية بالضبط: {\"sentiment\": \"Positive\"|\"Negative\"|\"Neutral\", \"isUrgent\": boolean}. لا تقم بإضافة أي markdown مثل ```json.",
    
    generateMeetingAgendaButton: "توليد جدول أعمال الاجتماع الأسبوعي",
    generatingAgendaLoading: "جاري توليد جدول الأعمال، يرجى الانتظار...",
    agendaGenerationError: "حدث خطأ أثناء توليد جدول الأعمال. يرجى المحاولة مرة أخرى.",
    agendaGenerationNoAgenda: "تعذر توليد جدول أعمال. قد يكون هذا بسبب عدم وجود مهام مفتوحة أو مشكلة في معالجة الذكاء الاصطناعي.",
    meetingAgendaTitle: "جدول أعمال الاجتماع",
    agendaDiscussionPoints: "نقاط المناقشة",
    agendaOverdueTasksReview: "مراجعة المهام المتأخرة",
    agendaBlockedTasksReview: "مراجعة المهام المعطلة",
    agendaPlanningSuggestions: "التخطيط والاقتراحات",
    geminiMeetingAgendaPrompt: "أنت مُيسِّر اجتماعات خبير. للأسبوع الحالي (المنتهي في {{currentDate}})، قم بتحليل بيانات المشروع والمهام المقدمة لإنشاء جدول أعمال اجتماع موجز وقابل للتنفيذ. ركز على حل المشكلات المفتوحة والتخطيط.\nأسماء المشاريع: {{projectNamesString}}\nبيانات المهام (مصفوفة JSON): {{taskListJsonString}}\n\nأرجع كائن JSON بهذه البنية بالضبط: `{\"agendaTitle\": \"string (مثال: مزامنة أسبوعية - أسبوع YYYY-MM-DD)\", \"discussionPoints\": [{\"point\": \"string\", \"relatedTaskIds\": [\"string\"]}] /* نقاط عامة من المهام النشطة */, \"overdueTasksReview\": [{\"taskName\": \"string\", \"assigneeName\": \"string\", \"dueDate\": \"string\", \"relatedTaskIds\": [\"string\"]}] /* قائمة بالمهام المتأخرة */, \"blockedTasksReview\": [{\"taskName\": \"string\", \"assigneeName\": \"string\", \"blockedByTaskName\": \"string?\", \"relatedTaskIds\": [\"string\"]}] /* قائمة بالمهام المعطلة */, \"planningSuggestions\": [\"string\"] /* اقتراحات للخطوات التالية أو مجالات التركيز */}`.\nأعط الأولوية للمهام التي حالتها 'قيد التنفيذ'، 'متأخرة'، 'معطلة'، أو 'مهام مطلوبة ذات الأولوية عالية'. بالنسبة لـ 'discussionPoints'، اختر بعض المهام أو الموضوعات النشطة الرئيسية. تأكد من أن JSON جيد التكوين وقابل للتحليل مباشرة. إذا لم تكن هناك مهام مهمة تتطلب مناقشة، اقترح اجتماع تحقق موجز أو تخطي الاجتماع في 'planningSuggestions'.",
    agendaNoTasksToDiscuss: "لا توجد مهام محددة للمناقشة بناءً على البيانات الحالية.",
    agendaTaskName: "المهمة",
    agendaAssignee: "المُعيّن له",
    agendaDueDate: "تاريخ الاستحقاق",
    agendaBlockedBy: "معطلة بسبب",

    generateInsightsButton: "توليد رؤى المشروع",
    aiInsightsPanelTitle: "رؤى المشروع (AI)",
    generatingInsightsLoading: "جاري توليد الرؤى، يرجى الانتظار...",
    insightsGenerationError: "حدث خطأ أثناء توليد الرؤى. يرجى المحاولة مرة أخرى.",
    insightsGenerationNoInsights: "لم يتم توليد رؤى محددة في هذا الوقت.",
    geminiInsightsPrompt: "أنت خبير تحليل مشاريع بالذكاء الاصطناعي. قم بتحليل بيانات المشروع التالية:\nالمشاريع النشطة (JSON): {{projectsJson}}\nجميع مهام المشاريع النشطة (JSON): {{tasksJson}}\nالمستخدمون (JSON): {{usersJson}}\n\nحدد الاتجاهات الرئيسية، والاختناقات المحتملة (مثل المشاريع التي بها العديد من المهام المتأخرة، والمهام العالقة في حالة معينة، والمستخدمين الذين لديهم عدد كبير من المهام المتأخرة)، ومخاوف تخصيص الموارد (مثل المستخدمين المثقلين بالأعباء)، وأنماط أداء الفريق/المستخدم الملحوظة (مثل المستخدمين الذين يلتزمون بالمواعيد النهائية باستمرار - استنتج من انخفاض عدد المهام المتأخرة، والمستخدمين الذين يفوتون المواعيد النهائية باستمرار - استنتج من ارتفاع عدد المهام المتأخرة). سلط الضوء أيضًا على أي اتجاهات أو نجاحات إيجابية. قدم ما يصل إلى 5-7 رؤى مميزة. لكل رؤية، حدد نوعها، ووصفًا موجزًا، واختياريًا، معرفات المشاريع أو المهام أو المستخدمين ذوي الصلة.\nيمكن أن تكون أنواع الرؤى: 'bottleneck' (اختناق)، 'performance_high' (أداء مرتفع)، 'performance_low' (أداء منخفض)، 'trend' (اتجاه)، 'resource_concern' (قلق بشأن الموارد)، 'positive_highlight' (تسليط الضوء على الإيجابيات).\nأرجع كائن JSON: `{\"insights\": [{\"type\": \"string\", \"description\": \"string\", \"relatedProjectIds\": [\"string\"], \"relatedTaskIds\": [\"string\"], \"relatedUserIds\": [\"string\"]}]}`. تأكد من أن JSON جيد التكوين وقابل للتحليل مباشرة.",
    insightTypeBottleneck: "اختناق",
    insightTypePerformanceHigh: "أداء مرتفع",
    insightTypePerformanceLow: "أداء منخفض",
    insightTypeTrend: "اتجاه",
    insightTypeResourceConcern: "قلق بشأن الموارد",
    insightTypePositiveHighlight: "تسليط الضوء على الإيجابيات",
    viewProjectLink: "عرض المشروع",
    viewTaskLink: "عرض المهمة",
    viewUserLink: "عرض المستخدم", 
    relatedProjects: "المشاريع ذات الصلة",
    relatedTasks: "المهام ذات الصلة", 
    relatedUsers: "المستخدمون ذوو الصلة",
    totalUsersStatCard: "إجمالي المستخدمين",

    quickAddTaskButton: "إضافة سريعة لمهمة",
    quickAddTaskModalTitle: "إضافة سريعة لمهمة جديدة",
    quickAddTaskInputLabel: "صف المهمة بإيجاز (سيساعد الذكاء الاصطناعي في ملء التفاصيل):",
    quickAddTaskGetSuggestionsButton: "الحصول على اقتراحات الذكاء الاصطناعي",
    quickAddTaskError: "فشل في الحصول على اقتراحات الذكاء الاصطناعي. يرجى المحاولة مرة أخرى أو الإضافة يدويًا.",
    geminiQuickTaskPrompt: "أنت مساعد تساعد في إضافة مهمة بسرعة إلى مشروع.\nإدخال المستخدم الخام للمهمة: \"{{userInput}}\"\nاسم المشروع الحالي: \"{{projectName}}\"\nالمهام الحالية في هذا المشروع (الاسم، الأولوية، معرّف المُعيّن له):\n{{existingTasksJson}}\nالمستخدمون المتاحون في المشروع (المعرّف، الاسم):\n{{usersJson}}\n\nبناءً على هذا، اقترح ما يلي للمهمة الجديدة:\n1. `name`: اسم مهمة موجز وواضح (سلسلة نصية).\n2. `description`: توضيح موجز اختياري (سلسلة نصية، أو null).\n3. `priority`: 'Low' أو 'Medium' أو 'High' (سلسلة نصية).\n4. `assigneeId`: معرّف المستخدم الأنسب من قائمة المستخدمين المتاحين، أو null إذا لم تكن متأكدًا أو إذا كان يجب أن تكون غير معيّنة (سلسلة نصية أو null).\n5. `dueDateSuggestion`: اقتراح *نصي* لموعد استحقاق هذه المهمة (على سبيل المثال، 'اليوم'، 'غدًا'، 'في 3 أيام'، 'الجمعة القادمة'، أو null إذا لم يكن بالإمكان استنتاجه من الإدخال). لا تُرجع تاريخًا بتنسيق YYYY-MM-DD هنا.\n\nأرجع كائن JSON واحدًا بالمفاتيح: \"name\", \"description\", \"priority\", \"assigneeId\", \"dueDateSuggestion\". تأكد من صلاحية JSON. مثال للاستجابة: `{\"name\": \"إنهاء تقرير العميل X\", \"description\": \"تجميع جميع الأقسام وإجراء مراجعة نهائية للتقرير الخاص بالعميل X.\", \"priority\": \"High\", \"assigneeId\": \"user1\", \"dueDateSuggestion\": \"في يومين\"}`",
    aiSuggestedDueDate: "يقترح الذكاء الاصطناعي الاستحقاق: {{suggestion}}",

    timelineViewTab: "الجدول الزمني",
    timelineViewTitle: "الجدول الزمني لمهام المشروع",
    taskStartDate: "البدء",
    taskDependsOn: "تعتمد على",
    noTasksForTimeline: "لا توجد مهام ذات تواريخ لعرضها على الجدول الزمني.",
    
    loginPageTitle: "تسجيل الدخول إلى مدير المستكشف",
    emailLabel: "البريد الإلكتروني",
    passwordLabel: "كلمة المرور",
    loginButton: "تسجيل الدخول",
    loginFailedError: "البريد الإلكتروني أو كلمة المرور غير صالحة. يرجى المحاولة مرة أخرى.",
    loggingInStatus: "جاري تسجيل الدخول...",
    logoutButton: "تسجيل الخروج",
    emailRequiredError: "البريد الإلكتروني مطلوب.",
    emailInvalidError: "يرجى إدخال عنوان بريد إلكتروني صالح.",
    passwordRequiredError: "كلمة المرور مطلوبة.",
    redirectToDashboard: "جاري التوجيه إلى لوحة التحكم...",
    welcomeBack: "مرحبًا بعودتك، {{name}}!",
    loginUserInvitedPrompt: "حسابك في انتظار إعداد كلمة المرور. يرجى التحقق من بريدك الإلكتروني للحصول على رابط دعوة لتعيين كلمة المرور الخاصة بك.",
    loginUserDeactivatedPrompt: "تم تعطيل حسابك. يرجى الاتصال بالمسؤول.",

    userProfilePageTitle: "ملفي الشخصي",
    editProfileButton: "تعديل الملف الشخصي",
    userStatsTitle: "إحصائياتي",
    projectsOwnedStat: "المشاريع المملوكة",
    tasksAssignedStat: "المهام المعينة",
    tasksCompletedStat: "المهام المكتملة",
    tasksInProgressStat: "المهام قيد التنفيذ",
    myProfileProjectsSectionTitle: "مشاريعي",
    myProfileTasksSectionTitle: "مهامي",
    editProfileModalTitle: "تعديل ملفي الشخصي",
    updateProfileButton: "تحديث الملف الشخصي",
    profileUpdatedSuccessfully: "تم تحديث الملف الشخصي بنجاح!",
    sidebarMyProfile: "ملفي الشخصي",
    myProfileActivityTitle: "النشاط الأخير",
    myProfileNoActivity: "لا يوجد نشاط حديث لعرضه.",
    userProfileOrganizationLabel: "المؤسسة",
    userProfileRoleLabel: "الدور",

    tourStartButton: "بدء الجولة",
    tourNextButton: "التالي",
    tourPreviousButton: "السابق",
    tourFinishButton: "إنهاء الجولة",
    tourStepProgress: "الخطوة {{currentStep}} من {{totalSteps}}",
    tourWelcomeTitle: "مرحبًا بك في مدير المستكشف!",
    tourWelcomeMessage: "دعنا نأخذ جولة سريعة لتعريفك بالمكان. يساعدك هذا التطبيق في إدارة المشاريع والمهام وحتى توليد أفكار جديدة بمساعدة الذكاء الاصطناعي!",
    tourDashboardTitle: "لوحة التحكم الخاصة بك",
    tourDashboardMessage: "هذا هو مركزك الرئيسي. سترى هنا نظرة عامة على مشاريعك ومهامك العاجلة وبعض الإحصائيات السريعة. يمكنك إنشاء مشاريع جديدة من هنا.",
    tourCreateProjectTitle: "إنشاء مشروع",
    tourCreateProjectMessage: "انقر فوق زر 'إنشاء مشروع' في لوحة التحكم لبدء مشروع جديد. أدخل اسمًا ووصفًا واختر لونًا لتنظيمه.",
    tourAddTaskTitle: "إضافة مهام إلى مشروع",
    tourAddTaskMessage: "داخل المشروع، يمكنك إضافة مهام. قم بتعيينها وتحديد تواريخ الاستحقاق والأولويات والأوصاف. يمكنك حتى استخدام ميزة 'الإضافة السريعة للمهام' بالذكاء الاصطناعي لإدخال أسرع!",
    tourMyTasksTitle: "مهامي وواجباتي",
    tourMyTasksMessage: "تعرض صفحة 'مهامي وواجباتي' في الشريط الجانبي جميع المهام المعينة لك عبر المشاريع، بالإضافة إلى قائمة مهامك الشخصية.",
    tourAIFeaturesTitle: "ميزات مدعومة بالذكاء الاصطناعي",
    tourAIFeaturesMessage: "استكشف ميزات الذكاء الاصطناعي مثل مولد أفكار المشاريع، واقتراحات الجدول الزمني للمشروع، وجداول أعمال الاجتماعات بالذكاء الاصطناعي، وتحليل المشاعر في تعليقات المهام!",
    tourGuidelinesTitle: "هل تحتاج إلى مزيد من المعلومات؟",
    tourGuidelinesMessage: "للحصول على معلومات مفصلة، راجع صفحة 'الإرشادات' التي يمكن الوصول إليها من الشريط الجانبي. يمكنك أيضًا إعادة هذه الجولة في أي وقت من زر 'المساعدة والجولة'.",
    tourCompletedMessage: "اكتملت الجولة! أنت الآن جاهز للاستكشاف.",
    sidebarHelpAndTour: "المساعدة والجولة",

    guidelinesPageTitle: "إرشادات التطبيق",
    guidelinesIntroTitle: "مرحبًا بك في مدير المستكشف!",
    guidelinesIntroMessage: "سيساعدك هذا الدليل على فهم ميزات مدير المستكشف وكيفية استخدامها بفعالية.",
    guidelinesProjectsTitle: "إدارة المشاريع",
    guidelinesProjectsContentP1: "المشاريع هي جوهر عملك. يمكنك إنشاء مشاريع من لوحة التحكم، مع إعطائها اسمًا ووصفًا وتواريخ بدء/انتهاء ولونًا للتنظيم البصري. لكل مشروع صفحة تفاصيل خاصة به حيث تدير مهامه.",
    guidelinesProjectsContentP2: "قم بأرشفة المشاريع المكتملة أو المعلقة للحفاظ على قائمة مشاريعك النشطة نظيفة. يمكنك عرضها وإلغاء أرشفتها من لوحة التحكم.",
    guidelinesTasksTitle: "إدارة المهام",
    guidelinesTasksContentP1: "داخل كل مشروع، يمكنك إنشاء مهام. يمكن أن يكون لكل مهمة اسم ووصف وشخص مُعيّن وتاريخ استحقاق وأولوية (منخفضة، متوسطة، عالية) وحالة (مهام مطلوبة، قيد التنفيذ، مراجعة، مكتملة، محظورة، متأخرة).",
    guidelinesTasksContentP2: "يمكنك تعيين تبعيات بين المهام. لا يمكن بدء مهمة إذا لم يتم تمييز مهمتها الأساسية بأنها 'مكتملة'. استخدم التعليقات لمناقشة المهام مع فريقك.",
    guidelinesTodosTitle: "المهام الشخصية",
    guidelinesTodosContent: "استخدم صفحة 'مهامي وواجباتي' لإدارة قائمة مهامك الشخصية. هذه منفصلة عن مهام المشروع وهي فقط لتنظيمك الشخصي.",
    guidelinesAIFeaturesTitle: "الميزات المدعومة بالذكاء الاصطناعي",
    guidelinesAIFeaturesContentP1: "مولد أفكار المشاريع: هل أنت عالق في الأفكار؟ استخدم صفحة 'أفكار المشاريع' للحصول على اقتراحات مولدة بالذكاء الاصطناعي بناءً على موضوع تقدمه.",
    guidelinesAIFeaturesContentP2: "الجدول الزمني للمشروع والمعالم الرئيسية: في صفحة تفاصيل المشروع، انقر فوق 'توليد الجدول الزمني' للحصول على اقتراحات الذكاء الاصطناعي للمعالم الرئيسية وتقديرات إكمالها.",
    guidelinesAIFeaturesContentP3: "مشاعر تعليقات المهام: عند إضافة تعليق إلى مهمة، يحلل الذكاء الاصطناعي مشاعره (إيجابي، سلبي، محايد) ويضع علامة على التعليقات العاجلة. الإضافة السريعة للمهام: استخدم زر 'الإضافة السريعة للمهام' في صفحة المشروع لوصف مهمة بلغة طبيعية، وسيساعد الذكاء الاصطناعي في هيكلتها. جدول أعمال الاجتماع: قم بتوليد جدول أعمال الاجتماع من لوحة التحكم بناءً على المهام النشطة.",
    guidelinesUserManagementTitle: "إدارة المستخدمين",
    guidelinesUserManagementContent: "تتيح لك صفحة 'إدارة المستخدمين' إضافة وتعديل وحذف المستخدمين من النظام. يمكن للمستخدمين الجدد بعد ذلك تسجيل الدخول وتعيينهم للمهام.",
    guidelinesUserProfileTitle: "ملفي الشخصي",
    guidelinesUserProfileContent: "قم بالوصول إلى ملفك الشخصي عبر الشريط الجانبي لعرض التفاصيل الخاصة بك، وإحصائيات حول مشاريعك ومهامك، وتعديل اسمك.",
    guidelinesTipsTitle: "نصائح للاستخدام الفعال",
    guidelinesTipsContentLi1: "حافظ على تحديث حالات المهام بانتظام.",
    guidelinesTipsContentLi2: "استخدم التعليقات للتواصل ضمن المهام.",
    guidelinesTipsContentLi3: "حدد تواريخ استحقاق وأولويات واقعية.",
    guidelinesTipsContentLi4: "راجع صفحة 'مهامي وواجباتي' بانتظام للبقاء على اطلاع دائم بعملك.",
    
    permissionsOverviewTitle: "نظرة عامة على الأذونات",
    permissionsFeature: "الميزة / الإجراء",
    permissionsAdmin: "المدير",
    permissionsProjectManager: "مدير المشروع",
    permissionsTeamMember: "عضو الفريق",
    permissionFullAccess: "✓ (كامل)",
    permissionOwnOnly: "الخاصة فقط",
    permissionAssignedOnly: "المعينة فقط",
    permissionNoAccess: "✗ (لا يوجد)",
    permissionAdminOnly: "المدير فقط",
    permissionViewOnly: "عرض فقط",
    permFeatureProjectsCreate: "إنشاء المشاريع",
    permFeatureProjectsViewAll: "عرض جميع المشاريع",
    permFeatureProjectsEdit: "تعديل المشاريع",
    permFeatureProjectsDelete: "حذف المشاريع",
    permFeatureProjectsArchive: "أرشفة/إلغاء أرشفة المشاريع",
    permFeatureProjectsGenerateTimeline: "توليد الجدول الزمني للمشروع (AI)",
    permFeatureProjectsGenerateInsights: "توليد رؤى المشروع (AI - لوحة التحكم)",
    permFeatureTasksCreate: "إنشاء المهام (في المشاريع القابلة للإدارة)",
    permFeatureTasksView: "عرض المهام (في المشاريع التي يمكن الوصول إليها)",
    permFeatureTasksEdit: "تعديل المهام",
    permFeatureTasksDelete: "حذف المهام",
    permFeatureTasksAssignUsers: "تعيين مستخدمين للمهام",
    permFeatureTasksUpdateStatus: "تحديث حالة المهمة",
    permFeatureTasksComments: "إضافة/عرض تعليقات المهام",
    permFeatureTasksQuickAdd: "إضافة سريعة للمهام (AI)",
    permFeatureTodosCRUD: "إدارة المهام الشخصية الخاصة",
    permFeatureUserManagementAccess: "الوصول إلى صفحة إدارة المستخدمين",
    permFeatureUserManagementAdd: "إضافة مستخدمين جدد",
    permFeatureUserManagementEdit: "تعديل المستخدمين (بما في ذلك الأدوار)",
    permFeatureUserManagementDelete: "حذف المستخدمين",
    permFeatureAIGenerateIdeas: "توليد أفكار المشاريع (AI)",
    permFeatureAIGenerateAgenda: "توليد جدول أعمال الاجتماع (AI - لوحة التحكم)",
    permFeatureProfileViewEdit: "عرض وتعديل الملف الشخصي الخاص",
    permFeatureSystemGuidelines: "عرض صفحة الإرشادات",
    permFeatureSystemTour: "استخدام الجولة الإرشادية",
    permFeatureSystemLanguage: "تغيير اللغة",
    permFeatureSidebarPermissionsLink: "نظرة عامة على الأذونات",
    permFeatureDashboardAccess: "الوصول إلى لوحة التحكم",

    collapseSidebar: "طي الشريط الجانبي",
    expandSidebar: "توسيع الشريط الجانبي",
    
    searchPlaceholder: "بحث...",
    searchToggleOpenAriaLabel: "فتح شريط البحث",
    searchToggleCloseAriaLabel: "إغلاق شريط البحث",

    registrationPageTitle: "تسجيل حساب جديد",
    joinOrganizationOption: "الانضمام إلى مؤسسة قائمة",
    createOrganizationOption: "إنشاء مؤسسة جديدة",
    fullNameLabel: "الاسم الكامل",
    confirmPasswordLabel: "تأكيد كلمة المرور",
    inviteCodeLabel: "رمز دعوة المنظمة",
    organizationNameLabel: "اسم المنظمة الجديدة",
    registerButton: "تسجيل",
    registrationSuccessMessage: "تم التسجيل بنجاح! جاري التوجيه...",
    passwordMismatchError: "كلمات المرور غير متطابقة.",
    inviteCodeInvalidError: "رمز الدعوة غير صالح. يرجى التحقق والمحاولة مرة أخرى.",
    organizationNameRequiredError: "اسم المنظمة مطلوب.",
    emailAlreadyExistsError: "يوجد حساب بهذا البريد الإلكتروني بالفعل.",
    registrationFailedError: "فشل التسجيل. يرجى المحاولة مرة أخرى.",
    switchToLoginLink: "هل لديك حساب بالفعل؟ تسجيل الدخول",
    creatingOrganizationStatus: "جاري إنشاء المؤسسة...",
    joiningOrganizationStatus: "جاري الانضمام إلى المؤسسة...",

    setPasswordPageTitle: "قم بتعيين كلمة المرور الخاصة بك",
    setPasswordInstructions: "مرحبًا بك! يرجى تعيين كلمة مرور لحسابك ({{email}}).",
    newPasswordLabel: "كلمة المرور الجديدة",
    confirmNewPasswordLabel: "تأكيد كلمة المرور الجديدة", 
    setPasswordButton: "تعيين كلمة المرور وتفعيل الحساب",
    passwordSetSuccessMessage: "تم تعيين كلمة المرور بنجاح! جاري التوجيه لتسجيل الدخول...",
    invalidInvitationLinkError: "رابط الدعوة هذا غير صالح أو انتهت صلاحيته. يرجى طلب دعوة جديدة أو الاتصال بالدعم.",
    setPasswordFailedError: "فشل تعيين كلمة المرور. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.",
    passwordsDoNotMatchError: "كلمات المرور غير متطابقة. يرجى إعادة الإدخال.",
    passwordPolicyError: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وأن تحتوي على حرف كبير واحد ورقم واحد ورمز واحد.", 

    forgotPasswordLink: "هل نسيت كلمة المرور؟",
    requestPasswordResetPageTitle: "طلب إعادة تعيين كلمة المرور",
    requestPasswordResetInstruction: "أدخل عنوان بريدك الإلكتروني أدناه لتلقي رابط إعادة تعيين كلمة المرور.",
    sendResetLinkButton: "إرسال رابط إعادة التعيين",
    resetLinkSentMessage: "إذا كان هناك حساب بالبريد الإلكتروني {{email}}، فقد تم إرسال رابط إعادة تعيين كلمة المرور. يرجى التحقق من صندوق الوارد الخاص بك (ومجلد الرسائل غير المرغوب فيها).",
    failedToSendResetLinkMessage: "فشل إرسال رابط إعادة التعيين. يرجى المحاولة مرة أخرى لاحقًا.",
    resetPasswordPageTitle: "إعادة تعيين كلمة المرور الخاصة بك",
    resetPasswordInstruction: "يرجى إدخال كلمة المرور الجديدة أدناه.",
    updatePasswordButton: "تحديث كلمة المرور",
    passwordResetSuccessMessage: "تمت إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.",
    invalidOrExpiredResetLinkError: "رابط إعادة تعيين كلمة المرور غير صالح أو انتهت صلاحيته. يرجى طلب رابط جديد.",
    failedToResetPasswordError: "فشل في إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.",

    dashboardUserManagementCardTitle: "إدارة المستخدمين",
    dashboardUserManagementCardDesc: "إضافة، تعديل، أو إزالة المستخدمين وإدارة أدوارهم داخل المنظمة.",
    dashboardUserManagementCardButton: "إدارة المستخدمين",
    allOrganizationProjectsTitle: "جميع مشاريع المنظمة",

    activityLogPageTitle: "سجل النشاطات",
    activityLogTableTimestampHeader: "الوقت",
    activityLogTableUserHeader: "المستخدم",
    activityLogTableActionHeader: "الإجراء",
    activityLogTableDetailsHeader: "التفاصيل",
    activityLogNoLogs: "لا توجد سجلات نشاط لهذه المنظمة.",
    logActionProjectCreated: "إنشاء مشروع",
    logActionProjectUpdated: "تحديث مشروع",
    logActionProjectDeleted: "حذف مشروع",
    logActionProjectArchived: "أرشفة مشروع",
    logActionProjectUnarchived: "إلغاء أرشفة مشروع",
    logActionTaskCreated: "إنشاء مهمة",
    logActionTaskUpdated: "تحديث مهمة",
    logActionTaskStatusChanged: "تغيير حالة المهمة",
    logActionTaskDeleted: "حذف مهمة",
    logActionUserInvited: "دعوة مستخدم",
    logActionUserUpdated: "تحديث مستخدم",
    logActionUserPermissionsChanged: "تغيير أذونات المستخدم",
    logActionUserDeleted: "حذف مستخدم",
    logActionUserActivatedByInvite: "تفعيل المستخدم (دعوة)",
    logActionUserActivatedByAdmin: "تفعيل المستخدم (مسؤول)",
    logActionUserDeactivated: "تعطيل المستخدم",
    logActionUserPasswordResetRequested: "طلب إعادة تعيين كلمة المرور",
    logActionUserPasswordResetRequestedByAdmin: "إعادة تعيين كلمة المرور (مسؤول)",
    logActionUserPasswordResetCompleted: "إكمال إعادة تعيين كلمة المرور",
    logActionUserLoggedIn: "تسجيل دخول المستخدم",
    logActionUserLoggedOut: "تسجيل خروج المستخدم",
    logActionCommentAdded: "إضافة تعليق",
    logActionOrganizationUpdated: "تحديث المنظمة",

    logDetailsProjectCreated: "تم إنشاء المشروع '{{targetName}}'.",
    logDetailsProjectUpdated: "تم تحديث المشروع '{{targetName}}'.",
    logDetailsProjectDeleted: "تم حذف المشروع '{{targetName}}'.",
    logDetailsProjectArchived: "تمت أرشفة المشروع '{{targetName}}'.",
    logDetailsProjectUnarchived: "تم إلغاء أرشفة المشروع '{{targetName}}'.",
    logDetailsTaskCreated: "تم إنشاء المهمة '{{targetName}}' في المشروع '{{projectName}}'.",
    logDetailsTaskUpdated: "تم تحديث المهمة '{{targetName}}'.",
    logDetailsTaskStatusChanged: "تم تغيير حالة المهمة '{{targetName}}' من '{{oldStatus}}' إلى '{{newStatus}}'.",
    logDetailsTaskDeleted: "تم حذف المهمة '{{targetName}}'.",
    logDetailsUserInvited: "تمت دعوة المستخدم '{{targetName}}' بواسطة {{userName}}.",
    logDetailsUserUpdated: "تم تحديث تفاصيل المستخدم '{{targetName}}' بواسطة {{userName}}.",
    logDetailsUserPermissionsChanged: "تم تغيير أذونات المستخدم '{{targetName}}' بواسطة {{userName}}.",
    logDetailsUserDeleted: "تم حذف المستخدم '{{targetName}}' بواسطة {{userName}}.",
    logDetailsUserActivatedByInvite: "قام المستخدم '{{targetName}}' بتفعيل حسابه عبر الدعوة.",
    logDetailsUserActivatedByAdmin: "تم تفعيل حساب المستخدم '{{targetName}}' بواسطة {{userName}}.",
    logDetailsUserDeactivated: "تم تعطيل حساب المستخدم '{{targetName}}' بواسطة {{userName}}.",
    logDetailsUserPasswordResetRequested: "طلب المستخدم '{{targetName}}' إعادة تعيين كلمة المرور.",
    logDetailsUserPasswordResetRequestedByAdmin: "بدأ المسؤول {{userName}} إعادة تعيين كلمة مرور لـ '{{targetName}}'.",
    logDetailsUserPasswordResetCompleted: "أكمل المستخدم '{{targetName}}' إعادة تعيين كلمة المرور.",
    logDetailsUserLoggedIn: "قام المستخدم '{{userName}}' بتسجيل الدخول.",
    logDetailsUserLoggedOut: "قام المستخدم '{{userName}}' بتسجيل الخروج.",
    logDetailsCommentAdded: "أضاف المستخدم '{{userName}}' تعليقًا على المهمة '{{targetName}}': \"{{commentSnippet}}...\"",
    logDetailsOrganizationUpdated: "قام المسؤول {{userName}} بتحديث اسم المنظمة إلى '{{orgName}}'.",
    permFeatureActivityLogAccess: "عرض سجل النشاطات",
    
    organizationSettings: "إعدادات المنظمة",
    editOrganizationName: "تعديل اسم المنظمة",
    save: "حفظ",
  },
};

export type LocaleKey = keyof TranslationKeys;