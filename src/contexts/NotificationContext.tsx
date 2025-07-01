
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for notification sound
    audioRef.current = new Audio();
    // Using different sound based on soundType
    const getSoundData = (soundType: string) => {
      switch(soundType) {
        case 'chime':
          return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQ=';
        case 'ding':
          return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQ=';
        case 'notification':
          return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQ=';
        default:
          return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQ=';
      }
    };
    
    audioRef.current.src = getSoundData(settings.soundType || 'default');
  }, [settings.soundType]);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('notification_settings', JSON.stringify(updated));
    
    // Update audio source if soundType changed
    if (newSettings.soundType && audioRef.current) {
      const getSoundData = (soundType: string) => {
        switch(soundType) {
          case 'chime':
            return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQ=';
          case 'ding':
            return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQ=';
          case 'notification':
            return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQ=';
          default:
            return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBjiH0fPTgjEIJHfH8N2QQAoUXrTp66hVFApGn+DyvmQ=';
        }
      };
      audioRef.current.src = getSoundData(newSettings.soundType);
    }
  };

  const showNotification = (title: string, message: string) => {
    if (!settings.enabled) return;

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

    playNotificationSound();
  };

  const playNotificationSound = () => {
    if (!settings.enabled || !audioRef.current) return;
    
    console.log('Playing notification sound with volume:', settings.volume);
    audioRef.current.volume = settings.volume;
    audioRef.current.play().catch(console.error);
  };

  return (
    <NotificationContext.Provider value={{ settings, updateSettings, showNotification, playNotificationSound }}>
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
