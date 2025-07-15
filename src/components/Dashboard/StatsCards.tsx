
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Building2, Calendar, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  medications: any[];
  loading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ medications, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalMedicamentos = medications.length;
  const uniqueLaboratorios = new Set(medications.map(med => med.laboratorio).filter(Boolean)).size;
  const recentMedications = medications.filter(med => {
    if (!med.fecha_creacion) return false;
    const createdDate = new Date(med.fecha_creacion);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate >= thirtyDaysAgo;
  }).length;
  const uniqueAreas = new Set(medications.map(med => med.area_terapeutica).filter(Boolean)).size;

  const stats = [
    {
      title: "Total Medicamentos",
      value: totalMedicamentos.toLocaleString(),
      icon: Package,
      description: "Medicamentos registrados"
    },
    {
      title: "Laboratorios",
      value: uniqueLaboratorios.toLocaleString(),
      icon: Building2,
      description: "Laboratorios únicos"
    },
    {
      title: "Nuevos (30 días)",
      value: recentMedications.toLocaleString(),
      icon: Calendar,
      description: "Añadidos recientemente"
    },
    {
      title: "Áreas Terapéuticas",
      value: uniqueAreas.toLocaleString(),
      icon: TrendingUp,
      description: "Áreas diferentes"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
