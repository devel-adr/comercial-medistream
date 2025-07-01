
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AnalysisBarProps {
  onSearch?: (searchTerm: string) => void;
}

export const AnalysisBar: React.FC<AnalysisBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Análisis de Laboratorio</h2>
          <p className="text-blue-100 mb-4">
            Introduce información del laboratorio o medicamento para análisis automático
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Ej: Análisis de eficacia del medicamento X en ensayos fase III..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
            />
          </div>
          <Button 
            type="submit"
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            Analizar
          </Button>
        </form>
      </div>
    </div>
  );
};
