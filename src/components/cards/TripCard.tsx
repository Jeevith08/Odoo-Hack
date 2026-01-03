import { motion } from "framer-motion";
import { Calendar, MapPin, DollarSign, MoreVertical, Edit, Trash2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface TripCardProps {
  id: string;
  name: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  destinations: string[];
  budget: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  className?: string;
}

export function TripCard({
  id,
  name,
  coverImage,
  startDate,
  endDate,
  destinations,
  budget,
  onEdit,
  onDelete,
  onShare,
  className,
}: TripCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card shadow-elegant hover:shadow-deep transition-all duration-300",
        className
      )}
    >
      {/* Cover Image */}
      <Link to={`/trip/${id}`} className="block relative h-40 overflow-hidden">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-overlay opacity-40" />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium">
          Upcoming
        </div>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        <Link to={`/trip/${id}`}>
          <h3 className="font-display text-lg font-semibold text-foreground hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        {/* Dates */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
        </div>

        {/* Destinations */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-accent" />
          <span className="truncate">
            {destinations.join(" → ")}
          </span>
        </div>

        {/* Budget */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-gold" />
            <span className="font-medium text-foreground">${budget.toLocaleString()}</span>
            <span className="text-muted-foreground">estimated</span>
          </div>
          <Link to={`/trip/${id}`}>
            <Button size="sm" variant="ghost" className="text-primary hover:text-primary">
              View →
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
