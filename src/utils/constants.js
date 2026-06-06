// Food categories with colors
export const FOOD_CATEGORIES = [
  { id: 'protein', name: 'Protein', color: '#ff6b6b', icon: '🥩' },
  { id: 'carbs', name: 'Carbs', color: '#ffd93d', icon: '🍚' },
  { id: 'fats', name: 'Fats', color: '#6bcb77', icon: '🥑' },
  { id: 'vegetables', name: 'Vegetables', color: '#4ecdc4', icon: '🥦' },
  { id: 'fruits', name: 'Fruits', color: '#ff8a5c', icon: '🍎' },
  { id: 'dairy', name: 'Dairy', color: '#a8dadc', icon: '🥛' },
  { id: 'condiments', name: 'Condiments', color: '#d4a373', icon: '🧂' },
  { id: 'other', name: 'Other', color: '#b8b8d1', icon: '🍽️' },
];

// Macro colors for charts
export const MACRO_COLORS = {
  protein: '#ff6b6b',
  carbs: '#ffd93d',
  fat: '#6bcb77',
  fiber: '#a78bfa',
  calories: '#00d4aa',
};

// Micronutrient definitions with daily recommended values (adults)
export const MICRONUTRIENTS = [
  { key: 'vitaminA', name: 'Vitamin A', unit: 'mcg', daily: 900 },
  { key: 'vitaminC', name: 'Vitamin C', unit: 'mg', daily: 90 },
  { key: 'vitaminD', name: 'Vitamin D', unit: 'mcg', daily: 20 },
  { key: 'vitaminB12', name: 'Vitamin B12', unit: 'mcg', daily: 2.4 },
  { key: 'calcium', name: 'Calcium', unit: 'mg', daily: 1000 },
  { key: 'iron', name: 'Iron', unit: 'mg', daily: 18 },
  { key: 'potassium', name: 'Potassium', unit: 'mg', daily: 2600 },
  { key: 'sodium', name: 'Sodium', unit: 'mg', daily: 2300 },
  { key: 'zinc', name: 'Zinc', unit: 'mg', daily: 11 },
  { key: 'magnesium', name: 'Magnesium', unit: 'mg', daily: 420 },
];

// Default daily goals
export const DEFAULT_GOALS = {
  calories: 2500,
  protein: 150,
  carbs: 300,
  fat: 70,
  fiber: 30,
};

export const DEFAULT_PROFILE = {
  age: 30,
  gender: 'male',
  weight: 75,
  height: 175,
  activityLevel: 1.55, // Moderate
  goal: 'maintain',
  sleepHours: 8,
};

