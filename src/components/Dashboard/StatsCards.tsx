
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Building, CalendarDays, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  medications: any[];
  loading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ medications = [], loading }) => {
  const totalMedications = medications.length;
  
  const uniqueLabs = new Set(medications.map(med => med.nombre_lab).filter(Boolean)).size;
  
  const currentYear = new Date().getFullYear();
  const approvedThisYear = medications.filter(med => {
    if (!med.fecha_de_aprobacion_espana) return false;
    try {
      const year = new Date(med.fecha_de_aprobacion_espana).getFullYear();
      return year === currentYear;
    } catch {
      return false;
    }
  }).length;

  const uniqueTherapeuticAreas = new Set(medications.map(med => med.area_terapeutica).filter(Boolean)).size;

  const stats = [
    {
      title: 'Total Indicaciones',
      value: totalMedications,
      icon: FileText,
      color: 'bg-blue-500',
      description: 'Indicaciones registrados'
    },
    {
      title: 'Laboratorios',
      value: uniqueLabs,
      icon: Building,
      color: 'bg-purple-500',
      description: 'Laboratorios únicos'
    },
    {
      title: `Aprobados ${currentYear}`,
      value: approvedThisYear,
      icon: CalendarDays,
      color: 'bg-indigo-500',
      description: 'Aprobados este año'
    },
    {
      title: 'Áreas Terapéuticas',
      value: uniqueTherapeuticAreas,
      icon: TrendingUp,
      color: 'bg-teal-500',
      description: 'Áreas diferentes'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const percentage = totalMedications > 0 ? ((stat.value / totalMedications) * 100).toFixed(1) : '0';
        
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.title}
              </CardTitle>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mb-2">
                {stat.description}
              </p>
              
              {index > 1 && totalMedications > 0 && (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                    {percentage}%
                  </Badge>
                  <span className="text-xs text-gray-500">del total</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
