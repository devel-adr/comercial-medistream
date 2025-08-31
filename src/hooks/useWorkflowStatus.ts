
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
    console.log('🔍 Testing n8n connection...');
    try {
      const isConnected = await n8nService.testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      console.log(`🔗 Connection test result: ${isConnected ? 'CONNECTED' : 'DISCONNECTED'}`);
      return isConnected;
    } catch (error) {
      console.error('💥 Connection test failed:', error);
      setConnectionStatus('disconnected');
      return false;
    }
  };

  const fetchWorkflowStatuses = async () => {
    try {
      console.log('🔄 Starting workflow status fetch...');
      setError(null);
      
      // Test connection first
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('No se puede establecer conexión con n8n. Verifica la URL y API key.');
      }

      console.log('🎯 Connection successful, fetching workflow data...');
      const statuses = await n8nService.getAllWorkflowsStatus();
      
      console.log('✅ Workflow statuses fetched successfully:', {
        totalWorkflows: Object.keys(statuses).length,
        totalExecutions: Object.values(statuses).reduce((sum, execs) => sum + execs.length, 0),
        details: Object.entries(statuses).map(([name, execs]) => ({
          workflow: name,
          executions: execs.length,
          latestStatus: execs[0]?.status || 'none'
        }))
      });
      
      setWorkflowStatuses(statuses);
      setLastUpdated(new Date());
      setConnectionStatus('connected');
      
    } catch (err) {
      console.error('❌ Error in fetchWorkflowStatuses:', err);
      
      let errorMessage = 'Error desconocido al obtener el estado de los workflows';
      
      if (err instanceof Error) {
        if (err.message.includes('CORS')) {
          errorMessage = 'Error de CORS: El navegador bloquea la conexión. Verifica la configuración del servidor n8n.';
        } else if (err.message.includes('API Key')) {
          errorMessage = 'API Key inválida. Verifica las credenciales de n8n.';
        } else if (err.message.includes('conexión')) {
          errorMessage = 'No se puede conectar con el servidor n8n. Verifica la URL y conectividad.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Initializing useWorkflowStatus hook...');
    console.log(`⚙️ Refresh interval: ${refreshInterval}ms`);
    
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

  // Log current state changes
  useEffect(() => {
    const stateInfo = {
      workflowCount: Object.keys(workflowStatuses).length,
      totalExecutions: Object.values(workflowStatuses).reduce((sum, execs) => sum + execs.length, 0),
      loading,
      error: error ? error.substring(0, 100) + '...' : null,
      connectionStatus,
      lastUpdated: lastUpdated.toISOString()
    };
    
    console.log('📊 Workflow status state update:', stateInfo);
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
