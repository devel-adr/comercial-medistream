
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { playNotificationSound } from '@/utils/notificationSounds';

interface NotificationSettings {
  volume: number;
  enabled: boolean;
  soundType?: string;
}

interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  showNotification: (title: string, message: string) => void;
  playNotificationSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notification_settings');
    return saved ? JSON.parse(saved) : { volume: 0.5, enabled: true, soundType: 'default' };
  });

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('notification_settings', JSON.stringify(updated));
    console.log('Settings updated:', updated);
  };

  const showNotification = (title: string, message: string) => {
    if (!settings.enabled) {
      console.log('Notifications disabled, skipping notification');
      return;
    }

    console.log('Showing notification:', title, message);

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, {
              body: message,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }

    playNotificationSoundHandler();
  };

  const playNotificationSoundHandler = async () => {
    if (!settings.enabled) {
      console.log('Notifications disabled, skipping sound');
      return;
    }
    
    console.log('Playing notification sound with settings:', settings);
    await playNotificationSound(settings.soundType || 'default', settings.volume);
  };

  return (
    <NotificationContext.Provider value={{ 
      settings, 
      updateSettings, 
      showNotification, 
      playNotificationSound: playNotificationSoundHandler 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
