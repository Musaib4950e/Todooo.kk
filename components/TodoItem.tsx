
import React, { useState, useRef, useEffect } from 'react';
import { type Todo } from '../types';
import { CheckIcon, EditIcon, SaveIcon, TrashIcon } from './icons';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.text) {
      onEdit(todo.id, trimmedText);
    }
    if (!trimmedText) {
        setEditText(todo.text);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center p-4 group transition-colors duration-300 hover:bg-white/5">
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
          ${todo.completed
            ? 'border-purple-400 bg-purple-400'
            : 'border-white/30 group-hover:border-white/60'
          }`}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed && <CheckIcon />}
      </button>

      <div className="flex-grow mx-4">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-white text-lg focus:outline-none"
          />
        ) : (
          <p
            onDoubleClick={handleEdit}
            className={`text-lg transition-all duration-300 cursor-pointer ${
              todo.completed ? 'text-white/40 line-through' : 'text-white/90'
            }`}
          >
            {todo.text}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {isEditing ? (
             <button
                onClick={handleSave}
                className="text-white/70 hover:text-white"
                aria-label="Save task"
             >
                <SaveIcon />
             </button>
        ) : (
             <button
                onClick={handleEdit}
                className="text-white/70 hover:text-white"
                aria-label="Edit task"
             >
                <EditIcon />
             </button>
        )}

        <button
          onClick={() => onDelete(todo.id)}
          className="text-white/70 hover:text-red-400"
          aria-label="Delete task"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};
