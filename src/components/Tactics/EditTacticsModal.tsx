
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface EditTacticsModalProps {
  tactic: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditTacticsModal: React.FC<EditTacticsModalProps> = ({
  tactic,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    id_unmetNeed: '',
    laboratorio: '',
    area_terapeutica: '',
    farmaco: '',
    molecula: '',
    unmet_need: '',
    formato: '',
    URL_docs: '',
    URL_ppt: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (tactic) {
      setFormData({
        id_unmetNeed: tactic.id_unmetNeed || '',
        laboratorio: tactic.laboratorio || '',
        area_terapeutica: tactic.area_terapeutica || '',
        farmaco: tactic.farmaco || '',
        molecula: tactic.molecula || '',
        unmet_need: tactic.unmet_need || '',
        formato: tactic.formato || '',
        URL_docs: tactic.URL_docs || '',
        URL_ppt: tactic.URL_ppt || ''
      });
    }
  }, [tactic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tactic?.id) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('PharmaTactics_table')
        .update(formData)
        .eq('id', tactic.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Tactic actualizada",
        description: "Los cambios se han guardado correctamente.",
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar la tactic.",
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

  const formatOptions = ['Programa', 'Webinar', 'Podcast', 'Documento'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Tactic</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="id_unmetNeed">ID Unmet Need</Label>
              <Input
                id="id_unmetNeed"
                value={formData.id_unmetNeed}
                onChange={(e) => handleChange('id_unmetNeed', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="laboratorio">Laboratorio</Label>
              <Input
                id="laboratorio"
                value={formData.laboratorio}
                onChange={(e) => handleChange('laboratorio', e.target.value)}
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
              <Label htmlFor="formato">Formato</Label>
              <Select value={formData.formato} onValueChange={(value) => handleChange('formato', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar formato" />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="URL_docs">URL Documentos</Label>
              <Input
                id="URL_docs"
                type="url"
                value={formData.URL_docs}
                onChange={(e) => handleChange('URL_docs', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="URL_ppt">URL Presentación</Label>
              <Input
                id="URL_ppt"
                type="url"
                value={formData.URL_ppt}
                onChange={(e) => handleChange('URL_ppt', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="unmet_need">Unmet Need</Label>
            <Textarea
              id="unmet_need"
              value={formData.unmet_need}
              onChange={(e) => handleChange('unmet_need', e.target.value)}
              rows={4}
              required
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
