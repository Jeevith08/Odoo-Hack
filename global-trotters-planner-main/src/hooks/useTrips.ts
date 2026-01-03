import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  is_public: boolean;
  share_code: string | null;
  total_budget: number;
  created_at: string;
  updated_at: string;
}

export interface TripStop {
  id: string;
  trip_id: string;
  city_id: string | null;
  city_name: string;
  country: string | null;
  start_date: string | null;
  end_date: string | null;
  order_index: number;
  notes: string | null;
  created_at: string;
}

export interface TripActivity {
  id: string;
  trip_stop_id: string;
  activity_id: string | null;
  name: string;
  category: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  duration_hours: number | null;
  cost: number;
  notes: string | null;
  is_completed: boolean;
  order_index: number;
  created_at: string;
}

export interface Expense {
  id: string;
  trip_id: string;
  trip_stop_id: string | null;
  category: string;
  description: string | null;
  amount: number;
  currency: string;
  expense_date: string | null;
  created_at: string;
}

export function useTrips() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['trips', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Trip[];
    },
    enabled: !!user,
  });
}

export function useTrip(tripId: string) {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (error) throw error;
      return data as Trip;
    },
    enabled: !!tripId,
  });
}

export function useTripStops(tripId: string) {
  return useQuery({
    queryKey: ['trip-stops', tripId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trip_stops')
        .select('*')
        .eq('trip_id', tripId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as TripStop[];
    },
    enabled: !!tripId,
  });
}

export function useTripActivities(tripStopId: string) {
  return useQuery({
    queryKey: ['trip-activities', tripStopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trip_activities')
        .select('*')
        .eq('trip_stop_id', tripStopId)
        .order('scheduled_date', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as TripActivity[];
    },
    enabled: !!tripStopId,
  });
}

export function useAllTripActivities(tripId: string) {
  return useQuery({
    queryKey: ['all-trip-activities', tripId],
    queryFn: async () => {
      const { data: stops, error: stopsError } = await supabase
        .from('trip_stops')
        .select('id')
        .eq('trip_id', tripId);

      if (stopsError) throw stopsError;
      if (!stops || stops.length === 0) return [];

      const stopIds = stops.map(s => s.id);
      const { data, error } = await supabase
        .from('trip_activities')
        .select('*')
        .in('trip_stop_id', stopIds)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return data as TripActivity[];
    },
    enabled: !!tripId,
  });
}

export function useExpenses(tripId: string) {
  return useQuery({
    queryKey: ['expenses', tripId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('trip_id', tripId)
        .order('expense_date', { ascending: false });

      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!tripId,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (trip: Omit<Partial<Trip>, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('trips')
        .insert({
          name: trip.name || 'Untitled Trip',
          description: trip.description,
          cover_image_url: trip.cover_image_url,
          start_date: trip.start_date,
          end_date: trip.end_date,
          is_public: trip.is_public ?? false,
          total_budget: trip.total_budget ?? 0,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Trip;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Trip> & { id: string }) => {
      const { data, error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Trip;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip', data.id] });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripId: string) => {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export function useCreateTripStop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stop: { trip_id: string; city_name: string; country?: string | null; city_id?: string | null; start_date?: string | null; end_date?: string | null; order_index?: number; notes?: string | null }) => {
      const { data, error } = await supabase
        .from('trip_stops')
        .insert({
          trip_id: stop.trip_id,
          city_name: stop.city_name,
          country: stop.country,
          city_id: stop.city_id,
          start_date: stop.start_date,
          end_date: stop.end_date,
          order_index: stop.order_index ?? 0,
          notes: stop.notes,
        })
        .select()
        .single();

      if (error) throw error;
      return data as TripStop;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trip-stops', data.trip_id] });
    },
  });
}

export function useUpdateTripStop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TripStop> & { id: string }) => {
      const { data, error } = await supabase
        .from('trip_stops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as TripStop;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trip-stops', data.trip_id] });
    },
  });
}

export function useDeleteTripStop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ stopId, tripId }: { stopId: string; tripId: string }) => {
      const { error } = await supabase
        .from('trip_stops')
        .delete()
        .eq('id', stopId);

      if (error) throw error;
      return { tripId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trip-stops', data.tripId] });
    },
  });
}

export function useCreateTripActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: { trip_stop_id: string; name: string; category?: string | null; scheduled_date?: string | null; scheduled_time?: string | null; duration_hours?: number | null; cost?: number; notes?: string | null; activity_id?: string | null }) => {
      const { data, error } = await supabase
        .from('trip_activities')
        .insert({
          trip_stop_id: activity.trip_stop_id,
          name: activity.name,
          category: activity.category,
          scheduled_date: activity.scheduled_date,
          scheduled_time: activity.scheduled_time,
          duration_hours: activity.duration_hours,
          cost: activity.cost ?? 0,
          notes: activity.notes,
          activity_id: activity.activity_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as TripActivity;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trip-activities', data.trip_stop_id] });
      queryClient.invalidateQueries({ queryKey: ['all-trip-activities'] });
    },
  });
}

export function useUpdateTripActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TripActivity> & { id: string }) => {
      const { data, error } = await supabase
        .from('trip_activities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as TripActivity;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trip-activities', data.trip_stop_id] });
      queryClient.invalidateQueries({ queryKey: ['all-trip-activities'] });
    },
  });
}

export function useDeleteTripActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, tripStopId }: { activityId: string; tripStopId: string }) => {
      const { error } = await supabase
        .from('trip_activities')
        .delete()
        .eq('id', activityId);

      if (error) throw error;
      return { tripStopId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trip-activities', data.tripStopId] });
      queryClient.invalidateQueries({ queryKey: ['all-trip-activities'] });
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: { trip_id: string; category: string; amount: number; description?: string | null; trip_stop_id?: string | null; expense_date?: string | null; currency?: string }) => {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          trip_id: expense.trip_id,
          category: expense.category,
          amount: expense.amount,
          description: expense.description,
          trip_stop_id: expense.trip_stop_id,
          expense_date: expense.expense_date,
          currency: expense.currency ?? 'USD',
        })
        .select()
        .single();

      if (error) throw error;
      return data as Expense;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', data.trip_id] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ expenseId, tripId }: { expenseId: string; tripId: string }) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
      return { tripId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', data.tripId] });
    },
  });
}
