import React, { useMemo, useState } from 'react';
import UserHeader    from './header/UserHeader.jsx';
import UserTabs      from './UserTabs.jsx';
import UserTable     from './table/UserTable.jsx';
import UserInviteModal from './modals/UserInviteModal.jsx';
import UserEditModal   from './modals/UserEditModal.jsx';

const AdminUsers = ({
  users = [],
  roles = [],
  userForm,
  setUserForm,
  onCreateUser,
  onEditUser,
  onLoadPromotions,
  onSetStatus,
  onAssignRole,
  onDeleteUser,
  canEdit = true,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [editOpen, setEditOpen]   = useState(false);
  const [editUser, setEditUser]   = useState(null);
  const [tab, setTab]             = useState('active');
  const [search, setSearch]       = useState('');

  const filtered = useMemo(() =>
    users
      .filter((u) => (u.status || 'active') === tab)
      .filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      ),
    [users, tab, search]
  );

  const counts = useMemo(() => ({
    active:   users.filter((u) => (u.status || 'active') === 'active').length,
    pending:  users.filter((u) => (u.status || 'active') === 'pending').length,
    inactive: users.filter((u) => (u.status || 'active') === 'inactive').length,
  }), [users]);

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* Sticky Header */}
      <UserHeader
        search={search}
        onSearch={setSearch}
        onInvite={() => setOpenModal(true)}
      />

      {/* Tab Bar */}
      <UserTabs tab={tab} counts={counts} onChange={setTab} />

      {/* User Table */}
      <UserTable
        users={filtered}
        roles={roles}
        onEdit={(user) => { setEditUser(user); setEditOpen(true); }}
        onLoadPromotions={onLoadPromotions}
        onSetStatus={onSetStatus}
        onAssignRole={onAssignRole}
        onDelete={onDeleteUser}
        canEdit={canEdit}
      />

      {/* Modals */}
      {openModal && (
        <UserInviteModal
          userForm={userForm}
          setUserForm={setUserForm}
          onClose={() => setOpenModal(false)}
          onCreate={async () => { await onCreateUser(); setOpenModal(false); }}
          roles={roles}
        />
      )}

      {editOpen && editUser && (
        <UserEditModal
          user={editUser}
          roles={roles}
          onClose={() => { setEditOpen(false); setEditUser(null); }}
          onSave={async (payload) => { await onEditUser?.(editUser, payload); setEditOpen(false); }}
        />
      )}
    </div>
  );
};

export default AdminUsers;