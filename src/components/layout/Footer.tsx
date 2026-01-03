import { Link } from "react-router-dom";
import { Globe, Instagram, Twitter, Facebook, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold">GlobeTrotter</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Plan your perfect journey with personalized itineraries, budget tracking, and destination insights.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/explore" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Popular Destinations</Link></li>
              <li><Link to="/explore" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Activities</Link></li>
              <li><Link to="/explore" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Travel Guides</Link></li>
            </ul>
          </div>

          {/* Plan */}
          <div>
            <h4 className="font-display font-semibold mb-4">Plan</h4>
            <ul className="space-y-2">
              <li><Link to="/create-trip" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Create Trip</Link></li>
              <li><Link to="/trips" className="text-muted-foreground hover:text-foreground text-sm transition-colors">My Trips</Link></li>
              <li><Link to="/budget" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Budget Planner</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 GlobeTrotter. All rights reserved. Made with wanderlust.</p>
        </div>
      </div>
    </footer>
  );
}
