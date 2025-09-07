import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import TrafficLight from "./TrafficLight";
import { ThemeToggle } from "./ThemeToggle";
import { Users, Calendar, Settings, TrendingUp } from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [liveCount, setLiveCount] = useState(42);
  const [bookingsCount, setBookingsCount] = useState(28);
  const [walkInsCount, setWalkInsCount] = useState(14);
  const [thresholds, setThresholds] = useState({ green: 50, yellow: 80 });
  const [tempThresholds, setTempThresholds] = useState({ green: 50, yellow: 80 });
  const { toast } = useToast();

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(0, Math.min(100, prev + change));
      });
      
      // Update bookings vs walk-ins occasionally
      if (Math.random() > 0.8) {
        setBookingsCount(prev => Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1)));
        setWalkInsCount(prev => Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1)));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdateThresholds = () => {
    setThresholds(tempThresholds);
    toast({
      title: "Thresholds Updated",
      description: `Green: <${tempThresholds.green}, Yellow: <${tempThresholds.yellow}`,
    });
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background via-background to-muted/10">
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in-0 duration-700">
        {/* Header */}
        <div className="flex justify-between items-center animate-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="University Mess Portal" 
              className="h-10 w-10 object-contain hover:scale-110 transition-transform duration-300" 
            />
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={onLogout} 
              className="text-sm hover:scale-105 transition-all duration-200"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Live Count */}
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-6 w-6 text-primary animate-pulse" />
              <h3 className="text-sm font-medium text-foreground">Live Students</h3>
            </div>
            <div className="text-3xl font-bold text-primary mb-1 transition-all duration-500 ease-out">
              {liveCount}
            </div>
            <p className="text-sm text-muted-foreground">Excluding staff</p>
          </Card>

          {/* Bookings */}
          <Card className="p-6 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-6 w-6 text-success" />
              <h3 className="text-sm font-medium text-card-foreground">Bookings Today</h3>
            </div>
            <div className="text-3xl font-bold text-success mb-1 transition-all duration-500 ease-out">
              {bookingsCount}
            </div>
            <p className="text-sm text-muted-foreground">Reserved slots</p>
          </Card>

          {/* Walk-ins */}
          <Card className="p-6 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 duration-500 delay-400">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-warning" />
              <h3 className="text-sm font-medium text-card-foreground">Walk-ins Today</h3>
            </div>
            <div className="text-3xl font-bold text-warning mb-1 transition-all duration-500 ease-out">
              {walkInsCount}
            </div>
            <p className="text-sm text-muted-foreground">Direct entries</p>
          </Card>
        </div>

        {/* Analytics Chart */}
        <Card className="p-6 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 duration-500 delay-500">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Bookings vs Walk-ins
          </h3>
          <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {Math.round((bookingsCount / (bookingsCount + walkInsCount)) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Bookings Rate</p>
            </div>
          </div>
        </Card>

        {/* Traffic Light and Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Current Crowd Status
            </h3>
            <TrafficLight studentCount={liveCount} thresholds={thresholds} />
          </Card>

          {/* Threshold Configuration */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-card-foreground">Configure Thresholds</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="green-threshold">Green (Low Crowd) - Less than:</Label>
                <Input
                  id="green-threshold"
                  type="number"
                  value={tempThresholds.green}
                  onChange={(e) => setTempThresholds(prev => ({ 
                    ...prev, 
                    green: parseInt(e.target.value) || 0 
                  }))}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="yellow-threshold">Yellow (Moderate) - Less than:</Label>
                <Input
                  id="yellow-threshold"
                  type="number"
                  value={tempThresholds.yellow}
                  onChange={(e) => setTempThresholds(prev => ({ 
                    ...prev, 
                    yellow: parseInt(e.target.value) || 0 
                  }))}
                  className="w-full"
                />
              </div>
              
              <Button 
                onClick={handleUpdateThresholds}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Update Thresholds
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Recent Activity
          </h3>
          <ScrollArea className="h-48">
            <div className="space-y-3">
              {[
                { time: "2:45 PM", action: "Student booked table", user: "1MS21CS042" },
                { time: "2:42 PM", action: "Walk-in entry", user: "1MS21EC018" },
                { time: "2:38 PM", action: "Booking confirmed", user: "1MS21ME067" },
                { time: "2:35 PM", action: "Student exited", user: "1MS21IS025" },
                { time: "2:30 PM", action: "Walk-in entry", user: "1MS21CV089" },
              ].map((activity, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-card-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-sm text-primary font-medium">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
