import { generateId } from './constants';

const calculateMealMacros = (meal, foodsMap) => {
  let calories = 0, protein = 0, carbs = 0, fat = 0;
  meal.items.forEach(item => {
    const food = foodsMap[item.foodId];
    if (food) {
      const ratio = item.quantity / food.servingSize;
      calories += food.calories * ratio;
      protein += food.protein * ratio;
      carbs += food.carbs * ratio;
      fat += food.fat * ratio;
    }
  });
  return { calories, protein, carbs, fat };
};

const calculatePlanMacros = (plan, foodsMap) => {
  let calories = 0, protein = 0, carbs = 0, fat = 0;
  plan.forEach(meal => {
    const macros = meal.macros || calculateMealMacros(meal, foodsMap);
    calories += macros.calories;
    protein += macros.protein;
    carbs += macros.carbs;
    fat += macros.fat;
  });
  return { calories, protein, carbs, fat };
};

const scorePlan = (macros, goals) => {
  if (!goals.calories || !goals.protein) return 999999;
  
  // Percentage diffs
  const calDiff = Math.abs(macros.calories - goals.calories) / goals.calories;
  const proDiff = Math.abs(macros.protein - goals.protein) / goals.protein;
  const carbDiff = Math.abs(macros.carbs - goals.carbs) / goals.carbs;
  const fatDiff = Math.abs(macros.fat - goals.fat) / goals.fat;

  // Weight protein and calories slightly higher
  return (calDiff * 1.5) + (proDiff * 1.5) + carbDiff + fatDiff;
};

// Generates a random virtual meal from raw ingredients, scaled towards targets
const generateVirtualMeal = (foodsList, mealGoals) => {
  const proteins = foodsList.filter(f => f.category === 'protein');
  const carbs = foodsList.filter(f => f.category === 'carbs');
  const vegetables = foodsList.filter(f => f.category === 'vegetables');
  const fats = foodsList.filter(f => f.category === 'fats');

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  const items = [];
  
  // 1 Protein
  if (proteins.length > 0 && mealGoals.protein > 0) {
    const p = pickRandom(proteins);
    if (p.protein > 0) {
      const targetQty = (mealGoals.protein / p.protein) * p.servingSize;
      let qty = targetQty * (0.8 + Math.random() * 0.4);
      if (p.servingUnit === 'piece') {
        qty = Math.max(1, Math.round(qty));
        qty = Math.min(qty, 5); // Cap eggs or similar at 5 pieces max
      } else {
        qty = Math.max(10, Math.floor(qty));
      }
      items.push({ foodId: p.id, quantity: qty });
    } else {
      items.push({ foodId: p.id, quantity: p.servingUnit === 'piece' ? 1 : 100 });
    }
  }
  
  // 1 Carb
  if (carbs.length > 0 && mealGoals.carbs > 0) {
    const c = pickRandom(carbs);
    if (c.carbs > 0) {
      const targetQty = (mealGoals.carbs / c.carbs) * c.servingSize;
      let qty = targetQty * (0.8 + Math.random() * 0.4);
      if (c.servingUnit === 'piece') {
        qty = Math.max(1, Math.round(qty));
        // Cap pieces of bread or similar at 4 max for a single meal
        qty = Math.min(qty, 4);
      } else {
        qty = Math.max(10, Math.floor(qty));
      }
      items.push({ foodId: c.id, quantity: qty });
    } else {
      items.push({ foodId: c.id, quantity: c.servingUnit === 'piece' ? 1 : 100 });
    }
  }

  // 1 Veggie
  if (vegetables.length > 0) {
    const v = pickRandom(vegetables);
    items.push({ foodId: v.id, quantity: v.servingUnit === 'piece' ? Math.max(1, Math.floor(Math.random() * 2) + 1) : Math.floor(Math.random() * 100) + 50 });
  }

  // 1 Fat
  if (fats.length > 0 && mealGoals.fat > 0) {
    const f = pickRandom(fats);
    if (f.fat > 0) {
      const targetQty = (mealGoals.fat / f.fat) * f.servingSize;
      let qty = targetQty * (0.8 + Math.random() * 0.4);
      
      if (f.servingUnit === 'tbsp') {
        // Allow half tablespoons, min 0.5, max 3
        qty = Math.round(qty * 2) / 2;
        qty = Math.max(0.5, qty);
        qty = Math.min(qty, 3);
      } else if (f.servingUnit === 'piece') {
        qty = Math.max(1, Math.round(qty));
        qty = Math.min(qty, 3); // Cap fat pieces
      } else {
        qty = Math.max(5, Math.floor(qty));
      }
      items.push({ foodId: f.id, quantity: qty });
    } else {
      items.push({ foodId: f.id, quantity: f.servingUnit === 'piece' ? 1 : (f.servingUnit === 'tbsp' ? 0.5 : 10) });
    }
  }

  // All available condiments (always add 1 serving of each if available)
  const condiments = foodsList.filter(f => f.category === 'condiments');
  condiments.forEach(c => {
    // Add 1 standard serving of each spice/condiment for flavor
    items.push({ foodId: c.id, quantity: c.servingSize });
  });

  return {
    id: 'virtual-' + generateId(),
    name: 'Auto-Generated Meal',
    isVirtual: true,
    items
  };
};

export const generateSingleMeal = (goals, savedMeals, foodsMap, availableFoodIds, iterations = 2000) => {
  const mealGoals = {
    calories: goals.calories / 3,
    protein: goals.protein / 3,
    carbs: goals.carbs / 3,
    fat: goals.fat / 3
  };

  const foodsList = Object.values(foodsMap).filter(f => availableFoodIds.includes(f.id));
  
  const candidateSavedMeals = savedMeals.filter(meal => 
    meal.items.every(item => availableFoodIds.includes(item.foodId))
  );

  let bestMeal = null;
  let bestScore = Infinity;

  // Check saved meals first
  candidateSavedMeals.forEach(meal => {
    const macros = calculateMealMacros(meal, foodsMap);
    const score = scorePlan(macros, mealGoals);
    if (score < bestScore) {
      bestScore = score;
      bestMeal = { ...meal, macros, isVirtual: false };
    }
  });

  // Then randomly generate virtual meals
  for (let i = 0; i < iterations; i++) {
    const vMeal = generateVirtualMeal(foodsList, mealGoals);
    const macros = calculateMealMacros(vMeal, foodsMap);
    const score = scorePlan(macros, mealGoals);

    if (score < bestScore) {
      bestScore = score;
      bestMeal = { ...vMeal, macros, isVirtual: true };
    }
  }

  if (!bestMeal) return null;

  return {
    meals: [bestMeal],
    macros: bestMeal.macros,
    score: bestScore,
    targetGoals: mealGoals
  };
};
