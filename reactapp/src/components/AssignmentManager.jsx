import React, { useState } from 'react';
import './AssignmentManager.css';

export default function AssignmentManager({
  assignments,
  tasks,
  users,
  onAssignTask,
}) {
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [agentFilter, setAgentFilter] = useState('ALL');

  const agents = users.filter((u) => u.role === 'SUPPORT_AGENT' || u.role === 'ADMIN');

  const filteredAssignments = assignments.filter((a) => {
    return agentFilter === 'ALL' || a.assignedUser?.id === Number(agentFilter);
  });

  const handleAssign = (e) => {
    e.preventDefault();
    if (!selectedTask || !selectedUser) return;

    const taskObj = tasks.find((t) => t.id === Number(selectedTask));
    const userObj = users.find((u) => u.id === Number(selectedUser));

    if (taskObj && userObj) {
      onAssignTask({
        task: { id: taskObj.id, title: taskObj.title },
        assignedUser: { id: userObj.id, name: userObj.name, email: userObj.email },
      });
      setSelectedTask('');
      setSelectedUser('');
    }
  };

  return (
    <div className="assignment-manager-container">
      <div className="assignment-header">
        <div>
          <h2>Task Dispatch & Assignments</h2>
          <p className="assignment-desc">Distribute support workload among agents and track active responsibilities</p>
        </div>
      </div>

      {/* New Assignment Dispatch Card */}
      <div className="card dispatch-card">
        <h3>Dispatch Task to Support Agent</h3>
        <form onSubmit={handleAssign} className="dispatch-form">
          <div className="dispatch-field">
            <label>Select Task</label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              required
            >
              <option value="">-- Choose a Task --</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  #{t.id} - {t.title} ({t.priority} / {t.status})
                </option>
              ))}
            </select>
          </div>

          <div className="dispatch-field">
            <label>Assign to Agent</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">-- Choose Support Agent --</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.role})
                </option>
              ))}
            </select>
          </div>

          <div className="dispatch-btn-wrap">
            <button type="submit" className="btn btn-primary" disabled={!selectedTask || !selectedUser}>
              Assign Task
            </button>
          </div>
        </form>
      </div>

      {/* Agent Workload Cards */}
      <div className="workload-section">
        <h3>Agent Workload Breakdown</h3>
        <div className="agent-cards-grid">
          {agents.map((ag) => {
            const count = assignments.filter((a) => a.assignedUser?.id === ag.id).length;
            return (
              <div
                key={ag.id}
                className={`agent-card ${agentFilter === String(ag.id) ? 'active' : ''}`}
                onClick={() => setAgentFilter(agentFilter === String(ag.id) ? 'ALL' : String(ag.id))}
              >
                <div className="agent-card-header">
                  <div className="agent-avatar">{ag.name[0]}</div>
                  <div>
                    <div className="agent-card-name">{ag.name}</div>
                    <div className="agent-card-role">{ag.role}</div>
                  </div>
                </div>
                <div className="agent-task-count">
                  <span className="count-num">{count}</span>
                  <span className="count-label">Assigned Tasks</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Assignments Table */}
      <div className="assignment-table-card card">
        <div className="table-header-row">
          <h3>Active Assignments ({filteredAssignments.length})</h3>
          {agentFilter !== 'ALL' && (
            <button className="btn btn-secondary btn-sm" onClick={() => setAgentFilter('ALL')}>
              Clear Agent Filter
            </button>
          )}
        </div>

        <table className="assignment-table">
          <thead>
            <tr>
              <th>Assignment ID</th>
              <th>Task</th>
              <th>Assigned Agent</th>
              <th>Assignment Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-records">
                  No assignments found. Use the dispatch form above to assign tasks.
                </td>
              </tr>
            ) : (
              filteredAssignments.map((as) => (
                <tr key={as.id}>
                  <td className="assign-id">#{as.id}</td>
                  <td>
                    <div className="assign-task-title">{as.task?.title || `Task #${as.task?.id}`}</div>
                    <div className="assign-task-id">ID: #{as.task?.id}</div>
                  </td>
                  <td>
                    <div className="assignee-info">
                      <span className="assignee-name">{as.assignedUser?.name || 'Agent'}</span>
                      <span className="assignee-email">{as.assignedUser?.email}</span>
                    </div>
                  </td>
                  <td className="assign-time">
                    {as.assignedAt ? new Date(as.assignedAt).toLocaleString() : 'Recently'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
