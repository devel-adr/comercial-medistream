
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ygusrelepdzolqtntkoj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlndXNyZWxlcGR6b2xxdG50a29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjIwMjksImV4cCI6MjA2NjU5ODAyOX0.-IrhyxBDl6zjdI0nmxE7nDm8o8AUZy9UXuDEGlV4n_8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useSupabaseData = (refreshInterval = 30000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    try {
      console.log('Fetching data from Supabase...');
      const { data: medications, error } = await supabase
        .from('test')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Data fetched successfully:', medications?.length, 'records');
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
