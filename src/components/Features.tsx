import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Users, Clock, Target, Heart, Trophy } from "lucide-react";
import gymFacilities from "@/assets/gym-facilities.jpg";

const Features = () => {
  const features = [
    {
      icon: Dumbbell,
      title: "State-of-the-Art Equipment",
      description: "Latest fitness technology and premium equipment for all your training needs."
    },
    {
      icon: Users,
      title: "Expert Personal Training",
      description: "Certified trainers dedicated to helping you achieve your fitness goals."
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Train on your schedule with round-the-clock gym access for members."
    },
    {
      icon: Target,
      title: "Customized Programs",
      description: "Tailored workout plans designed specifically for your fitness level and goals."
    },
    {
      icon: Heart,
      title: "Nutrition Guidance",
      description: "Professional meal planning and nutrition coaching for optimal results."
    },
    {
      icon: Trophy,
      title: "Results Guaranteed",
      description: "Proven track record of helping members achieve their transformation goals."
    }
  ];

  return (
    <section id="features" className="py-20 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              World-Class
            </span>
            <span className="text-foreground"> Facilities</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the ultimate fitness destination with premium amenities and cutting-edge technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-foreground">
              Everything You Need to Succeed
            </h3>
            <p className="text-lg text-muted-foreground">
              From beginner-friendly spaces to professional-grade equipment, 
              Powerhouse provides the perfect environment for every fitness journey.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <feature.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <img
              src={gymFacilities}
              alt="Gym Facilities"
              className="rounded-lg shadow-card"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;