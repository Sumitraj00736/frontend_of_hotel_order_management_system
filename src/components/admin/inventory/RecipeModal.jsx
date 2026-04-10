import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Search } from 'lucide-react';
import CustomDropdown from '../../ui/CustomDropdown.jsx';

const RecipeModal = ({ open, onClose, menus, ingredients, onSave, initialData = null }) => {
  const [recipeMenu, setRecipeMenu] = useState('');
  const [recipeItems, setRecipeItems] = useState([{ ingredient: '', quantity: '' }]);

  useEffect(() => {
    if (initialData) {
      setRecipeMenu(initialData.menuItem?._id || initialData.menuItem);
      setRecipeItems(
        initialData.ingredients.map((r) => ({
          ingredient: r.ingredient?._id || r.ingredient,
          quantity: r.quantity
        }))
      );
    } else {
      setRecipeMenu('');
      setRecipeItems([{ ingredient: '', quantity: '' }]);
    }
  }, [initialData, open]);

  if (!open) return null;

  const addRow = () => setRecipeItems([...recipeItems, { ingredient: '', quantity: '' }]);
  const removeRow = (idx) => {
    const next = recipeItems.filter((_, i) => i !== idx);
    setRecipeItems(next.length ? next : [{ ingredient: '', quantity: '' }]);
  };
  const updateRow = (idx, field, value) => {
    const next = [...recipeItems];
    next[idx] = { ...next[idx], [field]: value };
    setRecipeItems(next);
  };

  const handleSave = () => {
    if (!recipeMenu) return alert('Please select a menu item');
    const validItems = recipeItems.filter((r) => r.ingredient && r.quantity);
    if (validItems.length === 0) return alert('Please add at least one ingredient');
    
    onSave({
      menuItem: recipeMenu,
      ingredients: validItems.map(i => ({
        ingredient: i.ingredient,
        quantity: Number(i.quantity)
      }))
    });
  };

  return (
    <div className="modal-overlay animate-in" onClick={onClose}>
      <div className="modal-panel animate-in" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <div className="eyebrow text-primary">Recipe Management</div>
            <h5 className="mb-0 fw-bold">{initialData ? 'Edit Recipe' : 'Compose New Recipe'}</h5>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="mb-4">
            <label className="form-label small fw-bold text-muted uppercase">Target Menu Item</label>
            <CustomDropdown
              value={recipeMenu}
              onChange={(e) => setRecipeMenu(e.target.value)}
              options={menus.map((m) => ({ value: m._id, label: `${m.name} (${m.category})` }))}
              placeholder="Select menu item..."
              disabled={!!initialData}
            />
            {initialData && <div className="tiny-text text-muted mt-1">Menu item cannot be changed once recipe is created.</div>}
          </div>

          <div className="mb-2 d-flex justify-content-between align-items-center">
            <label className="form-label small fw-bold text-muted uppercase mb-0">Ingredients & Proportions</label>
            <button className="btn btn-sm btn-outline-primary py-1" onClick={addRow}>
              <Plus size={14} className="me-1" /> Add
            </button>
          </div>

          <div className="recipe-rows-container scroller" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {recipeItems.map((item, idx) => (
              <div key={idx} className="d-flex gap-2 mb-3 align-items-start animate-in">
                <div style={{ flex: 2 }}>
                  <CustomDropdown
                    value={item.ingredient}
                    onChange={(e) => updateRow(idx, 'ingredient', e.target.value)}
                    options={ingredients.map((ing) => ({ value: ing._id, label: `${ing.name} (${ing.unit})` }))}
                    placeholder="Select Ingredient"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateRow(idx, 'quantity', e.target.value)}
                  />
                </div>
                <button className="btn-icon delete mt-1" onClick={() => removeRow(idx)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 pt-4 border-top mt-2">
          <button className="btn btn-outline-secondary px-4" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary px-4" onClick={handleSave}>
            {initialData ? 'Update Recipe' : 'Save Recipe'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
