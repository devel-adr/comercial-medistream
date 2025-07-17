
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, FileText, Users, Target, Clock, Lightbulb, Star, Atom, Trash2, HelpCircle, Edit } from 'lucide-react';

interface UnmetNeedsCardsProps {
  data: any[];
  onSelectForTactics: (id: string, selected: boolean) => void;
  selectedIds: Set<string>;
  formatSelections: Record<string, string>;
  onFormatChange: (id: string, format: string) => void;
  formatOptions: string[];
  onToggleFavorite?: (unmetNeed: any) => void;
  onDelete?: (unmetNeed: any) => void;
  onEdit?: (unmetNeed: any) => void;
  localFavorites?: Set<string>;
  onToggleLocalFavorite?: (id: string) => void;
}

export const UnmetNeedsCards: React.FC<UnmetNeedsCardsProps> = ({
  data,
  onSelectForTactics,
  selectedIds,
  formatSelections,
  onFormatChange,
  formatOptions,
  onToggleFavorite,
  onDelete,
  onEdit,
  localFavorites = new Set(),
  onToggleLocalFavorite
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

  const formatQuestions = (questions: string) => {
    if (!questions || !questions.trim()) return [];
    
    // Split by numbered patterns like "1.-", "2.-", etc.
    const questionPattern = /(\d+\.\-\s*)/;
    const parts = questions.split(questionPattern).filter(part => part.trim());
    
    const formattedQuestions = [];
    for (let i = 0; i < parts.length; i += 2) {
      if (parts[i] && parts[i + 1]) {
        formattedQuestions.push(parts[i] + parts[i + 1].trim());
      }
    }
    
    // If no numbered pattern found, try to split by periods followed by space and capital letter
    if (formattedQuestions.length === 0) {
      const sentences = questions.split(/\.\s+(?=[A-Z¿])/);
      return sentences.map(sentence => sentence.endsWith('.') ? sentence : sentence + '.');
    }
    
    return formattedQuestions;
  };

  const handleToggleFavorite = (item: any) => {
    console.log('Star button clicked for item:', item);
    const itemId = item.id_UN_table?.toString();
    if (onToggleLocalFavorite && itemId) {
      onToggleLocalFavorite(itemId);
    }
  };

  const handleDelete = (item: any) => {
    console.log('Delete button clicked for item:', item);
    if (onDelete) {
      onDelete(item);
    }
  };

  const handleEdit = (item: any) => {
    console.log('Edit button clicked for item:', item);
    if (onEdit) {
      onEdit(item);
    }
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(380px,_1fr))] gap-6">
      {data.map((item, index) => {
        const isSelected = selectedIds.has(item.id_UN_table?.toString());
        const itemId = item.id_UN_table?.toString();
        const isFavorite = localFavorites.has(itemId);
        
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
              <div className="flex justify-between items-start relative z-10">
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
                      handleToggleFavorite(item);
                    }}
                    className="h-8 w-8 p-0 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 relative z-20"
                    type="button"
                  >
                    <Star 
                      className={`w-4 h-4 ${
                        isFavorite 
                          ? 'text-yellow-500 fill-yellow-500' 
                          : 'text-gray-400 hover:text-yellow-500'
                      }`} 
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                    className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20 relative z-20"
                    type="button"
                  >
                    <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 relative z-20"
                    type="button"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </Button>
                </div>
              </div>

              {/* Basic Info Grid - Only show fields that have content */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {item.area_terapeutica && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded border-l-2 border-blue-400">
                    <div className="text-blue-600 dark:text-blue-400 font-medium mb-1">Área Terapéutica</div>
                    <div className="text-gray-900 dark:text-gray-100 truncate">{item.area_terapeutica}</div>
                  </div>
                )}
                {item.farmaco && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded border-l-2 border-purple-400">
                    <div className="text-purple-600 dark:text-purple-400 font-medium mb-1">Fármaco</div>
                    <div className="text-gray-900 dark:text-gray-100 truncate">{item.farmaco}</div>
                  </div>
                )}
                {item.horizonte_temporal && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded border-l-2 border-green-400">
                    <div className="text-green-600 dark:text-green-400 font-medium mb-1">Horizonte</div>
                    <div className="text-gray-900 dark:text-gray-100 truncate">{item.horizonte_temporal}</div>
                  </div>
                )}
                {item.lab && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded border-l-2 border-orange-400">
                    <div className="text-orange-600 dark:text-orange-400 font-medium mb-1">Laboratorio</div>
                    <div className="text-gray-900 dark:text-gray-100 truncate">{item.lab}</div>
                  </div>
                )}
              </div>

              {/* Molécula Section - Only show if exists */}
              {item.molecula && item.molecula.trim() !== '' && (
                <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg border border-pink-200 dark:border-pink-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Atom className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                    <span className="text-sm font-semibold text-pink-700 dark:text-pink-300">Molécula</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                    {item.molecula}
                  </p>
                </div>
              )}

              {/* Dynamic sections - Only show sections that have content */}
              <div className="space-y-3">
                {/* Unmet Need - Always show since it's core content */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unmet Need</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {item.unmet_need || 'Sin descripción disponible'}
                  </p>
                </div>

                {/* Racional - Only show if exists */}
                {item.racional && item.racional.trim() !== '' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Racional</span>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      {item.racional}
                    </p>
                  </div>
                )}

                {/* Oportunidad Estratégica - Only show if exists */}
                {item.oportunidad_estrategica && item.oportunidad_estrategica.trim() !== '' && (
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

                {/* Conclusión - Only show if exists */}
                {item.conclusion && item.conclusion.trim() !== '' && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Conclusión</span>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      {item.conclusion}
                    </p>
                  </div>
                )}

                {/* Preguntas de ayuda - Only show if exists and format questions properly */}
                {item.preguntas && item.preguntas.trim() !== '' && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Preguntas de ayuda</span>
                    </div>
                    <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed space-y-3">
                      {formatQuestions(item.preguntas).map((question, qIndex) => (
                        <div key={qIndex} className="border-l-2 border-indigo-200 dark:border-indigo-700 pl-3">
                          {question}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
