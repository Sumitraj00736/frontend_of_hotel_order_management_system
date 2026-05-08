import React, { useMemo, useState } from 'react';
import UserHeader from './UserHeader.jsx';
import UserTabs from './UserTabs.jsx';
import UserTable from './UserTable.jsx';
import UserInviteModal from './UserInviteModal.jsx';
import UserEditModal from './UserEditModal.jsx';

const AdminUsers = ({
  users,
  roles = [],
  userForm,
  setUserForm,
  onCreateUser,
  onEditUser,
  onLoadPromotions,
  onSetStatus,
  onAssignRole,
  onDeleteUser,
  canEdit = false
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [tab, setTab] = useState('active');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return users
      .filter((u) => (u.status || 'active') === tab)
      .filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase()));
  }, [users, tab, search]);

  const counts = useMemo(
    () => ({
      active: users.filter((u) => (u.status || 'active') === 'active').length,
      pending: users.filter((u) => (u.status || 'active') === 'pending').length,
      inactive: users.filter((u) => (u.status || 'active') === 'inactive').length
    }),
    [users]
  );

  const handleCreate = async () => {
    await onCreateUser();
    setOpenModal(false);
  };

  return (
    <div className="card glass-card full-width-card users-panel">
      <UserHeader search={search} onSearch={setSearch} onInvite={() => setOpenModal(true)} />
      <UserTabs tab={tab} counts={counts} onChange={setTab} />
      <UserTable
        users={filtered}
        onEdit={(user) => {
          setEditUser(user);
          setEditOpen(true);
        }}
        onLoadPromotions={onLoadPromotions}
        onSetStatus={onSetStatus}
        roles={roles}
        onAssignRole={onAssignRole}
        onDelete={onDeleteUser}
        canEdit={canEdit}
      />

      {openModal && (
        <UserInviteModal
          userForm={userForm}
          setUserForm={setUserForm}
          onClose={() => setOpenModal(false)}
          onCreate={handleCreate}
          roles={roles}
        />
      )}

      {editOpen && editUser && canEdit && (
        <UserEditModal
          user={editUser}
          roles={roles}
          onClose={() => {
            setEditOpen(false);
            setEditUser(null);
          }}
          onSave={async (payload) => {
            await onEditUser?.(editUser, payload);
            setEditOpen(false);
            setEditUser(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminUsers;
