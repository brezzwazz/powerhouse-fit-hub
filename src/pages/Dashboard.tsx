import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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
  LogOut,
  AlertCircle,
  Info
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from '@/context/AuthContext'; 
import LogoutButton from '@/components/LogoutButton';

const API_BASE_URL = "https://powerhousekrd.pythonanywhere.com"; 

// Define all interfaces
interface MembershipData {
  status: string;
  plan: string;
  expiration: string;
  daysLeft: number;
}

interface ProgramData {
  name: string;
  progress: number;
  sessionsCompleted: number;
  totalSessions: number;
  nextSession: string;
}

interface MealPlanData {
  plan: string;
  todaysCalories: number;
  targetCalories: number;
  macros: {
    protein: { current: number; target: number };
    carbs: { current: number; target: number };
    fat: { current: number; target: number };
  };
}

interface Product {
  name: string;
  price: string;
  image: string;
}

interface QuickStat {
  label: string;
  value: string;
}

interface Achievement {
  title: string;
  description: string;
  icon: JSX.Element;
  bgColor: string;
}

// API Service with proper typing
const apiService = {
  fetchMembership: (): Promise<{ data: MembershipData }> => axios.get(`${API_BASE_URL}/api/membership`),
  fetchCurrentProgram: (): Promise<{ data: ProgramData }> => axios.get(`${API_BASE_URL}/api/current-program`),
  fetchMealPlan: (): Promise<{ data: MealPlanData }> => axios.get(`${API_BASE_URL}/api/meal`),
  fetchFeaturedProducts: (): Promise<{ data: Product[] }> => axios.get(`${API_BASE_URL}/api/featured-products`),
  fetchQuickStats: (): Promise<{ data: QuickStat[] }> => axios.get(`${API_BASE_URL}/api/quick-stats`),
  fetchAchievements: (): Promise<{ data: Achievement[] }> => axios.get(`${API_BASE_URL}/api/achievements`),
  logout: (): Promise<void> => 
    axios.post(`${API_BASE_URL}/api/auth/logout`, null, {
      withCredentials: true // For cookie-based sessions
    })
};

// Define state interfaces
interface LoadingState {
  membership: boolean;
  program: boolean;
  mealPlan: boolean;
  products: boolean;
  stats: boolean;
  achievements: boolean;
}

interface ErrorState {
  membership: string | null;
  program: string | null;
  mealPlan: string | null;
  products: string | null;
  stats: string | null;
  achievements: string | null;
}

interface DashboardData {
  membership: MembershipData | null;
  program: ProgramData | null;
  mealPlan: MealPlanData | null;
  products: Product[];
  stats: QuickStat[];
  achievements: Achievement[];
}

// Helper components
const LoadingPlaceholder = () => (
  <div className="py-8 flex flex-col items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
    <p className="mt-4 text-foreground text-sm">Loading data...</p>
  </div>
);

const ErrorPlaceholder = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="py-8 text-center">
    <div className="mx-auto mb-3">
      <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
    </div>
    <p className="text-destructive text-sm mb-4">{message}</p>
    <Button variant="outline" size="sm" onClick={onRetry}>
      Retry
    </Button>
  </div>
);

const EmptyPlaceholder = ({ message }: { message: string }) => (
  <div className="py-8 text-center">
    <Info className="h-10 w-10 text-muted-foreground mx-auto" />
    <p className="text-muted-foreground text-sm mt-3">{message}</p>
  </div>
);

