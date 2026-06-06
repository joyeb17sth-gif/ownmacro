import { useMemo } from 'react';
import { calculateMealNutrition, calculateDailyNutrition } from '../utils/nutrition';

/**
 * Hook to calculate nutrition for a meal's items
 */
export const useMealNutrition = (mealItems, foodsMap) => {
  return useMemo(() => {
    if (!mealItems || mealItems.length === 0 || !foodsMap) {
      return {
        calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
        vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0,
        calcium: 0, iron: 0, potassium: 0, sodium: 0, zinc: 0, magnesium: 0,
      };
    }
    return calculateMealNutrition(mealItems, foodsMap);
  }, [mealItems, foodsMap]);
};

/**
 * Hook to calculate daily nutrition from meals
 */
export const useDailyNutrition = (meals, foodsMap) => {
  return useMemo(() => {
    if (!meals || meals.length === 0 || !foodsMap) {
      return {
        calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
        vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0,
        calcium: 0, iron: 0, potassium: 0, sodium: 0, zinc: 0, magnesium: 0,
      };
    }
    return calculateDailyNutrition(meals, foodsMap);
  }, [meals, foodsMap]);
};
