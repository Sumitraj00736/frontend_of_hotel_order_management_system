import React, { useMemo, useState } from 'react';
import '../../../common/css/admin/users/adminusers.css';
import UserHeader from './UserHeader';
import UserTabs from './UserTabs';
import UserTable from './UserTable';
import UserInviteModal from './UserInviteModal';
import UserEditModal from './UserEditModal';

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
  canEdit = true
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [tab, setTab] = useState('active');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return users
      .filter((u) => (u.status || 'active') === tab)
      .filter((u) => 
        u.name?.toLowerCase().includes(search.toLowerCase()) || 
        u.email?.toLowerCase().includes(search.toLowerCase())
      );
  }, [users, tab, search]);

  const counts = useMemo(() => ({
    active: users.filter((u) => (u.status || 'active') === 'active').length,
    pending: users.filter((u) => (u.status || 'active') === 'pending').length,
    inactive: users.filter((u) => (u.status || 'active') === 'inactive').length
  }), [users]);

  return (
    <div className="users-panel">
      <UserHeader 
        search={search} 
        onSearch={setSearch} 
        onInvite={() => setOpenModal(true)} 
      />
      
      <UserTabs tab={tab} counts={counts} onChange={setTab} />
      
      <UserTable
        users={filtered}
        roles={roles}
        onEdit={(user) => {
          setEditUser(user);
          setEditOpen(true);
        }}
        onLoadPromotions={onLoadPromotions}
        onSetStatus={onSetStatus}
        onAssignRole={onAssignRole}
        onDelete={onDeleteUser}
        canEdit={canEdit}
      />

      {openModal && (
        <UserInviteModal
          userForm={userForm}
          setUserForm={setUserForm}
          onClose={() => setOpenModal(false)}
          onCreate={async () => {
            await onCreateUser();
            setOpenModal(false);
          }}
          roles={roles}
        />
      )}

      {editOpen && editUser && (
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
          }}
        />
      )}
    </div>
  );
};

export default AdminUsers;