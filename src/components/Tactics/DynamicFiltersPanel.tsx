
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X, Star } from 'lucide-react';

interface DynamicFiltersPanelProps {
  onFiltersChange: (filters: any) => void;
  tactics: any[];
}

export const DynamicFiltersPanel: React.FC<DynamicFiltersPanelProps> = ({
  onFiltersChange,
  tactics = []
}) => {
  const [filters, setFilters] = useState({
    laboratorio: '',
    areaTerapeutica: '',
    farmaco: '',
    molecula: '',
    formato: '',
    favoritos: false
  });

  // Filtrar datos basándose en las selecciones previas
  const filteredData = useMemo(() => {
    let filtered = [...tactics];
    
    if (filters.laboratorio) {
      filtered = filtered.filter(tactic => tactic.laboratorio === filters.laboratorio);
    }
    if (filters.areaTerapeutica) {
      filtered = filtered.filter(tactic => tactic.area_terapeutica === filters.areaTerapeutica);
    }
    if (filters.farmaco) {
      filtered = filtered.filter(tactic => tactic.farmaco === filters.farmaco);
    }
    if (filters.molecula) {
      filtered = filtered.filter(tactic => tactic.molecula === filters.molecula);
    }
    
    return filtered;
  }, [tactics, filters]);

  // Opciones dinámicas basadas en filtros anteriores
  const dynamicOptions = useMemo(() => {
    // Para laboratorios, siempre mostrar todos
    const laboratorios = [...new Set(tactics.map(tactic => tactic.laboratorio).filter(Boolean))].sort();
    
    // Para áreas terapéuticas, filtrar por laboratorio seleccionado
    let dataForAreas = tactics;
    if (filters.laboratorio) {
      dataForAreas = tactics.filter(tactic => tactic.laboratorio === filters.laboratorio);
    }
    const areasTerapeuticas = [...new Set(dataForAreas.map(tactic => tactic.area_terapeutica).filter(Boolean))].sort();
    
    // Para fármacos, filtrar por laboratorio y área seleccionados
    let dataForFarmacos = tactics;
    if (filters.laboratorio) {
      dataForFarmacos = dataForFarmacos.filter(tactic => tactic.laboratorio === filters.laboratorio);
    }
    if (filters.areaTerapeutica) {
      dataForFarmacos = dataForFarmacos.filter(tactic => tactic.area_terapeutica === filters.areaTerapeutica);
    }
    const farmacos = [...new Set(dataForFarmacos.map(tactic => tactic.farmaco).filter(Boolean))].sort();
    
    // Para moléculas, filtrar por todas las selecciones anteriores
    let dataForMoleculas = tactics;
    if (filters.laboratorio) {
      dataForMoleculas = dataForMoleculas.filter(tactic => tactic.laboratorio === filters.laboratorio);
    }
    if (filters.areaTerapeutica) {
      dataForMoleculas = dataForMoleculas.filter(tactic => tactic.area_terapeutica === filters.areaTerapeutica);
    }
    if (filters.farmaco) {
      dataForMoleculas = dataForMoleculas.filter(tactic => tactic.farmaco === filters.farmaco);
    }
    const moleculas = [...new Set(dataForMoleculas.map(tactic => tactic.molecula).filter(Boolean))].sort();
    
    // Para formatos, usar los datos filtrados
    const formatos = [...new Set(filteredData.map(tactic => tactic.formato).filter(Boolean))].sort();

    return {
      laboratorios,
      areasTerapeuticas,
      farmacos,
      moleculas,
      formatos
    };
  }, [tactics, filters, filteredData]);

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
      formato: '',
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
            <label className="text-sm font-medium mb-1 block">Formato</label>
            <Select
              value={filters.formato}
              onValueChange={(value) => handleFilterChange('formato', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar formato" />
              </SelectTrigger>
              <SelectContent>
                {dynamicOptions.formatos.map((formato) => (
                  <SelectItem key={formato} value={formato}>{formato}</SelectItem>
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
