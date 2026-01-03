import { motion } from "framer-motion";
import { Plus, Calendar, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { TripCard } from "@/components/cards/TripCard";
import { Button } from "@/components/ui/button";

import parisImage from "@/assets/city-paris.jpg";
import tokyoImage from "@/assets/city-tokyo.jpg";
import santoriniImage from "@/assets/city-santorini.jpg";

const trips = [
  {
    id: "1",
    name: "European Adventure",
    coverImage: parisImage,
    startDate: "2025-03-15",
    endDate: "2025-03-28",
    destinations: ["Paris", "Amsterdam", "Berlin"],
    budget: 3500,
  },
  {
    id: "2",
    name: "Japan Discovery",
    coverImage: tokyoImage,
    startDate: "2025-05-01",
    endDate: "2025-05-14",
    destinations: ["Tokyo", "Kyoto", "Osaka"],
    budget: 4200,
  },
  {
    id: "3",
    name: "Greek Islands",
    coverImage: santoriniImage,
    startDate: "2025-07-10",
    endDate: "2025-07-20",
    destinations: ["Athens", "Santorini", "Mykonos"],
    budget: 2800,
  },
];

const MyTrips = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
          >
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground mb-2">
                My Trips
              </h1>
              <p className="text-muted-foreground">
                Manage and organize your travel plans
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Link to="/create-trip">
                <Button variant="hero" className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Trip
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            <div className="p-5 rounded-xl bg-card border border-border">
              <p className="text-muted-foreground text-sm">Total Trips</p>
              <p className="font-display text-3xl font-bold text-foreground">{trips.length}</p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border">
              <p className="text-muted-foreground text-sm">Upcoming</p>
              <p className="font-display text-3xl font-bold text-primary">{trips.length}</p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border">
              <p className="text-muted-foreground text-sm">Countries</p>
              <p className="font-display text-3xl font-bold text-accent">5</p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border">
              <p className="text-muted-foreground text-sm">Total Budget</p>
              <p className="font-display text-3xl font-bold text-gold">
                ${trips.reduce((sum, t) => sum + t.budget, 0).toLocaleString()}
              </p>
            </div>
          </motion.div>

          {/* Trips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <TripCard
                  {...trip}
                  onEdit={() => console.log("Edit", trip.id)}
                  onDelete={() => console.log("Delete", trip.id)}
                  onShare={() => console.log("Share", trip.id)}
                />
              </motion.div>
            ))}
            
            {/* Create New Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + trips.length * 0.1 }}
            >
              <Link to="/create-trip">
                <div className="h-full min-h-[320px] rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-card/50 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group hover:shadow-elegant">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-display font-semibold text-foreground">Plan New Trip</p>
                    <p className="text-sm text-muted-foreground">Start your next adventure</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyTrips;
