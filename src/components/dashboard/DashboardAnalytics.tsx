
import React from 'react';
import { Project, Task, TaskStatus, User } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';

interface DashboardAnalyticsProps {
  projects: Project[]; 
  tasks: Task[]; 
  users: User[];
}

const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
const HourglassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662s.046 2.453.138 3.662m19.224-7.324a48.614 48.614 0 00-18.5 0m18.5 0a48.614 48.614 0 01-18.5 0M12 4.635v14.73A5.25 5.25 0 0012 21.75a5.25 5.25 0 000-2.385V4.635z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserGroupIconAnalytics: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-5.853M12 12.75H3m9 0h9M12 12.75a3 3 0 11-6 0 3 3 0 016 0zM12 12.75V3m0 9.75a3 3 0 000 6A3 3 0 0012 12.75zm0 0h-.008v.008H12v-.008zm0 0H12.008v.008H12v-.008z" /></svg>;

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; colorClass: string }> = ({ title, value, icon, colorClass }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full ${colorClass} text-white mr-4 rtl:mr-0 rtl:ml-4`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ projects, tasks, users }) => {
  const { t } = useTranslations();
  
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const tasksInProgress = tasks.filter(task => 
    task.status === TaskStatus.InProgress || 
    task.status === TaskStatus.Review || 
    task.status === TaskStatus.Blocked ||
    task.status === TaskStatus.Overdue
  ).length;
  const tasksDone = tasks.filter(task => task.status === TaskStatus.Done).length;
  const totalUsersInOrg = users.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      <StatCard 
        title={t('totalProjects')}
        value={totalProjects} 
        icon={<FolderIcon />} 
        colorClass="bg-blue-500"
      />
      <StatCard 
        title={t('totalTasks')}
        value={totalTasks} 
        icon={<ListIcon />}
        colorClass="bg-indigo-500"
      />
      <StatCard 
        title={t('tasksInProgress')}
        value={tasksInProgress} 
        icon={<HourglassIcon />}
        colorClass="bg-yellow-500"
      />
      <StatCard 
        title={t('tasksCompleted')}
        value={tasksDone} 
        icon={<CheckCircleIcon />}
        colorClass="bg-green-500"
      />
      <StatCard 
        title={t('totalUsersStatCard')}
        value={totalUsersInOrg} 
        icon={<UserGroupIconAnalytics />}
        colorClass="bg-purple-500"
      />
    </div>
  );
};

export default DashboardAnalytics;
