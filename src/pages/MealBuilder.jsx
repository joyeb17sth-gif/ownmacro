import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FOOD_CATEGORIES, getToday } from '../utils/constants';
import { calculateMealNutrition, getMacroSplit } from '../utils/nutrition';
import NutritionTable from '../components/NutritionTable';
import MacroRing from '../components/MacroRing';
import { Search, Plus, Minus, Trash2, Save, Calendar, BookmarkPlus, Bookmark } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './MealBuilder.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const MealBuilder = () => {
  const { foods, foodsMap, addMeal, logMealToDay, savedMeals, saveMealTemplate, deleteSavedMeal, goals, meals, updateMeal } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editMealId = searchParams.get('edit');
  
  const [mealName, setMealName] = useState('');
  const [mealItems, setMealItems] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showSaved, setShowSaved] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Load meal for editing
  useEffect(() => {
    if (editMealId) {
      const mealToEdit = meals.find(m => m.id === editMealId);
      if (mealToEdit) {
        setMealName(mealToEdit.name);
        setMealItems([...mealToEdit.items]);
      }
    }
  }, [editMealId, meals]);

  // Filter foods
  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'all' || food.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [foods, search, activeCategory]);

  // Calculate nutrition
  const nutrition = useMemo(() => {
    return calculateMealNutrition(mealItems, foodsMap);
  }, [mealItems, foodsMap]);

  const macroSplit = getMacroSplit(nutrition);

  // Donut chart data
  const chartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [
        nutrition.protein * 4,
        nutrition.carbs * 4,
        nutrition.fat * 9,
      ],
      backgroundColor: [
        'rgba(255, 107, 107, 0.8)',
        'rgba(255, 217, 61, 0.8)',
        'rgba(107, 203, 119, 0.8)',
      ],
      borderColor: [
        'rgba(255, 107, 107, 1)',
        'rgba(255, 217, 61, 1)',
        'rgba(107, 203, 119, 1)',
      ],
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 22, 39, 0.9)',
        titleColor: '#e8ecf4',
        bodyColor: '#8892a8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${Math.round(ctx.raw)} kcal (${macroSplit[ctx.label.toLowerCase()]}%)`,
        },
      },
    },
  };

  const addFoodToMeal = (food) => {
    const existing = mealItems.find(item => item.foodId === food.id);
    if (existing) {
      setMealItems(prev =>
        prev.map(item =>
          item.foodId === food.id
            ? { ...item, quantity: item.quantity + food.servingSize }
            : item
        )
      );
    } else {
      setMealItems(prev => [...prev, {
        foodId: food.id,
        quantity: food.servingSize,
        unit: food.servingUnit,
      }]);
    }
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFoodFromMeal(foodId);
      return;
    }
    setMealItems(prev =>
      prev.map(item =>
        item.foodId === foodId ? { ...item, quantity } : item
      )
    );
  };

  const removeFoodFromMeal = (foodId) => {
    setMealItems(prev => prev.filter(item => item.foodId !== foodId));
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleLogMeal = () => {
    if (mealItems.length === 0) return;
    
    if (editMealId) {
      updateMeal(editMealId, { name: mealName.trim() || 'Updated Meal', items: [...mealItems] });
      showSuccess('Meal updated! ✅');
      setTimeout(() => navigate('/tracker'), 1000);
    } else {
      const name = mealName.trim() || `Meal ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const meal = addMeal({ name, items: [...mealItems] });
      logMealToDay(meal.id, getToday());
      setMealItems([]);
      setMealName('');
      showSuccess('Meal logged to today! ✅');
    }
  };

  const handleSaveTemplate = () => {
    if (mealItems.length === 0) return;
    const name = mealName.trim() || `Saved Meal ${savedMeals.length + 1}`;
    saveMealTemplate({ name, items: [...mealItems] });
    showSuccess('Meal saved as template! 📌');
  };

  const loadTemplate = (template) => {
    setMealName(template.name);
    setMealItems([...template.items]);
    setShowSaved(false);
  };

  return (
    <div className="meal-builder animate-fade-in">
      <div className="dashboard__header">
        <div>
          <h1 className="page-title">{editMealId ? 'Edit Meal' : 'Meal Builder'}</h1>
          <p className="page-subtitle">{editMealId ? 'Update your logged meal items' : 'Select foods and build your meal'}</p>
        </div>
        <div className="flex gap-sm">
          <button
            className={`btn ${showSaved ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowSaved(!showSaved)}
          >
            <Bookmark size={16} />
            Saved ({savedMeals.length})
          </button>
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="meal-builder__success animate-slide-up">
          {successMsg}
        </div>
      )}

      {/* Saved Meals Panel */}
      {showSaved && (
        <div className="meal-builder__saved glass-card glass-card--static animate-slide-up">
          <h4 className="mb-md">Saved Meal Templates</h4>
          {savedMeals.length > 0 ? (
            <div className="meal-builder__saved-list">
              {savedMeals.map(template => (
                <div className="meal-builder__saved-item" key={template.id}>
                  <div>
                    <span className="font-semibold">{template.name}</span>
                    <span className="text-xs text-muted" style={{ marginLeft: '8px' }}>
                      {template.items.length} items
                    </span>
                  </div>
                  <div className="flex gap-xs">
                    <button className="btn btn-primary btn-sm" onClick={() => loadTemplate(template)}>
                      Load
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteSavedMeal(template.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm">No saved templates yet. Build a meal and save it!</p>
          )}
        </div>
      )}

      <div className="meal-builder__layout">
        {/* Left: Food Selection */}
        <div className="meal-builder__foods">
          <div className="meal-builder__foods-header glass-card glass-card--static">
            <div className="search-bar" style={{ maxWidth: '100%' }}>
              <Search size={16} className="search-bar__icon" />
              <input
                type="text"
                className="search-bar__input"
                placeholder="Search your foods..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="meal-food-search"
              />
            </div>
            <div className="tab-filters" style={{ marginTop: '12px' }}>
              <button
                className={`tab-filter ${activeCategory === 'all' ? 'tab-filter--active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All
              </button>
              {FOOD_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`tab-filter ${activeCategory === cat.id ? 'tab-filter--active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="meal-builder__food-list">
            {filteredFoods.map(food => {
              const category = FOOD_CATEGORIES.find(c => c.id === food.category) || FOOD_CATEGORIES[6];
              const isInMeal = mealItems.some(item => item.foodId === food.id);
              return (
                <div
                  key={food.id}
                  className={`meal-builder__food-item ${isInMeal ? 'meal-builder__food-item--selected' : ''}`}
                  onClick={() => addFoodToMeal(food)}
                >
                  <span className="meal-builder__food-emoji">{category.icon}</span>
                  <div className="meal-builder__food-info">
                    <span className="meal-builder__food-name">{food.name}</span>
                    <span className="meal-builder__food-meta">
                      {food.calories} kcal · {food.protein}g P · {food.carbs}g C · {food.fat}g F
                    </span>
                  </div>
                  <button className="meal-builder__food-add">
                    <Plus size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Meal Composition */}
        <div className="meal-builder__composition">
          {/* Meal name */}
          <div className="glass-card glass-card--static">
            <input
              type="text"
              className="form-input meal-builder__name-input"
              placeholder="Meal name (optional)"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              id="meal-name-input"
            />
          </div>

          {/* Selected Items */}
          <div className="glass-card glass-card--static meal-builder__items-card">
            <h4 className="meal-builder__items-title">
              Meal Items
              <span className="text-muted text-xs" style={{ fontWeight: 400 }}>
                {mealItems.length} item{mealItems.length !== 1 ? 's' : ''}
              </span>
            </h4>

            {mealItems.length > 0 ? (
              <div className="meal-builder__items-list">
                {mealItems.map(item => {
                  const food = foodsMap[item.foodId];
                  if (!food) return null;
                  const category = FOOD_CATEGORIES.find(c => c.id === food.category) || FOOD_CATEGORIES[6];
                  return (
                    <div className="meal-builder__item" key={item.foodId}>
                      <span className="meal-builder__item-emoji">{category.icon}</span>
                      <div className="meal-builder__item-info">
                        <span className="meal-builder__item-name">{food.name}</span>
                        <span className="meal-builder__item-cals">
                          {Math.round(food.calories * (item.quantity / food.servingSize))} kcal
                        </span>
                      </div>
                      <div className="meal-builder__item-controls">
                        <button
                          className="meal-builder__qty-btn"
                          onClick={() => updateQuantity(item.foodId, item.quantity - (food.servingSize / 4))}
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          className="meal-builder__qty-input"
                          value={parseFloat(Number(item.quantity).toFixed(2))}
                          onChange={(e) => updateQuantity(item.foodId, Number(e.target.value))}
                          min="0"
                          step="any"
                        />
                        <span className="meal-builder__qty-unit">{item.unit}</span>
                        <button
                          className="meal-builder__qty-btn"
                          onClick={() => updateQuantity(item.foodId, item.quantity + (food.servingSize / 4))}
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          className="meal-builder__remove-btn"
                          onClick={() => removeFoodFromMeal(item.foodId)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--space-xl) 0' }}>
                <span className="empty-state__icon">👈</span>
                <span className="empty-state__title">No items yet</span>
                <span className="empty-state__text">Click foods from the list to add them</span>
              </div>
            )}
          </div>

          {/* Nutrition Preview */}
          {mealItems.length > 0 && (
            <div className="glass-card glass-card--static meal-builder__nutrition">
              <h4 className="mb-md">Nutrition Breakdown</h4>
              
              {/* Donut Chart + Macro summary */}
              <div className="meal-builder__chart-row">
                <div className="meal-builder__chart">
                  <Doughnut data={chartData} options={chartOptions} />
                  <div className="meal-builder__chart-center">
                    <span className="meal-builder__chart-cal">{Math.round(nutrition.calories)}</span>
                    <span className="meal-builder__chart-label">kcal</span>
                  </div>
                </div>
                <div className="meal-builder__macro-summary">
                  <div className="meal-builder__macro-item">
                    <div className="meal-builder__macro-dot" style={{ backgroundColor: 'var(--color-protein)' }} />
                    <span>Protein</span>
                    <strong>{Math.round(nutrition.protein)}g</strong>
                    <span className="text-muted text-xs">{macroSplit.protein}%</span>
                  </div>
                  <div className="meal-builder__macro-item">
                    <div className="meal-builder__macro-dot" style={{ backgroundColor: 'var(--color-carbs)' }} />
                    <span>Carbs</span>
                    <strong>{Math.round(nutrition.carbs)}g</strong>
                    <span className="text-muted text-xs">{macroSplit.carbs}%</span>
                  </div>
                  <div className="meal-builder__macro-item">
                    <div className="meal-builder__macro-dot" style={{ backgroundColor: 'var(--color-fat)' }} />
                    <span>Fat</span>
                    <strong>{Math.round(nutrition.fat)}g</strong>
                    <span className="text-muted text-xs">{macroSplit.fat}%</span>
                  </div>
                </div>
              </div>

              {/* Full nutrition table */}
              <div className="mt-lg">
                <NutritionTable nutrition={nutrition} goals={goals} />
              </div>
            </div>
          )}

          {/* Action buttons */}
          {mealItems.length > 0 && (
            <div className="meal-builder__actions">
              <button className="btn btn-primary btn-lg" onClick={handleLogMeal} id="btn-log-meal">
                <Calendar size={18} />
                {editMealId ? 'Update Meal' : 'Log to Today'}
              </button>
              {!editMealId && (
                <button className="btn btn-secondary" onClick={handleSaveTemplate} id="btn-save-template">
                  <BookmarkPlus size={16} />
                  Save Template
                </button>
              )}
              {editMealId && (
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                  Cancel Edit
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealBuilder;
