import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useDailyNutrition } from '../hooks/useNutrition';
import { getToday, formatDate, MICRONUTRIENTS } from '../utils/constants';
import { getPercentageOfGoal } from '../utils/nutrition';
import MealCard from '../components/MealCard';
import MacroRing from '../components/MacroRing';
import NutritionTable from '../components/NutritionTable';
import MealPlannerModal from '../components/MealPlannerModal';
import { ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import './DailyTracker.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend, Filler);

const DailyTracker = () => {
  const { getMealsForDay, foodsMap, goals, removeMealFromDay, dailyLogs, meals } = useApp();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  const dayMeals = useMemo(() => getMealsForDay(selectedDate), [getMealsForDay, selectedDate]);
  const nutrition = useDailyNutrition(dayMeals, foodsMap);

  // Navigate days
  const changeDate = (offset) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(formatDate(d));
  };

  const isToday = selectedDate === getToday();

  const dateDisplay = () => {
    const d = new Date(selectedDate + 'T12:00:00');
    if (isToday) return 'Today';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (selectedDate === formatDate(yesterday)) return 'Yesterday';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Weekly trend data (last 7 days)
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      const dayMealIds = dailyLogs[dateStr] || [];
      const dayMealsData = dayMealIds.map(id => meals.find(m => m.id === id)).filter(Boolean);
      
      let totalCalories = 0;
      let totalProtein = 0;
      dayMealsData.forEach(meal => {
        meal.items.forEach(item => {
          const food = foodsMap[item.foodId];
          if (food) {
            const ratio = item.quantity / food.servingSize;
            totalCalories += food.calories * ratio;
            totalProtein += food.protein * ratio;
          }
        });
      });

      days.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein),
      });
    }
    return days;
  }, [dailyLogs, meals, foodsMap]);

  const trendChartData = {
    labels: weeklyData.map(d => d.label),
    datasets: [
      {
        label: 'Calories',
        data: weeklyData.map(d => d.calories),
        borderColor: 'rgba(0, 212, 170, 1)',
        backgroundColor: 'rgba(0, 212, 170, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(0, 212, 170, 1)',
        pointBorderColor: '#111627',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Protein (g)',
        data: weeklyData.map(d => d.protein),
        borderColor: 'rgba(255, 107, 107, 1)',
        backgroundColor: 'rgba(255, 107, 107, 0.05)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(255, 107, 107, 1)',
        pointBorderColor: '#111627',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1',
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#8892a8',
          font: { family: 'Inter', size: 11 },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 22, 39, 0.9)',
        titleColor: '#e8ecf4',
        bodyColor: '#8892a8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#5a6378', font: { family: 'Inter', size: 11 } },
      },
      y: {
        position: 'left',
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#5a6378', font: { family: 'Inter', size: 11 } },
        title: { display: true, text: 'Calories', color: '#5a6378', font: { family: 'Inter', size: 11 } },
      },
      y1: {
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#5a6378', font: { family: 'Inter', size: 11 } },
        title: { display: true, text: 'Protein (g)', color: '#5a6378', font: { family: 'Inter', size: 11 } },
      },
    },
  };

  return (
    <div className="daily-tracker animate-fade-in">
      <div className="dashboard__header">
        <div>
          <h1 className="page-title">Daily Tracker</h1>
          <p className="page-subtitle">Track your daily nutrition intake</p>
        </div>
      </div>

      {/* Date Navigator */}
      <div className="tracker__date-nav glass-card glass-card--static">
        <button className="btn btn-ghost" onClick={() => changeDate(-1)} id="btn-prev-day">
          <ChevronLeft size={20} />
        </button>
        <div className="tracker__date-display">
          <Calendar size={16} />
          <span className="tracker__date-text">{dateDisplay()}</span>
          <span className="tracker__date-full">{selectedDate}</span>
        </div>
        <button className="btn btn-ghost" onClick={() => changeDate(1)} id="btn-next-day" disabled={isToday}>
          <ChevronRight size={20} />
        </button>
        {!isToday && (
          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDate(getToday())}>
            Today
          </button>
        )}
        <button 
          className="btn btn-primary tracker-header__plan-btn"
          onClick={() => setIsPlannerOpen(true)}
        >
          <Sparkles size={18} />
          <span>Suggest Meal</span>
        </button>
      </div>

      <div className="tracker__layout">
        {/* Left: Day Overview */}
        <div className="tracker__overview">
          {/* Macro Rings */}
          <div className="glass-card glass-card--static tracker__macros-card">
            <div className="tracker__macro-rings">
              <MacroRing
                value={nutrition.calories}
                max={goals.calories}
                label="Calories"
                color="var(--color-calories)"
                size={100}
                strokeWidth={8}
                unit="kcal"
              />
              <MacroRing
                value={nutrition.protein}
                max={goals.protein}
                label="Protein"
                color="var(--color-protein)"
                size={80}
                strokeWidth={7}
              />
              <MacroRing
                value={nutrition.carbs}
                max={goals.carbs}
                label="Carbs"
                color="var(--color-carbs)"
                size={80}
                strokeWidth={7}
              />
              <MacroRing
                value={nutrition.fat}
                max={goals.fat}
                label="Fat"
                color="var(--color-fat)"
                size={80}
                strokeWidth={7}
              />
            </div>

            {/* Progress bars */}
            <div className="tracker__progress-list">
              {[
                { label: 'Calories', value: nutrition.calories, goal: goals.calories, color: '--color-calories', unit: 'kcal' },
                { label: 'Protein', value: nutrition.protein, goal: goals.protein, color: '--color-protein', unit: 'g' },
                { label: 'Carbs', value: nutrition.carbs, goal: goals.carbs, color: '--color-carbs', unit: 'g' },
                { label: 'Fat', value: nutrition.fat, goal: goals.fat, color: '--color-fat', unit: 'g' },
                { label: 'Fiber', value: nutrition.fiber, goal: goals.fiber, color: '--color-fiber', unit: 'g' },
              ].map(item => (
                <div className="tracker__progress-row" key={item.label}>
                  <span className="tracker__progress-label">{item.label}</span>
                  <div className="progress-bar">
                    <div
                      className={`progress-bar__fill progress-bar__fill--${item.label.toLowerCase()}`}
                      style={{ width: `${getPercentageOfGoal(item.value, item.goal)}%` }}
                    />
                  </div>
                  <span className="tracker__progress-value">
                    {Math.round(item.value)}/{item.goal}{item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Meals list */}
          <div className="tracker__meals-section">
            <h3 className="tracker__section-title">
              Meals ({dayMeals.length})
            </h3>
            {dayMeals.length > 0 ? (
              <div className="tracker__meals-list">
                {dayMeals.map(meal => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    showDate
                    onRemoveFromDay={(id) => removeMealFromDay(id, selectedDate)}
                    onEdit={(id) => navigate(`/meal-builder?edit=${id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state glass-card glass-card--static">
                <span className="empty-state__icon">📅</span>
                <span className="empty-state__title">No meals for this day</span>
                <span className="empty-state__text">
                  {isToday ? 'Build a meal and log it to start tracking' : 'No meals were logged on this day'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Nutrition Details + Trend */}
        <div className="tracker__details">
          {/* Detailed Nutrition */}
          {dayMeals.length > 0 && (
            <div className="glass-card glass-card--static">
              <h4 className="mb-md">Full Nutrition Breakdown</h4>
              <NutritionTable nutrition={nutrition} goals={goals} />
            </div>
          )}

          {/* Weekly Trend */}
          <div className="glass-card glass-card--static tracker__trend-card">
            <h4 className="mb-md">7-Day Trend</h4>
            <div className="tracker__trend-chart">
              <Line data={trendChartData} options={trendChartOptions} />
            </div>
          </div>
        </div>
      </div>
      
      <MealPlannerModal 
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        targetDate={selectedDate}
      />
    </div>
  );
};

export default DailyTracker;
