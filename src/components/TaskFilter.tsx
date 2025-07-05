import React from 'react';
import { FilterType } from '../types/Task';

interface TaskFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    completed: number;
    pending: number;
  };
}

export const TaskFilter: React.FC<TaskFilterProps> = ({ activeFilter, onFilterChange, taskCounts }) => {
  const filters = [
    { key: 'all' as FilterType, label: 'All', count: taskCounts.all },
    { key: 'pending' as FilterType, label: 'Pending', count: taskCounts.pending },
    { key: 'completed' as FilterType, label: 'Completed', count: taskCounts.completed },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
            activeFilter === filter.key
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {filter.label}
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
            activeFilter === filter.key
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};