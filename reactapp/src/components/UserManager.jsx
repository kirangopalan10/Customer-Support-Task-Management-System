import React, { useState } from 'react';
import './UserManager.css';

export default function UserManager({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  currentUser,
}) {
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('SUPPORT_AGENT');

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('SUPPORT_AGENT');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingUser) {
      onUpdateUser(editingUser.id, { name, email, role });
    } else {
      onAddUser({ name, email, role });
    }
    setIsModalOpen(false);
  };

  const getRoleBadgeClass = (r) => {
    switch (r?.toUpperCase()) {
      case 'ADMIN':
        return 'badge-role-admin';
      case 'SUPPORT_AGENT':
        return 'badge-role-agent';
      case 'CUSTOMER':
        return 'badge-role-customer';
      default:
        return 'badge-role-user';
    }
  };

  return (
    <div className="user-manager-container">
      <div className="user-manager-header">
        <div>
          <h2>User & Agent Management</h2>
          <p className="user-desc">Configure support agents, supervisors, and customer accounts</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New User
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="user-filter-bar card">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="role-chips">
          {['ALL', 'ADMIN', 'SUPPORT_AGENT', 'CUSTOMER', 'USER'].map((r) => (
            <button
              key={r}
              className={`chip ${roleFilter === r ? 'active' : ''}`}
              onClick={() => setRoleFilter(r)}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="user-table-wrapper card">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email Address</th>
              <th>Role</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-records">
                  No users found for this filter.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="user-row">
                  <td className="user-id">#{user.id}</td>
                  <td>
                    <div className="user-profile">
                      <div className="user-avatar-circle">{user.name[0]}</div>
                      <div>
                        <div className="user-name">
                          {user.name}{' '}
                          {user.id === currentUser?.id && (
                            <span className="you-pill">You</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td>
                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="user-actions">
                    <button
                      className="action-icon-btn"
                      title="Edit User"
                      onClick={() => handleOpenEdit(user)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      className="action-icon-btn delete-btn"
                      title="Delete User"
                      onClick={() => {
                        if (window.confirm(`Delete user ${user.name}?`)) {
                          onDeleteUser(user.id);
                        }
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? 'Edit User Details' : 'Register New User / Agent'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah.j@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>System Role *</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="SUPPORT_AGENT">Support Agent</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="USER">Standard User</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
