
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Search, BarChart3 } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { WorkflowProgressPanel } from './WorkflowProgressPanel';
import { useWorkflowStatus } from '@/hooks/useWorkflowStatus';

interface HeaderProps {
  onToggleFilters: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleFilters }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProgressPanelOpen, setIsProgressPanelOpen] = useState(false);
  const { workflowStatuses } = useWorkflowStatus();

  const runningWorkflows = workflowStatuses.filter(w => w.isRunning).length;

  const handleProgressClick = () => {
    setIsProgressPanelOpen(true);
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
                  onClick={handleProgressClick}
                  className="relative"
                >
                  <BarChart3 className="w-5 h-5" />
                  {runningWorkflows > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-blue-500 animate-pulse">
                      {runningWorkflows}
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
        isOpen={isProgressPanelOpen}
        onClose={() => setIsProgressPanelOpen(false)}
      />
    </>
  );
};
