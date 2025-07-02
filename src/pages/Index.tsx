
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Header } from '@/components/Dashboard/Header';
import { AnalysisBar } from '@/components/Dashboard/AnalysisBar';
import { StatsCards } from '@/components/Dashboard/StatsCards';
import { MedicationsTable } from '@/components/Dashboard/MedicationsTable';
import { FiltersPanel } from '@/components/Dashboard/FiltersPanel';
import { AddDataModal } from '@/components/Modals/AddDataModal';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';

const Index = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  
  const { data: medications, loading, error, refresh } = useSupabaseData();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleAddSuccess = () => {
    refresh(); // Refresh data after adding new item
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        
        <Header onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)} />
        
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <AnalysisBar onSearch={handleSearch} />
            </div>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 flex-shrink-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Medicamento
            </Button>
          </div>
          
          <StatsCards medications={medications} loading={loading} />
          
          <div className="flex gap-6">
            <FiltersPanel 
              isOpen={isFiltersOpen}
              onClose={() => setIsFiltersOpen(false)}
              onFiltersChange={setActiveFilters}
              medications={medications}
            />
            
            <div className="flex-1">
              <MedicationsTable 
                medications={medications}
                loading={loading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                activeFilters={activeFilters}
              />
            </div>
          </div>
        </div>
        
        <AddDataModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          type="drugDealer"
          onSuccess={handleAddSuccess}
        />
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Index;
