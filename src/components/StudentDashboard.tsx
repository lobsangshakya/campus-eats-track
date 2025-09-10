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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="University Mess Portal" 
                className="h-12 w-12 object-contain rounded-xl shadow-sm border border-slate-200 dark:border-slate-700" 
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Student Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Welcome back! Here's your mess overview</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={onLogout} 
              className="px-4 py-2 text-sm font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Live Count - Big Number */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
          <div className="relative p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Live Students</h2>
            </div>
            <div className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2 transition-all duration-500">
              {liveCount}
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Currently in mess</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Live data</span>
            </div>
          </div>
        </Card>

        {/* Current Meal Info */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Utensils className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Current Meal</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {mealInfo.current ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                        {mealInfo.current.name}
                      </div>
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-full">
                        ● Live
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">
                        {formatTime(mealInfo.current.startTime)} - {formatTime(mealInfo.current.endTime)}
                      </span>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                        Currently serving • Fresh and hot!
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-slate-600 dark:text-slate-400">
                      Next: {mealInfo.next?.name}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-500">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">
                        {mealInfo.next && `${formatTime(mealInfo.next.startTime)} - ${formatTime(mealInfo.next.endTime)}`}
                      </span>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                        Coming up next • Get ready!
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <TrafficLight studentCount={liveCount} />
              </div>
            </div>
          </div>
        </Card>

        {/* Main Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table Info */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Table Information</h3>
              </div>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                  Table #{tableInfo.number}
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Available Seats:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {tableInfo.empty}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">/ {tableInfo.total}</span>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(tableInfo.empty / tableInfo.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Meal Schedule */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Today's Schedule</h3>
              </div>
              <div className="space-y-3">
                {MEAL_TIMINGS.map((meal) => (
                  <div key={meal.name} className={`flex justify-between items-center p-3 rounded-xl transition-all duration-200 ${
                    mealInfo.current?.name === meal.name 
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                      : 'bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{meal.name}</span>
                      {mealInfo.current?.name === meal.name && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {formatTime(meal.startTime)} - {formatTime(meal.endTime)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Today's Menu */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Utensils className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Today's Menu</h3>
            </div>
            <TooltipProvider>
              <Tabs
                defaultValue={mealInfo.current?.name || mealInfo.next?.name || MEAL_TIMINGS[0].name}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl mb-6">
                  {MEAL_TIMINGS.map((meal) => (
                    <TabsTrigger 
                      key={meal.name} 
                      value={meal.name}
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 rounded-lg font-medium transition-all duration-200"
                    >
                      {meal.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              {MEAL_TIMINGS.map((meal) => {
                const items = todayMenu[meal.name as keyof typeof todayMenu] || [];
                const groups = groupMenuByCategory(items);
                return (
                  <TabsContent key={meal.name} value={meal.name} className="mt-0">
                    {items.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-slate-400 dark:text-slate-500 text-lg font-medium">Menu not available</div>
                        <div className="text-slate-400 dark:text-slate-500 text-sm mt-1">Check back later for updates</div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.entries(groups).map(([category, catItems]) => (
                          catItems.length > 0 && (
                            <div key={category} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">{category}</h4>
                                <Badge variant="secondary" className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                                  {catItems.length} items
                                </Badge>
                              </div>
                              <div className="space-y-3">
                                {catItems.map((it) => (
                                  <div key={it.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-sm transition-all duration-200">
                                    <div className="flex-1">
                                      <div className="font-medium text-slate-800 dark:text-slate-200">{it.name}</div>
                                      {it.calories !== undefined && (
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                          {it.calories} calories
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Badge 
                                            variant={it.isVeg === false ? "destructive" : "outline"}
                                            className={it.isVeg === false ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}
                                          >
                                            {it.isVeg === false ? "Non-Veg" : "Veg"}
                                          </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>{it.isVeg === false ? "Contains meat/egg" : "Vegetarian"}</TooltipContent>
                                      </Tooltip>
                                    </div>
                                  </div>
                                ))}
                              </div>
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
          </div>
        </Card>

        {/* Book Slot Section */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Table Booking</h3>
            </div>
            
            {!bookedMeal ? (
              <div className="text-center py-8">
                {bookableMeal ? (
                  <div className="max-w-md mx-auto">
                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 mb-6">
                      <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        Book your table for {bookableMeal.name}
                      </h4>
                      <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          {formatTime(bookableMeal.startTime)} - {formatTime(bookableMeal.endTime)}
                        </span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleBookSlot(bookableMeal)}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      size="lg"
                    >
                      Book {bookableMeal.name} Slot
                    </Button>
                  </div>
                ) : (
                  <div className="max-w-md mx-auto p-6 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                    <div className="text-slate-500 dark:text-slate-400 mb-2">
                      <Clock className="h-8 w-8 mx-auto mb-3" />
                      <p className="text-lg font-medium">No bookings available</p>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Booking opens 2-3 hours before meal time
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-2xl">✓</div>
                  </div>
                  <div className="text-green-700 dark:text-green-400 font-semibold text-xl mb-2">
                    Slot Booked Successfully!
                  </div>
                  <p className="text-green-600 dark:text-green-500 mb-4">
                    Reserved for {bookedMeal}
                  </p>
                  <Button 
                    onClick={() => setBookedMeal(null)}
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                  >
                    Cancel Booking
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
