import React from 'react';
import './Navbar.css';

export default function Navbar({ activeTab, setActiveTab, backendOnline, currentUser, setCurrentUser, users }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => setActiveTab('dashboard')}>
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">SupportFlow</span>
            <span className="brand-subtitle">Task Management</span>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            Dashboard
          </button>

          <button
            className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Tasks
          </button>

          <button
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Users & Agents
          </button>

          <button
            className={`nav-btn ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
            Assignments
          </button>

          <button
            className={`nav-btn ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Status Logs
          </button>
        </nav>

        <div className="navbar-actions">
          <div className={`status-pill ${backendOnline ? 'online' : 'mock'}`} title={backendOnline ? 'Connected to Spring Boot API' : 'Backend is currently offline; operating in Demo / Mock mode'}>
            <span className="status-dot"></span>
            <span>{backendOnline ? 'API Connected' : 'Demo Mode'}</span>
          </div>

          <div className="user-selector">
            <span className="user-label">Active:</span>
            <select
              value={currentUser?.id || 1}
              onChange={(e) => {
                const found = users.find((u) => u.id === Number(e.target.value));
                if (found) setCurrentUser(found);
              }}
              className="user-dropdown"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
