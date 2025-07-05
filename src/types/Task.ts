export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  username: string;
}

export type FilterType = 'all' | 'completed' | 'pending';
export type PriorityType = 'low' | 'medium' | 'high';