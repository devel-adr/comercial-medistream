
import React, { useState, useMemo, useEffect } from 'react';
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
    areaTerapeutica: '',
    farmaco: '',
    molecula: '',
    mecanismoAccion: '',
    subAreaTratamiento: '',
    alteracionGenetica: '',
    lineaTratamiento: '',
    estado: [],
    fechaDesde: '',
    fechaHasta: ''
  });

  // Opciones únicas para cada filtro
  const uniqueOptions = useMemo(() => ({
    laboratorios: [...new Set(medications.map(med => med.nombre_lab).filter(Boolean))].sort(),
    areasTerapeuticas: [...new Set(medications.map(med => med.area_terapeutica).filter(Boolean))].sort(),
    farmacos: [...new Set(medications.map(med => med.nombre_del_farmaco).filter(Boolean))].sort(),
    moleculas: [...new Set(medications.map(med => med.nombre_de_la_molecula).filter(Boolean))].sort(),
    mecanismosAccion: [...new Set(medications.map(med => med.mecanismo_de_accion).filter(Boolean))].sort(),
    subAreasTratamiento: [...new Set(medications.map(med => med.sub_area_de_tratamiento).filter(Boolean))].sort(),
    alteracionesGeneticas: [...new Set(medications.map(med => med.alteracion_genetica_dirigida).filter(Boolean))].sort(),
    lineasTratamiento: [...new Set(medications.map(med => med.linea_de_tratamiento).filter(Boolean))].sort(),
    estados: [...new Set(medications.map(med => med.estado_en_espana).filter(Boolean))].sort()
  }), [medications]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      laboratorio: '',
      areaTerapeutica: '',
      farmaco: '',
      molecula: '',
      mecanismoAccion: '',
      subAreaTratamiento: '',
      alteracionGenetica: '',
      lineaTratamiento: '',
      estado: [],
      fechaDesde: '',
      fechaHasta: ''
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
        
        <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Laboratorio */}
          <div>
            <label className="text-sm font-medium mb-2 block">Laboratorio</label>
            <Select
              value={filters.laboratorio}
              onValueChange={(value) => handleFilterChange('laboratorio', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar laboratorio" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {uniqueOptions.laboratorios.map((lab) => (
                  <SelectItem key={lab} value={lab}>{lab}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              <SelectContent className="max-h-[300px]">
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
              <SelectContent className="max-h-[300px]">
                {uniqueOptions.farmacos.map((farmaco) => (
                  <SelectItem key={farmaco} value={farmaco}>{farmaco}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Molécula */}
          <div>
            <label className="text-sm font-medium mb-2 block">Molécula</label>
            <Select
              value={filters.molecula}
              onValueChange={(value) => handleFilterChange('molecula', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar molécula" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {uniqueOptions.moleculas.map((molecula) => (
                  <SelectItem key={molecula} value={molecula}>{molecula}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mecanismo de Acción */}
          <div>
            <label className="text-sm font-medium mb-2 block">Mecanismo de Acción</label>
            <Select
              value={filters.mecanismoAccion}
              onValueChange={(value) => handleFilterChange('mecanismoAccion', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar mecanismo" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {uniqueOptions.mecanismosAccion.map((mecanismo) => (
                  <SelectItem key={mecanismo} value={mecanismo}>{mecanismo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sub Área de Tratamiento */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sub Área de Tratamiento</label>
            <Select
              value={filters.subAreaTratamiento}
              onValueChange={(value) => handleFilterChange('subAreaTratamiento', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sub área" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {uniqueOptions.subAreasTratamiento.map((subArea) => (
                  <SelectItem key={subArea} value={subArea}>{subArea}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Línea de Tratamiento */}
          <div>
            <label className="text-sm font-medium mb-2 block">Línea de Tratamiento</label>
            <Select
              value={filters.lineaTratamiento}
              onValueChange={(value) => handleFilterChange('lineaTratamiento', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar línea" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {uniqueOptions.lineasTratamiento.map((linea) => (
                  <SelectItem key={linea} value={linea}>{linea}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alteración Genética */}
          <div>
            <label className="text-sm font-medium mb-2 block">Alteración Genética</label>
            <Select
              value={filters.alteracionGenetica}
              onValueChange={(value) => handleFilterChange('alteracionGenetica', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar alteración" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {uniqueOptions.alteracionesGeneticas.map((alt) => (
                  <SelectItem key={alt} value={alt}>{alt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estado en España */}
          <div>
            <label className="text-sm font-medium mb-3 block">Estado en España</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {uniqueOptions.estados.map((estado) => (
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

          {/* Rango de Fechas */}
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
            Limpiar Filtros ({activeFiltersCount})
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
