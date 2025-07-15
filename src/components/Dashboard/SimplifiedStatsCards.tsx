
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Building2 } from 'lucide-react';

interface SimplifiedStatsCardsProps {
  medications: any[];
  loading: boolean;
}

export const SimplifiedStatsCards: React.FC<SimplifiedStatsCardsProps> = ({ 
  medications, 
  loading 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
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

  const totalMedicamentos = medications.length;
  const uniqueLabs = new Set(medications.map(med => med.nombre_lab).filter(Boolean)).size;

  const stats = [
    {
      title: 'Total Medicamentos',
      value: totalMedicamentos,
      icon: Package,
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      title: 'Laboratorios',
      value: uniqueLabs,
      icon: Building2,
      gradient: 'from-green-600 to-emerald-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden border-0 shadow-lg">
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-90`}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
          <CardContent className="relative p-6 text-center">
            <div className="mb-3">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-white" />
              <div className="text-4xl font-bold text-white mb-2">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-white/80 uppercase tracking-wider font-medium">
                {stat.title}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
