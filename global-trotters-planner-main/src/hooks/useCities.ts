import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface City {
  id: string;
  name: string;
  country: string;
  region: string | null;
  image_url: string | null;
  cost_index: number;
  popularity: number;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export function useCities(search?: string) {
  return useQuery({
    queryKey: ['cities', search],
    queryFn: async () => {
      let query = supabase
        .from('cities')
        .select('*')
        .order('popularity', { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,country.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as City[];
    },
  });
}

export function usePopularCities(limit = 6) {
  return useQuery({
    queryKey: ['popular-cities', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('popularity', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as City[];
    },
  });
}
