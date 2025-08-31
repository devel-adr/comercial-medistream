
import { useState, useEffect, useRef } from 'react';
import { n8nService, WorkflowExecution } from '@/services/n8nService';

export const useWorkflowStatus = (refreshInterval: number = 10000) => {
  const [workflowStatuses, setWorkflowStatuses] = useState<Record<string, WorkflowExecution[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchWorkflowStatuses = async () => {
    try {
      console.log('Fetching workflow statuses...');
      const statuses = await n8nService.getAllWorkflowsStatus();
      setWorkflowStatuses(statuses);
      setLastUpdated(new Date());
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
    fetchWorkflowStatuses();

    // Set up polling
    intervalRef.current = setInterval(fetchWorkflowStatuses, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  const refresh = () => {
    setLoading(true);
    fetchWorkflowStatuses();
  };

  return {
    workflowStatuses,
    loading,
    error,
    lastUpdated,
    refresh
  };
};
