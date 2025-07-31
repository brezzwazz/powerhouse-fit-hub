import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Lock, 
  BellOff, 
  Target, 
  ArrowLeft,
  Settings,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Link } from 'react-router-dom';
import Navigation from "@/components/Navigation";

const API_BASE_URL = "https://powerhousekrd.pythonanywhere.com";

// Define settings interface
interface UserSettings {
  email: string;
  profilePicture: string | null;
  emailNotifications: boolean;
  monthlyGoals: string;
  longTermGoals: string;
}

// API Service
const settingsService = {
  fetchSettings: (): Promise<{ data: UserSettings }> => 
    axios.get(`${API_BASE_URL}/api/user/settings`),
  
  updateSettings: (settings: Partial<UserSettings>): Promise<{ data: UserSettings }> => 
    axios.put(`${API_BASE_URL}/api/user/settings`, settings)
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<UserSettings>({
    email: '',
    profilePicture: null,
    emailNotifications: true,
    monthlyGoals: '',
    longTermGoals: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await settingsService.fetchSettings();
        setSettings(res.data);
        
        // If there's a profile picture URL, set it as preview
        if (res.data.profilePicture) {
          setImagePreview(res.data.profilePicture);
        }
      } catch (err) {
        setError('Failed to load settings');
        console.error('Settings fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (checked: boolean) => {
    setSettings(prev => ({ ...prev, emailNotifications: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      
      // In a real app, you would upload the image first and get a URL
      // For this example, we'll just simulate the update
      const updatedSettings = {
        ...settings,
        profilePicture: imagePreview || settings.profilePicture
      };
      
      await settingsService.updateSettings(updatedSettings);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save settings');
      console.error('Settings update error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper components
  const LoadingPlaceholder = () => (
    <div className="py-12 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-foreground">Loading settings...</p>
    </div>
  );

  const ErrorPlaceholder = () => (
    <div className="py-12 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h3 className="text-xl font-medium text-foreground mb-2">Loading Error</h3>
      <p className="text-muted-foreground mb-6">{error}</p>
      <Button onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="icon">
              <Link to="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 bg-green-50 text-green-800 p-4 rounded-lg flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Settings saved successfully!
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <div className="mb-6 bg-red-50 text-red-800 p-4 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : error ? (
                  <div className="py-6 text-center text-destructive">
                    <AlertCircle className="h-10 w-10 mx-auto mb-2" />
                    <p>Failed to load profile</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          {imagePreview ? (
                            <img 
                              src={imagePreview} 
                              alt="Profile" 
                              className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                            />
                          ) : (
                            <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 flex items-center justify-center">
                              <User className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <label 
                            htmlFor="profile-picture" 
                            className="absolute bottom-0 right-0 bg-white rounded-full p-1 border cursor-pointer"
                          >
                            <Settings className="h-4 w-4 text-primary" />
                            <input
                              id="profile-picture"
                              name="profile-picture"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex-grow space-y-4">
                        {/* Email */}
                        <div>
                          <Label htmlFor="email" className="flex items-center mb-2">
                            <Mail className="h-4 w-4 mr-2 text-primary" />
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={settings.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                          />
                        </div>
                        
                        {/* Password */}
                        <div>
                          <Label htmlFor="password" className="flex items-center mb-2">
                            <Lock className="h-4 w-4 mr-2 text-primary" />
                            Change Password
                          </Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter new password"
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BellOff className="h-5 w-5 text-primary" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : error ? (
                  <div className="py-6 text-center text-destructive">
                    <AlertCircle className="h-10 w-10 mx-auto mb-2" />
                    <p>Failed to load notification settings</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium text-foreground">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about your account activity
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.emailNotifications}
                      onCheckedChange={handleToggleChange}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Goals Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Fitness Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : error ? (
                  <div className="py-6 text-center text-destructive">
                    <AlertCircle className="h-10 w-10 mx-auto mb-2" />
                    <p>Failed to load goals</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Monthly Goals */}
                    <div>
                      <Label htmlFor="monthlyGoals" className="flex items-center mb-2">
                        
                        Monthly Goals
                      </Label>
                      <Textarea
                        id="monthlyGoals"
                        name="monthlyGoals"
                        value={settings.monthlyGoals}
                        onChange={handleInputChange}
                        placeholder="What do you want to achieve this month? (e.g., Lose 5kg, Increase bench press by 10kg)"
                        rows={3}
                      />
                    </div>
                    
                    {/* Long-term Goals */}
                    <div>
                      <Label htmlFor="longTermGoals" className="flex items-center mb-2">
                        <Target className="h-4 w-4 mr-2 text-primary" />
                        Long-term Goals
                      </Label>
                      <Textarea
                        id="longTermGoals"
                        name="longTermGoals"
                        value={settings.longTermGoals}
                        onChange={handleInputChange}
                        placeholder="What are your long-term fitness goals? (e.g., Run a marathon, Build muscle mass)"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                type="submit"
                variant="hero"
                size="lg"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;