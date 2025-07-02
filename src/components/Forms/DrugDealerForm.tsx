
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DrugDealerFormData {
  nombre_del_farmaco: string;
  nombre_de_la_molecula: string;
  nombre_lab: string;
  area_terapeutica: string;
  sub_area_de_tratamiento: string;
  mecanismo_de_accion: string;
  alteracion_genetica_dirigida: string;
  linea_de_tratamiento: string;
  estado_en_espana: string;
  fecha_de_aprobacion_espana: string;
  ensayos_clinicos_relevantes: string;
  fuente_url: string;
}

interface DrugDealerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const DrugDealerForm: React.FC<DrugDealerFormProps> = ({ onSuccess, onCancel }) => {
  const { toast } = useToast();
  const form = useForm<DrugDealerFormData>({
    defaultValues: {
      nombre_del_farmaco: '',
      nombre_de_la_molecula: '',
      nombre_lab: '',
      area_terapeutica: '',
      sub_area_de_tratamiento: '',
      mecanismo_de_accion: '',
      alteracion_genetica_dirigida: '',
      linea_de_tratamiento: '',
      estado_en_espana: '',
      fecha_de_aprobacion_espana: '',
      ensayos_clinicos_relevantes: '',
      fuente_url: ''
    }
  });

  const onSubmit = async (data: DrugDealerFormData) => {
    try {
      console.log('Submitting DrugDealer data:', data);
      
      const { error } = await supabase
        .from('DrugDealer_table')
        .insert([data]);

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Medicamento agregado correctamente",
      });

      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error inserting DrugDealer data:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el medicamento",
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
            name="nombre_del_farmaco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Fármaco</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nombre_de_la_molecula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la Molécula</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nombre_lab"
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
            name="sub_area_de_tratamiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub-área de Tratamiento</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linea_de_tratamiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Línea de Tratamiento</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estado_en_espana"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado en España</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fecha_de_aprobacion_espana"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Aprobación España</FormLabel>
                <FormControl>
                  <Input {...field} type="date" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="mecanismo_de_accion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mecanismo de Acción</FormLabel>
              <FormControl>
                <Textarea {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alteracion_genetica_dirigida"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alteración Genética Dirigida</FormLabel>
              <FormControl>
                <Textarea {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ensayos_clinicos_relevantes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ensayos Clínicos Relevantes</FormLabel>
              <FormControl>
                <Textarea {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fuente_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la Fuente</FormLabel>
              <FormControl>
                <Input {...field} type="url" required />
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
            Agregar Medicamento
          </Button>
        </div>
      </form>
    </Form>
  );
};
