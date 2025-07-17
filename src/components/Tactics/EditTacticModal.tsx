
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface EditTacticModalProps {
  tactic: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditTacticModal: React.FC<EditTacticModalProps> = ({
  tactic,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    unmet_need: '',
    laboratorio: '',
    area_terapeutica: '',
    farmaco: '',
    molecula: '',
    formato: '',
    URL_docs: '',
    URL_ppt: '',
    id_unmetNeed: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatoOptions = ['Programa', 'Webinar', 'Podcast', 'Documento'];

  useEffect(() => {
    if (tactic && isOpen) {
      setFormData({
        unmet_need: tactic.unmet_need || '',
        laboratorio: tactic.laboratorio || '',
        area_terapeutica: tactic.area_terapeutica || '',
        farmaco: tactic.farmaco || '',
        molecula: tactic.molecula || '',
        formato: tactic.formato || '',
        URL_docs: tactic.URL_docs || '',
        URL_ppt: tactic.URL_ppt || '',
        id_unmetNeed: tactic.id_unmetNeed || ''
      });
    }
  }, [tactic, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await (supabase as any)
        .from('PharmaTactics_table')
        .update(formData)
        .eq('id', tactic.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Tactic actualizada",
        description: "Los datos de la Tactic han sido actualizados correctamente.",
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar la Tactic.",
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
            Editar Tactic
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="unmet_need">Unmet Need</Label>
            <Textarea
              id="unmet_need"
              value={formData.unmet_need}
              onChange={(e) => handleInputChange('unmet_need', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="laboratorio">Laboratorio</Label>
              <Input
                id="laboratorio"
                value={formData.laboratorio}
                onChange={(e) => handleInputChange('laboratorio', e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="farmaco">Fármaco</Label>
              <Input
                id="farmaco"
                value={formData.farmaco}
                onChange={(e) => handleInputChange('farmaco', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="molecula">Molécula</Label>
              <Input
                id="molecula"
                value={formData.molecula}
                onChange={(e) => handleInputChange('molecula', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="formato">Formato</Label>
              <Select value={formData.formato} onValueChange={(value) => handleInputChange('formato', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar formato" />
                </SelectTrigger>
                <SelectContent>
                  {formatoOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_unmetNeed">ID Unmet Need</Label>
              <Input
                id="id_unmetNeed"
                value={formData.id_unmetNeed}
                onChange={(e) => handleInputChange('id_unmetNeed', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="URL_docs">URL Documentos</Label>
              <Input
                id="URL_docs"
                value={formData.URL_docs}
                onChange={(e) => handleInputChange('URL_docs', e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="URL_ppt">URL Presentación</Label>
              <Input
                id="URL_ppt"
                value={formData.URL_ppt}
                onChange={(e) => handleInputChange('URL_ppt', e.target.value)}
                placeholder="https://..."
              />
            </div>
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
