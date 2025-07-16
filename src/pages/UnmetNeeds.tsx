import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Filter, BarChart3, Search, Plus, Star } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useUnmetNeedsData } from '@/hooks/useUnmetNeedsData';
import { ThemeProvider } from '@/components/ThemeProvider';
import { toast } from "@/hooks/use-toast";
import { UnmetNeedsKPIs } from '@/components/UnmetNeeds/UnmetNeedsKPIs';
import { UnmetNeedsCards } from '@/components/UnmetNeeds/UnmetNeedsCards';
import { UnmetNeedsDetailModal } from '@/components/UnmetNeeds/UnmetNeedsDetailModal';
import { AddUnmetNeedModal } from '@/components/UnmetNeeds/AddUnmetNeedModal';
import { CustomFieldsForm } from '@/components/UnmetNeeds/CustomFieldsForm';

const formatOptions = ['Programa', 'Webinar', 'Podcast', 'Personalizado (DOCS only)'];

const UnmetNeeds = () => {
  const [filters, setFilters] = useState({
    lab: '',
    area_terapeutica: '',
    farmaco: '',
    molecula: '',
    impacto: '',
    horizonte_temporal: '',
    favoritos: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [formatSelections, setFormatSelections] = useState<Record<string, string>>({});
  const [selectedUnmetNeed, setSelectedUnmetNeed] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGeneratingTactics, setIsGeneratingTactics] = useState(false);
  const [localFavorites, setLocalFavorites] = useState<Set<string>>(new Set());
  const [customFields, setCustomFields] = useState<Record<string, {
    capitulos: string;
    modulos: string;
    subtemas: string;
    numeroExperto: string;
    formato: string;
  }>>({});

  const { data: unmetNeeds, loading, error, refresh, toggleFavorite, deleteUnmetNeed } = useUnmetNeedsData();

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('unmetNeedsFavorites');
    if (savedFavorites) {
      try {
        const favoritesArray = JSON.parse(savedFavorites);
        setLocalFavorites(new Set(favoritesArray));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever localFavorites changes
  useEffect(() => {
    localStorage.setItem('unmetNeedsFavorites', JSON.stringify(Array.from(localFavorites)));
  }, [localFavorites]);

  const handleToggleLocalFavorite = (id: string) => {
    setLocalFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
        toast({
          title: "Favorito removido",
          description: "La Unmet Need ha sido removida de favoritos.",
        });
      } else {
        newFavorites.add(id);
        toast({
          title: "Favorito añadido",
          description: "La Unmet Need ha sido añadida a favoritos.",
        });
      }
      return newFavorites;
    });
  };

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
      
      // Favoritos filter using local favorites
      const itemId = item.id_UN_table?.toString();
      if (filters.favoritos === 'si' && !localFavorites.has(itemId)) return false;
      if (filters.favoritos === 'no' && localFavorites.has(itemId)) return false;
      
      return true;
    });

    return filtered;
  }, [unmetNeeds, filters, searchTerm, localFavorites]);

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
      // Clear custom fields when deselecting
      if (customFields[id]) {
        setCustomFields(prev => {
          const newFields = { ...prev };
          delete newFields[id];
          return newFields;
        });
      }
    }
    setSelectedRows(newSelected);
  };

  const handleFormatChange = (id: string, format: string) => {
    setFormatSelections(prev => ({
      ...prev,
      [id]: format
    }));

    // Clear custom fields if switching away from Personalizado format
    if (format !== 'Personalizado (DOCS only)' && customFields[id]) {
      setCustomFields(prev => {
        const newFields = { ...prev };
        delete newFields[id];
        return newFields;
      });
    }
  };

  const handleCustomFieldsChange = (id: string, fields: {
    capitulos: string;
    modulos: string;
    subtemas: string;
    numeroExperto: string;
    formato: string;
  }) => {
    setCustomFields(prev => ({
      ...prev,
      [id]: fields
    }));
  };

  const handleViewDetails = (unmetNeed: any) => {
    setSelectedUnmetNeed(unmetNeed);
    setIsDetailModalOpen(true);
  };

  const handleToggleFavorite = async (unmetNeed: any) => {
    try {
      await toggleFavorite(unmetNeed);
      toast({
        title: "Éxito",
        description: `Unmet Need ${unmetNeed.favorito ? 'removida de' : 'añadida a'} favoritos.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el estado de favorito.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (unmetNeed: any) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta Unmet Need? Esta acción no se puede deshacer.')) {
      try {
        await deleteUnmetNeed(unmetNeed);
        toast({
          title: "Éxito",
          description: "Unmet Need eliminada correctamente.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al eliminar la Unmet Need.",
          variant: "destructive",
        });
      }
    }
  };

  const hasCustomFormat = Array.from(selectedRows).some(id => 
    formatSelections[id] === 'Personalizado (DOCS only)'
  );

  const areCustomFieldsComplete = () => {
    const customFormatItems = Array.from(selectedRows).filter(id => 
      formatSelections[id] === 'Personalizado (DOCS only)'
    );
    
    return customFormatItems.every(id => {
      const fields = customFields[id];
      return fields && 
        fields.capitulos.trim() !== '' &&
        fields.modulos.trim() !== '' &&
        fields.subtemas.trim() !== '' &&
        fields.numeroExperto.trim() !== '' &&
        fields.formato.trim() !== '';
    });
  };

  const handleGenerateTactics = async () => {
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

    // Check custom fields completion for Personalizado format
    if (hasCustomFormat && !areCustomFieldsComplete()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos personalizados para el formato 'Personalizado (DOCS only)'.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingTactics(true);

    try {
      // Prepare data for webhook with individual variables
      const selectedItems = Array.from(selectedRows).map(id => {
        const item = unmetNeeds.find(n => n.id_UN_table?.toString() === id);
        return item;
      });

      // Create individual variables for each selected Unmet Need including ID
      const webhookData = {
        timestamp: new Date().toISOString(),
        total_items: selectedRows.size
      };

      // Add individual variables for each selected Unmet Need including ID
      selectedItems.forEach((item, index) => {
        const itemId = item?.id_UN_table?.toString();
        webhookData[`id_unmet_need_${index + 1}`] = item?.id_UN_table || '';
        webhookData[`laboratorio_${index + 1}`] = item?.lab || '';
        webhookData[`area_terapeutica_${index + 1}`] = item?.area_terapeutica || '';
        webhookData[`farmaco_${index + 1}`] = item?.farmaco || '';
        webhookData[`molecula_${index + 1}`] = item?.molecula || '';
        webhookData[`horizonte_${index + 1}`] = item?.horizonte_temporal || '';
        webhookData[`unmet_need_${index + 1}`] = item?.unmet_need || '';
        webhookData[`racional_${index + 1}`] = item?.racional || '';
        webhookData[`oportunidad_estrategica_${index + 1}`] = item?.oportunidad_estrategica || '';
        webhookData[`conclusion_${index + 1}`] = item?.conclusion || '';
        webhookData[`formato_${index + 1}`] = formatSelections[itemId] || '';
        webhookData[`impacto_${index + 1}`] = item?.impacto || '';

        // Add custom fields if format is Personalizado (DOCS only)
        if (formatSelections[itemId] === 'Personalizado (DOCS only)' && customFields[itemId]) {
          const customFieldsData = customFields[itemId];
          webhookData[`capitulos_${index + 1}`] = customFieldsData.capitulos;
          webhookData[`modulos_${index + 1}`] = customFieldsData.modulos;
          webhookData[`subtemas_${index + 1}`] = customFieldsData.subtemas;
          webhookData[`numero_experto_${index + 1}`] = customFieldsData.numeroExperto;
          webhookData[`formato_personalizado_${index + 1}`] = customFieldsData.formato;
        }
      });

      console.log('Sending data to webhook:', webhookData);

      // Send data to webhook
      const response = await fetch('https://develms.app.n8n.cloud/webhook/tactics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Store selected data locally for Tactics page
      localStorage.setItem('selectedUnmetNeeds', JSON.stringify(Array.from(selectedRows).map(id => {
        const item = unmetNeeds.find(n => n.id_UN_table?.toString() === id);
        const itemId = item?.id_UN_table?.toString();
        
        // Create a properly typed result object
        const result: any = {
          ...item,
          format: formatSelections[id]
        };

        // Add custom fields if applicable
        if (formatSelections[id] === 'Personalizado (DOCS only)' && customFields[id]) {
          result.customFields = customFields[id];
        }

        return result;
      })));
      
      toast({
        title: "Éxito",
        description: `Se han enviado ${selectedRows.size} Unmet Needs al webhook y se han preparado las tácticas.`,
      });

      // Navigate to tactics page
      window.location.href = '/tactics';

    } catch (error) {
      console.error('Error sending data to webhook:', error);
      toast({
        title: "Error",
        description: "Error al enviar los datos al webhook. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTactics(false);
    }
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
          <div className="relative">
            <div className="absolute right-0 top-0">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Añadir Unmet Need
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Unmet Needs Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Análisis completo de necesidades médicas no cubiertas
              </p>
            </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <label className="text-sm font-medium mb-2 block">Favoritos</label>
                  <Select
                    value={filters.favoritos}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, favoritos: value === 'all' ? '' : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="si">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          Solo Favoritos
                        </div>
                      </SelectItem>
                      <SelectItem value="no">Sin Favoritos</SelectItem>
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
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
                localFavorites={localFavorites}
                onToggleLocalFavorite={handleToggleLocalFavorite}
              />
            </CardContent>
          </Card>

          {/* Custom Fields Form */}
          {hasCustomFormat && (
            <CustomFieldsForm
              selectedRows={selectedRows}
              formatSelections={formatSelections}
              customFields={customFields}
              onCustomFieldsChange={handleCustomFieldsChange}
              unmetNeeds={unmetNeeds}
            />
          )}

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
                    {hasCustomFormat && !areCustomFieldsComplete() && (
                      <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                        Completa los campos personalizados para continuar
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleGenerateTactics}
                    disabled={selectedRows.size === 0 || isGeneratingTactics || (hasCustomFormat && !areCustomFieldsComplete())}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {isGeneratingTactics ? 'ENVIANDO...' : 'GENERAR TÁCTICA'}
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
