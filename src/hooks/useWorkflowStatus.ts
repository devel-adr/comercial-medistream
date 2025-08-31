
import { useState, useEffect, useRef } from 'react';
import { n8nService, WorkflowExecution } from '@/services/n8nService';

export const useWorkflowStatus = (refreshInterval: number = 10000) => {
  const [workflowStatuses, setWorkflowStatuses] = useState<Record<string, WorkflowExecution[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const intervalRef = useRef<NodeJS.Timeout>();

  const testConnection = async () => {
    console.log('Testing n8n connection...');
    try {
      const isConnected = await n8nService.testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      return isConnected;
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('disconnected');
      return false;
    }
  };

  const fetchWorkflowStatuses = async () => {
    try {
      console.log('🔄 Fetching workflow statuses...');
      setError(null);
      
      // Primero probar la conexión
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('No se puede conectar con el servidor n8n. Verifica la URL y la API key.');
      }

      const statuses = await n8nService.getAllWorkflowsStatus();
      console.log('✅ Workflow statuses fetched successfully:', statuses);
      
      setWorkflowStatuses(statuses);
      setLastUpdated(new Date());
      setConnectionStatus('connected');
      
      // Logging detallado del estado de cada workflow
      Object.entries(statuses).forEach(([name, executions]) => {
        console.log(`📊 ${name}: ${executions.length} executions`);
        if (executions.length > 0) {
          const latest = executions[0];
          console.log(`   Latest execution: ${latest.status} (${latest.id})`);
        }
      });
      
    } catch (err) {
      console.error('❌ Error fetching workflow statuses:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al obtener el estado de los workflows');
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Initializing useWorkflowStatus hook...');
    
    // Initial fetch
    fetchWorkflowStatuses();

    // Set up polling only if refreshInterval > 0
    if (refreshInterval > 0) {
      console.log(`⏰ Setting up polling every ${refreshInterval}ms`);
      intervalRef.current = setInterval(fetchWorkflowStatuses, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        console.log('🛑 Clearing polling interval');
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  const refresh = async () => {
    console.log('🔄 Manual refresh triggered');
    setLoading(true);
    await fetchWorkflowStatuses();
  };

  // Log del estado actual cada vez que cambie
  useEffect(() => {
    console.log('📊 Current workflow statuses state:', {
      workflowCount: Object.keys(workflowStatuses).length,
      totalExecutions: Object.values(workflowStatuses).reduce((sum, execs) => sum + execs.length, 0),
      loading,
      error,
      connectionStatus,
      lastUpdated: lastUpdated.toISOString()
    });
  }, [workflowStatuses, loading, error, connectionStatus, lastUpdated]);

  return {
    workflowStatuses,
    loading,
    error,
    lastUpdated,
    connectionStatus,
    refresh,
    testConnection
  };
};
