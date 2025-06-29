import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, FileText, CalendarDays, BarChart } from 'lucide-react';

interface StatsCardsProps {
  medications: any[];
  loading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ medications = [], loading }) => {
  const totalMedications = medications.length;
  const approvedThisYear = medications.filter(med => {
    if (!med.fecha_de_aprobacion_espana) return false;
    const year = new Date(med.fecha_de_aprobacion_espana).getFullYear();
    return year === new Date().getFullYear();
  }).length;
  
  const inTrials = medications.filter(med => 
    med.estado_en_espana && med.estado_en_espana.toLowerCase().includes('ensayo')
  ).length;
  
  const uniqueLabs = new Set(medications.map(med => med.nombre_lab)).size;

  const stats = [
    {
      title: 'Total Medicamentos',
      value: totalMedications,
      icon: FileText,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: 'Aprobados 2024',
      value: approvedThisYear,
      icon: CalendarDays,
      color: 'bg-green-500',
      trend: '+8%'
    },
    {
      title: 'En Ensayos',
      value: inTrials,
      icon: BarChart,
      color: 'bg-orange-500',
      trend: '+15%'
    },
    {
      title: 'Laboratorios',
      value: uniqueLabs,
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: '+3%'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.title}
              </CardTitle>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value.toLocaleString()}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="text-green-600 bg-green-100">
                  {stat.trend}
                </Badge>
                <span className="text-xs text-gray-500">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
