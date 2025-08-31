import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTheSportsDB = (endpoint: string) => {
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

      console.log(`Fetching from TheSportsDB: ${endpoint}`);
      
      const { data: responseData, error: functionError } = await supabase.functions.invoke('thesportsdb', {
        body: { endpoint }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      console.log('TheSportsDB response:', responseData);
      setData(responseData);
    } catch (err) {
      console.error('Error fetching from TheSportsDB:', err);
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