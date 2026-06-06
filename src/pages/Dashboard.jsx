import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useDailyNutrition } from '../hooks/useNutrition';
import { getToday, MICRONUTRIENTS } from '../utils/constants';
import { getPercentageOfGoal, getMacroSplit } from '../utils/nutrition';
import MacroRing from '../components/MacroRing';
import MealCard from '../components/MealCard';
import NutritionTable from '../components/NutritionTable';
import { Flame, TrendingUp, Calendar, Plus, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getMealsForDay, foodsMap, goals, removeMealFromDay, dailyLogs } = useApp();
  
  const todayMeals = getMealsForDay(getToday());
  const nutrition = useDailyNutrition(todayMeals, foodsMap);
  const macroSplit = getMacroSplit(nutrition);

  // Stats
  const daysTracked = useMemo(() => Object.keys(dailyLogs).length, [dailyLogs]);
  const caloriesPct = getPercentageOfGoal(nutrition.calories, goals.calories);

  // Top micronutrients by percentage
  const topMicros = useMemo(() => {
    return MICRONUTRIENTS.map(m => ({
      ...m,
      value: nutrition[m.key] || 0,
      pct: getPercentageOfGoal(nutrition[m.key] || 0, m.daily),
    })).sort((a, b) => b.pct - a.pct).slice(0, 6);
  }, [nutrition]);

  return (
    <div className="dashboard animate-fade-in">
      <div className="dashboard__header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/meal-builder')}
          id="btn-add-meal"
        >
          <Plus size={18} />
          Build a Meal
        </button>
      </div>

      {/* Calorie Summary Card */}
      <div className="dashboard__hero glass-card glass-card--static">
        <div className="dashboard__hero-left">
          <MacroRing
            value={nutrition.calories}
            max={goals.calories}
            label="Calories"
            color="var(--color-calories)"
            size={160}
            strokeWidth={10}
            unit="kcal"
          />
        </div>
        <div className="dashboard__hero-right">
          <div className="dashboard__hero-stat">
            <span className="dashboard__hero-number">{Math.round(nutrition.calories)}</span>
            <span className="dashboard__hero-label">
              of {goals.calories} kcal consumed
            </span>
          </div>
          <div className="dashboard__hero-bar">
            <div className="progress-bar" style={{ height: '10px' }}>
              <div
                className="progress-bar__fill"
                style={{ width: `${caloriesPct}%` }}
              />
            </div>
            <span className="dashboard__hero-pct">{caloriesPct}%</span>
          </div>
          <div className="dashboard__hero-remaining">
            {goals.calories - Math.round(nutrition.calories) > 0 ? (
              <span>{goals.calories - Math.round(nutrition.calories)} kcal remaining</span>
            ) : (
              <span className="text-accent">Goal reached! 🎉</span>
            )}
          </div>
        </div>
      </div>

      {/* Macro Rings */}
      <div className="dashboard__macros">
        <div className="glass-card glass-card--static dashboard__macro-card">
          <MacroRing
            value={nutrition.protein}
            max={goals.protein}
            label="Protein"
            color="var(--color-protein)"
            size={110}
            strokeWidth={8}
          />
          <div className="dashboard__macro-info">
            <span className="dashboard__macro-target">{goals.protein}g goal</span>
            <span className="dashboard__macro-split">{macroSplit.protein}% of calories</span>
          </div>
        </div>
        <div className="glass-card glass-card--static dashboard__macro-card">
          <MacroRing
            value={nutrition.carbs}
            max={goals.carbs}
            label="Carbs"
            color="var(--color-carbs)"
            size={110}
            strokeWidth={8}
          />
          <div className="dashboard__macro-info">
            <span className="dashboard__macro-target">{goals.carbs}g goal</span>
            <span className="dashboard__macro-split">{macroSplit.carbs}% of calories</span>
          </div>
        </div>
        <div className="glass-card glass-card--static dashboard__macro-card">
          <MacroRing
            value={nutrition.fat}
            max={goals.fat}
            label="Fat"
            color="var(--color-fat)"
            size={110}
            strokeWidth={8}
          />
          <div className="dashboard__macro-info">
            <span className="dashboard__macro-target">{goals.fat}g goal</span>
            <span className="dashboard__macro-split">{macroSplit.fat}% of calories</span>
          </div>
        </div>
        <div className="glass-card glass-card--static dashboard__macro-card">
          <MacroRing
            value={nutrition.fiber}
            max={goals.fiber}
            label="Fiber"
            color="var(--color-fiber)"
            size={110}
            strokeWidth={8}
          />
          <div className="dashboard__macro-info">
            <span className="dashboard__macro-target">{goals.fiber}g goal</span>
          </div>
        </div>
      </div>

      <div className="dashboard__grid">
        {/* Today's Meals */}
        <div className="dashboard__section">
          <div className="dashboard__section-header">
            <h3>
              <ChefHat size={18} /> Today's Meals
            </h3>
            <span className="text-sm text-muted">{todayMeals.length} meal{todayMeals.length !== 1 ? 's' : ''}</span>
          </div>
          {todayMeals.length > 0 ? (
            <div className="dashboard__meals-list">
              {todayMeals.map(meal => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  showDate
                  onRemoveFromDay={(id) => removeMealFromDay(id, getToday())}
                  onEdit={(id) => navigate(`/meal-builder?edit=${id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state glass-card glass-card--static">
              <span className="empty-state__icon">🍽️</span>
              <span className="empty-state__title">No meals logged today</span>
              <span className="empty-state__text">Build a meal and log it to start tracking</span>
              <button className="btn btn-primary mt-md" onClick={() => navigate('/meal-builder')}>
                <Plus size={16} /> Build Meal
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats + Micros */}
        <div className="dashboard__section">
          {/* Quick Stats */}
          <div className="dashboard__quick-stats glass-card glass-card--static">
            <div className="dashboard__stat">
              <div className="dashboard__stat-icon">
                <Flame size={18} />
              </div>
              <div>
                <span className="dashboard__stat-value">{daysTracked}</span>
                <span className="dashboard__stat-label">Days Tracked</span>
              </div>
            </div>
            <div className="dashboard__stat">
              <div className="dashboard__stat-icon" style={{ background: 'rgba(255, 179, 71, 0.1)', color: 'var(--accent-secondary)' }}>
                <TrendingUp size={18} />
              </div>
              <div>
                <span className="dashboard__stat-value">{todayMeals.length}</span>
                <span className="dashboard__stat-label">Meals Today</span>
              </div>
            </div>
            <div className="dashboard__stat">
              <div className="dashboard__stat-icon" style={{ background: 'rgba(167, 139, 250, 0.1)', color: '#a78bfa' }}>
                <Calendar size={18} />
              </div>
              <div>
                <span className="dashboard__stat-value">{Object.keys(foodsMap).length}</span>
                <span className="dashboard__stat-label">Foods in Library</span>
              </div>
            </div>
          </div>

          {/* Top Micronutrients */}
          <div className="glass-card glass-card--static">
            <h4 className="mb-md" style={{ fontSize: '0.9rem' }}>Top Micronutrients Today</h4>
            <div className="dashboard__micros">
              {topMicros.map(micro => (
                <div className="dashboard__micro-row" key={micro.key}>
                  <span className="dashboard__micro-name">{micro.name}</span>
                  <div className="dashboard__micro-bar">
                    <div
                      className="dashboard__micro-fill"
                      style={{
                        width: `${micro.pct}%`,
                        backgroundColor: micro.pct >= 80 ? '#6bcb77' : micro.pct >= 40 ? '#ffd93d' : '#ff6b6b',
                      }}
                    />
                  </div>
                  <span className="dashboard__micro-pct">{micro.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
