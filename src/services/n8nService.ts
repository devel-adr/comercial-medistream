
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZDZmOTk0OS1lNGVjLTRjOGUtODNmNC1mMTRhZGRjNGNlZWIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2NjU5NTA2fQ.oBiLr2WzPuCvkl5qeeVM9YLwHlRevjNnmdp6QjX5l5E';
const N8N_BASE_URL = 'https://develms.app.n8n.cloud/api/v1';

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
      console.log(`🔍 Fetching executions for workflow ${workflowId}...`);
      
      const url = `${N8N_BASE_URL}/executions?workflowId=${workflowId}&limit=${limit}`;
      console.log(`📡 Request URL: ${url}`);
      console.log(`🔑 Using API Key: ${N8N_API_KEY.substring(0, 20)}...`);
      
      const response = await fetch(url, { 
        headers: createHeaders(),
        method: 'GET'
      });
      
      console.log(`📊 Response status: ${response.status} ${response.statusText}`);
      console.log(`📋 Response headers:`, Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP error! status: ${response.status}, response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Executions data for ${workflowId}:`, data);
      console.log(`📈 Found ${data.data?.length || 0} executions`);
      
      return data.data || [];
    } catch (error) {
      console.error(`💥 Error fetching executions for workflow ${workflowId}:`, error);
      throw error;
    }
  },

  async getWorkflowInfo(workflowId: string): Promise<WorkflowInfo | null> {
    try {
      console.log(`🔍 Fetching workflow info for ${workflowId}...`);
      
      const url = `${N8N_BASE_URL}/workflows/${workflowId}`;
      console.log(`📡 Request URL: ${url}`);
      
      const response = await fetch(url, { 
        headers: createHeaders(),
        method: 'GET'
      });
      
      console.log(`📊 Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP error! status: ${response.status}, response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Workflow info for ${workflowId}:`, data);
      
      return data;
    } catch (error) {
      console.error(`💥 Error fetching workflow info for ${workflowId}:`, error);
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

    console.log('🚀 Starting to fetch all workflows status...');
    console.log('🎯 Target workflows:', workflows);

    for (const [workflowId, name] of Object.entries(workflows)) {
      try {
        console.log(`\n🔄 Processing ${name} (${workflowId})...`);
        const executions = await this.getWorkflowExecutions(workflowId, 5);
        results[name] = executions;
        console.log(`✅ Successfully fetched ${executions.length} executions for ${name}`);
        
        if (executions.length > 0) {
          console.log(`🔍 Latest execution for ${name}:`, {
            id: executions[0].id,
            status: executions[0].status,
            startedAt: executions[0].startedAt
          });
        }
      } catch (error) {
        console.error(`💥 Failed to fetch executions for ${name}:`, error);
        errors.push(`${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        results[name] = [];
      }
    }

    console.log('\n📋 Final results summary:');
    Object.entries(results).forEach(([name, executions]) => {
      console.log(`  ${name}: ${executions.length} executions`);
    });
    
    if (errors.length > 0) {
      console.warn('⚠️ Some workflows failed to load:', errors);
    } else {
      console.log('🎉 All workflows loaded successfully!');
    }

    return results;
  },

  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing n8n API connection...');
      console.log(`🔗 Base URL: ${N8N_BASE_URL}`);
      console.log(`🔑 API Key: ${N8N_API_KEY.substring(0, 20)}...`);
      
      const url = `${N8N_BASE_URL}/workflows`;
      const response = await fetch(url, { 
        headers: createHeaders(),
        method: 'GET'
      });
      
      console.log(`📊 Test connection response status: ${response.status} ${response.statusText}`);
      console.log(`📋 Response headers:`, Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ n8n API connection successful');
        console.log(`📈 Found ${data.data?.length || 0} workflows in account`);
        return true;
      } else {
        const errorText = await response.text();
        console.error('❌ n8n API connection failed:', response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error('💥 n8n API connection error:', error);
      return false;
    }
  }
};
