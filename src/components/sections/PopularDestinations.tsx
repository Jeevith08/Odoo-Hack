import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CityCard } from "@/components/cards/CityCard";

import parisImage from "@/assets/city-paris.jpg";
import tokyoImage from "@/assets/city-tokyo.jpg";
import santoriniImage from "@/assets/city-santorini.jpg";
import newyorkImage from "@/assets/city-newyork.jpg";

const popularCities = [
  {
    name: "Paris",
    country: "France",
    image: parisImage,
    costIndex: "high" as const,
    rating: 4.8,
  },
  {
    name: "Tokyo",
    country: "Japan",
    image: tokyoImage,
    costIndex: "medium" as const,
    rating: 4.9,
  },
  {
    name: "Santorini",
    country: "Greece",
    image: santoriniImage,
    costIndex: "high" as const,
    rating: 4.7,
  },
  {
    name: "New York",
    country: "USA",
    image: newyorkImage,
    costIndex: "high" as const,
    rating: 4.6,
  },
];

export function PopularDestinations() {
  return (
    <section className="py-20 bg-secondary/50">
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
              Popular Destinations
            </h2>
            <p className="text-muted-foreground">
              Discover the world's most beloved cities and hidden gems
            </p>
          </div>
          <Link to="/explore" className="hidden md:block">
            <Button variant="ghost" className="gap-2 text-primary">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <CityCard
                {...city}
                onAddToTrip={() => console.log(`Added ${city.name}`)}
              />
            </motion.div>
          ))}
        </div>

        <Link to="/explore" className="block md:hidden mt-8">
          <Button variant="outline" className="w-full gap-2">
            View All Destinations
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
