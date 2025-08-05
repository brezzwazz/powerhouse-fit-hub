import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://powerhousekrd.pythonanywhere.com';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.re_password) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { re_password, ...signupData } = formData;
      
      await axios.post(`${API_BASE_URL}/auth/users/`, formData);

      const loginResponse = await axios.post(`${API_BASE_URL}/auth/jwt/create/`, {
      email: formData.email,
      password: formData.password
  });
  
  // Save tokens
   localStorage.setItem('authToken', loginResponse.data.access);
   localStorage.setItem('refreshToken', loginResponse.data.refresh);
      
      
      navigate('/intro');
    } catch (err) {
      setLoading(false);
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.message || 'Invalid registration data');
        } else {
          setError('An error occurred. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-gradient-card border border-border rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-foreground mb-6">
            Create Account
          </h2>
          
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 text-red-500 rounded-md text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firstname" className="text-foreground">
                Fist Name
              </Label>
              <Input
                id="firstname"
                name="first_name"
                type="text"
                placeholder="Name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="bg-muted/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-foreground">
                last Name
              </Label>
              <Input
                id="lastname"
                name="last_name"
                type="text"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="bg-muted/50 border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-muted/50 border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-muted/50 border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="re_Password" className="text-foreground">
                Confirm Password
              </Label>
              <Input
                id="re_password"
                name="re_password"
                type="password"
                placeholder="••••••••"
                value={formData.re_password}
                onChange={handleChange}
                required
                className="bg-muted/50 border-border"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;