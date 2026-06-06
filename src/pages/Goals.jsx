import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useDailyNutrition } from '../hooks/useNutrition';
import { getToday } from '../utils/constants';
import { getPercentageOfGoal } from '../utils/nutrition';
import MacroRing from '../components/MacroRing';
import MacroCalculatorModal from '../components/MacroCalculatorModal';
import { Save, RotateCcw, Target, Calculator } from 'lucide-react';
import './Goals.css';

const goalConfigs = [
  {
    key: 'calories',
    label: 'Calories',
    unit: 'kcal',
    color: 'var(--color-calories)',
    min: 500,
    max: 5000,
    step: 50,
    recommended: '2000-2500 kcal for average adults',
  },
  {
    key: 'protein',
    label: 'Protein',
    unit: 'g',
    color: 'var(--color-protein)',
    min: 20,
    max: 400,
    step: 5,
    recommended: '0.8-1g per lb of body weight for active individuals',
  },
  {
    key: 'carbs',
    label: 'Carbs',
    unit: 'g',
    color: 'var(--color-carbs)',
    min: 50,
    max: 600,
    step: 10,
    recommended: '45-65% of total calories',
  },
  {
    key: 'fat',
    label: 'Fat',
    unit: 'g',
    color: 'var(--color-fat)',
    min: 20,
    max: 200,
    step: 5,
    recommended: '20-35% of total calories',
  },
  {
    key: 'fiber',
    label: 'Fiber',
    unit: 'g',
    color: 'var(--color-fiber)',
    min: 10,
    max: 80,
    step: 1,
    recommended: '25-30g per day',
  },
];

const Goals = () => {
  const { goals, updateGoals, getMealsForDay, foodsMap } = useApp();
  const [formGoals, setFormGoals] = useState({ ...goals });
  const [hasChanges, setHasChanges] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const todayMeals = getMealsForDay(getToday());
  const todayNutrition = useDailyNutrition(todayMeals, foodsMap);

  const handleChange = (key, value) => {
    setFormGoals(prev => ({ ...prev, [key]: Number(value) }));
    setHasChanges(true);
    setSaved(false);
  };

  const handleSave = () => {
    updateGoals(formGoals);
    setHasChanges(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setFormGoals({ ...goals });
    setHasChanges(false);
  };

  return (
    <div className="goals-page animate-fade-in">
      <div className="dashboard__header">
        <div>
          <h1 className="page-title">Daily Goals</h1>
          <p className="page-subtitle">Set your daily macro targets</p>
        </div>
        <div className="flex gap-sm">
          {hasChanges && (
            <button className="btn btn-secondary" onClick={handleReset}>
              <RotateCcw size={16} />
              Reset
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={() => setIsCalculatorOpen(true)}
          >
            <Calculator size={16} />
            Auto-Calculate
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!hasChanges}
            id="btn-save-goals"
          >
            <Save size={16} />
            Save Goals
          </button>
        </div>
      </div>

      {saved && (
        <div className="meal-builder__success animate-slide-up">
          Goals saved successfully! ✅
        </div>
      )}

      {/* Current vs Goal Overview */}
      <div className="goals__overview glass-card glass-card--static">
        <h3 className="goals__overview-title">
          <Target size={18} />
          Today's Progress vs Goals
        </h3>
        <div className="goals__rings-row">
          {goalConfigs.map(config => (
            <div className="goals__ring-item" key={config.key}>
              <MacroRing
                value={todayNutrition[config.key] || 0}
                max={formGoals[config.key]}
                label={config.label}
                color={config.color}
                size={100}
                strokeWidth={8}
                unit={config.unit}
                showPercentage
              />
              <div className="goals__ring-detail">
                <span className="goals__ring-current">
                  {Math.round(todayNutrition[config.key] || 0)}{config.unit}
                </span>
                <span className="goals__ring-target">
                  of {formGoals[config.key]}{config.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Sliders */}
      <div className="goals__sliders">
        {goalConfigs.map(config => {
          const pct = getPercentageOfGoal(todayNutrition[config.key] || 0, formGoals[config.key]);
          return (
            <div className="goals__slider-card glass-card glass-card--static" key={config.key}>
              <div className="goals__slider-header">
                <div className="goals__slider-label-row">
                  <div className="goals__slider-dot" style={{ backgroundColor: config.color }} />
                  <span className="goals__slider-name">{config.label}</span>
                </div>
                <div className="goals__slider-value-display">
                  <input
                    type="number"
                    className="goals__value-input"
                    value={formGoals[config.key]}
                    onChange={(e) => handleChange(config.key, e.target.value)}
                    min={config.min}
                    max={config.max}
                    step={config.step}
                  />
                  <span className="goals__value-unit">{config.unit}</span>
                </div>
              </div>

              <input
                type="range"
                className="goals__slider"
                value={formGoals[config.key]}
                onChange={(e) => handleChange(config.key, e.target.value)}
                min={config.min}
                max={config.max}
                step={config.step}
                style={{
                  '--slider-progress': `${((formGoals[config.key] - config.min) / (config.max - config.min)) * 100}%`,
                  '--slider-color': config.color,
                }}
              />

              <div className="goals__slider-footer">
                <span className="goals__slider-range">{config.min}{config.unit}</span>
                <span className="goals__slider-rec">{config.recommended}</span>
                <span className="goals__slider-range">{config.max}{config.unit}</span>
              </div>

              {/* Current progress indicator */}
              <div className="goals__slider-progress">
                <span className="text-xs text-muted">Today's intake:</span>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div
                    className="progress-bar__fill"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${config.color}, ${config.color}88)`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold" style={{ color: config.color }}>
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <MacroCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => {
          setIsCalculatorOpen(false);
          // If they applied changes, sync them to the local form state
          setFormGoals({ ...goals });
        }}
      />
    </div>
  );
};

export default Goals;
