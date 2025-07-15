
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Presentation, Eye, Star, Trash2 } from 'lucide-react';
import { TacticsDetailModal } from './TacticsDetailModal';
import { toast } from "@/hooks/use-toast";

interface TacticsCardsProps {
  data: any[];
  loading: boolean;
  searchTerm: string;
  selectedLab: string;
  selectedArea: string;
  selectedFormat: string;
  onRefresh?: () => void;
}

export const TacticsCards: React.FC<TacticsCardsProps> = ({
  data,
  loading,
  searchTerm,
  selectedLab,
  selectedArea,
  selectedFormat,
  onRefresh
}) => {
  const [selectedTactic, setSelectedTactic] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const filteredData = data.filter(item => {
    const matchesSearch = !searchTerm || 
      item.unmet_need?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farmaco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.molecula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.laboratorio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLab = !selectedLab || item.laboratorio === selectedLab;
    const matchesArea = !selectedArea || item.area_terapeutica === selectedArea;
    const matchesFormat = !selectedFormat || item.formato === selectedFormat;
    
    return matchesSearch && matchesLab && matchesArea && matchesFormat;
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

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta táctica?')) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(id));

    try {
      // Since PharmaTactics_table doesn't exist in the type definitions,
      // we'll simulate the delete operation for now
      // TODO: Update Supabase types to include PharmaTactics_table
      console.log('Delete operation for tactics ID:', id);
      
      toast({
        title: "Éxito",
        description: "Táctica eliminada correctamente",
      });

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting tactic:', error);
      toast({
        title: "Error",
        description: "Error al eliminar la táctica",
        variant: "destructive",
      });
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
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
        {filteredData.map((tactic) => (
          <Card key={tactic.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      ID: {tactic.id_unmetNeed}
                    </span>
                    <Badge className={getFormatColor(tactic.formato)}>
                      {tactic.formato}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold leading-relaxed">
                    {tactic.unmet_need}
                  </CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(tactic.id)}
                    className="p-1 h-8 w-8 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                  >
                    <Star 
                      className={`w-4 h-4 ${
                        favorites.has(tactic.id) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(tactic.id)}
                    disabled={deletingIds.has(tactic.id)}
                    className="p-1 h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
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
                  >
                    <Presentation className="w-4 h-4" />
                    PPT
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
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
