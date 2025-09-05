import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (userType: 'student' | 'admin') => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [usn, setUsn] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usn || !otp) {
      toast({
        title: "Missing fields",
        description: "Please enter both USN and OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Mock login logic - admin USN for demo
      const userType = usn.toLowerCase().includes('admin') ? 'admin' : 'student';
      onLogin(userType);
      toast({
        title: "Login successful",
        description: `Welcome ${userType}!`,
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-[var(--shadow-card)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mess Login
          </h1>
          <p className="text-muted-foreground">
            Enter your USN and OTP to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="usn" className="text-sm font-medium text-foreground">
              University Serial Number (USN)
            </label>
            <Input
              id="usn"
              type="text"
              placeholder="Enter your USN"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium text-foreground">
              One Time Password (OTP)
            </label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg transition-all duration-200"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Demo: Use any USN (try "admin123" for admin view)
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;