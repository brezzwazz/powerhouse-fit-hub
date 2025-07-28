import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Calendar, 
  Target, 
  Utensils, 
  ShoppingCart, 
  Trophy, 
  Activity,
  Bell,
  Settings,
  LogOut
} from "lucide-react";
import Navigation from "@/components/Navigation";

const Dashboard = () => {
  const membershipData = {
    status: "Active",
    plan: "Premium",
    expiration: "March 15, 2025",
    daysLeft: 142
  };

  const currentProgram = {
    name: "Strength Building",
    progress: 65,
    sessionsCompleted: 13,
    totalSessions: 20,
    nextSession: "Tomorrow, 6:00 PM"
  };

  const mealPlan = {
    plan: "High Protein",
    todaysCalories: 1840,
    targetCalories: 2200,
    macros: {
      protein: { current: 120, target: 150 },
      carbs: { current: 180, target: 220 },
      fat: { current: 65, target: 80 }
    }
  };

  const featuredProducts = [
    { name: "Whey Protein", price: "$49.99", image: "🥤" },
    { name: "Creatine", price: "$29.99", image: "💊" },
    { name: "Gym Towel", price: "$19.99", image: "🧻" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, Alex!</h1>
            <p className="text-muted-foreground">Ready to crush your goals today?</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Membership Status */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Membership Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      {membershipData.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">{membershipData.plan} Plan</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Expires</p>
                    <p className="font-semibold text-foreground">{membershipData.expiration}</p>
                  </div>
                </div>
                <div className="bg-secondary/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {membershipData.daysLeft} days remaining
                  </p>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Current Program */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Current Program</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">{currentProgram.name}</h3>
                    <Badge variant="outline">{currentProgram.progress}% Complete</Badge>
                  </div>
                  
                  <Progress value={currentProgram.progress} className="h-3" />
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{currentProgram.sessionsCompleted}/{currentProgram.totalSessions} sessions</span>
                    <span>{currentProgram.progress}% complete</span>
                  </div>
                  
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm">Next session: {currentProgram.nextSession}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meal Plan */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Utensils className="h-5 w-5 text-primary" />
                  <span>Today's Nutrition</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">{mealPlan.plan} Plan</h3>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Calories</p>
                      <p className="font-semibold">{mealPlan.todaysCalories}/{mealPlan.targetCalories}</p>
                    </div>
                  </div>
                  
                  <Progress value={(mealPlan.todaysCalories / mealPlan.targetCalories) * 100} className="h-2" />
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-secondary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Protein</p>
                      <p className="font-semibold text-primary">{mealPlan.macros.protein.current}g</p>
                      <p className="text-xs text-muted-foreground">of {mealPlan.macros.protein.target}g</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Carbs</p>
                      <p className="font-semibold text-accent">{mealPlan.macros.carbs.current}g</p>
                      <p className="text-xs text-muted-foreground">of {mealPlan.macros.carbs.target}g</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Fat</p>
                      <p className="font-semibold text-destructive">{mealPlan.macros.fat.current}g</p>
                      <p className="text-xs text-muted-foreground">of {mealPlan.macros.fat.target}g</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Workouts This Week</span>
                  <span className="font-semibold text-foreground">4/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Streak</span>
                  <span className="font-semibold text-primary">12 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Weight Goal</span>
                  <span className="font-semibold text-accent">-8 lbs to go</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Personal Best!</p>
                    <p className="text-xs text-muted-foreground">Deadlifted 225 lbs</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Goal Reached</p>
                    <p className="text-xs text-muted-foreground">10K steps daily for 7 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shop Quick Access */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span>Featured Products</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{product.image}</span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{product.name}</p>
                        <p className="text-xs text-primary">{product.price}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Add</Button>
                  </div>
                ))}
                <Button variant="hero" className="w-full mt-4">
                  View All Products
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;