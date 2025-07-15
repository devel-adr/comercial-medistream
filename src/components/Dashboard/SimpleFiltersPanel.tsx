
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, X } from 'lucide-react';

interface SimpleFiltersPanelProps {
  onFiltersChange: (filters: any) => void;
  medications: any[];
}

export const SimpleFiltersPanel: React.FC<SimpleFiltersPanelProps> = ({
  onFiltersChange,
  medications
}) => {
  const [filters, setFilters] = useState({
    laboratorio: '',
    areaTerapeutica: '',
    farmaco: '',
    molecula: '',
    estado: ''
  });

  const uniqueOptions = useMemo(() => ({
    laboratorios: [...new Set(medications.map(med => med.nombre_lab).filter(Boolean))].sort(),
    areasTerapeuticas: [...new Set(medications.map(med => med.area_terapeutica).filter(Boolean))].sort(),
    farmacos: [...new Set(medications.map(med => med.nombre_del_farmaco).filter(Boolean))].sort(),
    moleculas: [...new Set(medications.map(med => med.nombre_de_la_molecula).filter(Boolean))].sort(),
    estados: [...new Set(medications.map(med => med.estado_en_espana).filter(Boolean))].sort()
  }), [medications]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value === 'all' ? '' : value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      laboratorio: '',
      areaTerapeutica: '',
      farmaco: '',
      molecula: '',
      estado: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Filtros
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Laboratorio</label>
            <Select
              value={filters.laboratorio}
              onValueChange={(value) => handleFilterChange('laboratorio', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los laboratorios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los laboratorios</SelectItem>
                {uniqueOptions.laboratorios.map((lab) => (
                  <SelectItem key={lab} value={lab}>{lab}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Área Terapéutica</label>
            <Select
              value={filters.areaTerapeutica}
              onValueChange={(value) => handleFilterChange('areaTerapeutica', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las áreas" />
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
              onValueChange={(value) => handleFilterChange('farmaco', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los fármacos" />
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
            <label className="text-sm font-medium mb-2 block">Molécula</label>
            <Select
              value={filters.molecula}
              onValueChange={(value) => handleFilterChange('molecula', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las moléculas" />
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
            <label className="text-sm font-medium mb-2 block">Estado</label>
            <Select
              value={filters.estado}
              onValueChange={(value) => handleFilterChange('estado', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {uniqueOptions.estados.map((estado) => (
                  <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
