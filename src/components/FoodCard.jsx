import { FOOD_CATEGORIES } from '../utils/constants';
import { Pencil, Trash2 } from 'lucide-react';
import './FoodCard.css';

const FoodCard = ({ food, onEdit, onDelete }) => {
  const category = FOOD_CATEGORIES.find(c => c.id === food.category) || FOOD_CATEGORIES[6];

  return (
    <div className="food-card glass-card" id={`food-card-${food.id}`}>
      <div className="food-card__header">
        <div className="food-card__category-icon">{category.icon}</div>
        <div className="food-card__actions">
          {onEdit && (
            <button className="food-card__action" onClick={() => onEdit(food)} title="Edit">
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button className="food-card__action food-card__action--danger" onClick={() => onDelete(food.id)} title="Delete">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <h4 className="food-card__name">{food.name}</h4>

      <span className={`badge badge-${food.category}`}>
        {category.name}
      </span>

      <div className="food-card__serving">
        {food.servingSize}{food.servingUnit} per serving
      </div>

      <div className="food-card__macros">
        <div className="food-card__macro">
          <span className="food-card__macro-value" style={{ color: 'var(--color-calories)' }}>
            {food.calories}
          </span>
          <span className="food-card__macro-label">kcal</span>
        </div>
        <div className="food-card__macro">
          <span className="food-card__macro-value" style={{ color: 'var(--color-protein)' }}>
            {food.protein}g
          </span>
          <span className="food-card__macro-label">protein</span>
        </div>
        <div className="food-card__macro">
          <span className="food-card__macro-value" style={{ color: 'var(--color-carbs)' }}>
            {food.carbs}g
          </span>
          <span className="food-card__macro-label">carbs</span>
        </div>
        <div className="food-card__macro">
          <span className="food-card__macro-value" style={{ color: 'var(--color-fat)' }}>
            {food.fat}g
          </span>
          <span className="food-card__macro-label">fat</span>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
