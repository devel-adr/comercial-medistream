
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X, Star } from 'lucide-react';

interface DynamicFiltersPanelProps {
  onFiltersChange: (filters: any) => void;
  unmetNeeds: any[];
}

export const DynamicFiltersPanel: React.FC<DynamicFiltersPanelProps> = ({
  onFiltersChange,
  unmetNeeds = []
}) => {
  const [filters, setFilters] = useState({
    laboratorio: '',
    areaTerapeutica: '',
    farmaco: '',
    molecula: '',
    impacto: '',
    horizonte: '',
    favoritos: false
  });

  // Filtrar datos basándose en las selecciones previas
  const filteredData = useMemo(() => {
    let filtered = [...unmetNeeds];
    
    if (filters.laboratorio) {
      filtered = filtered.filter(un => un.lab === filters.laboratorio);
    }
    if (filters.areaTerapeutica) {
      filtered = filtered.filter(un => un.area_terapeutica === filters.areaTerapeutica);
    }
    if (filters.farmaco) {
      filtered = filtered.filter(un => un.farmaco === filters.farmaco);
    }
    if (filters.molecula) {
      filtered = filtered.filter(un => un.molecula === filters.molecula);
    }
    
    return filtered;
  }, [unmetNeeds, filters]);

  // Opciones dinámicas basadas en filtros anteriores
  const dynamicOptions = useMemo(() => {
    // Para laboratorios, siempre mostrar todos
    const laboratorios = [...new Set(unmetNeeds.map(un => un.lab).filter(Boolean))].sort();
    
    // Para áreas terapéuticas, filtrar por laboratorio seleccionado
    let dataForAreas = unmetNeeds;
    if (filters.laboratorio) {
      dataForAreas = unmetNeeds.filter(un => un.lab === filters.laboratorio);
    }
    const areasTerapeuticas = [...new Set(dataForAreas.map(un => un.area_terapeutica).filter(Boolean))].sort();
    
    // Para fármacos, filtrar por laboratorio y área seleccionados
    let dataForFarmacos = unmetNeeds;
    if (filters.laboratorio) {
      dataForFarmacos = dataForFarmacos.filter(un => un.lab === filters.laboratorio);
    }
    if (filters.areaTerapeutica) {
      dataForFarmacos = dataForFarmacos.filter(un => un.area_terapeutica === filters.areaTerapeutica);
    }
    const farmacos = [...new Set(dataForFarmacos.map(un => un.farmaco).filter(Boolean))].sort();
    
    // Para moléculas, filtrar por todas las selecciones anteriores
    let dataForMoleculas = unmetNeeds;
    if (filters.laboratorio) {
      dataForMoleculas = dataForMoleculas.filter(un => un.lab === filters.laboratorio);
    }
    if (filters.areaTerapeutica) {
      dataForMoleculas = dataForMoleculas.filter(un => un.area_terapeutica === filters.areaTerapeutica);
    }
    if (filters.farmaco) {
      dataForMoleculas = dataForMoleculas.filter(un => un.farmaco === filters.farmaco);
    }
    const moleculas = [...new Set(dataForMoleculas.map(un => un.molecula).filter(Boolean))].sort();
    
    // Para impacto y horizonte, usar los datos filtrados
    const impactos = [...new Set(filteredData.map(un => un.impacto).filter(Boolean))].sort();
    const horizontes = [...new Set(filteredData.map(un => un.horizonte_temporal).filter(Boolean))].sort();

    return {
      laboratorios,
      areasTerapeuticas,
      farmacos,
      moleculas,
      impactos,
      horizontes
    };
  }, [unmetNeeds, filters, filteredData]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    
    // Limpiar filtros dependientes cuando se cambia un filtro padre
    if (key === 'laboratorio') {
      newFilters.areaTerapeutica = '';
      newFilters.farmaco = '';
      newFilters.molecula = '';
    } else if (key === 'areaTerapeutica') {
      newFilters.farmaco = '';
      newFilters.molecula = '';
    } else if (key === 'farmaco') {
      newFilters.molecula = '';
    }
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFavoritesChange = (checked: boolean | "indeterminate") => {
    const newFilters = { ...filters, favoritos: checked === true };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      laboratorio: '',
      areaTerapeutica: '',
      farmaco: '',
      molecula: '',
      impacto: '',
      horizonte: '',
      favoritos: false
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    key === 'favoritos' ? value === true : value !== ''
  ).length;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros Dinámicos
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={activeFiltersCount === 0}
            size="sm"
          >
            <X className="w-4 h-4 mr-2" />
            Limpiar filtros
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Laboratorio</label>
            <Select
              value={filters.laboratorio}
              onValueChange={(value) => handleFilterChange('laboratorio', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar laboratorio" />
              </SelectTrigger>
              <SelectContent>
                {dynamicOptions.laboratorios.map((lab) => (
                  <SelectItem key={lab} value={lab}>{lab}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Área Terapéutica</label>
            <Select
              value={filters.areaTerapeutica}
              onValueChange={(value) => handleFilterChange('areaTerapeutica', value)}
              disabled={!filters.laboratorio}
            >
              <SelectTrigger>
                <SelectValue placeholder={filters.laboratorio ? "Seleccionar área" : "Selecciona laboratorio primero"} />
              </SelectTrigger>
              <SelectContent>
                {dynamicOptions.areasTerapeuticas.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Fármaco</label>
            <Select
              value={filters.farmaco}
              onValueChange={(value) => handleFilterChange('farmaco', value)}
              disabled={!filters.areaTerapeutica}
            >
              <SelectTrigger>
                <SelectValue placeholder={filters.areaTerapeutica ? "Seleccionar fármaco" : "Selecciona área primero"} />
              </SelectTrigger>
              <SelectContent>
                {dynamicOptions.farmacos.map((farmaco) => (
                  <SelectItem key={farmaco} value={farmaco}>{farmaco}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Molécula</label>
            <Select
              value={filters.molecula}
              onValueChange={(value) => handleFilterChange('molecula', value)}
              disabled={!filters.farmaco}
            >
              <SelectTrigger>
                <SelectValue placeholder={filters.farmaco ? "Seleccionar molécula" : "Selecciona fármaco primero"} />
              </SelectTrigger>
              <SelectContent>
                {dynamicOptions.moleculas.map((molecula) => (
                  <SelectItem key={molecula} value={molecula}>{molecula}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Impacto</label>
            <Select
              value={filters.impacto}
              onValueChange={(value) => handleFilterChange('impacto', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar impacto" />
              </SelectTrigger>
              <SelectContent>
                {dynamicOptions.impactos.map((impacto) => (
                  <SelectItem key={impacto} value={impacto}>{impacto}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Horizonte</label>
            <Select
              value={filters.horizonte}
              onValueChange={(value) => handleFilterChange('horizonte', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar horizonte" />
              </SelectTrigger>
              <SelectContent>
                {dynamicOptions.horizontes.map((horizonte) => (
                  <SelectItem key={horizonte} value={horizonte}>{horizonte}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="favorites"
            checked={filters.favoritos}
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
  );
};
