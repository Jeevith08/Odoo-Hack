import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Image, MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tripData, setTripData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleNext = () => {
    if (step === 1 && !tripData.name) {
      toast({
        title: "Trip name required",
        description: "Please enter a name for your trip",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && (!tripData.startDate || !tripData.endDate)) {
      toast({
        title: "Dates required",
        description: "Please select start and end dates",
        variant: "destructive",
      });
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Create trip and navigate
      toast({
        title: "Trip created!",
        description: "Your trip has been created. Start adding destinations!",
      });
      navigate("/trip/new");
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-teal-light to-background flex items-center justify-center py-12">
        <div className="container max-w-2xl mx-auto px-4">
          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center ${s < 3 ? "gap-2" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                    s === step
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : s < step
                      ? "bg-primary/80 text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 rounded ${
                      s < step ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </motion.div>

          {/* Form Card */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl p-8 shadow-elegant border border-border"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                    Name Your Adventure
                  </h1>
                  <p className="text-muted-foreground">
                    Give your trip a memorable name and description
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-foreground">Trip Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Summer in Europe"
                      value={tripData.name}
                      onChange={(e) => setTripData({ ...tripData, name: e.target.value })}
                      className="mt-2 h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-foreground">Description (optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="What's this trip about?"
                      value={tripData.description}
                      onChange={(e) => setTripData({ ...tripData, description: e.target.value })}
                      className="mt-2 min-h-24"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-accent" />
                  </div>
                  <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                    When Are You Traveling?
                  </h1>
                  <p className="text-muted-foreground">
                    Select your travel dates
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="text-foreground">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={tripData.startDate}
                      onChange={(e) => setTripData({ ...tripData, startDate: e.target.value })}
                      className="mt-2 h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-foreground">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={tripData.endDate}
                      onChange={(e) => setTripData({ ...tripData, endDate: e.target.value })}
                      className="mt-2 h-12"
                    />
                  </div>
                </div>

                {tripData.startDate && tripData.endDate && (
                  <div className="text-center p-4 bg-secondary rounded-xl">
                    <p className="text-muted-foreground">Trip Duration</p>
                    <p className="font-display text-2xl font-bold text-foreground">
                      {Math.ceil((new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
                    <Image className="w-8 h-8 text-gold" />
                  </div>
                  <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                    Ready to Plan!
                  </h1>
                  <p className="text-muted-foreground">
                    Your trip is set up. Let's add destinations and activities!
                  </p>
                </div>

                <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trip Name</span>
                    <span className="font-medium text-foreground">{tripData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dates</span>
                    <span className="font-medium text-foreground">
                      {new Date(tripData.startDate).toLocaleDateString()} - {new Date(tripData.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  {tripData.description && (
                    <div>
                      <span className="text-muted-foreground block mb-1">Description</span>
                      <span className="text-foreground">{tripData.description}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button variant="hero" onClick={handleNext} className="gap-2">
                {step === 3 ? "Create Trip" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTrip;
