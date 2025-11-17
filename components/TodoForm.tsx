import React, { useState } from 'react';
import { PlusIcon } from './icons';
import { type Priority } from '../types';

interface TodoFormProps {
  onAddTodo: (text: string, priority: Priority) => void;
}

const priorityColorClasses = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
};

const priorityTooltips = {
    low: 'Low Priority',
    medium: 'Medium Priority',
    high: 'High Priority',
    null: 'Set Priority'
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText) {
      onAddTodo(trimmedText, priority);
      setText('');
      setPriority(null);
    }
  };

  const cyclePriority = () => {
    const priorities: Priority[] = [null, 'low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(priority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    setPriority(priorities[nextIndex]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-4">
       <button
        type="button"
        onClick={cyclePriority}
        className="flex-shrink-0 group relative rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Set priority"
      >
        <div className={`w-4 h-4 rounded-full transition-all duration-300 ${priority ? priorityColorClasses[priority] : 'border-2 border-white/50 group-hover:border-white'}`}></div>
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {priorityTooltips[priority || 'null']}
        </span>
      </button>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a new task..."
        className="w-full bg-transparent text-white placeholder:text-white/50 text-lg px-4 py-3 rounded-lg border-2 border-transparent focus:outline-none focus:border-white/30 transition-colors duration-300"
      />
      <button
        type="submit"
        className="flex-shrink-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:hover:bg-white/10"
        aria-label="Add task"
        disabled={!text.trim()}
      >
        <PlusIcon />
      </button>
    </form>
  );
};
