import { useState, useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import StudentDashboard from "@/components/StudentDashboard";
import AdminDashboard from "@/components/AdminDashboard";

type UserType = 'student' | 'admin' | null;

const Index = () => {
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored login state on component mount
  useEffect(() => {
    const storedUserType = localStorage.getItem('mess-app-user-type') as UserType;
    if (storedUserType) {
      setUserType(storedUserType);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (type: UserType) => {
    setUserType(type);
    localStorage.setItem('mess-app-user-type', type);
  };

  const handleLogout = () => {
    setUserType(null);
    localStorage.removeItem('mess-app-user-type');
  };

  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center animate-in fade-in-0 duration-500">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="University Mess Portal" 
              className="h-16 w-16 object-contain animate-pulse" 
            />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground font-medium">Loading Campus Eats...</p>
          </div>
          <div className="w-32 h-1 bg-muted rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userType) {
    return (
      <div className="animate-in fade-in-0 duration-500">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  if (userType === 'admin') {
    return (
      <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <AdminDashboard onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <StudentDashboard onLogout={handleLogout} />
    </div>
  );
};

export default Index;
