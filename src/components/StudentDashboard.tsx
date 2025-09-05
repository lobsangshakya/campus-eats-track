import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import TrafficLight from "./TrafficLight";
import { Users, MapPin, Clock } from "lucide-react";

interface Student {
  id: string;
  name: string;
  usn: string;
  tableNumber?: number;
}

interface StudentDashboardProps {
  onLogout: () => void;
}

const StudentDashboard = ({ onLogout }: StudentDashboardProps) => {
  const [liveCount, setLiveCount] = useState(42);
  const [tableInfo, setTableInfo] = useState({ number: 1782, empty: 12, total: 40 });
  const [isBooked, setIsBooked] = useState(false);
  const [bookingTime, setBookingTime] = useState("");
  const [members, setMembers] = useState<Student[]>([]);
  const { toast } = useToast();

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(0, Math.min(100, prev + change));
      });
      
      setTableInfo(prev => ({
        ...prev,
        empty: Math.max(0, Math.min(prev.total, prev.empty + (Math.random() > 0.5 ? 1 : -1)))
      }));
    }, 3000);

    // Mock members data
    setMembers([
      { id: "1", name: "Rahul Kumar", usn: "1MS21CS042", tableNumber: 5 },
      { id: "2", name: "Priya Sharma", usn: "1MS21EC018", tableNumber: 3 },
      { id: "3", name: "Arjun Patel", usn: "1MS21ME067", tableNumber: 8 },
      { id: "4", name: "Sneha Reddy", usn: "1MS21IS025", tableNumber: 2 },
      { id: "5", name: "Vikram Singh", usn: "1MS21CV089", tableNumber: 6 },
    ]);

    return () => clearInterval(interval);
  }, []);

  const handleBookSlot = () => {
    const now = new Date();
    const bookingTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
    const timeString = bookingTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    setIsBooked(true);
    setBookingTime(timeString);
    
    toast({
      title: "Slot Booked Successfully!",
      description: `Your table is reserved for ${timeString}`,
    });
  };

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
          <Button variant="outline" onClick={onLogout} className="text-sm">
            Logout
          </Button>
        </div>

        {/* Live Count - Big Number */}
        <Card className="p-8 text-center bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-lg font-medium text-foreground">Live Students</h2>
          </div>
          <div className="text-6xl font-bold text-primary mb-2">{liveCount}</div>
          <p className="text-muted-foreground">Currently in mess</p>
        </Card>

        {/* Main Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Table Info */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-card-foreground">Table Information</h3>
            </div>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-primary">
                Table: {tableInfo.number}
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg">
                <span className="font-medium text-card-foreground">Empty Seats:</span>
                <span className="font-bold text-lg">
                  {tableInfo.empty} / {tableInfo.total}
                </span>
              </div>
            </div>
          </Card>

          {/* Traffic Light Indicator */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Crowd Status</h3>
            <TrafficLight studentCount={liveCount} />
          </Card>
        </div>

        {/* Book Slot Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Table Booking</h3>
          </div>
          
          {!isBooked ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Reserve your table to guarantee a spot
              </p>
              <Button 
                onClick={handleBookSlot}
                className="bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg transition-all duration-200"
                size="lg"
              >
                Book Slot
              </Button>
            </div>
          ) : (
            <div className="text-center py-4 px-6 bg-success/10 rounded-lg border border-success/20">
              <div className="text-success font-semibold text-lg mb-1">
                ✓ Slot Booked Successfully!
              </div>
              <p className="text-success/80">
                Reserved for {bookingTime}
              </p>
            </div>
          )}
        </Card>

        {/* Members List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Current Members ({members.length})
          </h3>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex justify-between items-center p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium text-card-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.usn}</p>
                  </div>
                  {member.tableNumber && (
                    <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      Table {member.tableNumber}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;