import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Clock, 
  Users, 
  Zap, 
  Dumbbell,
  TrendingUp,
  Calendar,
  PlayCircle
} from "lucide-react";
import Navigation from "@/components/Navigation";

const Programs = () => {
  const programs = [
    {
      id: 1,
      name: "Strength Building",
      description: "Build lean muscle mass and increase overall strength with progressive overload training.",
      duration: "12 weeks",
      level: "Intermediate",
      sessions: 20,
      image: "💪",
      features: ["Progressive overload", "Compound movements", "Strength tracking", "Personal trainer support"]
    },
    {
      id: 2,
      name: "Weight Loss Challenge",
      description: "High-intensity training combined with cardio to burn fat and improve cardiovascular health.",
      duration: "8 weeks",
      level: "Beginner",
      sessions: 16,
      image: "🔥",
      features: ["HIIT workouts", "Cardio circuits", "Nutrition guidance", "Weekly weigh-ins"]
    },
    {
      id: 3,
      name: "Athletic Performance",
      description: "Sport-specific training to enhance athletic performance and explosive power.",
      duration: "16 weeks",
      level: "Advanced",
      sessions: 32,
      image: "⚡",
      features: ["Plyometric training", "Speed drills", "Agility work", "Performance testing"]
    },
    {
      id: 4,
      name: "Bodybuilding Prep",
      description: "Intensive muscle building program with focus on symmetry and definition.",
      duration: "20 weeks",
      level: "Advanced",
      sessions: 40,
      image: "🏆",
      features: ["Muscle isolation", "Cutting protocols", "Posing practice", "Contest prep"]
    },
    {
      id: 5,
      name: "Functional Fitness",
      description: "Real-world movement patterns to improve daily life activities and prevent injury.",
      duration: "10 weeks",
      level: "Beginner",
      sessions: 20,
      image: "🤸",
      features: ["Movement patterns", "Core stability", "Flexibility work", "Injury prevention"]
    },
    {
      id: 6,
      name: "CrossFit Training",
      description: "Varied functional movements performed at high intensity for complete fitness.",
      duration: "12 weeks",
      level: "Intermediate",
      sessions: 24,
      image: "🥇",
      features: ["WODs", "Olympic lifts", "Metabolic conditioning", "Community support"]
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500/20 text-green-400";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-400";
      case "Advanced": return "bg-red-500/20 text-red-400";
      default: return "bg-primary/20 text-primary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Fitness Programs
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your body with our scientifically-designed programs. 
            Each program is crafted by certified trainers to help you reach your specific goals.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-card border-border text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">2,500+</p>
              <p className="text-sm text-muted-foreground">Active Members</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border text-center">
            <CardContent className="pt-6">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">95%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Program Types</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border text-center">
            <CardContent className="pt-6">
              <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">24/7</p>
              <p className="text-sm text-muted-foreground">Gym Access</p>
            </CardContent>
          </Card>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Card key={program.id} className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">{program.image}</span>
                  <Badge className={`${getLevelColor(program.level)} border-0`}>
                    {program.level}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-foreground">{program.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {program.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{program.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{program.sessions} sessions</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Program Features:</p>
                  <ul className="space-y-1">
                    {program.features.map((feature, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-center">
                        <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 space-y-2">
                  <Button asChild variant="default" className="w-full">
                  <Link to="/signup" className="flex items-center">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Program
                  </Link>
                </Button>
                  <Button className="w-full" asChild variant="outline">
                    <Link to="/login" className="flex items-center">
                    Learn More
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-primary border-0 text-primary-foreground">
            <CardContent className="py-12">
              <Dumbbell className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of members who have transformed their lives with our proven programs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  
                  <Link to="/dashboard">
                  Get Started Today
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-white/20 text-white hover:bg-white/10">
                 <Link to="/dashboard">
                  Schedule Consultation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Programs;