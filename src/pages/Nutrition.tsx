import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Utensils, 
  Target, 
  TrendingUp, 
  Clock, 
  Zap,
  Heart,
  Scale,
  Calculator,
  Apple,
  Beef,
  Wheat,
  Droplets
} from "lucide-react";
import Navigation from "@/components/Navigation";

const Nutrition = () => {
  const mealPlans = [
    {
      id: 1,
      name: "Weight Loss",
      description: "Calorie-controlled meals designed to create a sustainable deficit while maintaining muscle mass.",
      calories: "1,500-1,800",
      protein: "120-140g",
      image: "🥗",
      features: ["High protein", "Low calorie", "Nutrient dense", "Metabolism boosting"]
    },
    {
      id: 2,
      name: "Muscle Building",
      description: "High-protein, calorie-surplus nutrition plan to support muscle growth and recovery.",
      calories: "2,500-3,000",
      protein: "150-200g",
      image: "🥩",
      features: ["High protein", "Calorie surplus", "Post-workout meals", "Muscle recovery"]
    },
    {
      id: 3,
      name: "Athletic Performance",
      description: "Balanced macronutrients timed around training for optimal performance and recovery.",
      calories: "2,200-2,800",
      protein: "130-170g",
      image: "⚡",
      features: ["Pre-workout fuel", "Recovery nutrition", "Energy optimization", "Hydration focus"]
    },
    {
      id: 4,
      name: "Maintenance",
      description: "Balanced nutrition to maintain current weight while supporting overall health.",
      calories: "2,000-2,400",
      protein: "100-120g",
      image: "⚖️",
      features: ["Balanced macros", "Flexible approach", "Sustainable habits", "Health focused"]
    }
  ];

  const sampleMeals = {
    breakfast: [
      { name: "Protein Power Bowl", calories: 420, protein: 28, image: "🍳" },
      { name: "Greek Yogurt Parfait", calories: 340, protein: 24, image: "🥣" },
      { name: "Oatmeal with Berries", calories: 380, protein: 18, image: "🥣" }
    ],
    lunch: [
      { name: "Chicken & Quinoa Salad", calories: 520, protein: 35, image: "🥙" },
      { name: "Salmon Rice Bowl", calories: 580, protein: 40, image: "🍱" },
      { name: "Turkey & Avocado Wrap", calories: 480, protein: 32, image: "🌯" }
    ],
    dinner: [
      { name: "Lean Beef Stir-fry", calories: 620, protein: 45, image: "🥘" },
      { name: "Grilled Chicken & Veggies", calories: 540, protein: 42, image: "🍗" },
      { name: "Fish & Sweet Potato", calories: 590, protein: 38, image: "🐟" }
    ]
  };

  const nutritionTips = [
    {
      title: "Hydration is Key",
      description: "Drink at least 8-10 glasses of water daily for optimal performance.",
      icon: <Droplets className="h-6 w-6 text-blue-400" />
    },
    {
      title: "Protein Timing",
      description: "Consume protein within 30 minutes post-workout for maximum muscle recovery.",
      icon: <Clock className="h-6 w-6 text-green-400" />
    },
    {
      title: "Balanced Macros",
      description: "Aim for 40% carbs, 30% protein, and 30% healthy fats for optimal results.",
      icon: <Target className="h-6 w-6 text-yellow-400" />
    },
    {
      title: "Meal Prep Success",
      description: "Prepare meals in advance to stay consistent with your nutrition goals.",
      icon: <Utensils className="h-6 w-6 text-purple-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Nutrition Plans
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Fuel your fitness journey with personalized nutrition plans designed by certified nutritionists. 
            Every meal is crafted to support your specific goals.
          </p>
        </div>

        {/* Nutrition Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-card border-border text-center">
            <CardContent className="pt-6">
              <Apple className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">500+</p>
              <p className="text-sm text-muted-foreground">Healthy Recipes</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border text-center">
            <CardContent className="pt-6">
              <Calculator className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">24/7</p>
              <p className="text-sm text-muted-foreground">Macro Tracking</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border text-center">
            <CardContent className="pt-6">
              <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">98%</p>
              <p className="text-sm text-muted-foreground">Health Improvement</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">4</p>
              <p className="text-sm text-muted-foreground">Custom Plans</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="plans" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plans">Meal Plans</TabsTrigger>
            <TabsTrigger value="meals">Sample Meals</TabsTrigger>
            <TabsTrigger value="tips">Nutrition Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mealPlans.map((plan) => (
                <Card key={plan.id} className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-4xl">{plan.image}</span>
                      <Badge className="bg-primary/20 text-primary border-0">
                        {plan.calories} kcal
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-foreground">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {plan.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <p className="text-muted-foreground">Daily Calories</p>
                        <p className="font-semibold text-foreground">{plan.calories}</p>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <p className="text-muted-foreground">Daily Protein</p>
                        <p className="font-semibold text-foreground">{plan.protein}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Plan Features:</p>
                      <ul className="space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-center">
                            <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 space-y-2">
                      <Button className="w-full" variant="default">
                        Start This Plan
                      </Button>
                      <Button className="w-full" variant="outline">
                        View Sample Menu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="meals">
            <div className="space-y-8">
              {Object.entries(sampleMeals).map(([mealType, meals]) => (
                <div key={mealType}>
                  <h3 className="text-2xl font-bold text-foreground mb-4 capitalize">
                    {mealType}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {meals.map((meal, index) => (
                      <Card key={index} className="bg-gradient-card border-border">
                        <CardContent className="pt-6">
                          <div className="text-center space-y-2">
                            <span className="text-3xl">{meal.image}</span>
                            <h4 className="font-semibold text-foreground">{meal.name}</h4>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{meal.calories} cal</span>
                              <span className="text-primary">{meal.protein}g protein</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tips">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {nutritionTips.map((tip, index) => (
                <Card key={index} className="bg-gradient-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-secondary/20 rounded-lg">
                        {tip.icon}
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-primary border-0 text-primary-foreground">
            <CardContent className="py-12">
              <Utensils className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Get Your Custom Nutrition Plan</h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Work with our certified nutritionists to create a personalized meal plan that fits your lifestyle and goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Get Nutrition Consultation
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-white/20 text-white hover:bg-white/10">
                  Download Meal Planner
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;