
import React, { ReactNode, useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useTranslations } from '@/hooks/useTranslations';
import { Language } from '@/types';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { currentLanguage } = useTranslations();

  useEffect(() => {
    if (currentLanguage === Language.AR) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [currentLanguage]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const mainContentMarginClass = () => {
    const expandedMargin = 'ms-[16rem]';
    const collapsedMargin = 'ms-[5rem]';
    return isSidebarCollapsed ? collapsedMargin : expandedMargin;
  };

  return (
    <div className="flex h-screen bg-light-bg text-accent-black">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
      />
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${mainContentMarginClass()}`}
      >
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-bg p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
