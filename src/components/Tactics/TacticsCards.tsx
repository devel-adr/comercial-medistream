import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Presentation, Eye, Star, Trash2, Edit } from 'lucide-react';
import { TacticsDetailModal } from './TacticsDetailModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TacticsCardsProps {
  data: any[];
  loading: boolean;
  searchTerm: string;
  selectedLab: string;
  selectedArea: string;
  selectedFormat: string;
  showOnlyFavorites: boolean;
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  onEdit?: (tactic: any) => void;
}

export const TacticsCards: React.FC<TacticsCardsProps> = ({
  data,
  loading,
  searchTerm,
  selectedLab,
  selectedArea,
  selectedFormat,
  showOnlyFavorites,
  favorites,
  toggleFavorite,
  isFavorite,
  onEdit
}) => {
  const [selectedTactic, setSelectedTactic] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const filteredData = data.filter(item => {
    const matchesSearch = !searchTerm || 
      item.unmet_need?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farmaco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.molecula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.laboratorio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLab = !selectedLab || item.laboratorio === selectedLab;
    const matchesArea = !selectedArea || item.area_terapeutica === selectedArea;
    const matchesFormat = !selectedFormat || item.formato === selectedFormat;
    const matchesFavorites = !showOnlyFavorites || isFavorite(item.id?.toString());
    
    return matchesSearch && matchesLab && matchesArea && matchesFormat && matchesFavorites;
  });

  const getFormatColor = (format: string) => {
    switch (format?.toLowerCase()) {
      case 'programa':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'webinar':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'podcast':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'documento':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleViewDetails = (tactic: any) => {
    setSelectedTactic(tactic);
    setIsDetailModalOpen(true);
  };

  const handleOpenUrl = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleToggleFavorite = (tactic: any) => {
    toggleFavorite(tactic.id?.toString());
    toast({
      title: isFavorite(tactic.id?.toString()) ? "Removido de favoritos" : "Añadido a favoritos",
      description: `"${tactic.unmet_need}" ${isFavorite(tactic.id?.toString()) ? "removido de" : "añadido a"} favoritos.`,
    });
  };

  const handleEdit = (tactic: any) => {
    if (onEdit) {
      onEdit(tactic);
    }
  };

  const handleDelete = async (tactic: any) => {
    const tacticId = tactic.id?.toString();
    
    if (!tacticId) {
      toast({
        title: "Error",
        description: "No se pudo identificar la tactic para eliminar.",
        variant: "destructive",
      });
      return;
    }

    // Add to deleting set to show loading state
    setDeletingIds(prev => new Set(prev).add(tacticId));

    try {
      console.log('Deleting tactic with ID:', tacticId);
      
      const { error } = await (supabase as any)
        .from('PharmaTactics_table')
        .delete()
        .eq('id', tactic.id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw new Error(`Error al eliminar: ${error.message}`);
      }

      console.log('Tactic deleted successfully from Supabase');
      
      toast({
        title: "Tactic eliminada",
        description: `"${tactic.unmet_need}" ha sido eliminada exitosamente.`,
      });

      // Remove from favorites if it was favorited
      if (isFavorite(tacticId)) {
        toggleFavorite(tacticId);
      }

    } catch (error) {
      console.error('Error deleting tactic:', error);
      toast({
        title: "Error al eliminar",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado.",
        variant: "destructive",
      });
    } finally {
      // Remove from deleting set
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(tacticId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron tactics</h3>
          <p className="text-gray-600 dark:text-gray-300">
            No hay tactics que coincidan con los filtros aplicados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((tactic) => {
          const tacticId = tactic.id?.toString();
          const isDeleting = deletingIds.has(tacticId);
          
          return (
            <Card key={tactic.id} className={`shadow-sm hover:shadow-md transition-shadow ${isDeleting ? 'opacity-50' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        Id Unmet Need: {tactic.id_unmetNeed}
                      </span>
                      <Badge className={getFormatColor(tactic.formato)}>
                        {tactic.formato}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold leading-relaxed">
                      {tactic.unmet_need}
                    </CardTitle>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(tactic)}
                      className="p-1 h-8 w-8"
                      disabled={isDeleting}
                    >
                      <Star 
                        className={`w-4 h-4 ${
                          isFavorite(tactic.id?.toString()) 
                            ? 'fill-yellow-500 text-yellow-500' 
                            : 'text-gray-400'
                        }`} 
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(tactic)}
                      className="p-1 h-8 w-8 hover:text-blue-500"
                      disabled={isDeleting}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tactic)}
                      className="p-1 h-8 w-8 hover:text-red-500"
                      disabled={isDeleting}
                    >
                      <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-pulse' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Laboratorio:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{tactic.laboratorio}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Área:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{tactic.area_terapeutica}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Fármaco:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{tactic.farmaco}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Molécula:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{tactic.molecula}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(tactic)}
                    className="flex items-center gap-1"
                    disabled={isDeleting}
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalles
                  </Button>
                  
                  {tactic.URL_docs && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenUrl(tactic.URL_docs)}
                      className="flex items-center gap-1"
                      disabled={isDeleting}
                    >
                      <FileText className="w-4 h-4" />
                      Docs
                    </Button>
                  )}
                  
                  {tactic.URL_ppt && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenUrl(tactic.URL_ppt)}
                      className="flex items-center gap-1"
                      disabled={isDeleting}
                    >
                      <Presentation className="w-4 h-4" />
                      PPT
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <TacticsDetailModal
        tactic={selectedTactic}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTactic(null);
        }}
      />
    </>
  );
};
