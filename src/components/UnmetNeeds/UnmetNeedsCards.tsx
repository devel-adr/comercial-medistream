
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, BarChart3 } from 'lucide-react';

interface UnmetNeedsCardsProps {
  data: any[];
  onViewDetails: (item: any) => void;
  onSelectForTactics: (id: string, selected: boolean) => void;
  selectedIds: Set<string>;
}

export const UnmetNeedsCards: React.FC<UnmetNeedsCardsProps> = ({
  data,
  onViewDetails,
  onSelectForTactics,
  selectedIds
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
            
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  #{item.id_UN_table || index + 1}
                </div>
                <Badge className={`${getImpactColor(item.impacto)} px-3 py-1 text-xs font-semibold uppercase tracking-wider`}>
                  {item.impacto || 'Sin clasificar'}
                </Badge>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3 min-h-[4.5rem]">
                  {item.unmet_need || 'Sin descripción disponible'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-3 border-blue-400">
                  <div className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider font-medium mb-1">
                    Área Terapéutica
                  </div>
                  <div className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">
                    {item.area_terapeutica || 'N/A'}
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border-l-3 border-green-400">
                  <div className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wider font-medium mb-1">
                    Horizonte
                  </div>
                  <div className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">
                    {item.horizonte_temporal || 'N/A'}
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-3 border-purple-400">
                  <div className="text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wider font-medium mb-1">
                    Fármaco
                  </div>
                  <div className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">
                    {item.farmaco || 'N/A'}
                  </div>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border-l-3 border-orange-400">
                  <div className="text-xs text-orange-600 dark:text-orange-400 uppercase tracking-wider font-medium mb-1">
                    Laboratorio
                  </div>
                  <div className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">
                    {item.lab || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(item)}
                  className="flex-1 text-xs uppercase tracking-wider font-medium"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver Detalles
                </Button>
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSelectForTactics(item.id_UN_table?.toString(), !isSelected)}
                  className="flex-1 text-xs uppercase tracking-wider font-medium"
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
