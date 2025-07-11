
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslations } from '../../hooks/useTranslations';
import { useAppContext } from '../../contexts/AppContext';
import Button from './ui/Button';
import { Language, Permission } from '../../types'; // Import Language and Permission

// Icons
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
const TasksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LightbulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.355A12.053 12.053 0 0112 21.75c-2.672 0-5.182-.877-7.142-2.472M12 3V1.5M12 3c-.312 0-.624.016-.932.047M12 3c.312 0 .624.016.932.047M12 6.75A2.25 2.25 0 009.75 9H7.5a5.25 5.25 0 004.5 5.25m0-5.25A2.25 2.25 0 0114.25 9h2.25a5.25 5.25 0 01-4.5 5.25m0-5.25V6.75M5.106 5.106c.307-.308.633-.578.977-.812M18.894 5.106c-.307-.308-.633-.578-.977-.812M5.106 18.894c.308.307.578.633.812.977M18.894 18.894c-.308.307-.578.633-.812.977" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.071M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const QuestionMarkCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>;

const ChevronDoubleLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" /></svg>;
const ChevronDoubleRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>;

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const { t, currentLanguage } = useTranslations();
  const { startTour, currentUser } = useAppContext();

  const navItems = [
    ...(currentUser?.permissions[Permission.ACCESS_DASHBOARD] ? [{ path: '/', labelKey: 'dashboard' as const, icon: <DashboardIcon /> }] : []),
    { path: '/my-tasks', labelKey: 'myTasksAndTodos' as const, icon: <TasksIcon /> },
    { path: '/project-ideas', labelKey: 'projectIdeas' as const, icon: <LightbulbIcon /> },
    ...(currentUser?.permissions[Permission.MANAGE_USERS] ? [{ path: '/user-management', labelKey: 'userManagement' as const, icon: <UserGroupIcon /> }] : []),
    { path: '/profile', labelKey: 'sidebarMyProfile' as const, icon: <UserCircleIcon /> },
    { path: '/guidelines', labelKey: 'guidelinesPageTitle' as const, icon: <BookOpenIcon /> },
  ];

  let CollapseIcon = ChevronDoubleLeftIcon;
  let ExpandIcon = ChevronDoubleRightIcon;
  if (currentLanguage === Language.AR) {
      CollapseIcon = ChevronDoubleRightIcon;
      ExpandIcon = ChevronDoubleLeftIcon;
  }

  return (
    <aside 
      className={`bg-secondary text-white flex flex-col fixed top-0 h-full z-10 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} start-0`}
      aria-expanded={!isCollapsed}
    >
      <div className={`h-16 flex items-center shadow-md transition-all duration-300 ease-in-out ${isCollapsed ? 'justify-center px-2' : 'justify-center px-4'}`}>
        <Link to="/" className={`block hover:opacity-90 transition-opacity ${isCollapsed ? 'mx-auto' : ''}`} aria-label={t('appName')}>
          <img
            src="https://i.ibb.co/F4Hg9gWh/ALMSTKSHF-MANAGER-APP-FROM-ALMSTKSHF-FOR-MEDIA-MONITORING.jpg"
            alt={t('appName')}
            className={`w-auto transition-all duration-300 ease-in-out ${isCollapsed ? 'h-8' : 'h-12'}`}
          />
        </Link>
      </div>
      <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            title={isCollapsed ? t(item.labelKey) : undefined}
            className={`flex items-center py-2.5 rounded-md text-sm font-medium transition-colors group
                        ${isCollapsed ? 'justify-center px-2' : 'px-3 space-x-3 rtl:space-x-reverse'}
                        ${location.pathname === item.path
                          ? 'bg-primary text-white'
                          : 'text-gray-300 hover:bg-blue-700 hover:text-white'
                        }`}
            aria-current={location.pathname === item.path ? 'page' : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 sr-only' : 'opacity-100'}`}>{t(item.labelKey)}</span>
          </Link>
        ))}
      </nav>
      
      <div className={`border-t border-blue-700 transition-all duration-300 ease-in-out ${isCollapsed ? 'px-1 py-4' : 'p-4'}`}>
        <Button
            onClick={startTour}
            variant="ghost"
            className={`w-full text-gray-300 hover:bg-blue-700 hover:text-white ${isCollapsed ? 'justify-center px-0' : ''}`}
            title={t('sidebarHelpAndTour')}
        >
            <QuestionMarkCircleIcon/>
            {!isCollapsed && <span className="ms-2">{t('sidebarHelpAndTour')}</span>}
        </Button>
      </div>

      <div className={`px-2 pt-2 pb-2 border-t border-blue-700 transition-all duration-300 ease-in-out ${isCollapsed ? 'flex justify-center' : ''}`}>
        <Button
            onClick={toggleSidebar}
            variant="ghost"
            className={`w-full text-gray-300 hover:bg-blue-700 hover:text-white ${isCollapsed ? 'p-2 justify-center' : 'py-2.5'}`}
            aria-label={isCollapsed ? t('expandSidebar') : t('collapseSidebar')}
            title={isCollapsed ? t('expandSidebar') : t('collapseSidebar')}
        >
            {isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
            {!isCollapsed && <span className="ms-2">{t('collapseSidebar')}</span>}
        </Button>
      </div>

      <div className={`p-4 text-xs text-gray-400 text-center transition-opacity duration-200 ${isCollapsed ? 'opacity-0 sr-only' : 'opacity-100'}`}>
        &copy; {new Date().getFullYear()} {t('appName')}
      </div>
    </aside>
  );
};

export default Sidebar;