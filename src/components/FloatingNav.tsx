import { motion } from "framer-motion";
import { Home, Map, PlusCircle, Calendar, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Map, label: "Trips", path: "/trips" },
  { icon: PlusCircle, label: "Create", path: "/create-trip" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function FloatingNav() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5, type: "spring", stiffness: 100 }}
      className="floating-nav"
    >
      <div className="flex items-center gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
