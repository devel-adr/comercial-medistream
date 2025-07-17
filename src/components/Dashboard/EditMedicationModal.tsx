
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface EditMedicationModalProps {
  medication: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditMedicationModal: React.FC<EditMedicationModalProps> = ({
  medication,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    nombre_lab: '',
    area_terapeutica: '',
    sub_area_de_tratamiento: '',
    nombre_del_farmaco: '',
    nombre_de_la_molecula: '',
    mecanismo_de_accion: '',
    alteracion_genetica_dirigida: '',
    linea_de_tratamiento: '',
    estado_en_espana: '',
    fecha_de_aprobacion_espana: '',
    ensayos_clinicos_relevantes: '',
    fuente_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (medication && isOpen) {
      setFormData({
        nombre_lab: medication.nombre_lab || '',
        area_terapeutica: medication.area_terapeutica || '',
        sub_area_de_tratamiento: medication.sub_area_de_tratamiento || '',
        nombre_del_farmaco: medication.nombre_del_farmaco || '',
        nombre_de_la_molecula: medication.nombre_de_la_molecula || '',
        mecanismo_de_accion: medication.mecanismo_de_accion || '',
        alteracion_genetica_dirigida: medication.alteracion_genetica_dirigida || '',
        linea_de_tratamiento: medication.linea_de_tratamiento || '',
        estado_en_espana: medication.estado_en_espana || '',
        fecha_de_aprobacion_espana: medication.fecha_de_aprobacion_espana || '',
        ensayos_clinicos_relevantes: medication.ensayos_clinicos_relevantes || '',
        fuente_url: medication.fuente_url || ''
      });
    }
  }, [medication, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('DrugDealer_table')
        .update(formData)
        .eq('ID_NUM', medication.ID_NUM);

      if (error) {
        throw error;
      }

      toast({
        title: "Medicamento actualizado",
        description: "Los datos del medicamento han sido actualizados correctamente.",
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el medicamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Editar Medicamento
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombre_lab">Laboratorio</Label>
            <Input
              id="nombre_lab"
              value={formData.nombre_lab}
              onChange={(e) => handleInputChange('nombre_lab', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area_terapeutica">Área Terapéutica</Label>
            <Input
              id="area_terapeutica"
              value={formData.area_terapeutica}
              onChange={(e) => handleInputChange('area_terapeutica', e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="sub_area_de_tratamiento">Subárea de Tratamiento</Label>
            <Input
              id="sub_area_de_tratamiento"
              value={formData.sub_area_de_tratamiento}
              onChange={(e) => handleInputChange('sub_area_de_tratamiento', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre_del_farmaco">Fármaco</Label>
            <Input
              id="nombre_del_farmaco"
              value={formData.nombre_del_farmaco}
              onChange={(e) => handleInputChange('nombre_del_farmaco', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre_de_la_molecula">Molécula</Label>
            <Input
              id="nombre_de_la_molecula"
              value={formData.nombre_de_la_molecula}
              onChange={(e) => handleInputChange('nombre_de_la_molecula', e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="mecanismo_de_accion">Mecanismo de Acción</Label>
            <Textarea
              id="mecanismo_de_accion"
              value={formData.mecanismo_de_accion}
              onChange={(e) => handleInputChange('mecanismo_de_accion', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alteracion_genetica_dirigida">Alteración Genética Dirigida</Label>
            <Input
              id="alteracion_genetica_dirigida"
              value={formData.alteracion_genetica_dirigida}
              onChange={(e) => handleInputChange('alteracion_genetica_dirigida', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linea_de_tratamiento">Línea de Tratamiento</Label>
            <Input
              id="linea_de_tratamiento"
              value={formData.linea_de_tratamiento}
              onChange={(e) => handleInputChange('linea_de_tratamiento', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado_en_espana">Estado en España</Label>
            <Input
              id="estado_en_espana"
              value={formData.estado_en_espana}
              onChange={(e) => handleInputChange('estado_en_espana', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha_de_aprobacion_espana">Fecha de Aprobación</Label>
            <Input
              id="fecha_de_aprobacion_espana"
              value={formData.fecha_de_aprobacion_espana}
              onChange={(e) => handleInputChange('fecha_de_aprobacion_espana', e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="ensayos_clinicos_relevantes">Ensayos Clínicos Relevantes</Label>
            <Textarea
              id="ensayos_clinicos_relevantes"
              value={formData.ensayos_clinicos_relevantes}
              onChange={(e) => handleInputChange('ensayos_clinicos_relevantes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fuente_url">URL de Fuente</Label>
            <Input
              id="fuente_url"
              value={formData.fuente_url}
              onChange={(e) => handleInputChange('fuente_url', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
