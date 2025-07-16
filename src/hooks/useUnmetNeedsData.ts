import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Extend the existing type to include favorito and preguntas fields
type UnmetNeedWithFavorito = {
  id_UN_table?: number;
  area_terapeutica?: string;
  conclusion?: string;
  farmaco?: string;
  horizonte_temporal?: string;
  id_NUM_DD?: number;
  id_UN_NUM?: string;
  impacto?: string;
  lab?: string;
  molecula?: string;
  oportunidad_estrategica?: string;
  racional?: string;
  unmet_need?: string;
  favorito?: boolean;
  preguntas?: string;
  user_email?: string;
};

export const useUnmetNeedsData = (refreshInterval = 30000) => {
  const [data, setData] = useState<UnmetNeedWithFavorito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const previousCountRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const lastEventTimeRef = useRef(0);

  const fetchData = async () => {
    try {
      console.log('Fetching Unmet Needs data from Supabase...');
      const { data: unmetNeeds, error } = await supabase
        .from('UnmetNeeds_table')
        .select('*')
        .order('id_UN_table', { ascending: false });

      if (error) {
        throw error;
      }

      const newCount = unmetNeeds?.length || 0;
      console.log('Unmet Needs data fetched successfully:', newCount, 'records');
      
      // Check if we have new data (only after initial load)
      if (!isInitialLoadRef.current && 
          previousCountRef.current > 0 && 
          newCount > previousCountRef.current) {
        
        const now = Date.now();
        const timeSinceLastEvent = now - lastEventTimeRef.current;
        
        // Solo disparar evento si han pasado al menos 5 segundos desde el último
        if (timeSinceLastEvent >= 5000) {
          const newRecords = newCount - previousCountRef.current;
          console.log('New UnmetNeeds data detected:', newRecords, 'new records');
          
          lastEventTimeRef.current = now;
          
          // Dispatch custom event for data update with detailed data
          window.dispatchEvent(new CustomEvent('dataUpdated', { 
            detail: { 
              type: 'unmetNeeds', 
              count: newCount,
              newRecords: newRecords,
              data: unmetNeeds || []
            } 
          }));
        } else {
          console.log('Skipping event dispatch - too soon since last event');
        }
      }
      
      // Update refs
      previousCountRef.current = newCount;
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
      }
      
      setData(unmetNeeds || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      console.error('Error fetching Unmet Needs data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (unmetNeed: UnmetNeedWithFavorito) => {
    try {
      const newFavoritoValue = !unmetNeed.favorito;
      console.log('Toggling favorite for:', unmetNeed.id_UN_table, 'to:', newFavoritoValue);
      
      // Use type assertion to bypass TypeScript checking for the favorito field
      const { error } = await supabase
        .from('UnmetNeeds_table')
        .update({ favorito: newFavoritoValue } as any)
        .eq('id_UN_table', unmetNeed.id_UN_table);

      if (error) {
        throw error;
      }

      // Update local state
      setData(prevData => 
        prevData.map(item => 
          item.id_UN_table === unmetNeed.id_UN_table 
            ? { ...item, favorito: newFavoritoValue }
            : item
        )
      );

      console.log('Favorite status updated successfully');
    } catch (err: any) {
      console.error('Error updating favorite status:', err);
      throw err;
    }
  };

  const deleteUnmetNeed = async (unmetNeed: UnmetNeedWithFavorito) => {
    try {
      console.log('Deleting Unmet Need:', unmetNeed.id_UN_table);
      
      const { error } = await supabase
        .from('UnmetNeeds_table')
        .delete()
        .eq('id_UN_table', unmetNeed.id_UN_table);

      if (error) {
        throw error;
      }

      // Update local state
      setData(prevData => 
        prevData.filter(item => item.id_UN_table !== unmetNeed.id_UN_table)
      );

      console.log('Unmet Need deleted successfully');
    } catch (err: any) {
      console.error('Error deleting Unmet Need:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh: fetchData,
    toggleFavorite,
    deleteUnmetNeed
  };
};
