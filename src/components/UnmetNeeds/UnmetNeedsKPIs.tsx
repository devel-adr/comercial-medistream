
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UnmetNeedsKPIsProps {
  data: any[];
}

export const UnmetNeedsKPIs: React.FC<UnmetNeedsKPIsProps> = ({ data }) => {
  const totalNeeds = data.length;
  const highImpactNeeds = data.filter(item => item.impacto?.toLowerCase().includes('alto')).length;
  const mediumImpactNeeds = data.filter(item => item.impacto?.toLowerCase().includes('medio')).length;
  const shortTermNeeds = data.filter(item => 
    item.horizonte_temporal?.toLowerCase().includes('corto') || 
    item.horizonte_temporal?.toLowerCase().includes('inmediato')
  ).length;
  const uniqueAreas = new Set(data.map(item => item.area_terapeutica).filter(Boolean)).size;

  const kpis = [
    {
      label: 'Total Unmet Needs',
      value: totalNeeds,
      gradient: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-400'
    },
    {
      label: 'Impacto Alto',
      value: highImpactNeeds,
      gradient: 'from-red-500 to-pink-600',
      textColor: 'text-red-400'
    },
    {
      label: 'Impacto Medio',
      value: mediumImpactNeeds,
      gradient: 'from-orange-500 to-yellow-500',
      textColor: 'text-orange-400'
    },
    {
      label: 'Corto Plazo',
      value: shortTermNeeds,
      gradient: 'from-green-600 to-emerald-600',
      textColor: 'text-green-400'
    },
    {
      label: 'Áreas Cubiertas',
      value: uniqueAreas,
      gradient: 'from-purple-600 to-indigo-600',
      textColor: 'text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <Card key={index} className="relative overflow-hidden border-0 shadow-lg">
          <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-90`}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
          <CardContent className="relative p-6 text-center">
            <div className="mb-3">
              <div className={`text-4xl font-bold ${kpi.textColor} mb-2`}>
                {kpi.value}
              </div>
              <div className="text-sm text-white/80 uppercase tracking-wider font-medium">
                {kpi.label}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
