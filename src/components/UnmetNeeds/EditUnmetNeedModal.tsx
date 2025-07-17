
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface EditUnmetNeedModalProps {
  unmetNeed: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditUnmetNeedModal: React.FC<EditUnmetNeedModalProps> = ({
  unmetNeed,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    lab: '',
    area_terapeutica: '',
    farmaco: '',
    molecula: '',
    unmet_need: '',
    impacto: '',
    horizonte_temporal: '',
    racional: '',
    oportunidad_estrategica: '',
    conclusion: '',
    preguntas: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (unmetNeed) {
      setFormData({
        lab: unmetNeed.lab || '',
        area_terapeutica: unmetNeed.area_terapeutica || '',
        farmaco: unmetNeed.farmaco || '',
        molecula: unmetNeed.molecula || '',
        unmet_need: unmetNeed.unmet_need || '',
        impacto: unmetNeed.impacto || '',
        horizonte_temporal: unmetNeed.horizonte_temporal || '',
        racional: unmetNeed.racional || '',
        oportunidad_estrategica: unmetNeed.oportunidad_estrategica || '',
        conclusion: unmetNeed.conclusion || '',
        preguntas: unmetNeed.preguntas || ''
      });
    }
  }, [unmetNeed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unmetNeed?.id_UN_table) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('UnmetNeeds_table')
        .update(formData)
        .eq('id_UN_table', unmetNeed.id_UN_table);

      if (error) {
        throw error;
      }

      toast({
        title: "Unmet Need actualizada",
        description: "Los cambios se han guardado correctamente.",
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar la Unmet Need.",
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Unmet Need</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lab">Laboratorio</Label>
              <Input
                id="lab"
                value={formData.lab}
                onChange={(e) => handleChange('lab', e.target.value)}
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
              <Label htmlFor="farmaco">Fármaco</Label>
              <Input
                id="farmaco"
                value={formData.farmaco}
                onChange={(e) => handleChange('farmaco', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="molecula">Molécula</Label>
              <Input
                id="molecula"
                value={formData.molecula}
                onChange={(e) => handleChange('molecula', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="impacto">Impacto</Label>
              <Select value={formData.impacto} onValueChange={(value) => handleChange('impacto', value)}>
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
              <Select value={formData.horizonte_temporal} onValueChange={(value) => handleChange('horizonte_temporal', value)}>
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
              onChange={(e) => handleChange('unmet_need', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="racional">Racional</Label>
            <Textarea
              id="racional"
              value={formData.racional}
              onChange={(e) => handleChange('racional', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="oportunidad_estrategica">Oportunidad Estratégica</Label>
            <Textarea
              id="oportunidad_estrategica"
              value={formData.oportunidad_estrategica}
              onChange={(e) => handleChange('oportunidad_estrategica', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="conclusion">Conclusión</Label>
            <Textarea
              id="conclusion"
              value={formData.conclusion}
              onChange={(e) => handleChange('conclusion', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="preguntas">Preguntas de ayuda</Label>
            <Textarea
              id="preguntas"
              value={formData.preguntas}
              onChange={(e) => handleChange('preguntas', e.target.value)}
              rows={4}
              placeholder="Ingresa las preguntas numeradas (ej: 1.- Primera pregunta 2.- Segunda pregunta)"
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
