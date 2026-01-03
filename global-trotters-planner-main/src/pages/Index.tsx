import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Plane, MapPin, Calendar, DollarSign, Users, ChevronRight, Star, Sparkles } from 'lucide-react';

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: MapPin,
      title: 'Multi-City Itineraries',
      description: 'Plan trips across multiple destinations with ease.',
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Organize activities day by day with calendar views.',
    },
    {
      icon: DollarSign,
      title: 'Budget Tracking',
      description: 'Track expenses and stay within your travel budget.',
    },
    {
      icon: Users,
      title: 'Share & Collaborate',
      description: 'Share itineraries with friends and travel companions.',
    },
  ];

  const destinations = [
    { name: 'Paris', country: 'France', rating: 4.9 },
    { name: 'Tokyo', country: 'Japan', rating: 4.8 },
    { name: 'Bali', country: 'Indonesia', rating: 4.7 },
    { name: 'Barcelona', country: 'Spain', rating: 4.8 },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-ocean">
              <Globe className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">GlobalTrotters</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-coral/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-ocean-light/10 rounded-full blur-3xl" />
          <Plane className="absolute top-40 right-[15%] w-12 h-12 text-primary/10 animate-float" />
          <MapPin className="absolute bottom-40 left-[10%] w-10 h-10 text-coral/15 animate-float delay-200" />
          <Globe className="absolute top-1/3 left-[20%] w-14 h-14 text-ocean-light/10 animate-float delay-500" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Plan smarter, travel better
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
            Your Next Adventure
            <br />
            <span className="gradient-text">Starts Here</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up delay-100">
            Create stunning multi-city itineraries, track budgets, and share your travel plans with friends. 
            All in one beautiful app.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/auth">
                Start Planning Free
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/auth">See Demo</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-16 animate-fade-in delay-300">
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-foreground">50K+</div>
              <div className="text-sm text-muted-foreground">Travelers</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-foreground">100+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-foreground">250K+</div>
              <div className="text-sm text-muted-foreground">Trips Planned</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Plan
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed to make trip planning effortless and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="border-0 shadow-card card-hover animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Destinations
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get inspired by where other travelers are heading.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destinations.map((dest, index) => (
              <Card 
                key={dest.name} 
                className="overflow-hidden card-hover cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[4/3] bg-gradient-ocean relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-display font-bold text-primary-foreground/20">
                      {dest.name.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 text-xs font-medium">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {dest.rating}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-display font-semibold">{dest.name}</h3>
                  <p className="text-sm text-muted-foreground">{dest.country}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-ocean text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of travelers who plan their adventures with GlobalTrotters.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8">
            <Link to="/auth">
              Create Free Account
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-ocean">
              <Globe className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">GlobalTrotters</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 GlobalTrotters. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
