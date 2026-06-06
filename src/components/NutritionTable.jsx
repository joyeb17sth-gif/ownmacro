import { MICRONUTRIENTS } from '../utils/constants';
import { getPercentageOfGoal } from '../utils/nutrition';
import './NutritionTable.css';

const NutritionTable = ({ nutrition, goals = null, showMicros = true }) => {
  const macros = [
    { key: 'calories', label: 'Calories', value: nutrition.calories, unit: 'kcal', color: 'var(--color-calories)', goal: goals?.calories },
    { key: 'protein', label: 'Protein', value: nutrition.protein, unit: 'g', color: 'var(--color-protein)', goal: goals?.protein },
    { key: 'carbs', label: 'Carbs', value: nutrition.carbs, unit: 'g', color: 'var(--color-carbs)', goal: goals?.carbs },
    { key: 'fat', label: 'Fat', value: nutrition.fat, unit: 'g', color: 'var(--color-fat)', goal: goals?.fat },
    { key: 'fiber', label: 'Fiber', value: nutrition.fiber, unit: 'g', color: 'var(--color-fiber)', goal: goals?.fiber },
  ];

  return (
    <div className="nutrition-table">
      <div className="nutrition-table__section">
        <h4 className="nutrition-table__heading">Macronutrients</h4>
        <div className="nutrition-table__rows">
          {macros.map(({ key, label, value, unit, color, goal }) => {
            const pct = goal ? getPercentageOfGoal(value, goal) : null;
            return (
              <div className="nutrition-table__row" key={key}>
                <div className="nutrition-table__indicator" style={{ backgroundColor: color }} />
                <span className="nutrition-table__label">{label}</span>
                <span className="nutrition-table__value">
                  {Math.round(value * 10) / 10}
                  <span className="nutrition-table__unit">{unit}</span>
                </span>
                {pct !== null && (
                  <div className="nutrition-table__bar-wrapper">
                    <div className="nutrition-table__bar">
                      <div
                        className="nutrition-table__bar-fill"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="nutrition-table__pct">{pct}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showMicros && (
        <div className="nutrition-table__section">
          <h4 className="nutrition-table__heading">Micronutrients</h4>
          <div className="nutrition-table__rows">
            {MICRONUTRIENTS.map(({ key, name, unit, daily }) => {
              const value = nutrition[key] || 0;
              const pct = getPercentageOfGoal(value, daily);
              return (
                <div className="nutrition-table__row" key={key}>
                  <div
                    className="nutrition-table__indicator"
                    style={{
                      backgroundColor: pct >= 80 ? '#6bcb77' : pct >= 40 ? '#ffd93d' : '#ff6b6b',
                    }}
                  />
                  <span className="nutrition-table__label">{name}</span>
                  <span className="nutrition-table__value">
                    {Math.round(value * 100) / 100}
                    <span className="nutrition-table__unit">{unit}</span>
                  </span>
                  <div className="nutrition-table__bar-wrapper">
                    <div className="nutrition-table__bar">
                      <div
                        className="nutrition-table__bar-fill"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: pct >= 80 ? '#6bcb77' : pct >= 40 ? '#ffd93d' : '#ff6b6b',
                        }}
                      />
                    </div>
                    <span className="nutrition-table__pct">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionTable;
