

import React, { useState } from 'react';
import { X, Monitor, Bug, Cog, ChevronRight, Sparkles, Eye, RotateCcw, Palette, ArrowDown, Settings, Filter, RefreshCw, Target, Bell, FileText, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type NewsCategory = 'ui' | 'bugs' | 'features';

interface NewsItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  image?: string;
}

const newsData: Record<NewsCategory, NewsItem[]> = {
  ui: [
    {
      title: "Nuevo Inicio de Sesión",
      description: "La interfaz del inicio de sesión se ha remodelado completamente para obtener un efecto más estético y agradable visualmente. Ahora presenta un diseño moderno con efectos visuales mejorados y una experiencia de usuario más intuitiva.",
      icon: Eye,
      image: "/lovable-uploads/60318bf9-5d7f-4cfa-b1d1-54e99175b45e.png"
    },
    {
      title: "Desplazamiento Veloz",
      description: "Se ha añadido en el apartado de Unmet Needs, en la esquina inferior derecha, un botón para desplazarse más hábilmente hacia abajo de la página, mejorando significativamente la navegación en listas largas.",
      icon: ArrowDown,
      image: "/lovable-uploads/87d3bff4-5500-4e7b-a4b6-5dfd46d470ce.png"
    },
    {
      title: "Cambio de Lugar del Tema Oscuro",
      description: "Se ha reubicado el icono del tema oscuro dentro de la configuración general (botón engranaje) para una mejor organización de la interfaz y acceso más intuitivo a las preferencias visuales.",
      icon: Palette,
      image: "/lovable-uploads/95f5f1dd-73bd-4a46-9792-87039ad9271e.png"
    }
  ],
  bugs: [
    {
      title: "Filtro del Apartado Tactics",
      description: "Se ha corregido el error crítico que no permitía seleccionar un filtro específico en la sección de Tactics, anteriormente limitado a seleccionar todos los elementos. Ahora el filtrado funciona correctamente.",
      icon: Filter
    },
    {
      title: "Problemas en el Funcionamiento",
      description: "Se han corregido los problemas que ocasionalmente en las automatizaciones no permitían continuar el proceso. El sistema ahora es más robusto y confiable en sus operaciones automatizadas.",
      icon: RefreshCw
    },
    {
      title: "Múltiples Unmet Needs a la Vez",
      description: "Ya vuelve a estar disponible la funcionalidad de poder seleccionar múltiples Unmet Needs simultáneamente, restaurando esta característica esencial para el flujo de trabajo eficiente.",
      icon: Target
    },
    {
      title: "Múltiples Tácticas a la Vez",
      description: "Está completamente disponible la funcionalidad de poder seleccionar múltiples tácticas simultáneamente, permitiendo operaciones en lote más eficientes y productivas.",
      icon: Target
    }
  ],
  features: [
    {
      title: "Nuevo Sistema de Notificaciones",
      description: "Se ha sustituido el sistema de notificaciones antiguo (avisos de datos nuevos) por un sistema avanzado donde puedes ver la progresión de las automatizaciones en mayor profundidad y detalle.",
      icon: Bell,
      image: "/lovable-uploads/104ce5d3-5692-4181-80cb-f919bc27f3d2.png"
    },
    {
      title: "Más Información Añadida",
      description: "Se ha desarrollado un sistema inteligente que resume la subárea de un fármaco, permitiendo posteriormente mostrar información más detallada en las cartas del apartado de Unmet Needs.",
      icon: FileText,
      image: "/lovable-uploads/b4b2d2d3-7932-4469-abcc-3ec100544e08.png"
    },
    {
      title: "Diferenciador entre IA & Humano",
      description: "Se han añadido símbolos distintivos que determinan claramente si un dato ha sido introducido manualmente por un usuario o generado automáticamente por la IA, mejorando la transparencia del sistema.",
      icon: Bot
    }
  ]
};

const categoryConfig = {
  ui: {
    title: "Mejoras en la UI",
    color: "bg-blue-500",
    icon: Monitor
  },
  bugs: {
    title: "Errores Corregidos", 
    color: "bg-red-600",
    icon: Bug
  },
  features: {
    title: "Nuevas Mecánicas",
    color: "bg-green-500", 
    icon: Cog
  }
};

export const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('ui');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[650px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
          `
        }}
      >
        {/* NEW Label - Rotated in top-right corner */}
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 text-sm font-bold transform rotate-12 shadow-lg">
            NEW
          </div>
        </div>

        {/* Header */}
        <div className="relative p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                MEDISTREAM Analytics
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                v0.3 • 02/09/2025
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100%-88px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50/50 dark:bg-gray-800/50 border-r border-gray-200/50 dark:border-gray-700/50 p-4 flex-shrink-0">
            <div className="space-y-2">
              {(Object.keys(categoryConfig) as NewsCategory[]).map((category) => {
                const config = categoryConfig[category];
                const IconComponent = config.icon;
                const isActive = activeCategory === category;
                
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-white dark:bg-gray-700 shadow-md border border-gray-200 dark:border-gray-600' 
                        : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className={`w-8 h-8 ${config.color} rounded-md flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {config.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {newsData[category].length} actualizaciones
                      </div>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 min-w-0 overflow-hidden">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {categoryConfig[activeCategory].title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Últimas mejoras y actualizaciones implementadas en el sistema
              </p>
            </div>

            <ScrollArea className="h-[470px] pr-4">
              <div className="space-y-6">
                {newsData[activeCategory].map((item, index) => {
                  const IconComponent = item.icon;
                  
                  return (
                    <Card key={index} className="border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50">
                      <CardContent className="p-5">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-base">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 break-words">
                              {item.description}
                            </p>
                            {item.image && (
                              <div className="mt-4">
                                <img 
                                  src={item.image} 
                                  alt={item.title}
                                  className="w-full max-w-md h-auto max-h-48 object-contain rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

