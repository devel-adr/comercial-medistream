import { useState, useEffect, useMemo } from 'react';
import { AreaClassificationService } from '@/services/areaClassificationService';

interface ClassificationData {
  areaTerapeutica?: string;
  farmaco?: string;
  molecula?: string;
}

export const useAreaClassification = <T>(
  items: T[],
  dataExtractor: (item: T) => ClassificationData,
  enabled: boolean = true
) => {
  const [classifiedAreas, setClassifiedAreas] = useState<Map<T, string>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || items.length === 0) {
      return;
    }

    const classifyItems = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const results = await AreaClassificationService.classifyMultipleAreas(items, dataExtractor);
        setClassifiedAreas(results);
      } catch (err) {
        console.error('Error in area classification:', err);
        setError('Error clasificando áreas');
      } finally {
        setIsLoading(false);
      }
    };

    classifyItems();
  }, [items, enabled]);

  const itemsWithAreas = useMemo(() => {
    return items.map(item => ({
      ...item,
      areaIA: classifiedAreas.get(item) || 'other'
    }));
  }, [items, classifiedAreas]);

  const availableAreas = useMemo(() => {
    const areas = Array.from(classifiedAreas.values());
    return [...new Set(areas)].sort();
  }, [classifiedAreas]);

  return {
    itemsWithAreas,
    availableAreas,
    isLoading,
    error,
    classifiedAreas
  };
};