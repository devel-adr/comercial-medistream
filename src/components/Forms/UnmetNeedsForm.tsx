
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UnmetNeedsFormData {
  id_UN_NUM: string;
  id_NUM_DD: number;
  area_terapeutica: string;
  farmaco: string;
  molecula: string;
  lab: string;
  unmet_need: string;
  racional: string;
  horizonte_temporal: string;
  impacto: string;
  conclusion: string;
  oportunidad_estrategica?: string;
}

interface UnmetNeedsFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const UnmetNeedsForm: React.FC<UnmetNeedsFormProps> = ({ onSuccess, onCancel }) => {
  const { toast } = useToast();
  const form = useForm<UnmetNeedsFormData>({
    defaultValues: {
      id_UN_NUM: '',
      id_NUM_DD: 0,
      area_terapeutica: '',
      farmaco: '',
      molecula: '',
      lab: '',
      unmet_need: '',
      racional: '',
      horizonte_temporal: '',
      impacto: '',
      conclusion: '',
      oportunidad_estrategica: ''
    }
  });

  const onSubmit = async (data: UnmetNeedsFormData) => {
    try {
      console.log('Submitting UnmetNeeds data:', data);
      
      const { error } = await supabase
        .from('UnmetNeeds_table')
        .insert([data]);

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Necesidad no cubierta agregada correctamente",
      });

      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error inserting UnmetNeeds data:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la necesidad no cubierta",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="id_UN_NUM"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID UN NUM</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="id_NUM_DD"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID NUM DD</FormLabel>
                <FormControl>
                  <Input {...field} type="number" required onChange={(e) => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="area_terapeutica"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área Terapéutica</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="farmaco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fármaco</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="molecula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Molécula</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lab"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Laboratorio</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="horizonte_temporal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horizonte Temporal</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="impacto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impacto</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="unmet_need"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Necesidad No Cubierta</FormLabel>
              <FormControl>
                <Textarea {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="racional"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Racional</FormLabel>
              <FormControl>
                <Textarea {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="conclusion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conclusión</FormLabel>
              <FormControl>
                <Textarea {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="oportunidad_estrategica"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Oportunidad Estratégica (Opcional)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Agregar Necesidad No Cubierta
          </Button>
        </div>
      </form>
    </Form>
  );
};
