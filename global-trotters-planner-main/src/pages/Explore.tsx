import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCities } from '@/hooks/useCities';
import { useActivities } from '@/hooks/useActivities';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, DollarSign, Star, Clock, TrendingUp, Compass, Utensils, Mountain, Palette, PartyPopper, ShoppingBag } from 'lucide-react';

const REGIONS = ['All', 'Europe', 'Asia', 'North America', 'Oceania', 'Middle East'];
const ACTIVITY_CATEGORIES = [
  { value: '', label: 'All Categories', icon: Compass },
  { value: 'sightseeing', label: 'Sightseeing', icon: MapPin },
  { value: 'food', label: 'Food & Dining', icon: Utensils },
  { value: 'adventure', label: 'Adventure', icon: Mountain },
  { value: 'culture', label: 'Culture', icon: Palette },
  { value: 'nightlife', label: 'Nightlife', icon: PartyPopper },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag },
];

export default function Explore() {
  const navigate = useNavigate();
  const [citySearch, setCitySearch] = useState('');
  const [activitySearch, setActivitySearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: cities, isLoading: citiesLoading } = useCities(citySearch);
  const { data: activities, isLoading: activitiesLoading } = useActivities({ 
    category: selectedCategory, 
    search: activitySearch 
  });

  const filteredCities = cities?.filter(city => 
    selectedRegion === 'All' || city.region === selectedRegion
  );

  const getCostLabel = (index: number) => {
    if (index < 40) return { label: 'Budget', color: 'bg-green-500' };
    if (index < 60) return { label: 'Moderate', color: 'bg-yellow-500' };
    if (index < 80) return { label: 'Expensive', color: 'bg-orange-500' };
    return { label: 'Very Expensive', color: 'bg-red-500' };
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Explore Destinations
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover amazing cities and activities for your next adventure
          </p>
        </div>

        <Tabs defaultValue="cities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="cities">
              <MapPin className="w-4 h-4 mr-2" />
              Cities
            </TabsTrigger>
            <TabsTrigger value="activities">
              <Compass className="w-4 h-4 mr-2" />
              Activities
            </TabsTrigger>
          </TabsList>

          {/* Cities Tab */}
          <TabsContent value="cities" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search cities..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cities Grid */}
            {citiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            ) : filteredCities && filteredCities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCities.map((city, index) => {
                  const costInfo = getCostLabel(city.cost_index);
                  return (
                    <Card 
                      key={city.id} 
                      className="overflow-hidden card-hover group animate-slide-up cursor-pointer"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Image/Cover */}
                      <div className="h-40 bg-gradient-ocean relative overflow-hidden">
                        {city.image_url ? (
                          <img src={city.image_url} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl font-display font-bold text-primary-foreground/20">
                              {city.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-white/90 text-foreground hover:bg-white">
                            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {city.popularity}%
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-display font-semibold text-lg">{city.name}</h3>
                            <p className="text-sm text-muted-foreground">{city.country}</p>
                          </div>
                          {city.region && (
                            <Badge variant="outline" className="text-xs">{city.region}</Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${costInfo.color}`} />
                            <span className="text-sm text-muted-foreground">{costInfo.label}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-foreground">
                              ${Math.round(city.cost_index * 15)}/day
                            </div>
                            <div className="text-xs text-muted-foreground">avg. budget</div>
                          </div>
                        </div>

                        <Button 
                          className="w-full mt-4" 
                          variant="outline"
                          onClick={() => navigate('/trips/new')}
                        >
                          Add to Trip
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-display font-semibold text-lg mb-2">No cities found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.value}
                    variant={selectedCategory === cat.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.value)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </Button>
                );
              })}
            </div>

            {/* Activities Grid */}
            {activitiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : activities && activities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map((activity, index) => (
                  <Card 
                    key={activity.id} 
                    className="card-hover animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-coral/10 text-coral">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{activity.name}</h3>
                          <Badge variant="outline" className="capitalize text-xs mb-2">
                            {activity.category}
                          </Badge>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {activity.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {activity.average_cost && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5" />
                              ${activity.average_cost}
                            </span>
                          )}
                          {activity.average_duration_hours && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {activity.average_duration_hours}h
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Compass className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-display font-semibold text-lg mb-2">No activities found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
