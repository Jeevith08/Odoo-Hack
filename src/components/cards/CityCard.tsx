import { motion } from "framer-motion";
import { MapPin, Heart, Plus, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CityCardProps {
  name: string;
  country: string;
  image: string;
  costIndex: "low" | "medium" | "high";
  rating?: number;
  onAddToTrip?: () => void;
  className?: string;
}

const costLabels = {
  low: { label: "$", color: "text-forest" },
  medium: { label: "$$", color: "text-sunset" },
  high: { label: "$$$", color: "text-accent" },
};

export function CityCard({
  name,
  country,
  image,
  costIndex,
  rating = 4.5,
  onAddToTrip,
  className,
}: CityCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card shadow-elegant hover:shadow-deep transition-shadow duration-300",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-overlay opacity-60" />
        
        {/* Favorite Button */}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card">
          <Heart className="w-4 h-4 text-accent" />
        </button>

        {/* Location Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-primary-foreground text-sm font-medium">
          <MapPin className="w-4 h-4" />
          {country}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {name}
          </h3>
          <span className={cn("text-sm font-medium", costLabels[costIndex].color)}>
            {costLabels[costIndex].label}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>
              {costIndex === "low" ? "Budget-friendly" : costIndex === "medium" ? "Moderate" : "Premium"}
            </span>
          </div>
          
          <Button
            size="sm"
            variant="teal"
            onClick={onAddToTrip}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
