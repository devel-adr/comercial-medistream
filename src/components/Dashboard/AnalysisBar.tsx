import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";

interface AnalysisBarProps {
  onSearch?: (searchTerm: string) => void;
}

export const AnalysisBar: React.FC<AnalysisBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Por favor introduce información para analizar.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      console.log('Sending analysis request to webhook:', searchTerm);

      const response = await fetch('https://develms.app.n8n.cloud/webhook-test/starter-desarrollo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: searchTerm,
          type: 'analysis_request'
        }),
      });

      if (response.ok) {
        toast({
          title: "Análisis iniciado",
          description: "Se ha enviado la información para análisis.",
        });
        
        // También llamar al callback local si existe
        if (onSearch) {
          onSearch(searchTerm);
        }
        
        // Limpiar el campo después del envío exitoso
        setSearchTerm('');
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error sending analysis request:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el análisis. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Análisis de Laboratorio</h2>
          <p className="text-blue-100 mb-4">
            Introduce el laboratorio para el análisis automático
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Ej: Novartis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
              disabled={isAnalyzing}
            />
          </div>
          <Button 
            type="submit"
            className="bg-white text-blue-600 hover:bg-blue-50"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Analizando...
              </>
            ) : (
              'Analizar'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
