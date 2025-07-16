
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

interface CustomFieldsFormProps {
  selectedRows: Set<string>;
  formatSelections: Record<string, string>;
  customFields: Record<string, {
    capitulos: string;
    modulos: string;
    subtemas: string;
    numeroExperto: string;
    formato: string;
  }>;
  onCustomFieldsChange: (id: string, fields: {
    capitulos: string;
    modulos: string;
    subtemas: string;
    numeroExperto: string;
    formato: string;
  }) => void;
  unmetNeeds: any[];
}

export const CustomFieldsForm: React.FC<CustomFieldsFormProps> = ({
  selectedRows,
  formatSelections,
  customFields,
  onCustomFieldsChange,
  unmetNeeds
}) => {
  const customFormatItems = Array.from(selectedRows).filter(id => 
    formatSelections[id] === 'Personalizado (DOCS only)'
  );

  if (customFormatItems.length === 0) {
    return null;
  }

  const handleFieldChange = (itemId: string, fieldName: string, value: string) => {
    const currentFields = customFields[itemId] || {
      capitulos: '',
      modulos: '',
      subtemas: '',
      numeroExperto: '',
      formato: ''
    };

    onCustomFieldsChange(itemId, {
      ...currentFields,
      [fieldName]: value
    });
  };

  return (
    <Card className="shadow-lg border-orange-200 dark:border-orange-800">
      <CardHeader className="bg-orange-50 dark:bg-orange-900/20">
        <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
          <Settings className="w-5 h-5" />
          Campos Personalizados - Formato DOCS
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {customFormatItems.map((itemId) => {
            const item = unmetNeeds.find(n => n.id_UN_table?.toString() === itemId);
            const fields = customFields[itemId] || {
              capitulos: '',
              modulos: '',
              subtemas: '',
              numeroExperto: '',
              formato: ''
            };

            return (
              <div key={itemId} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <h4 className="font-semibold text-lg mb-4 text-blue-700 dark:text-blue-300">
                  Unmet Need #{item?.id_UN_table} - {item?.area_terapeutica}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`capitulos-${itemId}`} className="text-sm font-medium">
                      Capítulos <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`capitulos-${itemId}`}
                      type="number"
                      placeholder="Ej: 5"
                      value={fields.capitulos}
                      onChange={(e) => handleFieldChange(itemId, 'capitulos', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`modulos-${itemId}`} className="text-sm font-medium">
                      Módulos <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`modulos-${itemId}`}
                      type="number"
                      placeholder="Ej: 3"
                      value={fields.modulos}
                      onChange={(e) => handleFieldChange(itemId, 'modulos', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`subtemas-${itemId}`} className="text-sm font-medium">
                      Subtemas <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`subtemas-${itemId}`}
                      type="number"
                      placeholder="Ej: 10"
                      value={fields.subtemas}
                      onChange={(e) => handleFieldChange(itemId, 'subtemas', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`numeroExperto-${itemId}`} className="text-sm font-medium">
                      Número de Experto <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`numeroExperto-${itemId}`}
                      type="number"
                      placeholder="Ej: 2"
                      value={fields.numeroExperto}
                      onChange={(e) => handleFieldChange(itemId, 'numeroExperto', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`formato-${itemId}`} className="text-sm font-medium">
                      Formato <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`formato-${itemId}`}
                      type="text"
                      placeholder="Ej: PDF interactivo, presentación, etc."
                      value={fields.formato}
                      onChange={(e) => handleFieldChange(itemId, 'formato', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Nota:</strong> Estos campos son obligatorios para el formato "Personalizado (DOCS only)" 
            y se enviarán junto con la información de la Unmet Need al webhook.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
