import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUnmetNeedsData } from '@/hooks/useUnmetNeedsData';
import { UnmetNeedsCards } from '@/components/UnmetNeeds/UnmetNeedsCards';
import { UnmetNeedsKPIs } from '@/components/UnmetNeeds/UnmetNeedsKPIs';
import { DynamicFiltersPanel } from '@/components/UnmetNeeds/DynamicFiltersPanel';
import { CustomFieldsForm } from '@/components/UnmetNeeds/CustomFieldsForm';
import { AddUnmetNeedModal } from '@/components/UnmetNeeds/AddUnmetNeedModal';
import { EditUnmetNeedModal } from '@/components/UnmetNeeds/EditUnmetNeedModal';
import { UnmetNeedsDetailModal } from '@/components/UnmetNeeds/UnmetNeedsDetailModal';
import { Navigation } from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { Send, Plus, RefreshCw, Filter } from 'lucide-react';

interface FiltersState {
  laboratorio?: string;
  areaTerapeutica?: string;
  farmaco?: string;
  molecula?: string;
  impacto?: string;
  horizonte?: string;
  favoritos?: string;
}

const UnmetNeeds = () => {
  const { data: unmetNeeds, loading, error, refresh } = useUnmetNeedsData();
  const { toast } = useToast();
  
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [formatSelections, setFormatSelections] = useState<Record<string, string>>({});
  const [customFields, setCustomFields] = useState<Record<string, any>>({});
  const [sending, setSending] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [filters, setFilters] = useState<FiltersState>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [localFavorites, setLocalFavorites] = useState<Set<string>>(new Set());

  const formatOptions = [
    'Programa',
    'Webinar',
    'Podcast',
    'VNL (VideoNewsLetter)',
    'Personalizado (DOCS only)'
  ];

  const filteredData = useMemo(() => {
    let filtered = unmetNeeds.filter(item => {
      // Apply filters
      if (filters.laboratorio && item.lab !== filters.laboratorio) return false;
      if (filters.areaTerapeutica && item.area_terapeutica !== filters.areaTerapeutica) return false;
      if (filters.farmaco && item.farmaco !== filters.farmaco) return false;
      if (filters.molecula && item.molecula !== filters.molecula) return false;
      if (filters.impacto && item.impacto !== filters.impacto) return false;
      if (filters.horizonte && item.horizonte_temporal !== filters.horizonte) return false;
      if (filters.favoritos === 'si' && !localFavorites.has(item.id_UN_table?.toString())) return false;
      if (filters.favoritos === 'no' && localFavorites.has(item.id_UN_table?.toString())) return false;
      
      // Apply search filter
      if (searchTerm) {
        const searchFields = [
          item.unmet_need,
          item.area_terapeutica,
          item.farmaco,
          item.lab,
          item.molecula,
          item.racional,
          item.oportunidad_estrategica,
          item.conclusion,
          item.preguntas
        ];
        
        const matchesSearch = searchFields.some(field => 
          field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (!matchesSearch) return false;
      }
      
      return true;
    });

    // Sort by favorites first, then by ID descending
    filtered.sort((a, b) => {
      const aId = a.id_UN_table?.toString();
      const bId = b.id_UN_table?.toString();
      const aIsFavorite = localFavorites.has(aId);
      const bIsFavorite = localFavorites.has(bId);
      
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      
      return (b.id_UN_table || 0) - (a.id_UN_table || 0);
    });

    return filtered;
  }, [unmetNeeds, filters, searchTerm, localFavorites]);

  const handleFiltersChange = (newFilters: FiltersState) => {
    setFilters(newFilters);
  };

  const handleSelectForTactics = (id: string, selected: boolean) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
        // Also remove from format selections if deselected
        setFormatSelections(prev => {
          const newSelections = { ...prev };
          delete newSelections[id];
          return newSelections;
        });
        // Remove from custom fields if deselected
        setCustomFields(prev => {
          const newFields = { ...prev };
          delete newFields[id];
          return newFields;
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

  const handleCustomFieldsChange = (id: string, fields: any) => {
    setCustomFields(prev => ({
      ...prev,
      [id]: fields
    }));
  };

  const handleSendToTactics = async () => {
    if (selectedRows.size === 0) {
      toast({
        title: "Sin selección",
        description: "Selecciona al menos una Unmet Need para enviar a Tácticas.",
        variant: "destructive"
      });
      return;
    }

    // Validate formats
    const missingFormats = Array.from(selectedRows).filter(id => !formatSelections[id]);
    if (missingFormats.length > 0) {
      toast({
        title: "Formato requerido",
        description: "Selecciona un formato para todas las Unmet Needs seleccionadas.",
        variant: "destructive"
      });
      return;
    }

    // Validate custom fields for Personalizado format
    const customFormatItems = Array.from(selectedRows).filter(id => 
      formatSelections[id] === 'Personalizado (DOCS only)'
    );
    
    for (const itemId of customFormatItems) {
      const fields = customFields[itemId];
      if (!fields || !fields.capitulos || !fields.modulos || !fields.subtemas || 
          !fields.numeroExperto || !fields.formato) {
        toast({
          title: "Campos personalizados incompletos",
          description: "Completa todos los campos personalizados para los elementos con formato 'Personalizado (DOCS only)'.",
          variant: "destructive"
        });
        return;
      }
    }

    setSending(true);

    try {
      const selectedData = unmetNeeds
        .filter(item => selectedRows.has(item.id_UN_table?.toString()))
        .map(item => {
          const itemId = item.id_UN_table?.toString();
          const baseData = {
            ...item,
            formato_seleccionado: formatSelections[itemId]
          };

          // Add custom fields if format is Personalizado
          if (formatSelections[itemId] === 'Personalizado (DOCS only)') {
            const fields = customFields[itemId];
            return {
              ...baseData,
              campos_personalizados: fields
            };
          }

          return baseData;
        });

      console.log('Sending to tactics:', selectedData);
      
      // Mock successful send - replace with actual API call when available
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "¡Enviado exitosamente!",
        description: `Se han enviado ${selectedData.length} Unmet Needs a Tácticas.`
      });

      // Clear selections
      setSelectedRows(new Set());
      setFormatSelections({});
      setCustomFields({});

    } catch (error) {
      console.error('Error sending to tactics:', error);
      toast({
        title: "Error al enviar",
        description: "Hubo un problema al enviar las Unmet Needs a Tácticas. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
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

  const handleDelete = (unmetNeed: any) => {
    setItemToDelete(unmetNeed);
    setShowDeleteDialog(true);
  };

  const handleEdit = (unmetNeed: any) => {
    setEditingItem(unmetNeed);
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      console.log('Deleting unmet need:', itemToDelete);
      
      // Here you would typically make an API call to delete the item
      // For now, we'll just show a success message
      toast({
        title: "Eliminado exitosamente",
        description: `La Unmet Need #${itemToDelete.id_UN_table} ha sido eliminada.`
      });

      // Refresh the data
      refresh();
      
    } catch (error) {
      console.error('Error deleting unmet need:', error);
      toast({
        title: "Error al eliminar",
        description: "Hubo un problema al eliminar la Unmet Need. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Cargando Unmet Needs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-600 dark:text-red-400">
            <p className="text-lg font-semibold mb-2">Error al cargar datos</p>
            <p className="text-sm">{error}</p>
            <Button onClick={refresh} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Unmet Needs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gestiona y envía necesidades no cubiertas a tácticas
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Añadir Unmet Need
            </Button>
            <Button 
              onClick={refresh} 
              variant="outline"
              className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <UnmetNeedsKPIs 
          data={filteredData}
          selectedCount={selectedRows.size}
          localFavorites={localFavorites}
        />

        {/* Filters */}
        <DynamicFiltersPanel
          onFiltersChange={handleFiltersChange}
          unmetNeeds={unmetNeeds}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Send to Tactics Section */}
        {selectedRows.size > 0 && (
          <div className="space-y-4">
            <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                      Enviar a Tácticas
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      {selectedRows.size} Unmet Need{selectedRows.size !== 1 ? 's' : ''} seleccionada{selectedRows.size !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button
                    onClick={handleSendToTactics}
                    disabled={sending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {sending ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {sending ? 'Enviando...' : 'Enviar a Tácticas'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Custom Fields Form */}
            <CustomFieldsForm
              selectedRows={selectedRows}
              formatSelections={formatSelections}
              customFields={customFields}
              onCustomFieldsChange={handleCustomFieldsChange}
              unmetNeeds={unmetNeeds}
            />
          </div>
        )}

        {/* Unmet Needs Cards */}
        <UnmetNeedsCards
          data={filteredData}
          onSelectForTactics={handleSelectForTactics}
          selectedIds={selectedRows}
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
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={refresh}
        />

        <EditUnmetNeedModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          unmetNeed={editingItem}
          onSuccess={() => {
            refresh();
            setShowEditModal(false);
            setEditingItem(null);
          }}
        />

        <UnmetNeedsDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          unmetNeed={selectedItem}
        />

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-red-600">Confirmar Eliminación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  ¿Estás seguro de que deseas eliminar la Unmet Need #{itemToDelete?.id_UN_table}?
                  Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowDeleteDialog(false);
                      setItemToDelete(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={confirmDelete}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnmetNeeds;
