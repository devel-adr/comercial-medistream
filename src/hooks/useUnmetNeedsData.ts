
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUnmetNeedsData = (refreshInterval = 30000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const previousCountRef = useRef(0);
  const isInitialLoadRef = useRef(true);

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
      if (!isInitialLoadRef.current && previousCountRef.current > 0 && newCount > previousCountRef.current) {
        const newRecords = newCount - previousCountRef.current;
        console.log('New UnmetNeeds data detected:', newRecords, 'new records');
        
        // Dispatch custom event for data update
        window.dispatchEvent(new CustomEvent('dataUpdated', { 
          detail: { 
            type: 'unmetNeeds', 
            count: newCount,
            newRecords: newRecords
          } 
        }));
      }
      
      // Update refs
      previousCountRef.current = newCount;
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
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
