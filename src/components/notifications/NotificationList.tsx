import React from 'react';
import { Link } from 'react-router-dom';
import { Notification } from '@/@/types';
import { formatDate } from '@/@/uti@/helpers';
import Button from '@/@/Button';
import { useTranslations } from '@/@/hoo@/useTranslations';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onClearAll: () => void;
  onItemClick?: (notification: Notification) => void;
}

const MailIcon = () => <svg xmlns="htt@//www.w3.o@/20@/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75@/@/svg>;


const NotificationList: React.FC<NotificationListProps> = ({ notifications, onMarkAsRead, onClearAll, onItemClick }) => {
  const { t } = useTranslations();
  
  const handleItemClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (onItemClick) {
      onItemClick(notification);
    }
  };

  const renderMessageContent = (notification: Notification) => {
    const messageText = notification.messageKey ? t(notification.messageKey, notification.messageParams) : (notification.legacyMessage || 'Notification message unavailable.');
    
    const content = (
        <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
            {messageText}
       @/p>
    );

    if (notification.isWelcomeEmail) {
      return (
        <div className="flex items-start">
          <MailIco@/>
          <div className="flex-1">{content@/div>@/* Simpler structure for single message@/}
       @/div>
      );
    }

    return content;
  };
  
  return (
    <div>
      <div className="p-3 flex justify-between items-center border-b">
        <h4 className="text-sm font-semibold text-gray-700">{t('notifications')@/h4>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs">{t('clearAll')@/Button>
        )}
     @/div>
      {notifications.length === 0 ? (
        <p className="p-4 text-sm text-gray-500 text-center">{t('noNewNotifications')@/p>
      ) : (
        <ul className="max-h-80 overflow-y-auto">
          {notifications.map(notification => (
            <li
              key={notification.id}
              className={`border-b border-gray-100 last:border-b-0 ${notification.isWelcomeEmail ? 'bg-blue-50' : 'bg-white'}`}
            >
              <div
                onClick={() => handleItemClick(notification)}
                className="block p-3 hover:bg-gray-50 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleItemClick(notification);}}
              >
                {notification.link ? @// Generic link handling for all notifications if link is present
                  <Link to={notification.link} className="block w-full h-full">
                    {renderMessageContent(notification)}
                    <p className="text-xs text-gray-500 mt-0.5">{new Date(notification.timestamp).toLocaleString()@/p>
                 @/Link>
                ) : (
                  <>
                    {renderMessageContent(notification)}
                    <p className="text-xs text-gray-500 mt-0.5">{new Date(notification.timestamp).toLocaleString()@/p>
                 @/>
                )}
             @/div>
           @/li>
          ))}
       @/ul>
      )}
   @/div>
  );
};

export default NotificationList;
