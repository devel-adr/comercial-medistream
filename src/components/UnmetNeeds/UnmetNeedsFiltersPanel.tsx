
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';

interface UnmetNeedsFiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: any) => void;
  data: any[];
}

export const UnmetNeedsFiltersPanel: React.FC<UnmetNeedsFiltersPanelProps> = ({
  isOpen,
  onClose,
  onFiltersChange,
  data = []
}) => {
  const [filters, setFilters] = useState({
    areaTerapeutica: '',
    farmaco: '',
    lab: '',
    impacto: '',
    horizonteTemporal: ''
  });

  // Opciones únicas para cada filtro
  const uniqueOptions = useMemo(() => ({
    areasTerapeuticas: [...new Set(data.map(item => item.area_terapeutica).filter(Boolean))].sort(),
    farmacos: [...new Set(data.map(item => item.farmaco).filter(Boolean))].sort(),
    labs: [...new Set(data.map(item => item.lab).filter(Boolean))].sort(),
    impactos: [...new Set(data.map(item => item.impacto).filter(Boolean))].sort(),
    horizontesTemporales: [...new Set(data.map(item => item.horizonte_temporal).filter(Boolean))].sort()
  }), [data]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      areaTerapeutica: '',
      farmaco: '',
      lab: '',
      impacto: '',
      horizonteTemporal: ''
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  if (!isOpen) return null;

  return (
    <div className="w-80 space-y-4">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg">Filtros</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Área Terapéutica */}
          <div>
            <label className="text-sm font-medium mb-2 block">Área Terapéutica</label>
            <Select
              value={filters.areaTerapeutica}
              onValueChange={(value) => handleFilterChange('areaTerapeutica', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar área" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {uniqueOptions.areasTerapeuticas.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fármaco */}
          <div>
            <label className="text-sm font-medium mb-2 block">Fármaco</label>
            <Select
              value={filters.farmaco}
              onValueChange={(value) => handleFilterChange('farmaco', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar fármaco" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {uniqueOptions.farmacos.map((farmaco) => (
                  <SelectItem key={farmaco} value={farmaco}>{farmaco}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Laboratorio */}
          <div>
            <label className="text-sm font-medium mb-2 block">Laboratorio</label>
            <Select
              value={filters.lab}
              onValueChange={(value) => handleFilterChange('lab', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar laboratorio" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {uniqueOptions.labs.map((lab) => (
                  <SelectItem key={lab} value={lab}>{lab}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Impacto */}
          <div>
            <label className="text-sm font-medium mb-2 block">Impacto</label>
            <Select
              value={filters.impacto}
              onValueChange={(value) => handleFilterChange('impacto', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar impacto" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {uniqueOptions.impactos.map((impacto) => (
                  <SelectItem key={impacto} value={impacto}>{impacto}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Horizonte Temporal */}
          <div>
            <label className="text-sm font-medium mb-2 block">Horizonte Temporal</label>
            <Select
              value={filters.horizonteTemporal}
              onValueChange={(value) => handleFilterChange('horizonteTemporal', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar horizonte" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {uniqueOptions.horizontesTemporales.map((horizonte) => (
                  <SelectItem key={horizonte} value={horizonte}>{horizonte}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full"
            disabled={activeFiltersCount === 0}
          >
            Limpiar Filtros ({activeFiltersCount})
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
