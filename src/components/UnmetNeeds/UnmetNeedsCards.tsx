
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, FileText, Users, Target, Clock, Lightbulb, Star, Atom, Trash2, HelpCircle } from 'lucide-react';

interface UnmetNeedsCardsProps {
  data: any[];
  onSelectForTactics: (id: string, selected: boolean) => void;
  selectedIds: Set<string>;
  formatSelections: Record<string, string>;
  onFormatChange: (id: string, format: string) => void;
  formatOptions: string[];
  onToggleFavorite?: (unmetNeed: any) => void;
  onDelete?: (unmetNeed: any) => void;
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {data.map((item, index) => {
        const isSelected = selectedIds.has(item.id_UN_table?.toString());
        const itemId = item.id_UN_table?.toString();
        const isFavorite = localFavorites.has(itemId);
        
        // Create array of sections to display only those with content
        const sections = [];
        
        // Always add Unmet Need section
        sections.push({
          type: 'unmet_need',
          icon: FileText,
          title: 'Unmet Need',
          content: item.unmet_need || 'Sin descripción disponible',
          bgColor: 'bg-gray-50 dark:bg-gray-800/50',
          iconColor: 'text-gray-600 dark:text-gray-400',
          titleColor: 'text-gray-700 dark:text-gray-300'
        });

        // Conditionally add other sections
        if (item.molecula && item.molecula.trim() !== '') {
          sections.push({
            type: 'molecula',
            icon: Atom,
            title: 'Molécula',
            content: item.molecula,
            bgColor: 'bg-pink-50 dark:bg-pink-900/20',
            iconColor: 'text-pink-600 dark:text-pink-400',
            titleColor: 'text-pink-700 dark:text-pink-300'
          });
        }

        if (item.racional && item.racional.trim() !== '') {
          sections.push({
            type: 'racional',
            icon: Lightbulb,
            title: 'Racional',
            content: item.racional,
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            iconColor: 'text-blue-600 dark:text-blue-400',
            titleColor: 'text-blue-700 dark:text-blue-300'
          });
        }

        if (item.oportunidad_estrategica && item.oportunidad_estrategica.trim() !== '') {
          sections.push({
            type: 'oportunidad',
            icon: Target,
            title: 'Oportunidad Estratégica',
            content: item.oportunidad_estrategica,
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            iconColor: 'text-green-600 dark:text-green-400',
            titleColor: 'text-green-700 dark:text-green-300'
          });
        }

        if (item.conclusion && item.conclusion.trim() !== '') {
          sections.push({
            type: 'conclusion',
            icon: Users,
            title: 'Conclusión',
            content: item.conclusion,
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            iconColor: 'text-purple-600 dark:text-purple-400',
            titleColor: 'text-purple-700 dark:text-purple-300'
          });
        }

        if (item.preguntas && item.preguntas.trim() !== '') {
          sections.push({
            type: 'preguntas',
            icon: HelpCircle,
            title: 'Preguntas de ayuda',
            content: item.preguntas,
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
            titleColor: 'text-indigo-700 dark:text-indigo-300'
          });
        }
        
        return (
          <Card 
            key={item.id_UN_table || index}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${getHorizonteColor(item.horizonte_temporal)} ${
              isSelected ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : ''
            }`}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-full"></div>
            
            <CardContent className="p-4 space-y-3">
              {/* Header - More compact */}
              <div className="flex justify-between items-start relative z-10">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  #{item.id_UN_table || index + 1}
                </div>
                <div className="flex items-center gap-1">
                  <Badge className={`${getImpactColor(item.impacto)} px-2 py-0.5 text-xs font-semibold uppercase tracking-wider`}>
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
                    className="h-7 w-7 p-0 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 relative z-20"
                    type="button"
                  >
                    <Star 
                      className={`w-3.5 h-3.5 ${
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
                      handleDelete(item);
                    }}
                    className="h-7 w-7 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 relative z-20"
                    type="button"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  </Button>
                </div>
              </div>

              {/* Basic Info Grid - More compact and only show fields that have content */}
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {item.area_terapeutica && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded border-l-2 border-blue-400">
                    <div className="text-blue-600 dark:text-blue-400 font-medium mb-0.5 text-xs">Área Terapéutica</div>
                    <div className="text-gray-900 dark:text-gray-100 truncate text-xs">{item.area_terapeutica}</div>
                  </div>
                )}
                {item.farmaco && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-1.5 rounded border-l-2 border-purple-400">
                    <div className="text-purple-600 dark:text-purple-400 font-medium mb-0.5 text-xs">Fármaco</div>
                    <div className="text-gray-900 dark:text-gray-100 truncate text-xs">{item.farmaco}</div>
                  </div>
                )}
                {item.horizonte_temporal && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-1.5 rounded border-l-2 border-green-400">
                    <div className="text-green-600 dark:text-green-400 font-medium mb-0.5 text-xs">Horizonte</div>
                    <div className="text-gray-900 dark:text-gray-100 truncate text-xs">{item.horizonte_temporal}</div>
                  </div>
                )}
                {item.lab && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded border-l-2 border-orange-400">
                    <div className="text-orange-600 dark:text-orange-400 font-medium mb-0.5 text-xs">Laboratorio</div>
                    <div className="text-gray-900 dark:text-gray-100 truncate text-xs">{item.lab}</div>
                  </div>
                )}
              </div>

              {/* Dynamic sections with consistent spacing */}
              <div className="space-y-2">
                {sections.map((section, sectionIndex) => (
                  <div key={section.type} className={`${section.bgColor} p-2.5 rounded-lg`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <section.icon className={`w-3.5 h-3.5 ${section.iconColor}`} />
                      <span className={`text-xs font-semibold ${section.titleColor}`}>{section.title}</span>
                    </div>
                    {section.type === 'preguntas' ? (
                      <div className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed space-y-2">
                        {formatQuestions(section.content).map((question, qIndex) => (
                          <div key={qIndex} className="border-l-2 border-indigo-200 dark:border-indigo-700 pl-2 text-xs">
                            {question}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                        {section.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Format Selection and Action Buttons - More compact */}
              <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <Select
                    value={formatSelections[item.id_UN_table?.toString()] || 'none'}
                    onValueChange={(value) => 
                      onFormatChange(item.id_UN_table?.toString(), value === 'none' ? '' : value)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
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
                  className="text-xs uppercase tracking-wider font-medium h-8"
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
