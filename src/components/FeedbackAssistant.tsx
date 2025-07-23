
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const FeedbackAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sector: '',
    mejora_solicitada: '',
    persona_Solicitante: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send data to mejoras_comercial_table with correct field mappings
      const { error } = await supabase
        .from('mejoras_comercial_table')
        .insert([{
          sector: formData.sector,
          mejora_solicitada: formData.mejora_solicitada,
          persona_Solicitante: formData.persona_Solicitante
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "¡Solicitud enviada!",
        description: "Tu solicitud de mejora ha sido registrada correctamente.",
      });

      // Reset form
      setFormData({
        sector: '',
        mejora_solicitada: '',
        persona_Solicitante: ''
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu solicitud. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Solicitar Mejora
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Input
                id="sector"
                placeholder="Ej: Buscador drug dealer"
                value={formData.sector}
                onChange={(e) => handleInputChange('sector', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mejora">Mejora</Label>
              <Textarea
                id="mejora"
                placeholder="Ej: Personalizar temas"
                value={formData.mejora_solicitada}
                onChange={(e) => handleInputChange('mejora_solicitada', e.target.value)}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="persona">Persona Solicitante</Label>
              <Input
                id="persona"
                placeholder="Ej: Adrià"
                value={formData.persona_Solicitante}
                onChange={(e) => handleInputChange('persona_Solicitante', e.target.value)}
                required
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  'Enviando...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
