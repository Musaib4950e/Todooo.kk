import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { type Todo, type Filter, type Priority } from './types';
import { TodoForm } from './components/TodoForm';
import { TodoItem } from './components/TodoItem';
import { TodoFilter } from './components/TodoFilter';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [isMounted, setIsMounted] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error("Failed to parse todos from localStorage", error);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if(isMounted) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isMounted]);

  const addTodo = useCallback((text: string, priority: Priority) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      createdAt: Date.now(),
    };
    setTodos(prevTodos => [newTodo, ...prevTodos]);
  }, []);

  const setTodoPriority = useCallback((id: string, priority: Priority) => {
     setTodos(prevTodos => 
        prevTodos.map(todo => todo.id === id ? { ...todo, priority } : todo)
     );
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  const editTodo = useCallback((id: string, text: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === id ? { ...todo, text } : todo))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  }, []);

  // Drag and Drop Handlers
  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };
  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };
  const handleDragOver = (id: string) => {
    if (id !== draggedId && id !== dragOverId) {
        setDragOverId(id);
    }
  };
  const handleDrop = (dropTargetId: string) => {
    if (!draggedId || draggedId === dropTargetId) {
      handleDragEnd();
      return;
    }

    setTodos(prevTodos => {
        const newTodos = [...prevTodos];
        const draggedItemIndex = newTodos.findIndex(t => t.id === draggedId);
        const dropTargetIndex = newTodos.findIndex(t => t.id === dropTargetId);

        if (draggedItemIndex === -1 || dropTargetIndex === -1) return prevTodos;

        const [removedItem] = newTodos.splice(draggedItemIndex, 1);
        newTodos.splice(dropTargetIndex, 0, removedItem);
        return newTodos;
    });

    handleDragEnd();
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        // When not filtering, use the stored order.
        return todos;
    }
  }, [todos, filter]);

  const activeCount = useMemo(() => todos.filter(todo => !todo.completed).length, [todos]);
  const completedCount = useMemo(() => todos.length - activeCount, [todos, activeCount]);
  const totalCount = todos.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isDraggable = filter === 'all';

  return (
    <div className="min-h-screen flex items-start justify-center p-4 selection:bg-purple-400 selection:text-white">
      <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-16">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <LogoIcon />
             <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">Prism</h1>
          </div>
          <p className="text-xl text-white/80 font-light hidden sm:block">Your Tasks, Crystal Clear</p>
        </header>

        {isMounted && totalCount > 0 && (
            <div className="w-full bg-black/20 rounded-full h-2 mb-4 overflow-hidden border border-white/10">
                <div 
                    className="bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 h-full rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        )}

        <main className="space-y-4">
            <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
                <TodoForm onAddTodo={addTodo} />
            </div>

            {isMounted && (
                <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 min-h-[64px]">
                    {todos.length > 0 && 
                        <TodoFilter
                            filter={filter}
                            onFilterChange={setFilter}
                            onClearCompleted={clearCompleted}
                            activeCount={activeCount}
                        />
                    }
                    <div className="divide-y divide-white/10">
                    {filteredTodos.map(todo => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            isDraggable={isDraggable}
                            draggedId={draggedId}
                            dragOverId={dragOverId}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onEdit={editTodo}
                            onSetPriority={setTodoPriority}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        />
                    ))}
                    {filteredTodos.length === 0 && (
                         <p className="text-center text-white/60 p-8">
                           {filter === 'completed' ? 'No completed tasks yet.' : 'No tasks here. Add one above!'}
                         </p>
                    )}
                    </div>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default App;
