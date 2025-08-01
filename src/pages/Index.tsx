
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/Dashboard/Header';
import { AnalysisBar } from '@/components/Dashboard/AnalysisBar';
import { StatsCards } from '@/components/Dashboard/StatsCards';
import { MedicationsTable } from '@/components/Dashboard/MedicationsTable';
import { SimpleFiltersPanel } from '@/components/Dashboard/SimpleFiltersPanel';
import { AddMedicationModal } from '@/components/Dashboard/AddMedicationModal';
import { FeedbackAssistant } from '@/components/FeedbackAssistant';
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
    refresh(); // Refresh data after successful addition
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        
        <Header onToggleFilters={() => {}} />
        
        <div className="container mx-auto px-4 py-6 space-y-6">
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
                Añadir Indicación
              </Button>
            </div>
          </div>
          
          <StatsCards medications={medications} loading={loading} />
          
          <SimpleFiltersPanel 
            onFiltersChange={setActiveFilters}
            medications={medications}
          />
          
          <MedicationsTable 
            medications={medications}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilters={activeFilters}
            onDataChange={refresh}
          />
        </div>
        
        <AddMedicationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddSuccess}
        />
        
        <FeedbackAssistant />
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Index;
