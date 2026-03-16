import React, { useMemo, useState } from 'react';
import '../../../common/css/admin/menu/categories.css';
import AdminCategoryList from './AdminCategoryList.jsx';
import AdminCategoryModal from './AdminCategoryModal.jsx';

const AdminCategories = ({ categories, menus, reload, onCreate, onUpdate, onDelete }) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [view, setView] = useState('list');

  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [categories, search]
  );

  const stats = useMemo(() => {
    const total = categories.length;
    const categoryDishCount = categories.map((c) => ({
      id: c._id,
      name: c.name,
      count: menus.filter((m) => m.category === c._id).length
    }));
    const topByCount = categoryDishCount.sort((a, b) => b.count - a.count)[0] || { name: '-', count: 0 };
    const avg = total ? Math.round(categoryDishCount.reduce((acc, cur) => acc + cur.count, 0) / total) : 0;
    return {
      total,
      topSold: topByCount.name,
      mostDishes: topByCount.name,
      mostDishesCount: topByCount.count,
      avg
    };
  }, [categories, menus]);

  const openAdd = () => {
    setEditCategory(null);
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditCategory(category);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    if (editCategory) {
      await onUpdate(editCategory._id, payload);
    } else {
      await onCreate(payload);
    }
    setModalOpen(false);
  };

  return (
    <div className="category-page">
      <AdminCategoryList
        stats={stats}
        categories={filtered}
        menus={menus}
        search={search}
        onSearch={setSearch}
        view={view}
        onViewChange={setView}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={onDelete}
        onRefresh={reload}
      />
      {modalOpen && (
        <AdminCategoryModal
          category={editCategory}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AdminCategories;
