import { motion } from "framer-motion";
import { Clock, DollarSign, Star, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  name: string;
  description: string;
  image: string;
  duration: string;
  price: number;
  rating: number;
  category: string;
  isAdded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function ActivityCard({
  name,
  description,
  image,
  duration,
  price,
  rating,
  category,
  isAdded = false,
  onToggle,
  className,
}: ActivityCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-300",
        isAdded && "border-primary/50 bg-teal-light",
        className
      )}
    >
      {/* Image */}
      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1 left-1 px-2 py-0.5 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-foreground truncate">{name}</h4>
          <div className="flex items-center gap-1 text-sm text-gold">
            <Star className="w-3.5 h-3.5 fill-current" />
            {rating}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {duration}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {price === 0 ? "Free" : `$${price}`}
            </span>
          </div>
          
          <Button
            size="sm"
            variant={isAdded ? "default" : "teal"}
            onClick={onToggle}
            className="gap-1"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
