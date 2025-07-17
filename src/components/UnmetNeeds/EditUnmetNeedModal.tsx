
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface EditUnmetNeedModalProps {
  unmetNeed: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditUnmetNeedModal: React.FC<EditUnmetNeedModalProps> = ({
  unmetNeed,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    unmet_need: '',
    area_terapeutica: '',
    farmaco: '',
    molecula: '',
    lab: '',
    racional: '',
    oportunidad_estrategica: '',
    conclusion: '',
    preguntas: '',
    impacto: '',
    horizonte_temporal: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (unmetNeed) {
      setFormData({
        unmet_need: unmetNeed.unmet_need || '',
        area_terapeutica: unmetNeed.area_terapeutica || '',
        farmaco: unmetNeed.farmaco || '',
        molecula: unmetNeed.molecula || '',
        lab: unmetNeed.lab || '',
        racional: unmetNeed.racional || '',
        oportunidad_estrategica: unmetNeed.oportunidad_estrategica || '',
        conclusion: unmetNeed.conclusion || '',
        preguntas: unmetNeed.preguntas || '',
        impacto: unmetNeed.impacto || '',
        horizonte_temporal: unmetNeed.horizonte_temporal || ''
      });
    }
  }, [unmetNeed]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!unmetNeed?.id_UN_table) {
      toast({
        title: "Error",
        description: "No se pudo identificar el Unmet Need para actualizar.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('UnmetNeeds_table')
        .update(formData)
        .eq('id_UN_table', unmetNeed.id_UN_table);

      if (error) {
        throw error;
      }

      toast({
        title: "Unmet Need actualizado",
        description: "El Unmet Need ha sido actualizado correctamente.",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating unmet need:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el Unmet Need.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Editar Unmet Need #{unmetNeed?.id_UN_table}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="area_terapeutica">Área Terapéutica</Label>
              <Input
                id="area_terapeutica"
                value={formData.area_terapeutica}
                onChange={(e) => handleInputChange('area_terapeutica', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="farmaco">Fármaco</Label>
              <Input
                id="farmaco"
                value={formData.farmaco}
                onChange={(e) => handleInputChange('farmaco', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="molecula">Molécula</Label>
              <Input
                id="molecula"
                value={formData.molecula}
                onChange={(e) => handleInputChange('molecula', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lab">Laboratorio</Label>
              <Input
                id="lab"
                value={formData.lab}
                onChange={(e) => handleInputChange('lab', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="impacto">Impacto</Label>
              <Select value={formData.impacto} onValueChange={(value) => handleInputChange('impacto', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar impacto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alto">Alto</SelectItem>
                  <SelectItem value="Medio">Medio</SelectItem>
                  <SelectItem value="Bajo">Bajo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="horizonte_temporal">Horizonte Temporal</Label>
              <Select value={formData.horizonte_temporal} onValueChange={(value) => handleInputChange('horizonte_temporal', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar horizonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Corto plazo">Corto plazo</SelectItem>
                  <SelectItem value="Medio plazo">Medio plazo</SelectItem>
                  <SelectItem value="Largo plazo">Largo plazo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="unmet_need">Unmet Need</Label>
            <Textarea
              id="unmet_need"
              value={formData.unmet_need}
              onChange={(e) => handleInputChange('unmet_need', e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="racional">Racional</Label>
            <Textarea
              id="racional"
              value={formData.racional}
              onChange={(e) => handleInputChange('racional', e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="oportunidad_estrategica">Oportunidad Estratégica</Label>
            <Textarea
              id="oportunidad_estrategica"
              value={formData.oportunidad_estrategica}
              onChange={(e) => handleInputChange('oportunidad_estrategica', e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="conclusion">Conclusión</Label>
            <Textarea
              id="conclusion"
              value={formData.conclusion}
              onChange={(e) => handleInputChange('conclusion', e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="preguntas">Preguntas de Ayuda</Label>
            <Textarea
              id="preguntas"
              value={formData.preguntas}
              onChange={(e) => handleInputChange('preguntas', e.target.value)}
              rows={4}
              placeholder="Formato: 1.- Primera pregunta. 2.- Segunda pregunta..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Actualizando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
