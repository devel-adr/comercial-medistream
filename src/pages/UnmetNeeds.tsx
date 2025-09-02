
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Filter, BarChart3, Search, Plus, Star, ChevronDown } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useUnmetNeedsData } from '@/hooks/useUnmetNeedsData';
import { ThemeProvider } from '@/components/ThemeProvider';
import { toast } from "@/hooks/use-toast";
import { UnmetNeedsKPIs } from '@/components/UnmetNeeds/UnmetNeedsKPIs';
import { UnmetNeedsCards } from '@/components/UnmetNeeds/UnmetNeedsCards';
import { UnmetNeedsDetailModal } from '@/components/UnmetNeeds/UnmetNeedsDetailModal';
import { AddUnmetNeedModal } from '@/components/UnmetNeeds/AddUnmetNeedModal';
import { EditUnmetNeedModal } from '@/components/UnmetNeeds/EditUnmetNeedModal';
import { CustomFieldsForm } from '@/components/UnmetNeeds/CustomFieldsForm';
import { DynamicFiltersPanel } from '@/components/UnmetNeeds/DynamicFiltersPanel';

interface UnmetNeedsFilters {
  laboratorio?: string;
  areaTerapeutica?: string;
  farmaco?: string;
  molecula?: string;
  impacto?: string;
  horizonte?: string;
  favoritos?: string;
}

const formatOptions = ['Programa', 'Webinar', 'Podcast', 'VNL (VideoNewsLetter)', 'Personalizado (DOCS only)'];

