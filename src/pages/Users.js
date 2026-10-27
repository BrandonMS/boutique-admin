import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import '../styles/Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetUserId, setResetUserId] = useState(null);
  const [resetUserEmail, setResetUserEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users: ' + (err.response?.data?.error || err.message));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        // Update existing user
        await userService.updateUser(
          editingId,
          formData.firstName,
          formData.lastName,
          formData.phoneNumber,
          formData.address,
          formData.role,
          false
        );
        setSuccess('User updated successfully');
      } else {
        // Create new user
        if (!formData.password) {
          setError('Password is required for new users');
          return;
        }
        await userService.createUser(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName,
          formData.phoneNumber,
          formData.address,
          formData.role
        );
        setSuccess('User created successfully');
      }

      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        role: 'customer',
      });
      setEditingId(null);
      setShowForm(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save user');
      console.error('Error:', err);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      email: user.email,
      password: '',
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      phoneNumber: user.phone_number || '',
      address: user.address || '',
      role: user.role,
    });
    setEditingId(user.id);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleResetPassword = (user) => {
    setResetUserId(user.id);
    setResetUserEmail(user.email);
    setResetPassword('');
    setResetConfirmPassword('');
    setShowPasswordReset(true);
    setError('');
    setSuccess('');
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!resetPassword) {
      setError('New password is required');
      return;
    }

    if (resetPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (resetPassword !== resetConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await userService.resetUserPassword(resetUserId, resetPassword);
      setSuccess(`Password for ${resetUserEmail} reset successfully`);
      setShowPasswordReset(false);
      setResetPassword('');
      setResetConfirmPassword('');
      setResetUserId(null);
      setResetUserEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      setError('');
      setSuccess('');
      try {
        await userService.deleteUser(id);
        setSuccess('User deleted successfully');
        loadUsers();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete user');
        console.error('Error:', err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      role: 'customer',
    });
    setError('');
    setSuccess('');
  };

  const handleCancelReset = () => {
    setShowPasswordReset(false);
    setResetPassword('');
    setResetConfirmPassword('');
    setResetUserId(null);
    setResetUserEmail('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="users-container">
      <h1>User Management</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!showForm && !showPasswordReset && (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add New User
        </button>
      )}

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit User' : 'Create New User'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={editingId !== null}
                required
              />
            </div>

            {!editingId && (
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingId}
                />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleInputChange}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? 'Update User' : 'Create User'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showPasswordReset && (
        <div className="form-card password-reset-form">
          <h2>Reset User Password</h2>
          <p className="user-info">Email: <strong>{resetUserEmail}</strong></p>
          <form onSubmit={handleResetPasswordSubmit}>
            <div className="form-group">
              <label>New Password *</label>
              <input
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                value={resetConfirmPassword}
                onChange={(e) => setResetConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-warning">
                Reset Password
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancelReset}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="users-table-container">
        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.first_name} {user.last_name}
                  </td>
                  <td>{user.phone_number || '-'}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>{user.role}</span>
                  </td>
                  <td>{user.email_verified ? '✓' : '✗'}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleResetPassword(user)}
                      title="Reset user password"
                    >
                      Reset Password
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;
