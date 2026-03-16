// src/hooks/useSupabase.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Helper hook to fetch data
export const useSupabase = <T>(
  table: string, 
  options: { 
    orderBy?: { column: string, ascending?: boolean },
    limit?: number 
  } = {}
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let query = supabase.from(table).select('*');
        
        if (options.orderBy) {
          query = query.order(options.orderBy.column, { 
            ascending: options.orderBy.ascending ?? true 
          });
        }
        
        if (options.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        if (result) {
          setData(result as T[]);
        }
      } catch (err) {
        console.error(`Error fetching ${table}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, options]);

  return { data, loading, error };
};
