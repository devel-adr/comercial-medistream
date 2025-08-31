
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZDZmOTk0OS1lNGVjLTRjOGUtODNmNC1mMTRhZGRjNGNlZWIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2NjU0MzUyfQ.L_weveIDvFU_VXsGkpk3-YPU71dSX_MWu5JC7DdoMrA';
const N8N_BASE_URL = 'https://n8n.medistream.es/api/v1';

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  mode: string;
  status: 'running' | 'success' | 'error' | 'waiting' | 'canceled' | 'new';
  startedAt: string;
  stoppedAt?: string;
  finished: boolean;
  retryOf?: string;
  retrySuccessId?: string;
  waitTill?: string;
}

export interface WorkflowInfo {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const createHeaders = () => ({
  'Authorization': `Bearer ${N8N_API_KEY}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

export const n8nService = {
  async getWorkflowExecutions(workflowId: string, limit: number = 10): Promise<WorkflowExecution[]> {
    try {
      console.log(`Fetching executions for workflow ${workflowId}...`);
      
      const url = `${N8N_BASE_URL}/executions?workflowId=${workflowId}&limit=${limit}`;
      console.log(`Request URL: ${url}`);
      
      const response = await fetch(url, { 
        headers: createHeaders(),
        method: 'GET'
      });
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`Executions data for ${workflowId}:`, data);
      
      return data.data || [];
    } catch (error) {
      console.error(`Error fetching executions for workflow ${workflowId}:`, error);
      // En lugar de retornar array vacío, lanzamos el error para que se maneje correctamente
      throw error;
    }
  },

  async getWorkflowInfo(workflowId: string): Promise<WorkflowInfo | null> {
    try {
      console.log(`Fetching workflow info for ${workflowId}...`);
      
      const url = `${N8N_BASE_URL}/workflows/${workflowId}`;
      const response = await fetch(url, { 
        headers: createHeaders(),
        method: 'GET'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`Workflow info for ${workflowId}:`, data);
      
      return data;
    } catch (error) {
      console.error(`Error fetching workflow info for ${workflowId}:`, error);
      return null;
    }
  },

  async getAllWorkflowsStatus(): Promise<Record<string, WorkflowExecution[]>> {
    const workflows = {
      'wDKvuLQED4xTE5cO': 'Drug Dealer',
      '8sboTwR84NFx1ebJ': 'Unmet Needs',
      'wnCh8wRVCTCJq9oO': 'Pharma Tactics'
    };

    const results: Record<string, WorkflowExecution[]> = {};
    const errors: string[] = [];

    console.log('Starting to fetch all workflows status...');

    for (const [workflowId, name] of Object.entries(workflows)) {
      try {
        console.log(`Fetching executions for ${name} (${workflowId})...`);
        const executions = await this.getWorkflowExecutions(workflowId, 5);
        results[name] = executions;
        console.log(`Successfully fetched ${executions.length} executions for ${name}`);
      } catch (error) {
        console.error(`Failed to fetch executions for ${name}:`, error);
        errors.push(`${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        results[name] = []; // Asignar array vacío en caso de error
      }
    }

    console.log('Final results:', results);
    
    if (errors.length > 0) {
      console.warn('Some workflows failed to load:', errors);
    }

    return results;
  },

  // Método para probar la conexión
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing n8n API connection...');
      
      const url = `${N8N_BASE_URL}/workflows`;
      const response = await fetch(url, { 
        headers: createHeaders(),
        method: 'GET'
      });
      
      console.log(`Test connection response status: ${response.status}`);
      
      if (response.ok) {
        console.log('✅ n8n API connection successful');
        return true;
      } else {
        const errorText = await response.text();
        console.error('❌ n8n API connection failed:', response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error('❌ n8n API connection error:', error);
      return false;
    }
  }
};
