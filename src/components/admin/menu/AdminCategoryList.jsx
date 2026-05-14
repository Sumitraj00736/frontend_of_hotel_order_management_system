import React, { useMemo, useState } from 'react';
import { LayoutGrid, LayoutList, MoreHorizontal, ListOrdered, Info, Eye, Pencil } from 'lucide-react';
import SearchInput from '../../ui/SearchInput.jsx';
import IconButton from '../../ui/IconButton.jsx';

const AdminCategoryList = ({
  stats,
  categories,
  menus,
  search,
  onSearch,
  view,
  onViewChange,
  onAdd,
  onEdit,
  onDelete,
  onRefresh
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const rows = useMemo(
    () =>
      categories.map((cat) => ({
        ...cat,
        count: menus.filter((m) => m.category === cat._id).length
      })),
    [categories, menus]
  );

  return (
    <div className="category-list">
      <div className="category-header">
        <h2>Category</h2>
        <div className="category-actions">
          <SearchInput value={search} onChange={onSearch} className="category-search" />
          <button className="btn-arrange">
            <ListOrdered size={16} />
            Arrange
          </button>
          <IconButton className={view === 'grid' ? 'active' : ''} onClick={() => onViewChange('grid')}>
            <LayoutGrid size={16} />
          </IconButton>
          <IconButton className={view === 'list' ? 'active' : ''} onClick={() => onViewChange('list')}>
            <LayoutList size={16} />
          </IconButton>
          <button className="btn-add" onClick={onAdd}>+ Add New <span className="btn-badge">N</span></button>
          <IconButton onClick={onRefresh}><MoreHorizontal size={18} /></IconButton>
        </div>
      </div>

      <div className="category-stats">
        <div className="stat-card">
          <div className="stat-title">
            Total
            <span className="stat-info"><Info size={14} /></span>
          </div>
          <div className="stat-value">{stats.total}/100</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">
            Top Sold
            <span className="stat-pill blue">1 order</span>
            <span className="stat-info"><Info size={14} /></span>
          </div>
          <div className="stat-value">{stats.topSold}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">
            Most Dishes
            <span className="stat-pill blue">{stats.mostDishesCount} dishes</span>
            <span className="stat-info"><Info size={14} /></span>
          </div>
          <div className="stat-value">{stats.mostDishes}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">
            Avg. Dishes Per Category
          </div>
          <div className="stat-value">{stats.avg}</div>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="category-grid">
          {rows.map((cat) => (
            <div key={cat._id} className="category-card">
              <button className="card-menu-trigger" onClick={() => setOpenMenuId(openMenuId === cat._id ? null : cat._id)}>
                <MoreHorizontal size={18} />
              </button>
              {openMenuId === cat._id && (
                <div className="card-menu">
                  <button><Eye size={16} /> View Category</button>
                  <button onClick={() => { setOpenMenuId(null); onEdit(cat); }}><Pencil size={16} /> Edit Category</button>
                </div>
              )}
              <div className="category-image">
                {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} /> : <div className="placeholder">{cat.name.slice(0, 2).toUpperCase()}</div>}
              </div>
              <div className="category-name">{cat.name}</div>
              <div className="category-count">{cat.count} Dish</div>
            </div>
          ))}
          {rows.length === 0 && <div className="empty-note">No categories found.</div>}
        </div>
      ) : (
        <div className="category-table">
          <div className="table-head">
            <div>SN</div>
            <div>Name</div>
            <div>Dish Count</div>
            <div />
          </div>
          {rows.map((cat, index) => (
            <div key={cat._id} className="table-row">
              <div>{index + 1}</div>
              <div className="table-name">
                <div className="category-image small">
                  {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} /> : <div className="placeholder">{cat.name.slice(0, 2).toUpperCase()}</div>}
                </div>
                <div>{cat.name}</div>
              </div>
              <div className="dish-count">{cat.count}</div>
              <div className="table-actions">
              <IconButton className="dots-btn" onClick={() => setOpenMenuId(openMenuId === cat._id ? null : cat._id)}>
                <MoreHorizontal size={18} />
              </IconButton>
                {openMenuId === cat._id && (
                  <div className="action-dropdown">
                    <button onClick={() => { setOpenMenuId(null); onEdit(cat); }}>Edit Category</button>
                    <button className="danger" onClick={() => { setOpenMenuId(null); onDelete(cat._id); }}>Delete Category</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {rows.length === 0 && <div className="empty-note">No categories found.</div>}
        </div>
      )}
    </div>
  );
};

export default AdminCategoryList;
