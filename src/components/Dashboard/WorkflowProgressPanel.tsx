import React from 'react';
import { X, Play, CheckCircle, XCircle, Clock, Loader2, RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWorkflowStatus } from '@/hooks/useWorkflowStatus';
import { WorkflowExecution } from '@/services/n8nService';

interface WorkflowProgressPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running':
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    case 'success':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'error':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'waiting':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'canceled':
      return <XCircle className="w-4 h-4 text-gray-500" />;
    default:
      return <Play className="w-4 h-4 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'waiting':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'canceled':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('es-ES'),
    time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  };
};

const calculateDuration = (startedAt: string, stoppedAt?: string) => {
  const start = new Date(startedAt);
  const end = stoppedAt ? new Date(stoppedAt) : new Date();
  const diffMs = end.getTime() - start.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  
  if (diffMinutes > 0) {
    return `${diffMinutes}m ${diffSeconds % 60}s`;
  }
  return `${diffSeconds}s`;
};

const WorkflowSection: React.FC<{ 
  title: string; 
  executions: WorkflowExecution[]; 
  color: string;
}> = ({ title, executions, color }) => {
  const latestExecution = executions[0];
  const isRunning = latestExecution?.status === 'running';

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          {title}
          <span className="text-sm font-normal text-gray-500">({executions.length})</span>
        </h3>
        {latestExecution && (
          <Badge variant="secondary" className={getStatusColor(latestExecution.status)}>
            {getStatusIcon(latestExecution.status)}
            <span className="ml-1 capitalize">{latestExecution.status}</span>
          </Badge>
        )}
      </div>

      {executions.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          <Play className="w-6 h-6 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No hay ejecuciones recientes</p>
        </div>
      ) : (
        <div className="space-y-2">
          {executions.map((execution) => {
            const { date, time } = formatDateTime(execution.startedAt);
            const duration = calculateDuration(execution.startedAt, execution.stoppedAt);

            return (
              <div
                key={execution.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(execution.status)}
                    <span className="text-sm font-medium">
                      Ejecución #{execution.id.slice(-8)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {time}
                  </span>
                </div>
                
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                  <span>Duración: {duration}</span>
                  <span>{date}</span>
                </div>
                
                {execution.mode && (
                  <div className="mt-1">
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                      {execution.mode}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const WorkflowProgressPanel: React.FC<WorkflowProgressPanelProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    workflowStatuses, 
    loading, 
    error, 
    lastUpdated, 
    connectionStatus,
    refresh, 
    testConnection 
  } = useWorkflowStatus();

  if (!isOpen) return null;

  const totalExecutions = Object.values(workflowStatuses).reduce((sum, execs) => sum + execs.length, 0);

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
                <Play className="w-5 h-5" />
                Estado de Automatizaciones
                {connectionStatus === 'connected' ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : connectionStatus === 'disconnected' ? (
                  <WifiOff className="w-4 h-4 text-red-500" />
                ) : null}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refresh}
                  disabled={loading}
                  className="text-xs"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                Última actualización: {lastUpdated.toLocaleTimeString('es-ES')}
              </span>
              <span>
                Total: {totalExecutions} ejecuciones
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <ScrollArea className="h-96">
              {loading && Object.keys(workflowStatuses).length === 0 ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cargando estado de workflows...
                  </p>
                </div>
              ) : error ? (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription className="text-sm">
                      <strong>Error de conexión:</strong> {error}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="text-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={testConnection}
                      className="mb-2"
                    >
                      Probar Conexión
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={refresh}
                    >
                      Reintentar Carga
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <WorkflowSection
                    title="Drug Dealer"
                    executions={workflowStatuses['Drug Dealer'] || []}
                    color="bg-blue-500"
                  />
                  
                  <Separator />
                  
                  <WorkflowSection
                    title="Unmet Needs"
                    executions={workflowStatuses['Unmet Needs'] || []}
                    color="bg-green-500"
                  />
                  
                  <Separator />
                  
                  <WorkflowSection
                    title="Pharma Tactics"
                    executions={workflowStatuses['Pharma Tactics'] || []}
                    color="bg-purple-500"
                  />
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
