
import { useState, useEffect, useRef } from 'react';
import { n8nService, WorkflowStatus } from '@/services/n8nService';

export const useWorkflowStatus = (refreshInterval: number = 10000) => {
  const [workflows, setWorkflows] = useState<WorkflowStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchWorkflowsStatus = async () => {
    try {
      console.log('Fetching workflow statuses...');
      const statuses = await n8nService.getAllWorkflowsStatus();
      setWorkflows(statuses);
      setError(null);
      console.log('Workflow statuses updated:', statuses);
    } catch (err) {
      console.error('Error fetching workflow statuses:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchWorkflowsStatus();

    // Set up polling
    intervalRef.current = setInterval(fetchWorkflowsStatus, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  const refresh = () => {
    fetchWorkflowsStatus();
  };

  return {
    workflows,
    loading,
    error,
    refresh
  };
};
