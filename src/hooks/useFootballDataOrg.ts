import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFootballDataOrg = (endpoint: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!endpoint) {
      setError('Endpoint mancante');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching from Football-Data.org: ${endpoint}`);
      
      const { data: responseData, error: functionError } = await supabase.functions.invoke('football-data-org', {
        body: { endpoint }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      console.log('Football-Data.org response:', responseData);
      setData(responseData);
    } catch (err) {
      console.error('Error fetching from Football-Data.org:', err);
      setError(err instanceof Error ? err.message : 'Errore nel recupero dati');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};