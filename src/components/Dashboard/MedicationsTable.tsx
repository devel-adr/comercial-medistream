import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Star, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

interface MedicationsTableProps {
  medications: any[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeFilters: any;
  onRefresh: () => void;
}

export const MedicationsTable: React.FC<MedicationsTableProps> = ({
  medications,
  loading,
  searchTerm,
  onSearchChange,
  activeFilters,
  onRefresh
}) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const filteredMedications = useMemo(() => {
    return medications.filter(medication => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const searchableFields = [
          medication.farmaco,
          medication.laboratorio,
          medication.area_terapeutica,
          medication.subarea,
          medication.estado
        ];
        if (!searchableFields.some(field => 
          field && field.toString().toLowerCase().includes(searchLower)
        )) {
          return false;
        }
      }

      // Other filters
      if (activeFilters.laboratorio && medication.laboratorio !== activeFilters.laboratorio) return false;
      if (activeFilters.area_terapeutica && medication.area_terapeutica !== activeFilters.area_terapeutica) return false;
      if (activeFilters.subarea && medication.subarea !== activeFilters.subarea) return false;
      if (activeFilters.farmaco && medication.farmaco !== activeFilters.farmaco) return false;
      if (activeFilters.estado && medication.estado !== activeFilters.estado) return false;

      return true;
    });
  }, [medications, searchTerm, activeFilters]);

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
    if (!confirm('¿Estás seguro de que quieres eliminar este medicamento?')) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(id));

    try {
      const { error } = await supabase
        .from('DrugDealer_table')
        .delete()
        .eq('ID_NUM', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Medicamento eliminado correctamente",
      });

      onRefresh();
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast({
        title: "Error",
        description: "Error al eliminar el medicamento",
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

  if (loading) {
    return (
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
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Medicamentos ({filteredMedications.length})
          </CardTitle>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar medicamentos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Fav</TableHead>
                <TableHead>Fármaco</TableHead>
                <TableHead>Laboratorio</TableHead>
                <TableHead>Área Terapéutica</TableHead>
                <TableHead>Subárea</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedications.map((medication) => (
                <TableRow key={medication.ID_NUM}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(medication.ID_NUM)}
                      className="p-1 h-8 w-8"
                    >
                      <Star 
                        className={`w-4 h-4 ${
                          favorites.has(medication.ID_NUM) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-400'
                        }`} 
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">
                    {medication.farmaco || 'N/A'}
                  </TableCell>
                  <TableCell>{medication.laboratorio || 'N/A'}</TableCell>
                  <TableCell>{medication.area_terapeutica || 'N/A'}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="whitespace-normal break-words">
                      {medication.subarea || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {medication.estado || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(medication.ID_NUM)}
                        disabled={deletingIds.has(medication.ID_NUM)}
                        className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
