// components/LogoutButton.tsx
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const LogoutButton = () => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon"  
      onClick={handleLogout} 
      aria-label="Logout"
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <span className="animate-spin">⏳</span> // Or use a spinner component
      ) : (
        <LogOut className="h-5 w-5" />
      )}
    </Button>
  );
};

export default LogoutButton;