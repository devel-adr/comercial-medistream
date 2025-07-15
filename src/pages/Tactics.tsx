
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Search, Filter, BarChart3, Star, StarOff } from 'lucide-react';
import { usePharmaTacticsData } from '@/hooks/usePharmaTacticsData';
import { TacticsKPIs } from '@/components/Tactics/TacticsKPIs';
import { TacticsCards } from '@/components/Tactics/TacticsCards';
import { toast } from "@/hooks/use-toast";

const Tactics = () => {
  const { data, loading, error } = usePharmaTacticsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLab, setSelectedLab] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const uniqueLabs = [...new Set(data.map(item => item.laboratorio))]
    .filter(lab => lab && lab.trim() !== '')
    .sort();
  
  const uniqueAreas = [...new Set(data.map(item => item.area_terapeutica))]
    .filter(area => area && area.trim() !== '')
    .sort();
  
  const uniqueFormats = [...new Set(data.map(item => item.formato))]
    .filter(format => format && format.trim() !== '')
    .sort();

  const handleToggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    const item = data.find(tactic => tactic.id?.toString() === id);
    
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      toast({
        title: "Favorito eliminado",
        description: `${item?.tactica || 'Táctica'} eliminado de favoritos`,
      });
    } else {
      newFavorites.add(id);
      toast({
        title: "Favorito añadido",
        description: `${item?.tactica || 'Táctica'} añadido a favoritos`,
      });
    }
    setFavorites(newFavorites);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLab('');
    setSelectedArea('');
    setSelectedFormat('');
  };

  if (error) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <Navigation />
          <div className="container mx-auto px-4 py-6">
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <h3 className="text-lg font-semibold mb-2 text-red-600">Error al cargar las tactics</h3>
                <p className="text-gray-600 dark:text-gray-300">{error}</p>
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
              Tactics
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gestión y visualización de tactics farmacéuticas
            </p>
          </div>

          <TacticsKPIs data={data} loading={loading} />

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </CardTitle>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  Limpiar filtros
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar tactics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedLab} onValueChange={setSelectedLab}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar laboratorio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los laboratorios</SelectItem>
                    {uniqueLabs.map((lab) => (
                      <SelectItem key={lab} value={lab}>
                        {lab}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las áreas</SelectItem>
                    {uniqueAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los formatos</SelectItem>
                    {uniqueFormats.map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Tactics ({data.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data
                  .filter(item => {
                    if (searchTerm) {
                      const searchLower = searchTerm.toLowerCase();
                      const searchFields = [
                        item.tactica,
                        item.laboratorio,
                        item.area_terapeutica,
                        item.formato,
                        item.descripcion
                      ];
                      if (!searchFields.some(field => 
                        field && field.toString().toLowerCase().includes(searchLower)
                      )) {
                        return false;
                      }
                    }
                    
                    if (selectedLab && selectedLab !== 'all' && item.laboratorio !== selectedLab) return false;
                    if (selectedArea && selectedArea !== 'all' && item.area_terapeutica !== selectedArea) return false;
                    if (selectedFormat && selectedFormat !== 'all' && item.formato !== selectedFormat) return false;
                    
                    return true;
                  })
                  .map((item) => {
                    const id = item.id?.toString();
                    const isFavorite = favorites.has(id);
                    
                    return (
                      <Card key={id} className={`relative transition-all duration-200 ${
                        isFavorite ? 'ring-2 ring-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : ''
                      }`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-sm line-clamp-2 flex-1" title={item.tactica}>
                              {item.tactica || 'N/A'}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleFavorite(id)}
                              className="h-8 w-8 p-0 flex-shrink-0"
                            >
                              {isFavorite ? (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              ) : (
                                <StarOff className="w-4 h-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Lab:</span>
                              <span className="font-medium truncate ml-2" title={item.laboratorio}>
                                {item.laboratorio || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Área:</span>
                              <span className="font-medium truncate ml-2" title={item.area_terapeutica}>
                                {item.area_terapeutica || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Formato:</span>
                              <span className="font-medium truncate ml-2" title={item.formato}>
                                {item.formato || 'N/A'}
                              </span>
                            </div>
                            {item.descripcion && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3" title={item.descripcion}>
                                  {item.descripcion}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Tactics;
