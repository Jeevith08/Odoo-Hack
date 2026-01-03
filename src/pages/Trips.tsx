import { motion } from "framer-motion";
import { Plus, Calendar, MapPin, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingNav } from "@/components/FloatingNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const trips = [];

export default function Trips() {
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
              <h1 className="text-2xl font-heading font-bold">My Trips</h1>
              <p className="text-muted-foreground">Manage all your adventures</p>
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

      <main className="container mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8"
        >
          {["All", "Upcoming", "Completed", "Draft"].map((tab, index) => (
            <Button
              key={tab}
              variant={index === 0 ? "default" : "ghost"}
              size="sm"
              className="rounded-full"
            >
              {tab}
            </Button>
          ))}
        </motion.div>

        {/* Trips Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
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

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${trip.status === "upcoming"
                          ? "bg-primary/80 text-primary-foreground"
                          : "bg-muted/80 text-muted-foreground"
                        }`}
                    >
                      {trip.status === "upcoming" ? "Upcoming" : "Completed"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="bg-card/30 backdrop-blur-sm hover:bg-card/50">
                          <MoreVertical className="w-4 h-4 text-card" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="absolute bottom-4 left-4 text-card">
                    <h3 className="text-lg font-heading font-semibold">{trip.name}</h3>
                    <div className="flex items-center gap-1 text-sm opacity-90">
                      <MapPin className="w-3 h-3" />
                      {trip.cities} cities
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">{trip.destination}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {trip.startDate}
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
      </main>

      <FloatingNav />
    </div>
  );
}
