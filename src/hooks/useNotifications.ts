
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface NotificationSettings {
  volume: number;
  enabled: boolean;
}

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    volume: 0.5,
    enabled: true
  });

  const [lastDataUpdate, setLastDataUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem('notification_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notification_settings', JSON.stringify(newSettings));
  };

  const playNotificationSound = useCallback(() => {
    if (!settings.enabled) return;

    // Create audio context for notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(settings.volume * 0.3, audioContext.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, [settings]);

  const showNotification = useCallback((title: string, message: string) => {
    if (!settings.enabled) return;

    toast({
      title,
      description: message,
      duration: 5000,
    });

    playNotificationSound();
  }, [settings, playNotificationSound]);

  const checkForUpdates = useCallback((newData: any[], type: 'medications' | 'unmet_needs') => {
    const now = new Date();
    
    if (lastDataUpdate && newData.length > 0) {
      const typeLabel = type === 'medications' ? 'fármacos' : 'necesidades no cubiertas';
      showNotification(
        '📊 Datos Actualizados',
        `Se han actualizado los datos de ${typeLabel}. Revisa las últimas incorporaciones.`
      );
    }
    
    setLastDataUpdate(now);
  }, [lastDataUpdate, showNotification]);

  return {
    settings,
    saveSettings,
    showNotification,
    checkForUpdates,
    playNotificationSound
  };
};
