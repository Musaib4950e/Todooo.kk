
import React, { useState } from 'react';
import { PlusIcon } from './icons';

interface TodoFormProps {
  onAddTodo: (text: string) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText) {
      onAddTodo(trimmedText);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
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
