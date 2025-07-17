
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Navigation } from '@/components/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Search, BarChart3 } from 'lucide-react';
import { usePharmaTacticsData } from '@/hooks/usePharmaTacticsData';
import { useTacticsFavorites } from '@/hooks/useTacticsFavorites';
import { TacticsKPIs } from '@/components/Tactics/TacticsKPIs';
import { TacticsCards } from '@/components/Tactics/TacticsCards';
import { DynamicFiltersPanel } from '@/components/Tactics/DynamicFiltersPanel';

interface TacticsFilters {
  laboratorio?: string;
  areaTerapeutica?: string;
  farmaco?: string;
  molecula?: string;
  formato?: string;
  favoritos?: boolean;
}

const Tactics = () => {
  const { data, loading, error } = usePharmaTacticsData();
  const { favorites, toggleFavorite, isFavorite } = useTacticsFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<TacticsFilters>({});

  if (error) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <Navigation />
          <div className="container mx-auto px-4 py-6">
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <h3 className="text-lg font-semibold mb-2 text-red-600">Error al cargar las tactics</h3>
                <p className="text-gray-600 dark:text-gray-300">{error}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tactics
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gestión y visualización de tactics farmacéuticas con filtros dinámicos
            </p>
          </div>

          <TacticsKPIs data={data} loading={loading} />

          {/* Search Section */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar tactics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Filters */}
          <DynamicFiltersPanel 
            onFiltersChange={setActiveFilters}
            tactics={data}
          />

          {/* Tactics Cards */}
          <TacticsCards
            data={data}
            loading={loading}
            searchTerm={searchTerm}
            selectedLab={activeFilters.laboratorio || ''}
            selectedArea={activeFilters.areaTerapeutica || ''}
            selectedFormat={activeFilters.formato || ''}
            showOnlyFavorites={activeFilters.favoritos || false}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Tactics;
