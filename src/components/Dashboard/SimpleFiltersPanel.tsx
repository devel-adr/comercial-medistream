
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface SimpleFiltersPanelProps {
  onFiltersChange: (filters: any) => void;
  medications: any[];
}

export const SimpleFiltersPanel: React.FC<SimpleFiltersPanelProps> = ({
  onFiltersChange,
  medications
}) => {
  const uniqueOptions = useMemo(() => ({
    labs: [...new Set(medications.map(item => item.laboratorio).filter(Boolean))].sort(),
    areas: [...new Set(medications.map(item => item.area_terapeutica).filter(Boolean))].sort(),
    subareas: [...new Set(medications.map(item => item.subarea).filter(Boolean))].sort(),
    farmacos: [...new Set(medications.map(item => item.farmaco).filter(Boolean))].sort(),
    estados: [...new Set(medications.map(item => item.estado).filter(Boolean))].sort()
  }), [medications]);

  const handleFilterChange = (filterType: string, value: string) => {
    onFiltersChange((prev: any) => ({
      ...prev,
      [filterType]: value === 'all' ? '' : value
    }));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select onValueChange={(value) => handleFilterChange('laboratorio', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Laboratorio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {uniqueOptions.labs.map((lab) => (
                <SelectItem key={lab} value={lab}>{lab}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange('area_terapeutica', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Área Terapéutica" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {uniqueOptions.areas.map((area) => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange('subarea', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Subárea" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {uniqueOptions.subareas.map((subarea) => (
                <SelectItem key={subarea} value={subarea}>{subarea}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange('farmaco', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Fármaco" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {uniqueOptions.farmacos.map((farmaco) => (
                <SelectItem key={farmaco} value={farmaco}>{farmaco}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange('estado', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {uniqueOptions.estados.map((estado) => (
                <SelectItem key={estado} value={estado}>{estado}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
