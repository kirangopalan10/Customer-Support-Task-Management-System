import React, { useState } from 'react';
import './StatusLogs.css';

export default function StatusLogs({ logs, tasks }) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [taskFilter, setTaskFilter] = useState('ALL');

  const filteredLogs = logs.filter((l) => {
    const matchesStatus = statusFilter === 'ALL' || l.oldStatus === statusFilter || l.newStatus === statusFilter;
    const matchesTask = taskFilter === 'ALL' || l.task?.id === Number(taskFilter);
    return matchesStatus && matchesTask;
  });

  return (
    <div className="status-logs-container">
      <div className="status-logs-header">
        <div>
          <h2>Audit & Status Transition Logs</h2>
          <p className="logs-desc">Chronological history of ticket status modifications for compliance & SLA tracking</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="logs-filter-bar card">
        <div className="filter-item">
          <label>Filter by Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div className="filter-item">
          <label>Filter by Task:</label>
          <select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)}>
            <option value="ALL">All Tasks</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                #{t.id} - {t.title}
              </option>
            ))}
          </select>
        </div>

        {(statusFilter !== 'ALL' || taskFilter !== 'ALL') && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setStatusFilter('ALL');
              setTaskFilter('ALL');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Audit Log Cards / Feed */}
      <div className="logs-feed card">
        {filteredLogs.length === 0 ? (
          <div className="no-records">No status log records matching your filter.</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="log-row">
              <div className="log-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"></path>
                </svg>
              </div>

              <div className="log-details">
                <div className="log-title-row">
                  <span className="log-task-name">
                    {log.task?.title || `Task #${log.task?.id}`}
                  </span>
                  <span className="log-task-id">#{log.task?.id}</span>
                </div>

                <div className="log-transition-pill">
                  <span className={`badge badge-${log.oldStatus?.toLowerCase()}`}>
                    {log.oldStatus}
                  </span>
                  <span className="arrow-sym">&rarr;</span>
                  <span className={`badge badge-${log.newStatus?.toLowerCase()}`}>
                    {log.newStatus}
                  </span>
                </div>

                <div className="log-meta">
                  <span>Updated by <strong>{log.changedByUser?.name || 'Support Agent'}</strong></span>
                  <span>&bull;</span>
                  <span>{log.changedAt ? new Date(log.changedAt).toLocaleString() : 'Recently'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
