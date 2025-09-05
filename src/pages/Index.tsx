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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userType) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (userType === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <StudentDashboard onLogout={handleLogout} />;
};

export default Index;
