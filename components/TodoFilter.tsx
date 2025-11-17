
import React from 'react';
import { type Filter } from '../types';

interface TodoFilterProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
  activeCount: number;
}

const FilterButton: React.FC<{
  currentFilter: Filter;
  filter: Filter;
  onClick: (filter: Filter) => void;
  children: React.ReactNode;
}> = ({ currentFilter, filter, onClick, children }) => {
  const isActive = currentFilter === filter;
  return (
    <button
      onClick={() => onClick(filter)}
      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-300 ${
        isActive ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
};

export const TodoFilter: React.FC<TodoFilterProps> = ({
  filter,
  onFilterChange,
  onClearCompleted,
  activeCount,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10 text-sm text-white/60">
      <span>{activeCount} {activeCount === 1 ? 'item' : 'items'} left</span>
      <div className="flex items-center space-x-2">
        <FilterButton currentFilter={filter} filter="all" onClick={onFilterChange}>All</FilterButton>
        <FilterButton currentFilter={filter} filter="active" onClick={onFilterChange}>Active</FilterButton>
        <FilterButton currentFilter={filter} filter="completed" onClick={onFilterChange}>Completed</FilterButton>
      </div>
      <button
        onClick={onClearCompleted}
        className="hover:text-white transition-colors duration-300"
      >
        Clear completed
      </button>
    </div>
  );
};
