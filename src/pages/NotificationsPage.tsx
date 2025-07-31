import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Bell, ArrowLeft, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Link } from 'react-router-dom';
import Navigation from "@/components/Navigation";

const API_BASE_URL = "https://powerhousekrd.pythonanywhere.com";

// Define notification interface
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'alert' | 'success';
}

// API Service
const notificationService = {
  fetchNotifications: (): Promise<{ data: Notification[] }> => 
    axios.get(`${API_BASE_URL}/api/notifications`)
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await notificationService.fetchNotifications();
        setNotifications(res.data);
      } catch (err) {
        setError('Failed to load notifications');
        console.error('Notification fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Helper components
  const LoadingPlaceholder = () => (
    <div className="py-12 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-foreground">Loading notifications...</p>
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

  const EmptyPlaceholder = () => (
    <div className="py-12 text-center">
      <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-medium text-foreground mb-2">No notifications</h3>
      <p className="text-muted-foreground">You're all caught up!</p>
      <Button className="mt-4" asChild>
        <Link to="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'alert': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

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
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border">
          {/* Loading State */}
          {loading && <LoadingPlaceholder />}
          
          {/* Error State */}
          {!loading && error && <ErrorPlaceholder />}
          
          {/* Empty State */}
          {!loading && !error && notifications.length === 0 && <EmptyPlaceholder />}
          
          {/* Notifications List */}
          {!loading && !error && notifications.length > 0 && (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-6 flex space-x-4 ${notification.isRead ? 'bg-muted/20' : 'bg-white dark:bg-gray-800'}`}
                >
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-foreground">{notification.title}</h3>
                      <span className="text-sm text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mark all as read button */}
        {!loading && !error && notifications.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button variant="outline">
              Mark all as read
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;