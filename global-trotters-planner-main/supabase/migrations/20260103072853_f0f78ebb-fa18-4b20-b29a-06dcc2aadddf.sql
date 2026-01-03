-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create trigger for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Cities table (reference data)
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  image_url TEXT,
  cost_index INTEGER DEFAULT 50, -- 1-100 scale
  popularity INTEGER DEFAULT 50, -- 1-100 scale
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS but allow public read
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cities are publicly readable" ON public.cities
  FOR SELECT USING (true);

-- Trips table
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  start_date DATE,
  end_date DATE,
  is_public BOOLEAN DEFAULT false,
  share_code TEXT UNIQUE,
  total_budget DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on trips
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trips" ON public.trips
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create own trips" ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" ON public.trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" ON public.trips
  FOR DELETE USING (auth.uid() = user_id);

-- Trip stops (cities within a trip)
CREATE TABLE public.trip_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  city_id UUID REFERENCES public.cities(id),
  city_name TEXT NOT NULL,
  country TEXT,
  start_date DATE,
  end_date DATE,
  order_index INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on trip_stops
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view stops of own trips" ON public.trip_stops
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND (user_id = auth.uid() OR is_public = true))
  );

CREATE POLICY "Users can create stops for own trips" ON public.trip_stops
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update stops of own trips" ON public.trip_stops
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete stops of own trips" ON public.trip_stops
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
  );

-- Activities reference table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'food', 'sightseeing', 'adventure', 'culture', 'nightlife', 'shopping'
  description TEXT,
  average_cost DECIMAL(10, 2),
  average_duration_hours DECIMAL(4, 2),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS but allow public read
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activities are publicly readable" ON public.activities
  FOR SELECT USING (true);

-- Trip activities (activities within a trip stop)
CREATE TABLE public.trip_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_stop_id UUID NOT NULL REFERENCES public.trip_stops(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES public.activities(id),
  name TEXT NOT NULL,
  category TEXT,
  scheduled_date DATE,
  scheduled_time TIME,
  duration_hours DECIMAL(4, 2),
  cost DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on trip_activities
ALTER TABLE public.trip_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activities of own trips" ON public.trip_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trip_stops ts
      JOIN public.trips t ON ts.trip_id = t.id
      WHERE ts.id = trip_stop_id AND (t.user_id = auth.uid() OR t.is_public = true)
    )
  );

CREATE POLICY "Users can create activities for own trips" ON public.trip_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trip_stops ts
      JOIN public.trips t ON ts.trip_id = t.id
      WHERE ts.id = trip_stop_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update activities of own trips" ON public.trip_activities
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.trip_stops ts
      JOIN public.trips t ON ts.trip_id = t.id
      WHERE ts.id = trip_stop_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete activities of own trips" ON public.trip_activities
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.trip_stops ts
      JOIN public.trips t ON ts.trip_id = t.id
      WHERE ts.id = trip_stop_id AND t.user_id = auth.uid()
    )
  );

-- Expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  trip_stop_id UUID REFERENCES public.trip_stops(id) ON DELETE SET NULL,
  category TEXT NOT NULL, -- 'transport', 'accommodation', 'food', 'activities', 'shopping', 'other'
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  expense_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view expenses of own trips" ON public.expenses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND (user_id = auth.uid() OR is_public = true))
  );

CREATE POLICY "Users can create expenses for own trips" ON public.expenses
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update expenses of own trips" ON public.expenses
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete expenses of own trips" ON public.expenses
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample cities
INSERT INTO public.cities (name, country, region, cost_index, popularity, latitude, longitude) VALUES
('Paris', 'France', 'Europe', 75, 95, 48.8566, 2.3522),
('Tokyo', 'Japan', 'Asia', 70, 92, 35.6762, 139.6503),
('New York', 'USA', 'North America', 85, 90, 40.7128, -74.0060),
('Barcelona', 'Spain', 'Europe', 60, 88, 41.3851, 2.1734),
('Bali', 'Indonesia', 'Asia', 35, 85, -8.3405, 115.0920),
('Rome', 'Italy', 'Europe', 65, 87, 41.9028, 12.4964),
('London', 'UK', 'Europe', 80, 89, 51.5074, -0.1278),
('Sydney', 'Australia', 'Oceania', 75, 82, -33.8688, 151.2093),
('Dubai', 'UAE', 'Middle East', 70, 80, 25.2048, 55.2708),
('Bangkok', 'Thailand', 'Asia', 30, 83, 13.7563, 100.5018),
('Amsterdam', 'Netherlands', 'Europe', 72, 78, 52.3676, 4.9041),
('Lisbon', 'Portugal', 'Europe', 50, 76, 38.7223, -9.1393);

-- Insert sample activities
INSERT INTO public.activities (name, category, description, average_cost, average_duration_hours) VALUES
('City Walking Tour', 'sightseeing', 'Guided walking tour of major landmarks', 25, 3),
('Museum Visit', 'culture', 'Visit to local museum or gallery', 20, 2.5),
('Local Food Tour', 'food', 'Guided tour of local cuisine and restaurants', 75, 4),
('Beach Day', 'adventure', 'Relaxing day at the beach', 15, 6),
('Hiking Trail', 'adventure', 'Hiking through scenic trails', 10, 5),
('Cooking Class', 'food', 'Learn to cook local dishes', 80, 3),
('Night Market', 'shopping', 'Explore local night markets', 30, 3),
('Wine Tasting', 'food', 'Local wine tasting experience', 60, 2),
('Temple Visit', 'culture', 'Visit historic temples and shrines', 10, 2),
('Boat Tour', 'adventure', 'Scenic boat or cruise tour', 50, 3);