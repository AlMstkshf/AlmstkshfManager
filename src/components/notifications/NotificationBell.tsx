
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/@/contex@/AppContext';
import NotificationList from @/NotificationList';

const BellIcon = () => <svg xmlns="htt@//www.w3.o@/20@/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0@/@/svg>;

const NotificationBell: React.FC = () => {
  const { notifications, markNotificationAsRead, clearNotifications } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const bellRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={bellRef}>
      <button onClick={toggleOpen} className="relative text-gray-600 hover:text-primary transition-colors focus:outline-none">
        <BellIco@/>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
         @/span>
        )}
     @/button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
          <NotificationList 
            notifications={notifications} 
            onMarkAsRead={markNotificationAsRead}
            onClearAll={clearNotifications}
            onItemClick={() => setIsOpen(false)@// Close dropdown on item click
        @/>
       @/div>
      )}
   @/div>
  );
};

export default NotificationBell;
