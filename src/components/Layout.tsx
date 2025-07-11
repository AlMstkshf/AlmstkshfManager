
import React, { ReactNode, useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTranslations } from '../../hooks/useTranslations';
import { Language } from '../../types';

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
    // Using Tailwind's logical property 'ms-*' (margin-start)
    // ms-[16rem] will be margin-left in LTR and margin-right in RTL
    const expandedMargin = 'ms-[16rem]'; // w-64 is 16rem
    const collapsedMargin = 'ms-[5rem]';  // w-20 is 5rem
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