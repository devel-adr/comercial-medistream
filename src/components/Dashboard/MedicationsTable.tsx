
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Eye, Link, ArrowUp, ArrowDown } from 'lucide-react';

interface MedicationsTableProps {
  medications: any[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeFilters: any;
}

export const MedicationsTable: React.FC<MedicationsTableProps> = ({
  medications = [],
  loading,
  searchTerm,
  onSearchChange,
  activeFilters
}) => {
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('aprobado')) return 'bg-green-100 text-green-800';
    if (statusLower.includes('ensayo')) return 'bg-blue-100 text-blue-800';
    if (statusLower.includes('rechazado')) return 'bg-red-100 text-red-800';
    if (statusLower.includes('pendiente')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = medications.filter(med => {
      // Búsqueda global
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const searchFields = [
          med.nombre_lab,
          med.area_terapeutica,
          med.nombre_del_farmaco,
          med.nombre_de_la_molecula,
          med.mecanismo_de_accion,
          med.sub_area_de_tratamiento,
          med.alteracion_genetica_dirigida,
          med.linea_de_tratamiento,
          med.estado_en_espana,
          med.ensayos_clinicos_relevantes
        ];
        if (!searchFields.some(field => 
          field && field.toString().toLowerCase().includes(searchLower)
        )) {
          return false;
        }
      }

      // Filtros específicos
      if (activeFilters.laboratorio && med.nombre_lab !== activeFilters.laboratorio) {
        return false;
      }
      
      if (activeFilters.alteracionGenetica && med.alteracion_genetica_dirigida !== activeFilters.alteracionGenetica) {
        return false;
      }
      
      if (activeFilters.estado && activeFilters.estado.length > 0 && !activeFilters.estado.includes(med.estado_en_espana)) {
        return false;
      }
      
      if (activeFilters.fechaDesde && med.fecha_de_aprobacion_espana) {
        if (new Date(med.fecha_de_aprobacion_espana) < new Date(activeFilters.fechaDesde)) {
          return false;
        }
      }
      
      if (activeFilters.fechaHasta && med.fecha_de_aprobacion_espana) {
        if (new Date(med.fecha_de_aprobacion_espana) > new Date(activeFilters.fechaHasta)) {
          return false;
        }
      }

      return true;
    });

    // Ordenamiento
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [medications, searchTerm, activeFilters, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) {
      return <ArrowUp className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4" />
      : <ArrowDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <Card>
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
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Medicamentos ({filteredAndSortedData.length})
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar medicamentos..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="w-full">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[120px]"
                    onClick={() => handleSort('nombre_lab')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Laboratorio</span>
                      <SortIcon column="nombre_lab" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[140px]"
                    onClick={() => handleSort('area_terapeutica')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Área Terapéutica</span>
                      <SortIcon column="area_terapeutica" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[150px]"
                    onClick={() => handleSort('nombre_del_farmaco')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Fármaco</span>
                      <SortIcon column="nombre_del_farmaco" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[150px]"
                    onClick={() => handleSort('nombre_de_la_molecula')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Molécula</span>
                      <SortIcon column="nombre_de_la_molecula" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[160px]"
                    onClick={() => handleSort('mecanismo_de_accion')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Mecanismo de Acción</span>
                      <SortIcon column="mecanismo_de_accion" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[160px]"
                    onClick={() => handleSort('sub_area_de_tratamiento')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Sub Área Tratamiento</span>
                      <SortIcon column="sub_area_de_tratamiento" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[160px]"
                    onClick={() => handleSort('alteracion_genetica_dirigida')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Alteración Genética</span>
                      <SortIcon column="alteracion_genetica_dirigida" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[140px]"
                    onClick={() => handleSort('linea_de_tratamiento')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Línea Tratamiento</span>
                      <SortIcon column="linea_de_tratamiento" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[130px]"
                    onClick={() => handleSort('estado_en_espana')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Estado España</span>
                      <SortIcon column="estado_en_espana" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[130px]"
                    onClick={() => handleSort('fecha_de_aprobacion_espana')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Fecha Aprobación</span>
                      <SortIcon column="fecha_de_aprobacion_espana" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[180px]"
                    onClick={() => handleSort('ensayos_clinicos_relevantes')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Ensayos Clínicos</span>
                      <SortIcon column="ensayos_clinicos_relevantes" />
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((medication, index) => (
                  <TableRow 
                    key={medication.ID_NUM || index} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {medication.nombre_lab || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {medication.area_terapeutica || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {medication.nombre_del_farmaco || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {medication.nombre_de_la_molecula || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {medication.mecanismo_de_accion || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {medication.sub_area_de_tratamiento || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {medication.alteracion_genetica_dirigida || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {medication.linea_de_tratamiento || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(medication.estado_en_espana)}>
                        {medication.estado_en_espana || 'Sin estado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {medication.fecha_de_aprobacion_espana || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {medication.ensayos_clinicos_relevantes || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {medication.fuente_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={medication.fuente_url} target="_blank" rel="noopener noreferrer">
                              <Link className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} de {filteredAndSortedData.length} resultados
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
