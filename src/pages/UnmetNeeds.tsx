import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Filter, BarChart3, ArrowUp, ArrowDown, Search, Eye, Grid3x3, Clock, TableIcon } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useUnmetNeedsData } from '@/hooks/useUnmetNeedsData';
import { ThemeProvider } from '@/components/ThemeProvider';
import { toast } from "@/hooks/use-toast";
import { UnmetNeedsKPIs } from '@/components/UnmetNeeds/UnmetNeedsKPIs';
import { UnmetNeedsCards } from '@/components/UnmetNeeds/UnmetNeedsCards';
import { UnmetNeedsTimeline } from '@/components/UnmetNeeds/UnmetNeedsTimeline';
import { UnmetNeedsDetailModal } from '@/components/UnmetNeeds/UnmetNeedsDetailModal';

const formatOptions = ['Programa', 'Webinar', 'Podcast'];
type ViewMode = 'cards' | 'timeline' | 'table';

const UnmetNeeds = () => {
  const [filters, setFilters] = useState({
    lab: '',
    area_terapeutica: '',
    farmaco: '',
    molecula: '',
    impacto: '',
    horizonte_temporal: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [formatSelections, setFormatSelections] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedUnmetNeed, setSelectedUnmetNeed] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const itemsPerPage = 10;
  const selectAllRef = useRef<HTMLButtonElement>(null);

  const { data: unmetNeeds, loading, error } = useUnmetNeedsData();

  // Get unique values for filters
  const uniqueOptions = useMemo(() => ({
    labs: [...new Set(unmetNeeds.map(item => item.lab).filter(Boolean))].sort(),
    areasTerapeuticas: [...new Set(unmetNeeds.map(item => item.area_terapeutica).filter(Boolean))].sort(),
    farmacos: [...new Set(unmetNeeds.map(item => item.farmaco).filter(Boolean))].sort(),
    moleculas: [...new Set(unmetNeeds.map(item => item.molecula).filter(Boolean))].sort(),
    impactos: [...new Set(unmetNeeds.map(item => item.impacto).filter(Boolean))].sort(),
    horizontesTemporales: [...new Set(unmetNeeds.map(item => item.horizonte_temporal).filter(Boolean))].sort()
  }), [unmetNeeds]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = unmetNeeds.filter(item => {
      // Global search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const searchFields = [
          item.unmet_need,
          item.lab,
          item.area_terapeutica,
          item.farmaco,
          item.molecula,
          item.impacto,
          item.horizonte_temporal,
          item.racional,
          item.conclusion
        ];
        if (!searchFields.some(field => 
          field && field.toString().toLowerCase().includes(searchLower)
        )) {
          return false;
        }
      }

      // Specific filters
      if (filters.lab && item.lab !== filters.lab) return false;
      if (filters.area_terapeutica && item.area_terapeutica !== filters.area_terapeutica) return false;
      if (filters.farmaco && item.farmaco !== filters.farmaco) return false;
      if (filters.molecula && item.molecula !== filters.molecula) return false;
      if (filters.impacto && item.impacto !== filters.impacto) return false;
      if (filters.horizonte_temporal && item.horizonte_temporal !== filters.horizonte_temporal) return false;
      
      return true;
    });

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a] || '';
        const bValue = b[sortConfig.key as keyof typeof b] || '';
        
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
  }, [unmetNeeds, filters, sortConfig, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const isAllSelected = paginatedData.length > 0 && 
    paginatedData.every(item => selectedRows.has(item.id_UN_table?.toString()));
  
  const isSomeSelected = paginatedData.some(item => selectedRows.has(item.id_UN_table?.toString()));

  // Handle indeterminate state for select all checkbox
  useEffect(() => {
    if (selectAllRef.current) {
      const checkbox = selectAllRef.current.querySelector('input[type="checkbox"]') as HTMLInputElement;
      if (checkbox) {
        checkbox.indeterminate = isSomeSelected && !isAllSelected;
      }
    }
  }, [isSomeSelected, isAllSelected]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedData.map(item => item.id_UN_table?.toString()).filter(Boolean));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleFormatChange = (id: string, format: string) => {
    setFormatSelections(prev => ({
      ...prev,
      [id]: format
    }));
  };

  const handleViewDetails = (unmetNeed: any) => {
    setSelectedUnmetNeed(unmetNeed);
    setIsDetailModalOpen(true);
  };

  const handleGenerateTactics = () => {
    if (selectedRows.size === 0) {
      toast({
        title: "Error",
        description: "Por favor selecciona al menos una Unmet Need para generar tácticas.",
        variant: "destructive",
      });
      return;
    }

    // Check if all selected rows have a format assigned
    const missingFormats = Array.from(selectedRows).filter(id => !formatSelections[id]);
    if (missingFormats.length > 0) {
      toast({
        title: "Error",
        description: "Por favor asigna un formato a todas las Unmet Needs seleccionadas.",
        variant: "destructive",
      });
      return;
    }

    // Store selected data and navigate to Tactics
    const selectedData = Array.from(selectedRows).map(id => {
      const item = unmetNeeds.find(n => n.id_UN_table?.toString() === id);
      return {
        ...item,
        format: formatSelections[id]
      };
    });

    // Store in localStorage or context for Tactics page
    localStorage.setItem('selectedUnmetNeeds', JSON.stringify(selectedData));
    
    toast({
      title: "Éxito",
      description: `Se han preparado ${selectedRows.size} Unmet Needs para generar tácticas.`,
    });

    // Navigate to tactics (you can use react-router here)
    window.location.href = '/tactics';
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
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <Navigation />
          <div className="container mx-auto px-4 py-6">
            <Card className="w-full">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Unmet Needs Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Análisis completo de necesidades médicas no cubiertas
            </p>
          </div>

          {/* KPIs */}
          <UnmetNeedsKPIs data={filteredAndSortedData} />

          {/* Enhanced Filters Panel */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-4">
                  <label className="text-sm font-medium mb-2 block">Búsqueda Global</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar en todos los campos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Laboratorio</label>
                  <Select
                    value={filters.lab}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, lab: value === 'all' ? '' : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar laboratorio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los laboratorios</SelectItem>
                      {uniqueOptions.labs.map((lab) => (
                        <SelectItem key={lab} value={lab}>{lab}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Área Terapéutica</label>
                  <Select
                    value={filters.area_terapeutica}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, area_terapeutica: value === 'all' ? '' : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar área" />
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
                    onValueChange={(value) => setFilters(prev => ({ ...prev, farmaco: value === 'all' ? '' : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar fármaco" />
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
                    onValueChange={(value) => setFilters(prev => ({ ...prev, molecula: value === 'all' ? '' : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar molécula" />
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
                  <label className="text-sm font-medium mb-2 block">Impacto</label>
                  <Select
                    value={filters.impacto}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, impacto: value === 'all' ? '' : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar impacto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los impactos</SelectItem>
                      {uniqueOptions.impactos.map((impacto) => (
                        <SelectItem key={impacto} value={impacto}>{impacto}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Horizonte Temporal</label>
                  <Select
                    value={filters.horizonte_temporal}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, horizonte_temporal: value === 'all' ? '' : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar horizonte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los horizontes</SelectItem>
                      {uniqueOptions.horizontesTemporales.map((horizonte) => (
                        <SelectItem key={horizonte} value={horizonte}>{horizonte}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Toggle */}
          <div className="flex justify-center">
            <Card className="inline-block">
              <CardContent className="p-2">
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className="text-xs uppercase tracking-wider font-medium"
                  >
                    <Grid3x3 className="w-4 h-4 mr-1" />
                    Vista Cards
                  </Button>
                  <Button
                    variant={viewMode === 'timeline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('timeline')}
                    className="text-xs uppercase tracking-wider font-medium"
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Vista Timeline
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="text-xs uppercase tracking-wider font-medium"
                  >
                    <TableIcon className="w-4 h-4 mr-1" />
                    Vista Tabla
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content based on view mode */}
          {viewMode === 'cards' && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Unmet Needs ({filteredAndSortedData.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UnmetNeedsCards
                  data={filteredAndSortedData}
                  onViewDetails={handleViewDetails}
                  onSelectForTactics={handleSelectRow}
                  selectedIds={selectedRows}
                />
              </CardContent>
            </Card>
          )}

          {viewMode === 'timeline' && (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <UnmetNeedsTimeline data={filteredAndSortedData} />
              </CardContent>
            </Card>
          )}

          {viewMode === 'table' && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Unmet Needs ({filteredAndSortedData.length})
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="w-full">
                  <ScrollArea className="w-full">
                    <div className="w-full overflow-x-auto">
                      <div className="min-w-[900px]">
                        <Table className="w-full">
                          <TableHeader className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">
                            <TableRow className="border-b">
                              <TableHead className="w-[60px] text-center">
                                <Checkbox
                                  ref={selectAllRef}
                                  checked={isAllSelected}
                                  onCheckedChange={handleSelectAll}
                                />
                              </TableHead>
                              <TableHead 
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 w-[120px]"
                                onClick={() => handleSort('lab')}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold">Lab</span>
                                  <SortIcon column="lab" />
                                </div>
                              </TableHead>
                              <TableHead 
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 w-[150px]"
                                onClick={() => handleSort('area_terapeutica')}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold">Área</span>
                                  <SortIcon column="area_terapeutica" />
                                </div>
                              </TableHead>
                              <TableHead 
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 w-[120px]"
                                onClick={() => handleSort('farmaco')}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold">Fármaco</span>
                                  <SortIcon column="farmaco" />
                                </div>
                              </TableHead>
                              <TableHead 
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 w-[120px]"
                                onClick={() => handleSort('molecula')}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold">Molécula</span>
                                  <SortIcon column="molecula" />
                                </div>
                              </TableHead>
                              <TableHead 
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 w-[100px]"
                                onClick={() => handleSort('impacto')}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold">Impacto</span>
                                  <SortIcon column="impacto" />
                                </div>
                              </TableHead>
                              <TableHead 
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 w-[150px]"
                                onClick={() => handleSort('horizonte_temporal')}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold">Horizonte Temporal</span>
                                  <SortIcon column="horizonte_temporal" />
                                </div>
                              </TableHead>
                              <TableHead className="w-[120px]">
                                <span className="font-semibold">Formato</span>
                              </TableHead>
                              <TableHead className="w-[100px]">
                                <span className="font-semibold">Acciones</span>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedData.map((item, index) => {
                              const isSelected = selectedRows.has(item.id_UN_table?.toString());
                              return (
                                <TableRow 
                                  key={item.id_UN_table || index} 
                                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b ${
                                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                  }`}
                                >
                                  <TableCell className="text-center">
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) => 
                                        handleSelectRow(item.id_UN_table?.toString(), checked === true)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div className="w-[100px] text-sm" title={item.lab}>
                                      {item.lab || 'N/A'}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="w-[130px] text-sm" title={item.area_terapeutica}>
                                      {item.area_terapeutica || 'N/A'}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="w-[100px] text-sm" title={item.farmaco}>
                                      {item.farmaco || 'N/A'}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="w-[100px] text-sm" title={item.molecula}>
                                      {item.molecula || 'N/A'}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">
                                      {item.impacto || 'N/A'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="w-[130px] text-sm" title={item.horizonte_temporal}>
                                      {item.horizonte_temporal || 'N/A'}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Select
                                      value={formatSelections[item.id_UN_table?.toString()] || 'none'}
                                      onValueChange={(value) => 
                                        handleFormatChange(item.id_UN_table?.toString(), value === 'none' ? '' : value)
                                      }
                                    >
                                      <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Formato" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="none">Seleccionar</SelectItem>
                                        {formatOptions.map((format) => (
                                          <SelectItem key={format} value={format}>
                                            {format}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleViewDetails(item)}
                                      className="p-2"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </ScrollArea>
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t">
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
                      <span className="text-sm font-medium px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                        {currentPage} / {totalPages}
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
          )}

          {/* Generate Tactics Button */}
          <div className="flex justify-center">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Generar Tácticas
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Selecciona las Unmet Needs y asigna un formato para generar tácticas personalizadas.
                    </p>
                    {selectedRows.size > 0 && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                        {selectedRows.size} Unmet Need{selectedRows.size > 1 ? 's' : ''} seleccionada{selectedRows.size > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleGenerateTactics}
                    disabled={selectedRows.size === 0}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    GENERAR TÁCTICA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detail Modal */}
          <UnmetNeedsDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedUnmetNeed(null);
            }}
            unmetNeed={selectedUnmetNeed}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default UnmetNeeds;