const Dashboard = () => {
  
  // Initialize states with proper typing
  const [loading, setLoading] = useState<LoadingState>({
    membership: true,
    program: true,
    mealPlan: true,
    products: true,
    stats: true,
    achievements: true
  });

  const [errors, setErrors] = useState<ErrorState>({
    membership: null,
    program: null,
    mealPlan: null,
    products: null,
    stats: null,
    achievements: null
  });

  const [data, setData] = useState<DashboardData>({
    membership: null,
    program: null,
    mealPlan: null,
    products: [],
    stats: [],
    achievements: []
  });

  const fetchData = async () => {
    const fetchAndSet = async <T,>(
      key: keyof DashboardData,
      fetchFn: () => Promise<{ data: T }>
    ) => {
      try {
        setLoading(prev => ({ ...prev, [key]: true }));
        setErrors(prev => ({ ...prev, [key]: null }));
        
        const res = await fetchFn();
        setData(prev => ({ ...prev, [key]: res.data }));
      } catch (err) {
        setErrors(prev => ({ ...prev, [key]: 'Failed to load data' }));
        console.error(`Failed to fetch ${key}:`, err);
      } finally {
        setLoading(prev => ({ ...prev, [key]: false }));
      }
    };

    // Fetch all data independently with proper typing
    await Promise.all([
      fetchAndSet<MembershipData>('membership', apiService.fetchMembership),
      fetchAndSet<ProgramData>('program', apiService.fetchCurrentProgram),
      fetchAndSet<MealPlanData>('mealPlan', apiService.fetchMealPlan),
      fetchAndSet<Product[]>('products', apiService.fetchFeaturedProducts),
      fetchAndSet<QuickStat[]>('stats', apiService.fetchQuickStats),
      fetchAndSet<Achievement[]>('achievements', apiService.fetchAchievements)
    ]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetchData = async (key: keyof DashboardData, fetchFn: () => Promise<any>) => {
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      setErrors(prev => ({ ...prev, [key]: null }));
      
      const res = await fetchFn();
      setData(prev => ({ ...prev, [key]: res.data }));
    } catch (err) {
      setErrors(prev => ({ ...prev, [key]: 'Failed to load data' }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  // Check if any content is loaded to show dashboard
  const anyContentLoaded = 
    data.membership !== null ||
    data.program !== null ||
    data.mealPlan !== null ||
    data.products.length > 0 ||
    data.stats.length > 0 ||
    data.achievements.length > 0;


  const navigate = useNavigate();


  
  

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            
            <p className="text-muted-foreground">Ready to crush your goals today?</p>
          </div>
          <div className="flex space-x-2">
            <Button asChild variant="ghost" size="icon">
              <Link to="/notifications">
              <Bell className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link to="/settings">
              <Settings className="h-5 w-5" />
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>

        {/* Dashboard Content - Always render structure */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Membership Status Card */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Membership Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading.membership ? (
                  <LoadingPlaceholder />
                ) : errors.membership ? (
                  <ErrorPlaceholder 
                    message={errors.membership} 
                    onRetry={() => refetchData('membership', apiService.fetchMembership)}
                  />
                ) : data.membership ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                          {data.membership.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{data.membership.plan} Plan</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Expires</p>
                        <p className="font-semibold text-foreground">{data.membership.expiration}</p>
                      </div>
                    </div>
                    <div className="bg-secondary/20 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        {data.membership.daysLeft} days remaining
                      </p>
                      <Progress value={75} className="h-2" />
                    </div>
                  </>
                ) : (
                  <EmptyPlaceholder message="No membership data available" />
                )}
              </CardContent>
            </Card>

            {/* Current Program Card */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Current Program</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading.program ? (
                  <LoadingPlaceholder />
                ) : errors.program ? (
                  <ErrorPlaceholder 
                    message={errors.program} 
                    onRetry={() => refetchData('program', apiService.fetchCurrentProgram)}
                  />
                ) : data.program ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-foreground">{data.program.name}</h3>
                      <Badge variant="outline">{data.program.progress}% Complete</Badge>
                    </div>
                    
                    <Progress value={data.program.progress} className="h-3" />
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{data.program.sessionsCompleted}/{data.program.totalSessions} sessions</span>
                      <span>{data.program.progress}% complete</span>
                    </div>
                    
                    <div className="bg-secondary/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm">Next session: {data.program.nextSession}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyPlaceholder message="No program data available" />
                )}
              </CardContent>
            </Card>

            {/* Meal Plan Card */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Utensils className="h-5 w-5 text-primary" />
                  <span>Today's Nutrition</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading.mealPlan ? (
                  <LoadingPlaceholder />
                ) : errors.mealPlan ? (
                  <ErrorPlaceholder 
                    message={errors.mealPlan} 
                    onRetry={() => refetchData('mealPlan', apiService.fetchMealPlan)}
                  />
                ) : data.mealPlan ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-foreground">{data.mealPlan.plan} Plan</h3>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Calories</p>
                        <p className="font-semibold">{data.mealPlan.todaysCalories}/{data.mealPlan.targetCalories}</p>
                      </div>
                    </div>
                    
                    <Progress 
                      value={(data.mealPlan.todaysCalories / data.mealPlan.targetCalories) * 100} 
                      className="h-2" 
                    />
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 bg-secondary/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">Protein</p>
                        <p className="font-semibold text-primary">{data.mealPlan.macros.protein.current}g</p>
                        <p className="text-xs text-muted-foreground">of {data.mealPlan.macros.protein.target}g</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">Carbs</p>
                        <p className="font-semibold text-accent">{data.mealPlan.macros.carbs.current}g</p>
                        <p className="text-xs text-muted-foreground">of {data.mealPlan.macros.carbs.target}g</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">Fat</p>
                        <p className="font-semibold text-destructive">{data.mealPlan.macros.fat.current}g</p>
                        <p className="text-xs text-muted-foreground">of {data.mealPlan.macros.fat.target}g</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyPlaceholder message="No meal plan data available" />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Stats Card */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading.stats ? (
                  <LoadingPlaceholder />
                ) : errors.stats ? (
                  <ErrorPlaceholder 
                    message={errors.stats} 
                    onRetry={() => refetchData('stats', apiService.fetchQuickStats)}
                  />
                ) : data.stats.length > 0 ? (
                  data.stats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className="font-semibold text-foreground">{stat.value}</span>
                    </div>
                  ))
                ) : (
                  <EmptyPlaceholder message="No stats available" />
                )}
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading.achievements ? (
                  <LoadingPlaceholder />
                ) : errors.achievements ? (
                  <ErrorPlaceholder 
                    message={errors.achievements} 
                    onRetry={() => refetchData('achievements', apiService.fetchAchievements)}
                  />
                ) : data.achievements.length > 0 ? (
                  data.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${achievement.bgColor} rounded-full flex items-center justify-center`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyPlaceholder message="No achievements yet" />
                )}
              </CardContent>
            </Card>

            {/* Featured Products Card */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span>Featured Products</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading.products ? (
                  <LoadingPlaceholder />
                ) : errors.products ? (
                  <ErrorPlaceholder 
                    message={errors.products} 
                    onRetry={() => refetchData('products', apiService.fetchFeaturedProducts)}
                  />
                ) : data.products.length > 0 ? (
                  <>
                    {data.products.map((product, index) => (
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
                  </>
                ) : (
                  <EmptyPlaceholder message="No products available" />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Empty dashboard state */}
        {!anyContentLoaded && !Object.values(loading).some(Boolean) && (
          <div className="text-center py-12">
            <Info className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="mt-4 text-xl font-medium text-foreground">No data available</h3>
            <p className="mt-2 text-muted-foreground">
              We couldn't find any dashboard information. Try reloading.
            </p>
            <Button className="mt-4" onClick={fetchData}>
              Reload Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;