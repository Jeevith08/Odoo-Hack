import { motion } from "framer-motion";
import { Plus, MapPin, Calendar, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingNav } from "@/components/FloatingNav";

const upcomingTrips = [];

const recommendedDestinations = [];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card/50 backdrop-blur-lg border-b border-border sticky top-0 z-40"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold">Good morning! ☀️</h1>
              <p className="text-muted-foreground">Ready for your next adventure?</p>
            </div>
            <Link to="/create-trip">
              <Button variant="hero" size="lg" className="group">
                <Plus className="w-5 h-5" />
                New Trip
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8 space-y-10">
        {/* Stats */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Trips", value: "0", icon: MapPin, color: "text-primary" },
            { label: "Countries Visited", value: "0", icon: TrendingUp, color: "text-secondary" },
            { label: "Upcoming", value: "0", icon: Calendar, color: "text-accent" },
            { label: "Total Saved", value: "$0", icon: TrendingUp, color: "text-primary" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card variant="glass" className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        {/* Upcoming Trips */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold">Upcoming Trips</h2>
            <Link to="/trips" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {upcomingTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card variant="elevated" className="overflow-hidden cursor-pointer group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={trip.image}
                      alt={trip.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-card">
                      <h3 className="text-lg font-heading font-semibold">{trip.name}</h3>
                      <p className="text-sm opacity-90">{trip.destination}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {trip.startDate} - {trip.endDate}
                      </div>
                      <div className="font-heading font-semibold text-primary">
                        ${trip.budget.toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Recommended Destinations */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold">Recommended for You</h2>
            <Link to="/explore" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              Explore <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {recommendedDestinations.map((dest, index) => (
              <motion.div
                key={dest.name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer group"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-card">
                  <p className="font-medium text-sm truncate">{dest.name}</p>
                  <p className="text-xs opacity-80">⭐ {dest.rating}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <FloatingNav />
    </div>
  );
}
