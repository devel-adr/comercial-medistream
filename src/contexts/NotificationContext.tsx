
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
  
  // Sistema de deduplicación mejorado
  const processedNotificationsRef = useRef<Set<string>>(new Set());
  const lastNotificationTimeRef = useRef<{ [key: string]: number }>({});
  const isProcessingRef = useRef(false);

  // Listen for data updates from both hooks
  useEffect(() => {
    const handleDataUpdate = (event: any) => {
      console.log('Data update detected in context:', event.detail);
      
      // Prevenir procesamiento múltiple simultáneo
      if (isProcessingRef.current) {
        console.log('Already processing notification, skipping');
        return;
      }
      
      isProcessingRef.current = true;
      
      try {
        const { type, count, newRecords } = event.detail;
        const now = Date.now();
        
        // Crear un ID único para esta notificación específica
        const notificationId = `${type}_${count}_${newRecords}`;
        
        // Verificar si ya procesamos esta notificación exacta
        if (processedNotificationsRef.current.has(notificationId)) {
          console.log('Notification already processed:', notificationId);
          return;
        }
        
        // Verificar tiempo desde la última notificación del mismo tipo
        const lastTime = lastNotificationTimeRef.current[type] || 0;
        if (now - lastTime < 3000) { // 3 segundos de cooldown por tipo
          console.log('Notification cooldown active for type:', type);
          return;
        }
        
        // Marcar como procesada y actualizar tiempo
        processedNotificationsRef.current.add(notificationId);
        lastNotificationTimeRef.current[type] = now;
        
        // Limpiar notificaciones procesadas antiguas (después de 30 segundos)
        setTimeout(() => {
          processedNotificationsRef.current.delete(notificationId);
        }, 30000);
        
        const newNotification: NotificationItem = {
          id: notificationId,
          type: type,
          title: type === 'medications' ? 'Nuevos datos de DrugDealer' : 'Nuevos datos de Unmet Needs',
          message: `Se han añadido ${newRecords} nuevos registros`,
          timestamp: new Date(),
          count,
          newRecords
        };

        setNotifications(prev => {
          // Verificar nuevamente que no existe una notificación similar
          const exists = prev.some(n => 
            n.type === type && 
            n.count === count && 
            n.newRecords === newRecords &&
            now - n.timestamp.getTime() < 5000
          );
          
          if (exists) {
            console.log('Similar notification exists in state, skipping');
            return prev;
          }
          
          return [newNotification, ...prev].slice(0, 20);
        });
        
        let title = 'Nuevos datos disponibles';
        let message = `Se han actualizado los datos de ${type === 'medications' ? 'DrugDealer' : 'Unmet Needs'}`;
        
        showNotification(title, message);
        
      } finally {
        // Liberar el lock después de un pequeño delay
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 500);
      }
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
    // También limpiar el cache de notificaciones procesadas
    processedNotificationsRef.current.clear();
    lastNotificationTimeRef.current = {};
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
