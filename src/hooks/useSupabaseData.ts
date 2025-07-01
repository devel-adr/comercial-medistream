
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseData = (refreshInterval = 30000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const previousCountRef = useRef(0);

  const fetchData = async () => {
    try {
      console.log('Fetching data from Supabase...');
      const { data: medications, error } = await supabase
        .from('DrugDealer_table')
        .select('*')
        .order('ID_NUM', { ascending: false });

      if (error) {
        throw error;
      }

      const newCount = medications?.length || 0;
      console.log('Data fetched successfully:', newCount, 'records');
      
      // Check if we have new data (only after initial load)
      if (!loading && previousCountRef.current > 0 && newCount > previousCountRef.current) {
        const newRecords = newCount - previousCountRef.current;
        console.log('New DrugDealer data detected:', newRecords, 'new records');
        
        // Dispatch custom event for data update
        window.dispatchEvent(new CustomEvent('dataUpdated', { 
          detail: { 
            type: 'medications', 
            count: newCount,
            newRecords: newRecords
          } 
        }));
      }
      
      previousCountRef.current = newCount;
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
