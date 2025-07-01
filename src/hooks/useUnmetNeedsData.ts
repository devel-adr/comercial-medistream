
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUnmetNeedsData = (refreshInterval = 30000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

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

      console.log('Unmet Needs data fetched successfully:', unmetNeeds?.length, 'records');
      
      // Check if we have new data (more records than before)
      if (data.length > 0 && unmetNeeds && unmetNeeds.length > data.length) {
        console.log('New UnmetNeeds data detected:', unmetNeeds.length - data.length, 'new records');
        // Dispatch custom event for data update
        window.dispatchEvent(new CustomEvent('dataUpdated', { 
          detail: { 
            type: 'unmetNeeds', 
            count: unmetNeeds.length,
            newRecords: unmetNeeds.length - data.length
          } 
        }));
      }
      
      setData(unmetNeeds || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching Unmet Needs data:', err);
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
