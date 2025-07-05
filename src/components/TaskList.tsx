import React from 'react';
import { Task, FilterType } from '../types/Task';
import { TaskItem } from './TaskItem';
import { CheckCircle, Clock, List, Frown } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  searchTerm: string;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  searchTerm,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
}) => {
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'completed' && task.completed) ||
      (filter === 'pending' && !task.completed);

    const matchesSearch = 
      searchTerm === '' ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getEmptyStateContent = () => {
    if (searchTerm) {
      return {
        icon: <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />,
        title: 'No tasks found',
        message: `No tasks match your search for "${searchTerm}". Try adjusting your search terms.`,
      };
    }

    switch (filter) {
      case 'completed':
        return {
          icon: <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />,
          title: 'No completed tasks',
          message: 'Complete some tasks to see them here!',
        };
      case 'pending':
        return {
          icon: <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />,
          title: 'No pending tasks',
          message: 'Great job! You have no pending tasks.',
        };
      default:
        return {
          icon: <List className="w-16 h-16 text-gray-400 mx-auto mb-4" />,
          title: 'No tasks yet',
          message: 'Create your first task to get started with managing your daily activities!',
        };
    }
  };

  if (filteredTasks.length === 0) {
    const emptyState = getEmptyStateContent();
    return (
      <div className="text-center py-12">
        {emptyState.icon}
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          {emptyState.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {emptyState.message}
        </p>
      </div>
    );
  }

  // Sort tasks: incomplete tasks first, then by priority (high to low), then by due date, then by creation date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First, sort by completion status (incomplete first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Then by priority (high to low)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then by due date (sooner first, tasks without due date last)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    // Finally by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
        />
      ))}
    </div>
  );
};