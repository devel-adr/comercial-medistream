import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Navigation } from '@/components/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Search, Filter, Plus, BarChart3, Star } from 'lucide-react';
import { useUnmetNeedsData } from '@/hooks/useUnmetNeedsData';
import { UnmetNeedsKPIs } from '@/components/UnmetNeeds/UnmetNeedsKPIs';
import { UnmetNeedsCards } from '@/components/UnmetNeeds/UnmetNeedsCards';
import { AddUnmetNeedModal } from '@/components/UnmetNeeds/AddUnmetNeedModal';
import { EditUnmetNeedModal } from '@/components/UnmetNeeds/EditUnmetNeedModal';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const UnmetNeeds = () => {
  const { data, loading, error, refetch } = useUnmetNeedsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedFarmaco, setSelectedFarmaco] = useState('');
  const [selectedLab, setSelectedLab] = useState('');
  const [selectedImpacto, setSelectedImpacto] = useState('');
  const [selectedHorizonte, setSelectedHorizonte] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [formatSelections, setFormatSelections] = useState<Record<string, string>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUnmetNeed, setEditingUnmetNeed] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localFavorites, setLocalFavorites] = useState<Set<string>>(new Set());

  const uniqueAreas = [...new Set(data.map(item => item.area_terapeutica))]
    .filter(area => area && area.trim() !== '')
    .sort();

  const uniqueFarmacos = [...new Set(data.map(item => item.farmaco))]
    .filter(farmaco => farmaco && farmaco.trim() !== '')
    .sort();

  const uniqueLabs = [...new Set(data.map(item => item.lab))]
    .filter(lab => lab && lab.trim() !== '')
    .sort();

  const uniqueImpactos = [...new Set(data.map(item => item.impacto))]
    .filter(impacto => impacto && impacto.trim() !== '')
    .sort();

  const uniqueHorizontes = [...new Set(data.map(item => item.horizonte_temporal))]
    .filter(horizonte => horizonte && horizonte.trim() !== '')
    .sort();

  const formatOptions = [...new Set(data.map(item => item.formato))]
    .filter(format => format && format.trim() !== '')
    .sort();

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedArea('');
    setSelectedFarmaco('');
    setSelectedLab('');
    setSelectedImpacto('');
    setSelectedHorizonte('');
    setShowOnlyFavorites(false);
  };

  const handleFavoritesChange = (checked: boolean | "indeterminate") => {
    setShowOnlyFavorites(checked === true);
  };

  const handleSelectForTactics = (id: string, selected: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (selected) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleFormatChange = (id: string, format: string) => {
    setFormatSelections(prev => ({
      ...prev,
      [id]: format
    }));
  };

  const handleToggleFavorite = async (unmetNeed: any) => {
    const itemId = unmetNeed.id_UN_table?.toString();
    if (!itemId) return;

    setLocalFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const handleDeleteUnmetNeed = async (unmetNeed: any) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta necesidad médica?');
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
        title: "Necesidad médica eliminada",
        description: "La necesidad médica ha sido eliminada correctamente.",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar la necesidad médica.",
        variant: "destructive",
      });
    }
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

  const handleEditUnmetNeed = (unmetNeed: any) => {
    setEditingUnmetNeed(unmetNeed);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUnmetNeed(null);
  };

  const handleUnmetNeedUpdated = () => {
    refetch();
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
                <h3 className="text-lg font-semibold mb-2 text-red-600">Error al cargar las necesidades médicas</h3>
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
              Necesidades Médicas No Cubiertas
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gestión y visualización de necesidades médicas no cubiertas
            </p>
          </div>

          <UnmetNeedsKPIs data={data} loading={loading} />

          {/* Filters Section */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar necesidades médicas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las áreas</SelectItem>
                    {uniqueAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedFarmaco} onValueChange={setSelectedFarmaco}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar fármaco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los fármacos</SelectItem>
                    {uniqueFarmacos.map((farmaco) => (
                      <SelectItem key={farmaco} value={farmaco}>
                        {farmaco}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLab} onValueChange={setSelectedLab}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar laboratorio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los laboratorios</SelectItem>
                    {uniqueLabs.map((lab) => (
                      <SelectItem key={lab} value={lab}>
                        {lab}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedImpacto} onValueChange={setSelectedImpacto}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar impacto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los impactos</SelectItem>
                    {uniqueImpactos.map((impacto) => (
                      <SelectItem key={impacto} value={impacto}>
                        {impacto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedHorizonte} onValueChange={setSelectedHorizonte}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar horizonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los horizontes</SelectItem>
                    {uniqueHorizontes.map((horizonte) => (
                      <SelectItem key={horizonte} value={horizonte}>
                        {horizonte}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="favorites"
                  checked={showOnlyFavorites}
                  onCheckedChange={handleFavoritesChange}
                />
                <label
                  htmlFor="favorites"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Mostrar solo favoritos
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Unmet Needs Cards */}
          <UnmetNeedsCards
            data={data}
            onSelectForTactics={handleSelectForTactics}
            selectedIds={selectedIds}
            formatSelections={formatSelections}
            onFormatChange={handleFormatChange}
            formatOptions={formatOptions}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDeleteUnmetNeed}
            onEdit={handleEditUnmetNeed}
            localFavorites={localFavorites}
            onToggleLocalFavorite={handleToggleLocalFavorite}
          />

          {/* Generate Tactics Button */}
          {selectedIds.size > 0 && (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Generar Tácticas</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Selecciona las necesidades médicas no cubiertas y genera tácticas
                      específicas para abordarlas.
                    </p>
                  </div>
                  <Button variant="default">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generar Tácticas ({selectedIds.size})
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <AddUnmetNeedModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdded={() => {
            refetch();
          }}
        />

        <EditUnmetNeedModal
          unmetNeed={editingUnmetNeed}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onUpdate={handleUnmetNeedUpdated}
        />
      </div>
    </ThemeProvider>
  );
};

export default UnmetNeeds;
