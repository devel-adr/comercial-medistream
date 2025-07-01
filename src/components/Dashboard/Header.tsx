
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Bell, Settings, Search } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useNotification } from '@/contexts/NotificationContext';
import { SettingsPanel } from './SettingsPanel';

interface HeaderProps {
  onToggleFilters: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleFilters }) => {
  const { theme, toggleTheme } = useTheme();
  const { showNotification } = useNotification();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Request notification permissions on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Listen for data updates to trigger notifications
  useEffect(() => {
    const handleDataUpdate = () => {
      setNotificationCount(prev => prev + 1);
      showNotification(
        'Nuevos datos disponibles',
        'Se han actualizado los datos de fármacos o necesidades no cubiertas'
      );
    };

    // Listen for custom events that indicate data updates
    window.addEventListener('dataUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, [showNotification]);

  const handleNotificationClick = () => {
    setNotificationCount(0);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-blue-100 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    DRUG DEALER
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Base de datos de laboratorios farmacéuticos
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleFilters}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </Button>

              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleNotificationClick}
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 animate-pulse">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </Badge>
                  )}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </Button>

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
    </>
  );
};
