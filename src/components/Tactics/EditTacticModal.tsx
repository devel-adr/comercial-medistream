
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
import { Save, X } from 'lucide-react';

interface EditTacticModalProps {
  tactic: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditTacticModal: React.FC<EditTacticModalProps> = ({
  tactic,
  isOpen,
  onClose,
  onUpdate
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
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (tactic) {
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
  }, [tactic]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!tactic?.id) {
      toast({
        title: "Error",
        description: "No se pudo identificar la tactic para actualizar.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      // Since PharmaTactics_table doesn't exist in the schema, we'll simulate the update
      // In a real implementation, you would need to add this table to your Supabase schema
      console.log('Simulating tactic update:', formData);
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Tactic actualizada",
        description: "La tactic ha sido actualizada correctamente (simulado).",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating tactic:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar la tactic.",
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
            Editar Tactic #{tactic?.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="id_unmetNeed">ID Unmet Need</Label>
              <Input
                id="id_unmetNeed"
                value={formData.id_unmetNeed}
                onChange={(e) => handleInputChange('id_unmetNeed', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="formato">Formato</Label>
              <Select value={formData.formato} onValueChange={(value) => handleInputChange('formato', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Programa">Programa</SelectItem>
                  <SelectItem value="Webinar">Webinar</SelectItem>
                  <SelectItem value="Podcast">Podcast</SelectItem>
                  <SelectItem value="Documento">Documento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="laboratorio">Laboratorio</Label>
              <Input
                id="laboratorio"
                value={formData.laboratorio}
                onChange={(e) => handleInputChange('laboratorio', e.target.value)}
              />
            </div>
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
              <Label htmlFor="URL_docs">URL Documentos</Label>
              <Input
                id="URL_docs"
                value={formData.URL_docs}
                onChange={(e) => handleInputChange('URL_docs', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="URL_ppt">URL Presentación</Label>
              <Input
                id="URL_ppt"
                value={formData.URL_ppt}
                onChange={(e) => handleInputChange('URL_ppt', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="unmet_need">Unmet Need</Label>
            <Textarea
              id="unmet_need"
              value={formData.unmet_need}
              onChange={(e) => handleInputChange('unmet_need', e.target.value)}
              rows={4}
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
