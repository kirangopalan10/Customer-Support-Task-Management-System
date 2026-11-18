// API service communicating with Spring Boot backend (/api)
// Includes mock fallback so UI is immediately usable even if backend is starting or offline

const API_BASE = '/api';

// Initial mock data for offline / fallback mode
const INITIAL_USERS = [
  { id: 1, name: 'Alice Walker', email: 'alice.walker@support.com', role: 'ADMIN' },
  { id: 2, name: 'John Smith', email: 'john.smith@support.com', role: 'SUPPORT_AGENT' },
  { id: 3, name: 'Emma Davis', email: 'emma.davis@support.com', role: 'SUPPORT_AGENT' },
  { id: 4, name: 'Michael Brown', email: 'michael.b@client.com', role: 'CUSTOMER' },
  { id: 5, name: 'Sophia Wilson', email: 'sophia.w@client.com', role: 'USER' },
];

const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Payment Gateway Timeout on Checkout',
    description: 'Customers are receiving 504 Gateway Timeout when trying to process Stripe transactions.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    dueDate: '2026-11-20',
    createdAt: '2026-11-17T10:30:00',
    createdBy: { id: 4, name: 'Michael Brown', email: 'michael.b@client.com', role: 'CUSTOMER' },
  },
  {
    id: 2,
    title: 'Update Password Reset Email Template',
    description: 'Revise copy and add brand logo according to the new winter marketing guidelines.',
    priority: 'LOW',
    status: 'OPEN',
    dueDate: '2026-11-25',
    createdAt: '2026-11-18T09:15:00',
    createdBy: { id: 1, name: 'Alice Walker', email: 'alice.walker@support.com', role: 'ADMIN' },
  },
  {
    id: 3,
    title: 'Mobile App Crash on Profile Photo Upload',
    description: 'iOS users on version 14.2 report instant crash when selecting HEIC images from gallery.',
    priority: 'HIGH',
    status: 'OPEN',
    dueDate: '2026-11-19',
    createdAt: '2026-11-18T11:00:00',
    createdBy: { id: 5, name: 'Sophia Wilson', email: 'sophia.w@client.com', role: 'USER' },
  },
  {
    id: 4,
    title: 'Invoice PDF Download Link Broken',
    description: 'Clicking download invoice in billing history opens a 404 page.',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    dueDate: '2026-11-16',
    createdAt: '2026-11-15T14:20:00',
    createdBy: { id: 4, name: 'Michael Brown', email: 'michael.b@client.com', role: 'CUSTOMER' },
  },
];

const INITIAL_ASSIGNMENTS = [
  {
    id: 1,
    assignedAt: '2026-11-17T11:00:00',
    task: { id: 1, title: 'Payment Gateway Timeout on Checkout' },
    assignedUser: { id: 2, name: 'John Smith', email: 'john.smith@support.com' },
  },
  {
    id: 2,
    assignedAt: '2026-11-18T09:30:00',
    task: { id: 2, title: 'Update Password Reset Email Template' },
    assignedUser: { id: 3, name: 'Emma Davis', email: 'emma.davis@support.com' },
  },
];

const INITIAL_LOGS = [
  {
    id: 1,
    oldStatus: 'OPEN',
    newStatus: 'IN_PROGRESS',
    changedAt: '2026-11-17T11:05:00',
    task: { id: 1, title: 'Payment Gateway Timeout on Checkout' },
    changedByUser: { id: 2, name: 'John Smith' },
  },
  {
    id: 2,
    oldStatus: 'IN_PROGRESS',
    newStatus: 'RESOLVED',
    changedAt: '2026-11-16T16:45:00',
    task: { id: 4, title: 'Invoice PDF Download Link Broken' },
    changedByUser: { id: 3, name: 'Emma Davis' },
  },
];

const INITIAL_COMMENTS = [
  {
    id: 1,
    content: 'Investigating API logs from Stripe webhook. Seems like rate limiting is triggered.',
    createdAt: '2026-11-17T11:30:00',
    task: { id: 1 },
    user: { id: 2, name: 'John Smith' },
  },
  {
    id: 2,
    content: 'Patch deployed to production. Testing with sample invoices now.',
    createdAt: '2026-11-16T16:30:00',
    task: { id: 4 },
    user: { id: 3, name: 'Emma Davis' },
  },
];

