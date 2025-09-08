import { DAILY_MENU, MealName, MenuItem } from "@/utils/menu";

export type DateKey = string; // YYYY-MM-DD

export const toDateKey = (date: Date): DateKey => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export type DailyMenuRecord = Partial<Record<MealName, MenuItem[]>>;

// Minimal schedule extracted from provided rotation image (Week of Sep 8–15, 2025)
// Note: Fill out more items as needed; unspecified meals fall back to default DAILY_MENU
export const MENU_SCHEDULE: Record<DateKey, DailyMenuRecord> = {
  // 2025-09-08 (Mon)
  "2025-09-08": {
    Breakfast: [
      { id: "b-0908-1", name: "Plain Idly", category: "Main", isVeg: true },
      { id: "b-0908-2", name: "Coconut Chutney", category: "Sides", isVeg: true },
    ],
    Snacks: [
      { id: "s-0908-1", name: "Bhel Puri", category: "Main", isVeg: true },
      { id: "s-0908-2", name: "Ginger Tea", category: "Beverages", isVeg: true },
    ],
    Dinner: [
      { id: "d-0908-1", name: "Black Channa Masala", category: "Main", isVeg: true },
      { id: "d-0908-2", name: "Plain Rice", category: "Main", isVeg: true },
    ],
  },
  // 2025-09-09 (Tue)
  "2025-09-09": {
    Breakfast: [
      { id: "b-0909-1", name: "Trikon Paratha", category: "Main", isVeg: true },
      { id: "b-0909-2", name: "Veg Kurma", category: "Main", isVeg: true },
    ],
    Snacks: [
      { id: "s-0909-1", name: "Maggi", category: "Main", isVeg: true },
      { id: "s-0909-2", name: "Ginger Tea", category: "Beverages", isVeg: true },
    ],
    Dinner: [
      { id: "d-0909-1", name: "Aloo Methi Gravy", category: "Main", isVeg: true },
      { id: "d-0909-2", name: "Andra Dal", category: "Main", isVeg: true },
    ],
  },
  // 2025-09-10 (Wed)
  "2025-09-10": {
    Breakfast: [
      { id: "b-0910-1", name: "Iblisible Bhanth", category: "Main", isVeg: true },
      { id: "b-0910-2", name: "Kara Boondi", category: "Sides", isVeg: true },
    ],
    Snacks: [
      { id: "s-0910-1", name: "Bakery Product", category: "Main", isVeg: true },
      { id: "s-0910-2", name: "Ginger Tea", category: "Beverages", isVeg: true },
    ],
    Dinner: [
      { id: "d-0910-1", name: "Paneer Capsicum Masala", category: "Main", isVeg: true },
      { id: "d-0910-2", name: "Jeera Pulao", category: "Main", isVeg: true },
    ],
  },
  // 2025-09-11 (Thu)
  "2025-09-11": {
    Breakfast: [
      { id: "b-0911-1", name: "Vegetable Upma", category: "Main", isVeg: true },
      { id: "b-0911-2", name: "Coconut Chutney", category: "Sides", isVeg: true },
    ],
    Snacks: [
      { id: "s-0911-1", name: "Masala Pori", category: "Main", isVeg: true },
      { id: "s-0911-2", name: "Sweet Chutney", category: "Sides", isVeg: true },
    ],
    Dinner: [
      { id: "d-0911-1", name: "Veg Lababdar", category: "Main", isVeg: true },
      { id: "d-0911-2", name: "Plain Rice", category: "Main", isVeg: true },
    ],
  },
  // 2025-09-12 (Fri)
  "2025-09-12": {
    Breakfast: [
      { id: "b-0912-1", name: "Aloo Peanut Poha", category: "Main", isVeg: true },
      { id: "b-0912-2", name: "Coconut Chutney", category: "Sides", isVeg: true },
    ],
    Snacks: [
      { id: "s-0912-1", name: "Corn Chaat", category: "Main", isVeg: true },
      { id: "s-0912-2", name: "Ginger Tea", category: "Beverages", isVeg: true },
    ],
    Dinner: [
      { id: "d-0912-1", name: "Dum Aloo", category: "Main", isVeg: true },
      { id: "d-0912-2", name: "Pulav", category: "Main", isVeg: true },
    ],
  },
  // 2025-09-13 (Sat)
  "2025-09-13": {
    Breakfast: [
      { id: "b-0913-1", name: "Kara Pongal", category: "Main", isVeg: true },
      { id: "b-0913-2", name: "Coconut Chutney", category: "Sides", isVeg: true },
    ],
    Snacks: [
      { id: "s-0913-1", name: "Bonda", category: "Main", isVeg: true },
      { id: "s-0913-2", name: "Ginger Tea", category: "Beverages", isVeg: true },
    ],
    Dinner: [
      { id: "d-0913-1", name: "Kadai Vegetable", category: "Main", isVeg: true },
      { id: "d-0913-2", name: "Plain Rice", category: "Main", isVeg: true },
    ],
  },
  // 2025-09-14 (Sun)
  "2025-09-14": {
    Breakfast: [
      { id: "b-0914-1", name: "Plain Dosa", category: "Main", isVeg: true },
      { id: "b-0914-2", name: "Dosa Pallya", category: "Sides", isVeg: true },
    ],
    Snacks: [
      { id: "s-0914-1", name: "Boky Product", category: "Main", isVeg: true },
      { id: "s-0914-2", name: "Ginger Tea", category: "Beverages", isVeg: true },
    ],
    Dinner: [
      { id: "d-0914-1", name: "Greenmoong Masala", category: "Main", isVeg: true },
      { id: "d-0914-2", name: "Pulav Rice", category: "Main", isVeg: true },
    ],
  },
  // 2025-09-15 (Mon)
  "2025-09-15": {
    Breakfast: [
      { id: "b-0915-1", name: "Plain Idly", category: "Main", isVeg: true },
      { id: "b-0915-2", name: "Coconut Chutney", category: "Sides", isVeg: true },
    ],
    Snacks: [
      { id: "s-0915-1", name: "Bhel Pori", category: "Main", isVeg: true },
      { id: "s-0915-2", name: "Ginger Tea", category: "Beverages", isVeg: true },
    ],
    Dinner: [
      { id: "d-0915-1", name: "Aloo Horse Gram Masala", category: "Main", isVeg: true },
      { id: "d-0915-2", name: "Dal Maharaj", category: "Main", isVeg: true },
    ],
  },
};

export const getDailyMenuForDate = (date: Date): Record<MealName, MenuItem[]> => {
  const key = toDateKey(date);
  const record = MENU_SCHEDULE[key] || {};
  return {
    Breakfast: record.Breakfast ?? DAILY_MENU.Breakfast,
    Lunch: record.Lunch ?? DAILY_MENU.Lunch,
    Snacks: record.Snacks ?? DAILY_MENU.Snacks,
    Dinner: record.Dinner ?? DAILY_MENU.Dinner,
  };
};


