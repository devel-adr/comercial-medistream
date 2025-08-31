
import React from 'react';
import { Activity, Database, Users, Target, X, Play, Pause, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkflowStatus } from '@/services/n8nService';

interface WorkflowProgressPanelProps {
  isOpen: boolean;
  onClose: () => void;
  workflows: WorkflowStatus[];
  onRefresh: () => void;
}

export const WorkflowProgressPanel: React.FC<WorkflowProgressPanelProps> = ({
  isOpen,
  onClose,
  workflows,
  onRefresh
}) => {
  if (!isOpen) return null;

  const getStatusIcon = (status: string, isRunning: boolean) => {
    if (isRunning) return <Activity className="w-4 h-4 animate-spin" />;
    
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Activity className="w-4 h-4 animate-pulse text-blue-500" />;
      default:
        return <Pause className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string, isRunning: boolean) => {
    if (isRunning) return 'bg-blue-100 text-blue-800';
    
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'running':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  const formatLastExecution = (workflow: WorkflowStatus) => {
    if (!workflow.lastExecution) return 'Sin ejecuciones recientes';
    
    const date = new Date(workflow.lastExecution.startedAt);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
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
                <Activity className="w-5 h-5" />
                Estado de Automatizaciones
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  className="text-xs"
                >
                  Actualizar
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(workflow.status, workflow.isRunning)}
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                          {workflow.name}
                        </h4>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(workflow.status, workflow.isRunning)}`}
                      >
                        {workflow.isRunning ? 'Ejecutándose' : workflow.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                        <span>Progreso</span>
                        <span>{workflow.progress}%</span>
                      </div>
                      <Progress 
                        value={workflow.progress} 
                        className="h-2"
                      />
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Última ejecución:</span>
                        <span>{formatLastExecution(workflow)}</span>
                      </div>
                      {workflow.lastExecution && (
                        <div className="flex justify-between">
                          <span>ID:</span>
                          <span className="font-mono">{workflow.lastExecution.id.substring(0, 8)}...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
