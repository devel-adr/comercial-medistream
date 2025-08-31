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
  async getWorkflowExecutions(workflowId: string, limit: number = 10): Promise<WorkflowExecution[]> {
    try {
      console.log(`🔍 Fetching executions for workflow ${workflowId} (limit: ${limit})...`);
      
      const path = `/executions?workflowId=${workflowId}&limit=${limit}&includeData=false`;
      const data = await makeN8nRequest(path);
      
      console.log(`✅ Executions fetched successfully:`, {
        workflowId,
        count: data.data?.length || 0,
        sample: data.data?.[0] ? {
          id: data.data[0].id,
          finished: data.data[0].finished,
          stoppedAt: data.data[0].stoppedAt,
          waitTill: data.data[0].waitTill,
          startedAt: data.data[0].startedAt,
          status: data.data[0].status
        } : null
      });
      
      // Map the response to match our interface with corrected status detection
      const executions = data.data?.map((execution: any) => {
        let status: 'running' | 'success' | 'error' | 'waiting' | 'canceled' | 'new' = 'new';
        
        console.log(`🔍 Analyzing execution ${execution.id}:`, {
          finished: execution.finished,
          stoppedAt: execution.stoppedAt,
          waitTill: execution.waitTill,
          mode: execution.mode,
          rawStatus: execution.status
        });
        
        // Check the raw status field first if it exists and is meaningful
        if (execution.status === 'running' || execution.status === 'new') {
          status = 'running';
          console.log(`📊 Execution ${execution.id} is RUNNING (explicit status: ${execution.status})`);
        }
        else if (execution.status === 'success') {
          status = 'success';
          console.log(`📊 Execution ${execution.id} is SUCCESS (explicit status)`);
        }
        else if (execution.status === 'error') {
          status = 'error';
          console.log(`📊 Execution ${execution.id} is ERROR (explicit status)`);
        }
        else if (execution.status === 'canceled' || execution.status === 'cancelled') {
          status = 'canceled';
          console.log(`📊 Execution ${execution.id} is CANCELED (explicit status)`);
        }
        else if (execution.status === 'waiting') {
          status = 'waiting';
          console.log(`📊 Execution ${execution.id} is WAITING (explicit status)`);
        }
        // Fallback to analyzing the execution state if no explicit status
        else {
          // Check if it's waiting
          if (execution.waitTill && !execution.finished) {
            status = 'waiting';
            console.log(`📊 Execution ${execution.id} is WAITING (has waitTill: ${execution.waitTill})`);
          }
          // Check if it's finished
          else if (execution.finished === true) {
            // If finished is true, determine success or error
            if (execution.data && execution.data.resultData && execution.data.resultData.error) {
              status = 'error';
              console.log(`📊 Execution ${execution.id} FINISHED with ERROR`);
            } else {
              status = 'success';
              console.log(`📊 Execution ${execution.id} FINISHED successfully`);
            }
          }
          // Check if it's currently running (not finished and no explicit stop)
          else if (execution.finished === false) {
            // If not finished, check if it has been stopped/canceled
            if (execution.stoppedAt) {
              // Check if it was stopped recently (within last 5 minutes) - might still be running
              const stoppedTime = new Date(execution.stoppedAt).getTime();
              const now = new Date().getTime();
              const timeDiff = now - stoppedTime;
              const fiveMinutes = 5 * 60 * 1000;
              
              if (timeDiff < fiveMinutes && execution.mode === 'manual') {
                // Recently stopped manual execution might still be running
                status = 'running';
                console.log(`📊 Execution ${execution.id} might still be RUNNING (recently stopped: ${timeDiff}ms ago)`);
              } else {
                status = 'canceled';
                console.log(`📊 Execution ${execution.id} was CANCELED (stopped at: ${execution.stoppedAt})`);
              }
            } else {
              // Not finished and no stoppedAt = definitely running
              status = 'running';
              console.log(`📊 Execution ${execution.id} is RUNNING (not finished, no stoppedAt)`);
            }
          }
          else {
            // Default fallback
            status = 'new';
            console.log(`📊 Execution ${execution.id} defaulted to NEW status`);
          }
        }
        
        console.log(`📊 Execution ${execution.id} final status: ${status}`);
        
        return {
          ...execution,
          status
        };
      }) || [];
      
      // Sort executions by startedAt descending (most recent first)
      executions.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
      
      console.log(`📊 Status breakdown for ${workflowId}:`, {
        total: executions.length,
        running: executions.filter(e => e.status === 'running').length,
        success: executions.filter(e => e.status === 'success').length,
        error: executions.filter(e => e.status === 'error').length,
        canceled: executions.filter(e => e.status === 'canceled').length,
        waiting: executions.filter(e => e.status === 'waiting').length,
        new: executions.filter(e => e.status === 'new').length
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
        const executions = await this.getWorkflowExecutions(workflowId, 10); // Limited to 10 executions per workflow
        results[name] = executions;
        console.log(`✅ Successfully fetched ${executions.length} executions for ${name}`);
        
        if (executions.length > 0) {
          console.log(`🔍 Latest execution for ${name}:`, {
            id: executions[0].id,
            status: executions[0].status,
            startedAt: executions[0].startedAt,
            finished: executions[0].finished,
            stoppedAt: executions[0].stoppedAt
          });
        }
        
        // Log running executions specifically
        const runningExecs = executions.filter(e => e.status === 'running');
        if (runningExecs.length > 0) {
          console.log(`🏃‍♂️ Running executions for ${name}:`, runningExecs.map(e => ({
            id: e.id,
            startedAt: e.startedAt,
            finished: e.finished,
            stoppedAt: e.stoppedAt,
            status: e.status
          })));
        }
      } catch (error) {
        console.error(`💥 Failed to fetch executions for ${name}:`, error);
        errors.push(`${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        results[name] = [];
      }
    }

    console.log('\n📋 Final results summary:');
    Object.entries(results).forEach(([name, executions]) => {
      const running = executions.filter(e => e.status === 'running').length;
      console.log(`  ${name}: ${executions.length} executions (${running} running)`);
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
