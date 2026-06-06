import { MICRONUTRIENTS } from './constants';

/**
 * Calculate nutrition totals for a single food item at a given quantity
 */
export const calculateFoodNutrition = (food, quantity) => {
  const ratio = quantity / food.servingSize;
  
  const result = {
    calories: Math.round(food.calories * ratio * 10) / 10,
    protein: Math.round(food.protein * ratio * 10) / 10,
    carbs: Math.round(food.carbs * ratio * 10) / 10,
    fat: Math.round(food.fat * ratio * 10) / 10,
    fiber: Math.round((food.fiber || 0) * ratio * 10) / 10,
  };

  // Calculate micros
  MICRONUTRIENTS.forEach(({ key }) => {
    result[key] = Math.round((food[key] || 0) * ratio * 100) / 100;
  });

  return result;
};

/**
 * Calculate total nutrition for a meal (array of items with foodId + quantity)
 */
export const calculateMealNutrition = (mealItems, foodsMap) => {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  };

  MICRONUTRIENTS.forEach(({ key }) => {
    totals[key] = 0;
  });

  mealItems.forEach(item => {
    const food = foodsMap[item.foodId];
    if (!food) return;
    
    const nutrition = calculateFoodNutrition(food, item.quantity);
    
    Object.keys(totals).forEach(key => {
      totals[key] += nutrition[key] || 0;
    });
  });

  // Round all values
  Object.keys(totals).forEach(key => {
    totals[key] = Math.round(totals[key] * 10) / 10;
  });

  return totals;
};

/**
 * Calculate daily totals from an array of meals
 */
export const calculateDailyNutrition = (meals, foodsMap) => {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  };

  MICRONUTRIENTS.forEach(({ key }) => {
    totals[key] = 0;
  });

  meals.forEach(meal => {
    const mealNutrition = calculateMealNutrition(meal.items, foodsMap);
    Object.keys(totals).forEach(key => {
      totals[key] += mealNutrition[key] || 0;
    });
  });

  // Round all values
  Object.keys(totals).forEach(key => {
    totals[key] = Math.round(totals[key] * 10) / 10;
  });

  return totals;
};

/**
 * Get percentage of goal achieved
 */
export const getPercentageOfGoal = (value, goal) => {
  if (!goal || goal === 0) return 0;
  return Math.min(Math.round((value / goal) * 100), 100);
};

/**
 * Get macro split percentages (for pie/donut charts)
 */
export const getMacroSplit = (nutrition) => {
  const proteinCal = (nutrition.protein || 0) * 4;
  const carbsCal = (nutrition.carbs || 0) * 4;
  const fatCal = (nutrition.fat || 0) * 9;
  const total = proteinCal + carbsCal + fatCal;

  if (total === 0) return { protein: 0, carbs: 0, fat: 0 };

  return {
    protein: Math.round((proteinCal / total) * 100),
    carbs: Math.round((carbsCal / total) * 100),
    fat: Math.round((fatCal / total) * 100),
  };
};
