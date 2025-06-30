
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import { BarChart3, FileText, Mic, Video } from 'lucide-react';

const Tactics = () => {
  const [selectedUnmetNeeds, setSelectedUnmetNeeds] = useState<any[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('selectedUnmetNeeds');
    if (storedData) {
      setSelectedUnmetNeeds(JSON.parse(storedData));
    }
  }, []);

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'Programa':
        return <FileText className="w-4 h-4" />;
      case 'Webinar':
        return <Video className="w-4 h-4" />;
      case 'Podcast':
        return <Mic className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'Programa':
        return 'bg-blue-100 text-blue-800';
      case 'Webinar':
        return 'bg-green-100 text-green-800';
      case 'Podcast':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tactics
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Tácticas generadas basadas en Unmet Needs seleccionadas
            </p>
          </div>

          {selectedUnmetNeeds.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No hay tácticas disponibles</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Selecciona Unmet Needs en la sección anterior para generar tácticas.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Tácticas Generadas ({selectedUnmetNeeds.length})
                  </CardTitle>
                </CardHeader>
              </Card>

              {selectedUnmetNeeds.map((item, index) => (
                <Card key={index} className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                          {item.unmet_need}
                        </h3>
                        <div className="flex items-center space-x-4 mb-3">
                          <Badge className={getFormatColor(item.format)}>
                            <div className="flex items-center space-x-1">
                              {getFormatIcon(item.format)}
                              <span>{item.format}</span>
                            </div>
                          </Badge>
                          <Badge variant="outline">
                            {item.impacto}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Racional:</strong>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          {item.racional || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <strong>Horizonte Temporal:</strong>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          {item.horizonte_temporal || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <strong>Oportunidad Estratégica:</strong>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          {item.oportunidad_estrategica || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <strong>Conclusión:</strong>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          {item.conclusion || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Tactics;
