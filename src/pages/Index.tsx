import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import StudentDashboard from "@/components/StudentDashboard";
import AdminDashboard from "@/components/AdminDashboard";

type UserType = 'student' | 'admin' | null;

const Index = () => {
  const [userType, setUserType] = useState<UserType>(null);

  const handleLogin = (type: UserType) => {
    setUserType(type);
  };

  if (!userType) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (userType === 'admin') {
    return <AdminDashboard />;
  }

  return <StudentDashboard />;
};

export default Index;
