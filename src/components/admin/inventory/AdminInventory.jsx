import React, { useEffect, useMemo, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  Wheat, 
  Soup, 
  History, 
  LayoutDashboard,
  Edit2,
  Trash2,
  AlertTriangle,
  ArrowUpRight,
  Package,
  CheckCircle2,
  Users
} from 'lucide-react';
import api from '../../../api/client.js';
import IngredientModal from './IngredientModal.jsx';
import RecipeModal from './RecipeModal.jsx';
import SuppliersTab from './SuppliersTab.jsx';
import CustomDropdown from '../../ui/CustomDropdown.jsx';
import '../../../common/css/admin/inventory/inventory.css';

const AdminInventory = ({ menus, ingredients, transactions, reload, externalView }) => {
  const [view, setView] = useState(externalView || 'dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, low, out
  
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [ingredientForm, setIngredientForm] = useState({ name: '', unit: '', currentStock: '', reorderLevel: '' });

  const [ingredientUnits, setIngredientUnits] = useState([]);
  const [unitForm, setUnitForm] = useState({ name: '', label: '', symbol: '' });
  const [editingUnit, setEditingUnit] = useState(null);

  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  useEffect(() => {
    if (externalView) setView(externalView);
  }, [externalView]);

  useEffect(() => {
    if (view === 'units') {
      loadUnits();
    }
  }, [view]);

  useEffect(() => {
    if (view === 'recipes') {
      fetchRecipes();
    }
  }, [view]);

  const fetchRecipes = async () => {
    setLoadingRecipes(true);
    try {
      const res = await api.get('/api/inventory/recipes');
      setRecipes(res.data);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const loadUnits = async () => {
    try {
      const res = await api.get('/api/inventory/ingredient-units');
      setIngredientUnits(res.data || []);
    } catch (err) {
      console.error('Failed to fetch units:', err);
      setIngredientUnits([]);
    }
  };

  const filteredIngredients = useMemo(() => {
    let result = ingredients || [];
    if (searchTerm) {
      result = result.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterType === 'low') {
      result = result.filter(i => i.currentStock <= i.reorderLevel && i.currentStock > 0);
    } else if (filterType === 'out') {
      result = result.filter(i => i.currentStock <= 0);
    }
    return result;
  }, [ingredients, searchTerm, filterType]);

  const stats = useMemo(() => {
    const ings = ingredients || [];
    return {
      total: ings.length,
      lowStock: ings.filter(i => i.currentStock <= i.reorderLevel && i.currentStock > 0).length,
      outOfStock: ings.filter(i => i.currentStock <= 0).length,
      healthy: ings.filter(i => i.currentStock > i.reorderLevel).length
    };
  }, [ingredients]);

  // Ingredient Handlers
  const openAddIngredient = () => {
    setEditingIngredient(null);
    setIngredientForm({ name: '', unit: '', currentStock: '', reorderLevel: '' });
    if (!ingredientUnits.length) {
      loadUnits();
    }
    setShowIngredientModal(true);
  };

  const openEditIngredient = (ing) => {
    setEditingIngredient(ing);
    setIngredientForm({ 
      name: ing.name, 
      unit: ing.unit, 
      currentStock: ing.currentStock, 
      reorderLevel: ing.reorderLevel 
    });
    if (!ingredientUnits.length) {
      loadUnits();
    }
    setShowIngredientModal(true);
  };

  const handleSaveIngredient = async () => {
    if (!ingredientForm.name || !ingredientForm.unit) return alert('Name and unit are required');
    try {
      if (editingIngredient) {
        await api.put(`/api/inventory/ingredients/${editingIngredient._id}`, ingredientForm);
      } else {
        await api.post('/api/inventory/ingredients', ingredientForm);
      }
      reload();
      setShowIngredientModal(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Action failed');
    }
  };

  const resetUnitForm = () => {
    setUnitForm({ name: '', label: '', symbol: '' });
    setEditingUnit(null);
  };

  const handleSaveUnit = async () => {
    if (!unitForm.name) return alert('Unit name is required');
    try {
      const payload = {
        name: unitForm.name,
        label: unitForm.label || unitForm.name,
        symbol: unitForm.symbol
      };
      if (editingUnit) {
        await api.put(`/api/inventory/ingredient-units/${editingUnit._id}`, payload);
      } else {
        await api.post('/api/inventory/ingredient-units', payload);
      }
      resetUnitForm();
      loadUnits();
    } catch (error) {
      alert(error.response?.data?.message || 'Action failed');
    }
  };

  const handleEditUnit = (unit) => {
    setEditingUnit(unit);
    setUnitForm({
      name: unit.name,
      label: unit.label || unit.name,
      symbol: unit.symbol || ''
    });
  };

  const handleDeleteUnit = async (unitId) => {
    if (!window.confirm('Delete this unit?')) return;
    try {
      await api.delete(`/api/inventory/ingredient-units/${unitId}`);
      loadUnits();
    } catch (error) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleDeleteIngredient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ingredient?')) return;
    try {
      await api.delete(`/api/inventory/ingredients/${id}`);
      reload();
    } catch (err) {
      alert('Failed to delete ingredient');
    }
  };

  const restock = async (ingredientId) => {
    const amountRaw = prompt('Enter restock amount:');
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

  // Recipe Handlers
  const openAddRecipe = () => {
    setEditingRecipe(null);
    setShowRecipeModal(true);
  };

  const openEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setShowRecipeModal(true);
  };

  const handleSaveRecipe = async (payload) => {
    try {
      await api.post('/api/inventory/recipes', payload);
      setShowRecipeModal(false);
      fetchRecipes();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save recipe');
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm('Delete this recipe mapping?')) return;
    try {
      await api.delete(`/api/inventory/recipes/${id}`);
      fetchRecipes();
    } catch (err) {
      alert('Failed to delete recipe');
    }
  };

  return (
    <div className="inventory-screen">
      <div className="inventory-header">
        <div>
          <h4 className="fw-bold mb-0">Inventory Control</h4>
          <p className="tiny-text text-muted mb-0">Manage kitchen resources, stock levels and dish compositions.</p>
        </div>

        <div className="inventory-tabs">
          <button className={`inventory-tab ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
            <LayoutDashboard size={16} className="me-2" /> Dashboard
          </button>
          <button className={`inventory-tab ${view === 'ingredients' ? 'active' : ''}`} onClick={() => setView('ingredients')}>
            <Wheat size={16} className="me-2" /> Ingredients
          </button>
          <button className={`inventory-tab ${view === 'recipes' ? 'active' : ''}`} onClick={() => setView('recipes')}>
            <Soup size={16} className="me-2" /> Recipes
          </button>
          <button className={`inventory-tab ${view === 'transactions' ? 'active' : ''}`} onClick={() => setView('transactions')}>
            <History size={16} className="me-2" /> Stock History
          </button>
          <button className={`inventory-tab ${view === 'units' ? 'active' : ''}`} onClick={() => setView('units')}>
            <Package size={16} className="me-2" /> Units
          </button>
          <button className={`inventory-tab ${view === 'suppliers' ? 'active' : ''}`} onClick={() => setView('suppliers')}>
            <Users size={16} className="me-2" /> Suppliers
          </button>
        </div>

        <button className="btn btn-outline-dark btn-sm rounded-pill px-3" onClick={reload}>
          <RefreshCw size={14} className="me-2" /> Refresh Data
        </button>
      </div>

      {view === 'dashboard' && (
        <div className="animate-in">
          <div className="stats-grid mb-4">
            <div className="stat-card">
              <div className="stat-icon bg-blue-soft"><Package /></div>
              <div className="stat-info">
                <div className="label">Total Ingredients</div>
                <div className="value">{stats.total}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon bg-amber-soft"><AlertTriangle /></div>
              <div className="stat-info">
                <div className="label">Low Stock Items</div>
                <div className="value">{stats.lowStock}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon bg-red-soft"><AlertTriangle /></div>
              <div className="stat-info">
                <div className="label">Out of Stock</div>
                <div className="value">{stats.outOfStock}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon bg-emerald-soft"><CheckCircle2 /></div>
              <div className="stat-info">
                <div className="label">Healthy Stock</div>
                <div className="value">{stats.healthy}</div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-7">
              <div className="table-glass">
                <div className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center bg-light">
                  <span className="fw-bold small">Critical Attention Required</span>
                  <button className="btn btn-link btn-sm p-0 text-primary fw-bold tiny-text" onClick={() => setView('ingredients')}>View All</button>
                </div>
                <table className="table-sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Current</th>
                      <th>Level</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients?.filter(i => i.currentStock <= i.reorderLevel).slice(0, 5).map(ing => (
                      <tr key={ing._id}>
                        <td className="fw-bold">{ing.name}</td>
                        <td><span className={ing.currentStock <= 0 ? 'text-danger fw-bold' : 'text-warning'}>{ing.currentStock} {ing.unit}</span></td>
                        <td className="text-muted small">{ing.reorderLevel} {ing.unit}</td>
                        <td className="text-end">
                          <button className="btn btn-primary btn-sm py-0 px-2 tiny-text" onClick={() => restock(ing._id)}>Restock</button>
                        </td>
                      </tr>
                    ))}
                    {(!ingredients || ingredients.filter(i => i.currentStock <= i.reorderLevel).length === 0) && (
                      <tr><td colSpan="4" className="text-center py-4 text-muted">All stock levels are healthy!</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-5">
              <div className="table-glass">
                <div className="px-3 py-2 border-bottom bg-light">
                  <span className="fw-bold small">Recent Activity</span>
                </div>
                <div className="p-3 scroller" style={{ maxHeight: '300px' }}>
                  {transactions?.slice(0, 8).map(t => (
                    <div key={t._id} className="d-flex align-items-center gap-3 mb-3 pb-2 border-bottom last-no-border">
                      <div className={`p-2 rounded-circle ${t.delta > 0 ? 'bg-emerald-soft' : 'bg-red-soft'}`}>
                        <ArrowUpRight size={14} style={{ transform: t.delta > 0 ? 'none' : 'rotate(90deg)' }} />
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold small">{t.ingredient?.name || 'Unknown'}</div>
                        <div className="tiny-text text-muted">{t.reason} • {new Date(t.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className={`fw-bold ${t.delta > 0 ? 'text-success' : 'text-danger'}`}>
                        {t.delta > 0 ? '+' : ''}{t.delta}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'ingredients' && (
        <div className="animate-in">
          <div className="search-filter-bar mb-3">
            <div className="search-input-wrapper">
              <i><Search size={16} /></i>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search ingredients..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2">
              <select className="form-select form-select-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All Inventory</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
              <button className="btn btn-primary btn-sm px-3" onClick={openAddIngredient}>
                <Plus size={16} className="me-2" /> Add Ingredient
              </button>
            </div>
          </div>

          <div className="table-glass">
            <table>
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                  <th>Reorder Level</th>
                  <th>SKU / ID</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIngredients.map(ing => (
                  <tr key={ing._id}>
                    <td>
                      <div className="fw-bold">{ing.name}</div>
                      <div className="tiny-text text-muted">Base unit: {ing.unit}</div>
                    </td>
                    <td className="fw-bold">{ing.currentStock} {ing.unit}</td>
                    <td>
                      {ing.currentStock <= 0 ? (
                        <span className="badge badge-danger">Out of Stock</span>
                      ) : ing.currentStock <= ing.reorderLevel ? (
                        <span className="badge badge-warning">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">Healthy</span>
                      )}
                    </td>
                    <td>{ing.reorderLevel} {ing.unit}</td>
                    <td className="text-muted tiny-text">{ing.sku || ing._id.slice(-6)}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2 text-primary">
                         <button className="btn btn-primary btn-sm px-3 py-1 fw-bold tiny-text" onClick={() => restock(ing._id)}>Restock</button>
                         <button className="btn-icon" onClick={() => openEditIngredient(ing)}><Edit2 size={14}/></button>
                         <button className="btn-icon delete" onClick={() => handleDeleteIngredient(ing._id)}><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredIngredients.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">No ingredients found matching your criteria.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'units' && (
        <div className="animate-in">
          <div className="inventory-panel">
            <div className="panel-header">
              <div>
                <h5 className="fw-bold mb-1">Ingredient Units</h5>
                <p className="text-muted small mb-0">Create custom units for ingredient stock tracking.</p>
              </div>
            </div>

            <div className="row g-3 align-items-end mb-4">
              <div className="col-md-4">
                <label className="form-label">Unit Name</label>
                <input
                  className="form-control"
                  placeholder="kg"
                  value={unitForm.name}
                  onChange={(e) => setUnitForm({ ...unitForm, name: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Label</label>
                <input
                  className="form-control"
                  placeholder="Kilogram"
                  value={unitForm.label}
                  onChange={(e) => setUnitForm({ ...unitForm, label: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Symbol</label>
                <input
                  className="form-control"
                  placeholder="kg"
                  value={unitForm.symbol}
                  onChange={(e) => setUnitForm({ ...unitForm, symbol: e.target.value })}
                />
              </div>
              <div className="col-md-2 d-flex gap-2">
                <button className="btn btn-outline-secondary w-100" onClick={resetUnitForm}>
                  Reset
                </button>
                <button className="btn btn-primary w-100" onClick={handleSaveUnit}>
                  {editingUnit ? 'Update' : 'Save'}
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table inventory-table">
                <thead>
                  <tr>
                    <th>Unit</th>
                    <th>Label</th>
                    <th>Symbol</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientUnits.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        No custom units yet.
                      </td>
                    </tr>
                  )}
                  {ingredientUnits.map((unit) => (
                    <tr key={unit._id}>
                      <td className="fw-semibold">{unit.name}</td>
                      <td>{unit.label || '-'}</td>
                      <td>{unit.symbol || '-'}</td>
                      <td className="text-end">
                        <button className="btn btn-link btn-sm" onClick={() => handleEditUnit(unit)}>
                          Edit
                        </button>
                        <button className="btn btn-link btn-sm text-danger" onClick={() => handleDeleteUnit(unit._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view === 'recipes' && (
        <div className="animate-in">
          <div className="d-flex justify-content-between align-items-center mb-3">
             <div className="search-input-wrapper" style={{ width: 'min(100%, 300px)' }}>
                <i><Search size={16} /></i>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search recipes..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-primary btn-sm" onClick={openAddRecipe}>
                <Plus size={16} className="me-2" /> Add Recipe
              </button>
          </div>

          {loadingRecipes ? (
            <div className="text-center py-5"><RefreshCw size={24} className="animate-spin" /></div>
          ) : (
            <div className="recipe-grid">
              {recipes.filter(r => r.menuItem?.name.toLowerCase().includes(searchTerm.toLowerCase())).map(recipe => (
                <div key={recipe._id} className="recipe-card">
                  <div className="recipe-card-header">
                    <div>
                      <div className="recipe-menu-name">{recipe.menuItem?.name}</div>
                      <div className="recipe-category">{recipe.menuItem?.category?.name || recipe.menuItem?.category || 'Uncategorized'}</div>
                    </div>
                    <div className="fw-bold text-primary">NPR {recipe.menuItem?.price}</div>
                  </div>
                  
                  <div className="recipe-ingredients-list">
                    {recipe.ingredients.slice(0, 4).map((i, idx) => (
                      <span key={idx} className="ingredient-pill">
                        {i.ingredient?.name} ({i.quantity}{i.ingredient?.unit})
                      </span>
                    ))}
                    {recipe.ingredients.length > 4 && (
                      <span className="ingredient-pill">+{recipe.ingredients.length - 4} more</span>
                    )}
                  </div>

                  <div className="recipe-actions">
                    <button className="btn btn-outline-primary btn-sm flex-grow-1" onClick={() => openEditRecipe(recipe)}>
                      <Edit2 size={14} className="me-2" /> Edit Details
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDeleteRecipe(recipe._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {recipes.length === 0 && (
                <div className="col-12 text-center py-5 text-muted">No recipes found. Start by mapping menu items to ingredients.</div>
              )}
            </div>
          )}
        </div>
      )}

      {view === 'transactions' && (
        <div className="animate-in">
          <div className="table-glass">
            <div className="px-3 py-2 border-bottom bg-light d-flex justify-content-between align-items-center">
              <span className="fw-bold small">Audit Log (Most Recent)</span>
              <div className="d-flex gap-2">
                 <input type="date" className="form-control form-control-sm border-0 bg-white" />
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Change</th>
                  <th>Resulting Stock</th>
                  <th>Context / Reason</th>
                  <th>Recorded By</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {transactions?.map(t => (
                  <tr key={t._id}>
                    <td className="fw-bold">{t.ingredient?.name}</td>
                    <td className={t.delta > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                      {t.delta > 0 ? '+' : ''}{t.delta} {t.ingredient?.unit}
                    </td>
                    <td>{ingredients.find(i => i._id === (t.ingredient?._id || t.ingredient))?.currentStock || '-'}</td>
                    <td>
                      <div className="tiny-text">{t.reason}</div>
                      {t.referenceOrder && <div className="text-muted" style={{ fontSize: '10px' }}>Ref: #{t.referenceOrder._id.slice(-6)}</div>}
                    </td>
                    <td>
                       <div className="small fw-semibold">{t.createdBy?.name || 'System'}</div>
                       <div className="text-muted tiny-text">{t.createdBy?.email || ''}</div>
                    </td>
                    <td className="text-muted tiny-text">
                       {new Date(t.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'suppliers' && <SuppliersTab />}

      <IngredientModal 
        open={showIngredientModal} 
        onClose={() => setShowIngredientModal(false)}
        form={ingredientForm}
        setForm={setIngredientForm}
        onSave={handleSaveIngredient}
        isEdit={!!editingIngredient}
        units={ingredientUnits}
      />

      <RecipeModal 
        open={showRecipeModal}
        onClose={() => setShowRecipeModal(false)}
        menus={menus}
        ingredients={ingredients}
        onSave={handleSaveRecipe}
        initialData={editingRecipe}
      />
    </div>
  );
};

export default AdminInventory;
