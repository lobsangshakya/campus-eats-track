export type MenuCategory = "Main" | "Sides" | "Beverages" | "Dessert";

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  isVeg?: boolean;
  calories?: number;
}

export type MealName = "Breakfast" | "Lunch" | "Snacks" | "Dinner";

export const DAILY_MENU: Record<MealName, MenuItem[]> = {
  Breakfast: [
    { id: "b1", name: "Masala Omelette", category: "Main", isVeg: false, calories: 220 },
    { id: "b2", name: "Aloo Paratha", category: "Main", isVeg: true, calories: 320 },
    { id: "b3", name: "Poha", category: "Sides", isVeg: true, calories: 180 },
    { id: "b4", name: "Tea/Coffee", category: "Beverages", isVeg: true },
    { id: "b5", name: "Seasonal Fruit", category: "Dessert", isVeg: true },
  ],
  Lunch: [
    { id: "l1", name: "Dal Tadka", category: "Main", isVeg: true, calories: 260 },
    { id: "l2", name: "Jeera Rice", category: "Main", isVeg: true, calories: 330 },
    { id: "l3", name: "Grilled Chicken", category: "Main", isVeg: false, calories: 410 },
    { id: "l4", name: "Veg Salad", category: "Sides", isVeg: true, calories: 120 },
    { id: "l5", name: "Buttermilk", category: "Beverages", isVeg: true },
  ],
  Snacks: [
    { id: "s1", name: "Samosa", category: "Main", isVeg: true, calories: 190 },
    { id: "s2", name: "Sandwich", category: "Main", isVeg: true, calories: 240 },
    { id: "s3", name: "Tea/Coffee", category: "Beverages", isVeg: true },
    { id: "s4", name: "Nimbu Pani", category: "Beverages", isVeg: true },
  ],
  Dinner: [
    { id: "d1", name: "Paneer Butter Masala", category: "Main", isVeg: true, calories: 430 },
    { id: "d2", name: "Tandoori Roti", category: "Main", isVeg: true, calories: 120 },
    { id: "d3", name: "Fish Curry", category: "Main", isVeg: false, calories: 390 },
    { id: "d4", name: "Gulab Jamun", category: "Dessert", isVeg: true, calories: 180 },
    { id: "d5", name: "Roasted Papad", category: "Sides", isVeg: true, calories: 60 },
  ],
};

export const groupMenuByCategory = (items: MenuItem[]) => {
  return items.reduce<Record<MenuCategory, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [] as MenuItem[];
    acc[item.category].push(item);
    return acc;
  }, { Main: [], Sides: [], Beverages: [], Dessert: [] });
};


