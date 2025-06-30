
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UnmetNeedsTimelineProps {
  data: any[];
}

export const UnmetNeedsTimeline: React.FC<UnmetNeedsTimelineProps> = ({ data }) => {
  const groupedByHorizonte = data.reduce((acc, item) => {
    const horizonte = item.horizonte_temporal || 'Sin clasificar';
    if (!acc[horizonte]) {
      acc[horizonte] = [];
    }
    acc[horizonte].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const timelineOrder = ['Corto Plazo', 'Medio Plazo', 'Largo Plazo', 'Sin clasificar'];
  const sortedGroups = Object.keys(groupedByHorizonte).sort((a, b) => {
    const indexA = timelineOrder.findIndex(order => a.toLowerCase().includes(order.toLowerCase()));
    const indexB = timelineOrder.findIndex(order => b.toLowerCase().includes(order.toLowerCase()));
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  const getTimelineColor = (horizonte: string) => {
    const horizonteLower = horizonte.toLowerCase();
    if (horizonteLower.includes('corto') || horizonteLower.includes('inmediato')) {
      return {
        dot: 'bg-green-500',
        line: 'border-green-300',
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-700 dark:text-green-300'
      };
    }
    if (horizonteLower.includes('medio')) {
      return {
        dot: 'bg-yellow-500',
        line: 'border-yellow-300',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-700 dark:text-yellow-300'
      };
    }
    if (horizonteLower.includes('largo')) {
      return {
        dot: 'bg-red-500',
        line: 'border-red-300',
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-700 dark:text-red-300'
      };
    }
    return {
      dot: 'bg-gray-500',
      line: 'border-gray-300',
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      border: 'border-gray-200 dark:border-gray-800',
      text: 'text-gray-700 dark:text-gray-300'
    };
  };

  const getImpactColor = (impacto: string) => {
    if (!impacto) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    const impactoLower = impacto.toLowerCase();
    if (impactoLower.includes('alto')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (impactoLower.includes('medio')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    if (impactoLower.includes('bajo')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">
        Timeline de Unmet Needs por Horizonte Temporal
      </h3>
      
      <div className="relative">
        {sortedGroups.map((horizonte, groupIndex) => {
          const items = groupedByHorizonte[horizonte];
          const colors = getTimelineColor(horizonte);
          const isLast = groupIndex === sortedGroups.length - 1;
          
          return (
            <div key={horizonte} className="relative">
              {!isLast && (
                <div className={`absolute left-6 top-20 w-0.5 h-full ${colors.line} border-l-2 border-dashed`}></div>
              )}
              
              <div className="flex items-start space-x-6 pb-8">
                <div className={`relative z-10 w-12 h-12 ${colors.dot} rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800`}>
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                
                <div className="flex-1">
                  <Card className={`${colors.bg} ${colors.border} border-2`}>
                    <CardHeader className="pb-3">
                      <CardTitle className={`text-xl font-bold ${colors.text} flex items-center justify-between`}>
                        {horizonte}
                        <Badge variant="outline" className="ml-2">
                          {items.length} item{items.length !== 1 ? 's' : ''}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {items.map((item, itemIndex) => (
                        <div key={item.id_UN_table || itemIndex} className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <div className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                              Unmet Need #{item.id_UN_table || itemIndex + 1}
                            </div>
                            <Badge className={getImpactColor(item.impacto)}>
                              {item.impacto || 'Sin clasificar'}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            {item.unmet_need || 'Sin descripción disponible'}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 font-medium">Área:</span>
                              <span className="ml-1 text-gray-900 dark:text-gray-100">{item.area_terapeutica || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 font-medium">Fármaco:</span>
                              <span className="ml-1 text-gray-900 dark:text-gray-100">{item.farmaco || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 font-medium">Lab:</span>
                              <span className="ml-1 text-gray-900 dark:text-gray-100">{item.lab || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
