import React, { useMemo, useState } from 'react';
import { MoreHorizontal, SlidersHorizontal } from 'lucide-react';
import SearchInput from '../../ui/SearchInput.jsx';
import IconButton from '../../ui/IconButton.jsx';

const AdminDishesList = ({
  stats,
  dishes,
  search,
  onSearch,
  categories,
  submenus,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
  onToggle
}) => {
  const catMap = useMemo(() => new Map(categories.map((c) => [c._id, c.name])), [categories]);
  const subMap = useMemo(() => new Map(submenus.map((s) => [s._id, s.name])), [submenus]);
  const [openMenuId, setOpenMenuId] = useState(null);

  return (
    <div className="dishes-list">
      <div className="dishes-header">
        <h2>Dishes</h2>
        <div className="dishes-actions">
          <SearchInput value={search} onChange={onSearch} className="dishes-search" />
          <button className="btn-filter">
            <SlidersHorizontal size={16} />
            Filter
          </button>
          <button className="btn-add" onClick={onAdd}>
            + Add New
            <span className="btn-badge">N</span>
          </button>
          <IconButton className="btn-more" onClick={onRefresh}>
            <MoreHorizontal size={18} />
          </IconButton>
        </div>
      </div>

      <div className="menu-dishes-stats">
  {/* Total Stats Card */}
  <div className="menu-stat-card">
    <div className="stat-header">
      <div className="stat-info">
        <span className="stat-large-number">10</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-value-display">
        <span className="stat-main-val">{stats.total}</span>
        <span className="stat-total-limit">/1000</span>
      </div>
    </div>
    <div className="stat-progress-container">
      <div className="stat-progress-bar" style={{ width: `${(stats.total / 1000) * 100}%` }}></div>
    </div>
    <div className="stat-sub-text">{stats.active} Active</div>
  </div>

  {/* Top Sold Card */}
  <div className="menu-stat-card">
    <div className="stat-header">
      <div className="stat-info">
        <span className="stat-large-number">1</span>
        <span className="stat-label">Top Sold</span>
      </div>
      <div className="stat-value-display orange-text">
        {stats.topSold || 'Burger'}
      </div>
    </div>
    <div className="stat-progress-container">
      <div className="stat-progress-bar highlight" style={{ width: '70%' }}></div>
    </div>
    <div className="stat-sub-text">1 Order</div>
  </div>

  {/* Top Dish Type Card */}
  <div className="menu-stat-card">
    <div className="stat-header">
      <div className="stat-info">
        <span className="stat-large-number">1</span>
        <span className="stat-label">Top Dish Type</span>
      </div>
      <div className="stat-value-display orange-text">
        {stats.topType || 'Veg'}
      </div>
    </div>
    <div className="stat-progress-container">
      <div className="stat-progress-bar highlight" style={{ width: '85%' }}></div>
    </div>
    <div className="stat-sub-text">1 Dish</div>
  </div>
</div>

      <div className="dishes-table-wrap">
        <table className="dishes-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Dish Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Type</th>
              <th>Sub Menu</th>
              <th>Preparation Time</th>
              <th>KOT Type</th>
              <th>Available</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {dishes.map((d, idx) => (
              <tr key={d._id}>
                <td>{idx + 1}</td>
                <td className="dish-name-cell">
                  <div className="dish-avatar">
                    {d.imageUrl ? <img src={d.imageUrl} alt={d.name} /> : <span>{d.name.slice(0, 2).toUpperCase()}</span>}
                  </div>
                  <div className="dish-name">{d.name}</div>
                </td>
                <td className="price-cell">
                  Rs {d.price}{d.maxPrice ? ` - Rs ${d.maxPrice}` : ''}
                </td>
                <td>{d.category?.name || catMap.get(d.category) || '-'}</td>
                <td>{d.type || '-'}</td>
                <td>{d.subMenu?.name || subMap.get(d.subMenu) || '-'}</td>
                <td>{d.preparationTimeMinutes ? `${d.preparationTimeMinutes} min` : '-'}</td>
                <td>{d.kotType || '-'}</td>
                <td>
                  <label className="switch-lite">
                    <input type="checkbox" checked={!!d.isAvailable} onChange={() => onToggle(d)} />
                    <span />
                  </label>
                </td>
                <td className="actions-cell">
                  <div className="action-menu">
                    <IconButton onClick={() => setOpenMenuId(openMenuId === d._id ? null : d._id)}>
                      <MoreHorizontal size={18} />
                    </IconButton>
                    {openMenuId === d._id && (
                      <div className="action-dropdown">
                        <button onClick={() => { setOpenMenuId(null); onEdit(d); }}>Edit</button>
                        <button className="danger" onClick={() => { setOpenMenuId(null); onDelete(d._id); }}>Delete</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {dishes.length === 0 && (
              <tr>
                <td colSpan={10} className="empty-row">No dishes found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="table-footer">0 of {dishes.length} row(s) selected.</div>
      </div>
    </div>
  );
};

export default AdminDishesList;
