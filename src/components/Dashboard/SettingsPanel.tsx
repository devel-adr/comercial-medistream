import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Volume2, VolumeX, Mail, LogOut, User, Play, Palette, Bell } from 'lucide-react';
import { playNotificationSound } from '@/utils/notificationSounds';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useNotification();
  const { user, logout } = useAuth();
  const [selectedSound, setSelectedSound] = useState(settings.soundType || 'default');

  useEffect(() => {
    setSelectedSound(settings.soundType || 'default');
  }, [settings.soundType]);

  const soundOptions = [
    { value: 'default', label: 'Sonido por defecto' },
    { value: 'chime', label: 'Campanita' },
    { value: 'ding', label: 'Ding' },
    { value: 'notification', label: 'Notificación' }
  ];

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    updateSettings({ volume: newVolume });
    
    // Si el volumen es 0, también deshabilitar las notificaciones
    if (newVolume === 0 && settings.enabled) {
      updateSettings({ enabled: false });
    }
    // Si el volumen es mayor que 0 y las notificaciones están deshabilitadas, habilitarlas
    else if (newVolume > 0 && !settings.enabled) {
      updateSettings({ enabled: true });
    }
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    updateSettings({ enabled });
    
    // Si se habilitan las notificaciones y el volumen está en 0, ponerlo a un valor audible
    if (enabled && settings.volume === 0) {
      updateSettings({ volume: 0.5 });
    }
  };

  const handleSoundChange = (sound: string) => {
    console.log('Sound changed to:', sound);
    setSelectedSound(sound);
    updateSettings({ soundType: sound });
  };

  const testNotificationSound = async () => {
    console.log('Testing notification sound:', selectedSound, 'with volume:', settings.volume);
    await playNotificationSound(selectedSound, settings.enabled ? settings.volume : 0);
  };

  const handleMuteToggle = () => {
    if (settings.volume > 0) {
      // Silenciar: guardar el volumen actual y ponerlo a 0
      updateSettings({ volume: 0, enabled: false });
    } else {
      // Reactivar: restaurar a un volumen audible
      updateSettings({ volume: 0.5, enabled: true });
    }
  };

  const handleContactDeveloper = () => {
    window.open('mailto:devel@medistream.tv?subject=Medistream - Consulta&body=Hola, tengo una consulta sobre la aplicación Medistream.', '_blank');
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const isMuted = !settings.enabled || settings.volume === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Configuración</h2>
              <p className="text-sm text-gray-500 font-normal">Personaliza tu experiencia</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-blue-200 dark:border-gray-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Información del Usuario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">ID: {user?.ID}</p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                Configuración de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notifications-enabled" className="font-medium">
                    Habilitar notificaciones
                  </Label>
                  <p className="text-sm text-gray-500">Recibe alertas cuando se actualicen los datos</p>
                </div>
                <Switch
                  id="notifications-enabled"
                  checked={settings.enabled}
                  onCheckedChange={handleNotificationsToggle}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium flex items-center gap-2">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      Volumen de notificaciones
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMuteToggle}
                      className="flex items-center gap-1"
                    >
                      {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      {isMuted ? 'Activar' : 'Silenciar'}
                    </Button>
                  </div>
                  <div className="px-2">
                    <Slider
                      value={[settings.volume]}
                      onValueChange={handleVolumeChange}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                      disabled={!settings.enabled}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Silencio</span>
                    <span className="font-medium">{Math.round(settings.volume * 100)}%</span>
                    <span>Máximo</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-medium">Tipo de sonido</Label>
                  <div className="flex gap-2">
                    <Select value={selectedSound} onValueChange={handleSoundChange} disabled={!settings.enabled}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecciona un sonido" />
                      </SelectTrigger>
                      <SelectContent>
                        {soundOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={testNotificationSound}
                      size="sm"
                      variant="outline"
                      disabled={!settings.enabled}
                      className="flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      Probar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Soporte y Contacto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleContactDeveloper}
                variant="outline"
                className="w-full flex items-center gap-2 hover:bg-green-50 hover:border-green-300"
              >
                <Mail className="w-4 h-4" />
                Contactar al desarrollador
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                devel@medistream.tv
              </p>
            </CardContent>
          </Card>

          {/* Logout Section */}
          <div className="pt-4 border-t">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full flex items-center gap-2 h-12"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
