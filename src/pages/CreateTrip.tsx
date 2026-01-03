import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Upload, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FloatingNav } from "@/components/FloatingNav";
import { useToast } from "@/hooks/use-toast";

export default function CreateTrip() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    coverImage: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Trip created!",
      description: "Your new adventure awaits.",
    });

    setIsLoading(false);
    navigate("/trips");
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
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-heading font-bold">Create New Trip</h1>
              <p className="text-sm text-muted-foreground">Plan your next adventure</p>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Trip Details</CardTitle>
                  <CardDescription>Fill in the details to start planning</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Trip Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trip Name</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g., European Adventure"
                      className="pl-11"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="date"
                        className="pl-11"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="date"
                        className="pl-11"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <Textarea
                    placeholder="Describe your trip goals, must-see places, or travel style..."
                    className="min-h-[100px] resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover Image (Optional)</label>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop an image, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </motion.div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Link to="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="hero"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                      />
                    ) : (
                      "Create Trip"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <FloatingNav />
    </div>
  );
}
