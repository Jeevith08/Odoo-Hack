import { motion } from "framer-motion";
import { DollarSign, TrendingUp, PieChart, Calendar } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const budgetData = {
  total: 10500,
  spent: 3200,
  categories: [
    { name: "Accommodation", amount: 4500, color: "bg-primary" },
    { name: "Activities", amount: 2100, color: "bg-accent" },
    { name: "Transport", amount: 1800, color: "bg-ocean" },
    { name: "Food", amount: 1500, color: "bg-gold" },
    { name: "Misc", amount: 600, color: "bg-forest" },
  ],
  trips: [
    { name: "European Adventure", budget: 3500, spent: 1200 },
    { name: "Japan Discovery", budget: 4200, spent: 800 },
    { name: "Greek Islands", budget: 2800, spent: 1200 },
  ],
};

const Budget = () => {
  const percentSpent = (budgetData.spent / budgetData.total) * 100;

  return (
    <Layout>
      <div className="min-h-screen bg-background py-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              Budget Tracker
            </h1>
            <p className="text-muted-foreground">
              Track your travel expenses across all trips
            </p>
          </motion.div>

          {/* Overview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            <Card className="border-border bg-gradient-hero text-primary-foreground">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-primary-foreground/80">
                  Total Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold">
                    ${budgetData.total.toLocaleString()}
                  </span>
                </div>
                <p className="text-primary-foreground/70 text-sm mt-2">
                  Across {budgetData.trips.length} trips
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  Total Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold text-foreground">
                    ${budgetData.spent.toLocaleString()}
                  </span>
                  <span className="text-accent text-sm font-medium">
                    {percentSpent.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${percentSpent}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold text-primary">
                    ${(budgetData.total - budgetData.spent).toLocaleString()}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mt-2">
                  Available to spend
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display">
                    <PieChart className="w-5 h-5 text-primary" />
                    Budget by Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {budgetData.categories.map((category, index) => {
                    const percentage = (category.amount / budgetData.total) * 100;
                    return (
                      <div key={category.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground font-medium">{category.name}</span>
                          <span className="text-muted-foreground">
                            ${category.amount.toLocaleString()} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                            className={`h-full rounded-full ${category.color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Trip Budgets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-border h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display">
                    <Calendar className="w-5 h-5 text-accent" />
                    Budget by Trip
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {budgetData.trips.map((trip, index) => {
                    const percentage = (trip.spent / trip.budget) * 100;
                    return (
                      <div
                        key={trip.name}
                        className="p-4 rounded-xl bg-secondary/50 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-foreground">{trip.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              ${trip.spent.toLocaleString()} of ${trip.budget.toLocaleString()}
                            </p>
                          </div>
                          <span className={`text-sm font-medium ${
                            percentage > 80 ? "text-destructive" : percentage > 50 ? "text-sunset" : "text-primary"
                          }`}>
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                            className={`h-full rounded-full ${
                              percentage > 80 ? "bg-destructive" : percentage > 50 ? "bg-sunset" : "bg-primary"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Budget;
