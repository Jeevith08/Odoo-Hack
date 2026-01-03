import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Activity {
  id: string;
  name: string;
  category: string;
  description: string | null;
  average_cost: number | null;
  average_duration_hours: number | null;
  image_url: string | null;
  created_at: string;
}

export function useActivities(filters?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ['activities', filters],
    queryFn: async () => {
      let query = supabase
        .from('activities')
        .select('*')
        .order('name', { ascending: true });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Activity[];
    },
  });
}
