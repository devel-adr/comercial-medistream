
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, FileText, Users, Target, Clock, Lightbulb, Eye } from 'lucide-react';

interface UnmetNeedsCardsProps {
  data: any[];
  onSelectForTactics: (id: string, selected: boolean) => void;
  selectedIds: Set<string>;
  formatSelections: Record<string, string>;
  onFormatChange: (id: string, format: string) => void;
  formatOptions: string[];
  onViewDetails?: (unmetNeed: any) => void;
}

export const UnmetNeedsCards: React.FC<UnmetNeedsCardsProps> = ({
  data,
  onSelectForTactics,
  selectedIds,
  formatSelections,
  onFormatChange,
  formatOptions,
  onViewDetails
}) => {
  const getImpactColor = (impacto: string) => {
    if (!impacto) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    const impactoLower = impacto.toLowerCase();
    if (impactoLower.includes('alto')) return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
    if (impactoLower.includes('medio')) return 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white';
    if (impactoLower.includes('bajo')) return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getHorizonteColor = (horizonte: string) => {
    if (!horizonte) return 'border-gray-200';
    const horizonteLower = horizonte.toLowerCase();
    if (horizonteLower.includes('corto') || horizonteLower.includes('inmediato')) return 'border-green-400';
    if (horizonteLower.includes('medio')) return 'border-yellow-400';
    if (horizonteLower.includes('largo')) return 'border-red-400';
    return 'border-gray-200';
  };

  const handleViewDetails = (item: any) => {
    console.log('Eye button clicked for item:', item);
    if (onViewDetails) {
      onViewDetails(item);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((item, index) => {
        const isSelected = selectedIds.has(item.id_UN_table?.toString());
        return (
          <Card 
            key={item.id_UN_table || index}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${getHorizonteColor(item.horizonte_temporal)} ${
              isSelected ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : ''
            }`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-full"></div>
            
            <CardContent className="p-5 space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  #{item.id_UN_table || index + 1}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getImpactColor(item.impacto)} px-2 py-1 text-xs font-semibold uppercase tracking-wider`}>
                    {item.impacto || 'Sin clasificar'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleViewDetails(item);
                    }}
                    className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                    type="button"
                  >
                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </Button>
                </div>
              </div>

              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded border-l-2 border-blue-400">
                  <div className="text-blue-600 dark:text-blue-400 font-medium mb-1">Área Terapéutica</div>
                  <div className="text-gray-900 dark:text-gray-100 truncate">{item.area_terapeutica || 'N/A'}</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded border-l-2 border-purple-400">
                  <div className="text-purple-600 dark:text-purple-400 font-medium mb-1">Fármaco</div>
                  <div className="text-gray-900 dark:text-gray-100 truncate">{item.farmaco || 'N/A'}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded border-l-2 border-green-400">
                  <div className="text-green-600 dark:text-green-400 font-medium mb-1">Horizonte</div>
                  <div className="text-gray-900 dark:text-gray-100 truncate">{item.horizonte_temporal || 'N/A'}</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded border-l-2 border-orange-400">
                  <div className="text-orange-600 dark:text-orange-400 font-medium mb-1">Laboratorio</div>
                  <div className="text-gray-900 dark:text-gray-100 truncate">{item.lab || 'N/A'}</div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="space-y-3">
                {/* Unmet Need */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unmet Need</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {item.unmet_need || 'Sin descripción disponible'}
                  </p>
                </div>

                {/* Racional */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Racional</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {item.racional || 'Sin información disponible'}
                  </p>
                </div>

                {/* Oportunidad Estratégica */}
                {item.oportunidad_estrategica && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-700 dark:text-green-300">Oportunidad Estratégica</span>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      {item.oportunidad_estrategica}
                    </p>
                  </div>
                )}

                {/* Conclusión */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Conclusión</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {item.conclusion || 'Sin conclusión disponible'}
                  </p>
                </div>
              </div>

              {/* Format Selection and Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <Select
                    value={formatSelections[item.id_UN_table?.toString()] || 'none'}
                    onValueChange={(value) => 
                      onFormatChange(item.id_UN_table?.toString(), value === 'none' ? '' : value)
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Formato</SelectItem>
                      {formatOptions.map((format) => (
                        <SelectItem key={format} value={format}>
                          {format}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSelectForTactics(item.id_UN_table?.toString(), !isSelected)}
                  className="text-xs uppercase tracking-wider font-medium"
                >
                  <BarChart3 className="w-3 h-3 mr-1" />
                  {isSelected ? 'Seleccionado' : 'Seleccionar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
