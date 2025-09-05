import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import TrafficLight from "./TrafficLight";
import { ThemeToggle } from "./ThemeToggle";
import { Users, MapPin, Clock, Utensils } from "lucide-react";
import { getCurrentMeal, canBookMeal, formatTime, MEAL_TIMINGS } from "@/utils/mealTimings";

interface StudentDashboardProps {
  onLogout: () => void;
}

const StudentDashboard = ({ onLogout }: StudentDashboardProps) => {
  const [liveCount, setLiveCount] = useState(28);
  const [tableInfo, setTableInfo] = useState({ number: 1782, empty: 18, total: 1789 });
  const [bookedMeal, setBookedMeal] = useState<string | null>(null);
  const [mealInfo, setMealInfo] = useState(getCurrentMeal());
  const { toast } = useToast();

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const change = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        return Math.max(0, Math.min(80, prev + change));
      });
      
      setTableInfo(prev => ({
        ...prev,
        empty: Math.max(0, Math.min(prev.total, prev.empty + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)))
      }));
      
      // Update meal info every minute
      setMealInfo(getCurrentMeal());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBookSlot = (meal: typeof MEAL_TIMINGS[0]) => {
    setBookedMeal(meal.name);
    
    toast({
      title: "Slot Booked Successfully!",
      description: `Your table is reserved for ${meal.name} (${formatTime(meal.startTime)} - ${formatTime(meal.endTime)})`,
    });
  };

  const getBookableMeal = () => {
    if (mealInfo.current && canBookMeal(mealInfo.current)) {
      return mealInfo.current;
    }
    if (mealInfo.next && canBookMeal(mealInfo.next)) {
      return mealInfo.next;
    }
    return null;
  };

  const bookableMeal = getBookableMeal();

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={onLogout} className="text-sm">
              Logout
            </Button>
          </div>
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

        {/* Current Meal Info */}
        <Card className="p-6 bg-gradient-to-r from-accent/30 to-accent/10 border-primary/30">
          <div className="flex items-center gap-3 mb-4">
            <Utensils className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Current Meal</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {mealInfo.current ? (
                <>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {mealInfo.current.name}
                  </div>
                  <p className="text-muted-foreground">
                    {formatTime(mealInfo.current.startTime)} - {formatTime(mealInfo.current.endTime)}
                  </p>
                  <div className="inline-flex items-center px-2 py-1 bg-success/20 text-success text-xs font-medium rounded-full mt-2">
                    ● Currently Serving
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-muted-foreground mb-1">
                    Next: {mealInfo.next?.name}
                  </div>
                  <p className="text-muted-foreground">
                    {mealInfo.next && `${formatTime(mealInfo.next.startTime)} - ${formatTime(mealInfo.next.endTime)}`}
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <TrafficLight studentCount={liveCount} />
            </div>
          </div>
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
                <span className="font-medium text-card-foreground">Available Seats:</span>
                <span className="font-bold text-lg text-success">
                  {tableInfo.empty} / {tableInfo.total}
                </span>
              </div>
            </div>
          </Card>

          {/* Meal Schedule */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-card-foreground">Today's Schedule</h3>
            </div>
            <div className="space-y-2">
              {MEAL_TIMINGS.map((meal) => (
                <div key={meal.name} className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors ${
                  mealInfo.current?.name === meal.name 
                    ? 'bg-success/20 border border-success/30' 
                    : 'bg-muted'
                }`}>
                  <span className="font-medium text-card-foreground">{meal.name}:</span>
                  <span className="text-sm font-medium">
                    {formatTime(meal.startTime)} - {formatTime(meal.endTime)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Book Slot Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Table Booking</h3>
          </div>
          
          {!bookedMeal ? (
            <div className="text-center py-4">
              {bookableMeal ? (
                <>
                  <p className="text-muted-foreground mb-2">
                    Book your table for {bookableMeal.name}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {formatTime(bookableMeal.startTime)} - {formatTime(bookableMeal.endTime)}
                  </p>
                  <Button 
                    onClick={() => handleBookSlot(bookableMeal)}
                    className="bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg transition-all duration-200"
                    size="lg"
                  >
                    Book {bookableMeal.name} Slot
                  </Button>
                </>
              ) : (
                <div className="py-4 px-6 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">
                    No bookings available at this time
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Booking opens 2-3 hours before meal time
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 px-6 bg-success/10 rounded-lg border border-success/20">
              <div className="text-success font-semibold text-lg mb-1">
                ✓ Slot Booked Successfully!
              </div>
              <p className="text-success/80">
                Reserved for {bookedMeal}
              </p>
              <Button 
                onClick={() => setBookedMeal(null)}
                variant="outline"
                size="sm"
                className="mt-3 border-success text-success hover:bg-success/10"
              >
                Cancel Booking
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
