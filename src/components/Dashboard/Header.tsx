
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, Search } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { SettingsPanel } from './SettingsPanel';
import { NotificationPanel } from './NotificationPanel';

interface HeaderProps {
  onToggleFilters: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleFilters }) => {
  const { notifications, clearNotifications } = useNotification();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  // Request notification permissions on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleNotificationClick = () => {
    setIsNotificationPanelOpen(true);
  };

  const handleClearNotifications = () => {
    clearNotifications();
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-blue-100 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    MEDISTREAM
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Derechos reservados a Medistream™
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleNotificationClick}
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 animate-pulse">
                      {notifications.length > 9 ? '9+' : notifications.length}
                    </Badge>
                  )}
                </Button>
              </div>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        notifications={notifications}
        onClearNotifications={handleClearNotifications}
      />
    </>
  );
};
