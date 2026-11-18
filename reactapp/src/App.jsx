import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import UserManager from './components/UserManager';
import AssignmentManager from './components/AssignmentManager';
import StatusLogs from './components/StatusLogs';
import Toast from './components/Toast';
import './App.css';
import {
  fetchTasks,
  fetchUsers,
  fetchAssignments,
  fetchStatusLogs,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  createUser,
  updateUser,
  deleteUser,
  createAssignment,
  checkBackendHealth,
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendOnline, setBackendOnline] = useState(false);

  // Core Data Lists
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [statusLogs, setStatusLogs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit' | 'details'
    task: null,
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load Initial Data
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    const isOnline = await checkBackendHealth();
    setBackendOnline(isOnline);

    try {
      const [uList, tList, aList, lList] = await Promise.all([
        fetchUsers(),
        fetchTasks(),
        fetchAssignments(),
        fetchStatusLogs(),
      ]);

      setUsers(uList || []);
      setTasks(tList || []);
      setAssignments(aList || []);
      setStatusLogs(lList || []);

      if (uList && uList.length > 0) {
        setCurrentUser(uList[0]);
      }
    } catch (err) {
      console.error('Initialization error:', err);
    }
  };

  // ================= TASK HANDLERS =================
  const handleOpenCreateTask = () => {
    setModalState({ isOpen: true, mode: 'create', task: null });
  };

  const handleEditTask = (task) => {
    setModalState({ isOpen: true, mode: 'edit', task });
  };

  const handleSelectTask = (task) => {
    setModalState({ isOpen: true, mode: 'details', task });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: 'create', task: null });
  };

  const handleSaveTask = async (taskData, id) => {
    try {
      if (id) {
        const updated = await updateTask(id, taskData);
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
        addToast(`Task #${id} updated successfully!`);
      } else {
        const created = await createTask(taskData);
        setTasks((prev) => [created, ...prev]);
        addToast('New task created successfully!');
      }
      handleCloseModal();
    } catch (err) {
      addToast('Failed to save task: ' + err.message, 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      addToast(`Task #${taskId} deleted successfully.`);
      if (modalState.isOpen && modalState.task?.id === taskId) {
        handleCloseModal();
      }
    } catch (err) {
      addToast('Failed to delete task', 'error');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updated = await updateTaskStatus(taskId, newStatus, currentUser?.id || 1);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      if (modalState.task && modalState.task.id === taskId) {
        setModalState((prev) => ({ ...prev, task: { ...prev.task, status: newStatus } }));
      }
      // Refresh status logs
      const updatedLogs = await fetchStatusLogs();
      setStatusLogs(updatedLogs);

      addToast(`Task #${taskId} status changed to ${newStatus}`);
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  // ================= USER HANDLERS =================
  const handleAddUser = async (userData) => {
    try {
      const created = await createUser(userData);
      setUsers((prev) => [...prev, created]);
      addToast(`User ${created.name} added successfully!`);
    } catch (err) {
      addToast('Failed to create user', 'error');
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      const updated = await updateUser(id, userData);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
      if (currentUser?.id === id) {
        setCurrentUser((prev) => ({ ...prev, ...updated }));
      }
      addToast(`User ${updated.name} updated successfully.`);
    } catch (err) {
      addToast('Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      addToast('User removed.');
    } catch (err) {
      addToast('Failed to delete user', 'error');
    }
  };

  // ================= ASSIGNMENT HANDLERS =================
  const handleAssignTask = async (assignmentPayload) => {
    try {
      const created = await createAssignment(assignmentPayload);
      setAssignments((prev) => [created, ...prev]);
      addToast(`Task assigned to ${assignmentPayload.assignedUser?.name}!`);
    } catch (err) {
      addToast('Failed to dispatch assignment', 'error');
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendOnline={backendOnline}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        users={users}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            tasks={tasks}
            users={users}
            setActiveTab={setActiveTab}
            onSelectTask={handleSelectTask}
            onOpenCreateTask={handleOpenCreateTask}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskList
            tasks={tasks}
            users={users}
            onOpenCreate={handleOpenCreateTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onSelectTask={handleSelectTask}
          />
        )}

        {activeTab === 'users' && (
          <UserManager
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentManager
            assignments={assignments}
            tasks={tasks}
            users={users}
            onAssignTask={handleAssignTask}
          />
        )}

        {activeTab === 'logs' && (
          <StatusLogs logs={statusLogs} tasks={tasks} />
        )}
      </main>

      {/* Task Modal (Create, Edit, Details & Comments) */}
      {modalState.isOpen && (
        <TaskModal
          mode={modalState.mode}
          task={modalState.task}
          users={users}
          currentUser={currentUser}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
