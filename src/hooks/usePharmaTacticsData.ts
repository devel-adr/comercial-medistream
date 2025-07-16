
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePharmaTacticsData = (refreshInterval = 30000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const previousCountRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const lastEventTimeRef = useRef(0);

  const fetchData = async () => {
    try {
      console.log('Fetching PharmaTactics data from Supabase...');
      
      // Using type assertion to work around TypeScript limitations
      // Note: This assumes the PharmaTactics_table exists in your Supabase database
      const { data: tactics, error } = await (supabase as any)
        .from('PharmaTactics_table')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to fetch data: ${error.message}`);
      }

      const newCount = tactics?.length || 0;
      console.log('PharmaTactics data fetched successfully:', newCount, 'records');
      
      // Check if we have new data (only after initial load)
      if (!isInitialLoadRef.current && 
          previousCountRef.current > 0 && 
          newCount > previousCountRef.current) {
        
        const now = Date.now();
        const timeSinceLastEvent = now - lastEventTimeRef.current;
        
        // Only dispatch event if at least 5 seconds have passed since the last one
        if (timeSinceLastEvent >= 5000) {
          const newRecords = newCount - previousCountRef.current;
          console.log('New PharmaTactics data detected:', newRecords, 'new records');
          
          lastEventTimeRef.current = now;
          
          // Dispatch custom event for data update with detailed data
          window.dispatchEvent(new CustomEvent('dataUpdated', { 
            detail: { 
              type: 'pharmaTactics', 
              count: newCount,
              newRecords: newRecords,
              data: tactics || []
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
      
      setData(tactics || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching PharmaTactics data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
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
