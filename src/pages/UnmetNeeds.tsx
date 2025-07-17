
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Search, Filter, BarChart3, Plus, Eye, Star } from 'lucide-react';
import { useUnmetNeedsData } from '@/hooks/useUnmetNeedsData';
import { UnmetNeedsCards } from '@/components/UnmetNeeds/UnmetNeedsCards';
import { UnmetNeedsKPIs } from '@/components/UnmetNeeds/UnmetNeedsKPIs';
import { AddUnmetNeedModal } from '@/components/UnmetNeeds/AddUnmetNeedModal';
import { EditUnmetNeedModal } from '@/components/UnmetNeeds/EditUnmetNeedModal';
import { UnmetNeedsDetailModal } from '@/components/UnmetNeeds/UnmetNeedsDetailModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const UnmetNeeds = () => {
  const { data, loading, error, refresh } = useUnmetNeedsData();
  const { toast } = useToast();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLab, setSelectedLab] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedImpact, setSelectedImpact] = useState('');
  const [selectedHorizon, setSelectedHorizon] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUnmetNeed, setEditingUnmetNeed] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUnmetNeed, setSelectedUnmetNeed] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Selection and tactics states
  const [selectedForTactics, setSelectedForTactics] = useState<Set<string>>(new Set());
  const [formatSelections, setFormatSelections] = useState<Record<string, string>>({});
  const [localFavorites, setLocalFavorites] = useState<Set<string>>(new Set());
  const [isGeneratingTactics, setIsGeneratingTactics] = useState(false);

  // Get unique values for filters
  const uniqueLabs = [...new Set(data.map(item => item.lab))]
    .filter(lab => lab && lab.trim() !== '')
    .sort();
  
  const uniqueAreas = [...new Set(data.map(item => item.area_terapeutica))]
    .filter(area => area && area.trim() !== '')
    .sort();
  
  const uniqueImpacts = [...new Set(data.map(item => item.impacto))]
    .filter(impact => impact && impact.trim() !== '')
    .sort();
  
  const uniqueHorizons = [...new Set(data.map(item => item.horizonte_temporal))]
    .filter(horizon => horizon && horizon.trim() !== '')
    .sort();

  const formatOptions = ['Programa', 'Webinar', 'Podcast', 'Documento'];

  // Filter data
  const filteredData = data.filter(item => {
    const matchesSearch = !searchTerm || 
      item.unmet_need?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farmaco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.molecula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lab?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLab = !selectedLab || item.lab === selectedLab;
    const matchesArea = !selectedArea || item.area_terapeutica === selectedArea;
    const matchesImpact = !selectedImpact || item.impacto === selectedImpact;
    const matchesHorizon = !selectedHorizon || item.horizonte_temporal === selectedHorizon;
    const matchesFavorites = !showOnlyFavorites || localFavorites.has(item.id_UN_table?.toString());
    
    return matchesSearch && matchesLab && matchesArea && matchesImpact && matchesHorizon && matchesFavorites;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLab('');
    setSelectedArea('');
    setSelectedImpact('');
    setSelectedHorizon('');
    setShowOnlyFavorites(false);
  };

  const handleSelectForTactics = (id: string, selected: boolean) => {
    setSelectedForTactics(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
        // Also remove format selection
        setFormatSelections(prevFormats => {
          const newFormats = { ...prevFormats };
          delete newFormats[id];
          return newFormats;
        });
      }
      return newSet;
    });
  };

  const handleFormatChange = (id: string, format: string) => {
    setFormatSelections(prev => ({
      ...prev,
      [id]: format
    }));
  };

  const handleToggleLocalFavorite = (id: string) => {
    setLocalFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const handleDelete = async (unmetNeed: any) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta Unmet Need?');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('UnmetNeeds_table')
        .delete()
        .eq('id_UN_table', unmetNeed.id_UN_table);

      if (error) {
        throw error;
      }

      toast({
        title: "Unmet Need eliminada",
        description: "La Unmet Need ha sido eliminada correctamente.",
      });

      refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar la Unmet Need.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (unmetNeed: any) => {
    setEditingUnmetNeed(unmetNeed);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (unmetNeed: any) => {
    setSelectedUnmetNeed(unmetNeed);
    setIsDetailModalOpen(true);
  };

  const handleGenerateTactics = async () => {
    if (selectedForTactics.size === 0) {
      toast({
        title: "Error",
        description: "Por favor selecciona al menos una Unmet Need para generar tactics.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingTactics(true);
    
    try {
      const selectedUnmetNeedsData = Array.from(selectedForTactics).map(id => {
        const unmetNeed = data.find(item => item.id_UN_table?.toString() === id);
        const format = formatSelections[id] || '';
        
        return {
          id_UN_table: unmetNeed?.id_UN_table,
          unmet_need: unmetNeed?.unmet_need,
          laboratorio: unmetNeed?.lab,
          area_terapeutica: unmetNeed?.area_terapeutica,
          farmaco: unmetNeed?.farmaco,
          molecula: unmetNeed?.molecula,
          formato: format
        };
      }).filter(Boolean);

      console.log('Sending Unmet Needs data to webhook:', selectedUnmetNeedsData);

      const response = await fetch('https://develms.app.n8n.cloud/webhook/generate_tactics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unmetNeeds: selectedUnmetNeedsData
        }),
      });

      if (response.ok) {
        toast({
          title: "Generación de tactics iniciada",
          description: `Se están generando tactics para ${selectedForTactics.size} Unmet Needs seleccionadas.`,
        });
        setSelectedForTactics(new Set());
        setFormatSelections({});
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al generar las tactics. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTactics(false);
    }
  };

  if (error) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <Navigation />
          <div className="container mx-auto px-4 py-6">
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <h3 className="text-lg font-semibold mb-2 text-red-600">Error al cargar las Unmet Needs</h3>
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
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Unmet Needs
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gestión y análisis de necesidades médicas no cubiertas
            </p>
          </div>

          {/* KPIs */}
          <UnmetNeedsKPIs data={filteredData} />

          {/* Actions Bar */}
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Añadir Unmet Need
                  </Button>
                  {selectedForTactics.size > 0 && (
                    <Badge variant="secondary" className="text-sm">
                      {selectedForTactics.size} seleccionadas para tactics
                    </Badge>
                  )}
                </div>
                {selectedForTactics.size > 0 && (
                  <Button 
                    onClick={handleGenerateTactics}
                    disabled={isGeneratingTactics}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isGeneratingTactics ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generando...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Generar Tactics
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </CardTitle>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  Limpiar filtros
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedLab} onValueChange={setSelectedLab}>
                  <SelectTrigger>
                    <SelectValue placeholder="Laboratorio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueLabs.map((lab) => (
                      <SelectItem key={lab} value={lab}>
                        {lab}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Área Terapéutica" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {uniqueAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedImpact} onValueChange={setSelectedImpact}>
                  <SelectTrigger>
                    <SelectValue placeholder="Impacto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueImpacts.map((impact) => (
                      <SelectItem key={impact} value={impact}>
                        {impact}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedHorizon} onValueChange={setSelectedHorizon}>
                  <SelectTrigger>
                    <SelectValue placeholder="Horizonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueHorizons.map((horizon) => (
                      <SelectItem key={horizon} value={horizon}>
                        {horizon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="favorites-filter"
                    checked={showOnlyFavorites}
                    onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="favorites-filter" className="text-sm flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Favoritos
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unmet Needs Cards */}
          <UnmetNeedsCards
            data={filteredData}
            onSelectForTactics={handleSelectForTactics}
            selectedIds={selectedForTactics}
            formatSelections={formatSelections}
            onFormatChange={handleFormatChange}
            formatOptions={formatOptions}
            onDelete={handleDelete}
            onEdit={handleEdit}
            localFavorites={localFavorites}
            onToggleLocalFavorite={handleToggleLocalFavorite}
          />

          {/* Modals */}
          <AddUnmetNeedModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={refresh}
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

          <UnmetNeedsDetailModal
            unmetNeed={selectedUnmetNeed}
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedUnmetNeed(null);
            }}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default UnmetNeeds;
