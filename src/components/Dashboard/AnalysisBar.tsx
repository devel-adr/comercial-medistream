
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

  const handleAnalysisClick = () => {
    window.open('https://develms.app.n8n.cloud/webhook/unmet_needs', '_blank');
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-6">
          <h2 className="text-xl font-bold mb-2">Búsqueda de Fármacos</h2>
          <p className="text-purple-100 mb-4">
            Busca información sobre fármacos y análisis de mercado
          </p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar fármacos, moléculas, laboratorios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
              />
            </div>
            <Button 
              type="submit"
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              Buscar
            </Button>
          </form>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="text-4xl opacity-60">
            🔬
          </div>
          <button
            onClick={handleAnalysisClick}
            className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors text-sm"
          >
            Unmet Needs
          </button>
        </div>
      </div>
    </div>
  );
};
