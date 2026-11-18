import React from 'react';
import './Dashboard.css';

export default function Dashboard({ tasks, users, setActiveTab, onSelectTask, onOpenCreateTask }) {
  const totalTasks = tasks.length;
  const openTasks = tasks.filter((t) => t.status === 'OPEN').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const resolvedTasks = tasks.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const highPriority = tasks.filter((t) => t.priority === 'HIGH').length;
  const agentsCount = users.filter((u) => u.role === 'SUPPORT_AGENT' || u.role === 'ADMIN').length;

  const recentTasks = [...tasks].slice(0, 5);

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1>Customer Support Operations</h1>
          <p>Real-time task dispatching, ticket lifecycle monitoring, and agent workload tracking.</p>
        </div>
        <div className="welcome-actions">
          <button className="btn btn-primary" onClick={onOpenCreateTask}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create New Task
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => setActiveTab('tasks')}>
          <div className="stat-header">
            <span className="stat-title">Total Tasks</span>
            <div className="stat-icon icon-total">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
          </div>
          <div className="stat-value">{totalTasks}</div>
          <div className="stat-subtext">Across all queues</div>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('tasks')}>
          <div className="stat-header">
            <span className="stat-title">Open Tickets</span>
            <div className="stat-icon icon-open">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 14 14"></polyline>
              </svg>
            </div>
          </div>
          <div className="stat-value">{openTasks}</div>
          <div className="stat-subtext text-warning">Requires triage</div>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('tasks')}>
          <div className="stat-header">
            <span className="stat-title">In Progress</span>
            <div className="stat-icon icon-progress">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
              </svg>
            </div>
          </div>
          <div className="stat-value">{inProgressTasks}</div>
          <div className="stat-subtext">Active investigation</div>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('tasks')}>
          <div className="stat-header">
            <span className="stat-title">Resolved</span>
            <div className="stat-icon icon-resolved">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          <div className="stat-value">{resolvedTasks}</div>
          <div className="stat-subtext text-success">
            {totalTasks > 0 ? `${Math.round((resolvedTasks / totalTasks) * 100)}% resolution rate` : '0%'}
          </div>
        </div>

        <div className="stat-card highlight-danger" onClick={() => setActiveTab('tasks')}>
          <div className="stat-header">
            <span className="stat-title">High Priority</span>
            <div className="stat-icon icon-danger">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
          </div>
          <div className="stat-value">{highPriority}</div>
          <div className="stat-subtext text-danger">Immediate SLA attention</div>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('users')}>
          <div className="stat-header">
            <span className="stat-title">Active Agents</span>
            <div className="stat-icon icon-agents">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
          <div className="stat-value">{agentsCount}</div>
          <div className="stat-subtext">Ready for assignment</div>
        </div>
      </div>

      {/* Breakdown and Recent Tickets */}
      <div className="dashboard-columns">
        {/* Left Column: Recent Tickets */}
        <div className="dashboard-section card">
          <div className="section-header">
            <div>
              <h2>Recent Customer Tasks</h2>
              <p className="section-desc">Latest support tickets logged across channels</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('tasks')}>
              View All Tasks &rarr;
            </button>
          </div>

          <div className="task-preview-list">
            {recentTasks.length === 0 ? (
              <div className="empty-notice">No tasks created yet. Click "Create New Task" to begin.</div>
            ) : (
              recentTasks.map((t) => (
                <div key={t.id} className="task-preview-item" onClick={() => onSelectTask(t)}>
                  <div className="preview-left">
                    <span className="task-id">#{t.id}</span>
                    <div>
                      <h4 className="preview-title">{t.title}</h4>
                      <div className="preview-meta">
                        <span>Created by {t.createdBy?.name || 'Customer'}</span>
                        {t.dueDate && <span>&bull; Due: {t.dueDate}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="preview-right">
                    <span className={`badge badge-${t.priority?.toLowerCase()}`}>{t.priority}</span>
                    <span className={`badge badge-${t.status?.toLowerCase()}`}>{t.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Breakdown & Quick Actions */}
        <div className="dashboard-sidebar">
          <div className="card breakdown-card">
            <h3>Status Distribution</h3>
            <div className="progress-stacked">
              <div
                className="progress-bar bar-open"
                style={{ width: `${totalTasks > 0 ? (openTasks / totalTasks) * 100 : 0}%` }}
                title={`Open: ${openTasks}`}
              ></div>
              <div
                className="progress-bar bar-progress"
                style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                title={`In Progress: ${inProgressTasks}`}
              ></div>
              <div
                className="progress-bar bar-resolved"
                style={{ width: `${totalTasks > 0 ? (resolvedTasks / totalTasks) * 100 : 0}%` }}
                title={`Resolved: ${resolvedTasks}`}
              ></div>
            </div>

            <div className="legend-list">
              <div className="legend-item">
                <span className="legend-dot dot-open"></span>
                <span>Open ({openTasks})</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-progress"></span>
                <span>In Progress ({inProgressTasks})</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-resolved"></span>
                <span>Resolved ({resolvedTasks})</span>
              </div>
            </div>
          </div>

          <div className="card quick-actions-card">
            <h3>Quick Actions</h3>
            <div className="quick-buttons">
              <button className="quick-btn" onClick={onOpenCreateTask}>
                <span className="quick-icon">+</span>
                <span>Log Support Issue</span>
              </button>
              <button className="quick-btn" onClick={() => setActiveTab('assignments')}>
                <span className="quick-icon">&#x27A1;</span>
                <span>Dispatch / Assign Task</span>
              </button>
              <button className="quick-btn" onClick={() => setActiveTab('users')}>
                <span className="quick-icon">&#x1F464;</span>
                <span>Manage Users & Roles</span>
              </button>
              <button className="quick-btn" onClick={() => setActiveTab('logs')}>
                <span className="quick-icon">&#x1F4DC;</span>
                <span>View Audit Trail</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
