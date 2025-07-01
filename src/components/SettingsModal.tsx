
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { Volume2, VolumeX, Mail, LogOut, User } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, saveSettings, playNotificationSound } = useNotifications();
  const { user, logout } = useAuth();

  const handleVolumeChange = (value: number[]) => {
    const newSettings = { ...settings, volume: value[0] };
    saveSettings(newSettings);
  };

  const handleEnabledChange = (enabled: boolean) => {
    const newSettings = { ...settings, enabled };
    saveSettings(newSettings);
  };

  const testNotification = () => {
    playNotificationSound();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>⚙️ Configuración</span>
          </DialogTitle>
          <DialogDescription>
            Personaliza tu experiencia en Drug Dealer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Usuario</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Conectado como: <span className="font-medium text-foreground">{user?.email}</span>
              </p>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">🔔 Notificaciones</CardTitle>
              <CardDescription>
                Configura cómo recibir alertas sobre actualizaciones de datos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">
                    Activar notificaciones
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Recibe alertas cuando se actualicen los datos
                  </p>
                </div>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={handleEnabledChange}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center space-x-2">
                    {settings.volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>Volumen</span>
                  </label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(settings.volume * 100)}%
                  </span>
                </div>
                <Slider
                  value={[settings.volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                  disabled={!settings.enabled}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testNotification}
                  disabled={!settings.enabled}
                  className="w-full"
                >
                  🔊 Probar Sonido
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">📞 Soporte</CardTitle>
              <CardDescription>
                ¿Necesitas ayuda o tienes sugerencias?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => window.open('mailto:devel@medistream.tv', '_blank')}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contactar Desarrollador
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                devel@medistream.tv
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
