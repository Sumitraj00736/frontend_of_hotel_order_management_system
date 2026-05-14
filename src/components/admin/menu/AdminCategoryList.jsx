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
    <div className="admin-categories-list">
      <div className="category-header">
        <h2>Category</h2>
        <div className="category-actions">
          <SearchInput value={search} onChange={onSearch} className="category-search" />
          <button className="btn-arrange" type="button">
            <ListOrdered size={16} />
            Arrange
          </button>
          <IconButton
            className={view === 'grid' ? 'active' : ''}
            onClick={() => onViewChange('grid')}
            title="Grid view"
          >
            <LayoutGrid size={16} />
          </IconButton>
          <IconButton
            className={view === 'list' ? 'active' : ''}
            onClick={() => onViewChange('list')}
            title="List view"
          >
            <LayoutList size={16} />
          </IconButton>
          <button className="btn-add" onClick={onAdd} type="button">
            + Add New <span className="btn-badge">N</span>
          </button>
          <IconButton onClick={onRefresh} title="Refresh">
            <MoreHorizontal size={18} />
          </IconButton>
        </div>
      </div>

      <div className="category-stats menu-categories-stats">
        <div className="menu-stat-card menu-category-stat-card">
          <div className="stat-header">
            <div className="stat-info">
              <span className="stat-large-number">10</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-value-display">
              <span className="stat-main-val">{stats.total}</span>
              <span className="stat-total-limit">/100</span>
            </div>
          </div>
          <div className="stat-progress-container">
            <div
              className="stat-progress-bar"
              style={{ width: `${(stats.total / 100) * 100}%` }}
            ></div>
          </div>
          <div className="stat-sub-text">Categories</div>
        </div>

        <div className="menu-stat-card menu-category-stat-card">
          <div className="stat-header">
            <div className="stat-info">
              <span className="stat-large-number">1</span>
              <span className="stat-label">Top Sold</span>
            </div>
            <div className="stat-value-display orange-text">{stats.topSold}</div>
          </div>
          <div className="stat-progress-container">
            <div className="stat-progress-bar highlight" style={{ width: '70%' }}></div>
          </div>
          <div className="stat-sub-text">1 Order</div>
        </div>

        <div className="menu-stat-card menu-category-stat-card">
          <div className="stat-header">
            <div className="stat-info">
              <span className="stat-large-number">1</span>
              <span className="stat-label">Most Dishes</span>
            </div>
            <div className="stat-value-display orange-text">{stats.mostDishes}</div>
          </div>
          <div className="stat-progress-container">
            <div className="stat-progress-bar highlight" style={{ width: '85%' }}></div>
          </div>
          <div className="stat-sub-text">{stats.mostDishesCount} dishes</div>
        </div>

        <div className="menu-stat-card menu-category-stat-card">
          <div className="stat-header">
            <div className="stat-info">
              <span className="stat-large-number">{stats.avg}</span>
              <span className="stat-label">Avg. Dishes / Category</span>
            </div>
            <div className="stat-value-display orange-text">{stats.avg}</div>
          </div>
          <div className="stat-progress-container">
            <div className="stat-progress-bar" style={{ width: '55%' }}></div>
          </div>
          <div className="stat-sub-text">Per category</div>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="category-grid">
          {rows.map((cat) => (
            <div key={cat._id} className="category-card">
              <button
                className="card-menu-trigger"
                onClick={() => setOpenMenuId(openMenuId === cat._id ? null : cat._id)}
                type="button"
                aria-label="Open category menu"
              >
                <MoreHorizontal size={18} />
              </button>

              {openMenuId === cat._id && (
                <div className="card-menu">
                  <button type="button">
                    <Eye size={16} /> View Category
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuId(null);
                      onEdit(cat);
                    }}
                  >
                    <Pencil size={16} /> Edit Category
                  </button>
                </div>
              )}

              <div className="category-image">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} />
                ) : (
                  <div className="placeholder">{cat.name.slice(0, 2).toUpperCase()}</div>
                )}
              </div>
              <div className="category-name">{cat.name}</div>
              <div className="category-count">{cat.count} Dish</div>
            </div>
          ))}
          {rows.length === 0 && <div className="empty-note">No categories found.</div>}
        </div>
      ) : (
        <div className="category-table-wrap">
          <table className="category-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Name</th>
                <th>Dish Count</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((cat, index) => (
                <tr key={cat._id}>
                  <td>{index + 1}</td>
                  <td className="category-name-cell">
                    <div className="category-avatar">
                      {cat.imageUrl ? (
                        <img src={cat.imageUrl} alt={cat.name} />
                      ) : (
                        <span>{cat.name.slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="category-name-text">{cat.name}</div>
                  </td>
                  <td className="category-count-cell">{cat.count}</td>
                  <td className="category-actions-cell">
                    <div className="catodary-action-shell">
                      <IconButton
                        className="icon-btn-category"
                        onClick={() =>
                          setOpenMenuId(openMenuId === cat._id ? null : cat._id)
                        }
                        title="Manage category"
                      >
                        <MoreHorizontal size={18} />
                      </IconButton>

                      {openMenuId === cat._id && (
                        <div className="action-dropdown">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              onEdit(cat);
                            }}
                          >
                            Edit Category
                          </button>
                          <button
                            type="button"
                            className="danger"
                            onClick={() => {
                              setOpenMenuId(null);
                              onDelete(cat._id);
                            }}
                          >
                            Delete Category
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-row">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="table-footer">0 of {rows.length} row(s) selected.</div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoryList;

