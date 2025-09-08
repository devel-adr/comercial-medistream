
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Navigation } from '@/components/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Search, BarChart3 } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
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
  favoritos?: string;
}

const Tactics = () => {
  const { data, loading, error } = usePharmaTacticsData();
  const { favorites, toggleFavorite, isFavorite } = useTacticsFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<TacticsFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter the data based on current filters
  const filteredData = React.useMemo(() => {
    let filtered = data || [];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const searchableFields = [
          item.unmet_need,
          item.laboratorio,
          item.area_terapeutica,
          item.farmaco,
          item.molecula,
          item.formato
        ];
        return searchableFields.some(field => 
          field && field.toString().toLowerCase().includes(searchLower)
        );
      });
    }

    if (activeFilters.laboratorio) {
      filtered = filtered.filter(item => item.laboratorio === activeFilters.laboratorio);
    }
    if (activeFilters.areaTerapeutica) {
      filtered = filtered.filter(item => item.area_terapeutica === activeFilters.areaTerapeutica);
    }
    if (activeFilters.farmaco) {
      filtered = filtered.filter(item => item.farmaco === activeFilters.farmaco);
    }
    if (activeFilters.molecula) {
      filtered = filtered.filter(item => item.molecula === activeFilters.molecula);
    }
    if (activeFilters.formato) {
      filtered = filtered.filter(item => item.formato === activeFilters.formato);
    }
    if (activeFilters.favoritos === 'si') {
      filtered = filtered.filter(item => isFavorite(item.id_tabla?.toString() || ''));
    }
    
    return filtered;
  }, [data, searchTerm, activeFilters, isFavorite]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, searchTerm]);

  // Paginate the filtered data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
          <Card className="shadow-lg">
            <TacticsCards
              data={paginatedData}
              loading={loading}
              searchTerm=""
              selectedLab=""
              selectedArea=""
              selectedFarmaco=""
              selectedMolecula=""
              selectedFormat=""
              showOnlyFavorites={false}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-6 pt-0 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                          }
                        }}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      const showPage = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                      
                      if (!showPage) {
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      }
                      
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1);
                          }
                        }}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Tactics;
