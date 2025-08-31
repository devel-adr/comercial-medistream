
import { useState, useEffect, useRef } from 'react';
import { getAllWorkflowStatuses, WorkflowStatus } from '@/services/n8nService';

export const useWorkflowStatus = (refreshInterval = 10000) => {
  const [workflowStatuses, setWorkflowStatuses] = useState<WorkflowStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchStatuses = async () => {
    try {
      const statuses = await getAllWorkflowStatuses();
      setWorkflowStatuses(statuses);
      setError(null);
    } catch (err) {
      console.error('Error fetching workflow statuses:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
    
    // Set up polling
    intervalRef.current = setInterval(fetchStatuses, refreshInterval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  const refresh = () => {
    setLoading(true);
    fetchStatuses();
  };

  return {
    workflowStatuses,
    loading,
    error,
    refresh
  };
};
