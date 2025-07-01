
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AnalysisBar: React.FC = () => {
  const [analysisText, setAnalysisText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!analysisText.trim()) {
      toast({
        title: "Error",
        description: "Por favor, introduce un texto para analizar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Iniciando análisis:", analysisText);

    try {
      const response = await fetch('https://develms.app.n8n.cloud/webhook/starter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: analysisText,
          timestamp: new Date().toISOString(),
          source: 'dashboard-farmaceutico'
        }),
      });

      if (response.ok) {
        toast({
          title: "Análisis completado",
          description: "El análisis se ha enviado correctamente al sistema",
        });
        setAnalysisText('');
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error en análisis:', error);
      toast({
        title: "Error en el análisis",
        description: "No se pudo completar el análisis. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Análisis de Laboratorio</h2>
            <p className="text-blue-100">
              Introduce información del laboratorio o medicamento para análisis automático
            </p>
          </div>
          
          <div className="flex space-x-4">
            <Input
              placeholder="Ej: Análisis de eficacia del medicamento X en ensayos fase III..."
              value={analysisText}
              onChange={(e) => setAnalysisText(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-blue-200"
              disabled={isLoading}
            />
            
            <Button
              onClick={handleAnalysis}
              disabled={isLoading}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Analizar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
