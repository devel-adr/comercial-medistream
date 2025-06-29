
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: any) => void;
  medications: any[];
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  isOpen,
  onClose,
  onFiltersChange,
  medications = []
}) => {
  const [filters, setFilters] = useState({
    laboratorio: '',
    estado: [],
    fechaDesde: '',
    fechaHasta: '',
    alteracionGenetica: ''
  });

  const uniqueLaboratorios = useMemo(() => {
    return [...new Set(medications.map(med => med.nombre_laboratorio).filter(Boolean))];
  }, [medications]);

  const uniqueStates = useMemo(() => {
    return [...new Set(medications.map(med => med.estado_espana).filter(Boolean))];
  }, [medications]);

  const uniqueAlteraciones = useMemo(() => {
    return [...new Set(medications.map(med => med.alteracion_genetica_dirigida).filter(Boolean))];
  }, [medications]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      laboratorio: '',
      estado: [],
      fechaDesde: '',
      fechaHasta: '',
      alteracionGenetica: ''
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  ).length;

  if (!isOpen) return null;

  return (
    <div className="w-80 space-y-4">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">Filtros Avanzados</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Laboratorio</label>
            <Select
              value={filters.laboratorio}
              onValueChange={(value) => handleFilterChange('laboratorio', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar laboratorio" />
              </SelectTrigger>
              <SelectContent>
                {uniqueLaboratorios.map((lab) => (
                  <SelectItem key={lab} value={lab}>{lab}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Alteración Genética</label>
            <Select
              value={filters.alteracionGenetica}
              onValueChange={(value) => handleFilterChange('alteracionGenetica', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar alteración" />
              </SelectTrigger>
              <SelectContent>
                {uniqueAlteraciones.map((alt) => (
                  <SelectItem key={alt} value={alt}>{alt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Estado en España</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uniqueStates.map((estado) => (
                <div key={estado} className="flex items-center space-x-2">
                  <Checkbox
                    id={estado}
                    checked={filters.estado.includes(estado)}
                    onCheckedChange={(checked) => {
                      const newEstados = checked
                        ? [...filters.estado, estado]
                        : filters.estado.filter(e => e !== estado);
                      handleFilterChange('estado', newEstados);
                    }}
                  />
                  <label htmlFor={estado} className="text-sm cursor-pointer">
                    {estado}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Rango de Fechas</label>
            <div className="space-y-2">
              <Input
                type="date"
                placeholder="Fecha desde"
                value={filters.fechaDesde}
                onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
              />
              <Input
                type="date"
                placeholder="Fecha hasta"
                value={filters.fechaHasta}
                onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
              />
            </div>
          </div>

          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full"
            disabled={activeFiltersCount === 0}
          >
            Limpiar Filtros
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
