import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Filter, BarChart3, Search, Plus } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useUnmetNeedsData } from '@/hooks/useUnmetNeedsData';
import { ThemeProvider } from '@/components/ThemeProvider';
import { toast } from "@/hooks/use-toast";
import { UnmetNeedsKPIs } from '@/components/UnmetNeeds/UnmetNeedsKPIs';
import { UnmetNeedsCards } from '@/components/UnmetNeeds/UnmetNeedsCards';
import { UnmetNeedsDetailModal } from '@/components/UnmetNeeds/UnmetNeedsDetailModal';
import { AddUnmetNeedModal } from '@/components/UnmetNeeds/AddUnmetNeedModal';

const formatOptions = ['Programa', 'Webinar', 'Podcast'];

const UnmetNeeds = () => {
  const [filters, setFilters] = useState({
    lab: '',
    area_terapeutica: '',
    farmaco: '',
    molecula: '',
    impacto: '',
    horizonte_temporal: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [formatSelections, setFormatSelections] = useState<Record<string, string>>({});
  const [selectedUnmetNeed, setSelectedUnmetNeed] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: unmetNeeds, loading, error, refresh } = useUnmetNeedsData();

  // Get unique values for filters
  const uniqueOptions = useMemo(() => ({
    labs: [...new Set(unmetNeeds.map(item => item.lab).filter(Boolean))].sort(),
    areasTerapeuticas: [...new Set(unmetNeeds.map(item => item.area_terapeutica).filter(Boolean))].sort(),
    farmacos: [...new Set(unmetNeeds.map(item => item.farmaco).filter(Boolean))].sort(),
    moleculas: [...new Set(unmetNeeds.map(item => item.molecula).filter(Boolean))].sort(),
    impactos: [...new Set(unmetNeeds.map(item => item.impacto).filter(Boolean))].sort(),
    horizontesTemporales: [...new Set(unmetNeeds.map(item => item.horizonte_temporal).filter(Boolean))].sort()
  }), [unmetNeeds]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = unmetNeeds.filter(item => {
      // Global search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const searchFields = [
          item.unmet_need,
          item.lab,
          item.area_terapeutica,
          item.farmaco,
          item.molecula,
          item.impacto,
          item.horizonte_temporal,
          item.racional,
          item.conclusion
        ];
        if (!searchFields.some(field => 
          field && field.toString().toLowerCase().includes(searchLower)
        )) {
          return false;
        }
      }

      // Specific filters
      if (filters.lab && item.lab !== filters.lab) return false;
      if (filters.area_terapeutica && item.area_terapeutica !== filters.area_terapeutica) return false;
      if (filters.farmaco && item.farmaco !== filters.farmaco) return false;
      if (filters.molecula && item.molecula !== filters.molecula) return false;
      if (filters.impacto && item.impacto !== filters.impacto) return false;
      if (filters.horizonte_temporal && item.horizonte_temporal !== filters.horizonte_temporal) return false;
      
      return true;
    });

    return filtered;
  }, [unmetNeeds, filters, searchTerm]);

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleFormatChange = (id: string, format: string) => {
    setFormatSelections(prev => ({
      ...prev,
      [id]: format
    }));
  };

  const handleViewDetails = (unmetNeed: any) => {
    setSelectedUnmetNeed(unmetNeed);
    setIsDetailModalOpen(true);
  };

  const handleGenerateTactics = () => {
    if (selectedRows.size === 0) {
      toast({
        title: "Error",
        description: "Por favor selecciona al menos una Unmet Need para generar tácticas.",
        variant: "destructive",
      });
      return;
    }

    // Check if all selected rows have a format assigned
    const missingFormats = Array.from(selectedRows).filter(id => !formatSelections[id]);
    if (missingFormats.length > 0) {
      toast({
        title: "Error",
        description: "Por favor asigna un formato a todas las Unmet Needs seleccionadas.",
        variant: "destructive",
      });
      return;
    }

    // Store selected data and navigate to Tactics
    const selectedData = Array.from(selectedRows).map(id => {
      const item = unmetNeeds.find(n => n.id_UN_table?.toString() === id);
      return {
        ...item,
        format: formatSelections[id]
      };
    });

    // Store in localStorage or context for Tactics page
    localStorage.setItem('selectedUnmetNeeds', JSON.stringify(selectedData));
    
    toast({
      title: "Éxito",
      description: `Se han preparado ${selectedRows.size} Unmet Needs para generar tácticas.`,
    });

    // Navigate to tactics (you can use react-router here)
    window.location.href = '/tactics';
  };

  const handleAddSuccess = () => {
    refresh(); // Refresh data after successful addition
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <Navigation />
          <div className="container mx-auto px-4 py-6">
            <Card className="w-full">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded"></div>
                  ))}
                </div>
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
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Unmet Needs Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Análisis completo de necesidades médicas no cubiertas
              </p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir Unmet Need
            </Button>
          </div>

          {/* KPIs */}
          <UnmetNeedsKPIs data={filteredAndSortedData} />

          {/* Enhanced Filters Panel */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-4">
                  <label className="text-sm font-medium mb-2 block">Búsqueda Global</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar en todos los campos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Laboratorio</label>
                  <Select
                    value={filters.lab}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, lab: value === 'all' ? '' : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar laboratorio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los laboratorios</SelectItem>
                      {uniqueOptions.labs.map((lab) => (
                        <SelectItem key={lab} value={lab}>{lab}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Área Terapéutica</label>
                  <Select
                    value={filters.area_terapeutica}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, area_terapeutica: value === 'all' ? '' : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las áreas</SelectItem>
                      {uniqueOptions.areasTerapeuticas.map((area) => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Fármaco</label>
                  <Select
                    value={filters.farmaco}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, farmaco: value === 'all' ? '' : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar fármaco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los fármacos</SelectItem>
                      {uniqueOptions.farmacos.map((farmaco) => (
                        <SelectItem key={farmaco} value={farmaco}>{farmaco}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Molécula</label>
                  <Select
                    value={filters.molecula}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, molecula: value === 'all' ? '' : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar molécula" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las moléculas</SelectItem>
                      {uniqueOptions.moleculas.map((molecula) => (
                        <SelectItem key={molecula} value={molecula}>{molecula}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Impacto</label>
                  <Select
                    value={filters.impacto}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, impacto: value === 'all' ? '' : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar impacto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los impactos</SelectItem>
                      {uniqueOptions.impactos.map((impacto) => (
                        <SelectItem key={impacto} value={impacto}>{impacto}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Horizonte Temporal</label>
                  <Select
                    value={filters.horizonte_temporal}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, horizonte_temporal: value === 'all' ? '' : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar horizonte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los horizontes</SelectItem>
                      {uniqueOptions.horizontesTemporales.map((horizonte) => (
                        <SelectItem key={horizonte} value={horizonte}>{horizonte}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards View */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Unmet Needs ({filteredAndSortedData.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UnmetNeedsCards
                data={filteredAndSortedData}
                onSelectForTactics={handleSelectRow}
                selectedIds={selectedRows}
                formatSelections={formatSelections}
                onFormatChange={handleFormatChange}
                formatOptions={formatOptions}
                onViewDetails={handleViewDetails}
              />
            </CardContent>
          </Card>

          {/* Generate Tactics Button */}
          <div className="flex justify-center">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Generar Tácticas
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Selecciona las Unmet Needs y asigna un formato para generar tácticas personalizadas.
                    </p>
                    {selectedRows.size > 0 && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                        {selectedRows.size} Unmet Need{selectedRows.size > 1 ? 's' : ''} seleccionada{selectedRows.size > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleGenerateTactics}
                    disabled={selectedRows.size === 0}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    GENERAR TÁCTICA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detail Modal */}
          <UnmetNeedsDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedUnmetNeed(null);
            }}
            unmetNeed={selectedUnmetNeed}
          />

          {/* Add Modal */}
          <AddUnmetNeedModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={handleAddSuccess}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default UnmetNeeds;
