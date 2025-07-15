
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/Dashboard/Header';
import { AnalysisBar } from '@/components/Dashboard/AnalysisBar';
import { SimplifiedStatsCards } from '@/components/Dashboard/SimplifiedStatsCards';
import { EnhancedMedicationsTable } from '@/components/Dashboard/EnhancedMedicationsTable';
import { SimpleFiltersPanel } from '@/components/Dashboard/SimpleFiltersPanel';
import { AddMedicationModal } from '@/components/Dashboard/AddMedicationModal';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { data: medications, loading, error, refresh } = useSupabaseData();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleAddSuccess = () => {
    refresh();
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Drug Dealer Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gestión y análisis de medicamentos
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <AnalysisBar onSearch={handleSearch} />
            </div>
            <div className="flex-shrink-0">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Añadir Medicamento
              </Button>
            </div>
          </div>
          
          <SimplifiedStatsCards medications={medications} loading={loading} />
          
          <SimpleFiltersPanel 
            onFiltersChange={setActiveFilters}
            medications={medications}
          />
          
          <EnhancedMedicationsTable 
            medications={medications}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilters={activeFilters}
            onRefresh={refresh}
          />
        </div>
        
        <AddMedicationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddSuccess}
        />
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Index;
