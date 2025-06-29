
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/Dashboard/Header';
import { AnalysisBar } from '@/components/Dashboard/AnalysisBar';
import { StatsCards } from '@/components/Dashboard/StatsCards';
import { MedicationsTable } from '@/components/Dashboard/MedicationsTable';
import { FiltersPanel } from '@/components/Dashboard/FiltersPanel';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { ThemeProvider } from '@/components/ThemeProvider';

const Index = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  
  const { data: medications, loading, error, refresh } = useSupabaseData();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Header onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)} />
        
        <div className="container mx-auto px-4 py-6 space-y-6">
          <AnalysisBar />
          
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
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Index;
