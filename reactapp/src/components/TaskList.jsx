import React, { useState } from 'react';
import './TaskList.css';

export default function TaskList({
  tasks,
  users,
  onOpenCreate,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onSelectTask,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [userFilter, setUserFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.createdBy?.name && t.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesUser = userFilter === 'ALL' || t.createdBy?.id === Number(userFilter);

    return matchesSearch && matchesStatus && matchesPriority && matchesUser;
  });

  const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  return (
    <div className="task-list-container">
      {/* Top Header & Actions */}
      <div className="task-header">
        <div>
          <h2>Support Tasks & Tickets</h2>
          <p className="task-header-desc">
            Showing {filteredTasks.length} of {tasks.length} total tasks
          </p>
        </div>
        <div className="task-header-actions">
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              Table
            </button>
            <button
              className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban Board View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="18"></rect>
                <rect x="14" y="3" width="7" height="18"></rect>
              </svg>
              Kanban
            </button>
          </div>

          <button className="btn btn-primary" onClick={onOpenCreate}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Task
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="task-filter-bar card">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by title, description, or creator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
            <option value="ALL">All Creators</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {(searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || userFilter !== 'ALL') && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
                setUserFilter('ALL');
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Content: Table View */}
      {viewMode === 'table' ? (
        <div className="task-table-wrapper card">
          <table className="task-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Task Title & Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Due Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-records">
                    No tasks found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="task-row">
                    <td className="task-id-cell">#{task.id}</td>
                    <td className="task-title-cell" onClick={() => onSelectTask(task)}>
                      <div className="title-text">{task.title}</div>
                      <div className="desc-preview">{task.description}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${task.priority?.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <select
                        className={`status-select status-${task.status?.toLowerCase()}`}
                        value={task.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className="creator-badge">{task.createdBy?.name || 'Customer'}</span>
                    </td>
                    <td>
                      <span className="date-badge">{task.dueDate || 'No Date'}</span>
                    </td>
                    <td className="task-actions-cell">
                      <button
                        className="action-icon-btn"
                        title="View Details & Comments"
                        onClick={() => onSelectTask(task)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button
                        className="action-icon-btn"
                        title="Edit Task"
                        onClick={() => onEditTask(task)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="action-icon-btn delete-btn"
                        title="Delete Task"
                        onClick={() => {
                          if (window.confirm(`Delete task #${task.id} (${task.title})?`)) {
                            onDeleteTask(task.id);
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
      ) : (
        /* Kanban Board View */
        <div className="kanban-board">
          {statuses.map((status) => {
            const columnTasks = filteredTasks.filter((t) => t.status === status);
            return (
              <div key={status} className="kanban-column">
                <div className="column-header">
                  <div className="column-title">
                    <span className={`status-indicator status-ind-${status.toLowerCase()}`}></span>
                    <h3>{status}</h3>
                  </div>
                  <span className="column-count">{columnTasks.length}</span>
                </div>

                <div className="column-cards">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="kanban-card"
                      onClick={() => onSelectTask(task)}
                    >
                      <div className="kanban-card-top">
                        <span className="kanban-id">#{task.id}</span>
                        <span className={`badge badge-${task.priority?.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </div>
                      <h4 className="kanban-title">{task.title}</h4>
                      <p className="kanban-desc">{task.description}</p>
                      <div className="kanban-card-footer">
                        <span className="kanban-creator">
                          {task.createdBy?.name || 'Customer'}
                        </span>
                        {task.dueDate && (
                          <span className="kanban-date">&#128197; {task.dueDate}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
