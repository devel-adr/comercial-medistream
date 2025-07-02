
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Filter } from 'lucide-react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { UnmetNeedsKPIs } from '@/components/UnmetNeeds/UnmetNeedsKPIs';
import { UnmetNeedsCards } from '@/components/UnmetNeeds/UnmetNeedsCards';
import { UnmetNeedsFiltersPanel } from '@/components/UnmetNeeds/UnmetNeedsFiltersPanel';
import { AddDataModal } from '@/components/Modals/AddDataModal';
import { useUnmetNeedsData } from '@/hooks/useUnmetNeedsData';

const UnmetNeeds = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const { data: unmetNeedsData, loading, refresh } = useUnmetNeedsData();

  const handleAddSuccess = () => {
    refresh(); // Refresh data after adding new item
  };

  // Filtrar datos basado en los filtros activos
  const filteredData = unmetNeedsData.filter(item => {
    return Object.entries(activeFilters).every(([key, value]) => {
      if (!value) return true;
      
      switch (key) {
        case 'areaTerapeutica':
          return item.area_terapeutica === value;
        case 'farmaco':
          return item.farmaco === value;
        case 'lab':
          return item.lab === value;
        case 'impacto':
          return item.impacto === value;
        case 'horizonteTemporal':
          return item.horizonte_temporal === value;
        default:
          return true;
      }
    });
  });

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Necesidades No Cubiertas
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Análisis de oportunidades terapéuticas no satisfechas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </Button>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Necesidad No Cubierta
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <UnmetNeedsKPIs data={filteredData} loading={loading} />
            
            <div className="flex gap-6">
              <UnmetNeedsFiltersPanel 
                isOpen={isFiltersOpen}
                onClose={() => setIsFiltersOpen(false)}
                onFiltersChange={setActiveFilters}
                data={unmetNeedsData}
              />
              
              <div className="flex-1">
                <UnmetNeedsCards data={filteredData} loading={loading} />
              </div>
            </div>
          </div>
        </div>

        <AddDataModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          type="unmetNeeds"
          onSuccess={handleAddSuccess}
        />
      </div>
    </ThemeProvider>
  );
};

export default UnmetNeeds;
