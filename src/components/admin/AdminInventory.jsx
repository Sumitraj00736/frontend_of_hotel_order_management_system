import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/client.js';
import IngredientModal from './IngredientModal.jsx';
import CustomDropdown from '../ui/CustomDropdown.jsx';

const AdminInventory = ({ menus, ingredients, transactions, reload, externalView }) => {
  const [view, setView] = useState(externalView || 'ingredients');
  const [form, setForm] = useState({ name: '', unit: '', currentStock: '', reorderLevel: '' });
  const [recipeMenu, setRecipeMenu] = useState('');
  const [recipeItems, setRecipeItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [localIngredients, setLocalIngredients] = useState(ingredients || []);
  const [localTransactions, setLocalTransactions] = useState(transactions || []);
  const [showIngredientModal, setShowIngredientModal] = useState(false);

  useEffect(() => {
    setLocalIngredients(ingredients || []);
    setLocalTransactions(transactions || []);
  }, [ingredients, transactions]);

  useEffect(() => {
    if (externalView) setView(externalView);
  }, [externalView]);

  useEffect(() => {
    if (view === 'recipes') {
      api.get('/api/inventory/recipes').then((res) => setRecipes(res.data));
    } else {
      reload();
    }
  }, [view, reload]);

  const lowStock = useMemo(
    () => localIngredients.filter((ing) => ing.reorderLevel !== undefined && ing.currentStock <= ing.reorderLevel),
    [localIngredients]
  );

  const addIngredient = async () => {
    if (!form.name || !form.unit) return alert('Name and unit are required');
    try {
      await api.post('/api/inventory/ingredients', {
        name: form.name,
        unit: form.unit,
        currentStock: form.currentStock ? Number(form.currentStock) : 0,
        reorderLevel: form.reorderLevel ? Number(form.reorderLevel) : 0
      });
      setForm({ name: '', unit: '', currentStock: '', reorderLevel: '' });
      reload();
      setShowIngredientModal(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add ingredient');
    }
  };

  const restock = async (ingredientId) => {
    const amountRaw = prompt('Restock amount');
    if (!amountRaw) return;
    const amount = Number(amountRaw);
    if (Number.isNaN(amount) || amount <= 0) return alert('Amount must be positive');
    try {
      await api.post(`/api/inventory/ingredients/${ingredientId}/restock`, { amount });
      reload();
    } catch (error) {
      alert(error.response?.data?.message || 'Restock failed');
    }
  };

  const addRecipeRow = () => setRecipeItems([...recipeItems, { ingredient: '', quantity: '' }]);
  const updateRecipeRow = (idx, field, value) => {
    const next = [...recipeItems];
    next[idx] = { ...next[idx], [field]: value };
    setRecipeItems(next);
  };

  const saveRecipe = async () => {
    if (!recipeMenu) return alert('Choose a menu item');
    const payload = {
      menuItem: recipeMenu,
      ingredients: recipeItems
        .filter((r) => r.ingredient && r.quantity)
        .map((r) => ({ ingredient: r.ingredient, quantity: Number(r.quantity) }))
    };
    if (payload.ingredients.length === 0) return alert('Add at least one ingredient');
    try {
      await api.post('/api/inventory/recipes', payload);
      setRecipeItems([]);
      alert('Recipe saved');
      if (view === 'recipes') {
        const res = await api.get('/api/inventory/recipes');
        setRecipes(res.data);
      }
      setShowRecipeModal(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save recipe');
    }
  };

  useEffect(() => {
    const loadRecipe = async () => {
      if (!recipeMenu) {
        setRecipeItems([]);
        return;
      }
      try {
        const res = await api.get(`/api/inventory/recipes/${recipeMenu}`);
        setRecipeItems(
          res.data.ingredients.map((r) => ({
            ingredient: r.ingredient?._id || r.ingredient,
            quantity: r.quantity
          }))
        );
      } catch (_) {
        setRecipeItems([]);
      }
    };
    loadRecipe();
  }, [recipeMenu]);

  return (
    <div className="content">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Inventory</h5>
        <div style={{ width: 220 }}>
          <CustomDropdown
            value={view}
            onChange={(e) => setView(e.target.value)}
            options={[
              { value: 'ingredients', label: 'Ingredients' },
              { value: 'recipes', label: 'Recipes' },
              { value: 'transactions', label: 'Stock Transactions' }
            ]}
            placeholder="Select view"
          />
        </div>
      </div>

      {view === 'ingredients' && (
        <div className="content grid-3">
          <div className="card glass-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Ingredients</h5>
              <button className="btn btn-outline-light btn-sm" onClick={reload}>
                Refresh
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowIngredientModal(true)}>
                + Add
              </button>
            </div>
            <div className="scrollable-tight">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Stock</th>
                    <th>Unit</th>
                    <th>Initial</th>
                    <th>Diff</th>
                    <th>Reorder</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {localIngredients.map((ing) => (
                    <tr key={ing._id} className={ing.reorderLevel !== undefined && ing.currentStock <= ing.reorderLevel ? 'table-warning' : ''}>
                      <td>{ing.name}</td>
                      <td>{ing.currentStock}</td>
                      <td>{ing.unit}</td>
                      <td>{ing.initialStock ?? '-'}</td>
                      <td>{ing.initialStock !== undefined ? ing.currentStock - (ing.initialStock || 0) : '-'}</td>
                      <td>{ing.reorderLevel}</td>
                      <td>
                        <button className="btn btn-sm btn-primary" onClick={() => restock(ing._id)}>
                          Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {lowStock.length > 0 && (
              <div className="alert alert-warning mt-2">
                Low stock: {lowStock.map((i) => i.name).join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'recipes' && (
        <div className="card glass-card full-screen-card">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Recipes</h5>
            <button className="btn btn-primary btn-sm" onClick={() => setShowRecipeModal(true)}>+ Add Recipe</button>
          </div>
          <div className="scrollable">
            <ul className="list-group">
              {recipes.map((r) => (
                <li key={r._id} className="list-group-item">
                  <div className="fw-semibold">{r.menuItem?.name || 'Menu'}</div>
                  <div className="tiny-text text-muted mb-1">{r.menuItem?.category}</div>
                  <div className="tiny-text">
                    {r.ingredients
                      .map((ing) => `${ing.ingredient?.name || ''} (${ing.quantity}${ing.ingredient?.unit || ''})`)
                      .join(', ')}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showRecipeModal && (
        <div className="modal-overlay fullscreen" onClick={() => setShowRecipeModal(false)}>
          <div className="modal-panel fullscreen small animate-in" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 modal-header-line">
              <div>
                <div className="eyebrow">Add Recipe</div>
                <h5 className="mb-0">Map ingredients to menu</h5>
              </div>
              <button className="btn btn-outline-light" onClick={() => setShowRecipeModal(false)}>Close</button>
            </div>
            <div className="mb-2">
              <label className="form-label">Menu Item</label>
              <CustomDropdown
                value={recipeMenu}
                onChange={(e) => setRecipeMenu(e.target.value)}
                options={menus.map((m) => ({ value: m._id, label: m.name }))}
                placeholder="Select menu"
              />
            </div>
            <div className="mb-3">
              {recipeItems.map((row, idx) => (
                <div key={idx} className="d-flex gap-2 mb-2">
                  <CustomDropdown
                    value={row.ingredient}
                    onChange={(e) => updateRecipeRow(idx, 'ingredient', e.target.value)}
                    options={ingredients.map((ing) => ({ value: ing._id, label: `${ing.name} (${ing.unit})` }))}
                    placeholder="Ingredient"
                  />
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Qty per item"
                    value={row.quantity}
                    onChange={(e) => updateRecipeRow(idx, 'quantity', e.target.value)}
                  />
                </div>
              ))}
              <button className="btn btn-outline-light btn-sm" onClick={addRecipeRow}>
                + Add ingredient
              </button>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-outline-light" onClick={() => setShowRecipeModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveRecipe}>Save Recipe</button>
            </div>
          </div>
        </div>
      )}

      {view === 'transactions' && (
        <div className="card glass-card">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Stock Transactions (latest)</h5>
            <button className="btn btn-outline-light btn-sm" onClick={reload}>
              Refresh
            </button>
          </div>
          <div className="scrollable">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Delta</th>
                  <th>Initial</th>
                  <th>Current</th>
                  <th>Reason</th>
                  <th>Order</th>
                  <th>By</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {localTransactions.map((t) => {
                  const ing = localIngredients.find((i) => i._id === (t.ingredient?._id || t.ingredient));
                  return (
                    <tr key={t._id}>
                      <td>{t.ingredient?.name}</td>
                      <td className={t.delta < 0 ? 'text-danger' : 'text-success'}>{t.delta}</td>
                      <td>{t.ingredient?.initialStock ?? '-'}</td>
                      <td>{ing?.currentStock ?? '-'}</td>
                      <td>{t.reason}</td>
                      <td>{t.referenceOrder?._id || t.referenceOrder || '-'}</td>
                      <td>{t.createdBy ? t.createdBy.name : '-'}</td>
                      <td>{new Date(t.createdAt).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="tiny-text text-muted mt-2">*Current column uses latest ingredient stock where available.</div>
        </div>
      )}


<IngredientModal
        open={showIngredientModal}
        onClose={() => setShowIngredientModal(false)}
        form={form}
        setForm={setForm}
        onSave={addIngredient}
      />
    </div>
  );
};

export default AdminInventory;
