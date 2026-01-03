import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useTrips } from '@/hooks/useTrips';
import { usePopularCities } from '@/hooks/useCities';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, MapPin, Calendar, DollarSign, Sparkles, ArrowRight, Plane } from 'lucide-react';
import { format, differenceInDays, isPast, isFuture } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: trips, isLoading: tripsLoading } = useTrips();
  const { data: popularCities, isLoading: citiesLoading } = usePopularCities();

  const upcomingTrips = trips?.filter(
    (trip) => trip.start_date && isFuture(new Date(trip.start_date))
  ).slice(0, 3);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Explorer';

  const getTripStatus = (trip: any) => {
    if (!trip.start_date) return { label: 'Planning', variant: 'secondary' as const };
    const startDate = new Date(trip.start_date);
    const endDate = trip.end_date ? new Date(trip.end_date) : startDate;
    
    if (isPast(endDate)) return { label: 'Completed', variant: 'outline' as const };
    if (isPast(startDate)) return { label: 'In Progress', variant: 'default' as const };
    
    const daysUntil = differenceInDays(startDate, new Date());
    if (daysUntil <= 7) return { label: `${daysUntil}d away`, variant: 'destructive' as const };
    return { label: 'Upcoming', variant: 'secondary' as const };
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to plan your next adventure?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card 
            className="cursor-pointer card-hover border-2 border-dashed border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-all"
            onClick={() => navigate('/trips/new')}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-xl bg-primary text-primary-foreground">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Plan New Trip</h3>
                <p className="text-sm text-muted-foreground">Start your next adventure</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer card-hover"
            onClick={() => navigate('/trips')}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-xl bg-coral/10 text-coral">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">My Trips</h3>
                <p className="text-sm text-muted-foreground">{trips?.length || 0} trips planned</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer card-hover"
            onClick={() => navigate('/explore')}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-xl bg-ocean-light/10 text-ocean-light">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Explore</h3>
                <p className="text-sm text-muted-foreground">Discover destinations</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Trips */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-foreground">Upcoming Trips</h2>
              {trips && trips.length > 3 && (
                <Button variant="ghost" size="sm" onClick={() => navigate('/trips')}>
                  View all <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              )}
            </div>

            {tripsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : upcomingTrips && upcomingTrips.length > 0 ? (
              <div className="space-y-4">
                {upcomingTrips.map((trip, index) => {
                  const status = getTripStatus(trip);
                  return (
                    <Card 
                      key={trip.id} 
                      className="cursor-pointer card-hover animate-slide-up overflow-hidden"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => navigate(`/trips/${trip.id}`)}
                    >
                      <div className="flex">
                        {trip.cover_image_url ? (
                          <div 
                            className="w-32 md:w-48 bg-cover bg-center hidden sm:block"
                            style={{ backgroundImage: `url(${trip.cover_image_url})` }}
                          />
                        ) : (
                          <div className="w-32 md:w-48 bg-gradient-ocean hidden sm:flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-primary-foreground/50" />
                          </div>
                        )}
                        <CardContent className="flex-1 p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-display font-semibold text-lg text-foreground">
                              {trip.name}
                            </h3>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </div>
                          {trip.description && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                              {trip.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {trip.start_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(trip.start_date), 'MMM d')}
                                {trip.end_date && ` - ${format(new Date(trip.end_date), 'MMM d, yyyy')}`}
                              </span>
                            )}
                            {trip.total_budget > 0 && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                ${trip.total_budget.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-muted mb-4">
                    <Plane className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-semibold mb-2">No trips planned yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start planning your first adventure!
                  </p>
                  <Button onClick={() => navigate('/trips/new')}>
                    <Plus className="mr-2 w-4 h-4" />
                    Create Trip
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Popular Destinations */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Popular Destinations</h2>
            
            {citiesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {popularCities?.slice(0, 6).map((city, index) => (
                  <Card 
                    key={city.id} 
                    className="cursor-pointer card-hover animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => navigate('/explore')}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-sunset flex items-center justify-center text-white font-display font-bold">
                        {city.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{city.name}</h4>
                        <p className="text-sm text-muted-foreground">{city.country}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          ${Math.round(city.cost_index * 15)}/day
                        </div>
                        <div className="text-xs text-muted-foreground">avg. cost</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/explore')}
            >
              Explore More <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
