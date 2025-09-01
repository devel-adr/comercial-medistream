
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

interface AddUnmetNeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddUnmetNeedModal: React.FC<AddUnmetNeedModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    unmet_need: '',
    lab: '',
    area_terapeutica: '',
    farmaco: '',
    molecula: '',
    impacto: '',
    horizonte_temporal: '',
    racional: '',
    conclusion: '',
    oportunidad_estrategica: '',
    id_NUM_DD: 0,
    id_UN_NUM: ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate unique ID for id_UN_NUM
      const uniqueId = `UN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const dataToInsert = {
        ...formData,
        id_UN_NUM: uniqueId,
        manually_added: true
      };

      const { error } = await supabase
        .from('UnmetNeeds_table')
        .insert([dataToInsert]);

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Unmet Need añadida correctamente",
      });

      // Reset form
      setFormData({
        unmet_need: '',
        lab: '',
        area_terapeutica: '',
        farmaco: '',
        molecula: '',
        impacto: '',
        horizonte_temporal: '',
        racional: '',
        conclusion: '',
        oportunidad_estrategica: '',
        id_NUM_DD: 0,
        id_UN_NUM: ''
      });

      onSuccess(); // Trigger data refresh
      onClose();
    } catch (error: any) {
      console.error('Error adding unmet need:', error);
      toast({
        title: "Error",
        description: error.message || "Error al añadir la Unmet Need",
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
            Añadir Nueva Unmet Need
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="unmet_need">Unmet Need *</Label>
            <Textarea
              id="unmet_need"
              value={formData.unmet_need}
              onChange={(e) => handleInputChange('unmet_need', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lab">Laboratorio *</Label>
              <Input
                id="lab"
                value={formData.lab}
                onChange={(e) => handleInputChange('lab', e.target.value)}
                required
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
              <Label htmlFor="farmaco">Fármaco *</Label>
              <Input
                id="farmaco"
                value={formData.farmaco}
                onChange={(e) => handleInputChange('farmaco', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="molecula">Molécula *</Label>
              <Input
                id="molecula"
                value={formData.molecula}
                onChange={(e) => handleInputChange('molecula', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="impacto">Impacto</Label>
              <Select
                value={formData.impacto}
                onValueChange={(value) => handleInputChange('impacto', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar impacto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alto">Alto</SelectItem>
                  <SelectItem value="Medio">Medio</SelectItem>
                  <SelectItem value="Bajo">Bajo</SelectItem>
                  <SelectItem value="Crítico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="horizonte_temporal">Horizonte Temporal</Label>
              <Select
                value={formData.horizonte_temporal}
                onValueChange={(value) => handleInputChange('horizonte_temporal', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar horizonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Corto plazo (1-2 años)">Corto plazo (1-2 años)</SelectItem>
                  <SelectItem value="Mediano plazo (3-5 años)">Mediano plazo (3-5 años)</SelectItem>
                  <SelectItem value="Largo plazo (5+ años)">Largo plazo (5+ años)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="id_NUM_DD">ID Número DrugDealer *</Label>
              <Input
                id="id_NUM_DD"
                type="number"
                value={formData.id_NUM_DD}
                onChange={(e) => handleInputChange('id_NUM_DD', parseInt(e.target.value) || 0)}
                placeholder="ID relacionado de DrugDealer"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="racional">Racional</Label>
            <Textarea
              id="racional"
              value={formData.racional}
              onChange={(e) => handleInputChange('racional', e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="conclusion">Conclusión</Label>
            <Textarea
              id="conclusion"
              value={formData.conclusion}
              onChange={(e) => handleInputChange('conclusion', e.target.value)}
              rows={4}
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

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Añadir Unmet Need
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
