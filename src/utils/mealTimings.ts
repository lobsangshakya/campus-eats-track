export interface MealTiming {
  name: string;
  startTime: string;
  endTime: string;
  bookingWindow: {
    start: number; // hours before meal
    end: number;   // minutes before meal ends
  };
}

export const MEAL_TIMINGS: MealTiming[] = [
  {
    name: "Breakfast",
    startTime: "07:30",
    endTime: "08:30",
    bookingWindow: { start: 2, end: 15 } // 2 hours before to 15 min before end
  },
  {
    name: "Lunch", 
    startTime: "12:00",
    endTime: "14:00",
    bookingWindow: { start: 3, end: 30 }
  },
  {
    name: "Snacks",
    startTime: "16:00", 
    endTime: "17:00",
    bookingWindow: { start: 2, end: 15 }
  },
  {
    name: "Dinner",
    startTime: "19:00",
    endTime: "20:30", 
    bookingWindow: { start: 3, end: 30 }
  }
];

export const getCurrentMeal = (): { current: MealTiming | null, next: MealTiming | null } => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes from midnight
  
  for (const meal of MEAL_TIMINGS) {
    const [startHour, startMin] = meal.startTime.split(':').map(Number);
    const [endHour, endMin] = meal.endTime.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    // Check if we're currently in meal time
    if (currentTime >= startTime && currentTime <= endTime) {
      return { current: meal, next: getNextMeal(meal) };
    }
  }
  
  // If not in any meal time, find the next meal
  return { current: null, next: getNextMeal() };
};

export const getNextMeal = (currentMeal?: MealTiming): MealTiming => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  if (currentMeal) {
    const currentIndex = MEAL_TIMINGS.findIndex(m => m.name === currentMeal.name);
    return MEAL_TIMINGS[(currentIndex + 1) % MEAL_TIMINGS.length];
  }
  
  // Find next meal based on current time
  for (const meal of MEAL_TIMINGS) {
    const [startHour, startMin] = meal.startTime.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    
    if (currentTime < startTime) {
      return meal;
    }
  }
  
  // If past all meals today, return tomorrow's breakfast
  return MEAL_TIMINGS[0];
};

export const canBookMeal = (meal: MealTiming): boolean => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMin] = meal.startTime.split(':').map(Number);
  const [endHour, endMin] = meal.endTime.split(':').map(Number);
  
  const mealStart = startHour * 60 + startMin;
  const mealEnd = endHour * 60 + endMin;
  
  const bookingStart = mealStart - (meal.bookingWindow.start * 60);
  const bookingEnd = mealEnd - meal.bookingWindow.end;
  
  return currentTime >= bookingStart && currentTime <= bookingEnd;
};

export const formatTime = (timeString: string): string => {
  const [hour, minute] = timeString.split(':');
  const hourNum = parseInt(hour);
  const period = hourNum >= 12 ? 'PM' : 'AM';
  const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
  return `${displayHour}:${minute} ${period}`;
};