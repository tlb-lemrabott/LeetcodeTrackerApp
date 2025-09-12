import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts';
import { useApi } from '../../hooks';
import { apiService } from '../../services';
import { Button, LoadingSpinner, Modal } from '../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChartBar, faDownload, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Fetch system stats
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    execute: fetchStats
  } = useApi(apiService.getSystemStats);

  // Fetch all users
  const {
    data: users,
    loading: usersLoading,
    error: usersError,
    execute: fetchUsers
  } = useApi(apiService.getAllUsers);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleExportUserData = async (userId, format) => {
    try {
      const blob = await apiService.exportUserData(userId, format);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `user-${userId}-data.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="admin-error">
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and monitor system statistics</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <FontAwesomeIcon icon={faChartBar} />
          System Statistics
        </button>
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <FontAwesomeIcon icon={faUsers} />
          User Management
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'stats' && (
          <div className="stats-section">
            {statsLoading ? (
              <LoadingSpinner text="Loading statistics..." />
            ) : statsError ? (
              <div className="error-message">Error loading statistics: {statsError.message}</div>
            ) : (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <div className="stat-content">
                    <h3>Total Users</h3>
                    <p className="stat-number">{stats?.totalUsers || 0}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={faChartBar} />
                  </div>
                  <div className="stat-content">
                    <h3>Total Problems</h3>
                    <p className="stat-number">{stats?.totalProblems || 0}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-content">
                    <h3>Problems by Status</h3>
                    <div className="status-breakdown">
                      <div className="status-item">
                        <span className="status-label">TODO:</span>
                        <span className="status-count">{stats?.problemsByStatus?.TODO || 0}</span>
                      </div>
                      <div className="status-item">
                        <span className="status-label">DOING:</span>
                        <span className="status-count">{stats?.problemsByStatus?.DOING || 0}</span>
                      </div>
                      <div className="status-item">
                        <span className="status-label">DONE:</span>
                        <span className="status-count">{stats?.problemsByStatus?.DONE || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-content">
                    <h3>Problems by Level</h3>
                    <div className="level-breakdown">
                      <div className="level-item">
                        <span className="level-label">Easy:</span>
                        <span className="level-count">{stats?.problemsByLevel?.EASY || 0}</span>
                      </div>
                      <div className="level-item">
                        <span className="level-label">Medium:</span>
                        <span className="level-count">{stats?.problemsByLevel?.MEDIUM || 0}</span>
                      </div>
                      <div className="level-item">
                        <span className="level-label">Hard:</span>
                        <span className="level-count">{stats?.problemsByLevel?.HARD || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            {usersLoading ? (
              <LoadingSpinner text="Loading users..." />
            ) : usersError ? (
              <div className="error-message">Error loading users: {usersError.message}</div>
            ) : (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Problems Count</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.map((user) => (
                      <tr key={user.id} className="user-row">
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role.toLowerCase()}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.problemsCount || 0}</td>
                        <td>
                          <div className="user-actions">
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => handleUserClick(user)}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => handleExportUserData(user.id, 'pdf')}
                            >
                              <FontAwesomeIcon icon={faDownload} />
                              PDF
                            </Button>
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => handleExportUserData(user.id, 'excel')}
                            >
                              <FontAwesomeIcon icon={faDownload} />
                              Excel
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={`User Details - ${selectedUser?.username}`}
        size="large"
      >
        {selectedUser && (
          <div className="user-details">
            <div className="user-info">
              <div className="info-item">
                <label>Username:</label>
                <span>{selectedUser.username}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{selectedUser.email}</span>
              </div>
              <div className="info-item">
                <label>Role:</label>
                <span className={`role-badge ${selectedUser.role.toLowerCase()}`}>
                  {selectedUser.role}
                </span>
              </div>
              <div className="info-item">
                <label>Problems Count:</label>
                <span>{selectedUser.problemsCount || 0}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
