
import React from 'react';
import { X, Play, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useWorkflowStatus } from '@/hooks/useWorkflowStatus';
import { WorkflowStatus } from '@/services/n8nService';

interface WorkflowProgressPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowProgressPanel: React.FC<WorkflowProgressPanelProps> = ({
  isOpen,
  onClose
}) => {
  const { workflowStatuses, loading, error, refresh } = useWorkflowStatus();

  if (!isOpen) return null;

  const getStatusIcon = (status: WorkflowStatus) => {
    if (!status.lastExecution) {
      return <Clock className="w-4 h-4 text-gray-400" />;
    }

    switch (status.lastExecution.status) {
      case 'running':
      case 'new':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'canceled':
        return <XCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: WorkflowStatus) => {
    if (!status.lastExecution) return 'bg-gray-100 text-gray-800';
    
    switch (status.lastExecution.status) {
      case 'running':
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'canceled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (status: WorkflowStatus) => {
    if (!status.lastExecution) return '';
    
    switch (status.lastExecution.status) {
      case 'running':
      case 'new':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'canceled':
        return 'bg-yellow-500';
      default:
        return '';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
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
                <Play className="w-5 h-5" />
                Estado de Automatizaciones
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refresh}
                  disabled={loading}
                  className="text-xs"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-80">
              {error ? (
                <div className="text-center py-8 text-red-500 dark:text-red-400">
                  <XCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Error: {error}</p>
                </div>
              ) : loading && workflowStatuses.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                  <p className="text-sm">Cargando estado...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workflowStatuses.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(workflow)}
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                            {workflow.name}
                          </h4>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(workflow)}`}
                        >
                          {workflow.lastExecution?.status || 'idle'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                          <span>Progreso</span>
                          <span>{workflow.progress}%</span>
                        </div>
                        <Progress 
                          value={workflow.progress} 
                          className="h-2"
                        />
                      </div>
                      
                      {workflow.lastExecution && (
                        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Iniciado:</span>
                            <span>{formatTime(workflow.lastExecution.startedAt)}</span>
                          </div>
                          {workflow.lastExecution.stoppedAt && (
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>Finalizado:</span>
                              <span>{formatTime(workflow.lastExecution.stoppedAt)}</span>
                            </div>
                          )}
                        </div>
                      )}
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
