import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dumbbell, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                POWERHOUSE
              </span>
            </div>
            <p className="text-muted-foreground">
              Where champions are forged and limits are shattered. Join the fitness revolution today.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Programs", "Nutrition", "Shop", "About Us", "Contact"].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(" ", "-")}`} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Programs</h3>
            <ul className="space-y-2">
              {["Weight Loss", "Strength Training", "Cardio Fitness", "Personal Training", "Group Classes"].map((item) => (
                <li key={item}>
                  <Link 
                    to="/programs" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">123 Fitness Street, Gym City, GC 12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">(555) 123-POWER</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">info@powerhousegym.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2024 Powerhouse Fitness. All rights reserved. | 
            <Link to="/privacy" className="hover:text-primary ml-1">Privacy Policy</Link> | 
            <Link to="/terms" className="hover:text-primary ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;