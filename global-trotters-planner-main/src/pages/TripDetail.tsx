import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrip, useTripStops, useAllTripActivities, useExpenses, useCreateTripStop, useDeleteTripStop, useCreateTripActivity, useDeleteTripActivity, useCreateExpense, useDeleteExpense, TripStop, TripActivity } from '@/hooks/useTrips';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, CalendarIcon, Plus, MapPin, Clock, DollarSign, Trash2, Edit, Share2, Loader2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const EXPENSE_CATEGORIES = [
  { value: 'transport', label: 'Transport', color: '#0891b2' },
  { value: 'accommodation', label: 'Accommodation', color: '#f97316' },
  { value: 'food', label: 'Food', color: '#22c55e' },
  { value: 'activities', label: 'Activities', color: '#8b5cf6' },
  { value: 'shopping', label: 'Shopping', color: '#ec4899' },
  { value: 'other', label: 'Other', color: '#6b7280' },
];

const ACTIVITY_CATEGORIES = ['sightseeing', 'food', 'adventure', 'culture', 'nightlife', 'shopping', 'relaxation'];

export default function TripDetail() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: trip, isLoading: tripLoading } = useTrip(tripId!);
  const { data: stops, isLoading: stopsLoading } = useTripStops(tripId!);
  const { data: activities } = useAllTripActivities(tripId!);
  const { data: expenses } = useExpenses(tripId!);

  const createStop = useCreateTripStop();
  const deleteStop = useDeleteTripStop();
  const createActivity = useCreateTripActivity();
  const deleteActivity = useDeleteTripActivity();
  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();

  const [addStopOpen, setAddStopOpen] = useState(false);
  const [addActivityOpen, setAddActivityOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  // Form states
  const [newStop, setNewStop] = useState({ cityName: '', country: '', startDate: undefined as Date | undefined, endDate: undefined as Date | undefined });
  const [newActivity, setNewActivity] = useState({ name: '', category: '', cost: '', scheduledDate: undefined as Date | undefined });
  const [newExpense, setNewExpense] = useState({ category: '', description: '', amount: '', expenseDate: undefined as Date | undefined });

  const handleAddStop = async () => {
    if (!newStop.cityName) return;

    try {
      await createStop.mutateAsync({
        trip_id: tripId,
        city_name: newStop.cityName,
        country: newStop.country || null,
        start_date: newStop.startDate ? format(newStop.startDate, 'yyyy-MM-dd') : null,
        end_date: newStop.endDate ? format(newStop.endDate, 'yyyy-MM-dd') : null,
        order_index: stops?.length || 0,
      });
      setAddStopOpen(false);
      setNewStop({ cityName: '', country: '', startDate: undefined, endDate: undefined });
      toast({ title: 'Stop added', description: `${newStop.cityName} has been added to your trip.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add stop.' });
    }
  };

  const handleAddActivity = async () => {
    if (!newActivity.name || !selectedStopId) return;

    try {
      await createActivity.mutateAsync({
        trip_stop_id: selectedStopId,
        name: newActivity.name,
        category: newActivity.category || null,
        cost: parseFloat(newActivity.cost) || 0,
        scheduled_date: newActivity.scheduledDate ? format(newActivity.scheduledDate, 'yyyy-MM-dd') : null,
      });
      setAddActivityOpen(false);
      setNewActivity({ name: '', category: '', cost: '', scheduledDate: undefined });
      toast({ title: 'Activity added', description: `${newActivity.name} has been added.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add activity.' });
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.category || !newExpense.amount) return;

    try {
      await createExpense.mutateAsync({
        trip_id: tripId,
        category: newExpense.category,
        description: newExpense.description || null,
        amount: parseFloat(newExpense.amount),
        expense_date: newExpense.expenseDate ? format(newExpense.expenseDate, 'yyyy-MM-dd') : null,
      });
      setAddExpenseOpen(false);
      setNewExpense({ category: '', description: '', amount: '', expenseDate: undefined });
      toast({ title: 'Expense added' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add expense.' });
    }
  };

  // Calculate budget data
  const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
  const activityCosts = activities?.reduce((sum, a) => sum + Number(a.cost), 0) || 0;
  const totalCost = totalExpenses + activityCosts;

  const expensesByCategory = EXPENSE_CATEGORIES.map(cat => ({
    name: cat.label,
    value: expenses?.filter(e => e.category === cat.value).reduce((sum, e) => sum + Number(e.amount), 0) || 0,
    color: cat.color,
  })).filter(d => d.value > 0);

  const tripDays = trip?.start_date && trip?.end_date 
    ? differenceInDays(new Date(trip.end_date), new Date(trip.start_date)) + 1 
    : null;

  if (tripLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-48 w-full rounded-xl mb-8" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (!trip) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Trip not found</h1>
          <Button onClick={() => navigate('/trips')} className="mt-4">
            Back to Trips
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/trips')} className="mb-6">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Trips
        </Button>

        {/* Trip Header */}
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          <div 
            className="h-48 md:h-64 bg-gradient-ocean"
            style={trip.cover_image_url ? { 
              backgroundImage: `url(${trip.cover_image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : undefined}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{trip.name}</h1>
            {trip.description && <p className="text-white/80 mb-3">{trip.description}</p>}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {trip.start_date && (
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4" />
                  {format(new Date(trip.start_date), 'MMM d')}
                  {trip.end_date && ` - ${format(new Date(trip.end_date), 'MMM d, yyyy')}`}
                </span>
              )}
              {tripDays && (
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {tripDays} days
                </Badge>
              )}
              {stops && stops.length > 0 && (
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {stops.length} {stops.length === 1 ? 'city' : 'cities'}
                </Badge>
              )}
            </div>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => navigate(`/trips/${tripId}/edit`)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="secondary">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="itinerary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Trip Stops</h2>
              <Dialog open={addStopOpen} onOpenChange={setAddStopOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add City
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add City Stop</DialogTitle>
                    <DialogDescription>Add a new destination to your trip.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>City Name *</Label>
                      <Input
                        placeholder="e.g., Paris"
                        value={newStop.cityName}
                        onChange={(e) => setNewStop({ ...newStop, cityName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input
                        placeholder="e.g., France"
                        value={newStop.country}
                        onChange={(e) => setNewStop({ ...newStop, country: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn('w-full justify-start', !newStop.startDate && 'text-muted-foreground')}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newStop.startDate ? format(newStop.startDate, 'MMM d') : 'Select'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={newStop.startDate} onSelect={(d) => setNewStop({ ...newStop, startDate: d })} className="pointer-events-auto" />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn('w-full justify-start', !newStop.endDate && 'text-muted-foreground')}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newStop.endDate ? format(newStop.endDate, 'MMM d') : 'Select'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={newStop.endDate} onSelect={(d) => setNewStop({ ...newStop, endDate: d })} className="pointer-events-auto" />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddStopOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddStop} disabled={!newStop.cityName || createStop.isPending}>
                      {createStop.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add City'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {stopsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
              </div>
            ) : stops && stops.length > 0 ? (
              <div className="space-y-6">
                {stops.map((stop, index) => (
                  <StopCard
                    key={stop.id}
                    stop={stop}
                    index={index}
                    activities={activities?.filter(a => a.trip_stop_id === stop.id) || []}
                    onAddActivity={() => { setSelectedStopId(stop.id); setAddActivityOpen(true); }}
                    onDeleteStop={() => deleteStop.mutate({ stopId: stop.id, tripId: tripId! })}
                    onDeleteActivity={(activityId) => deleteActivity.mutate({ activityId, tripStopId: stop.id })}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="font-display font-semibold mb-2">No stops yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add your first destination to start building your itinerary.</p>
                  <Button onClick={() => setAddStopOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add First City
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Total Cost</div>
                  <div className="text-3xl font-display font-bold text-foreground">${totalCost.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Activities</div>
                  <div className="text-3xl font-display font-bold text-coral">${activityCosts.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Other Expenses</div>
                  <div className="text-3xl font-display font-bold text-ocean">${totalExpenses.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expense Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {expensesByCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={expensesByCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {expensesByCategory.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-muted-foreground">
                      No expenses recorded yet
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add Expense */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Expenses</CardTitle>
                  <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Expense
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Expense</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Category *</Label>
                          <Select value={newExpense.category} onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {EXPENSE_CATEGORIES.map(cat => (
                                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Amount *</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            placeholder="What was this for?"
                            value={newExpense.description}
                            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddExpenseOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddExpense} disabled={!newExpense.category || !newExpense.amount}>Add Expense</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {expenses && expenses.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {expenses.slice(0, 10).map(expense => (
                        <div key={expense.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div>
                            <span className="font-medium capitalize">{expense.category}</span>
                            {expense.description && <span className="text-sm text-muted-foreground ml-2">- {expense.description}</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">${Number(expense.amount).toLocaleString()}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => deleteExpense.mutate({ expenseId: expense.id, tripId: tripId! })}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No expenses recorded yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Trip Calendar</CardTitle>
                <CardDescription>View your activities by date</CardDescription>
              </CardHeader>
              <CardContent>
                {activities && activities.length > 0 ? (
                  <div className="space-y-4">
                    {/* Group activities by date */}
                    {Object.entries(
                      activities.reduce((acc, activity) => {
                        const date = activity.scheduled_date || 'Unscheduled';
                        if (!acc[date]) acc[date] = [];
                        acc[date].push(activity);
                        return acc;
                      }, {} as Record<string, TripActivity[]>)
                    ).sort(([a], [b]) => a.localeCompare(b)).map(([date, dayActivities]) => (
                      <div key={date}>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">
                          {date === 'Unscheduled' ? date : format(new Date(date), 'EEEE, MMMM d')}
                        </h4>
                        <div className="space-y-2">
                          {dayActivities.map(activity => (
                            <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                              <div className="flex-1">
                                <div className="font-medium">{activity.name}</div>
                                {activity.category && (
                                  <Badge variant="outline" className="mt-1 text-xs capitalize">{activity.category}</Badge>
                                )}
                              </div>
                              {activity.cost > 0 && (
                                <span className="text-sm font-medium">${activity.cost}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No activities scheduled yet. Add activities to your city stops to see them here.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Activity Dialog */}
        <Dialog open={addActivityOpen} onOpenChange={setAddActivityOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Activity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Activity Name *</Label>
                <Input
                  placeholder="e.g., Visit Eiffel Tower"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newActivity.category} onValueChange={(v) => setNewActivity({ ...newActivity, category: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cost ($)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newActivity.cost}
                    onChange={(e) => setNewActivity({ ...newActivity, cost: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('w-full justify-start', !newActivity.scheduledDate && 'text-muted-foreground')}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newActivity.scheduledDate ? format(newActivity.scheduledDate, 'MMM d') : 'Select'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={newActivity.scheduledDate} onSelect={(d) => setNewActivity({ ...newActivity, scheduledDate: d })} className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddActivityOpen(false)}>Cancel</Button>
              <Button onClick={handleAddActivity} disabled={!newActivity.name || createActivity.isPending}>
                {createActivity.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Activity'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

// Stop Card Component
function StopCard({ 
  stop, 
  index, 
  activities, 
  onAddActivity, 
  onDeleteStop,
  onDeleteActivity 
}: { 
  stop: TripStop; 
  index: number; 
  activities: TripActivity[];
  onAddActivity: () => void;
  onDeleteStop: () => void;
  onDeleteActivity: (id: string) => void;
}) {
  const totalCost = activities.reduce((sum, a) => sum + Number(a.cost), 0);

  return (
    <Card className="overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold">
              {index + 1}
            </div>
            <div>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <MapPin className="w-4 h-4 text-coral" />
                {stop.city_name}
              </CardTitle>
              {stop.country && (
                <CardDescription>{stop.country}</CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {stop.start_date && (
              <Badge variant="outline">
                {format(new Date(stop.start_date), 'MMM d')}
                {stop.end_date && ` - ${format(new Date(stop.end_date), 'MMM d')}`}
              </Badge>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDeleteStop}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{activities.length} activities</span>
          {totalCost > 0 && (
            <span className="text-sm font-medium flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {totalCost.toLocaleString()}
            </span>
          )}
        </div>
        
        {activities.length > 0 ? (
          <div className="space-y-2 mb-4">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 group">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-coral" />
                  <span className="text-sm">{activity.name}</span>
                  {activity.category && (
                    <Badge variant="outline" className="text-xs capitalize">{activity.category}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activity.cost > 0 && (
                    <span className="text-xs text-muted-foreground">${activity.cost}</span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDeleteActivity(activity.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">No activities added yet</p>
        )}

        <Button variant="outline" size="sm" className="w-full" onClick={onAddActivity}>
          <Plus className="w-4 h-4 mr-1" />
          Add Activity
        </Button>
      </CardContent>
    </Card>
  );
}
