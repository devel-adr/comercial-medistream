
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'lucide-react';

interface MedicationDetailModalProps {
  medication: any;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicationDetailModal: React.FC<MedicationDetailModalProps> = ({
  medication,
  isOpen,
  onClose
}) => {
  if (!medication) return null;

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('aprobado')) return 'bg-green-100 text-green-800';
    if (statusLower.includes('ensayo')) return 'bg-blue-100 text-blue-800';
    if (statusLower.includes('rechazado')) return 'bg-red-100 text-red-800';
    if (statusLower.includes('pendiente')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Detalles del Medicamento
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Información Principal */}
            <Card>
              <CardHeader>
                <CardTitle>Información Principal</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Laboratorio</label>
                  <p className="text-sm mt-1">{medication.nombre_lab || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Área Terapéutica</label>
                  <p className="text-sm mt-1">{medication.area_terapeutica || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre del Fármaco</label>
                  <p className="text-sm mt-1 font-medium">{medication.nombre_del_farmaco || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Molécula</label>
                  <p className="text-sm mt-1">{medication.nombre_de_la_molecula || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Información Técnica */}
            <Card>
              <CardHeader>
                <CardTitle>Información Técnica</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Mecanismo de Acción</label>
                  <p className="text-sm mt-1">{medication.mecanismo_de_accion || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Sub Área de Tratamiento</label>
                  <p className="text-sm mt-1">{medication.sub_area_de_tratamiento || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Alteración Genética Dirigida</label>
                  <p className="text-sm mt-1">{medication.alteracion_genetica_dirigida || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Línea de Tratamiento</label>
                  <p className="text-sm mt-1">{medication.linea_de_tratamiento || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Estado y Aprobación */}
            <Card>
              <CardHeader>
                <CardTitle>Estado y Aprobación</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado en España</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(medication.estado_en_espana)}>
                      {medication.estado_en_espana || 'Sin estado'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha de Aprobación</label>
                  <p className="text-sm mt-1">{medication.fecha_de_aprobacion_espana || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Ensayos Clínicos */}
            <Card>
              <CardHeader>
                <CardTitle>Ensayos Clínicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-gray-600">Ensayos Clínicos Relevantes</label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{medication.ensayos_clinicos_relevantes || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Fuente */}
            {medication.fuente_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Fuente</CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href={medication.fuente_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Link className="w-4 h-4" />
                    <span>Ver fuente original</span>
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
