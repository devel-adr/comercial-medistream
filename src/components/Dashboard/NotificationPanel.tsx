
import React from 'react';
import { Bell, Database, Users, X, Target, Building, Pill, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

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

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onClearNotifications: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearNotifications
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'medications':
        return <Database className="w-4 h-4" />;
      case 'unmetNeeds':
        return <Users className="w-4 h-4" />;
      case 'pharmaTactics':
        return <Target className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'medications':
        return 'DrugDealer';
      case 'unmetNeeds':
        return 'Unmet Needs';
      case 'pharmaTactics':
        return 'Tactics';
      default:
        return 'Datos';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medications':
        return 'bg-blue-100 text-blue-800';
      case 'unmetNeeds':
        return 'bg-green-100 text-green-800';
      case 'pharmaTactics':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/20" onClick={onClose}>
      <div 
        className="absolute top-16 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificaciones
              </CardTitle>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearNotifications}
                    className="text-xs"
                  >
                    Limpiar
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-80">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay notificaciones</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getTypeColor(notification.type)}`}
                        >
                          {getIcon(notification.type)}
                          <span className="ml-1">{getTypeLabel(notification.type)}</span>
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                        {notification.title}
                      </h4>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                        {notification.message}
                      </p>

                      {notification.details && (
                        <>
                          <Separator className="my-2" />
                          <div className="space-y-1">
                            {notification.details.laboratory && (
                              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                <Building className="w-3 h-3" />
                                <span className="font-medium">Lab:</span>
                                <span>{notification.details.laboratory}</span>
                              </div>
                            )}
                            {/* Solo mostrar fármaco si NO es una notificación de medications (DrugDealer) */}
                            {notification.details.drug && notification.type !== 'medications' && (
                              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                <Pill className="w-3 h-3" />
                                <span className="font-medium">Fármaco:</span>
                                <span>{notification.details.drug}</span>
                              </div>
                            )}
                          </div>
                          <Separator className="my-2" />
                        </>
                      )}
                      
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>+{notification.newRecords} nuevos registros</span>
                        <span>Total: {notification.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
