
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Star, Brain } from 'lucide-react';
import { useAreaClassification } from '@/hooks/useAreaClassification';

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
    areaIA: '',
    areaTerapeutica: '',
    farmaco: '',
    molecula: '',
    formato: '',
    favoritos: ''
  });

  // Clasificación automática de áreas usando IA
  const { itemsWithAreas, availableAreas, isLoading: classifyingAreas } = useAreaClassification(
    tactics,
    (tactic) => ({
      areaTerapeutica: tactic.area_terapeutica,
      farmaco: tactic.farmaco,
      molecula: tactic.molecula
    })
  );

  // Filtrar datos basándose en las selecciones previas
  const filteredData = useMemo(() => {
    let filtered = [...itemsWithAreas];
    
    if (filters.laboratorio) {
      filtered = filtered.filter(tactic => tactic.laboratorio === filters.laboratorio);
    }
    if (filters.areaIA) {
      filtered = filtered.filter(tactic => tactic.areaIA === filters.areaIA);
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
  }, [itemsWithAreas, filters]);

  // Opciones dinámicas basadas en filtros anteriores
  const dynamicOptions = useMemo(() => {
    // Para laboratorios, siempre mostrar todos
    const laboratorios = [...new Set(itemsWithAreas.map(tactic => tactic.laboratorio).filter(Boolean))].sort();
    
    // Para áreas IA, filtrar por laboratorio seleccionado
    let dataForAreaIA = itemsWithAreas;
    if (filters.laboratorio) {
      dataForAreaIA = itemsWithAreas.filter(tactic => tactic.laboratorio === filters.laboratorio);
    }
    const areasIA = [...new Set(dataForAreaIA.map(tactic => tactic.areaIA).filter(Boolean))].sort();
    
    // Para áreas terapéuticas, filtrar por laboratorio y área IA seleccionados
    let dataForAreas = itemsWithAreas;
    if (filters.laboratorio) {
      dataForAreas = dataForAreas.filter(tactic => tactic.laboratorio === filters.laboratorio);
    }
    if (filters.areaIA) {
      dataForAreas = dataForAreas.filter(tactic => tactic.areaIA === filters.areaIA);
    }
    const areasTerapeuticas = [...new Set(dataForAreas.map(tactic => tactic.area_terapeutica).filter(Boolean))].sort();
    
    // Para fármacos, filtrar por laboratorio, área IA y área terapéutica seleccionados
    let dataForFarmacos = itemsWithAreas;
    if (filters.laboratorio) {
      dataForFarmacos = dataForFarmacos.filter(tactic => tactic.laboratorio === filters.laboratorio);
    }
    if (filters.areaIA) {
      dataForFarmacos = dataForFarmacos.filter(tactic => tactic.areaIA === filters.areaIA);
    }
    if (filters.areaTerapeutica) {
      dataForFarmacos = dataForFarmacos.filter(tactic => tactic.area_terapeutica === filters.areaTerapeutica);
    }
    const farmacos = [...new Set(dataForFarmacos.map(tactic => tactic.farmaco).filter(Boolean))].sort();
    
    // Para moléculas, filtrar por todas las selecciones anteriores
    let dataForMoleculas = itemsWithAreas;
    if (filters.laboratorio) {
      dataForMoleculas = dataForMoleculas.filter(tactic => tactic.laboratorio === filters.laboratorio);
    }
    if (filters.areaIA) {
      dataForMoleculas = dataForMoleculas.filter(tactic => tactic.areaIA === filters.areaIA);
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
      areasIA,
      areasTerapeuticas,
      farmacos,
      moleculas,
      formatos
    };
  }, [itemsWithAreas, filters, filteredData]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value === 'all' ? '' : value };
    
    // Limpiar filtros dependientes cuando se cambia un filtro padre
    if (key === 'laboratorio') {
      newFilters.areaIA = '';
      newFilters.areaTerapeutica = '';
      newFilters.farmaco = '';
      newFilters.molecula = '';
    } else if (key === 'areaIA') {
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

  const clearFilters = () => {
    const emptyFilters = {
      laboratorio: '',
      areaIA: '',
      areaTerapeutica: '',
      farmaco: '',
      molecula: '',
      formato: '',
      favoritos: ''
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Filtros Dinámicos</h3>
          {classifyingAreas && <Brain className="w-4 h-4 text-purple-500 animate-pulse" />}
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Laboratorio</label>
            <Select
              value={filters.laboratorio}
              onValueChange={(value) => handleFilterChange('laboratorio', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Todos los laboratorios</SelectItem>
                {dynamicOptions.laboratorios.map((lab) => (
                  <SelectItem key={lab} value={lab}>{lab}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block flex items-center gap-1">
              Área <Brain className="w-3 h-3 text-purple-500" />
            </label>
            <Select
              value={filters.areaIA}
              onValueChange={(value) => handleFilterChange('areaIA', value)}
              disabled={classifyingAreas || (!filters.laboratorio && dynamicOptions.areasIA.length === 0)}
            >
              <SelectTrigger>
                <SelectValue placeholder={classifyingAreas ? "Clasificando..." : (filters.laboratorio ? "Seleccionar área" : "Todas")} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Todas las áreas</SelectItem>
                {dynamicOptions.areasIA.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area === 'breast' ? 'Mama' :
                     area === 'lung' ? 'Pulmón' :
                     area === 'GI' ? 'Gastroenterología' :
                     area === 'GU' ? 'Genitourinario' :
                     area === 'cardio' ? 'Cardiología' :
                     area === 'neuro' ? 'Neurología' :
                     area === 'onco' ? 'Oncología' :
                     area === 'immuno' ? 'Inmunología' :
                     area === 'endo' ? 'Endocrinología' :
                     area === 'derma' ? 'Dermatología' :
                     'Otros'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Área Terapéutica</label>
            <Select
              value={filters.areaTerapeutica}
              onValueChange={(value) => handleFilterChange('areaTerapeutica', value)}
              disabled={!filters.areaIA && dynamicOptions.areasTerapeuticas.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={filters.areaIA ? "Seleccionar área terapéutica" : "Todas"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Todas las áreas</SelectItem>
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
              disabled={!filters.areaTerapeutica && dynamicOptions.farmacos.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={filters.areaTerapeutica ? "Seleccionar fármaco" : "Todos"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Todos los fármacos</SelectItem>
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
              disabled={!filters.farmaco && dynamicOptions.moleculas.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={filters.farmaco ? "Seleccionar molécula" : "Todas"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Todas las moléculas</SelectItem>
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
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Todos los formatos</SelectItem>
                {dynamicOptions.formatos.map((formato) => (
                  <SelectItem key={formato} value={formato}>{formato}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Favoritos</label>
            <Select
              value={filters.favoritos}
              onValueChange={(value) => handleFilterChange('favoritos', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="si">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    Solo Favoritos
                  </div>
                </SelectItem>
                <SelectItem value="no">Sin Favoritos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={activeFiltersCount === 0}
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
