import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://powerhousekrd.pythonanywhere.com';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',  
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

     try {
      // Reset Axios headers for this request
      const config = {
        headers: { Authorization: undefined }
      };

      const response = await axios.post(
        `${API_BASE_URL}/auth/jwt/create/`,
        {
          email: formData.email,
          password: formData.password
        },
        config  // Use custom config
      );
      
      // Correct token handling (remove duplicate authToken)
      localStorage.setItem('authToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      // Set header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      if (err.response) {
       
        if (err.response.status === 401) {
          setError('Invalid credentials. Please try again.');
        } else if (err.response.status === 400) {
          
          if (err.response.data.detail) {
            setError(err.response.data.detail);
          } else {
            setError('Invalid request. Please check your input.');
          }
        } else {
          setError('Server error. Please try again later.');
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-gradient-card border border-border rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-foreground mb-6">
            Welcome Back
          </h2>
          
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 text-red-500 rounded-md text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            
            <div className="text-center mt-4 text-sm text-muted-foreground">
              <Link 
                to="/forgot-password" 
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>
          
          <div className="mt-8 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-primary font-medium hover:underline"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;