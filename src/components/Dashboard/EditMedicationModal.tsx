
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

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
    area: '',
    nombre_del_farmaco: '',
    nombre_de_la_molecula: '',
    mecanismo_de_accion: '',
    sub_area_de_tratamiento: '',
    alteracion_genetica_dirigida: '',
    linea_de_tratamiento: '',
    estado_en_espana: '',
    ensayos_clinicos_relevantes: '',
    fecha_de_aprobacion_espana: '',
    fuente_url: '',
    contexto: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (medication) {
      setFormData({
        nombre_lab: medication.nombre_lab || '',
        area_terapeutica: medication.area_terapeutica || '',
        area: medication.area || '',
        nombre_del_farmaco: medication.nombre_del_farmaco || '',
        nombre_de_la_molecula: medication.nombre_de_la_molecula || '',
        mecanismo_de_accion: medication.mecanismo_de_accion || '',
        sub_area_de_tratamiento: medication.sub_area_de_tratamiento || '',
        alteracion_genetica_dirigida: medication.alteracion_genetica_dirigida || '',
        linea_de_tratamiento: medication.linea_de_tratamiento || '',
        estado_en_espana: medication.estado_en_espana || '',
        ensayos_clinicos_relevantes: medication.ensayos_clinicos_relevantes || '',
        fecha_de_aprobacion_espana: medication.fecha_de_aprobacion_espana || '',
        fuente_url: medication.fuente_url || '',
        contexto: medication.contexto || ''
      });
    }
  }, [medication]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medication?.ID_NUM) return;

    setIsSubmitting(true);

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
        description: "Los cambios se han guardado correctamente.",
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
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Medicamento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre_lab">Laboratorio</Label>
              <Input
                id="nombre_lab"
                value={formData.nombre_lab}
                onChange={(e) => handleChange('nombre_lab', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="area_terapeutica">Área Terapéutica</Label>
              <Input
                id="area_terapeutica"
                value={formData.area_terapeutica}
                onChange={(e) => handleChange('area_terapeutica', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="area">Área</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => handleChange('area', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="nombre_del_farmaco">Fármaco</Label>
              <Input
                id="nombre_del_farmaco"
                value={formData.nombre_del_farmaco}
                onChange={(e) => handleChange('nombre_del_farmaco', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="nombre_de_la_molecula">Molécula</Label>
              <Input
                id="nombre_de_la_molecula"
                value={formData.nombre_de_la_molecula}
                onChange={(e) => handleChange('nombre_de_la_molecula', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="estado_en_espana">Estado en España</Label>
              <Input
                id="estado_en_espana"
                value={formData.estado_en_espana}
                onChange={(e) => handleChange('estado_en_espana', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fecha_de_aprobacion_espana">Fecha de Aprobación</Label>
              <Input
                id="fecha_de_aprobacion_espana"
                type="date"
                value={formData.fecha_de_aprobacion_espana}
                onChange={(e) => handleChange('fecha_de_aprobacion_espana', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="linea_de_tratamiento">Línea de Tratamiento</Label>
              <Input
                id="linea_de_tratamiento"
                value={formData.linea_de_tratamiento}
                onChange={(e) => handleChange('linea_de_tratamiento', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fuente_url">URL Fuente</Label>
              <Input
                id="fuente_url"
                type="url"
                value={formData.fuente_url}
                onChange={(e) => handleChange('fuente_url', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="sub_area_de_tratamiento">Subárea de Tratamiento</Label>
            <Textarea
              id="sub_area_de_tratamiento"
              value={formData.sub_area_de_tratamiento}
              onChange={(e) => handleChange('sub_area_de_tratamiento', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="mecanismo_de_accion">Mecanismo de Acción</Label>
            <Textarea
              id="mecanismo_de_accion"
              value={formData.mecanismo_de_accion}
              onChange={(e) => handleChange('mecanismo_de_accion', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="alteracion_genetica_dirigida">Alteración Genética Dirigida</Label>
            <Textarea
              id="alteracion_genetica_dirigida"
              value={formData.alteracion_genetica_dirigida}
              onChange={(e) => handleChange('alteracion_genetica_dirigida', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="ensayos_clinicos_relevantes">Ensayos Clínicos Relevantes</Label>
            <Textarea
              id="ensayos_clinicos_relevantes"
              value={formData.ensayos_clinicos_relevantes}
              onChange={(e) => handleChange('ensayos_clinicos_relevantes', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="contexto">Contexto</Label>
            <Textarea
              id="contexto"
              value={formData.contexto}
              onChange={(e) => handleChange('contexto', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
