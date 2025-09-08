import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import TrafficLight from "./TrafficLight";
import { ThemeToggle } from "./ThemeToggle";
import { Users, MapPin, Clock, Utensils } from "lucide-react";
import { getCurrentMeal, canBookMeal, formatTime, MEAL_TIMINGS } from "@/utils/mealTimings";
import { groupMenuByCategory } from "@/utils/menu";
import { getDailyMenuForDate } from "@/utils/menuSchedule";

interface StudentDashboardProps {
  onLogout: () => void;
}

const StudentDashboard = ({ onLogout }: StudentDashboardProps) => {
  const [liveCount, setLiveCount] = useState(28);
  const [tableInfo, setTableInfo] = useState({ number: 1782, empty: 1779, total: 1782 });
  const [bookedMeal, setBookedMeal] = useState<string | null>(null);
  const [mealInfo, setMealInfo] = useState(getCurrentMeal());
  const { toast } = useToast();
  const todayMenu = getDailyMenuForDate(new Date());

  // Helpers for time-driven targets
  const minutesFromString = (timeString: string) => {
    const [h, m] = timeString.split(":").map(Number);
    return h * 60 + m;
  };

  const getMealTarget = (mealName: string): number => {
    // Seat targets (approx) out of tableInfo.total
    switch (mealName) {
      case "Lunch":
        return 1600; // highest
      case "Dinner":
        return 1200; // medium-high
      case "Breakfast":
        return 900; // lower
      case "Snacks":
        return 700; // lowest
      default:
        return 200; // off-peak baseline
    }
  };

  const computeTimeWeightedTarget = () => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    if (mealInfo.current) {
      const start = minutesFromString(mealInfo.current.startTime);
      const end = minutesFromString(mealInfo.current.endTime);
      const duration = Math.max(1, end - start);
      const progress = Math.min(1, Math.max(0, (currentMins - start) / duration));
      // Smooth bell-ish curve using sine to peak mid-meal
      const eased = Math.sin(progress * Math.PI);
      const peakTarget = getMealTarget(mealInfo.current.name);
      // Keep a floor so early/late in window isn't zero
      const floor = Math.min(peakTarget * 0.35, 300);
      return Math.round(floor + eased * (peakTarget - floor));
    }

    // If not in a meal window, bias toward next meal pre-peak (small ramp)
    if (mealInfo.next) {
      const nextStart = minutesFromString(mealInfo.next.startTime);
      const preWindowStart = nextStart - 120; // 2 hours before next meal
      const preWindowEnd = nextStart; // up to start
      const clamped = Math.min(1, Math.max(0, (currentMins - preWindowStart) / Math.max(1, (preWindowEnd - preWindowStart))));
      const nextTarget = getMealTarget(mealInfo.next.name) * 0.3; // small pre-meal activity
      return Math.round(clamped * nextTarget);
    }

    return 150; // default idle baseline
  };

  // Time-driven data updates using easing toward target
  useEffect(() => {
    const interval = setInterval(() => {
      setMealInfo(getCurrentMeal());

      setLiveCount(prev => {
        const target = computeTimeWeightedTarget();
        const delta = target - prev;
        // Gentler easing: move 5% toward target, minimum 1
        const easedStep = Math.max(1, Math.round(Math.abs(delta) * 0.05));
        const direction = Math.sign(delta);
        // Tiny noise for liveliness, smaller amplitude
        const noise = Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const next = prev + direction * easedStep + noise;
        const clampedNext = Math.max(0, Math.min(tableInfo.total, next));

        // Update empty seats from the same computed next to avoid lag
        setTableInfo(prevTable => ({
          ...prevTable,
          empty: Math.max(0, Math.min(prevTable.total, prevTable.total - clampedNext))
        }));

        return clampedNext;
      });
    }, 3000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealInfo.current?.name, mealInfo.next?.name, tableInfo.total]);

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
    <div className="min-h-screen p-4 subtle-gradient-bg">
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-0 duration-700">
        {/* Header */}
        <div className="flex justify-between items-center animate-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="University Mess Portal" 
              className="h-10 w-10 object-contain hover:scale-110 smooth-transition" 
            />
            <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={onLogout} 
              className="text-sm hover:scale-105 smooth-transition"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Live Count - Big Number */}
        <Card className="p-8 text-center glass-card gradient-border hover-lift smooth-transition animate-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary animate-pulse" />
            <h2 className="text-lg font-medium text-foreground">Live Students</h2>
          </div>
          <div className="text-6xl font-bold text-primary mb-2 smooth-transition">
            {liveCount}
          </div>
          <p className="text-muted-foreground">Currently in mess</p>
        </Card>

        {/* Current Meal Info */}
        <Card className="p-6 glass-card hover-lift smooth-transition animate-in slide-in-from-left-4 duration-500 delay-300">
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
          <Card className="p-6 glass-card hover-lift smooth-transition animate-in slide-in-from-bottom-4 duration-500 delay-400">
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
          <Card className="p-6 glass-card hover-lift smooth-transition animate-in slide-in-from-bottom-4 duration-500 delay-500">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-card-foreground">Today's Schedule</h3>
            </div>
            <div className="space-y-2">
              {MEAL_TIMINGS.map((meal) => (
                <div key={meal.name} className={`flex justify-between items-center py-2 px-3 rounded-lg smooth-transition ${
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

        {/* Today's Menu */}
        <Card className="p-6 glass-card hover-lift smooth-transition animate-in slide-in-from-bottom-4 duration-500 delay-550">
          <div className="flex items-center gap-3 mb-4">
            <Utensils className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Today's Menu</h3>
          </div>
          <TooltipProvider>
            <Tabs
              defaultValue={mealInfo.current?.name || mealInfo.next?.name || MEAL_TIMINGS[0].name}
              className="w-full"
            >
              <TabsList className="mb-3">
                {MEAL_TIMINGS.map((meal) => (
                  <TabsTrigger key={meal.name} value={meal.name}>
                    {meal.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {MEAL_TIMINGS.map((meal) => {
                const items = todayMenu[meal.name as keyof typeof todayMenu] || [];
                const groups = groupMenuByCategory(items);
                return (
                  <TabsContent key={meal.name} value={meal.name}>
                    {items.length === 0 ? (
                      <div className="text-sm text-muted-foreground">Menu not available.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(groups).map(([category, catItems]) => (
                          catItems.length > 0 && (
                            <div key={category} className="rounded-lg border bg-muted/40 p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium text-card-foreground">{category}</div>
                                <Badge variant="secondary">{catItems.length}</Badge>
                              </div>
                              <Separator className="my-2" />
                              <ul className="space-y-2">
                                {catItems.map((it) => (
                                  <li key={it.id} className="flex items-center justify-between">
                                    <div className="text-sm text-card-foreground">{it.name}</div>
                                    <div className="flex items-center gap-2">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Badge variant={it.isVeg === false ? "destructive" : "outline"}>
                                            {it.isVeg === false ? "Non-Veg" : "Veg"}
                                          </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>{it.isVeg === false ? "Contains meat/egg" : "Vegetarian"}</TooltipContent>
                                      </Tooltip>
                                      {it.calories !== undefined && (
                                        <Badge variant="outline">{it.calories} kcal</Badge>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </TooltipProvider>
        </Card>

        {/* Book Slot Section */}
        <Card className="p-6 glass-card hover-lift smooth-transition animate-in slide-in-from-bottom-4 duration-500 delay-600">
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
                    className="primary-gradient-bg text-primary-foreground hover:opacity-90 hover:shadow-xl smooth-transition hover:scale-105"
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
                className="mt-3 border-success text-success hover:bg-success/10 hover:scale-105 smooth-transition"
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