export const STARTER_FOODS = [
  {
    id: 'starter-chicken-breast', name: 'Chicken Breast (Cooked)', category: 'protein',
    servingSize: 100, servingUnit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0,
    vitaminA: 6, vitaminC: 0, vitaminD: 0.1, vitaminB12: 0.3, calcium: 11, iron: 0.7, potassium: 256, sodium: 74, zinc: 0.8, magnesium: 29,
  },
  {
    id: 'starter-chicken-thigh', name: 'Chicken Thigh (Cooked)', category: 'protein',
    servingSize: 100, servingUnit: 'g', calories: 209, protein: 26, carbs: 0, fat: 10.9, fiber: 0,
    vitaminA: 24, vitaminC: 0, vitaminD: 0.1, vitaminB12: 0.4, calcium: 11, iron: 1, potassium: 228, sodium: 85, zinc: 1.6, magnesium: 23,
  },
  {
    id: 'starter-whole-egg', name: 'Whole Egg (Large, 50g)', category: 'protein',
    servingSize: 1, servingUnit: 'piece', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, fiber: 0,
    vitaminA: 80, vitaminC: 0, vitaminD: 1.1, vitaminB12: 0.6, calcium: 28, iron: 0.9, potassium: 69, sodium: 71, zinc: 0.6, magnesium: 6,
  },
  {
    id: 'starter-egg-white', name: 'Egg White (1 large)', category: 'protein',
    servingSize: 1, servingUnit: 'piece', calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, fiber: 0,
    vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 2, iron: 0, potassium: 54, sodium: 55, zinc: 0, magnesium: 4,
  },
  {
    id: 'starter-salmon', name: 'Salmon (Atlantic, Cooked)', category: 'protein',
    servingSize: 100, servingUnit: 'g', calories: 208, protein: 20.4, carbs: 0, fat: 13.4, fiber: 0,
    vitaminA: 40, vitaminC: 0, vitaminD: 11.1, vitaminB12: 3.2, calcium: 12, iron: 0.8, potassium: 363, sodium: 44, zinc: 0.4, magnesium: 27,
    vitaminD: 11.1, vitaminB12: 3.2, calcium: 12, potassium: 363,
  },
  {
    id: 'starter-tuna', name: 'Tuna (Canned in Water)', category: 'protein',
    servingSize: 100, servingUnit: 'g', calories: 116, protein: 25.5, carbs: 0, fat: 0.8, fiber: 0,
    vitaminA: 15, vitaminC: 0, vitaminD: 1.1, vitaminB12: 2.5, calcium: 11, iron: 1.5, potassium: 237, sodium: 247, zinc: 0.7, magnesium: 27,
  },
  {
    id: 'starter-shrimp', name: 'Shrimp (Cooked)', category: 'protein',
    servingSize: 100, servingUnit: 'g', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0,
    vitaminA: 54, vitaminC: 0, vitaminD: 3.8, vitaminB12: 1.2, calcium: 52, iron: 0.5, potassium: 259, sodium: 111, zinc: 1.1, magnesium: 33,
  },
  {
    id: 'starter-beef-lean', name: 'Beef (Lean Ground, Cooked)', category: 'protein',
    servingSize: 100, servingUnit: 'g', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0,
    vitaminA: 0, vitaminC: 0, vitaminD: 0.1, vitaminB12: 2.6, calcium: 18, iron: 2.6, potassium: 318, sodium: 66, zinc: 6.3, magnesium: 21,
  },
  {
    id: 'starter-tofu', name: 'Soy Tofu (Firm)', category: 'protein',
    servingSize: 100, servingUnit: 'g', calories: 144, protein: 15.8, carbs: 2.8, fat: 8.7, fiber: 2.3,
    vitaminA: 0, vitaminC: 0.1, vitaminD: 0, vitaminB12: 0, calcium: 350, iron: 5.4, potassium: 121, sodium: 7, zinc: 1.6, magnesium: 30,
  },
  {
    id: 'starter-buff-minced', name: 'Buff Minced (10% fat)', category: 'protein',
    servingSize: 100, servingUnit: 'g', calories: 175, protein: 20, carbs: 0, fat: 10, fiber: 0,
    vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 2, calcium: 15, iron: 2.5, potassium: 300, sodium: 70, zinc: 5, magnesium: 20,
  },
  {
    id: 'starter-white-rice', name: 'White Rice (Cooked)', category: 'carbs',
    servingSize: 100, servingUnit: 'g', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4,
    vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 10, iron: 1.2, potassium: 35, sodium: 1, zinc: 0.4, magnesium: 12,
  },
  {
    id: 'starter-yellow-dal', name: 'Yellow Dal / Moong (Cooked)', category: 'protein',
    servingSize: 100, servingUnit: 'g', calories: 105, protein: 7.1, carbs: 19.1, fat: 0.4, fiber: 7.6,
    vitaminA: 2, vitaminC: 1, vitaminD: 0, vitaminB12: 0, calcium: 14, iron: 1.4, potassium: 266, sodium: 172, zinc: 0.9, magnesium: 28,
  },
  {
    id: 'starter-masoor-dal', name: 'Masoor Dal / Red Lentils (Cooked)', category: 'protein',
    servingSize: 100, servingUnit: 'g', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8,
    vitaminA: 2, vitaminC: 1.5, vitaminD: 0, vitaminB12: 0, calcium: 19, iron: 3.3, potassium: 369, sodium: 2, zinc: 1.3, magnesium: 36,
  },
  {
    id: 'starter-boiled-potato', name: 'Boiled Potato', category: 'carbs',
    servingSize: 100, servingUnit: 'g', calories: 87, protein: 1.9, carbs: 20.1, fat: 0.1, fiber: 1.8,
    vitaminA: 0, vitaminC: 13, vitaminD: 0, vitaminB12: 0, calcium: 5, iron: 0.3, potassium: 328, sodium: 5, zinc: 0.3, magnesium: 20,
  },
  {
    id: 'starter-brown-bread', name: 'Brown Bread', category: 'carbs',
    servingSize: 1, servingUnit: 'piece', calories: 85, protein: 3.5, carbs: 15.5, fat: 1.5, fiber: 2.5,
    vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 30, iron: 0.8, potassium: 70, sodium: 150, zinc: 0.6, magnesium: 20,
  },
  {
    id: 'starter-white-bread', name: 'White Bread', category: 'carbs',
    servingSize: 1, servingUnit: 'piece', calories: 80, protein: 2.7, carbs: 15, fat: 1, fiber: 0.8,
    vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 40, iron: 1, potassium: 30, sodium: 130, zinc: 0.2, magnesium: 6,
  },
  {
    id: 'starter-multigrain-bread', name: 'Multi Grain Bread', category: 'carbs',
    servingSize: 1, servingUnit: 'piece', calories: 92, protein: 4.5, carbs: 16, fat: 1.5, fiber: 3,
    vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 35, iron: 0.9, potassium: 80, sodium: 140, zinc: 0.7, magnesium: 25,
  },
  {
    id: 'starter-butter', name: 'Butter', category: 'fats',
    servingSize: 1, servingUnit: 'g', calories: 7.2, protein: 0.01, carbs: 0.01, fat: 0.81, fiber: 0,
    vitaminA: 6.8, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 0.2, iron: 0, potassium: 0.2, sodium: 6, zinc: 0, magnesium: 0,
  },
  {
    id: 'starter-olive-oil', name: 'Olive Oil', category: 'fats',
    servingSize: 1, servingUnit: 'tbsp', calories: 119, protein: 0, carbs: 0, fat: 13.5, fiber: 0,
    vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 0, iron: 0, potassium: 0, sodium: 0, zinc: 0, magnesium: 0,
  },
  {
    id: 'starter-mustard-oil', name: 'Mustard Oil', category: 'fats',
    servingSize: 1, servingUnit: 'tbsp', calories: 124, protein: 0, carbs: 0, fat: 14, fiber: 0,
    vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 0, iron: 0, potassium: 0, sodium: 0, zinc: 0, magnesium: 0,
  },
  {
    id: 'starter-curd', name: 'Curd (Dahi)', category: 'dairy',
    servingSize: 100, servingUnit: 'g', calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0,
    vitaminA: 20, vitaminC: 0.5, vitaminD: 0.1, vitaminB12: 0.4, calcium: 120, iron: 0.1, potassium: 150, sodium: 40, zinc: 0.6, magnesium: 12,
  },
  {
    id: 'starter-broccoli', name: 'Broccoli', category: 'vegetables',
    servingSize: 100, servingUnit: 'g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6,
    vitaminA: 31, vitaminC: 89, vitaminD: 0, vitaminB12: 0, calcium: 47, iron: 0.7, potassium: 316, sodium: 33, zinc: 0.4, magnesium: 21,
  },
  {
    id: 'starter-cucumber', name: 'Cucumber', category: 'vegetables',
    servingSize: 100, servingUnit: 'g', calories: 15, protein: 0.6, carbs: 3.6, fat: 0.1, fiber: 0.5,
    vitaminA: 5, vitaminC: 2.8, vitaminD: 0, vitaminB12: 0, calcium: 16, iron: 0.3, potassium: 147, sodium: 2, zinc: 0.2, magnesium: 13,
  },
  {
    id: 'starter-carrot', name: 'Carrot', category: 'vegetables',
    servingSize: 100, servingUnit: 'g', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8,
    vitaminA: 835, vitaminC: 5.9, vitaminD: 0, vitaminB12: 0, calcium: 33, iron: 0.3, potassium: 320, sodium: 69, zinc: 0.2, magnesium: 12,
  },
  {
    id: 'starter-onion', name: 'Onion', category: 'vegetables',
    servingSize: 100, servingUnit: 'g', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7,
    vitaminA: 0, vitaminC: 7.4, vitaminD: 0, vitaminB12: 0, calcium: 23, iron: 0.2, potassium: 146, sodium: 4, zinc: 0.2, magnesium: 10,
  },
  {
    id: 'starter-garlic', name: 'Garlic', category: 'condiments',
    servingSize: 10, servingUnit: 'g', calories: 15, protein: 0.6, carbs: 3.3, fat: 0, fiber: 0.2,
    vitaminA: 0, vitaminC: 3.1, vitaminD: 0, vitaminB12: 0, calcium: 18, iron: 0.2, potassium: 40, sodium: 2, zinc: 0.1, magnesium: 2,
  },
  {
    id: 'starter-ginger', name: 'Ginger', category: 'condiments',
    servingSize: 10, servingUnit: 'g', calories: 8, protein: 0.2, carbs: 1.8, fat: 0.1, fiber: 0.2,
    vitaminA: 0, vitaminC: 0.5, vitaminD: 0, vitaminB12: 0, calcium: 1.6, iron: 0.1, potassium: 41, sodium: 1, zinc: 0, magnesium: 4,
  },
  {
    id: 'starter-apple', name: 'Apple', category: 'fruits',
    servingSize: 100, servingUnit: 'g', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4,
    vitaminA: 3, vitaminC: 4.6, vitaminD: 0, vitaminB12: 0, calcium: 6, iron: 0.1, potassium: 107, sodium: 1, zinc: 0, magnesium: 5,
  },
  {
    id: 'starter-chickpeas-sprout', name: 'Chickpeas Sprout', category: 'vegetables',
    servingSize: 100, servingUnit: 'g', calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 3,
    vitaminA: 2, vitaminC: 11, vitaminD: 0, vitaminB12: 0, calcium: 49, iron: 2.9, potassium: 291, sodium: 24, zinc: 1.5, magnesium: 48,
  },
  {
    id: 'starter-watermelon', name: 'Watermelon', category: 'fruits',
    servingSize: 100, servingUnit: 'g', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.1, fiber: 0.4,
    vitaminA: 28, vitaminC: 8.1, vitaminD: 0, vitaminB12: 0, calcium: 7, iron: 0.2, potassium: 112, sodium: 1, zinc: 0.1, magnesium: 10,
  },
  {
    id: 'starter-avocado', name: 'Avocado', category: 'fats',
    servingSize: 100, servingUnit: 'g', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7,
    vitaminA: 7, vitaminC: 10, vitaminD: 0, vitaminB12: 0, calcium: 12, iron: 0.5, potassium: 485, sodium: 7, zinc: 0.6, magnesium: 29,
  },
  {
    id: 'starter-paneer', name: 'Paneer (Full Fat)', category: 'dairy',
    servingSize: 100, servingUnit: 'g', calories: 296, protein: 14, carbs: 3.4, fat: 25, fiber: 0,
    vitaminA: 200, vitaminC: 0, vitaminD: 0.5, vitaminB12: 0.8, calcium: 480, iron: 0.5, potassium: 100, sodium: 20, zinc: 2, magnesium: 20,
  },
  {
    id: 'starter-soya-chunks-boiled', name: 'Boiled Soya Chunks', category: 'protein',
    servingSize: 100, servingUnit: 'g', calories: 115, protein: 17, carbs: 11, fat: 0.3, fiber: 4,
    vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 90, iron: 4.5, potassium: 500, sodium: 5, zinc: 1.5, magnesium: 85,
  },
  {
    id: 'starter-tomato', name: 'Tomato', category: 'vegetables',
    servingSize: 100, servingUnit: 'g', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2,
    vitaminA: 42, vitaminC: 14, vitaminD: 0, vitaminB12: 0, calcium: 10, iron: 0.3, potassium: 237, sodium: 5, zinc: 0.2, magnesium: 11,
  },
  {
    id: 'starter-salt', name: 'Salt', category: 'condiments',
    servingSize: 1, servingUnit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
    vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 0, iron: 0, potassium: 0, sodium: 387, zinc: 0, magnesium: 0,
  },
  {
    id: 'starter-mixed-masala', name: 'Mixed Masala (Jeera & Dhania)', category: 'condiments',
    servingSize: 5, servingUnit: 'g', calories: 15, protein: 0.7, carbs: 2.5, fat: 0.7, fiber: 1.5,
    vitaminA: 0, vitaminC: 1, vitaminD: 0, vitaminB12: 0, calcium: 40, iron: 1, potassium: 60, sodium: 3, zinc: 0.2, magnesium: 10,
  }
];

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Format date to YYYY-MM-DD
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Get today's date string
export const getToday = () => formatDate(new Date());
