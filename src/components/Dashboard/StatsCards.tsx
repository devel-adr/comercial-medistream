
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, FileText, CalendarDays, BarChart, Building, CheckCircle, Clock, AlertTriangle, Molecule } from 'lucide-react';

interface StatsCardsProps {
  medications: any[];
  loading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ medications = [], loading }) => {
  const totalMedications = medications.length;
  
  const approvedMeds = medications.filter(med => 
    med.estado_en_espana && med.estado_en_espana.toLowerCase().includes('aprobado')
  ).length;
  
  const inTrials = medications.filter(med => 
    med.estado_en_espana && med.estado_en_espana.toLowerCase().includes('ensayo')
  ).length;
  
  const pendingMeds = medications.filter(med => 
    med.estado_en_espana && med.estado_en_espana.toLowerCase().includes('pendiente')
  ).length;
  
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
  
  const medicationsWithClinicalTrials = medications.filter(med => 
    med.ensayos_clinicos_relevantes && med.ensayos_clinicos_relevantes.trim() !== ''
  ).length;

  // Nuevo: calcular medicamentos con información de moléculas
  const medicationsWithMolecules = medications.filter(med => 
    med.molecula && med.molecula.trim() !== ''
  ).length;

  const stats = [
    {
      title: 'Total Medicamentos',
      value: totalMedications,
      icon: FileText,
      color: 'bg-blue-500',
      description: 'Medicamentos registrados',
      molecule: medications[0]?.molecula || 'N/A'
    },
    {
      title: 'Laboratorios',
      value: uniqueLabs,
      icon: Building,
      color: 'bg-purple-500',
      description: 'Laboratorios únicos',
      molecule: medications.find(med => med.nombre_lab)?.molecula || 'N/A'
    },
    {
      title: 'Aprobados',
      value: approvedMeds,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Medicamentos aprobados',
      molecule: medications.find(med => med.estado_en_espana?.toLowerCase().includes('aprobado'))?.molecula || 'N/A'
    },
    {
      title: 'En Ensayos',
      value: inTrials,
      icon: BarChart,
      color: 'bg-orange-500',
      description: 'En fase de ensayos',
      molecule: medications.find(med => med.estado_en_espana?.toLowerCase().includes('ensayo'))?.molecula || 'N/A'
    },
    {
      title: 'Pendientes',
      value: pendingMeds,
      icon: Clock,
      color: 'bg-yellow-500',
      description: 'Pendientes de aprobación',
      molecule: medications.find(med => med.estado_en_espana?.toLowerCase().includes('pendiente'))?.molecula || 'N/A'
    },
    {
      title: `Aprobados ${currentYear}`,
      value: approvedThisYear,
      icon: CalendarDays,
      color: 'bg-indigo-500',
      description: 'Aprobados este año',
      molecule: medications.find(med => {
        if (!med.fecha_de_aprobacion_espana) return false;
        try {
          return new Date(med.fecha_de_aprobacion_espana).getFullYear() === currentYear;
        } catch {
          return false;
        }
      })?.molecula || 'N/A'
    },
    {
      title: 'Áreas Terapéuticas',
      value: uniqueTherapeuticAreas,
      icon: TrendingUp,
      color: 'bg-teal-500',
      description: 'Áreas diferentes',
      molecule: medications.find(med => med.area_terapeutica)?.molecula || 'N/A'
    },
    {
      title: 'Con Moléculas',
      value: medicationsWithMolecules,
      icon: Molecule,
      color: 'bg-pink-500',
      description: 'Con información de moléculas',
      molecule: medications.find(med => med.molecula && med.molecula.trim() !== '')?.molecula || 'N/A'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
              
              {/* Nuevo: Sección de molécula */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <Molecule className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Molécula:</span>
                </div>
                <p className="text-xs text-gray-800 dark:text-gray-200 truncate" title={stat.molecule}>
                  {stat.molecule}
                </p>
              </div>
              
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
