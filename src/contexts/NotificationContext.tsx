import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { playNotificationSound } from '@/utils/notificationSounds';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useUnmetNeedsData } from '@/hooks/useUnmetNeedsData';
import { usePharmaTacticsData } from '@/hooks/usePharmaTacticsData';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationSettings {
  volume: number;
  enabled: boolean;
  soundType?: string;
}

interface NotificationItem {
  id: string;
  type: 'medications' | 'unmetNeeds' | 'pharmaTactics';
  title: string;
  message: string;
  timestamp: Date;
  count: number;
  newRecords: number;
  details?: {
    laboratory?: string;
    drug?: string;
    userEmail?: string;
  };
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
  const { user } = useAuth(); // Obtener el usuario autenticado

  // Initialize data hooks to track changes globally
  const { data: medicationsData } = useSupabaseData();
  const { data: unmetNeedsData } = useUnmetNeedsData();
  const { data: pharmaTacticsData } = usePharmaTacticsData();

  const medicationsCountRef = useRef(0);
  const unmetNeedsCountRef = useRef(0);
  const pharmaTacticsCountRef = useRef(0);
  const isInitializedRef = useRef(false);
  
  // Sistema de deduplicación mejorado
  const processedNotificationsRef = useRef<Set<string>>(new Set());
  const lastNotificationTimeRef = useRef<{ [key: string]: number }>({});
  const isProcessingRef = useRef(false);

  // Listen for data updates from all hooks
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
        const { type, count, newRecords, data, latestRecord } = event.detail;
        const now = Date.now();
        
        // Crear un ID único para esta notificación específica
        const notificationId = `${type}_${count}_${newRecords}_${now}`;
        
        // Verificar si ya procesamos una notificación similar recientemente
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
        
        let title = 'Nuevos datos disponibles';
        let message = '';
        let details: any = {};
        
        // Usar latestRecord si está disponible, si no usar el primer elemento de data
        const recordToUse = latestRecord || (data && data.length > 0 ? data[0] : null);
        
        console.log('Record to use for notification:', recordToUse);
        console.log('Current authenticated user:', user);
        
        // Obtener el email del usuario autenticado
        const userEmail = user?.email || 'Usuario no identificado';
        
        if (recordToUse) {
          switch (type) {
            case 'medications':
              title = 'Nuevos datos de DrugDealer';
              message = `Se han añadido ${newRecords} nuevos registros de medicamentos`;
              // Para DrugDealer: laboratorio y email del usuario autenticado
              details = {
                laboratory: recordToUse.nombre_lab || 'No especificado',
                userEmail: userEmail
              };
              console.log('DrugDealer notification details:', details);
              break;
            case 'unmetNeeds':
              title = 'Nuevos datos de Unmet Needs';
              message = `Se han añadido ${newRecords} nuevos registros de unmet needs`;
              // Para Unmet Needs: laboratorio, fármaco y email del usuario autenticado
              details = {
                laboratory: recordToUse.lab || 'No especificado',
                drug: recordToUse.farmaco || 'No especificado',
                userEmail: userEmail
              };
              console.log('Unmet Needs notification details:', details);
              break;
            case 'pharmaTactics':
              title = 'Nuevas Tactics disponibles';
              message = `Se han añadido ${newRecords} nuevas tactics`;
              // Para Tactics: laboratorio, fármaco y email del usuario autenticado
              details = {
                laboratory: recordToUse.laboratorio || 'No especificado',
                drug: recordToUse.farmaco || 'No especificado',
                userEmail: userEmail
              };
              console.log('PharmaTactics notification details:', details);
              break;
            default:
              message = `Se han añadido ${newRecords} nuevos registros`;
          }
        } else {
          // Fallback para cuando no hay data específica
          switch (type) {
            case 'medications':
              title = 'Nuevos datos de DrugDealer';
              message = `Se han añadido ${newRecords} nuevos registros de medicamentos`;
              details = { userEmail: userEmail };
              break;
            case 'unmetNeeds':
              title = 'Nuevos datos de Unmet Needs';
              message = `Se han añadido ${newRecords} nuevos registros de unmet needs`;
              details = { userEmail: userEmail };
              break;
            case 'pharmaTactics':
              title = 'Nuevas Tactics disponibles';
              message = `Se han añadido ${newRecords} nuevas tactics`;
              details = { userEmail: userEmail };
              break;
            default:
              message = `Se han añadido ${newRecords} nuevos registros`;
              details = { userEmail: userEmail };
          }
        }
        
        const newNotification: NotificationItem = {
          id: notificationId,
          type: type,
          title,
          message,
          timestamp: new Date(),
          count,
          newRecords,
          details
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
  }, [user]);

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
      }
    }
  }, [unmetNeedsData]);

  useEffect(() => {
    if (pharmaTacticsData.length > 0) {
      if (!isInitializedRef.current) {
        pharmaTacticsCountRef.current = pharmaTacticsData.length;
        isInitializedRef.current = true;
      }
    }
  }, [pharmaTacticsData]);

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
