import { Trash2, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateMealNutrition, getMacroSplit } from '../utils/nutrition';
import './MealCard.css';

const MealCard = ({ meal, onDelete, onRemoveFromDay, onEdit, showDate = false }) => {
  const { foodsMap } = useApp();
  const nutrition = calculateMealNutrition(meal.items, foodsMap);
  const macroSplit = getMacroSplit(nutrition);

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="meal-card glass-card" id={`meal-card-${meal.id}`}>
      <div className="meal-card__header">
        <div>
          <h4 className="meal-card__name">{meal.name}</h4>
          {showDate && meal.createdAt && (
            <span className="meal-card__time">
              <Clock size={12} />
              {formatTime(meal.createdAt)}
            </span>
          )}
          <span className="meal-card__items-count">
            {meal.items.length} item{meal.items.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="meal-card__actions">
          {onRemoveFromDay && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onRemoveFromDay(meal.id)}
              title="Remove from today"
            >
              Remove
            </button>
          )}
          {onEdit && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onEdit(meal.id)}
              title="Edit meal"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              className="food-card__action food-card__action--danger"
              onClick={() => onDelete(meal.id)}
              title="Delete meal"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="meal-card__stats">
        <div className="meal-card__calories">
          <span className="meal-card__cal-value">{Math.round(nutrition.calories)}</span>
          <span className="meal-card__cal-label">kcal</span>
        </div>

        <div className="meal-card__macro-bars">
          <div className="meal-card__macro-row">
            <span className="meal-card__macro-name">P</span>
            <div className="meal-card__macro-bar">
              <div
                className="meal-card__macro-fill"
                style={{ width: `${macroSplit.protein}%`, backgroundColor: 'var(--color-protein)' }}
              />
            </div>
            <span className="meal-card__macro-val">{Math.round(nutrition.protein)}g</span>
          </div>
          <div className="meal-card__macro-row">
            <span className="meal-card__macro-name">C</span>
            <div className="meal-card__macro-bar">
              <div
                className="meal-card__macro-fill"
                style={{ width: `${macroSplit.carbs}%`, backgroundColor: 'var(--color-carbs)' }}
              />
            </div>
            <span className="meal-card__macro-val">{Math.round(nutrition.carbs)}g</span>
          </div>
          <div className="meal-card__macro-row">
            <span className="meal-card__macro-name">F</span>
            <div className="meal-card__macro-bar">
              <div
                className="meal-card__macro-fill"
                style={{ width: `${macroSplit.fat}%`, backgroundColor: 'var(--color-fat)' }}
              />
            </div>
            <span className="meal-card__macro-val">{Math.round(nutrition.fat)}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
