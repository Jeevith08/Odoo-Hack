import { motion } from "framer-motion";
import { User, Mail, Globe, Bell, Shield, LogOut, ChevronRight, Camera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingNav } from "@/components/FloatingNav";
import { useToast } from "@/hooks/use-toast";

const settingsGroups = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile", path: "/profile/edit" },
      { icon: Mail, label: "Email Preferences", path: "/profile/email" },
      { icon: Globe, label: "Language", value: "English", path: "/profile/language" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", path: "/profile/notifications" },
      { icon: Shield, label: "Privacy & Security", path: "/profile/security" },
    ],
  },
];

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
    navigate("/");
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
          <h1 className="text-2xl font-heading font-bold">Profile</h1>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8 max-w-2xl space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass" className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary via-secondary to-accent" />
            <CardContent className="-mt-12 pb-6">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-24 h-24 rounded-2xl bg-card border-4 border-card overflow-hidden shadow-elevated"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-glow">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 pb-2">
                  <h2 className="text-xl font-heading font-bold">Alex Thompson</h2>
                  <p className="text-muted-foreground">alex@example.com</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                {[
                  { label: "Trips", value: "12" },
                  { label: "Countries", value: "8" },
                  { label: "Photos", value: "324" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-heading font-bold gradient-text">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings */}
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + groupIndex * 0.1 }}
          >
            <Card variant="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {group.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      {item.value && (
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Logout */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            className="w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <p className="text-center text-sm text-muted-foreground">
            Want to delete your account?{" "}
            <button className="text-destructive hover:underline">Contact Support</button>
          </p>
        </motion.div>
      </main>

      <FloatingNav />
    </div>
  );
}
