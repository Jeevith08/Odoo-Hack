import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips, useDeleteTrip } from '@/hooks/useTrips';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MapPin, Calendar, DollarSign, MoreVertical, Edit, Trash2, Share2, Eye, Plane } from 'lucide-react';
import { format, isPast, isFuture } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function Trips() {
  const navigate = useNavigate();
  const { data: trips, isLoading } = useTrips();
  const deleteTrip = useDeleteTrip();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);

  const filteredTrips = trips?.filter((trip) =>
    trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTripStatus = (trip: any) => {
    if (!trip.start_date) return { label: 'Planning', variant: 'secondary' as const };
    const startDate = new Date(trip.start_date);
    const endDate = trip.end_date ? new Date(trip.end_date) : startDate;
    
    if (isPast(endDate)) return { label: 'Completed', variant: 'outline' as const };
    if (isPast(startDate)) return { label: 'In Progress', variant: 'default' as const };
    return { label: 'Upcoming', variant: 'secondary' as const };
  };

  const handleDelete = async () => {
    if (!tripToDelete) return;
    
    try {
      await deleteTrip.mutateAsync(tripToDelete);
      toast({
        title: 'Trip deleted',
        description: 'Your trip has been successfully deleted.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete trip. Please try again.',
      });
    } finally {
      setDeleteDialogOpen(false);
      setTripToDelete(null);
    }
  };

  const confirmDelete = (tripId: string) => {
    setTripToDelete(tripId);
    setDeleteDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Trips</h1>
            <p className="text-muted-foreground">Manage all your travel plans</p>
          </div>
          <Button onClick={() => navigate('/trips/new')}>
            <Plus className="mr-2 w-4 h-4" />
            New Trip
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Trips Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : filteredTrips && filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip, index) => {
              const status = getTripStatus(trip);
              return (
                <Card 
                  key={trip.id} 
                  className="overflow-hidden card-hover group animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Cover Image */}
                  <div 
                    className="h-36 bg-gradient-ocean relative cursor-pointer"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  >
                    {trip.cover_image_url ? (
                      <img 
                        src={trip.cover_image_url} 
                        alt={trip.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-primary-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 
                        className="font-display font-semibold text-lg text-foreground cursor-pointer hover:text-primary transition-colors line-clamp-1"
                        onClick={() => navigate(`/trips/${trip.id}`)}
                      >
                        {trip.name}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/trips/${trip.id}`)}>
                            <Eye className="mr-2 w-4 h-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/trips/${trip.id}/edit`)}>
                            <Edit className="mr-2 w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 w-4 h-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => confirmDelete(trip.id)}
                          >
                            <Trash2 className="mr-2 w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {trip.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {trip.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {trip.start_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(trip.start_date), 'MMM d')}
                          {trip.end_date && ` - ${format(new Date(trip.end_date), 'MMM d')}`}
                        </span>
                      )}
                      {trip.total_budget > 0 && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          ${trip.total_budget.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 rounded-full bg-muted mb-4">
                <Plane className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                {searchQuery ? 'No trips found' : 'No trips yet'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                {searchQuery 
                  ? 'Try adjusting your search query'
                  : 'Start planning your first adventure! Create a trip to organize your travel plans.'}
              </p>
              {!searchQuery && (
                <Button onClick={() => navigate('/trips/new')}>
                  <Plus className="mr-2 w-4 h-4" />
                  Create Your First Trip
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this trip? This action cannot be undone.
              All stops, activities, and expenses associated with this trip will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
