
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, Search, Activity } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { WorkflowProgressPanel } from './WorkflowProgressPanel';
import { useWorkflowStatus } from '@/hooks/useWorkflowStatus';

interface HeaderProps {
  onToggleFilters: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleFilters }) => {
  const { workflows, loading, refresh } = useWorkflowStatus();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProgressPanelOpen, setIsProgressPanelOpen] = useState(false);

  // Calculate running workflows count for badge
  const runningWorkflowsCount = workflows.filter(w => w.isRunning).length;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              DrugDealer Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Gestión inteligente de datos farmacéuticos
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Search className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Búsqueda inteligente disponible
              </span>
            </div>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProgressPanelOpen(!isProgressPanelOpen)}
                className="relative p-2"
              >
                <Activity className="w-5 h-5" />
                {runningWorkflowsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {runningWorkflowsCount}
                  </Badge>
                )}
              </Button>
            </div>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <WorkflowProgressPanel
        isOpen={isProgressPanelOpen}
        onClose={() => setIsProgressPanelOpen(false)}
        workflows={workflows}
        onRefresh={refresh}
      />
    </div>
  );
};
