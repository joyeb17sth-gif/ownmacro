import { createContext, useContext, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STARTER_FOODS, DEFAULT_GOALS, DEFAULT_PROFILE, generateId, getToday } from '../utils/constants';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [foods, setFoods] = useLocalStorage('ownmacro-foods', STARTER_FOODS);
  const [meals, setMeals] = useLocalStorage('ownmacro-meals', []);
  const [dailyLogs, setDailyLogs] = useLocalStorage('ownmacro-daily-logs', {});
  const [goals, setGoals] = useLocalStorage('ownmacro-goals', DEFAULT_GOALS);
  const [profile, setProfile] = useLocalStorage('ownmacro-profile', DEFAULT_PROFILE);
  const [savedMeals, setSavedMeals] = useLocalStorage('ownmacro-saved-meals', []);

  // Foods map for quick lookup
  const foodsMap = useMemo(() => {
    const map = {};
    foods.forEach(food => { map[food.id] = food; });
    return map;
  }, [foods]);

  // Sync new starter foods and unit updates if they don't match local storage
  useEffect(() => {
    setFoods(prev => {
      let changed = false;
      const currentFoodIds = new Set(prev.map(f => f.id));
      const newFoods = [];

      // Find entirely missing foods
      STARTER_FOODS.forEach(starter => {
        if (!currentFoodIds.has(starter.id)) {
          newFoods.push(starter);
          changed = true;
        }
      });

      // Find existing foods that need unit updates or missing micronutrients
      const updatedFoods = prev.filter(food => {
        if (food.name === 'Whole Egg' && food.id !== 'starter-whole-egg') {
          changed = true;
          return false;
        }
        return true;
      }).map(food => {
        const starterMatch = STARTER_FOODS.find(s => s.id === food.id);
        if (starterMatch) {
          // Check if any property in starterMatch is missing in food, or if units differ
          let needsUpdate = false;
          const updatedFood = { ...food };
          for (const key of Object.keys(starterMatch)) {
            // Overwrite if it's missing, NaN, 0, or null and the starter has a real value
            const currentVal = food[key];
            if ((currentVal === undefined || currentVal === null || currentVal === '' || Number.isNaN(currentVal) || (currentVal === 0 && starterMatch[key] > 0)) && starterMatch[key] !== undefined) {
              needsUpdate = true;
              updatedFood[key] = starterMatch[key];
            }
          }
          if (food.servingUnit !== starterMatch.servingUnit || food.servingSize !== starterMatch.servingSize) {
            needsUpdate = true;
            updatedFood.servingUnit = starterMatch.servingUnit;
            updatedFood.servingSize = starterMatch.servingSize;
          }
          if (needsUpdate) {
            changed = true;
            return updatedFood;
          }
        }
        return food;
      });

      if (changed) {
        return [...updatedFoods, ...newFoods];
      }
      return prev;
    });
  }, [setFoods]);

  // ---- FOOD CRUD ----
  const addFood = useCallback((food) => {
    const newFood = { ...food, id: generateId() };
    setFoods(prev => [...prev, newFood]);
    return newFood;
  }, [setFoods]);

  const updateFood = useCallback((id, updates) => {
    setFoods(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }, [setFoods]);

  const deleteFood = useCallback((id) => {
    setFoods(prev => prev.filter(f => f.id !== id));
  }, [setFoods]);

  // ---- MEAL CRUD ----
  const addMeal = useCallback((meal) => {
    const newMeal = { ...meal, id: generateId(), createdAt: new Date().toISOString() };
    setMeals(prev => [...prev, newMeal]);
    return newMeal;
  }, [setMeals]);

  const updateMeal = useCallback((id, updates) => {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, [setMeals]);

  const deleteMeal = useCallback((id) => {
    setMeals(prev => prev.filter(m => m.id !== id));
    // Also remove from daily logs
    setDailyLogs(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(date => {
        updated[date] = updated[date].filter(mealId => mealId !== id);
        if (updated[date].length === 0) delete updated[date];
      });
      return updated;
    });
  }, [setMeals, setDailyLogs]);

  // ---- DAILY LOG ----
  const logMealToDay = useCallback((mealId, date = getToday()) => {
    setDailyLogs(prev => ({
      ...prev,
      [date]: [...(prev[date] || []), mealId],
    }));
  }, [setDailyLogs]);

  const removeMealFromDay = useCallback((mealId, date = getToday()) => {
    setDailyLogs(prev => {
      const dayMeals = (prev[date] || []).filter(id => id !== mealId);
      const updated = { ...prev };
      if (dayMeals.length === 0) {
        delete updated[date];
      } else {
        updated[date] = dayMeals;
      }
      return updated;
    });
  }, [setDailyLogs]);

  const getMealsForDay = useCallback((date = getToday()) => {
    const mealIds = dailyLogs[date] || [];
    return mealIds.map(id => meals.find(m => m.id === id)).filter(Boolean);
  }, [dailyLogs, meals]);

  // ---- SAVED MEALS ----
  const saveMealTemplate = useCallback((meal) => {
    const template = { ...meal, id: generateId(), isSaved: true, savedAt: new Date().toISOString() };
    setSavedMeals(prev => [...prev, template]);
    return template;
  }, [setSavedMeals]);

  const deleteSavedMeal = useCallback((id) => {
    setSavedMeals(prev => prev.filter(m => m.id !== id));
  }, [setSavedMeals]);

  // ---- GOALS & PROFILE ----
  const updateGoals = useCallback((newGoals) => {
    setGoals(prev => ({ ...prev, ...newGoals }));
  }, [setGoals]);

  const updateProfile = useCallback((newProfile) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  }, [setProfile]);

  // ---- EXPORT / IMPORT ----
  const exportData = useCallback(() => {
    const data = {
      foods,
      meals,
      dailyLogs,
      goals,
      profile,
      savedMeals,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ownmacro-backup-${getToday()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [foods, meals, dailyLogs, goals, savedMeals]);

  const importData = useCallback((jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.foods) setFoods(data.foods);
      if (data.meals) setMeals(data.meals);
      if (data.dailyLogs) setDailyLogs(data.dailyLogs);
      if (data.goals) setGoals(data.goals);
      if (data.profile) setProfile(data.profile);
      if (data.savedMeals) setSavedMeals(data.savedMeals);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }, [setFoods, setMeals, setDailyLogs, setGoals, setSavedMeals]);

  const value = {
    // Data
    foods,
    foodsMap,
    meals,
    dailyLogs,
    goals,
    profile,
    savedMeals,
    // Food operations
    addFood,
    updateFood,
    deleteFood,
    // Meal operations
    addMeal,
    updateMeal,
    deleteMeal,
    // Daily log operations
    logMealToDay,
    removeMealFromDay,
    getMealsForDay,
    // Saved meals
    saveMealTemplate,
    deleteSavedMeal,
    // Goals & Profile
    updateGoals,
    updateProfile,
    // Export/Import
    exportData,
    importData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
