import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ThemeToggle } from "./ThemeToggle";

interface LoginFormProps {
  onLogin: (userType: 'student' | 'admin') => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const { toast } = useToast();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
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
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // Simulate network
    setTimeout(() => {
      setGeneratedOtp(code);
      setSecondsLeft(45);
      setIsSending(false);
      toast({
        title: "OTP sent",
        description: `For demo, your OTP is ${code}`,
      });
    }, 700);
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
    setTimeout(() => {
      setIsVerifying(false);
      if (otp !== generatedOtp) {
        toast({
          title: "Invalid OTP",
          description: "The code you entered is incorrect",
          variant: "destructive",
        });
        return;
      }

      const normalized = phone.replace(/\D/g, "");
      const isAdmin = normalized.endsWith(adminPhone.replace(/\D/g, ""));
      const userType = isAdmin ? 'admin' : 'student';
      onLogin(userType);
      toast({ title: "Login successful", description: `Welcome ${userType}!` });
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md p-8 shadow-2xl border-0 bg-card/95 backdrop-blur-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 animate-in zoom-in-50 duration-500 delay-200">
            <img 
              src="/logo.png" 
              alt="University Mess Portal" 
              className="h-16 w-16 object-contain drop-shadow-lg hover:scale-110 transition-transform duration-300" 
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 animate-in slide-in-from-top-2 duration-500 delay-300">
            Mess Login
          </h1>
          <p className="text-muted-foreground animate-in fade-in-0 duration-500 delay-400">
            Login with your phone number
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6 animate-in slide-in-from-bottom-2 duration-500 delay-500">
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
              className="h-12 text-base transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">One Time Password (6-digits)</label>
            <InputOTP 
              maxLength={6} 
              value={otp} 
              onChange={setOtp} 
              containerClassName="w-full"
            >
              <InputOTPGroup className="w-full justify-between gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot 
                    key={index} 
                    index={index}
                    className="transition-all duration-200 hover:scale-110 focus:scale-110"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <div className="flex items-center justify-between">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleSendOtp} 
                disabled={isSending || secondsLeft > 0}
                className="transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                {isSending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : secondsLeft > 0 ? (
                  `Resend in ${secondsLeft}s`
                ) : (
                  "Send OTP"
                )}
              </Button>
              {generatedOtp && (
                <span className="text-xs text-muted-foreground animate-in fade-in-0 duration-300">
                  Code sent. Check toast.
                </span>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isVerifying || !otp}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center animate-in fade-in-0 duration-500 delay-600">
          <p className="text-xs text-muted-foreground">
            Demo: Use any phone. Use {adminPhone} for admin view.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
