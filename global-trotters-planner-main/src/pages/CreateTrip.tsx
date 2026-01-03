import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateTrip } from '@/hooks/useTrips';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, CalendarIcon, Loader2, Plane, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const tripSchema = z.object({
  name: z.string().min(1, 'Trip name is required').max(100, 'Trip name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export default function CreateTrip() {
  const navigate = useNavigate();
  const createTrip = useCreateTrip();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    try {
      tripSchema.parse({ name, description, startDate, endDate });
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { name?: string; description?: string } = {};
        err.errors.forEach((error) => {
          if (error.path[0] === 'name') fieldErrors.name = error.message;
          if (error.path[0] === 'description') fieldErrors.description = error.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    // Check date validity
    if (startDate && endDate && endDate < startDate) {
      toast({
        variant: 'destructive',
        title: 'Invalid dates',
        description: 'End date cannot be before start date.',
      });
      return;
    }

    try {
      const trip = await createTrip.mutateAsync({
        name,
        description: description || null,
        start_date: startDate ? format(startDate, 'yyyy-MM-dd') : null,
        end_date: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        cover_image_url: coverImageUrl || null,
      });

      toast({
        title: 'Trip created!',
        description: 'Your trip has been created. Add cities and activities to build your itinerary.',
      });

      navigate(`/trips/${trip.id}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create trip. Please try again.',
      });
    }
  };

  const presetImages = [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80',
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>

        <Card className="animate-scale-in">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 rounded-xl bg-gradient-ocean w-fit mb-4">
              <Plane className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="font-display text-2xl">Create New Trip</CardTitle>
            <CardDescription>
              Start planning your next adventure. You can add destinations and activities later.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trip Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Trip Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Summer Europe Adventure"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What's this trip about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !startDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !endDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => startDate ? date < startDate : false}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-3">
                <Label>Cover Image</Label>
                <div className="grid grid-cols-4 gap-2">
                  {presetImages.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCoverImageUrl(url)}
                      className={cn(
                        'aspect-video rounded-lg overflow-hidden border-2 transition-all',
                        coverImageUrl === url 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-transparent hover:border-muted-foreground/30'
                      )}
                    >
                      <img src={url} alt={`Cover ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Or paste an image URL"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                  />
                  {coverImageUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCoverImageUrl('')}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={createTrip.isPending}
                >
                  {createTrip.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Trip'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
