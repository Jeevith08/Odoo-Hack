import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, MapPin, DollarSign, Plus, GripVertical, 
  Trash2, Clock, Share2, Download, ChevronDown, ChevronUp 
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "@/components/cards/ActivityCard";

import parisImage from "@/assets/city-paris.jpg";
import tokyoImage from "@/assets/city-tokyo.jpg";

interface Stop {
  id: string;
  city: string;
  country: string;
  image: string;
  startDate: string;
  endDate: string;
  activities: Activity[];
}

interface Activity {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: string;
  price: number;
  rating: number;
  category: string;
}

const mockStops: Stop[] = [
  {
    id: "1",
    city: "Paris",
    country: "France",
    image: parisImage,
    startDate: "2025-03-15",
    endDate: "2025-03-20",
    activities: [
      {
        id: "a1",
        name: "Eiffel Tower Visit",
        description: "Iconic landmark with stunning city views",
        image: parisImage,
        duration: "3 hours",
        price: 35,
        rating: 4.8,
        category: "Landmark",
      },
      {
        id: "a2",
        name: "Louvre Museum",
        description: "World's largest art museum",
        image: parisImage,
        duration: "4 hours",
        price: 20,
        rating: 4.9,
        category: "Museum",
      },
    ],
  },
  {
    id: "2",
    city: "Tokyo",
    country: "Japan",
    image: tokyoImage,
    startDate: "2025-03-21",
    endDate: "2025-03-28",
    activities: [
      {
        id: "a3",
        name: "Senso-ji Temple",
        description: "Ancient Buddhist temple in Asakusa",
        image: tokyoImage,
        duration: "2 hours",
        price: 0,
        rating: 4.7,
        category: "Temple",
      },
    ],
  },
];

const TripDetail = () => {
  const { id } = useParams();
  const [stops, setStops] = useState<Stop[]>(mockStops);
  const [expandedStop, setExpandedStop] = useState<string | null>("1");

  const totalBudget = stops.reduce((sum, stop) => {
    return sum + stop.activities.reduce((actSum, act) => actSum + act.price, 0);
  }, 0);

  const totalDays = stops.reduce((sum, stop) => {
    const start = new Date(stop.startDate);
    const end = new Date(stop.endDate);
    return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }, 0);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="relative h-64 md:h-80">
          <img
            src={parisImage}
            alt="Trip cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                  European Adventure
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Mar 15 - Mar 28, 2025
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {stops.length} stops
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {totalDays} days
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Itinerary */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-foreground">Itinerary</h2>
                <Button variant="teal" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Stop
                </Button>
              </div>

              {stops.map((stop, index) => (
                <motion.div
                  key={stop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden"
                >
                  {/* Stop Header */}
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                    onClick={() => setExpandedStop(expandedStop === stop.id ? null : stop.id)}
                  >
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                    <img
                      src={stop.image}
                      alt={stop.city}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-foreground">
                        {stop.city}, {stop.country}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(stop.startDate).toLocaleDateString()} - {new Date(stop.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {stop.activities.length} activities
                      </span>
                      {expandedStop === stop.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedStop === stop.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border p-4 space-y-4"
                    >
                      {stop.activities.map((activity) => (
                        <ActivityCard
                          key={activity.id}
                          {...activity}
                          isAdded={true}
                          onToggle={() => console.log("Toggle", activity.id)}
                        />
                      ))}
                      <Button variant="outline" className="w-full gap-2">
                        <Plus className="w-4 h-4" />
                        Add Activity
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Budget Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Budget Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Activities</span>
                    <span className="font-medium text-foreground">${totalBudget}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Accommodation</span>
                    <span className="font-medium text-foreground">$1,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Transport</span>
                    <span className="font-medium text-foreground">$450</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-display text-2xl font-bold text-primary">
                      ${totalBudget + 1200 + 450}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 space-y-3"
              >
                <Button variant="hero" className="w-full gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Trip
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Export PDF
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TripDetail;
