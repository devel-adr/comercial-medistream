
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseData = (refreshInterval = 30000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

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

      console.log('Data fetched successfully:', medications?.length, 'records');
      
      // Check if data has changed and trigger notification
      if (data.length > 0 && medications && medications.length !== data.length) {
        // Dispatch custom event for data update
        window.dispatchEvent(new CustomEvent('dataUpdated', { 
          detail: { type: 'medications', count: medications.length } 
        }));
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
