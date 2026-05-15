import React, { useMemo, useState } from 'react';
import { LayoutGrid, LayoutList, MoreHorizontal, ListOrdered, Eye, Pencil, Trash2, RefreshCw } from 'lucide-react';
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

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="admin-categories-list">
      {/* Header Section */}
      <div className="category-header">
        <h2>Category</h2>
        <div className="category-actions">
          <SearchInput value={search} onChange={onSearch} className="category-search" />
          <button className="btn-arrange" type="button">
            <ListOrdered size={16} />
            Arrange
          </button>
          <div className="view-toggle-group">
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
          </div>
          <button className="btn-add" onClick={onAdd} type="button">
            + Add New <span className="btn-badge">N</span>
          </button>
          <IconButton onClick={onRefresh} title="Refresh">
            <RefreshCw size={18} />
          </IconButton>
        </div>
      </div>

      {/* Stats Section */}
      <div className="menu-categories-stats">
        <StatCard label="Total" mainVal={stats.total} limit="/100" subText="Categories" progress={(stats.total / 100) * 100} />
        <StatCard label="Top Sold" mainVal={stats.topSold} subText="1 Order" progress={70} highlight />
        <StatCard label="Most Dishes" mainVal={stats.mostDishes} subText={`${stats.mostDishesCount} dishes`} progress={85} highlight />
        <StatCard label="Avg. Dishes" mainVal={stats.avg} subText="Per category" progress={55} />
      </div>

      {/* List/Grid View Rendering */}
      {view === 'grid' ? (
        <div className="category-grid">
          {rows.map((cat) => (
            <div key={cat._id} className="category-card">
              <div className="card-action-wrapper">
                <button className="card-menu-trigger" onClick={() => toggleMenu(cat._id)}>
                  <MoreHorizontal size={18} />
                </button>
                {openMenuId === cat._id && (
                    <DropdownMenu 
                        cat={cat} 
                        onEdit={onEdit} 
                        onDelete={onDelete} 
                        close={() => setOpenMenuId(null)} 
                    />
                )}
              </div>
              <div className="category-image">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} />
                ) : (
                  <div className="placeholder">{cat.name.slice(0, 2).toUpperCase()}</div>
                )}
              </div>
              <div className="category-name">{cat.name}</div>
              <div className="category-count">{cat.count} Dishes</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="category-table-wrap">
          <table className="category-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Name</th>
                <th>Dish Count</th>
                <th className="text-right">Manage</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((cat, index) => (
                <tr key={cat._id}>
                  <td>{String(index + 1).padStart(2, '0')}</td>
                  <td className="category-name-cell">
                    <div className="category-avatar">
                      {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} /> : <span>{cat.name.slice(0, 2).toUpperCase()}</span>}
                    </div>
                    <div className="category-name-text">{cat.name}</div>
                  </td>
                  <td>{cat.count} Dishes</td>
                  <td className="category-actions-cell">
                    <div className="cell-action-wrapper">
                      <IconButton onClick={() => toggleMenu(cat._id)}>
                        <MoreHorizontal size={18} />
                      </IconButton>
                      {openMenuId === cat._id && (
                        <DropdownMenu 
                            cat={cat} 
                            onEdit={onEdit} 
                            onDelete={onDelete} 
                            close={() => setOpenMenuId(null)} 
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">Showing {rows.length} categories</div>
        </div>
      )}
    </div>
  );
};

/* Sub-Components for cleaner code */
const StatCard = ({ label, mainVal, limit, subText, progress, highlight }) => (
  <div className="menu-stat-card">
    <div className="stat-header">
      <div className="stat-info">
        <span className="stat-label">{label}</span>
      </div>
      <div className={`stat-value-display ${highlight ? 'orange-text' : ''}`}>
        {mainVal}{limit}
      </div>
    </div>
    <div className="stat-progress-container">
      <div className={`stat-progress-bar ${highlight ? 'highlight' : ''}`} style={{ width: `${progress}%` }}></div>
    </div>
    <div className="stat-sub-text">{subText}</div>
  </div>
);

const DropdownMenu = ({ cat, onEdit, onDelete, close }) => (
  <>
    <div className="menu-backdrop" onClick={close} />
    <div className="action-dropdown">
      <button onClick={() => { onEdit(cat); close(); }}>
        <Pencil size={14} /> Edit Category
      </button>
      <button className="danger" onClick={() => { onDelete(cat._id); close(); }}>
        <Trash2 size={14} /> Delete Category
      </button>
    </div>
  </>
);

export default AdminCategoryList;