
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UnmetNeedsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  unmetNeed: any;
}

export const UnmetNeedsDetailModal: React.FC<UnmetNeedsDetailModalProps> = ({
  isOpen,
  onClose,
  unmetNeed
}) => {
  if (!unmetNeed) return null;

  const getImpactColor = (impacto: string) => {
    if (!impacto) return 'bg-gray-100 text-gray-800';
    const impactoLower = impacto.toLowerCase();
    if (impactoLower.includes('alto')) return 'bg-red-100 text-red-800';
    if (impactoLower.includes('medio')) return 'bg-yellow-100 text-yellow-800';
    if (impactoLower.includes('bajo')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-2xl">
            <span>Unmet Need #{unmetNeed.id_UN_table}</span>
            <Badge className={`${getImpactColor(unmetNeed.impacto)} text-sm px-3 py-1`}>
              {unmetNeed.impacto || 'Sin clasificar'}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Descripción Principal */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
                Descripción del Unmet Need
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {unmetNeed.unmet_need || 'Sin descripción disponible'}
              </p>
            </div>

            {/* Información General */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">
                  Información General
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Laboratorio
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {unmetNeed.lab || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Área Terapéutica
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {unmetNeed.area_terapeutica || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fármaco
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {unmetNeed.farmaco || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Molécula
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {unmetNeed.molecula || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">
                  Clasificación
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Impacto
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {unmetNeed.impacto || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Horizonte Temporal
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {unmetNeed.horizonte_temporal || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Racional */}
            {unmetNeed.racional && (
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
                  Racional
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {unmetNeed.racional}
                </p>
              </div>
            )}

            {/* Oportunidad Estratégica */}
            {unmetNeed.oportunidad_estrategica && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">
                  Oportunidad Estratégica
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {unmetNeed.oportunidad_estrategica}
                </p>
              </div>
            )}

            {/* Conclusión */}
            {unmetNeed.conclusion && (
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-3">
                  Conclusión
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {unmetNeed.conclusion}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
