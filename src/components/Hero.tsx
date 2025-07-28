import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";
import heroGym from "@/assets/hero-gym.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroGym}
          alt="Powerhouse Gym"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              UNLEASH YOUR
            </span>
            <br />
            <span className="text-foreground">INNER POWER</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your body, mind, and life at Powerhouse - where champions are forged and limits are shattered.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild variant="power" size="lg" className="text-lg px-8 py-3">
              <Link to="/dashboard">
                Join Powerhouse Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
              <Link to="#programs">
                <Play className="mr-2 h-5 w-5" />
                Watch Our Story
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-card/20 backdrop-blur-sm rounded-lg p-6 border border-border">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Active Members</div>
            </div>
            <div className="bg-card/20 backdrop-blur-sm rounded-lg p-6 border border-border">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Expert Trainers</div>
            </div>
            <div className="bg-card/20 backdrop-blur-sm rounded-lg p-6 border border-border">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Access Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;