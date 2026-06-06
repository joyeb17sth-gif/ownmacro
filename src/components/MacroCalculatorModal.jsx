import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Modal from './Modal';
import { Activity, Target, Moon, Ruler, Weight } from 'lucide-react';
import './MacroCalculatorModal.css';

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentary', desc: 'Little to no exercise' },
  { value: 1.375, label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { value: 1.55, label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
  { value: 1.725, label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
  { value: 1.9, label: 'Extra Active', desc: 'Very hard exercise/physical job' },
];

const GOALS = [
  { value: 'fat_loss', label: 'Fat Loss', desc: '-500 kcal deficit', icon: '🔥' },
  { value: 'maintain', label: 'Maintain Weight', desc: 'TDEE baseline', icon: '⚖️' },
  { value: 'muscle_gain', label: 'Muscle Gain', desc: '+300 kcal surplus', icon: '💪' },
];

const MacroCalculatorModal = ({ isOpen, onClose }) => {
  const { profile, updateProfile, updateGoals } = useApp();
  const [formData, setFormData] = useState({ ...profile });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...profile });
      setPreview(null);
    }
  }, [isOpen, profile]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateMacros = (data) => {
    const { weight, height, age, gender, activityLevel, goal } = data;
    
    // Mifflin-St Jeor Equation
    let bmr = (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age));
    bmr += gender === 'male' ? 5 : -161;

    const tdee = bmr * Number(activityLevel);

    let targetCalories = tdee;
    if (goal === 'fat_loss') targetCalories -= 500;
    if (goal === 'muscle_gain') targetCalories += 300;
    
    targetCalories = Math.max(1200, Math.round(targetCalories));

    const proteinMultiplier = goal === 'muscle_gain' ? 2.2 : 2.0;
    let protein = Math.round(Number(weight) * proteinMultiplier);
    
    let fat = Math.round(Number(weight) * 0.9);
    
    const proteinCals = protein * 4;
    const fatCals = fat * 9;
    let remainingCals = targetCalories - proteinCals - fatCals;
    let carbs = Math.max(50, Math.round(remainingCals / 4));

    const finalCalories = (protein * 4) + (fat * 9) + (carbs * 4);

    return {
      calories: finalCalories,
      protein,
      fat,
      carbs,
      fiber: 30,
    };
  };

  const handlePreview = () => {
    const results = calculateMacros(formData);
    setPreview(results);
  };

  const handleApply = () => {
    if (!preview) return;
    updateProfile(formData);
    updateGoals(preview);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Macro Calculator" size="lg">
      <div className="macro-calculator">
        <p className="text-muted mb-lg text-sm">
          Enter your physical attributes and goals. We use the Mifflin-St Jeor equation to estimate your metabolic rate and suggest an optimal macro split.
        </p>

        <div className="macro-calculator__grid">
          {/* Basics */}
          <div className="form-group">
            <label className="form-label">Gender</label>
            <div className="btn-group">
              <button
                className={`btn ${formData.gender === 'male' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => handleChange('gender', 'male')}
              >
                Male
              </button>
              <button
                className={`btn ${formData.gender === 'female' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => handleChange('gender', 'female')}
              >
                Female
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Age (years)</label>
            <input
              type="number"
              className="form-input"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              min="10"
              max="120"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Weight (kg)</label>
            <input
              type="number"
              className="form-input"
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              min="30"
              max="300"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Height (cm)</label>
            <input
              type="number"
              className="form-input"
              value={formData.height}
              onChange={(e) => handleChange('height', e.target.value)}
              min="100"
              max="250"
            />
          </div>
        </div>

        <div className="macro-calculator__section">
          <label className="form-label flex items-center gap-xs">
            <Activity size={16} /> Activity Level
          </label>
          <select
            className="form-input"
            value={formData.activityLevel}
            onChange={(e) => handleChange('activityLevel', Number(e.target.value))}
          >
            {ACTIVITY_LEVELS.map(level => (
              <option key={level.value} value={level.value}>
                {level.label} — {level.desc}
              </option>
            ))}
          </select>
        </div>

        <div className="macro-calculator__section">
          <label className="form-label flex items-center gap-xs">
            <Target size={16} /> Primary Goal
          </label>
          <div className="goal-cards">
            {GOALS.map(g => (
              <div
                key={g.value}
                className={`goal-card ${formData.goal === g.value ? 'goal-card--active' : ''}`}
                onClick={() => handleChange('goal', g.value)}
              >
                <span className="goal-card__icon">{g.icon}</span>
                <span className="goal-card__label">{g.label}</span>
                <span className="goal-card__desc">{g.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="macro-calculator__section">
          <label className="form-label flex items-center gap-xs">
            <Moon size={16} /> Average Sleep (hours)
          </label>
          <input
            type="range"
            className="goals__slider"
            min="4"
            max="12"
            step="0.5"
            value={formData.sleepHours}
            onChange={(e) => handleChange('sleepHours', Number(e.target.value))}
            style={{ '--slider-progress': `${((formData.sleepHours - 4) / 8) * 100}%`, '--slider-color': '#a78bfa' }}
          />
          <div className="text-center text-sm font-semibold mt-xs" style={{ color: '#a78bfa' }}>
            {formData.sleepHours} hours/night
          </div>
        </div>

        {preview && (
          <div className="macro-calculator__preview animate-slide-up">
            <h4 className="mb-md text-accent">Recommended Targets</h4>
            <div className="preview-grid">
              <div className="preview-stat" style={{ borderColor: 'var(--color-calories)' }}>
                <span>Calories</span>
                <strong>{preview.calories} kcal</strong>
              </div>
              <div className="preview-stat" style={{ borderColor: 'var(--color-protein)' }}>
                <span>Protein</span>
                <strong>{preview.protein}g</strong>
              </div>
              <div className="preview-stat" style={{ borderColor: 'var(--color-carbs)' }}>
                <span>Carbs</span>
                <strong>{preview.carbs}g</strong>
              </div>
              <div className="preview-stat" style={{ borderColor: 'var(--color-fat)' }}>
                <span>Fat</span>
                <strong>{preview.fat}g</strong>
              </div>
            </div>
          </div>
        )}

        <div className="macro-calculator__actions mt-xl">
          {!preview ? (
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handlePreview}>
              Calculate Macros
            </button>
          ) : (
            <div className="flex gap-sm w-full">
              <button className="btn btn-secondary flex-1" onClick={() => setPreview(null)}>
                Recalculate
              </button>
              <button className="btn btn-primary flex-1" onClick={handleApply}>
                Apply to Daily Goals
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MacroCalculatorModal;
