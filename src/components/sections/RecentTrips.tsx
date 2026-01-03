import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TripCard } from "@/components/cards/TripCard";

import parisImage from "@/assets/city-paris.jpg";
import tokyoImage from "@/assets/city-tokyo.jpg";

// Mock data for demonstration
const recentTrips = [
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
];

interface RecentTripsProps {
  showAll?: boolean;
}

export function RecentTrips({ showAll = false }: RecentTripsProps) {
  const tripsToShow = showAll ? recentTrips : recentTrips.slice(0, 2);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Your Trips
            </h2>
            <p className="text-muted-foreground">
              Continue planning your upcoming adventures
            </p>
          </div>
          <Link to="/create-trip">
            <Button variant="hero" size="default" className="gap-2">
              <Plus className="w-4 h-4" />
              New Trip
            </Button>
          </Link>
        </motion.div>

        {tripsToShow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tripsToShow.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <TripCard
                  {...trip}
                  onEdit={() => console.log("Edit", trip.id)}
                  onDelete={() => console.log("Delete", trip.id)}
                  onShare={() => console.log("Share", trip.id)}
                />
              </motion.div>
            ))}
            
            {/* Create New Trip Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: tripsToShow.length * 0.1 }}
            >
              <Link to="/create-trip">
                <div className="h-full min-h-[280px] rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-card/50 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer group">
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
        ) : (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">No trips yet</h3>
            <p className="text-muted-foreground mb-6">Start planning your first adventure</p>
            <Link to="/create-trip">
              <Button variant="hero">Create Your First Trip</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