// Local storage helpers to persist mock data when working offline
const loadMock = (key, fallback) => {
  try {
    const data = localStorage.getItem(`cstms_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const saveMock = (key, data) => {
  try {
    localStorage.setItem(`cstms_${key}`, JSON.stringify(data));
  } catch (e) {}
};

let mockUsers = loadMock('users', INITIAL_USERS);
let mockTasks = loadMock('tasks', INITIAL_TASKS);
let mockAssignments = loadMock('assignments', INITIAL_ASSIGNMENTS);
let mockLogs = loadMock('logs', INITIAL_LOGS);
let mockComments = loadMock('comments', INITIAL_COMMENTS);

// Backend health check state
let isBackendAvailable = null;

export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/users`, { method: 'GET', signal: AbortSignal.timeout(1500) });
    isBackendAvailable = res.ok || res.status === 204;
    return isBackendAvailable;
  } catch (e) {
    isBackendAvailable = false;
    return false;
  }
};

export const getBackendStatus = () => isBackendAvailable;

// Generic fetch wrapper with fallback
const apiRequest = async (url, options = {}, mockHandler) => {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    if (!res.ok && res.status !== 204) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    if (res.status === 204) return [];
    isBackendAvailable = true;
    return await res.json();
  } catch (err) {
    isBackendAvailable = false;
    if (mockHandler) {
      return mockHandler();
    }
    throw err;
  }
};

// ================= USER APIS =================
export const fetchUsers = () =>
  apiRequest('/users', {}, () => [...mockUsers]);

export const fetchUserById = (id) =>
  apiRequest(`/users/${id}`, {}, () => {
    const u = mockUsers.find((x) => x.id === Number(id));
    if (!u) throw new Error('User not found');
    return u;
  });

export const createUser = (userData) =>
  apiRequest(
    '/users',
    { method: 'POST', body: JSON.stringify(userData) },
    () => {
      const newUser = { id: Date.now(), ...userData };
      mockUsers.push(newUser);
      saveMock('users', mockUsers);
      return newUser;
    }
  );

export const updateUser = (id, userData) =>
  apiRequest(
    `/users/${id}`,
    { method: 'PUT', body: JSON.stringify(userData) },
    () => {
      const idx = mockUsers.findIndex((x) => x.id === Number(id));
      if (idx === -1) throw new Error('User not found');
      mockUsers[idx] = { ...mockUsers[idx], ...userData, id: Number(id) };
      saveMock('users', mockUsers);
      return mockUsers[idx];
    }
  );

export const deleteUser = (id) =>
  apiRequest(
    `/users/${id}`,
    { method: 'DELETE' },
    () => {
      mockUsers = mockUsers.filter((x) => x.id !== Number(id));
      saveMock('users', mockUsers);
      return true;
    }
  );

export const fetchUsersByRole = (role) =>
  apiRequest(`/users/role/${role}`, {}, () =>
    mockUsers.filter((x) => x.role === role)
  );

export const fetchUsersPaginated = (page, size) =>
  apiRequest(`/users/page/${page}/${size}`, {}, () => {
    const start = page * size;
    const content = mockUsers.slice(start, start + size);
    return {
      content,
      totalElements: mockUsers.length,
      totalPages: Math.ceil(mockUsers.length / size),
      pageable: { pageNumber: page, pageSize: size },
    };
  });

// ================= TASK APIS =================
export const fetchTasks = () =>
  apiRequest('/tasks', {}, () => [...mockTasks]);

export const fetchTaskById = (id) =>
  apiRequest(`/tasks/${id}`, {}, () => {
    const t = mockTasks.find((x) => x.id === Number(id));
    if (!t) throw new Error('Task not found');
    return t;
  });

export const createTask = (taskData) =>
  apiRequest(
    '/tasks',
    { method: 'POST', body: JSON.stringify(taskData) },
    () => {
      const newTask = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: taskData.status || 'OPEN',
        priority: taskData.priority || 'MEDIUM',
        ...taskData,
      };
      mockTasks.unshift(newTask);
      saveMock('tasks', mockTasks);
      return newTask;
    }
  );

