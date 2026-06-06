import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FOOD_CATEGORIES, MICRONUTRIENTS } from '../utils/constants';
import FoodCard from '../components/FoodCard';
import Modal from '../components/Modal';
import { Plus, Search } from 'lucide-react';
import './FoodLibrary.css';

const emptyFood = {
  name: '',
  category: 'protein',
  servingSize: 100,
  servingUnit: 'g',
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  vitaminA: 0,
  vitaminC: 0,
  vitaminD: 0,
  vitaminB12: 0,
  calcium: 0,
  iron: 0,
  potassium: 0,
  sodium: 0,
  zinc: 0,
  magnesium: 0,
};

const FoodLibrary = () => {
  const { foods, addFood, updateFood, deleteFood } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState(emptyFood);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'all' || food.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [foods, search, activeCategory]);

  const openAddModal = () => {
    setEditingFood(null);
    setFormData(emptyFood);
    setIsModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    // Merge with emptyFood to ensure any newly added fields (like micronutrients) default to 0 instead of undefined
    setFormData({ ...emptyFood, ...food });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const foodData = {
      ...formData,
      servingSize: Number(formData.servingSize),
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      fat: Number(formData.fat),
      fiber: Number(formData.fiber),
      vitaminA: Number(formData.vitaminA),
      vitaminC: Number(formData.vitaminC),
      vitaminD: Number(formData.vitaminD),
      vitaminB12: Number(formData.vitaminB12),
      calcium: Number(formData.calcium),
      iron: Number(formData.iron),
      potassium: Number(formData.potassium),
      sodium: Number(formData.sodium),
      zinc: Number(formData.zinc),
      magnesium: Number(formData.magnesium),
    };

    if (editingFood) {
      updateFood(editingFood.id, foodData);
    } else {
      addFood(foodData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setShowConfirmDelete(id);
  };

  const confirmDelete = () => {
    if (showConfirmDelete) {
      deleteFood(showConfirmDelete);
      setShowConfirmDelete(null);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="food-library animate-fade-in">
      <div className="dashboard__header">
        <div>
          <h1 className="page-title">Food Library</h1>
          <p className="page-subtitle">{foods.length} food items in your library</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} id="btn-add-food">
          <Plus size={18} />
          Add Food
        </button>
      </div>

      {/* Search & Filters */}
      <div className="food-library__filters">
        <div className="search-bar">
          <Search size={16} className="search-bar__icon" />
          <input
            type="text"
            className="search-bar__input"
            placeholder="Search foods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="food-search"
          />
        </div>
        <div className="tab-filters">
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
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      {filteredFoods.length > 0 ? (
        <div className="grid-auto">
          {filteredFoods.map((food, i) => (
            <div key={food.id} style={{ animationDelay: `${i * 0.05}s` }} className="animate-fade-in">
              <FoodCard
                food={food}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state glass-card glass-card--static">
          <span className="empty-state__icon">🔍</span>
          <span className="empty-state__title">No foods found</span>
          <span className="empty-state__text">
            {search ? 'Try a different search term' : 'Add your first food item to get started'}
          </span>
        </div>
      )}

      {/* Add/Edit Food Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFood ? 'Edit Food' : 'Add New Food'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="food-form">
          <div className="food-form__section">
            <h4 className="food-form__section-title">Basic Info</h4>
            <div className="food-form__grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Food Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Chicken Breast"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  id="food-name-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  {FOOD_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Serving Size</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.servingSize}
                  onChange={(e) => handleChange('servingSize', e.target.value)}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Unit</label>
                <select
                  className="form-select"
                  value={formData.servingUnit}
                  onChange={(e) => handleChange('servingUnit', e.target.value)}
                >
                  <option value="g">Grams (g)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="oz">Ounces (oz)</option>
                  <option value="piece">Piece</option>
                  <option value="cup">Cup</option>
                  <option value="tbsp">Tablespoon</option>
                </select>
              </div>
            </div>
          </div>

          <div className="food-form__section">
            <h4 className="food-form__section-title">Macronutrients <span className="text-muted text-xs">(per serving)</span></h4>
            <div className="food-form__grid">
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--color-calories)' }}>Calories (kcal)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.calories}
                  onChange={(e) => handleChange('calories', e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--color-protein)' }}>Protein (g)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.protein}
                  onChange={(e) => handleChange('protein', e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--color-carbs)' }}>Carbs (g)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.carbs}
                  onChange={(e) => handleChange('carbs', e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--color-fat)' }}>Fat (g)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.fat}
                  onChange={(e) => handleChange('fat', e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--color-fiber)' }}>Fiber (g)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.fiber}
                  onChange={(e) => handleChange('fiber', e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          <div className="food-form__section">
            <h4 className="food-form__section-title">Micronutrients <span className="text-muted text-xs">(per serving, optional)</span></h4>
            <div className="food-form__grid food-form__grid--micros">
              {MICRONUTRIENTS.map(({ key, name, unit }) => (
                <div className="form-group" key={key}>
                  <label className="form-label">{name} ({unit})</label>
                  <input
                    type="number"
                    className="form-input form-input--sm"
                    value={formData[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="food-form__actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" id="btn-save-food">
              {editingFood ? 'Update Food' : 'Add Food'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!showConfirmDelete}
        onClose={() => setShowConfirmDelete(null)}
        title="Delete Food?"
        size="sm"
      >
        <p className="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>
          Are you sure you want to delete this food? This action cannot be undone.
        </p>
        <div className="food-form__actions">
          <button className="btn btn-secondary" onClick={() => setShowConfirmDelete(null)}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={confirmDelete} id="btn-confirm-delete">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FoodLibrary;
