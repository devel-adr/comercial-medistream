
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZDZmOTk0OS1lNGVjLTRjOGUtODNmNC1mMTRhZGRjNGNlZWIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2NjU0MzUyfQ.L_weveIDvFU_VXsGkpk3-YPU71dSX_MWu5JC7DdoMrA';
const N8N_BASE_URL = 'https://n8n.lovableai.com/api/v1';

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'new' | 'running' | 'success' | 'failed' | 'canceled';
  startedAt: string;
  stoppedAt?: string;
  mode: string;
}

export interface WorkflowStatus {
  id: string;
  name: string;
  lastExecution?: WorkflowExecution;
  isRunning: boolean;
  progress: number;
}

const WORKFLOW_CONFIG = {
  'wDKvuLQED4xTE5cO': { name: 'Drug Dealer', type: 'medications' },
  'CfuXyip3P2ChhfKh': { name: 'Drug Dealer Sub', type: 'medications' },
  '8sboTwR84NFx1ebJ': { name: 'Unmet Needs', type: 'unmetNeeds' },
  'wnCh8wRVCTCJq9oO': { name: 'Pharma Tactics', type: 'pharmaTactics' }
};

export const getWorkflowExecutions = async (workflowId: string, limit = 1): Promise<WorkflowExecution[]> => {
  try {
    const response = await fetch(`${N8N_BASE_URL}/executions?workflowId=${workflowId}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${N8N_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch executions: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(`Error fetching executions for workflow ${workflowId}:`, error);
    return [];
  }
};

export const getWorkflowStatus = async (workflowId: string): Promise<WorkflowStatus> => {
  const config = WORKFLOW_CONFIG[workflowId as keyof typeof WORKFLOW_CONFIG];
  const executions = await getWorkflowExecutions(workflowId);
  const lastExecution = executions[0];
  
  const isRunning = lastExecution?.status === 'running' || lastExecution?.status === 'new';
  let progress = 0;
  
  if (lastExecution) {
    switch (lastExecution.status) {
      case 'new':
        progress = 10;
        break;
      case 'running':
        // Calculate progress based on execution time (rough estimate)
        const startTime = new Date(lastExecution.startedAt).getTime();
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        // Assume average execution takes 2 minutes, cap at 90%
        progress = Math.min(90, 10 + (elapsed / (2 * 60 * 1000)) * 80);
        break;
      case 'success':
        progress = 100;
        break;
      case 'failed':
      case 'canceled':
        progress = 0;
        break;
      default:
        progress = 0;
    }
  }

  return {
    id: workflowId,
    name: config?.name || 'Unknown',
    lastExecution,
    isRunning,
    progress: Math.round(progress)
  };
};

export const getAllWorkflowStatuses = async (): Promise<WorkflowStatus[]> => {
  const workflowIds = Object.keys(WORKFLOW_CONFIG);
  const promises = workflowIds.map(id => getWorkflowStatus(id));
  
  try {
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching workflow statuses:', error);
    return [];
  }
};
