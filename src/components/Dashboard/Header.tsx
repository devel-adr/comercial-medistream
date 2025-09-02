
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Search, Activity, Newspaper } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { WorkflowProgressPanel } from './WorkflowProgressPanel';
import { NewsModal } from './NewsModal';
import { useWorkflowStatus } from '@/hooks/useWorkflowStatus';

interface HeaderProps {
  onToggleFilters: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleFilters }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWorkflowPanelOpen, setIsWorkflowPanelOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const { workflowStatuses } = useWorkflowStatus();

  // Count running workflows
  const runningCount = Object.values(workflowStatuses).reduce((count, executions) => {
    const hasRunning = executions.some(exec => exec.status === 'running');
    return count + (hasRunning ? 1 : 0);
  }, 0);

  const handleWorkflowClick = () => {
    setIsWorkflowPanelOpen(true);
  };

  const handleNewsClick = () => {
    setIsNewsModalOpen(true);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-blue-100 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    MEDISTREAM
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Derechos reservados a Medistream™
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleNewsClick}
                  className="relative"
                >
                  <Newspaper className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white animate-pulse">
                    NEW
                  </Badge>
                </Button>
              </div>

              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleWorkflowClick}
                  className="relative"
                >
                  <Activity className="w-5 h-5" />
                  {runningCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-blue-500 animate-pulse">
                      {runningCount}
                    </Badge>
                  )}
                </Button>
              </div>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      
      <WorkflowProgressPanel
        isOpen={isWorkflowPanelOpen}
        onClose={() => setIsWorkflowPanelOpen(false)}
      />

      <NewsModal
        isOpen={isNewsModalOpen}
        onClose={() => setIsNewsModalOpen(false)}
      />
    </>
  );
};
