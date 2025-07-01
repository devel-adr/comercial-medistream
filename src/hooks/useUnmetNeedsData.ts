
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUnmetNeedsData = (refreshInterval = 30000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const previousCountRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const eventDispatchedRef = useRef(false);

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
      
      // Check if we have new data (only after initial load and prevent multiple dispatches)
      if (!isInitialLoadRef.current && 
          previousCountRef.current > 0 && 
          newCount > previousCountRef.current &&
          !eventDispatchedRef.current) {
        
        const newRecords = newCount - previousCountRef.current;
        console.log('New UnmetNeeds data detected:', newRecords, 'new records');
        
        // Set flag to prevent multiple dispatches for the same update
        eventDispatchedRef.current = true;
        
        // Dispatch custom event for data update
        window.dispatchEvent(new CustomEvent('dataUpdated', { 
          detail: { 
            type: 'unmetNeeds', 
            count: newCount,
            newRecords: newRecords
          } 
        }));
        
        // Reset flag after a short delay
        setTimeout(() => {
          eventDispatchedRef.current = false;
        }, 2000);
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
