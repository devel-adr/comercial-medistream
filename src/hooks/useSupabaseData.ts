
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseData = (refreshInterval = 30000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const previousCountRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const lastEventTimeRef = useRef(0);

  const fetchData = async () => {
    try {
      console.log('Fetching data from Supabase...');
      
      // Primero obtenemos el conteo total de registros
      const { count, error: countError } = await supabase
        .from('DrugDealer_table')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error getting count:', countError);
      } else {
        console.log('Total records in database:', count);
      }

      // Ahora obtenemos todos los datos sin límite explícito
      const { data: medications, error } = await supabase
        .from('DrugDealer_table')
        .select('*')
        .order('ID_NUM', { ascending: false });

      if (error) {
        throw error;
      }

      const newCount = medications?.length || 0;
      console.log('Data fetched successfully:', newCount, 'records');
      console.log('Expected count:', count, 'Actual fetched:', newCount);
      
      if (count && newCount < count) {
        console.warn('WARNING: Not all records were fetched!', {
          expected: count,
          fetched: newCount,
          missing: count - newCount
        });
      }
      
      // Check if we have new data (only after initial load)
      if (!isInitialLoadRef.current && 
          previousCountRef.current > 0 && 
          newCount > previousCountRef.current) {
        
        const now = Date.now();
        const timeSinceLastEvent = now - lastEventTimeRef.current;
        
        // Solo disparar evento si han pasado al menos 5 segundos desde el último
        if (timeSinceLastEvent >= 5000) {
          const newRecords = newCount - previousCountRef.current;
          console.log('New DrugDealer data detected:', newRecords, 'new records');
          
          lastEventTimeRef.current = now;
          
          // Dispatch custom event for data update
          window.dispatchEvent(new CustomEvent('dataUpdated', { 
            detail: { 
              type: 'medications', 
              count: newCount,
              newRecords: newRecords
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
      
      setData(medications || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
    refresh: fetchData
  };
};
