import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingNav } from "@/components/FloatingNav";

const events = [
  {
    id: 1,
    date: "2025-03-15",
    title: "Fly to Paris",
    time: "08:00 AM",
    type: "transport",
    color: "bg-primary",
  },
  {
    id: 2,
    date: "2025-03-15",
    title: "Hotel Check-in",
    time: "02:00 PM",
    type: "accommodation",
    color: "bg-secondary",
  },
  {
    id: 3,
    date: "2025-03-16",
    title: "Eiffel Tower Visit",
    time: "10:00 AM",
    type: "activity",
    color: "bg-accent",
  },
  {
    id: 4,
    date: "2025-03-16",
    title: "Louvre Museum",
    time: "02:00 PM",
    type: "activity",
    color: "bg-accent",
  },
  {
    id: 5,
    date: "2025-03-17",
    title: "Train to Rome",
    time: "09:00 AM",
    type: "transport",
    color: "bg-primary",
  },
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TripCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); // March 2025

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card/50 backdrop-blur-lg border-b border-border sticky top-0 z-40"
      >
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-heading font-bold">Trip Calendar</h1>
          <p className="text-muted-foreground">View your travel timeline</p>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Calendar Navigation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <CardTitle className="text-xl">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {days.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before the 1st */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getEventsForDay(day);
                  const isToday = day === 15 && currentDate.getMonth() === 2; // Demo: March 15

                  return (
                    <motion.div
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      className={`aspect-square p-1 rounded-xl cursor-pointer transition-colors ${
                        isToday
                          ? "bg-primary text-primary-foreground"
                          : dayEvents.length > 0
                          ? "bg-muted hover:bg-muted/80"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="text-center text-sm font-medium">{day}</div>
                      {dayEvents.length > 0 && (
                        <div className="flex justify-center gap-0.5 mt-1">
                          {dayEvents.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className={`w-1.5 h-1.5 rounded-full ${event.color}`}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-heading font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <Card variant="glass" className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-1 h-12 rounded-full ${event.color}`} />
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        event.type === "transport"
                          ? "bg-primary/20 text-primary"
                          : event.type === "accommodation"
                          ? "bg-secondary/20 text-secondary"
                          : "bg-accent/20 text-accent-foreground"
                      }`}
                    >
                      {event.type}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <FloatingNav />
    </div>
  );
}
