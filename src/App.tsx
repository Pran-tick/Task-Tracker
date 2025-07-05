import React, { useState, useEffect } from 'react';
import { Task, FilterType } from './types/Task';
import { loadTasks, saveTasks, loadUser, clearUser } from './utils/localStorage';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { TaskFilter } from './components/TaskFilter';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { Plus } from 'lucide-react';

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark-mode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const savedUser = loadUser();
    if (savedUser) {
      setUser(savedUser.username);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const savedTasks = loadTasks();
      setTasks(savedTasks);
    }
  }, [user]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('dark-mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = (username: string) => {
    setUser(username);
  };

  const handleLogout = () => {
    clearUser();
    setUser(null);
    setTasks([]);
    setFilter('all');
    setSearchTerm('');
    setShowTaskForm(false);
  };

  const handleAddTask = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const getTaskCounts = () => {
    const all = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = tasks.filter((task) => !task.completed).length;
    return { all, completed, pending };
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header
        username={user}
        darkMode={darkMode}
        onLogout={handleLogout}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your tasks and stay productive
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              {!showTaskForm ? (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Task
                </button>
              ) : (
                <TaskForm
                  onAddTask={handleAddTask}
                  onClose={() => setShowTaskForm(false)}
                />
              )}
            </div>
          </div>

          {/* Task List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <div className="space-y-4">
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              <TaskFilter
                activeFilter={filter}
                onFilterChange={setFilter}
                taskCounts={getTaskCounts()}
              />
            </div>

            {/* Tasks */}
            <TaskList
              tasks={tasks}
              filter={filter}
              searchTerm={searchTerm}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          </div>
        </div>
      </main>

      {/* Mobile Add Button */}
      <button
        onClick={() => setShowTaskForm(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Mobile Task Form Modal */}
      {showTaskForm && (
        <div className="lg:hidden">
          <TaskForm
            onAddTask={handleAddTask}
            onClose={() => setShowTaskForm(false)}
            isModal={true}
          />
        </div>
      )}
    </div>
  );
}

export default App;