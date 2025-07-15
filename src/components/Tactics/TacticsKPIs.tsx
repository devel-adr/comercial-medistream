
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileText, Building2, Activity } from 'lucide-react';

interface TacticsKPIsProps {
  data: any[];
  loading: boolean;
}

export const TacticsKPIs: React.FC<TacticsKPIsProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalTactics = data.length;
  const uniqueLabs = new Set(data.map(item => item.laboratorio)).size;
  const uniqueAreas = new Set(data.map(item => item.area_terapeutica)).size;
  const uniqueFormats = new Set(data.map(item => item.formato)).size;

  const kpis = [
    {
      title: 'Total Tactics',
      value: totalTactics,
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      title: 'Laboratorios',
      value: uniqueLabs,
      icon: Building2,
      color: 'text-green-600'
    },
    {
      title: 'Áreas Terapéuticas',
      value: uniqueAreas,
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'Formatos',
      value: uniqueFormats,
      icon: FileText,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {kpi.title}
            </CardTitle>
            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {kpi.value.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