export const updateTask = (id, taskData) =>
  apiRequest(
    `/tasks/${id}`,
    { method: 'PUT', body: JSON.stringify(taskData) },
    () => {
      const idx = mockTasks.findIndex((x) => x.id === Number(id));
      if (idx === -1) throw new Error('Task not found');
      mockTasks[idx] = { ...mockTasks[idx], ...taskData, id: Number(id) };
      saveMock('tasks', mockTasks);
      return mockTasks[idx];
    }
  );

export const deleteTask = (id) =>
  apiRequest(
    `/tasks/${id}`,
    { method: 'DELETE' },
    () => {
      mockTasks = mockTasks.filter((x) => x.id !== Number(id));
      saveMock('tasks', mockTasks);
      return true;
    }
  );

export const updateTaskStatus = (id, newStatus, currentUserId = 1) =>
  apiRequest(
    `/tasks/${id}/status?status=${encodeURIComponent(newStatus)}`,
    { method: 'PUT' },
    () => {
      const task = mockTasks.find((x) => x.id === Number(id));
      if (!task) throw new Error('Task not found');
      const oldStatus = task.status;
      task.status = newStatus;
      saveMock('tasks', mockTasks);

      // automatically log status change
      const log = {
        id: Date.now(),
        oldStatus,
        newStatus,
        changedAt: new Date().toISOString(),
        task: { id: task.id, title: task.title },
        changedByUser: mockUsers.find((u) => u.id === currentUserId) || { id: 1, name: 'Admin' },
      };
      mockLogs.unshift(log);
      saveMock('logs', mockLogs);

      return task;
    }
  );

export const fetchTasksByUser = (userId) =>
  apiRequest(`/tasks/user/${userId}`, {}, () =>
    mockTasks.filter((x) => x.createdBy?.id === Number(userId))
  );

export const fetchTasksByStatus = (status) =>
  apiRequest(`/tasks/status/${status}`, {}, () =>
    mockTasks.filter((x) => x.status === status)
  );

// ================= ASSIGNMENT APIS =================
export const fetchAssignments = () =>
  apiRequest('/assignments', {}, () => [...mockAssignments]);

export const fetchAssignmentsByUser = (userId) =>
  apiRequest(`/assignments/user/${userId}`, {}, () =>
    mockAssignments.filter((x) => x.assignedUser?.id === Number(userId))
  );

export const createAssignment = (assignmentData) =>
  apiRequest(
    '/assignments',
    { method: 'POST', body: JSON.stringify(assignmentData) },
    () => {
      const newAssign = {
        id: Date.now(),
        assignedAt: new Date().toISOString(),
        ...assignmentData,
      };
      mockAssignments.unshift(newAssign);
      saveMock('assignments', mockAssignments);
      return newAssign;
    }
  );

// ================= STATUS LOG APIS =================
export const fetchStatusLogs = () =>
  apiRequest('/status-logs', {}, () => [...mockLogs]);

export const fetchLogsByTask = (taskId) =>
  apiRequest(`/status-logs/task/${taskId}`, {}, () =>
    mockLogs.filter((x) => x.task?.id === Number(taskId))
  );

export const createStatusLog = (logData) =>
  apiRequest(
    '/status-logs',
    { method: 'POST', body: JSON.stringify(logData) },
    () => {
      const newLog = {
        id: Date.now(),
        changedAt: new Date().toISOString(),
        ...logData,
      };
      mockLogs.unshift(newLog);
      saveMock('logs', mockLogs);
      return newLog;
    }
  );

// ================= COMMENT APIS =================
export const fetchComments = () =>
  apiRequest('/comments', {}, () => [...mockComments]);

export const fetchCommentsByTask = (taskId) =>
  apiRequest('/comments', {}, () =>
    mockComments.filter((c) => c.task?.id === Number(taskId))
  );

export const createComment = (commentData) =>
  apiRequest(
    '/comments',
    { method: 'POST', body: JSON.stringify(commentData) },
    () => {
      const newComment = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...commentData,
      };
      mockComments.push(newComment);
      saveMock('comments', mockComments);
      return newComment;
    }
  );