const UnmetNeeds = () => {
  const [activeFilters, setActiveFilters] = useState<UnmetNeedsFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [formatSelections, setFormatSelections] = useState<Record<string, string>>({});
  const [selectedUnmetNeed, setSelectedUnmetNeed] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUnmetNeed, setEditingUnmetNeed] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGeneratingTactics, setIsGeneratingTactics] = useState(false);
  const [localFavorites, setLocalFavorites] = useState<Set<string>>(new Set());
  const [customFields, setCustomFields] = useState<Record<string, {
    capitulos: string;
    modulos: string;
    subtemas: string;
    numeroExperto: string;
    formato: string;
  }>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: unmetNeeds, loading, error, refresh, toggleFavorite, deleteUnmetNeed } = useUnmetNeedsData();

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

  const handleScrollDown = () => {
    window.scrollTo({ 
      top: document.body.scrollHeight, 
      behavior: 'smooth' 
    });
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = unmetNeeds.filter(item => {
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

      if (activeFilters.laboratorio && item.lab !== activeFilters.laboratorio) return false;
      if (activeFilters.areaTerapeutica && item.area_terapeutica !== activeFilters.areaTerapeutica) return false;
      if (activeFilters.farmaco && item.farmaco !== activeFilters.farmaco) return false;
      if (activeFilters.molecula && item.molecula !== activeFilters.molecula) return false;
      if (activeFilters.impacto && item.impacto !== activeFilters.impacto) return false;
      if (activeFilters.horizonte && item.horizonte_temporal !== activeFilters.horizonte) return false;
      
      const itemId = item.id_UN_table?.toString();
      if (activeFilters.favoritos === 'si' && !localFavorites.has(itemId)) return false;
      if (activeFilters.favoritos === 'no' && localFavorites.has(itemId)) return false;
      
      return true;
    });

    return filtered;
  }, [unmetNeeds, activeFilters, searchTerm, localFavorites]);

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
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

  const handleEdit = (unmetNeed: any) => {
    setEditingUnmetNeed(unmetNeed);
    setIsEditModalOpen(true);
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

    const missingFormats = Array.from(selectedRows).filter(id => !formatSelections[id]);
    if (missingFormats.length > 0) {
      toast({
        title: "Error",
        description: "Por favor asigna un formato a todas las Unmet Needs seleccionadas.",
        variant: "destructive",
      });
      return;
    }

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
      const selectedItems = Array.from(selectedRows).map(id => {
        const item = unmetNeeds.find(n => n.id_UN_table?.toString() === id);
        return item;
      });

      // Nueva estructura: arrays en lugar de variables numeradas
      const webhookData = {
        timestamp: new Date().toISOString(),
        total_items: selectedRows.size,
        id_unmet_need: [],
        laboratorio: [],
        area_terapeutica: [],
        farmaco: [],
        molecula: [],
        horizonte: [],
        unmet_need: [],
        racional: [],
        oportunidad_estrategica: [],
        conclusion: [],
        formato: [],
        impacto: [],
        capitulos: [],
        modulos: [],
        subtemas: [],
        numero_experto: [],
        formato_personalizado: []
      };

      selectedItems.forEach((item) => {
        const itemId = item?.id_UN_table?.toString();
        
        webhookData.id_unmet_need.push(item?.id_UN_table || '');
        webhookData.laboratorio.push(item?.lab || '');
        webhookData.area_terapeutica.push(item?.area_terapeutica || '');
        webhookData.farmaco.push(item?.farmaco || '');
        webhookData.molecula.push(item?.molecula || '');
        webhookData.horizonte.push(item?.horizonte_temporal || '');
        webhookData.unmet_need.push(item?.unmet_need || '');
        webhookData.racional.push(item?.racional || '');
        webhookData.oportunidad_estrategica.push(item?.oportunidad_estrategica || '');
        webhookData.conclusion.push(item?.conclusion || '');
        webhookData.formato.push(formatSelections[itemId] || '');
        webhookData.impacto.push(item?.impacto || '');

        // Campos personalizados - agregar valores solo si existen
        if (formatSelections[itemId] === 'Personalizado (DOCS only)' && customFields[itemId]) {
          const customFieldsData = customFields[itemId];
          webhookData.capitulos.push(customFieldsData.capitulos);
          webhookData.modulos.push(customFieldsData.modulos);
          webhookData.subtemas.push(customFieldsData.subtemas);
          webhookData.numero_experto.push(customFieldsData.numeroExperto);
          webhookData.formato_personalizado.push(customFieldsData.formato);
        } else {
          // Agregar valores vacíos para mantener consistencia en los arrays
          webhookData.capitulos.push('');
          webhookData.modulos.push('');
          webhookData.subtemas.push('');
          webhookData.numero_experto.push('');
          webhookData.formato_personalizado.push('');
        }
      });

      console.log('Sending data to webhook:', webhookData);

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

      localStorage.setItem('selectedUnmetNeeds', JSON.stringify(Array.from(selectedRows).map(id => {
        const item = unmetNeeds.find(n => n.id_UN_table?.toString() === id);
        const itemId = item?.id_UN_table?.toString();
        
        const result: any = {
          ...item,
          format: formatSelections[id]
        };

        if (formatSelections[id] === 'Personalizado (DOCS only)' && customFields[id]) {
          result.customFields = customFields[id];
        }

        return result;
      })));
      
      toast({
        title: "Éxito",
        description: `Se han enviado ${selectedRows.size} Unmet Needs al webhook y se han preparado las tácticas.`,
      });

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
    refresh();
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

          <UnmetNeedsKPIs data={filteredAndSortedData} />

          {/* Search Section */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar unmet needs..."
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
            unmetNeeds={unmetNeeds}
          />

          <Card className="shadow-lg" ref={scrollRef}>
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
                onEdit={handleEdit}
                localFavorites={localFavorites}
                onToggleLocalFavorite={handleToggleLocalFavorite}
              />
            </CardContent>
          </Card>

          {hasCustomFormat && (
            <CustomFieldsForm
              selectedRows={selectedRows}
              formatSelections={formatSelections}
              customFields={customFields}
              onCustomFieldsChange={handleCustomFieldsChange}
              unmetNeeds={unmetNeeds}
            />
          )}

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

          <UnmetNeedsDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedUnmetNeed(null);
            }}
            unmetNeed={selectedUnmetNeed}
          />

          <AddUnmetNeedModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={handleAddSuccess}
          />

          <EditUnmetNeedModal
            unmetNeed={editingUnmetNeed}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingUnmetNeed(null);
            }}
            onSuccess={refresh}
          />
        </div>

        {/* Scroll Down Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleScrollDown}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-12 h-12 p-0"
          >
            <ChevronDown className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default UnmetNeeds;
