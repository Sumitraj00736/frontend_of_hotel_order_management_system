import React, { useMemo, useState } from 'react';
import '../../../common/css/admin/menu/dishes.css';
import AdminDishesList from './AdminDishesList.jsx';
import AdminDishForm from './AdminDishForm.jsx';

const AdminDishes = ({ dishes, categories, submenus, addOns, onToggle, onRefresh, onCreate, onUpdate, onDelete }) => {
  const [view, setView] = useState('list');
  const [selectedDish, setSelectedDish] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () => dishes.filter((d) => d.name.toLowerCase().includes(search.toLowerCase())),
    [dishes, search]
  );

  const stats = useMemo(() => {
    const total = dishes.length;
    const active = dishes.filter((d) => d.isAvailable).length;
    const topType = dishes.reduce((acc, d) => {
      const key = d.type || 'Uncategorized';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const topTypeEntry = Object.entries(topType).sort((a, b) => b[1] - a[1])[0] || ['-', 0];
    const topSold = dishes[0]?.name || '-';
    return { total, active, topType: topTypeEntry[0], topSold };
  }, [dishes]);

  const handleAdd = () => {
    setSelectedDish(null);
    setView('create');
  };

  const handleEdit = (dish) => {
    setSelectedDish(dish);
    setView('edit');
  };

  const handleSave = async (payload) => {
    if (view === 'edit' && selectedDish) {
      await onUpdate(selectedDish._id, payload);
    } else {
      await onCreate(payload);
    }
    setView('list');
  };

  return (
    <div className="dishes-page">
      {view === 'list' && (
        <AdminDishesList
          stats={stats}
          dishes={filtered}
          search={search}
          onSearch={setSearch}
          categories={categories}
          submenus={submenus}
          onRefresh={onRefresh}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      )}
      {view !== 'list' && (
        <AdminDishForm
          mode={view}
          dish={selectedDish}
          categories={categories}
          submenus={submenus}
          addOns={addOns}
          onCancel={() => setView('list')}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AdminDishes;
