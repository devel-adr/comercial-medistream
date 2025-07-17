
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Star } from 'lucide-react';

interface SimpleFiltersPanelProps {
  onFiltersChange: (filters: any) => void;
  medications: any[];
}

export const SimpleFiltersPanel: React.FC<SimpleFiltersPanelProps> = ({
  onFiltersChange,
  medications = []
}) => {
  const [filters, setFilters] = useState({
    laboratorio: '',
    areaTerapeutica: '',
    farmaco: '',
    molecula: '',
    estado: '',
    favoritos: ''
  });

  // Filtrar datos basándose en las selecciones previas
  const filteredData = useMemo(() => {
    let filtered = [...medications];
    
    if (filters.laboratorio) {
      filtered = filtered.filter(med => med.nombre_lab === filters.laboratorio);
    }
    if (filters.areaTerapeutica) {
      filtered = filtered.filter(med => med.area_terapeutica === filters.areaTerapeutica);
    }
    if (filters.farmaco) {
      filtered = filtered.filter(med => med.nombre_del_farmaco === filters.farmaco);
    }
    if (filters.molecula) {
      filtered = filtered.filter(med => med.nombre_de_la_molecula === filters.molecula);
    }
    
    return filtered;
  }, [medications, filters]);

  // Opciones dinámicas basadas en filtros anteriores
  const dynamicOptions = useMemo(() => {
    // Para laboratorios, siempre mostrar todos
    const laboratorios = [...new Set(medications.map(med => med.nombre_lab).filter(Boolean))].sort();
    
    // Para áreas terapéuticas, filtrar por laboratorio seleccionado
    let dataForAreas = medications;
    if (filters.laboratorio) {
      dataForAreas = medications.filter(med => med.nombre_lab === filters.laboratorio);
    }
    const areasTerapeuticas = [...new Set(dataForAreas.map(med => med.area_terapeutica).filter(Boolean))].sort();
    
    // Para fármacos, filtrar por laboratorio y área seleccionados
    let dataForFarmacos = medications;
    if (filters.laboratorio) {
      dataForFarmacos = dataForFarmacos.filter(med => med.nombre_lab === filters.laboratorio);
    }
    if (filters.areaTerapeutica) {
      dataForFarmacos = dataForFarmacos.filter(med => med.area_terapeutica === filters.areaTerapeutica);
    }
    const farmacos = [...new Set(dataForFarmacos.map(med => med.nombre_del_farmaco).filter(Boolean))].sort();
    
    // Para moléculas, filtrar por todas las selecciones anteriores
    let dataForMoleculas = medications;
    if (filters.laboratorio) {
      dataForMoleculas = dataForMoleculas.filter(med => med.nombre_lab === filters.laboratorio);
    }
    if (filters.areaTerapeutica) {
      dataForMoleculas = dataForMoleculas.filter(med => med.area_terapeutica === filters.areaTerapeutica);
    }
    if (filters.farmaco) {
      dataForMoleculas = dataForMoleculas.filter(med => med.nombre_del_farmaco === filters.farmaco);
    }
    const moleculas = [...new Set(dataForMoleculas.map(med => med.nombre_de_la_molecula).filter(Boolean))].sort();
    
    // Para estados, usar los datos filtrados
    const estados = [...new Set(filteredData.map(med => med.estado_en_espana).filter(Boolean))].sort();

    return {
      laboratorios,
      areasTerapeuticas,
      farmacos,
      moleculas,
      estados
    };
  }, [medications, filters, filteredData]);

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

  const clearFilters = () => {
    const emptyFilters = {
      laboratorio: '',
      areaTerapeutica: '',
      farmaco: '',
      molecula: '',
      estado: '',
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
              disabled={!filters.laboratorio && dynamicOptions.areasTerapeuticas.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={filters.laboratorio ? "Seleccionar área" : "Todas"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
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
                {dynamicOptions.moleculas.map((molecula) => (
                  <SelectItem key={molecula} value={molecula}>{molecula}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Estado</label>
            <Select
              value={filters.estado}
              onValueChange={(value) => handleFilterChange('estado', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {dynamicOptions.estados.map((estado) => (
                  <SelectItem key={estado} value={estado}>{estado}</SelectItem>
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
