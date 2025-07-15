
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus } from 'lucide-react';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre_del_farmaco: '',
    nombre_de_la_molecula: '',
    nombre_lab: '',
    area_terapeutica: '',
    sub_area_de_tratamiento: '',
    mecanismo_de_accion: '',
    linea_de_tratamiento: '',
    alteracion_genetica_dirigida: '',
    estado_en_espana: '',
    fecha_de_aprobacion_espana: '',
    ensayos_clinicos_relevantes: '',
    fuente_url: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('DrugDealer_table')
        .insert([formData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Medicamento añadido correctamente",
      });

      // Reset form
      setFormData({
        nombre_del_farmaco: '',
        nombre_de_la_molecula: '',
        nombre_lab: '',
        area_terapeutica: '',
        sub_area_de_tratamiento: '',
        mecanismo_de_accion: '',
        linea_de_tratamiento: '',
        alteracion_genetica_dirigida: '',
        estado_en_espana: '',
        fecha_de_aprobacion_espana: '',
        ensayos_clinicos_relevantes: '',
        fuente_url: ''
      });

      onSuccess(); // Trigger data refresh
      onClose();
    } catch (error: any) {
      console.error('Error adding medication:', error);
      toast({
        title: "Error",
        description: error.message || "Error al añadir el medicamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Añadir Nuevo Medicamento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre_del_farmaco">Nombre del Fármaco *</Label>
              <Input
                id="nombre_del_farmaco"
                value={formData.nombre_del_farmaco}
                onChange={(e) => handleInputChange('nombre_del_farmaco', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="nombre_de_la_molecula">Nombre de la Molécula *</Label>
              <Input
                id="nombre_de_la_molecula"
                value={formData.nombre_de_la_molecula}
                onChange={(e) => handleInputChange('nombre_de_la_molecula', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="nombre_lab">Laboratorio *</Label>
              <Input
                id="nombre_lab"
                value={formData.nombre_lab}
                onChange={(e) => handleInputChange('nombre_lab', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="area_terapeutica">Área Terapéutica *</Label>
              <Input
                id="area_terapeutica"
                value={formData.area_terapeutica}
                onChange={(e) => handleInputChange('area_terapeutica', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="sub_area_de_tratamiento">Sub-área de Tratamiento *</Label>
              <Input
                id="sub_area_de_tratamiento"
                value={formData.sub_area_de_tratamiento}
                onChange={(e) => handleInputChange('sub_area_de_tratamiento', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="linea_de_tratamiento">Línea de Tratamiento *</Label>
              <Input
                id="linea_de_tratamiento"
                value={formData.linea_de_tratamiento}
                onChange={(e) => handleInputChange('linea_de_tratamiento', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="estado_en_espana">Estado en España *</Label>
              <Select
                value={formData.estado_en_espana}
                onValueChange={(value) => handleInputChange('estado_en_espana', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aprobado">Aprobado</SelectItem>
                  <SelectItem value="En desarrollo">En desarrollo</SelectItem>
                  <SelectItem value="En revisión">En revisión</SelectItem>
                  <SelectItem value="No aprobado">No aprobado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fecha_de_aprobacion_espana">Fecha de Aprobación España</Label>
              <Input
                id="fecha_de_aprobacion_espana"
                type="date"
                value={formData.fecha_de_aprobacion_espana}
                onChange={(e) => handleInputChange('fecha_de_aprobacion_espana', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="mecanismo_de_accion">Mecanismo de Acción *</Label>
            <Textarea
              id="mecanismo_de_accion"
              value={formData.mecanismo_de_accion}
              onChange={(e) => handleInputChange('mecanismo_de_accion', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="alteracion_genetica_dirigida">Alteración Genética Dirigida *</Label>
            <Textarea
              id="alteracion_genetica_dirigida"
              value={formData.alteracion_genetica_dirigida}
              onChange={(e) => handleInputChange('alteracion_genetica_dirigida', e.target.value)}
              rows={2}
              required
            />
          </div>

          <div>
            <Label htmlFor="ensayos_clinicos_relevantes">Ensayos Clínicos Relevantes *</Label>
            <Textarea
              id="ensayos_clinicos_relevantes"
              value={formData.ensayos_clinicos_relevantes}
              onChange={(e) => handleInputChange('ensayos_clinicos_relevantes', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="fuente_url">Fuente URL *</Label>
            <Input
              id="fuente_url"
              type="url"
              value={formData.fuente_url}
              onChange={(e) => handleInputChange('fuente_url', e.target.value)}
              placeholder="https://..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Añadir Medicamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
