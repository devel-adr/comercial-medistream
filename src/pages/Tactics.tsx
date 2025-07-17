
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Navigation } from '@/components/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Search, Filter, BarChart3, Star } from 'lucide-react';
import { usePharmaTacticsData } from '@/hooks/usePharmaTacticsData';
import { useTacticsFavorites } from '@/hooks/useTacticsFavorites';
import { TacticsKPIs } from '@/components/Tactics/TacticsKPIs';
import { TacticsCards } from '@/components/Tactics/TacticsCards';
import { EditTacticModal } from '@/components/Tactics/EditTacticModal';

const Tactics = () => {
  const { data, loading, error, refresh } = usePharmaTacticsData();
  const { favorites, toggleFavorite, isFavorite } = useTacticsFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLab, setSelectedLab] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [editingTactic, setEditingTactic] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Get unique values for filters and filter out empty/null values
  const uniqueLabs = [...new Set(data.map(item => item.laboratorio))]
    .filter(lab => lab && lab.trim() !== '')
    .sort();
  
  const uniqueAreas = [...new Set(data.map(item => item.area_terapeutica))]
    .filter(area => area && area.trim() !== '')
    .sort();
  
  const uniqueFormats = [...new Set(data.map(item => item.formato))]
    .filter(format => format && format.trim() !== '')
    .sort();

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLab('');
    setSelectedArea('');
    setSelectedFormat('');
    setShowOnlyFavorites(false);
  };

  const handleFavoritesChange = (checked: boolean | "indeterminate") => {
    setShowOnlyFavorites(checked === true);
  };

  const handleEditTactic = (tactic: any) => {
    setEditingTactic(tactic);
    setIsEditModalOpen(true);
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

          {/* Filters Section */}
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
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="favorites"
                  checked={showOnlyFavorites}
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

          {/* Tactics Cards */}
          <TacticsCards
            data={data}
            loading={loading}
            searchTerm={searchTerm}
            selectedLab={selectedLab === 'all' ? '' : selectedLab}
            selectedArea={selectedArea === 'all' ? '' : selectedArea}
            selectedFormat={selectedFormat === 'all' ? '' : selectedFormat}
            showOnlyFavorites={showOnlyFavorites}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            onEdit={handleEditTactic}
          />

          <EditTacticModal
            tactic={editingTactic}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingTactic(null);
            }}
            onSuccess={refresh}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Tactics;
