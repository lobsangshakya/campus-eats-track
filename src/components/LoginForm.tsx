import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ThemeToggle } from "./ThemeToggle";
import { apiService } from "@/services/api";

interface LoginFormProps {
  onLogin: (userType: 'student' | 'admin') => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const { toast } = useToast();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const adminPhone = useMemo(() => "+911234567890", []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 13; // allow country code
  };

  const handleSendOtp = async () => {
    if (!isValidPhone(phone)) {
      toast({
        title: "Invalid phone number",
        description: "Enter a valid phone number to receive OTP",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await apiService.sendOTP(phone);
      
      if (response.success) {
        setOtpSent(true);
        setSecondsLeft(300); // 5 minutes
        toast({
          title: "OTP sent successfully!",
          description: `Verification code sent to ${response.phoneNumber}`,
        });
      } else {
        toast({
          title: "Failed to send OTP",
          description: response.error || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      toast({
        title: "Network error",
        description: "Unable to send OTP. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPhone(phone) || !otp) {
      toast({
        title: "Missing fields",
        description: "Enter phone number and the 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await apiService.verifyOTP(phone, otp);
      
      if (response.success) {
        const normalized = phone.replace(/\D/g, "");
        const isAdmin = normalized.endsWith(adminPhone.replace(/\D/g, ""));
        const userType = isAdmin ? 'admin' : 'student';
        
        onLogin(userType);
        toast({ 
          title: "Login successful", 
          description: `Welcome ${userType}!` 
        });
      } else {
        toast({
          title: "Verification failed",
          description: response.error || "Invalid OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast({
        title: "Network error",
        description: "Unable to verify OTP. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md p-8 shadow-[var(--shadow-card)]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="University Mess Portal" className="h-16 w-16 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mess Login</h1>
          <p className="text-muted-foreground">Login with your phone number</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
              Phone number
            </label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">One Time Password (6-digits)</label>
            <InputOTP maxLength={6} value={otp} onChange={setOtp} containerClassName="w-full">
              <InputOTPGroup className="w-full justify-between">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <div className="flex items-center justify-between">
              <Button type="button" variant="secondary" onClick={handleSendOtp} disabled={isSending || secondsLeft > 0}>
                {isSending ? "Sending..." : secondsLeft > 0 ? `Resend in ${Math.ceil(secondsLeft / 60)}m ${secondsLeft % 60}s` : "Send OTP"}
              </Button>
              {otpSent && (
                <span className="text-xs text-muted-foreground">Check your SMS for the code</span>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isVerifying || !otp}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg transition-all duration-200"
          >
            {isVerifying ? "Verifying..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Real SMS OTP: Use any valid phone number. Use {adminPhone} for admin view.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
