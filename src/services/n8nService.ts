
import { supabase } from '@/integrations/supabase/client';

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

const makeN8nRequest = async (path: string, method: string = 'GET') => {
  console.log(`🌐 Making request to n8n proxy: ${method} ${path}`);
  
  try {
    const { data, error } = await supabase.functions.invoke('n8n-proxy', {
      body: { path, method }
    });

    if (error) {
      console.error('❌ Supabase function error:', error);
      throw new Error(`Supabase function error: ${error.message}`);
    }

    if (data.error) {
      console.error('❌ n8n API error:', data.error, data.details);
      throw new Error(`n8n API error: ${data.error}`);
    }

    console.log('✅ n8n request successful');
    return data;
  } catch (error) {
    console.error('💥 Error in makeN8nRequest:', error);
    throw error;
  }
};

export const n8nService = {
  async getWorkflowExecutions(workflowId: string, limit: number = 50): Promise<WorkflowExecution[]> {
    try {
      console.log(`🔍 Fetching executions for workflow ${workflowId} (limit: ${limit})...`);
      
      const path = `/executions?workflowId=${workflowId}&limit=${limit}&includeData=false`;
      const data = await makeN8nRequest(path);
      
      console.log(`✅ Executions fetched successfully:`, {
        workflowId,
        count: data.data?.length || 0,
        sample: data.data?.[0] ? {
          id: data.data[0].id,
          status: data.data[0].finished ? (data.data[0].stoppedAt ? 'success' : 'canceled') : 'running',
          startedAt: data.data[0].startedAt
        } : null
      });
      
      // Map the response to match our interface, properly handling canceled executions
      const executions = data.data?.map((execution: any) => {
        let status = 'running';
        
        if (execution.finished) {
          // If finished is true, check if it was successful or canceled
          if (execution.stoppedAt && execution.waitTill === null) {
            status = 'success';
          } else if (execution.stoppedAt) {
            // If it has stoppedAt but didn't complete successfully, it was likely canceled
            status = 'canceled';
          }
        } else if (execution.waitTill) {
          status = 'waiting';
        }
        
        // Check for error status in the execution data
        if (execution.status === 'error' || (execution.data && execution.data.resultData && execution.data.resultData.error)) {
          status = 'error';
        }
        
        return {
          ...execution,
          status
        };
      }) || [];
      
      console.log(`📊 Status breakdown:`, {
        total: executions.length,
        running: executions.filter(e => e.status === 'running').length,
        success: executions.filter(e => e.status === 'success').length,
        error: executions.filter(e => e.status === 'error').length,
        canceled: executions.filter(e => e.status === 'canceled').length,
        waiting: executions.filter(e => e.status === 'waiting').length
      });
      
      return executions;
    } catch (error) {
      console.error(`💥 Error fetching executions for workflow ${workflowId}:`, error);
      throw error;
    }
  },

  async getWorkflowInfo(workflowId: string): Promise<WorkflowInfo | null> {
    try {
      console.log(`🔍 Fetching workflow info for ${workflowId}...`);
      
      const path = `/workflows/${workflowId}`;
      const data = await makeN8nRequest(path);
      
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
        const executions = await this.getWorkflowExecutions(workflowId, 50); // Increased from 5 to 50
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
      console.log('🧪 Testing n8n API connection via Supabase proxy...');
      
      const path = '/workflows?limit=1';
      const data = await makeN8nRequest(path);
      
      console.log('✅ n8n API connection successful!');
      console.log(`📈 API is working, found ${data.data?.length || 0} workflows in first page`);
      return true;
    } catch (error) {
      console.error('💥 n8n API connection error:', error);
      return false;
    }
  }
};
