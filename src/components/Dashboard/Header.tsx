
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Bell, Settings, Search } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface HeaderProps {
  onToggleFilters: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleFilters }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-blue-100 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Dashboard Farmacéutico
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Análisis y seguimiento de medicamentos
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFilters}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </Button>

            <div className="relative">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500">
                  3
                </Badge>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>

            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
