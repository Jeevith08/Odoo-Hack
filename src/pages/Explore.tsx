import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, SlidersHorizontal } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { CityCard } from "@/components/cards/CityCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import parisImage from "@/assets/city-paris.jpg";
import tokyoImage from "@/assets/city-tokyo.jpg";
import santoriniImage from "@/assets/city-santorini.jpg";
import newyorkImage from "@/assets/city-newyork.jpg";

const allCities = [
  { name: "Paris", country: "France", image: parisImage, costIndex: "high" as const, region: "Europe" },
  { name: "Tokyo", country: "Japan", image: tokyoImage, costIndex: "medium" as const, region: "Asia" },
  { name: "Santorini", country: "Greece", image: santoriniImage, costIndex: "high" as const, region: "Europe" },
  { name: "New York", country: "USA", image: newyorkImage, costIndex: "high" as const, region: "North America" },
  { name: "Kyoto", country: "Japan", image: tokyoImage, costIndex: "medium" as const, region: "Asia" },
  { name: "Rome", country: "Italy", image: parisImage, costIndex: "medium" as const, region: "Europe" },
  { name: "Bali", country: "Indonesia", image: santoriniImage, costIndex: "low" as const, region: "Asia" },
  { name: "London", country: "UK", image: newyorkImage, costIndex: "high" as const, region: "Europe" },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [costFilter, setCostFilter] = useState("all");

  const filteredCities = allCities.filter((city) => {
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = regionFilter === "all" || city.region === regionFilter;
    const matchesCost = costFilter === "all" || city.costIndex === costFilter;
    return matchesSearch && matchesRegion && matchesCost;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Explore Destinations
              </h1>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Discover amazing cities around the world and add them to your trip
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search cities, countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-card border-0 shadow-elegant"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters & Content */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Filters:</span>
              </div>
              
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia">Asia</SelectItem>
                  <SelectItem value="North America">North America</SelectItem>
                </SelectContent>
              </Select>

              <Select value={costFilter} onValueChange={setCostFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Budget</SelectItem>
                  <SelectItem value="low">Budget-Friendly</SelectItem>
                  <SelectItem value="medium">Moderate</SelectItem>
                  <SelectItem value="high">Premium</SelectItem>
                </SelectContent>
              </Select>

              {(regionFilter !== "all" || costFilter !== "all" || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setRegionFilter("all");
                    setCostFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>

            {/* Results */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{filteredCities.length}</span> destinations found
              </p>
            </div>

            {/* Cities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCities.map((city, index) => (
                <motion.div
                  key={`${city.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <CityCard
                    {...city}
                    onAddToTrip={() => console.log(`Added ${city.name}`)}
                  />
                </motion.div>
              ))}
            </div>

            {filteredCities.length === 0 && (
              <div className="text-center py-16">
                <MapPin className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">No destinations found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Explore;
