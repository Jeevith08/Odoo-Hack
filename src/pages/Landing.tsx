import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Wallet, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlobeIcon } from "@/components/GlobeIcon";

const features = [
  {
    icon: MapPin,
    title: "Smart Itineraries",
    description: "AI-powered suggestions for your perfect trip",
  },
  {
    icon: Calendar,
    title: "Visual Planning",
    description: "Drag-and-drop timeline for easy organization",
  },
  {
    icon: Wallet,
    title: "Budget Tracking",
    description: "Keep track of expenses in real-time",
  },
  {
    icon: Sparkles,
    title: "Personalized",
    description: "Recommendations tailored to your style",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen hero-gradient overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-6"
      >
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Odoo Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-heading font-bold gradient-text">Odoo Hack</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth?signup=true">
              <Button variant="hero" size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-12 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Your journey starts here
              </motion.div>
              <h1 className="text-5xl lg:text-6xl font-heading font-bold leading-tight">
                Plan Your Perfect
                <span className="gradient-text block">Adventure</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Create stunning multi-city itineraries, track your budget, and share your travel plans with friends — all in one beautiful app.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/auth?signup=true">
                <Button variant="hero" size="xl" className="group">
                  Start Planning
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="glass" size="xl">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8 pt-4"
            >
              {[
                { value: "0", label: "Travelers" },
                { value: "0", label: "Countries" },
                { value: "0", label: "Trips Planned" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-heading font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Floating Globe */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-96 h-96 mx-auto"
              >
                <GlobeIcon className="w-full h-full" />
              </motion.div>

            </div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-32"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Everything You Need to
              <span className="gradient-text"> Travel Smart</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to make your travel planning effortless and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card p-6 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-muted-foreground text-sm"
          >
            Scroll to explore ↓
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
