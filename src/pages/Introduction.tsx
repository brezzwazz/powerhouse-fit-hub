import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://powerhousekrd.pythonanywhere.com';

const FITNESS_GOALS = [
  { value: 'WL', label: 'Weight Loss' },
  { value: 'MG', label: 'Muscle Gain' },
  { value: 'ES', label: 'Endurance & Stamina' },
  { value: 'GF', label: 'General Fitness' },
  { value: 'BB', label: 'Body Building' },
  { value: 'FB', label: 'Functional Training' },
];

const EXPERIENCE_LEVELS = [
  { value: 'BE', label: 'Beginner (0-6 months)' },
  { value: 'IM', label: 'Intermediate (6-24 months)' },
  { value: 'AD', label: 'Advanced (2+ years)' },
];

const Introduction = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    date_of_birth: '',
    gender: '',
    height: '',
    weight: '',
    fitness_goal: '',
    experience_level: '',
    injuries: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle authentication state
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // If not authenticated, redirect to signup instead of login
      navigate('/signup');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
      };

      await axios.post(`${API_BASE_URL}/api/newclient/`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || 'Failed to save client information');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-gradient-card border border-border rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-foreground mb-6">
            Welcome to Powerhouse Gym!
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Help us create your personalized fitness journey
          </p>
          
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 text-red-500 rounded-md text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-foreground">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  placeholder="175"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  min="100"
                  max="250"
                  className="bg-muted/50 border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-foreground">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  placeholder="75"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="30"
                  max="300"
                  className="bg-muted/50 border-border"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="text-foreground">
                  Date of Birth
                </Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                  className="bg-muted/50 border-border"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground">
                  Gender
                </Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('gender', value)} 
                  required
                >
                  <SelectTrigger className="bg-muted/50 border-border">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                    <SelectItem value="O">Other</SelectItem>
                    <SelectItem value="P">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fitness_goal" className="text-foreground">
                  Primary Goal
                </Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('fitness_goal', value)} 
                  required
                >
                  <SelectTrigger className="bg-muted/50 border-border">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {FITNESS_GOALS.map(goal => (
                      <SelectItem key={goal.value} value={goal.value}>
                        {goal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience_level" className="text-foreground">
                  Experience Level
                </Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('experience_level', value)} 
                  required
                >
                  <SelectTrigger className="bg-muted/50 border-border">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="injuries" className="text-foreground">
                Injuries or Health Concerns
              </Label>
              <Textarea
                id="injuries"
                name="injuries"
                placeholder="List any injuries, health issues, or limitations..."
                value={formData.injuries}
                onChange={handleChange}
                className="bg-muted/50 border-border min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">
                This helps us create a safe training program for you
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-foreground">
                Fitness Goals & Preferences
              </Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Describe your fitness goals, preferences, and what you hope to achieve..."
                value={formData.bio}
                onChange={handleChange}
                className="bg-muted/50 border-border min-h-[100px]"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Your Profile...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Introduction;