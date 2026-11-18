import React, { useState, useEffect } from 'react';
import './TaskModal.css';
import {
  fetchCommentsByTask,
  createComment,
  fetchLogsByTask,
  createAssignment,
  fetchAssignments,
} from '../services/api';

export default function TaskModal({
  mode, // 'create', 'edit', 'details'
  task,
  users,
  currentUser,
  onClose,
  onSave,
  onStatusChange,
}) {
  const [activeTab, setActiveTab] = useState('details');

  // Form fields
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'MEDIUM');
  const [status, setStatus] = useState(task?.status || 'OPEN');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [createdById, setCreatedById] = useState(task?.createdBy?.id || currentUser?.id || 1);

  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  // Status logs state
  const [statusLogs, setStatusLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Assignment state
  const [assignedUserId, setAssignedUserId] = useState('');
  const [assignedUser, setAssignedUser] = useState(null);

  useEffect(() => {
    if (task && mode === 'details') {
      loadTaskData();
    }
  }, [task, mode]);

  const loadTaskData = async () => {
    setLoadingComments(true);
    setLoadingLogs(true);
    try {
      const comms = await fetchCommentsByTask(task.id);
      setComments(comms || []);

      const logs = await fetchLogsByTask(task.id);
      setStatusLogs(logs || []);

      const allAssigns = await fetchAssignments();
      const currentAssign = allAssigns.find((a) => a.task?.id === task.id);
      if (currentAssign) {
        setAssignedUser(currentAssign.assignedUser);
        setAssignedUserId(currentAssign.assignedUser?.id || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingComments(false);
      setLoadingLogs(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      description,
      priority,
      status,
      dueDate: dueDate || null,
      createdBy: { id: Number(createdById) },
    };

    onSave(payload, task?.id);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !task) return;

    try {
      const commentPayload = {
        content: newComment,
        task: { id: task.id },
        user: { id: currentUser?.id || 1, name: currentUser?.name || 'Agent' },
      };
      const created = await createComment(commentPayload);
      setComments((prev) => [...prev, created]);
      setNewComment('');
    } catch (err) {
      alert('Failed to post comment');
    }
  };

  const handleAssignUser = async () => {
    if (!assignedUserId || !task) return;
    try {
      const selected = users.find((u) => u.id === Number(assignedUserId));
      await createAssignment({
        task: { id: task.id, title: task.title },
        assignedUser: { id: selected.id, name: selected.name, email: selected.email },
      });
      setAssignedUser(selected);
      alert(`Task successfully assigned to ${selected.name}`);
    } catch (err) {
      alert('Failed to assign user');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>
              {mode === 'create' && 'Create New Support Task'}
              {mode === 'edit' && `Edit Task #${task?.id}`}
              {mode === 'details' && `Task #${task?.id}: ${task?.title}`}
            </h3>
            {mode === 'details' && (
              <div className="modal-subtitle">
                <span>Created {task?.createdAt ? new Date(task.createdAt).toLocaleString() : 'Recently'}</span>
                <span> &bull; Creator: {task?.createdBy?.name || 'Customer'}</span>
              </div>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Details Mode Tabs */}
        {mode === 'details' && (
          <div className="modal-tabs">
            <button
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Comments ({comments.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              Audit History ({statusLogs.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'assignment' ? 'active' : ''}`}
              onClick={() => setActiveTab('assignment')}
            >
              Assignment
            </button>
          </div>
        )}

        {/* Content for Create / Edit */}
        {(mode === 'create' || mode === 'edit') && (
          <form onSubmit={handleFormSubmit} className="task-form">
            <div className="form-group">
              <label>Task Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Broken checkout button on mobile web"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="4"
                placeholder="Provide complete steps to reproduce, user impact, error codes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High (Urgent)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              {mode === 'create' && (
                <div className="form-group">
                  <label>Logged By (User)</label>
                  <select
                    value={createdById}
                    onChange={(e) => setCreatedById(e.target.value)}
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {mode === 'create' ? 'Create Task' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Content for Details Mode: Tab 1 Overview */}
        {mode === 'details' && activeTab === 'details' && (
          <div className="details-tab-content">
            <div className="details-badges">
              <span className={`badge badge-${task?.priority?.toLowerCase()}`}>
                Priority: {task?.priority}
              </span>
              <span className={`badge badge-${task?.status?.toLowerCase()}`}>
                Status: {task?.status}
              </span>
              {task?.dueDate && (
                <span className="badge badge-role-user">&#128197; Due: {task.dueDate}</span>
              )}
            </div>

            <div className="details-section">
              <h4>Description</h4>
              <p className="details-description">
                {task?.description || 'No description provided.'}
              </p>
            </div>

            <div className="details-status-control card">
              <label>Update Status Immediately:</label>
              <div className="status-button-group">
                {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
                  <button
                    key={st}
                    className={`btn btn-sm ${task?.status === st ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onStatusChange(task.id, st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content for Details Mode: Tab 2 Comments */}
        {mode === 'details' && activeTab === 'comments' && (
          <div className="comments-tab-content">
            <div className="comment-list">
              {loadingComments ? (
                <p className="loading-text">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="empty-subtext">No comments yet. Start the conversation below.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{c.user?.name || 'Support Agent'}</span>
                      <span className="comment-time">
                        {c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <div className="comment-body">{c.content}</div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                rows="2"
                required
                placeholder={`Post update as ${currentUser?.name || 'Active User'}...`}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button type="submit" className="btn btn-primary btn-sm">
                Post Comment
              </button>
            </form>
          </div>
        )}

        {/* Content for Details Mode: Tab 3 Status History */}
        {mode === 'details' && activeTab === 'logs' && (
          <div className="logs-tab-content">
            {loadingLogs ? (
              <p className="loading-text">Loading audit timeline...</p>
            ) : statusLogs.length === 0 ? (
              <p className="empty-subtext">No status transitions recorded for this task.</p>
            ) : (
              <div className="timeline">
                {statusLogs.map((log) => (
                  <div key={log.id} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="timeline-user">{log.changedByUser?.name || 'System / Agent'}</span>
                        <span className="timeline-date">
                          {log.changedAt ? new Date(log.changedAt).toLocaleString() : ''}
                        </span>
                      </div>
                      <div className="timeline-transition">
                        Changed status from <span className="old-st">{log.oldStatus}</span> to{' '}
                        <span className="new-st">{log.newStatus}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content for Details Mode: Tab 4 Assignment */}
        {mode === 'details' && activeTab === 'assignment' && (
          <div className="assignment-tab-content">
            <div className="current-assignment card">
              <h4>Current Assignee</h4>
              {assignedUser ? (
                <div className="assigned-agent-info">
                  <div className="agent-avatar">{assignedUser.name[0]}</div>
                  <div>
                    <div className="agent-name">{assignedUser.name}</div>
                    <div className="agent-email">{assignedUser.email}</div>
                  </div>
                </div>
              ) : (
                <p className="empty-subtext">No agent currently assigned to this task.</p>
              )}
            </div>

            <div className="reassign-section">
              <h4>Assign / Reassign to Team Member</h4>
              <div className="assign-controls">
                <select
                  value={assignedUserId}
                  onChange={(e) => setAssignedUserId(e.target.value)}
                >
                  <option value="">Select Support Agent or Admin...</option>
                  {users
                    .filter((u) => u.role === 'SUPPORT_AGENT' || u.role === 'ADMIN')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAssignUser}
                  disabled={!assignedUserId}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
