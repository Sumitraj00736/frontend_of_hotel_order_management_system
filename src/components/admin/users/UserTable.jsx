import React from 'react';
import UserRow from './UserRow.jsx';

const UserTable = ({ users, onEdit, onLoadPromotions, onSetStatus }) => {
  return (
    <div className="users-table">
      <div className="users-table-head">
        <span>SN</span>
        <span>User</span>
        <span>Role</span>
        <span>Position</span>
        <span>Phone Number</span>
        <span>Email</span>
        <span />
      </div>
      {users.length === 0 ? (
        <div className="users-empty">No users found</div>
      ) : (
        users.map((u, idx) => (
          <UserRow
            key={u._id}
            index={idx + 1}
            user={u}
            onEdit={onEdit}
            onLoadPromotions={onLoadPromotions}
            onSetStatus={onSetStatus}
          />
        ))
      )}
    </div>
  );
};

export default UserTable;
