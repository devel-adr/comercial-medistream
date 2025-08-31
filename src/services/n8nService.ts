
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
  'X-Requested-With': 'XMLHttpRequest'
});

const makeRequest = async (url: string, options: RequestInit = {}) => {
  console.log(`🌐 Making request to: ${url}`);
  
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...createHeaders(),
      ...options.headers,
    },
    mode: 'cors',
    credentials: 'omit',
  };

  console.log(`📋 Request options:`, {
    method: requestOptions.method || 'GET',
    headers: requestOptions.headers,
    mode: requestOptions.mode,
    credentials: requestOptions.credentials
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(url, {
      ...requestOptions,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log(`📊 Response received:`, {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    return response;
  } catch (error) {
    console.error(`💥 Network error for ${url}:`, error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('La conexión ha tardado demasiado. Verifica tu conexión a internet.');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('No se puede conectar con el servidor n8n. Posible problema de CORS o conectividad.');
      }
    }
    
    throw error;
  }
};

export const n8nService = {
  async getWorkflowExecutions(workflowId: string, limit: number = 10): Promise<WorkflowExecution[]> {
    try {
      console.log(`🔍 Fetching executions for workflow ${workflowId} (limit: ${limit})...`);
      
      const url = `${N8N_BASE_URL}/executions?workflowId=${workflowId}&limit=${limit}`;
      const response = await makeRequest(url, { method: 'GET' });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API error! Status: ${response.status}, Response: ${errorText}`);
        
        if (response.status === 401) {
          throw new Error('API Key inválida. Verifica las credenciales.');
        }
        if (response.status === 404) {
          throw new Error(`Workflow ${workflowId} no encontrado.`);
        }
        if (response.status === 403) {
          throw new Error('Sin permisos para acceder a este workflow.');
        }
        
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Executions fetched successfully:`, {
        workflowId,
        count: data.data?.length || 0,
        sample: data.data?.[0] ? {
          id: data.data[0].id,
          status: data.data[0].status,
          startedAt: data.data[0].startedAt
        } : null
      });
      
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
      const response = await makeRequest(url, { method: 'GET' });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API error! Status: ${response.status}, Response: ${errorText}`);
        
        if (response.status === 404) {
          console.warn(`Workflow ${workflowId} not found`);
          return null;
        }
        
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Workflow info fetched:`, {
        id: data.id,
        name: data.name,
        active: data.active
      });
      
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
      
      const url = `${N8N_BASE_URL}/workflows?limit=1`;
      const response = await makeRequest(url, { method: 'GET' });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ n8n API connection successful!');
        console.log(`📈 API is working, found ${data.data?.length || 0} workflows in first page`);
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
