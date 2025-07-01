
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Volume2, Mail, LogOut, User } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useNotification();
  const { user, logout } = useAuth();

  const handleVolumeChange = (value: number[]) => {
    updateSettings({ volume: value[0] });
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    updateSettings({ enabled });
  };

  const handleContactDeveloper = () => {
    window.open('mailto:devel@medistream.tv?subject=Drug Dealer - Consulta&body=Hola, tengo una consulta sobre la aplicación Drug Dealer.', '_blank');
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            Configuración
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Usuario actual</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">ID: {user?.ID}</p>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Configuración de Notificaciones
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications-enabled">
                  Habilitar notificaciones
                </Label>
                <Switch
                  id="notifications-enabled"
                  checked={settings.enabled}
                  onCheckedChange={handleNotificationsToggle}
                />
              </div>

              <div className="space-y-2">
                <Label>Volumen de notificaciones</Label>
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
                  <span>{Math.round(settings.volume * 100)}%</span>
                  <span>Máximo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Soporte</h3>
            <Button
              onClick={handleContactDeveloper}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Contactar al desarrollador
            </Button>
            <p className="text-xs text-gray-500 text-center">
              devel@medistream.tv
            </p>
          </div>

          {/* Logout */}
          <div className="pt-4 border-t">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full flex items-center gap-2"
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
