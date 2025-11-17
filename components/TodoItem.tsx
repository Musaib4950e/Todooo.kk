import React, { useState, useRef, useEffect } from 'react';
import { type Todo, type Priority } from '../types';
import { CheckIcon, EditIcon, SaveIcon, TrashIcon, DragHandleIcon } from './icons';

interface TodoItemProps {
  todo: Todo;
  isDraggable: boolean;
  draggedId: string | null;
  dragOverId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onSetPriority: (id: string, priority: Priority) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDragOver: (id: string) => void;
  onDrop: (id: string) => void;
}

const priorityColorClasses = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
};

export const TodoItem: React.FC<TodoItemProps> = ({ 
    todo, 
    isDraggable,
    draggedId,
    dragOverId,
    onToggle, 
    onDelete, 
    onEdit,
    onSetPriority,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop
}) => {
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

  const cyclePriority = () => {
    const priorities: Priority[] = [null, 'low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(todo.priority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    onSetPriority(todo.id, priorities[nextIndex]);
  };

  const isBeingDragged = draggedId === todo.id;
  const isDragTarget = dragOverId === todo.id && draggedId !== todo.id;

  return (
    <div 
        draggable={isDraggable}
        onDragStart={() => isDraggable && onDragStart(todo.id)}
        onDragEnd={() => isDraggable && onDragEnd()}
        onDragOver={(e) => { e.preventDefault(); isDraggable && onDragOver(todo.id); }}
        onDrop={() => isDraggable && onDrop(todo.id)}
        className={`flex items-center justify-between p-4 group transition-all duration-300 hover:bg-white/5 
        ${isBeingDragged ? 'opacity-30' : 'opacity-100'}
        ${isDragTarget ? 'border-t-2 border-purple-400' : 'border-t-0 border-transparent'}
      `}>
        <div className="flex items-center gap-4 flex-grow min-w-0">
            <button
                onClick={cyclePriority}
                className={`flex-shrink-0 w-3 h-3 rounded-full transition-all duration-300 ${todo.priority ? priorityColorClasses[todo.priority] : 'border-2 border-white/30 group-hover:border-white/60'}`}
                aria-label="Cycle priority"
            ></button>
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

            <div className="flex-grow min-w-0">
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
                    className={`text-lg transition-all duration-300 cursor-pointer truncate ${
                    todo.completed ? 'text-white/40 line-through' : 'text-white/90'
                    }`}
                >
                    {todo.text}
                </p>
                )}
            </div>
        </div>


      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pl-4">
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

        {isDraggable && (
          <div className="text-white/50" title="Drag to reorder">
            <DragHandleIcon />
          </div>
        )}
      </div>
    </div>
  );
};
