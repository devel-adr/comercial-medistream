
interface WorkflowExecution {
  id: string;
  mode: string;
  startedAt: string;
  stoppedAt?: string;
  status: 'running' | 'success' | 'error' | 'waiting' | 'canceled';
  workflowId: string;
  progress?: number;
}

interface WorkflowStatus {
  id: string;
  name: string;
  active: boolean;
  lastExecution?: WorkflowExecution;
  isRunning: boolean;
  progress: number;
  status: 'idle' | 'running' | 'success' | 'error';
}

class N8nService {
  private apiKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZDZmOTk0OS1lNGVjLTRjOGUtODNmNC1mMTRhZGRjNGNlZWIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2NjU0MzUyfQ.L_weveIDvFU_VXsGkpk3-YPU71dSX_MWu5JC7DdoMrA';
  private baseUrl: string = 'https://n8n.lovableai.com/api/v1';

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async getWorkflowExecutions(workflowId: string, limit: number = 5): Promise<WorkflowExecution[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/executions?workflowId=${workflowId}&limit=${limit}`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch executions: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error(`Error fetching executions for workflow ${workflowId}:`, error);
      return [];
    }
  }

  async getWorkflowStatus(workflowId: string, name: string): Promise<WorkflowStatus> {
    try {
      const executions = await this.getWorkflowExecutions(workflowId, 1);
      const lastExecution = executions[0];
      
      let progress = 0;
      let status: 'idle' | 'running' | 'success' | 'error' = 'idle';
      let isRunning = false;

      if (lastExecution) {
        isRunning = lastExecution.status === 'running';
        
        switch (lastExecution.status) {
          case 'running':
            status = 'running';
            progress = this.calculateProgress(lastExecution);
            break;
          case 'success':
            status = 'success';
            progress = 100;
            break;
          case 'error':
            status = 'error';
            progress = 0;
            break;
          default:
            status = 'idle';
            progress = 0;
        }
      }

      return {
        id: workflowId,
        name,
        active: true,
        lastExecution,
        isRunning,
        progress,
        status
      };
    } catch (error) {
      console.error(`Error getting workflow status for ${workflowId}:`, error);
      return {
        id: workflowId,
        name,
        active: false,
        isRunning: false,
        progress: 0,
        status: 'error'
      };
    }
  }

  private calculateProgress(execution: WorkflowExecution): number {
    if (!execution.startedAt) return 0;
    
    const startTime = new Date(execution.startedAt).getTime();
    const currentTime = new Date().getTime();
    const elapsed = currentTime - startTime;
    
    // Estimate progress based on elapsed time (rough estimation)
    // You can adjust these values based on your workflow's typical duration
    const estimatedDuration = 5 * 60 * 1000; // 5 minutes
    const progress = Math.min((elapsed / estimatedDuration) * 100, 95);
    
    return Math.round(progress);
  }

  async getAllWorkflowsStatus(): Promise<WorkflowStatus[]> {
    const workflows = [
      { id: 'wDKvuLQED4xTE5cO', name: 'DrugDealer' },
      { id: 'CfuXyip3P2ChhfKh', name: 'DrugDealer Sub' },
      { id: '8sboTwR84NFx1ebJ', name: 'Unmet Needs' },
      { id: 'wnCh8wRVCTCJq9oO', name: 'Pharma Tactics' }
    ];

    const statusPromises = workflows.map(workflow => 
      this.getWorkflowStatus(workflow.id, workflow.name)
    );

    return Promise.all(statusPromises);
  }
}

export const n8nService = new N8nService();
export type { WorkflowStatus, WorkflowExecution };
