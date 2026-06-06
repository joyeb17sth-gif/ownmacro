import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { generateSingleMeal } from '../utils/recommendationEngine';
import { getToday } from '../utils/constants';
import Modal from './Modal';
import { RefreshCw, Check, AlertCircle, Search, CheckSquare, Square, ChevronRight, ChevronLeft } from 'lucide-react';
import './MealPlannerModal.css';

const MealPlannerModal = ({ isOpen, onClose, targetDate }) => {
  const { goals, meals, foods, foodsMap, logMealToDay, addMeal } = useApp();
  
  // Steps: 1 = Pantry Selection, 2 = Results
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [search, setSearch] = useState('');
  
  // Load from localStorage or default to empty
  const [availableFoodIds, setAvailableFoodIds] = useState(() => {
    try {
      const saved = localStorage.getItem('ownmacro_pantry');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ownmacro_pantry', JSON.stringify(availableFoodIds));
  }, [availableFoodIds]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPlan(null);
      setSearch('');
    }
  }, [isOpen]);

  const toggleFood = (id) => {
    setAvailableFoodIds(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (availableFoodIds.length === foods.length) {
      setAvailableFoodIds([]);
    } else {
      setAvailableFoodIds(foods.map(f => f.id));
    }
  };

  const filteredFoods = useMemo(() => {
    return foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  }, [foods, search]);

  const generatePlan = () => {
    setStep(2);
    setIsGenerating(true);
    setTimeout(() => {
      const newPlan = generateSingleMeal(goals, meals, foodsMap, availableFoodIds, 5000);
      setPlan(newPlan);
      setIsGenerating(false);
    }, 50);
  };

  const handleApply = () => {
    if (!plan) return;

    // Apply the meals to the tracker
    plan.meals.forEach(meal => {
      if (meal.isVirtual) {
        // If it's a virtual/auto-generated meal, we need to save it to the DB first
        const { isVirtual, macros, ...mealDataToSave } = meal;
        // Generate a new ID by saving it
        const savedMeal = { ...mealDataToSave, id: 'meal-' + Date.now() + Math.random().toString(36).substr(2, 5) };
        const addedMeal = addMeal(savedMeal);
        logMealToDay(addedMeal.id, targetDate || getToday());
      } else {
        // It's an existing saved meal
        logMealToDay(meal.id, targetDate || getToday());
      }
    });

    onClose();
  };

  const renderMacroComparison = () => {
    if (!plan || !plan.targetGoals) return null;
    
    const tg = plan.targetGoals;
    const diffCal = plan.macros.calories - tg.calories;
    const diffPro = plan.macros.protein - tg.protein;
    const diffCarb = plan.macros.carbs - tg.carbs;
    const diffFat = plan.macros.fat - tg.fat;

    const renderStat = (label, current, goal, diff, colorVar) => (
      <div className="planner-stat">
        <div className="planner-stat__label" style={{ color: `var(${colorVar})` }}>{label}</div>
        <div className="planner-stat__values">
          <span className="planner-stat__current">{Math.round(current)}</span>
          <span className="planner-stat__separator">/</span>
          <span className="planner-stat__goal">{Math.round(goal)}</span>
        </div>
        <div className={`planner-stat__diff ${Math.abs(diff) <= (goal * 0.1) ? 'text-success' : 'text-warning'}`}>
          {diff > 0 ? '+' : ''}{Math.round(diff)}
        </div>
      </div>
    );

    return (
      <div className="planner-comparison glass-card">
        <h4 className="planner-comparison__title">Suggested Meal vs Targets</h4>
        <div className="planner-comparison__grid">
          {renderStat('Calories', plan.macros.calories, tg.calories, diffCal, '--color-calories')}
          {renderStat('Protein', plan.macros.protein, tg.protein, diffPro, '--color-protein')}
          {renderStat('Carbs', plan.macros.carbs, tg.carbs, diffCarb, '--color-carbs')}
          {renderStat('Fat', plan.macros.fat, tg.fat, diffFat, '--color-fat')}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="planner-step-1">
      <p className="text-muted">
        Select the ingredients you currently have in your kitchen. The algorithm will only recommend meals using these items.
      </p>

      <div className="planner-pantry-controls">
        <div className="planner-search">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            className="form-input"
            placeholder="Search foods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary btn-sm" onClick={toggleAll}>
          {availableFoodIds.length === foods.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="planner-pantry-grid">
        {filteredFoods.map(food => {
          const isSelected = availableFoodIds.includes(food.id);
          return (
            <div 
              key={food.id} 
              className={`planner-pantry-item ${isSelected ? 'planner-pantry-item--selected' : ''}`}
              onClick={() => toggleFood(food.id)}
            >
              <div className="planner-pantry-item__checkbox">
                {isSelected ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} className="text-muted" />}
              </div>
              <span className="planner-pantry-item__name">{food.name}</span>
            </div>
          );
        })}
      </div>

      <div className="planner-actions">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button 
          className="btn btn-primary" 
          onClick={generatePlan}
          disabled={availableFoodIds.length === 0}
        >
          <span>Suggest Meal</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="planner-step-2">
      {isGenerating ? (
        <div className="planner-loading">
          <RefreshCw className="spinner text-primary" size={32} />
          <p>Crunching the numbers...</p>
        </div>
      ) : plan ? (
        <>
          {renderMacroComparison()}

          <div className="planner-meals">
            <h4 className="planner-meals__title">Your Suggested Meal</h4>
            <div className="planner-meals__list">
              {plan.meals.map((meal, index) => (
                <div key={meal.id + index} className="planner-meal-card glass-card">
                  <div className="planner-meal-card__header">
                    <span className="planner-meal-card__name">{meal.name}</span>
                    {meal.isVirtual && <span className="badge badge-primary">Auto-Generated</span>}
                  </div>
                  
                  <div className="planner-meal-card__items">
                    {meal.items.map((item, i) => {
                      const food = foodsMap[item.foodId];
                      if (!food) return null;
                      
                      let displayQty = item.quantity;
                      if (food.servingUnit === 'tbsp') {
                        if (displayQty === 0.5) displayQty = '1/2';
                        else if (displayQty === 1.5) displayQty = '1 1/2';
                        else if (displayQty === 2.5) displayQty = '2 1/2';
                      }

                      return (
                        <div key={i} className="planner-meal-card__item text-muted text-sm">
                          • {displayQty}{food.servingUnit} {food.name}
                        </div>
                      );
                    })}
                  </div>

                  <div className="planner-meal-card__macros">
                    <span style={{ color: 'var(--color-calories)' }}>{Math.round(meal.macros.calories)} kcal</span>
                    <span style={{ color: 'var(--color-protein)' }}>{Math.round(meal.macros.protein)}g P</span>
                    <span style={{ color: 'var(--color-carbs)' }}>{Math.round(meal.macros.carbs)}g C</span>
                    <span style={{ color: 'var(--color-fat)' }}>{Math.round(meal.macros.fat)}g F</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="planner-actions">
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              <ChevronLeft size={16} />
              Back
            </button>
            <button className="btn btn-secondary" onClick={generatePlan}>
              <RefreshCw size={16} />
              Reroll Meal
            </button>
            <button className="btn btn-primary" onClick={handleApply}>
              <Check size={16} />
              Log this Meal
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <AlertCircle size={32} className="text-warning" />
          <p>Unable to generate a plan. You might have deselected too many essential items.</p>
          <button className="btn btn-secondary mt-md" onClick={() => setStep(1)}>Back to Pantry</button>
        </div>
      )}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={step === 1 ? "What's in your pantry?" : "Your Suggested Meal"} size="lg">
      <div className="meal-planner">
        {step === 1 ? renderStep1() : renderStep2()}
      </div>
    </Modal>
  );
};

export default MealPlannerModal;
