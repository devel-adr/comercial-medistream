
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { playNotificationSound } from '@/utils/notificationSounds';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useUnmetNeedsData } from '@/hooks/useUnmetNeedsData';

interface NotificationSettings {
  volume: number;
  enabled: boolean;
  soundType?: string;
}

interface NotificationItem {
  id: string;
  type: 'medications' | 'unmetNeeds';
  title: string;
  message: string;
  timestamp: Date;
  count: number;
  newRecords: number;
}

interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  showNotification: (title: string, message: string) => void;
  playNotificationSound: () => void;
  notifications: NotificationItem[];
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notification_settings');
    return saved ? JSON.parse(saved) : { volume: 0.5, enabled: true, soundType: 'default' };
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Initialize data hooks to track changes globally
  const { data: medicationsData } = useSupabaseData();
  const { data: unmetNeedsData } = useUnmetNeedsData();

  const medicationsCountRef = useRef(0);
  const unmetNeedsCountRef = useRef(0);
  const isInitializedRef = useRef(false);
  const lastNotificationRef = useRef<{ type: string; timestamp: number; count: number } | null>(null);

  // Listen for data updates from both hooks
  useEffect(() => {
    const handleDataUpdate = (event: any) => {
      console.log('Data update detected in context:', event.detail);
      
      const { type, count, newRecords } = event.detail;
      const now = Date.now();
      
      // Prevent duplicate notifications within 5 seconds and same count
      if (lastNotificationRef.current && 
          lastNotificationRef.current.type === type && 
          lastNotificationRef.current.count === count &&
          now - lastNotificationRef.current.timestamp < 5000) {
        console.log('Skipping duplicate notification for', type, 'with same count:', count);
        return;
      }
      
      lastNotificationRef.current = { type, timestamp: now, count };
      
      const newNotification: NotificationItem = {
        id: `${type}_${now}`, // More unique ID
        type: type,
        title: type === 'medications' ? 'Nuevos datos de DrugDealer' : 'Nuevos datos de Unmet Needs',
        message: `Se han añadido ${newRecords} nuevos registros`,
        timestamp: new Date(),
        count,
        newRecords
      };

      setNotifications(prev => {
        // Avoid adding if a similar notification already exists in the last 5 seconds
        const recent = prev.find(n => 
          n.type === type && 
          n.count === count && 
          now - n.timestamp.getTime() < 5000
        );
        
        if (recent) {
          console.log('Similar notification already exists, skipping');
          return prev;
        }
        
        return [newNotification, ...prev].slice(0, 20);
      });
      
      let title = 'Nuevos datos disponibles';
      let message = `Se han actualizado los datos de ${type === 'medications' ? 'DrugDealer' : 'Unmet Needs'}`;
      
      showNotification(title, message);
    };

    // Listen for custom events that indicate data updates
    window.addEventListener('dataUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  // Track data changes and initialize counts
  useEffect(() => {
    if (medicationsData.length > 0) {
      if (!isInitializedRef.current) {
        medicationsCountRef.current = medicationsData.length;
      }
    }
  }, [medicationsData]);

  useEffect(() => {
    if (unmetNeedsData.length > 0) {
      if (!isInitializedRef.current) {
        unmetNeedsCountRef.current = unmetNeedsData.length;
        isInitializedRef.current = true;
      }
    }
  }, [unmetNeedsData]);

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

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ 
      settings, 
      updateSettings, 
      showNotification, 
      playNotificationSound: playNotificationSoundHandler,
      notifications,
      clearNotifications
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
